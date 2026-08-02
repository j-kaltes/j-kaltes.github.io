/*Example of reading a html table with c++. 
The same as meals = Import["http:/127.0.0.1:17580/x/meals?days=6", "Data"] in Mathematica.

std::string url="http://127.0.0.1:17580/x/meals?days=6";
auto meals=read_html_tables(url);
This returns all tables in url.
One can iterate through meals which consists of columns inside rows as shown in the function process.

read_html_tables can generally be used for reading html tables.

Compile it with:
 g++ -O3 -std=c++26 read_html_tables.cpp  $(pkg-config --cflags --libs libcurl libxml-2.0)  -o read_html_tables

(Or use clang++ instead of g++).

To test it out, run something like:
./read_html_tables "http://127.0.0.1:17580/x/meals?days=6"
or
./read_html_tables "https://www.worldometers.info/demographics/life-expectancy"


Made by GPT-5.6 Sol on request of Jaap Korthals Altes

GPL-3.0 license
*/


#include <curl/curl.h>

#include <libxml/HTMLparser.h>
#include <libxml/parser.h>
#include <libxml/xmlversion.h>

#include <algorithm>
#include <cctype>
#include <climits>
#include <cstddef>
#include <deque>
#include <exception>
#include <filesystem>
#include <generator>
#include <iostream>
#include <limits>
#include <memory>
#include <stdexcept>
#include <string>
#include <string_view>
#include <system_error>
#include <utility>
#include <vector>

using Row = std::vector<std::string>;
using Table = std::vector<Row>;

namespace {

std::string normalize_space(std::string_view text)
{
    std::string result;
    result.reserve(text.size());

    bool pending_space = false;

    for (unsigned char c : text) {
        if (std::isspace(c)) {
            pending_space = !result.empty();
        } else {
            if (pending_space) {
                result.push_back(' ');
            }

            result.push_back(static_cast<char>(c));
            pending_space = false;
        }
    }

    return result;
}

bool is_name(const xmlChar* name, const char* expected)
{
    return name != nullptr &&
           xmlStrEqual(
               name,
               reinterpret_cast<const xmlChar*>(expected)
           );
}

struct TableBuilder {
    Table table;
    Row row;
    std::string cell;

    bool row_open = false;
    bool cell_open = false;

    void finish_cell()
    {
        if (!cell_open) {
            return;
        }

        row.push_back(normalize_space(cell));
        cell.clear();
        cell_open = false;
    }

    void finish_row()
    {
        if (!row_open) {
            return;
        }

        finish_cell();
        table.push_back(std::move(row));
        row.clear();
        row_open = false;
    }

    Table finish_table()
    {
        finish_row();
        return std::move(table);
    }
};

struct StreamState {
    CURL* easy = nullptr;
    htmlParserCtxtPtr parser = nullptr;

    // Bytes received from libcurl but not yet fully supplied to libxml2.
    std::string input;
    std::size_t input_position = 0;

    // One builder per active <table>; this also handles nested tables.
    std::vector<TableBuilder> builders;

    // Completed tables waiting to be yielded.
    std::deque<Table> ready;

    std::exception_ptr failure;

