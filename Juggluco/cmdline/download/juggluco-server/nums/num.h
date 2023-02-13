#include <stdint.h>
#pragma once
typedef float float32_t;
struct Num {
  uint32_t time;
  uint32_t mealptr;
  float32_t value;
  uint32_t type;
 const uint32_t gettime() const {
 	return time;
	};
  };
