#pragma once
#include "checked-reader.hpp"
#include <ostream>
namespace apio {
class Protocol {
 std::ostream& out;
public:
 explicit Protocol(std::ostream& stream):out(stream){out.write("APIOOIM1",8);}
 void frame(uint8_t kind,const Bytes& bytes){
  if(bytes.size()>=8*1024*1024)throw std::runtime_error("ORIGIN_PROTOCOL_LIMIT");
  Bytes header(5);put32(header,0,uint32_t(bytes.size()+1));header[4]=kind;
  out.write(reinterpret_cast<const char*>(header.data()),header.size());
  if(!bytes.empty())out.write(reinterpret_cast<const char*>(bytes.data()),bytes.size());
  out.flush();if(!out)throw std::runtime_error("ORIGIN_PROTOCOL_WRITE");
 }
 void json(uint8_t kind,const std::string& value){frame(kind,Bytes(value.begin(),value.end()));}
 void resource(uint32_t id,const Bytes& bytes){
  constexpr size_t chunk=1024*1024;size_t offset=0;
  do{const size_t length=std::min(chunk,bytes.size()-offset);Bytes part(12+length);put32(part,0,id);put32(part,4,uint32_t(offset));put32(part,8,uint32_t(bytes.size()));if(length)std::memcpy(part.data()+12,bytes.data()+offset,length);frame(2,part);offset+=length;}while(offset<bytes.size());
 }
};
inline std::string quote(const std::string& text){
 std::string out="\"";const char*h="0123456789abcdef";
 for(unsigned char c:text){if(c=='"'||c=='\\'){out+='\\';out+=c;}else if(c<32||c>=127){out+="\\u00";out+=h[c>>4];out+=h[c&15];}else out+=c;}return out+'"';
}
inline std::string rangeJson(uint64_t at,uint64_t n){return "{\"offset\":"+std::to_string(at)+",\"length\":"+std::to_string(n)+"}";}
}