    bool curl_paused = false;
    bool parser_finished = false;
};

template<class Function>
void sax_guard(StreamState& state, Function&& function) noexcept
{
    if (state.failure) {
        return;
    }

    try {
        std::forward<Function>(function)();
    } catch (...) {
        state.failure = std::current_exception();
    }
}

void sax_start_element(
    void* context,
    const xmlChar* name,
    const xmlChar**
) noexcept
{
    auto& state = *static_cast<StreamState*>(context);

    sax_guard(state, [&] {
        if (is_name(name, "table")) {
            state.builders.emplace_back();
            return;
        }

        if (state.builders.empty()) {
            return;
        }

        TableBuilder& builder = state.builders.back();

        if (is_name(name, "tr")) {
            // Defensive handling for omitted or malformed closing tags.
            builder.finish_row();
            builder.row_open = true;
        } else if (is_name(name, "td") || is_name(name, "th")) {
            if (!builder.row_open) {
                builder.row_open = true;
            }

            builder.finish_cell();
            builder.cell_open = true;
        }
    });
}

void sax_characters(
    void* context,
    const xmlChar* characters,
    int length
) noexcept
{
    auto& state = *static_cast<StreamState*>(context);

    sax_guard(state, [&] {
        if (state.builders.empty()) {
            return;
        }

        TableBuilder& builder = state.builders.back();

        if (builder.cell_open && length > 0) {
            builder.cell.append(
                reinterpret_cast<const char*>(characters),
                static_cast<std::size_t>(length)
            );
        }
    });
}

void sax_end_element(
    void* context,
    const xmlChar* name
) noexcept
{
    auto& state = *static_cast<StreamState*>(context);

    sax_guard(state, [&] {
        if (state.builders.empty()) {
            return;
        }

        TableBuilder& builder = state.builders.back();

        if (is_name(name, "td") || is_name(name, "th")) {
            builder.finish_cell();
        } else if (is_name(name, "tr")) {
            builder.finish_row();
        } else if (is_name(name, "table")) {
            Table table = builder.finish_table();
            state.builders.pop_back();
            state.ready.push_back(std::move(table));
        }
    });
}

struct HtmlParserDeleter {
    void operator()(htmlParserCtxt* parser) const noexcept
    {
        htmlFreeParserCtxt(parser);
    }
};

using HtmlParserPtr =
    std::unique_ptr<htmlParserCtxt, HtmlParserDeleter>;

HtmlParserPtr make_parser(
    StreamState& state,
    const std::string& source_name
)
{
    htmlSAXHandler sax{};

    // The HTML push parser uses the SAX1 element callbacks.
    sax.initialized = 1;
    sax.startElement = sax_start_element;
    sax.endElement = sax_end_element;
    sax.characters = sax_characters;
    sax.cdataBlock = sax_characters;

    HtmlParserPtr parser{
        htmlCreatePushParserCtxt(
            &sax,
            &state,
            nullptr,
            0,
            source_name.c_str(),
            XML_CHAR_ENCODING_NONE
        )
    };

    if (!parser) {
        throw std::runtime_error("Could not create HTML push parser");
    }

    constexpr int options =
        HTML_PARSE_RECOVER |
        HTML_PARSE_NOERROR |
        HTML_PARSE_NOWARNING |
        HTML_PARSE_NONET;

#if LIBXML_VERSION >= 21400
    htmlCtxtSetOptions(parser.get(), options);
#else
    htmlCtxtUseOptions(parser.get(), options);
#endif

    state.parser = parser.get();
    return parser;
}

std::size_t curl_write(
    char* data,
    std::size_t size,
    std::size_t count,
    void* context
) noexcept
{
    auto& state = *static_cast<StreamState*>(context);

    try {
        if (size != 0 &&
            count > std::numeric_limits<std::size_t>::max() / size) {
            throw std::overflow_error("libcurl chunk size overflow");
        }

        const std::size_t bytes = size * count;
        state.input.append(data, bytes);

        // Consume this callback buffer, then pause future receiving until
        // the generator needs more input.
        const CURLcode result =
            curl_easy_pause(state.easy, CURLPAUSE_RECV);

        if (result != CURLE_OK) {
            throw std::runtime_error(
                std::string("curl_easy_pause failed: ") +
                curl_easy_strerror(result)
            );
        }

        state.curl_paused = true;
        return bytes;
    } catch (...) {
        state.failure = std::current_exception();

#ifdef CURL_WRITEFUNC_ERROR
        return CURL_WRITEFUNC_ERROR;
#else
        return 0;
#endif
    }
}

class CurlTransfer {
public:
    CurlTransfer(std::string source_url, StreamState& state)
        : state_(state)
    {
        easy_ = curl_easy_init();
        multi_ = curl_multi_init();

        if (!easy_ || !multi_) {
            throw std::runtime_error("Could not initialize libcurl");
        }

        state_.easy = easy_;

        set(CURLOPT_URL, source_url.c_str());
        set(CURLOPT_FOLLOWLOCATION, 1L);
        set(CURLOPT_WRITEFUNCTION, curl_write);
        set(CURLOPT_WRITEDATA, &state_);
        set(CURLOPT_USERAGENT, "lazy-html-table-reader/1.0");
        set(CURLOPT_ACCEPT_ENCODING, "");
        set(CURLOPT_NOSIGNAL, 1L);
        set(CURLOPT_ERRORBUFFER, error_buffer_);

        // This is a request, not a guarantee. Smaller callback buffers reduce
        // how far input can run ahead of table consumption.
        set(CURLOPT_BUFFERSIZE, 1024L);

        check_multi(curl_multi_add_handle(multi_, easy_));
        added_ = true;
    }

    CurlTransfer(const CurlTransfer&) = delete;
    CurlTransfer& operator=(const CurlTransfer&) = delete;

