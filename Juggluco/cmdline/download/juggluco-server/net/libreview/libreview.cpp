#ifndef WEAROS
#include <memory>
#include <string_view>
#include <array>
#include <stdlib.h>
#include <stdio.h>
#include <time.h>
#include <unistd.h>
#include "sensoren.h"
#include "destruct.h"
#include "SensorGlucoseData.h"
#include "settings/settings.h"

constexpr const int EXTRALEN=
#ifdef NDEBUG
30
#else
0
#endif
;
constexpr const int histelUitlen=sizeof(R"({"valueInMgPerDl":159.0,"extendedProperties":{"factoryTimestamp":"2022-06-20T20:24:33.000Z","isFirstAfterTimeChange":false},"recordNumber":-6629292502336270757,"timestamp":"2022-06-20T22:24:33.000+02:00"},)")+EXTRALEN;

constexpr const int startsensorlen=sizeof(R"({"type":"com.abbottdiabetescare.informatics.sensorstart","extendedProperties":{"factoryTimestamp":"2022-06-18T05:57:19.000Z"},"recordNumber":-6629292502336274432,"timestamp":"2022-06-18T07:57:19.000+02:00"})")+EXTRALEN;

//int64_t recordnumbermask=-6629292502336274432L;
constexpr const  std::string_view datastart=R"({"DeviceData":{"deviceSettings":{"factoryConfig":{"UOM":")"; 
//s/char\(.*\)\[\]=R\(.*\)$/constexpr  std::string_view \1=R\2/g
constexpr const  std::string_view afterunit= R"("},"firmwareVersion":"2.3.0","miscellaneous":{"selectedLanguage":")";
constexpr const  std::string_view afterlocale=R"(","valueGlucoseTargetRangeLowInMgPerDl":)";
constexpr const  std::string_view afterlow=R"(,"valueGlucoseTargetRangeHighInMgPerDl":)";
constexpr const  std::string_view afterhigh=R"(,"selectedTimeFormat":")";
constexpr const  std::string_view aftertimeformat=R"(hr","selectedCarbType":"grams of carbs"},"timestamp":")";
const constexpr  std::string_view  aftercurrenttime=R"("},"header":{"device":{"modelName":"com.freestylelibre.app.de","uniqueIdentifier":")";
constexpr const  std::string_view  afterident= R"("}},"measurementLog":{"bloodGlucoseEntries":[],"capabilities":["scheduledContinuousGlucose","unscheduledContinuousGlucose","bloodGlucose","ketone","insulin","food","generic-com.abbottdiabetescare.informatics.exercise","generic-com.abbottdiabetescare.informatics.medication","generic-com.abbottdiabetescare.informatics.customnote","generic-com.abbottdiabetescare.informatics.ondemandalarm.low","generic-com.abbottdiabetescare.informatics.ondemandalarm.high","generic-com.abbottdiabetescare.informatics.ondemandalarm.projectedlow","generic-com.abbottdiabetescare.informatics.ondemandalarm.projectedhigh","generic-com.abbottdiabetescare.informatics.sensorstart","generic-com.abbottdiabetescare.informatics.error"],"device":{"modelName":"com.freestylelibre.app.de","uniqueIdentifier":")";
const constexpr  std::string_view  afterident2=R"("},"foodEntries":[],"genericEntries":[)";
const constexpr  std::string_view  afterlocalstartime=R"(],"insulinEntries":[],"ketoneEntries":[],"scheduledContinuousGlucoseEntries":[)";
constexpr const std::string_view afterhists=R"(],"unscheduledContinuousGlucoseEntries":[)";
//{"valueInMgPerDl":163.0,"extendedProperties":{"factoryTimestamp":"2022-06-20T20:49:33.000Z","trendArrow":"Stable","isActionable":true,"isFirstAfterTimeChange":false},"recordNumber":2304,"timestamp":"2022-06-20T22:49:33.000+02:00"},{"valueInMgPerDl":133.0,"extendedProperties":{"factoryTimestamp":"2022-06-20T21:15:01.000Z","trendArrow":"Stable","isActionable":true,"isFirstAfterTimeChange":false},"recordNumber":2560,"timestamp":"2022-06-20T23:15:01.000+02:00"}
const constexpr  std::string_view  afterscans=R"(]}},"UserToken":")";
const constexpr  std::string_view  aftertoken=R"(","Domain":"Libreview","GatewayType":"FSLibreLink.Android"})";

