//	s/^.*showerror(vg, *\("[^"]*"\), *\("[^"]*"\).*/{\1,\2},/g
#pragma once
#include  <utility>
#include <string_view>
#include <span>

struct Shortcut_t {const char name[12];const float value;} ;
constexpr int hourminstrlen=20;
extern char hourminstr[hourminstrlen];
typedef const char *charptr_t;
//typedef std::string_view  *string_viewar;
typedef std::pair<const char*,const char *> errortype;
struct jugglucotext {
char daylabel[7][4];
char monthlabel[12][4];
std::string_view scanned;
#ifndef WEAROS
std::string_view median,middle;
#endif
std::string_view history,historyinfo,
	sensorstarted,
	lastscanned,
	laststream,
	sensorends
#ifndef WEAROS
,
	newamount,
	averageglucose;
charptr_t
	duration,
	timeactive,
	nrmeasurement,
	EstimatedA1C,
	GMI,
	SD,
	glucose_variability;
std::string_view menustr0[7], menustr1[6], menustr2[7], menustr3[7];
std::string_view *menustr[4]={menustr0,menustr1,menustr2,menustr3};
#else
;
std::string_view	amount;
std::string_view menustr0[5], menustr2[4];
std::string_view *menustr[2]={menustr0,menustr2};
#endif
errortype scanerrors[0x11];
#ifndef WEAROS
std::string_view advancedstart;
bool add_s;
const std::span<const Shortcut_t> shortinit;
const std::span<const std::string_view> labels;
#endif
};

extern jugglucotext *usedtext;
