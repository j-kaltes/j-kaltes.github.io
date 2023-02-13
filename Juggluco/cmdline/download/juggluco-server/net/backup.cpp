//#include <arpa/inet.h>
       #include <sys/types.h>
       #include <sys/socket.h>
       #include <netdb.h>
#include <arpa/inet.h>
       #include <sys/socket.h>
       #include <sys/types.h>
       #include <sys/wait.h>
       #include <unistd.h>
       #include <netinet/in.h>
       #include <netinet/tcp.h>
#include <sys/prctl.h>
 
#include <string.h>
#include <stdio.h>
#include <stdlib.h>

#include <errno.h>

#include <netinet/in.h>
#include <sys/wait.h>
       #include <unistd.h>
       #include <sys/syscall.h> 
#include "destruct.h"
#include "logs.h"
#ifndef LOGGER
#define LOGGER(...) fprintf(stderr,__VA_ARGS__)
#endif


using namespace std;

//#include <memory>
//void serverloop(int sock) ;
struct passhost_t ;

bool *shutdownreceiver=nullptr;
void serverloop(int sock, passhost_t *hosts,int &hostlen,int *socks)  ;
static bool startserver(char *port, passhost_t *hosts,int *hostlen,int *socks,bool *shutdownreceiver) {
//	std::unique_ptr<char[]> wweg(port); //bind name conflict cause by #include <memory>
	destruct wweg([port]{delete[] port;});
   prctl(PR_SET_NAME, "RECEIVER", 0, 0, 0);
	struct addrinfo hints{.ai_flags=AI_PASSIVE,.ai_family=AF_UNSPEC,.ai_socktype=SOCK_STREAM};

	int sock;
	{
	struct addrinfo *servinfo=nullptr;
	destruct serv([&servinfo]{ if(servinfo)freeaddrinfo(servinfo);});
	if(int status=getaddrinfo(nullptr,port,&hints,&servinfo)) {
		LOGGER("getaddrinfo: %s\n",gai_strerror(status));
		return false;
		}
	destruct receiv([shutdownreceiver]{
			if(shutdownreceiver==::shutdownreceiver) {
				::shutdownreceiver=nullptr;
				delete[] shutdownreceiver;
				}

			;});
	RESTART:
	for(struct addrinfo *ips=servinfo;;ips=ips->ai_next) {
		if(!ips) {
			LOGGER("no addresses to bind left\n");
			if(*shutdownreceiver) {
				LOGGER("shutdownreceiver return\n");
				return false;
				}
			sleep(1);
			goto RESTART;
//			return false;
			}
		sock=socket(ips->ai_family,ips->ai_socktype,ips->ai_protocol);
		if(sock==-1) {
			lerror("socket");
			continue;
			}
		const int  yes=1;	
		if(setsockopt(sock, SOL_SOCKET, SO_REUSEADDR, &yes, sizeof(int)) == -1) {
			flerror("setsockopt close(%d)",sock);
			close(sock);
			return false;
			}
		if(bind(sock,ips->ai_addr,ips->ai_addrlen)==-1) {
			flerror("bind close(%d)",sock);
			close(sock);
			continue;
			}
		break;
		}
	}
	constexpr int const BACKLOG=5;
	if (listen(sock, BACKLOG) == -1) {
		lerror("listen");
		return false;
		}
	serverloop(sock,hosts,*hostlen,socks) ;
	return true;
	}

#include "netstuff.h"
#include <thread>
#include "passhost.h"
static int globalsocket=-1;
//get_in_addr((struct sockaddr *)&their_addr)
bool receiveractive() {
	return globalsocket!=-1;
	}
void stopreceiver() {
	LOGGER("stopreceiver %d\n",globalsocket);
	if(globalsocket>=0) {
		LOGGER("shutdown globalsocket %d\n",globalsocket);
		shutdown(globalsocket,SHUT_RDWR);
		}
	else {
		if(shutdownreceiver) {
			LOGGER("ask for shutdown receiver\n");
			*shutdownreceiver=true;
			}
		}
	}
#include <algorithm>
bool sameaddress(const  struct sockaddr *addr, const struct sockaddr_in6  *known) {
	switch(addr->sa_family) {
		case AF_INET: {
			uint32_t ip4= (((const struct sockaddr_in*)addr)->sin_addr).s_addr;
#ifdef __ANDROID__
			if(ip4==known->sin6_addr.in6_u.u6_addr32[3]&&!memcmp(known->sin6_addr.in6_u.u6_addr8,zeros,10))
#else
			if(ip4==known->sin6_addr.__in6_u.__u6_addr32[3]&&!memcmp(known->sin6_addr.__in6_u.__u6_addr8,zeros,10))
#endif
				return true;
			};
	case AF_INET6: {
	     const struct sockaddr_in6 *ina6=(const struct sockaddr_in6*)addr;
	     const struct in6_addr  *addr6=&ina6->sin6_addr;
//		if(!memcmp(known->__in6_u.__u6_addr8,zeros,10)) {
		if(!memcmp(known,zeros,10)) {
#ifdef __ANDROID__
			return addr6->in6_u.u6_addr32[3]==known->sin6_addr.in6_u.u6_addr32[3];
#else
			return addr6->__in6_u.__u6_addr32[3]==known->sin6_addr.__in6_u.__u6_addr32[3];
#endif
			}

		return known->sin6_scope_id==ina6->sin6_scope_id&&!memcmp(&known->sin6_addr,addr6,16);
		}
//		return !memcmp(known->__in6_u.__u6_addr8,addr6,16);
		default: return false;
		}
	}