static int TdatestringGMT(time_t tim,char *buf) {
        struct tm tmbuf;
	gmtime_r(&tim, &tmbuf);
        return sprintf(buf,R"(%d-%02d-%02dT%02d:%02d:%02d.000Z)",tmbuf.tm_year+1900,tmbuf.tm_mon+1,tmbuf.tm_mday,tmbuf.tm_hour,tmbuf.tm_min,tmbuf.tm_sec);
        }

extern int Tdatestring(time_t tim,char *buf) ;
static int64_t mkhistrecord(const int64_t histor,const uint16_t id) {
	const int64_t uit=histor|id;
	return uit;
	}
struct LibreHistEl {
	uint32_t ti;
	uint16_t mgdL;
	uint16_t id;
	};
	

struct LibreHist {
	int64_t histor;
	LibreHistEl *list;
	int32_t size;
	uint32_t starttime;
	uint32_t notsend;
	};

static inline void	addstrview(char *&uitptr,const std::string_view indata) {
	memcpy(uitptr,indata.data(),indata.size());
	uitptr+=indata.size();
	}

inline static void valuestart(char *&ptr,float glvalue) {
	ptr+=sprintf(ptr, R"({"valueInMgPerDl":%.1f,"extendedProperties":{"factoryTimestamp":")",glvalue);
	}

//se},"recordNumber":-6629292502336270757,"timestamp":"2022-06-20T	
/*
#if sizeof(int64_t)==sizeof(long)
#define int64printf "%ld"
#else
#define int64printf "%lld"
#endif
*/
constexpr const char *int64printf() {
	 if constexpr(sizeof(int64_t)==sizeof(long))
		return "%ld";
	else
		return "%lld";
	}
static char *librehistel(const LibreHistEl *el,const int64_t histor,char *buf) {
	char *ptr=buf;
//	ptr+=sprintf(ptr, R"({"valueInMgPerDl":%.1f,"extendedProperties":{"factoryTimestamp":")",(float)el->mgdL);
	valuestart(ptr, (float)el->mgdL);
	ptr+=TdatestringGMT(el->ti,ptr);
	static constexpr const std::string_view prerecord=R"(","isFirstAfterTimeChange":false},"recordNumber":)"; 
	addstrview(ptr,prerecord);
	ptr+=sprintf(ptr,int64printf(),mkhistrecord(histor,el->id));
	static constexpr const std::string_view timestamp=R"(,"timestamp":")";
	addstrview(ptr,timestamp);
	ptr+=Tdatestring(el->ti,ptr);
	ptr+=sprintf(ptr,R"("})");
	return ptr;
	}




static char *libreScanel(const ScanData &scanel,const int16_t  nr,char *ptr) {
	static constexpr const char *const trendName[]{"Undetermined", "FallingQuickly", "Falling", "Stable", "Rising", "RisingQuickly"};
	valuestart(ptr, (float)scanel.getmgdL());
	ptr+=TdatestringGMT(scanel.gettime(),ptr);
	int16_t id=nr>>8|(nr&0xFF)<<8;
	ptr+=sprintf(ptr,R"(","trendArrow":"%s","isActionable":true,"isFirstAfterTimeChange":false},"recordNumber":%hd,"timestamp":")",trendName[scanel.tr],id);
	ptr+=Tdatestring(scanel.gettime(),ptr);
	ptr+=sprintf(ptr,R"("})");
	return ptr;
	}



 template<class T> static inline void	addstrcont(char *&uitptr,const T &indata) {
	memcpy(uitptr,indata.data(),indata.size());
	uitptr+=indata.size();
	}
