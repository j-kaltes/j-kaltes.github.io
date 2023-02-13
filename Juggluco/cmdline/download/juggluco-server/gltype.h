#pragma once
#include <array>
#include <span>
typedef std::array<char,11>  sensorname_t;
typedef const sensorname_t *constcharptr_t;
/*struct streams_t {
	time_t *glucosetime;
	uint32_t *glucose;
	float * glucoserate;
	constcharptr_t *sensorname=nullptr;
	int sensornr;
};
*/
struct ScanData;
struct streamdat {
	const ScanData *poll;
	constcharptr_t sensorname;
	};
extern std::span<streamdat> laststream;
