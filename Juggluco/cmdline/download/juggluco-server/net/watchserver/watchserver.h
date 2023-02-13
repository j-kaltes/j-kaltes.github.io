#pragma once
struct recdata {
	char *allbuf=nullptr;
	const char *start;
	int len;
	~recdata() {
		delete[] allbuf;
		}
	const char *data() const {
		return start;
		}
	int size() const {
		return len;
		}
		
	};