static char *writelibrehists(LibreHist *hists,int size,char *buf) {
	char *ptr=buf;
	for(int i=size-1;i>=0;--i) {
		if(const int len=hists[i].size) {
			const LibreHistEl *list=hists[i].list;
			const int64_t histor=hists[i].histor;
			for(int j=0;j<len;j++) {
				ptr=librehistel(list+j,histor,ptr);
				*ptr++=',';
				}
			}
		}
	if(buf!=ptr)
	 	--ptr;
	return ptr;
	}

static LibreHist  librehistory(SensorGlucoseData *sensdata,uint32_t starttime,uint32_t nu) {
	const int notsend=sensdata->getinfo()->libreviewnotsend;
	#ifndef NDEBUG
	const time_t tim=starttime;
	LOGGER("%s librehistory notsend=%d from %s",sensdata->shortsensorname()->data(),notsend,ctime(&tim));
	#else
	#endif
//	int lasthistid=sensdata->getinfo()->libreviewid;
//	int notsend=0;
	const std::span<const ScanData> stream=sensdata->getPolldata() ;
	uint32_t streamlen= stream.size();
	if(streamlen<1||streamlen<=notsend) {
		LOGGER("no hist: streamlen=%d\n",streamlen);
		return {.notsend=streamlen};
		}

	const ScanData *laststream=&stream[streamlen-1];
	const ScanData *firststream=&stream[notsend];
	while(!laststream->valid()) {
		if(--laststream<firststream) {
			LOGGER("no hist: no data\n");
			return {.notsend=streamlen};
			}
		}
		
	int laststreamid=laststream->id;

	constexpr int periodmin=15;
	constexpr int periodright=15/2;
	int left=laststreamid%periodmin;
	if(left!=periodright) {
		int toid=laststreamid-((left>periodright)?(left-periodright):(periodmin-(periodright-left)));
		while(true) {
			--laststream;
			if(laststream<firststream) {
				LOGGER("no librehist no whole period\n");
				return {.notsend=static_cast<uint32_t>(notsend)};
				}
			if(laststream->valid()) {
				if(laststream->id<=toid) {
					laststreamid=laststream->id;
					break;
					}

				}
			}
		}
	LOGGER("laststreadid=%d\n",laststreamid);
	streamlen=laststream-&stream[0]+1;
	size_t leftstream=streamlen-notsend;
	const ScanData *found=(firststream->t<starttime)?sensdata->firstnotless({firststream,leftstream},starttime):firststream;
	int startid=0;
	if(found>&stream[0])  {
		const ScanData &prev=found[-1];
		if(prev.valid()) {
			startid=prev.id+1;
			}
		}
	while(true) {
		if(found>laststream)
			return {.notsend=streamlen};
		if(found->valid()) 
			break;
		++found;
		}; 
	if(!startid)
		startid=found->id;
	int histnum=(startid + periodright-1)/periodmin;
//	int histnum=(found->id + periodright-1)/periodmin;
	int previd= histnum*periodmin;
	int id=previd+periodmin;
	int firstid=previd+periodright+1;
	LOGGER("id=%d\n",id);
	while(true) {
		if(found->id>=firstid)	
			break;
		while(true) {
			++found;
			if(found>laststream)  {
				LOGGER("found >laststream notsend=%d\n",streamlen);
				return {.notsend=streamlen};
				}
			if(found->valid()) 
				break;
			}
		}


	int datalen=1+(laststreamid-previd)/periodmin;
	if(datalen<=0) {
		LOGGER("datalen=%d\n",datalen);
		return {.notsend=streamlen};
		}
	LibreHistEl *list=new LibreHistEl[datalen];
	if(!list)
		return {.notsend=static_cast<uint32_t>(found-stream.data())};
	int datuit=0;
	const ScanData *useddata=found-1;
	for(const ScanData *iter=found;iter<=laststream;) {
		uint64_t timesum=0L;
		double glusum=0.0;
		int num=0;
		const int nextid=id+periodright;
		if(nextid>laststreamid)
			break;
		for(;iter->id<=nextid;) {
			LOGGER("id %d\n",iter->id);
			timesum+=iter->t;
			glusum+=iter->g;
			useddata=iter;
			++num;
			do {
			   if(++iter>laststream)
				goto ENDINLOOP;
			    } while(!iter->valid());
			}
		ENDINLOOP:
		if(num) {
			list[datuit].ti=timesum/num;
			list[datuit].mgdL=(int16_t) round(glusum/num);
			list[datuit++].id=id;	
			LOGGER("in id=%d\n",id);
			}
		id+=periodmin;
		}
	extern int64_t libreviewHistor(const sensorname_t *sensorid) ;
	const int64_t histor=libreviewHistor(sensdata->shortsensorname());
	uint32_t newnotsend=useddata-stream.data()+1;
	LOGGER("send %d data notsend=%d\n",datuit,newnotsend);
	return {.histor=histor,.list=list,.size=datuit,.starttime=sensdata->getstarttime(),.notsend=newnotsend};
	}
