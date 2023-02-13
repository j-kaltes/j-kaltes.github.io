#pragma once
#include "nums/numdata.h"

#include "settings/settings.h"

template <class T> struct NumIter {
	const T *iter;
	const T *begin;
	const T *end;
//	const T *pagenewest;
//	const T *pageoldest;
	int bytes;
	void inc() {
		iter=next();
		}
	void dec()  {
		iter=prev();
		}
	const T*prev(const T* ptr) const {
		return reinterpret_cast<const T *>(reinterpret_cast<const char *>(ptr)-bytes);
		}
	const T*prev() const {
		return prev(iter);
		}
	const T*next(const T*ptr) const {
		return  reinterpret_cast<const T *>(reinterpret_cast<const char *>(ptr)+bytes);
		}

	const T*next() const {
		return next(iter);
		}
	};
#include "SensorGlucoseData.h"
inline bool notvalid(const ScanData *scan) {
	return !scan||!scan->gettime()||!scan->g;
	}
inline bool notvalid(const Glucose *glu) {
	return !glu||!glu->gettime()||!glu->getsputnik();
	}
inline bool notvalid(const Num *num) {
	if(!num)
		return true;
	if(!num->gettime())
		return true;
	if(num->type>=settings->getlabelcount())
		return true;
	return false;
	}
/*(	
template <class T> 
bool notva(const T *el) {
	return notvalid(el);
	}
	*/
//template <class T,typename F=decltype(notva<T>)> const T *findnewest(NumIter<T> *nums,int count,const F &notval=notva<T>) ;
//template  <class T,typename F=decltype(notva<T>)> const T *findoldest(NumIter<T> *nums,int count,const F &notval=notva<T>) ;

template <class T,typename F=bool (*)(const T *)>
int ifindnewest(NumIter<T> *nums,int count,const F&notval=notvalid) {
	int i=0;
	for(;i<count;i++)  {
		while(nums[i].iter>=nums[i].begin) {
			if(!notval(nums[i].iter))
				goto foundfirst;
//			nums[i].iter--;
			nums[i].dec();
			}
				
		}
	return -1;

	foundfirst:
	int newest=i++;
	for(;i<count;i++) {
		while(nums[i].iter>=nums[i].begin&&notval(nums[i].iter))
			nums[i].dec();
		//	nums[i].iter--;
		if(nums[i].iter>=nums[i].begin) {
			if(nums[i].iter->gettime()>nums[newest].iter->gettime())  {
				newest=i;
				}
			}
			
		}
	
	//nums[newest].iter--;
	nums[newest].dec();
	return newest;
	}
//template <class T,typename F=decltype(notva<T>)>

template <class T,typename F=bool (*)(const T *)>
const T *findnewest(NumIter<T> *nums,int count,const F &notval=notvalid) {
	int newest = ifindnewest(nums,count,notval);
	if(newest>=0)
		return nums[newest].next();
//		return nums[newest].iter+1;
	return nullptr;
	}
/*
template <class T>
const T*	nextptr(const T *&ptr) {
		return ++ptr;
		}
template <class T>
const T*	minusone(const T *&ptr) {
		return ptr-1;
		}
		*/
//template <class T,class F=decltype(notva<T>)>

template <class T,typename F=bool (*)(const T *)>
int ifindoldest(NumIter<T> *nums,int start,int count,const F& notval=notvalid) {
//LOGGER("ifindoldest %d(#%d) ",start,count);
	int i=start;
	for(;i<count;i++)  {
		if(nums[i].bytes>0) {
			while(nums[i].iter&&nums[i].iter<=nums[i].end) {
				if(!notval(nums[i].iter))
					goto foundfirst;
				nums[i].inc();
				}
			}
				
		}
	return -1;

	foundfirst:
//LOGGER("found %d",i);
	int oldest=i++;
	for(;i<count;i++) {
		if(nums[i].iter) {
			while(nums[i].iter<=nums[i].end&&notval(nums[i].iter))
				nums[i].inc();
			if(nums[i].iter<=nums[i].end) {
				if(nums[i].iter->gettime()<nums[oldest].iter->gettime())  {
					oldest=i;
					}
				}
			}
			
		}
	
	nums[oldest].inc();
    //LOGGER("oldest %d\n",oldest);
	return oldest;
	}
//template  <class T,typename F=decltype(notva<T>)>
template <class T,typename F=bool (*)(const T *)> const T *findoldest(NumIter<T> *nums,int count,const F& notval=notvalid) {
	int oldest = ifindoldest(nums,0,count,notval);
	if(oldest>=0)
		return nums[oldest].prev();
	return nullptr;
	}
//template  <class T> const T *findoldest(NumIter<T> *nums,int count) ;
//template  <class T> const T *findnewest(NumIter<T> *nums,int count) ;
//extern template<typename F> const Num *findoldest(NumIter<Num> *nums,int count,const F& notval=notva<Num>) ;
//extern template<typename F> const Num *findnewest(NumIter<Num> *nums,int count,const F& notval=notva<Num>) ;
struct NVGcontext;
extern void shownums(NVGcontext* vg, NumIter<Num> *numiters, const int nr) ;

extern void shownumsback(NVGcontext* vg, NumIter<Num> *numiters, const int nr) ;
extern void shownumsbacknewest(NVGcontext* vg, NumIter<Num> *numiters, const int nr,const int numnr) ;
inline bool notvali(const Num *num) {
	if(!num->gettime())
		return true;
	return false;
	}


