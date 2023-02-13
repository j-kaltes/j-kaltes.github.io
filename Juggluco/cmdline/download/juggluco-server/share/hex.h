#pragma once
inline unsigned char dehex(char ch) { return ch<='9'?ch-'0':(ch-'A'+10);};

	
inline unsigned char hexnum(char h,char l) {
	return dehex(h)<<4|dehex(l);
	}
inline char showhexel(int deel) {return deel<=9?'0'+deel:deel-10+'A';};

template <int part> inline char showhex(unsigned char ch){
	return showhexel(ch>>4);
	}
 template<>  inline char showhex<0>(unsigned char ch) {
	return showhexel(ch&0xF);
	}