/*
struct LibreHist {
	int64_t histor;
	LibreHistEl *list;
	int32_t size;
	uint32_t starttime;
	}; */


static int mksensorstart(int64_t recordnumbermask, time_t starttime,char *buf) {
//{"type":"com.abbottdiabetescare.informatics.sensorstart","extendedProperties":{"factoryTimestamp":"2022-06-18T05:57:19.000Z"},"recordNumber":-6629292502336274432,"timestamp":"2022-06-18T07:57:19.000+02:00"}
	static constexpr const char start[]=R"({"type":"com.abbottdiabetescare.informatics.sensorstart","extendedProperties":{"factoryTimestamp":")";
	static constexpr const int startlen=sizeof(start)-1;
	memcpy(buf,start,startlen);
	char *ptr=buf+startlen;
	ptr+=TdatestringGMT(starttime,ptr);
       static const char afterstartimeGMT[]= R"("},"recordNumber":)";
       static constexpr const int aftergmtlen=sizeof(afterstartimeGMT)-1;
       memcpy(ptr,afterstartimeGMT, aftergmtlen);
       ptr+= aftergmtlen;
 
       ptr+=sprintf(ptr,int64printf(),recordnumbermask);
	const char afterrecordmask[]=R"(,"timestamp":")";
	static constexpr const int afterrecordmasklen=sizeof(afterrecordmask)-1;
	memcpy(ptr,afterrecordmask,afterrecordmasklen);
	ptr+=afterrecordmasklen;
	ptr+=Tdatestring(starttime,ptr);
	constexpr const char end[]=R"("})";
	constexpr const int endlen=sizeof(end)-1;
	memcpy(ptr,end,endlen);
	ptr+=endlen;
	return ptr-buf;
	}

int mksensorstart(const LibreHist *list,char *buf);
int mksensorstart(int64_t recordnumbermask, time_t starttime,char *buf);
static int mksensorstart(const LibreHist &el,char *buf) {
	return mksensorstart(el.histor,el.starttime,buf);
	}
static int writelist(const LibreHist *list,const int len,char *buf,int (*func)(const LibreHist &el,char *buf)) {
	char *bufptr=buf;
	for(int i=len-1;i>=0;--i) {
		if(list[i].size) {
			bufptr+=func(list[i],bufptr);
			*bufptr++=',';
			}
		}
	if(bufptr!=buf)
		--bufptr;
	return bufptr-buf;
	}
static int makesensorstarts(const LibreHist *list,const int len,char *buf) {
	return writelist(list,len,buf,mksensorstart);
	}
constexpr const int scanelsize=sizeof(R"({"valueInMgPerDl":500.0,"extendedProperties":{"factoryTimestamp":"2022-06-20T16:26:06.000Z","trendArrow":"FallingQuickly","isActionable":true,"isFirstAfterTimeChange":false},"recordNumber":10256,"timestamp":"2022-06-20T18:26:06.000+02:00"},)");
#include <jni.h>

