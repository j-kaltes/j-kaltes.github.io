#pragma once
#include <sys/random.h>
inline void makerandom(void *buf,size_t len) {
	#if defined(__ANDROID_API__) && __ANDROID_API__ < 28
	arc4random_buf(buf,len);
	#else
      if(getrandom(buf, len, 0)!=len) 
       		lerror("getrandom");
	#endif
	}
