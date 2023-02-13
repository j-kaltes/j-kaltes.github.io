#ifndef SERIAL_H
#define SERIAL_H
#include <string_view>
#include <string>
#include <array>


extern std::string getserial(int fam, const unsigned char *byte) ;
extern std::array<unsigned char,8> unserial(const char * const str) ;
#endif
