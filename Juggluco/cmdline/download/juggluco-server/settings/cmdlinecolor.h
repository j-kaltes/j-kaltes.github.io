struct color_t {
	union {
		float rgba[4];
		struct {
			float r,g,b,a;
		};
	};
	};