    ~CurlTransfer()
    {
        if (added_) {
            curl_multi_remove_handle(multi_, easy_);
        }

        if (multi_) {
            curl_multi_cleanup(multi_);
        }

        if (easy_) {
            curl_easy_cleanup(easy_);
        }
    }

    bool done() const noexcept
    {
        return done_;
    }

    void resume()
    {
        if (!state_.curl_paused) {
            return;
        }

        // Unpausing can synchronously invoke curl_write(), which may pause
        // the transfer again, so clear the flag before the call.
        state_.curl_paused = false;

        const CURLcode result =
            curl_easy_pause(easy_, CURLPAUSE_CONT);

        if (result != CURLE_OK) {
            throw std::runtime_error(
                std::string("Could not resume libcurl: ") +
                curl_easy_strerror(result)
            );
        }
    }

    void pump()
    {
        while (!done_ && !state_.curl_paused) {
            int running = 0;

            check_multi(curl_multi_perform(multi_, &running));
            collect_messages();

            if (done_ || state_.curl_paused) {
                return;
            }

            if (running == 0) {
                collect_messages();

                if (!done_) {
                    throw std::runtime_error(
                        "libcurl stopped without a completion message"
                    );
                }

                return;
            }

            check_multi(
                curl_multi_poll(
                    multi_,
                    nullptr,
                    0,
                    1000,
                    nullptr
                )
            );
        }
    }

    void validate_result() const
    {
        if (state_.failure) {
            std::rethrow_exception(state_.failure);
        }

        if (result_ != CURLE_OK) {
            const char* explanation =
                error_buffer_[0] != '\0'
                    ? error_buffer_
                    : curl_easy_strerror(result_);

            throw std::runtime_error(
                std::string("Input transfer failed: ") + explanation
            );
        }

        long status = 0;

        const CURLcode info_result =
            curl_easy_getinfo(
                easy_,
                CURLINFO_RESPONSE_CODE,
                &status
            );

        if (info_result != CURLE_OK) {
            throw std::runtime_error("Could not read response status");
        }

        // file:// and other non-HTTP protocols report status zero.
        if (status != 0 && (status < 200 || status >= 300)) {
            throw std::runtime_error(
                "Server returned HTTP status " +
                std::to_string(status)
            );
        }
    }

private:
    template<class Value>
    void set(CURLoption option, Value value)
    {
        const CURLcode result =
            curl_easy_setopt(easy_, option, value);

        if (result != CURLE_OK) {
            throw std::runtime_error(
                std::string("curl_easy_setopt failed: ") +
                curl_easy_strerror(result)
            );
        }
    }

    static void check_multi(CURLMcode result)
    {
        if (result != CURLM_OK) {
            throw std::runtime_error(
                std::string("libcurl multi error: ") +
                curl_multi_strerror(result)
            );
        }
    }

    void collect_messages()
    {
        int messages_left = 0;

        while (CURLMsg* message =
                   curl_multi_info_read(multi_, &messages_left)) {
            if (message->msg == CURLMSG_DONE &&
                message->easy_handle == easy_) {
                done_ = true;
                result_ = message->data.result;
            }
        }
    }

    StreamState& state_;

    CURL* easy_ = nullptr;
    CURLM* multi_ = nullptr;

    bool added_ = false;
    bool done_ = false;

