#pragma once
#include <cstdint>
#include <vector>
#include <string>
#include <stdexcept>
#include <cstring>
#include <limits>

namespace apio {
using Bytes=std::vector<uint8_t>;
constexpr size_t maxSource=200ULL*1024*1024;
inline void bounds(const Bytes& b,size_t at,size_t n){if(at>b.size()||n>b.size()-at)throw std::runtime_error("ORIGIN_TRUNCATED");}
inline uint16_t u16(const Bytes& b,size_t at){bounds(b,at,2);return uint16_t(b[at])|(uint16_t(b[at+1])<<8);}
inline uint32_t u32(const Bytes& b,size_t at){bounds(b,at,4);uint32_t n=0;for(unsigned i=0;i<4;i++)n|=uint32_t(b[at+i])<<(8*i);return n;}
inline uint64_t u64(const Bytes& b,size_t at){bounds(b,at,8);uint64_t n=0;for(unsigned i=0;i<8;i++)n|=uint64_t(b[at+i])<<(8*i);return n;}
inline void put32(Bytes& b,size_t at,uint32_t n){bounds(b,at,4);for(unsigned i=0;i<4;i++)b[at+i]=uint8_t(n>>(8*i));}
inline void put64(Bytes& b,size_t at,uint64_t n){bounds(b,at,8);for(unsigned i=0;i<8;i++)b[at+i]=uint8_t(n>>(8*i));}
inline Bytes slice(const Bytes& b,size_t at,size_t n){bounds(b,at,n);return Bytes(b.begin()+at,b.begin()+at+n);}
inline std::string hex(const Bytes& b){static const char* h="0123456789abcdef";std::string s;s.reserve(b.size()*2);for(auto c:b){s+=h[c>>4];s+=h[c&15];}return s;}
inline std::string hex(const std::string& s){return hex(Bytes(s.begin(),s.end()));}
struct Range {size_t offset,size;};
class CheckedReader {
 const Bytes& bytes;size_t at=0;
public:
 explicit CheckedReader(const Bytes& b,size_t start=0):bytes(b),at(start){bounds(b,start,0);}
 size_t position()const{return at;}
 Range block(){
  bounds(bytes,at,5);auto size=u32(bytes,at);if(bytes[at+4]!=10)throw std::runtime_error("ORIGIN_DELIMITER");at+=5;
  bounds(bytes,at,size);const auto start=at;
  if(size){bounds(bytes,at,size_t(size)+1);if(bytes[at+size]!=10)throw std::runtime_error("ORIGIN_DELIMITER");at+=size+1;}
  return {start,size};
 }
};
struct ColumnBytes {bool supported=false;size_t rows=0;Bytes values,tags,offsets,text;};
inline ColumnBytes decodeColumn(const Bytes& data,uint8_t cellSize,uint16_t type){
 if(!cellSize||data.size()%cellSize)throw std::runtime_error("ORIGIN_CELL_SIZE");
 ColumnBytes c;c.rows=data.size()/cellSize;
 if(!((cellSize==8&&type==1)||(cellSize==10&&(type==0x6121||type==0x5121))))return c;
 if(c.rows>maxSource/8)throw std::runtime_error("ORIGIN_TOO_LARGE");
 c.supported=true;c.values.resize(c.rows*8);c.tags.resize(c.rows);c.offsets.resize((c.rows+1)*4);
 for(size_t row=0;row<c.rows;row++){
  put32(c.offsets,row*4,uint32_t(c.text.size()));
  if(cellSize==10&&data[row*10]>1){c.supported=false;return c;}
  if(cellSize==10&&data[row*10]==1){
   c.tags[row]=2;for(size_t i=2;i<10&&data[row*10+i];i++)c.text.push_back(data[row*10+i]);
  }else{
   const auto bits=u64(data,row*cellSize+(cellSize==10?2:0));put64(c.values,row*8,bits);
   // The missing sentinel is data, never a numeric near-zero sample.
   if(bits==0x81aa74fe1c132c0eULL)c.tags[row]=1;
  }
 }
 put32(c.offsets,c.rows*4,uint32_t(c.text.size()));return c;
}
}