extern JNIEnv *getenv();

jclass libreviewclass=nullptr;
extern char *localestr;
extern bool hour24clock;

static bool	libresendmeasurements(const char *measurements,const int len) {
	static jmethodID  postmeasurements=getenv()->GetStaticMethodID(libreviewclass,"postmeasurements","([B)Z");
	auto env=getenv();
	jbyteArray uit=env->NewByteArray(len);
        env->SetByteArrayRegion(uit, 0, len,(const jbyte *)measurements);
	bool res=env->CallStaticBooleanMethod(libreviewclass,postmeasurements,uit);
	env->DeleteLocalRef(uit);
	return res;
	}

static bool putsensor(const char *sensorid);
bool sendlibreviewdata() {
 const   uint32_t nu=time(nullptr);
//	int period= 30*24*60*60;
//	int period= 90*24*60*60;
constexpr const	int period= 90*24*60*60;
	//int period= 8*60*60;

	uint32_t starttime=(settings->data()->lastlibretime)?(settings->data()->lastlibretime):(nu-period);
	extern Sensoren *sensors;

	vector<int> sensints=sensors->inperiod(starttime,nu); 
	const int senslen=sensints.size();
	LibreHist lists[senslen];
	int last=senslen-1;
	int histtotal=0;
	int periodsec=15*60;
	{
	uint32_t starttimeiter=starttime;
	for(int i=last;i>=0;i--) {
		int index=sensints[i];
		SensorGlucoseData *sensdata=sensors->gethist(index);
		const auto el=lists[i]=librehistory(sensdata,starttimeiter,nu);
		if(const auto elsize=el.size) {
			starttimeiter=el.list[elsize-1].ti+periodsec;
			histtotal+=elsize;
			}
		}
	}
	destruct _dest([&lists,senslen]{
		for(int i=0;i<senslen;i++)
			delete lists[i].list;
		});
	if(!histtotal)
		return true;
	for(int i=0;i<senslen;i++) {
		if(lists[i].size) {
			const int index=sensints[i];
			SensorGlucoseData *sensdata=sensors->gethist(index);
			if(!sensdata->getinfo()->putsensor) {
				if(!(sensdata->getinfo()->putsensor=putsensor(sensdata->shortsensorname()->data()))) {
					LOGGER("putsensor failed\n");
					return false;
					}
				LOGGER("putsensor succeeded\n");
				}
			else {
				LOGGER("putsensor already done\n");
				}
			break;
			}
		}
constexpr const int timeuitlen=sizeof(R"(2022-06-21T00:26:21.098+02:00)")-1;
constexpr const int deviceidlen=sizeof(R"(b76f19a9-d4a0-4d67-8999-56b89b0968ee)")-1;
					//  24ab418b-4f48-4841-92af-eec19e51d8cf
	const int usertokenlen= settings->data()->tokensize;
/*      const char deviceIDin[]="b76f19a9-d4a0-4d67-8999-56b89b0968ee";
     const std::array<const char,36> &deviceID=*reinterpret_cast<const std::array<const char,36> *>(deviceIDin);
   const char usertokenIN[]=R"(Ztu2/3qqaim/NmhN/wzMRlLuHCvDAb18E3htHXqB7arJCP2Da8wVkJfqsvQdVSXU89jy4GyVAy2qMWH1K4nRB7qAZpmWJ7nQte0RJll5G2v9BKMtGmEgeqMYPLjQ+5fQ/7a9TiwtU9zPGShSb5iibQ+npquzk96uILPOqxWbt4sBKc6H0YtXDA8JUkniTW5qxmtQT7U5Aik9i7Drdfn9Q3Yo4vQZ9Sz7oJU+B4z0mkNwQHbr9MbUxa2Td5f1HZMWr6vLYZtU9NvjoiOf7i26+tM+RqzRW/j8/2Pe9Xmmdu0gckbspUmfv/8mRtzUpZ/oO0hhuHQMSiTJlR6KJ+W81ELYbh6eRWlxuAJWhx1EOyCiBHfB05qakBKTNHhcZT4j28Cvyv30nrSg77djP+MfbSD9zf7z6OvUNHiScbPSTLmi3bt4DnZ4lCEwHLwaxGDHh8Y1cUdL1aV+F59wvlEwywxU1MYUxu49XkRYnHPQZx1gju1qS4p1ICwLW45obdOI)";
 const  std::array<const char,512> &usertoken=*reinterpret_cast<const std::array<const char,512>*>(usertokenIN); */
     const std::array<char,36> &deviceID=settings->data()->libreviewDeviceID;

	unsigned int interval=60*60*6;
	uint32_t scantime=0;
	for(int i=last;i>=0;i--) {
		if(lists[i].size) {
			scantime=lists[i].list[0].ti+interval;
			break;
			}
		}

constexpr const int unitlen=6;
	int numscans=nu-scantime;
	uint32_t nrscans=(numscans>0?(numscans/interval):0)+(senslen*2)+1;

	int totallen=histtotal*histelUitlen+ startsensorlen*senslen+datastart.size()+unitlen+
afterunit.size()+
afterlocale.size()+
afterlow.size()+10+
afterhigh.size()+4+
aftertimeformat.size()+6+timeuitlen+aftercurrenttime.size()+deviceidlen+afterident.size()+deviceidlen+ afterident2.size()+timeuitlen+
afterlocalstartime.size() +afterhists.size() + afterscans.size()+ usertokenlen+ aftertoken.size()+nrscans*scanelsize;
#ifndef NDEBUG
time_t tim=scantime;
	LOGGER("usertokenlen=%d histtotal=%d histelUitlen=%d senslen=%d nrscans=%u scanelsize=%d totallen=%d nu=%u scantime=%u %s",usertokenlen,histtotal,histelUitlen,senslen,nrscans,scanelsize,totallen,nu,scantime,ctime(&tim));
#endif
	char *uitbuf=new char[totallen+EXTRALEN*10];

	if(!uitbuf)
		return false;
     std::unique_ptr<char[]> bufdeleter(uitbuf);


	char *uitptr=uitbuf;
//	time_t nu=time(nullptr);
	addstrview(uitptr,datastart);
	addstrview(uitptr,settings->getunitlabel());
	addstrview(uitptr,afterunit);
	addstrview(uitptr,localestr);
	addstrview(uitptr,afterlocale);
	uitptr+=sprintf(uitptr,"%d",(int)round(settings->targetlow()/10.0));
	addstrview(uitptr,afterlow);
	uitptr+=sprintf(uitptr,"%d",(int)round(settings->targethigh()/10.0));
	addstrview(uitptr,afterhigh);
	uitptr+=sprintf(uitptr,"%d",hour24clock?24:12);
	addstrview(uitptr,aftertimeformat);
	uitptr+=Tdatestring(nu,uitptr);
	addstrview(uitptr,aftercurrenttime);

	addstrcont(uitptr,deviceID);
	addstrview(uitptr,afterident);
	addstrcont(uitptr,deviceID);
	addstrview(uitptr,afterident2);
	uitptr+=makesensorstarts(lists,senslen,uitptr);
	addstrview(uitptr,afterlocalstartime);
	uitptr=writelibrehists(lists,senslen,uitptr);
	addstrview(uitptr, afterhists);

	int scanids[senslen];
	LOGGER("before getscans len=%d\n",uitptr-uitbuf);
	char *wasuit=uitptr;
	int scansiter=0;
	for(int i=last;i>=0;i--) {
		if(lists[i].size)  {
			int index=sensints[i];
			SensorGlucoseData *sensdata=sensors->gethist(index);
			uint16_t id=sensdata->getinfo()->libreviewscan;
			auto  stream=sensdata->getPolldata();
			const ScanData *endstream=&stream[stream.size()];
			for(const ScanData *startstream=&stream[0];;) {
				const ScanData *found=sensdata->firstnotless({startstream,endstream},scantime);
				if(found==endstream) {
					do {
					    --found;
					    if(found<startstream)  {
						goto ENDSENSOR;
						}
					    } while(!found->valid()); 
					uitptr=libreScanel(*found, ++id,uitptr);
					++scansiter;
					*uitptr++=',';
					scantime+=interval;
					ENDSENSOR:
					scanids[i]=id;
					break;
					}
				const ScanData *wasfound=found;
				while(!found->valid()) {
					--found;
					if(found<startstream) {
						goto NEXTDATA;
						}
					}
				uitptr=libreScanel(*found, ++id,uitptr);
				++scansiter;
				*uitptr++=',';
				scantime+=interval;

				NEXTDATA:
				startstream=wasfound+1;
				}
			 }
		}
	if(uitptr>wasuit)
		--uitptr;
	LOGGER("scancount=%d after getscans len=%d\n",scansiter,uitptr-uitbuf);
	addstrview(uitptr, afterscans);
	LOGGER("usertoken=%d len=%d\n",usertokenlen,uitptr-uitbuf);
	memcpy(uitptr, settings->data()->libreviewUserToken,usertokenlen);
	uitptr+=usertokenlen;
	LOGGER("after usertoken len=%d\n",uitptr-uitbuf);
	addstrview(uitptr, aftertoken);
	*uitptr++='\0';
	const int uitlen=uitptr-uitbuf-1;
//	write(STDOUT_FILENO,uitbuf,uitlen);
	LOGGER("uitlen=%d\n",uitlen);
	logwriter(uitbuf,uitlen);
//#define  NOREALSEND 1
#ifdef NOREALSEND
	bool datasend=false;
#else
	bool datasend=libresendmeasurements(uitbuf,uitlen);
	if(datasend) {
		LOGGER("libresendmeasurements success\n");
		for(int i=last;i>=0;i--) {
			const int index=sensints[i];
			SensorGlucoseData *sensdata=sensors->gethist(index);
			sensdata->getinfo()->libreviewscan=scanids[i];
			sensdata->getinfo()->libreviewnotsend=lists[i].notsend;
			}
			
		for(int i=0;i<=last;i++) {
			if(lists[i].size) {
				int lastitem=lists[i].size-1;
				settings->data()->lastlibretime=lists[i].list[lastitem].ti;
				#ifndef NDEBUG
				time_t tim=settings->data()->lastlibretime;
				LOGGER("last item was %s",ctime(&tim));
				#endif
				break;
				}
			}
		}
	else
		LOGGER("libresendmeasurements failure\n");

#endif	
	return datasend;
	}
