#pragma once
#include <time.h>
#include "nums/num.h"
class MealSave {
      struct { 
      	int day,month,year;
	bool different(struct tm &tm) const {
		return tm.tm_mday!=day||tm.tm_mon!=month||tm.tm_year!=year;
		}
	} was{0,0,0};
    public:
	bool dostarttable(int handle,const Num * num);
	bool savemeal(int handle,const Num *num); 
   };
