#pragma once
#include <string>
#include <cmath>
#include <stdexcept>
namespace apio {
struct OriginProfile {unsigned build;double version;};
// Explicitly exercised legacy OPJ families. A newer header never silently selects one.
inline OriginProfile originProfile(const std::string& header,double version){
 const OriginProfile profiles[]={{2878,8.0724},{3116,9.200272},{3168,9.300226},{3478,9.850212},{3522,9.900225},{3551,9.950167}};
 if(header.rfind("CPYA 4,",0)!=0&&header.rfind("CPYA 4.",0)!=0)throw std::runtime_error("ORIGIN_UNVERIFIED_PROFILE");
 const auto separator=header.find_first_of(",.",5);if(separator==std::string::npos)throw std::runtime_error("ORIGIN_UNVERIFIED_PROFILE");
 const auto text=header.substr(separator+1);size_t consumed=0;const auto build=std::stoul(text,&consumed);if(consumed<text.size()&&text[consumed]!=' ')throw std::runtime_error("ORIGIN_UNVERIFIED_PROFILE");
 for(const auto& p:profiles)if(p.build==build&&std::isfinite(version)&&std::abs(version-p.version)<1e-10)return p;
 throw std::runtime_error("ORIGIN_UNVERIFIED_PROFILE");
}
}