#include <jni.h>
#include <sys/prctl.h>
extern JNIEnv *getenv();

#include "datbackup.h"

Backup::condvar_t  librecondition;
void initlibreviewjni(JNIEnv *env) {
	const char librclassstr[]="tk/glucodata/Libreview";
	if(jclass cl=env->FindClass(librclassstr)) {
      		LOGGER("found %s\n",librclassstr);
		libreviewclass=(jclass)getenv()->NewGlobalRef(cl);
	       env->DeleteLocalRef(cl);
	       }
      else  {
      	LOGGER("FindClass(%s) failed\n",librclassstr);
      	}
       }
static bool initlibreconfig() {
	static jmethodID  libreconfig=getenv()->GetStaticMethodID(libreviewclass,"libreconfig","()Z");
	return   getenv()->CallStaticBooleanMethod(libreviewclass,libreconfig);
	}

static bool putsensor(const char *sensorid) {
	JNIEnv *env=getenv();
	static jmethodID  putsensor=env->GetStaticMethodID(libreviewclass,"putsensor","(Ljava/lang/String;)Z");
	const jstring jsensorid= env->NewStringUTF(sensorid);
	bool res=env->CallStaticBooleanMethod(libreviewclass,putsensor,jsensorid);
        env->DeleteLocalRef(jsensorid);
	return res;
	}