//&hosts[hostlen-1]

static bool testreceivemagic(int sock) {
#include "receivemagic.h"
#include "sendmagic.h"
	constexpr int buflen=1024;
	char buf[buflen];
	int res;
	if((res =recvni(sock,buf,buflen))==sendmagicspec.size()) {
		if(!memcmp(buf,sendmagicspec.data(),sendmagicspec.size()-4)) { 
			if(!memcmp(buf+sendmagicspec.size()-4,sendmagicspec.end()-4,4)) {
				LOGGER("I don't connect with myself\n");
				}
			else {
				constexpr int reclen=sizeof(receivemagic);
				if(sendni(sock,receivemagic,reclen)==reclen) {
					LOGGER("receivemagic success\n");
					return true;
					}
				else
					flerror("sendmagic %d",sock);
				}
			}
		else
			LOGGER("wrong  magic %d",sock);
		}
	else	
		LOGGER("testreceivemagic recvni(%d..)=%d\n",sock,res);
	return false;
	}
extern bool networkpresent;

void receiversockopt(int new_fd) {
		   const int keepalive = 1;
		   if(setsockopt(new_fd, SOL_SOCKET, SO_KEEPALIVE, &keepalive, sizeof(keepalive)) < 0) {
			flerror("setsockopt(%d,SO_KEEPALIVE, )",new_fd);
			 }
		   const int keepidle = 60;
		   if(setsockopt(new_fd, IPPROTO_TCP, TCP_KEEPIDLE, &keepidle, sizeof(keepidle)) < 0) {
			flerror("setsockopt(%d,TCP_KEEPIDLE, )",new_fd);
			 }
		   const int keepintvl = 60;
		   if(setsockopt(new_fd, IPPROTO_TCP, TCP_KEEPINTVL, &keepintvl, sizeof(keepintvl)) < 0) {
			flerror("setsockopt(%d,TCP_KEEPINTVL, )",new_fd);
			 }
		 }
void serverloop(int serversock, passhost_t *hosts,int &hostlen,int *socks)  {
globalsocket=serversock;
	while(true) {  // main accept() loop
		 struct sockaddr_in6 their_addr;
//		struct sockaddr_storage their_addr;

		struct sockaddr *addrptr= (struct sockaddr *)&their_addr;
		socklen_t sin_size = sizeof(their_addr) ;
		LOGGER("accept(%d,%p,%d)\n",serversock,addrptr,sin_size);
		int new_fd = accept(serversock, addrptr, &sin_size);
		LOGGER("na accept(serversock=%d)=%d\n",serversock,new_fd);
		if (new_fd == -1) {
			int ern=errno;
			flerror("accept %d",ern);
			switch(ern) {
				case EFAULT: 
				case EPROTO:
				case EBADF:
				case EINVAL:
				case ENOTSOCK:
				case EOPNOTSUPP: 
				close(serversock);
				if(serversock==globalsocket)
					globalsocket=-1;
				LOGGER("exit\n"); return;
				} 
			continue;
			}
		if(!networkpresent) {
			close(new_fd);
			continue;
			}

		passhost_t *endhost= hosts+hostlen;
		bool hasname=false;
		passhost_t *hit=std::find_if(hosts,endhost,[&hasname,addrptr](const passhost_t &host) {
				if(host.hasname) {
					hasname=true;
					return false;
					}
				if(host.noip)
					return true;
				if(host.passive()) {
					if(host.hasip(addrptr))
						return true;
					}
				return false;
				});
		const namehost name(addrptr);
		LOGGER("server: got connection from %s sock=%d\n" ,(const char *)name ,new_fd);
		if(hit==endhost) {
			for(int h=0;h<hostlen;h++) {
				passhost_t& host=hosts[h];
				if((host.passive())&&!host.hasname&&host.detect) {
					if(!host.addiphasfamport(addrptr)) {
						continue;
						}
					LOGGER("detected\n");		
					hit=&host;
					goto RIGHTHOST;
				 	}
				}
			if(hasname) {
				char name[passhost_t::maxnamelen];
				if(recvni(new_fd,name,passhost_t::maxnamelen)==passhost_t::maxnamelen) {
					LOGGER("hostlabel=%s\n",name);
					for(int h=0;h<hostlen;h++) {
						passhost_t& host=hosts[h];
						if((host.passive())&&host.hasname&&!memcmp(host.getname(),name,passhost_t::maxnamelen)) { 
							bool nothostreg=!host.hasip(addrptr)&&(!host.detect||!host.addiphasfamport(addrptr));
							if(!host.noip&&nothostreg) {
								LOGGER("wrong ip\n");
								continue;
								}
							LOGGER("take \n");
							hit=&host;
							goto RIGHTHOST;
							}
						}
					}
				}
			LOGGER("Wrong host\n");
			close(new_fd);
			continue;
			}
	RIGHTHOST:
	 	{
//		   const int keepidle = 10*60;

		if(!testreceivemagic(new_fd)) {
			close(new_fd);
			continue;
			}
	#define SENDPASSIVE 1	 
	#define RECEIVEFROM 2	 

//extern void getmyname(int sock); getmyname(new_fd);
		if(hit->sendpassive) {
			LOGGER("sendpassive\n");
			char ant=SENDPASSIVE;
			extern bool sendall(const passhost_t *host);
			if(hit->receivefrom&2&&!sendall(hit)) {
				if(recvni(new_fd, &ant, 1)!=1) {
				  	LOGGER("No send/recv distinction\n");
				  	}
				else {
					LOGGER("also receivefrom ant=%d\n",ant);
					}
				}
			if(ant==SENDPASSIVE) {
				void passivesender(int sock,passhost_t *pass) ;
				passivesender(new_fd,hit);
				continue;
				}

			}

		receiversockopt(new_fd) ;
		const int pos=hit-hosts;
		int oldsock=socks[pos];
		if(oldsock>=0&&oldsock!=new_fd) {
			socks[pos]=-1;
			LOGGER("%d close(%d) prev\n",pos, oldsock);
			shutdown(oldsock,SHUT_RDWR);
			close(oldsock);
			}
		int len=name.size();
		char *ptr=new char[len+3];
		strcpy(ptr,name);
		strcpy(ptr+len,"-r");
	void handleconnection(int sock,passhost_t *,char *ptr) ;
		socks[pos]=new_fd;
		std::thread  handlecon(handleconnection,new_fd,hit,ptr);
		handlecon.detach();
		}
	    }
	}