    CURLcode result_ = CURLE_OK;
    char error_buffer_[CURL_ERROR_SIZE]{};
};

void parse_available_input(StreamState& state)
{
    // Stop as soon as one table is available. Splitting at '>' gives the
    // parser frequent suspension points around markup boundaries.
    while (state.input_position < state.input.size() &&
           state.ready.empty()) {
        const std::size_t closing_bracket =
            state.input.find('>', state.input_position);

        const std::size_t end =
            closing_bracket == std::string::npos
                ? state.input.size()
                : closing_bracket + 1;

        const std::size_t length = end - state.input_position;

        if (length > static_cast<std::size_t>(INT_MAX)) {
            throw std::overflow_error("HTML parser chunk too large");
        }

        const int result =
            htmlParseChunk(
                state.parser,
                state.input.data() + state.input_position,
                static_cast<int>(length),
                0
            );

        state.input_position = end;

        if (state.failure) {
            std::rethrow_exception(state.failure);
        }

        if (result != XML_ERR_OK) {
            throw std::runtime_error("Incremental HTML parsing failed");
        }
    }

    if (state.input_position == state.input.size()) {
        state.input.clear();
        state.input_position = 0;
    }
}

void finish_parser(StreamState& state)
{
    if (state.parser_finished) {
        return;
    }

    const int result =
        htmlParseChunk(state.parser, nullptr, 0, 1);

    state.parser_finished = true;

    if (state.failure) {
        std::rethrow_exception(state.failure);
    }

    if (result != XML_ERR_OK) {
        throw std::runtime_error("Could not finish HTML parsing");
    }
}

bool looks_like_uri(std::string_view value)
{
    const std::size_t colon = value.find(':');

    if (colon == std::string_view::npos || colon == 0) {
        return false;
    }

    if (!std::isalpha(
            static_cast<unsigned char>(value.front()))) {
        return false;
    }

    for (std::size_t i = 1; i < colon; ++i) {
        const unsigned char c =
            static_cast<unsigned char>(value[i]);

        if (!std::isalnum(c) && c != '+' && c != '-' && c != '.') {
            return false;
        }
    }

    return true;
}

std::string percent_encode_file_path(std::string_view path)
{
    constexpr char hex[] = "0123456789ABCDEF";

    std::string result;
    result.reserve(path.size());

    for (unsigned char c : path) {
        // Keep path separators and the Windows drive colon.
        if (std::isalnum(c) ||
            c == '-' ||
            c == '_' ||
            c == '.' ||
            c == '~' ||
            c == '/' ||
            c == ':') {
            result.push_back(static_cast<char>(c));
        } else {
            result.push_back('%');
            result.push_back(hex[c >> 4]);
            result.push_back(hex[c & 0x0f]);
        }
    }

    return result;
}

std::string input_url(const std::string& input)
{
    namespace fs = std::filesystem;

    std::error_code error;

    // Existing paths take precedence, which matters for Windows drive names.
    const bool existing_path =
        fs::exists(fs::path(input), error) && !error;

    if (!existing_path && looks_like_uri(input)) {
        return input;
    }

    fs::path path = fs::absolute(fs::path(input), error);

    if (error) {
        throw std::runtime_error(
            "Cannot resolve input path: " + input
        );
    }

    path = path.lexically_normal();

    const std::string encoded =
        percent_encode_file_path(path.generic_string());

#ifdef _WIN32
    return "file:///" + encoded;
#else
    return "file://" + encoded;
#endif
}

} // namespace

static std::generator<Table> read_html_tables(std::string input)
{
    // In a larger application, manage curl_global_init/cleanup at program
    // scope instead of inside this function.
    static const struct CurlGlobal {
        CurlGlobal()
        {
            const CURLcode result =
                curl_global_init(CURL_GLOBAL_DEFAULT);

            if (result != CURLE_OK) {
                throw std::runtime_error("curl_global_init failed");
            }
        }

        ~CurlGlobal()
        {
            curl_global_cleanup();
        }
    } curl_global;

    const std::string source_url = input_url(input);

    StreamState state;
    HtmlParserPtr parser = make_parser(state, input);
    CurlTransfer transfer(source_url, state);

    for (;;) {
        parse_available_input(state);

        // Yield one table, suspend, and continue parsing only when the caller
        // increments the generator iterator.
        if (!state.ready.empty()) {
            Table table = std::move(state.ready.front());
            state.ready.pop_front();

            co_yield std::move(table);
            continue;
        }

        // Do not finalize a completed local transfer while unparsed bytes are
        // still buffered in the application.
        if (state.input_position < state.input.size()) {
            continue;
        }

        if (transfer.done()) {
            transfer.validate_result();
            finish_parser(state);

            while (!state.ready.empty()) {
                Table table = std::move(state.ready.front());
                state.ready.pop_front();
                co_yield std::move(table);
            }

            co_return;
        }

        transfer.resume();
        transfer.pump();

        if (state.failure) {
            std::rethrow_exception(state.failure);
        }
    }
}

static void process(const Table& table)
{
    for (const Row& row : table) {
        for (std::size_t column = 0; column < row.size(); ++column) {
            if (column != 0) {
                std::cout << '\t';
            }

            std::cout << row[column];
        }

        std::cout << '\n';
    }
}

int main(int argc, char** argv)
{
    if (argc != 2) {
        std::cerr
            << "Usage: "
            << argv[0]
            << " <URL-or-HTML-file>\n";

        return 2;
    }

    try {
        bool first_table = true;

        for (Table table : read_html_tables(argv[1])) {
            if (!first_table) {
                std::cout << '\n';
            }

            first_table = false;
            process(table);
        }
    } catch (const std::exception& error) {
        std::cerr << "Error: " << error.what() << '\n';
        return 1;
    }
}