static bool libreviewrunning=false;
void libreviewthread() {
	libreviewrunning=true;
	const char view[]{"VIEW"};
       prctl(PR_SET_NAME, view, 0, 0, 0);
	LOGGERN(view,sizeof(view)-1);
	int waitmin=10;
	while(true) {
		  if(!librecondition.dobackup) {
		        std::unique_lock<std::mutex> lck(librecondition.backupmutex);
			LOGGER("VIEW before lock\n");
 			auto now = std::chrono::system_clock::now();
//			auto status=librecondition.backupcond.wait_for(lck,std::chrono::minutes(waitmin));    //inreality much longer if phone is in doze mode.
			auto status=librecondition.backupcond.wait_until(lck, now + std::chrono::minutes(waitmin));
//			librecondition.backupcond.wait(lck, [] {return librecondition.dobackup; });   
			LOGGER("VIEW after lock %stimeout\n",(status==std::cv_status::no_timeout)?"no-":"");
			}
		if(librecondition.dobackup&Backup::wakeend) {
			librecondition.dobackup=0;
			libreviewrunning=false;
			LOGGER("end libreviewthread\n");
			return;
			}
		librecondition.dobackup=0;
		if(!settings->data()->libreinit)
	{
			if(!(settings->data()->libreinit=initlibreconfig())) {
				LOGGER("initlibreconfig failed\n");
				continue;
				}
			}
		if(sendlibreviewdata()) {
			waitmin=5*60;
			}
		else
			waitmin=15;
		}
	}

