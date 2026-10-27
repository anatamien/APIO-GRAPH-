#include "checked-reader.hpp"
#include "protocol.hpp"
#include <iostream>
#include <functional>
#include <sstream>

static void check(bool ok,const char* message){if(!ok)throw std::runtime_error(message);}
static void rejects(const std::function<void()>& f){try{f();}catch(const std::runtime_error&){return;}throw std::runtime_error("unsafe input accepted");}
int main(){try{
 using namespace apio;
 // Literal framed data: LE length=3, LF, 3 payload bytes, LF, zero terminator.
 Bytes b{3,0,0,0,10,1,2,3,10,0,0,0,0,10};CheckedReader r(b);
 const auto block=r.block();check(block.offset==5&&block.size==3&&r.position()==9,"wrong frame");
 check(r.block().size==0&&r.position()==14,"zero marker");rejects([&]{r.block();});
 for(const Bytes& bad:std::vector<Bytes>{{255,255,255,255,10},{3,0,0,0,10,1},{1,0,0,0,0,1,10},{1,0,0,0,10,1,0}})rejects([&]{CheckedReader x(bad);x.block();});
 rejects([&]{u32(b,b.size()-1);});rejects([&]{slice(b,10,100);});
 Bytes p(40);put64(p,0,0x8000000000000000ULL);put64(p,8,1);put64(p,16,0x81aa74fe1c132c0eULL);put64(p,24,0x7ff800000000002aULL);
 check(u64(p,0)==0x8000000000000000ULL&&u64(p,8)==1,"f64 bits changed");
 const auto numeric=decodeColumn(p,8,1);check(numeric.values==p&&numeric.tags[2]==1&&numeric.tags[3]==0,"sentinel/payload changed");
 check(hex(Bytes{0,14,255})=="000eff","raw text changed");
 // A mixed cell has two prefix bytes; never compact its physical row.
 Bytes mixed{1,0,65,14,66,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0};
 const auto c=decodeColumn(mixed,10,0x6121);
 check(c.rows==2&&c.tags[0]==2&&c.tags[1]==0&&c.text==Bytes({65,14,66}),"mixed text/row lost");
 check(u32(c.offsets,0)==0&&u32(c.offsets,4)==3&&u32(c.offsets,8)==3,"text offsets");
 rejects([&]{decodeColumn(mixed,0,0x6121);});rejects([&]{decodeColumn(Bytes{1},8,1);});
 const auto unsupported=decodeColumn(Bytes{1,2,3,4},4,0xffff);
 check(!unsupported.supported,"unknown numeric type reinterpreted");
 std::ostringstream stream(std::ios::binary);Protocol protocol(stream);protocol.frame(4,Bytes{0,255});
 const auto output=stream.str();check(output.size()==15&&output.substr(0,8)=="APIOOIM1"&&uint8_t(output[8])==3&&uint8_t(output[12])==4&&uint8_t(output[14])==255,"protocol framing changed bytes");
 rejects([&]{protocol.frame(2,Bytes(8*1024*1024));});
 std::cout<<"Origin checked-reader: all cases passed\n";return 0;
 }catch(const std::exception&e){std::cerr<<e.what()<<'\n';return 1;}}
