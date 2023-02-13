#pragma once
using std::string;
using std::string_view;
//using std::span;
//https://en.cppreference.com/w/cpp/iterator/size
//using namespace std;
template <class C> 
constexpr auto sizear(const C& c) -> decltype(c.size())
{
//   	LOGGER("sizear: container %s\n",c.data());
    return c.size();
}
template <class C> 
constexpr auto sizear(const C* c) -> decltype(c->size())
{
//   	LOGGER("sizear: container %s\n",c.data());
    return c->size();
}
template <class T, std::size_t N>
constexpr std::size_t sizear(const T (&array)[N]) noexcept
{
//LOGGER("sizear: const array %s\n",array);
    return N-1;
}
template <class T, std::size_t N>
constexpr std::size_t sizear(T (&array)[N]) noexcept
{
//LOGGER("sizear: array %s\n",array);
	return strlen(array);
}
//template <typename T, std::enable_if_t<std::is_convertible<T, char const*>::value , bool> = true >
template <typename T, std::enable_if_t<std::is_pointer<T>::value , bool> = true >
std::size_t sizear(T s) {
//	LOGGER("sizear: ptr %s\n",s);
	return strlen(s);
	}