/*
extern void wakelibre();
void wakelibre() {
	if(libreviewrunning)
		librecondition.wakebackup(Backup::wakeall);
	}
*/
extern void wakeaftermin(const int waitmin) ;
void wakeaftermin(const int waitmin) {
	if(libreviewrunning) {
		if(waitmin) {
			 uint32_t now=time(nullptr);
			 uint32_t prevwake=settings->data()->lastlibretime;
			 if((now-prevwake)<60*waitmin)
			 	return;
			 }
		librecondition.wakebackup(Backup::wakeall);
		}
 }

void clearlibregegs() {
	settings->data()->libreinit=false;
	settings->data()->lastlibretime=0;
	sensors->onallsensors([](SensorGlucoseData *sens) {
		auto *info=sens->getinfo();
		info->putsensor=false;
		info->libreviewscan=0;
		info->libreviewnotsend=0;
		});

	}
#include "fromjava.h"

extern "C" JNIEXPORT void JNICALL fromjava(clearlibreview) (JNIEnv *env, jclass clazz) {
	clearlibregegs();
	}
extern "C" JNIEXPORT void JNICALL fromjava(wakelibreview) (JNIEnv *env, jclass clazz,int minutes) {
	wakeaftermin(minutes) ;
	}



#include <thread>
void startlibrethread() {
	if(!libreviewrunning) {
		std::thread libre(libreviewthread);
		libre.detach();
		}
	}
void endlibrethread() {
	if(libreviewrunning) {
		librecondition.wakebackup(Backup::wakeend);
		}
	}
extern "C" JNIEXPORT jboolean  JNICALL   fromjava(getuselibreview)(JNIEnv *env, jclass cl) {
	 return settings->data()->uselibre; 
	}

extern "C" JNIEXPORT void  JNICALL   fromjava(setuselibreview)(JNIEnv *env, jclass cl,jboolean val) {
	 settings->data()->uselibre=val; 
	 if(val)
		 startlibrethread();
	else
		endlibrethread();
	}

/*
int makesensorstarts(const LibreHist *list,const int len,char *buf) {
	char *bufptr=buf;
	for(int i=len-1;;) {

		bufptr+=mksensorstart(list[i].histor,list[i].starttime,bufptr);
		if(i) {
			*bufptr++=',';
			--i;
			}
		else {
			break;
			}
		}
	return bufptr-buf;
	} */



#endif
