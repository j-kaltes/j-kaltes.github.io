#pragma once
struct GlucoseValue {
    const int id;
    const int dataQuality;
    const int value;
    int getId() const {return id;}
    int getQuality() const {return dataQuality;}
    int getValue() const {return value;}
    };

struct GlucoseNow:GlucoseValue {
static constexpr const char *const trendString[]{"NOT_DETERMINED",
"FALLING_QUICKLY",
"FALLING",
"STABLE",
"RISING",
"RISING_QUICKLY" };
const char *trendstr() const {
	return trendString[trendArrow];
	};
    const float rate() const {
    	return  rateOfChange;
	};
	const int trend() const {
	return trendArrow;
	}
    const int trendArrow;
    const float rateOfChange;
    GlucoseNow(GlucoseValue *val,const int trend,const float rate):GlucoseValue(*val),trendArrow(trend),rateOfChange(rate) {}
	};
