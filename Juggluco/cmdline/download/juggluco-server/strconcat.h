#pragma once
#include <string_view>
#include "share/logs.h"
#include "sizear.h"
using namespace std;
class strconcat {
char *name;
int namelen;
public:
template<typename T,typename ...Ts> char *	nstrconcat(int len,string_view sep,  T &&one,  Ts &&... args) {

	char *ptr;
	int en=sizear(one);
	const char *asstr=reinterpret_cast<const char *>( &one[0]);
	if constexpr(sizeof...(Ts)==0) {
		namelen=len+en+1;
		ptr= new char[namelen];
		ptr[namelen-1]='\0';
		}
	else {
		do { en--; } while(en>=0&&asstr[en]=='\0'); //NEEDED?
		en++;
		ptr=nstrconcat(len+en+sep.size(),sep,args...);
		memcpy(ptr+len+en,sep.data(),sep.size());
		}
	memcpy(ptr+len,asstr,en);
	return ptr;
	}

template <typename ...Ts>
strconcat(string_view sep,  Ts &&... args) {
	name=nstrconcat(0,sep,args ...);
	}
strconcat(strconcat &&in):name(in.name),namelen(in.namelen) { 
	in.name=nullptr;
	in.namelen=0;
	LOGGER("strconcat( strconcat &&in=%s)\n",name);
}
strconcat( strconcat &in):name(new char[in.namelen]),namelen(in.namelen) { 
	memcpy(name,in.name,in.namelen);
	LOGGER("strconcat( strconcat &in=%s)\n",name);
}
strconcat &operator=(strconcat &&in) {
	LOGGER("strconcat &operator=(strconcat &&in %s) {\n",in.name);
	std::swap(name,in.name);
	std::swap(namelen,in.namelen);
	return *this;
	}
strconcat &operator=(strconcat &in) {
	LOGGER("strconcat &operator=(strconcat &in %s) {\n",in.name);
	delete[] name;
	name=new char[in.namelen];
	namelen=in.namelen;
	memcpy(name,in.name,namelen);
	return *this;
	}
~strconcat() {
	delete[] name;
	}
operator const string_view() const {
	return string_view(name,namelen-1);
	}
char *begin() {return data();}
char *end() {return begin()+size();}
const char *cbegin() const {return data();}
const char *cend() const {return begin()+size();}
const char *begin() const {return cbegin();}
const char *end() const {return cend();}
char * data() { return name;}
const char * data() const { return name;}
operator char *() {
	return name;
	}
operator const char *() const {
	return name;
	}
int size() const {return namelen-1;}
int length() const {return size();}
};

