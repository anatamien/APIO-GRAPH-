#pragma once
#include <string>
int sandboxRun(const std::string& source,bool probe=false,const std::string& canary="",unsigned port=0);
int sandboxProbe(const std::string& canary,unsigned port);
