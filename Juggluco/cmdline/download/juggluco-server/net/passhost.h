#pragma once
#include <array>
#include <sys/types.h>
#include <arpa/inet.h>
#if 0
        struct sockaddr_in6 {
               sa_family_t     sin6_family;   /* AF_INET6 */
               in_port_t       sin6_port;     /* port number */
               uint32_t        sin6_flowinfo; /* IPv6 flow information */
               struct in6_addr sin6_addr;     /* IPv6 address */
               uint32_t        sin6_scope_id; /* Scope ID (new in 2.4) */
           };

           struct in6_addr {
               unsigned char   s6_addr[16];   /* IPv6 address */
           }; 
#endif
#include "netstuff.h"
constexpr const int maxip=4;


struct passhost_t {
inline static constexpr const int maxnamelen=16;
	struct sockaddr_in6 ips[maxip];
	int nr;
	int index;
	std::array<uint8_t,16>  pass;
	uint8_t receivefrom:7; 
	bool wearos:1;
/*
Receive	   	reconnect	receivefrom:
true		true 	  	3
true	  	false	  	2
false		true 	 	1
false	  	false	  	0
*/

//	getupdatedata()->allhosts[index].receivefrom=receive?(reconnect?2:3):(sendto?1:0);

	uint8_t activereceive:4; // receiveactive=receive&&activeonly; Receive from named host active only
	bool detect:1;
	bool sendpassive:1;  // send to named host passive only
	bool hasname:1;
	bool noip:1;
	uint16_t getport() const {	
		return ntohs(ips[0].sin6_port);
		}
	bool isSender() const {
		return index>=0;
		}
bool passive() const {
	return (receivefrom&&!activereceive)||sendpassive;
	}
const char *getname() const {
	return reinterpret_cast<const char *>(ips+maxip-1);
	}
void setname(const char *label)  {
	hasname=true;
	char *name=reinterpret_cast<char *>(ips+maxip-1);
	for(int i=0;i<maxnamelen;i++) {
		if(!label[i]) {
			memcpy(name+i,zeros,maxnamelen-i);
			return;
			}
		name[i]=label[i];
		}
	}
bool	haspass() const {
	const uint64_t *p=reinterpret_cast<const uint64_t *>(&pass);
	return *p||p[1];
	};
bool hasip(const struct sockaddr *addrptr) const {

 bool sameaddress(const  struct sockaddr *addr, const struct sockaddr_in6  *known);
	for(int i=0;i<nr;i++)
		if(sameaddress(addrptr,ips+i))
			return true;
	return false;
	};
bool addiphasfamport(const struct sockaddr *addrptr) {
	if(!::putiphasfamport( addrptr,ips+nr)) {
		LOGGER("addiphasfamport returns false\n");
		return false;
		}
	LOGGER("addiphasfamport returns true\n");
	++nr;
	detect=false;
	return true;
	};
bool putip(const sockaddr_in6  *addrptr) {
	*ips=*addrptr;
	if(!nr) nr++;
	detect=false;
	return true;
	}
void putips(const sockaddr_in6  *addrptr,int nrin) {
	memcpy(ips,addrptr,nrin*sizeof(ips[0]));
	nr=nrin;
	detect=false;
	}
bool putip(const struct sockaddr *addrptr) {
	if(!::putip( addrptr,ips)) {
		LOGGER("passhost_t::putip failed\n");
		return false;
		}
	if(!nr) nr++;
	detect=false;
	return true;
	};
};
#include <string_view>
extern void startreceiver(const char *port, passhost_t *hosts,int &hostlen,int *socks) ;
extern void stopreceiver() ;

#include <string.h>
inline bool address(const passhost_t &host) {
	return !host.detect;
	}
