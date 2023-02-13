#pragma once
#include <stdio.h>

template <typename T>
struct destruct {
  T func;
  bool active=true;
  destruct(const T func): func(func) {};
  ~destruct() {
  	if(active)
		func();
	}
};
//#define TEST
#ifdef TEST
int main() {

destruct desi([](){ puts("destruct") ;});
puts("after");
}

#endif
