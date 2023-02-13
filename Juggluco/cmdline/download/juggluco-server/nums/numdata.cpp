#include "nums/numdata.h"
#include <vector>
std::vector<Numdata*> numdatas;

#include "net/passhost.h"
//bool update(int sock,int &len, struct numspan *ch) 
int updatenums(crypt_t*pass,int sock,struct changednums *nums) {
	int ret=0;
	for(int i=0;i<numdatas.size();i++) {
		if(int subret=numdatas[i]->update(pass,sock,nums)) 
			ret|=subret;
		else
			return 0;
		}
#ifdef USE_MEAL
	if(int did=meals->datameal()->updatemeal(pass,sock,nums[0].lastmeal))
		return ret|did;
	return 0;
#else	
	return ret;
#endif
	}
	/*
void remakenums() {
	for(auto*el:numdatas) 
		el->remake();
	} */

bool happened(uint32_t stime,int type,float value)  {
	for(auto*el:numdatas) 
		if(el->happened(stime,type,value))
			return true;
	return false;
	}


bool receivelastpos(const lastpos_t *data) {
	if(numdatas.size()<2)
		return false;
	numdatas[data->dbase]->setlastpos(data->lastpos);
	return true;
	}

bool backupnums(const struct numsend* innums) { 
	if(numdatas.size()<2)
		return false;
	return numdatas[innums->dbase]->backupnums(innums);
	}
bool backupnuminit(const numinit *numst) {
	if(numdatas.size()<2)
		return false;
	return numdatas[(bool)(numst->ident)]->numbackupinit(numst);
	}

bool numsbackupsendinit(crypt_t*pass,int sock,struct changednums *nuall,uint32_t starttime) {
	for(auto*el:numdatas) 
		if(!el->backupsendinit(pass,sock,nuall,starttime) )
			return false;
	return true;
	}
int sendlastnum(const int dbase) {
	if(numdatas.size()<2)
		return -1;
	return numdatas[dbase]->getlastpos();
	}

