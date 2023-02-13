#pragma once
#include <new>
template <int nr,typename T>
T aligner(T ptr) {
	static constexpr uintptr_t mis=(nr-1);
	static constexpr uintptr_t alignedon=~0-mis;
//	return reinterpret_cast<T>(reinterpret_cast<uintptr_t>(ptr+mis)&alignedon);
	return (T)(reinterpret_cast<uintptr_t>(ptr+mis)&alignedon);
	}
template <int nr,typename  T>
struct ardeleter { // deleter
    void operator() ( T ptr[]) {
	operator delete[] (ptr, std::align_val_t(nr));
    }
};
 