//s/\<recv(\([^,]*\),\([^,]*\),\([^,]*\),0)/recvni(\1,\2,\3)/g



//s/\<send(\([^,]*\),\([^,]*\),\([^,]*\),0)/sendni(\1,\2,\3)/g
void handleconnection(int sock,passhost_t *host,char *ptr) {
      prctl(PR_SET_NAME, ptr, 0, 0, 0);
      delete[] ptr;
  /* Set the option active */
/*	#ifndef NOTIMEOUT
		struct timeval tv;
		tv.tv_usec = 0;
//		tv.tv_sec = 60*15; setsockopt(sock, SOL_SOCKET, SO_RCVTIMEO, (const char*)&tv, sizeof tv);
		tv.tv_sec = 5*60; 
		setsockopt(sock, SOL_SOCKET, SO_SNDTIMEO , (const char*)&tv, sizeof tv);
	#endif */
	/*const int minimumsize = 1;
	setsockopt(sock, SOL_SOCKET, SO_RCVLOWAT, &minimumsize, sizeof minimumsize);
	setsockopt(sock, SOL_SOCKET, SO_SNDLOWAT, &minimumsize, sizeof minimumsize); */

	LOGGER("handleconnection %d\n",sock);
	bool	getcommands(int,passhost_t *);
	if(getcommands(sock,host)) {
		LOGGER("open return handleconnection %d\n",sock);
		return;
		}
	LOGGER("shutdown(%d)\n",sock);
	shutdown(sock,SHUT_RDWR);
//	close(sock);
	}

void startreceiver(const char *port,passhost_t *hosts,int &hostlen,int *socks) {
	globalsocket=-1;
	int len=strlen(port)+1;
	char *portcp=new char[len];
	memcpy(portcp,port,len);
	std::thread backup(startserver,portcp,hosts,&hostlen,socks,shutdownreceiver=new bool[1]());
	//Leaks
//	sleep(600); //TODO remove
	backup.detach(); 
	}
#ifdef MAIN

void netwakeup() {
	LOGGER("wakeup\n");
	}
//s/\([A-Z]\+\)/printf(\"\1=%d\\n\",\1);/g
int main(int argc, char **argv) {
 printf("EBADF=%d\n",EBADF); printf("EINVAL=%d\n",EINVAL); printf("ENOTSOCK=%d\n",ENOTSOCK); printf("EOPNOTSUPP=%d\n",EOPNOTSUPP); 
	if(argc!=3) {
		LOGGER("Usage: %s port basedir\n",argv[0]);
		exit(2);
		}

passhost_t hosts[1]{{.connect={.sin6_family=AF_INET6,.sin6_addr={.__in6_u{.__u6_addr32{0xffffffff,0xffffffff,0xffffffff,0xffffffff}}}},.receivefrom=2}};

int socks[1]={-1};
int len=1;
	startreceiver(argv[1],argv[2],hosts,len,socks);
	sleep(2);

	pause();
	}
#endif
