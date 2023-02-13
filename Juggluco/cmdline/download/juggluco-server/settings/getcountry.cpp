#include <string.h>
#include <iostream>
#include "settings/settings.h"
using namespace std;

int getoneunit() {
constexpr const char *vars[]={
	"LC_ALL",
	"LC_ADDRESS",
	"LC_TELEPHONE",
	"LC_NAME",
	"LC_IDENTIFICATION",
	"LC_TIME",
	"LC_MEASUREMENT",
	"LC_MONETARY",
	"LC_NUMERIC",
	"LC_PAPER",
	};
	for(const char *v:vars) {
		const char *val=getenv(v);
		if(val) {
			if(int unit=getunit(val+3) ) 
				return unit;
			}
		}
return 0;
}

void Settings::setlinuxcountry() {
	if(data()->unit==0)
		setunit(getoneunit());
	}
