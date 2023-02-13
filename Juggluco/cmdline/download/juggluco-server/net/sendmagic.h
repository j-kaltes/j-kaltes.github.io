#include "sendmagicinit.h"
constexpr const unsigned char sendmagic[] = sendmagicinit;
extern std::array<unsigned char,sizeof(sendmagic)>  sendmagicspec;
