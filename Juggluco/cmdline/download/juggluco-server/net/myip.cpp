#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/socket.h>
#include <sys/ioctl.h>
#include <net/if.h>
#include <arpa/inet.h>
#include <netinet/in.h>
       #include <unistd.h>
#include "netstuff.h"
#include "destruct.h"
#include "logs.h"

namehost myip (){
  if(int socketfd = socket(AF_INET, SOCK_STREAM, 0);socketfd >= 0) {
    destruct dest([socketfd]{close(socketfd);});
    struct    ifreq data[50];
    struct ifconf conf{.ifc_len = sizeof(data),.ifc_ifcu{.ifcu_req = data}};
    if (ioctl(socketfd,SIOCGIFCONF,&conf) < 0) {
       lerror("ioctl(,SIOCGIFCONF,)");
       return namehost();
    	}
    const	int nr= (conf.ifc_len /sizeof(struct ifreq));
    for(int in=0;in<nr;in++) {
    	struct ifreq *ifr=data+in;
	namehost host( &ifr->ifr_addr);
	if (ioctl(socketfd, SIOCGIFFLAGS, (char *) ifr) < 0) {
			lerror("ioctl(SIOCGIFFLAGS )");
			continue;
			}
	if(! (ifr->ifr_flags & IFF_POINTOPOINT) && !(ifr->ifr_flags & IFF_LOOPBACK) &&(ifr->ifr_flags & IFF_UP)&& (ifr->ifr_flags & IFF_RUNNING)  )
			return host;	
      }
    }

  else {
    lerror("socket");
  }
return namehost();
}

#if 0
int main() {
namehost host=getip();
printf("%s\n",host.data());
	}
#endif
