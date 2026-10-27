// APIO Origin structural helper. Input is broker-staged; stdout is bounded binary IPC.
#include "OriginAnyParser.h"
#include "protocol.hpp"
#include "sandbox.hpp"
#include "profiles.hpp"
#include <filesystem>
#include <fstream>
#include <map>
#include <set>
#include <algorithm>
#include <iostream>
#include <sstream>
#include <cmath>
#ifdef _WIN32
#include <io.h>
#include <fcntl.h>
#endif
using namespace apio;
using namespace Origin;
namespace {
std::string attachmentType(const Bytes& payload){
 const std::string bytes(payload.begin(),payload.begin()+std::min(size_t(16),payload.size()));
 if(bytes.size()>=8&&bytes.compare(0,8,"\x89PNG\r\n\x1a\n",8)==0)return "image/png";
 if(bytes.size()>=3&&static_cast<unsigned char>(bytes[0])==255&&static_cast<unsigned char>(bytes[1])==216&&static_cast<unsigned char>(bytes[2])==255)return "image/jpeg";
 if(bytes.compare(0,6,"GIF87a")==0||bytes.compare(0,6,"GIF89a")==0)return "image/gif";
 if(bytes.size()>=14&&bytes.compare(0,2,"BM")==0)return "image/bmp";
 if(bytes.compare(0,5,"%PDF-")==0)return "application/pdf";
 if(bytes.size()>=4&&bytes.compare(0,4,"PK\x03\x04",4)==0)return "application/zip";
 return "";
}
struct DatasetBlock {Range header,data,mask;ColumnBytes cells;uint16_t type;uint8_t cellSize;};
std::string caps(bool extracted,const std::string& reason=""){
 return "{\"recognized\":true,\"extracted\":"+std::string(extracted?"true":"false")+",\"rendered\":false,\"editable\":false,\"recalculable\":false,\"archived\":false,\"unsupportedReason\":"+(reason.empty()?"null":quote(reason))+"}";
}
std::string array(const std::vector<std::string>& values){std::string out="[";for(const auto& v:values){if(out.size()>1)out+=',';out+=v;}return out+"]";}
std::string number(double v){if(!std::isfinite(v))return "null";std::ostringstream out;out.precision(17);out<<v;return out.str();}
std::string rect(const Rect& r){return "["+std::to_string(r.left)+","+std::to_string(r.top)+","+std::to_string(r.right)+","+std::to_string(r.bottom)+"]";}
std::string windowProperties(const Window& w){return "\"labelHex\":"+quote(hex(w.label))+",\"hidden\":"+(w.hidden?"true":"false")+",\"state\":"+std::to_string(w.state)+",\"frame\":"+rect(w.frameRect)+",\"created\":"+std::to_string(int64_t(w.creationDate))+",\"modified\":"+std::to_string(int64_t(w.modificationDate));}
std::string color(const Color& c){
 const char* palette[]={"#000000","#FF0000","#00FF00","#0000FF","#00FFFF","#FF00FF","#FFFF00","#808000","#000080","#800080","#800000","#008000","#008080","#0000A0","#FF8000","#8000FF","#FF0080","#FFFFFF","#C0C0C0","#808080","#FFFF80","#80FFFF","#FF80FF","#404040"};
 if(c.type==Color::Regular&&c.regular<24)return quote(palette[c.regular]);
 if(c.type==Color::Custom){const char* h="0123456789ABCDEF";std::string out="#";for(auto b:c.custom){out+=h[b>>4];out+=h[b&15];}return quote(out);}return "null";
}
std::string columnLabels(const std::string& comment){
 const auto end=comment.find("\r\n");if(end==std::string::npos)return "";
 auto unit=comment.substr(end+2);const auto line=unit.find("\r\n");if(line!=std::string::npos)unit.resize(line);const auto storage=unit.find("@${");if(storage!=std::string::npos)unit.resize(storage);
 return ",\"longNameHex\":"+quote(hex(comment.substr(0,end)))+",\"unitHex\":"+quote(hex(unit));
}
std::string axis(const GraphAxis& a){return "{\"min\":"+number(a.min)+",\"max\":"+number(a.max)+",\"step\":"+number(a.step)+",\"tickDecimals\":"+number(a.tickAxis[0].decimalPlaces)+",\"tickFormat\":"+number(a.tickAxis[0].valueTypeSpecification)+",\"scale\":"+std::to_string(a.scale)+",\"grid\":"+(a.majorGrid.hidden?"false":"true")+",\"minorDivisions\":"+std::to_string(a.minorTicks)+",\"strokeWidth\":"+number(a.formatAxis[0].thickness)+",\"labelsVisible\":"+(a.tickAxis[0].showMajorLabels?"true":"false")+",\"lineVisible\":"+(a.formatAxis[0].hidden?"false":"true")+",\"oppositeHidden\":"+(a.formatAxis[1].hidden?"true":"false")+"}";}
struct Output {
 Protocol protocol;std::vector<std::string> nodes,columns,resources,relations,diagnostics,ranges;uint32_t nextResource=0;size_t total=0;
 explicit Output(std::ostream& out):protocol(out){}
 std::string resource(const std::string& kind,const Bytes& bytes){
  if(resources.size()>=100000||bytes.size()>maxSource||total>1024ULL*1024*1024-bytes.size())throw std::runtime_error("ORIGIN_RESOURCE_LIMIT");
  const auto index=nextResource++;const auto id="r"+std::to_string(index);protocol.resource(index,bytes);total+=bytes.size();
  resources.push_back("{\"id\":"+quote(id)+",\"kind\":"+quote(kind)+",\"size\":"+std::to_string(bytes.size())+"}");return quote(id);
 }
 void node(const std::string& id,const std::string& parent,const std::string& kind,const std::string& name,const std::string& source,const std::string& properties,bool extracted=true,const std::string& reason="",const std::string& provenance="[]"){
  if(nodes.size()>=100000)throw std::runtime_error("ORIGIN_TOO_MANY_OBJECTS");
  nodes.push_back("{\"id\":"+quote(id)+",\"parentId\":"+(parent.empty()?"null":quote(parent))+",\"kind\":"+quote(kind)+",\"nameHex\":"+quote(hex(name))+",\"sourceId\":"+(source.empty()?"null":quote(source))+",\"properties\":{"+properties+"},\"capabilities\":"+caps(extracted,reason)+",\"provenance\":"+provenance+"}");
 }
 void warning(const std::string& code,const std::string& node="",const std::string& offset="null"){diagnostics.push_back("{\"code\":"+quote(code)+",\"severity\":\"warning\",\"nodeId\":"+(node.empty()?"null":quote(node))+",\"offset\":"+offset+"}");}
 void relation(const std::string& from,unsigned id,const std::string& kind,const std::set<unsigned>& datasetIDs){
  if(!id)return;const bool resolved=datasetIDs.count(id-1)>0;
  relations.push_back("{\"id\":"+quote(from+":"+kind)+",\"from\":"+quote(from)+",\"to\":"+(resolved?quote("column:"+std::to_string(id-1)):"null")+",\"sourceTargetId\":"+quote(std::to_string(id))+",\"kind\":"+quote(kind)+",\"resolved\":"+(resolved?"true":"false")+"}");
 }
};
void textNode(Output& o,const TextBox& t,const std::string& id,const std::string& parent){o.node(id,parent,"text",t.text,"","\"textHex\":"+quote(hex(t.text))+",\"frame\":"+rect(t.clientRect)+",\"fontSize\":"+number(t.fontSize)+",\"rotation\":"+number(t.rotation)+",\"color\":"+color(t.color)+",\"shown\":"+(t.shown?"true":"false")+",\"attach\":"+std::to_string(t.attach),true,"VISUAL_UNVERIFIED");}
}
int runDecoder(int argc,char** argv){
 try{
  if(argc>=3&&std::string(argv[1])=="--sandbox")return sandboxRun(argv[2]);
  if(argc==5&&std::string(argv[1])=="--sandbox-probe")return sandboxRun(argv[2],true,argv[3],unsigned(std::stoul(argv[4])));
  if(argc==4&&std::string(argv[1])=="--probe")return sandboxProbe(argv[2],unsigned(std::stoul(argv[3])));
  if(argc!=2)throw std::runtime_error("ORIGIN_ARGUMENTS");
#ifdef _WIN32
  _setmode(_fileno(stdout),_O_BINARY);
#endif
  const auto path=std::filesystem::u8path(argv[1]);const auto size=std::filesystem::file_size(path);if(size>maxSource)throw std::runtime_error("ORIGIN_TOO_LARGE");
  Bytes raw(size);std::ifstream input(path,std::ios::binary);input.read(reinterpret_cast<char*>(raw.data()),raw.size());if(!input)throw std::runtime_error("ORIGIN_READ");
  const auto lf=std::find(raw.begin(),raw.begin()+std::min(raw.size(),size_t(512)),10);if(lf==raw.begin()+std::min(raw.size(),size_t(512)))throw std::runtime_error("ORIGIN_SIGNATURE");
  const std::string signature(raw.begin(),lf);
  CheckedReader reader(raw,size_t(lf-raw.begin())+1);const auto global=reader.block();if(global.size<0x23)throw std::runtime_error("ORIGIN_HEADER");
  const auto bits=u64(raw,global.offset+0x1b);double version;std::memcpy(&version,&bits,8);const auto profile=originProfile(signature,version);if(reader.block().size)throw std::runtime_error("ORIGIN_HEADER");
  std::vector<DatasetBlock> blocks;std::vector<Range> knownData;
  while(true){const auto h=reader.block();if(!h.size)break;if(h.size<0x73)throw std::runtime_error("ORIGIN_COLUMN_HEADER");const auto d=reader.block(),m=reader.block();
   const auto type=u16(raw,h.offset+0x16);const auto cellSize=raw[h.offset+0x3d];auto values=decodeColumn(slice(raw,d.offset,d.size),cellSize,type);
   blocks.push_back({h,d,m,std::move(values),type,cellSize});if(blocks.size()>100000)throw std::runtime_error("ORIGIN_TOO_MANY_OBJECTS");if(blocks.back().cells.supported)knownData.push_back(d);
  }
  OriginAnyParser parser(path.u8string());parser.buildVersion=profile.build;if(!parser.parse())throw std::runtime_error("ORIGIN_PARSE");
  Output o(std::cout);o.protocol.json(3,"{\"stage\":\"resources\"}");o.warning("VISUAL_EQUIVALENCE_UNVERIFIED");o.warning("INVENTORY_PARTIAL");for(const auto& warning:parser.sourceWarnings)o.warning(warning);
  std::map<int,std::string> windowIDs;std::map<unsigned,const SpreadColumn*> metadata;
  auto columns=[&](const SpreadSheet& sheet,const std::string& parent){
   for(const auto& c:sheet.columns){const auto id="column:"+std::to_string(c.index);if(metadata.count(c.index))throw std::runtime_error("ORIGIN_DUPLICATE_ID");metadata[c.index]=&c;
    o.node(id,parent,"column",c.name,std::to_string(c.index),"\"columnOrder\":"+std::to_string(c.sourceDisplayOrder)+",\"datasetNameHex\":"+quote(hex(c.dataset_name))+",\"commandHex\":"+quote(hex(c.command))+",\"commentHex\":"+quote(hex(c.comment))+columnLabels(c.comment)+",\"declaredRows\":"+std::to_string(c.numRows)+",\"beginRow\":"+std::to_string(c.beginRow)+",\"endRow\":"+std::to_string(c.endRow)+",\"originValueType\":"+std::to_string(c.valueType)+",\"significantDigits\":"+std::to_string(c.significantDigits)+",\"decimalPlaces\":"+std::to_string(c.decimalPlaces),true,c.command.empty()?"":"FORMULA_PASSIVE");
   }
  };
  auto addSheet=[&](const SpreadSheet& s,const std::string& id,const std::string& parent){o.node(id,parent,"worksheet",s.name,std::to_string(s.objectID),windowProperties(s)+",\"declaredMaxRows\":"+std::to_string(s.maxRows));columns(s,id);};
  for(size_t i=0;i<parser.spreadSheets.size();i++){const auto& s=parser.spreadSheets[i];const auto id="worksheet:"+std::to_string(i);windowIDs[s.objectID]=id;addSheet(s,id,"");}
  for(size_t i=0;i<parser.excels.size();i++){const auto& w=parser.excels[i];const auto id="workbook:"+std::to_string(i);windowIDs[w.objectID]=id;o.node(id,"","workbook",w.name,std::to_string(w.objectID),windowProperties(w));for(size_t j=0;j<w.sheets.size();j++)addSheet(w.sheets[j],id+":sheet:"+std::to_string(j),id);}
  std::set<unsigned> specialBlocks;std::map<int,std::string> noteIDs;
  for(size_t mi=0;mi<parser.matrixes.size();mi++){const auto& matrix=parser.matrixes[mi];const auto mid="matrix:"+std::to_string(mi);windowIDs[matrix.objectID]=mid;o.node(mid,"","matrix",matrix.name,std::to_string(matrix.objectID),windowProperties(matrix),false,"MATRIX_RENDERING_UNSUPPORTED");
   for(size_t si=0;si<matrix.sheets.size();si++){const auto& sheet=matrix.sheets[si];specialBlocks.insert(sheet.index);std::string props="\"rows\":"+std::to_string(sheet.rowCount)+",\"columns\":"+std::to_string(sheet.columnCount)+",\"commandHex\":"+quote(hex(sheet.command));if(sheet.index<blocks.size()&&blocks[sheet.index].cells.supported){const auto& b=blocks[sheet.index];props+=",\"values\":"+o.resource("f64",b.cells.values)+",\"tags\":"+o.resource("tags",b.cells.tags);}o.node(mid+":sheet:"+std::to_string(si),mid,"matrix",sheet.name,std::to_string(sheet.index),props,false,"MATRIX_RENDERING_UNSUPPORTED");}
  }
  for(size_t ni=0;ni<parser.notes.size();ni++){const auto& note=parser.notes[ni];const auto nid="note:"+std::to_string(ni);noteIDs[note.objectID]=nid;o.node(nid,"","note",note.name,std::to_string(note.objectID),windowProperties(note)+",\"textHex\":"+quote(hex(note.text)),true,"SCRIPT_PASSIVE");}
  for(size_t fi=0;fi<parser.functions.size();fi++){const auto& function=parser.functions[fi];specialBlocks.insert(function.index);o.node("function:"+std::to_string(fi),"","note",function.name,std::to_string(function.index),"\"textHex\":"+quote(hex(function.formula))+",\"functionType\":"+std::to_string(function.type)+(function.index<blocks.size()?",\"resourceId\":"+o.resource("opaque",slice(raw,blocks[function.index].data.offset,blocks[function.index].data.size)):""),true,"FORMULA_PASSIVE");}
  const char* roles[]={"X","Y","Z","XErr","YErr","Label","unknown"};std::set<unsigned> datasetIDs;
  for(size_t i=0;i<blocks.size();i++){
   auto& block=blocks[i];if(specialBlocks.count(unsigned(i)))continue;const auto id="column:"+std::to_string(i);datasetIDs.insert(unsigned(i));
   if(!metadata.count(unsigned(i))){const auto n=slice(raw,block.header.offset+0x58,25);o.node(id,"","column",std::string(n.begin(),std::find(n.begin(),n.end(),0)),std::to_string(i),"",false,"COLUMN_METADATA_UNRESOLVED");}
   if(!block.cells.supported){o.warning("COLUMN_TYPE_UNSUPPORTED",id);continue;}
   const auto values=o.resource("f64",block.cells.values),tags=o.resource("tags",block.cells.tags),offsets=o.resource("offsets",block.cells.offsets),text=o.resource("text",block.cells.text);
   const auto it=metadata.find(unsigned(i));const int role=it==metadata.end()?6:int(it->second->type);
   o.columns.push_back("{\"nodeId\":"+quote(id)+",\"rowCount\":"+std::to_string(block.cells.rows)+",\"values\":"+values+",\"tags\":"+tags+",\"textOffsets\":"+offsets+",\"textBytes\":"+text+",\"role\":"+quote(roles[role>=0&&role<7?role:6])+",\"originType\":"+quote(std::to_string(block.type))+"}");
   if(block.mask.size){const auto resource=o.resource("opaque",slice(raw,block.mask.offset,block.mask.size));o.node(id+":mask",id,"opaque","",std::to_string(i),"\"resourceId\":"+resource,false,"MASK_SEMANTICS_UNVERIFIED","["+rangeJson(block.mask.offset,block.mask.size)+"]");o.warning("MASK_SEMANTICS_UNVERIFIED",id);}
  }
  for(size_t gi=0;gi<parser.graphs.size();gi++){
   const auto& g=parser.graphs[gi];const auto gid="graph:"+std::to_string(gi);windowIDs[g.objectID]=gid;
   o.node(gid,"","graph",g.name,std::to_string(g.objectID),windowProperties(g)+",\"widthOriginUnits\":"+std::to_string(g.width)+",\"heightOriginUnits\":"+std::to_string(g.height)+",\"connectMissingData\":"+(g.connectMissingData?"true":"false")+",\"is3D\":"+(g.is3D?"true":"false"),true,"GRAPH_RENDERING_PENDING");
   for(size_t li=0;li<g.layers.size();li++){
    const auto& l=g.layers[li];const auto lid=gid+":layer:"+std::to_string(li);o.node(lid,gid,"layer","",std::to_string(li),"\"frame\":"+rect(l.clientRect)+",\"xAxis\":"+axis(l.xAxis)+",\"yAxis\":"+axis(l.yAxis)+",\"backgroundColor\":"+color(l.backgroundColor)+",\"exchangedAxes\":"+(l.exchangedAxes?"true":"false")+",\"waterfall\":"+(l.isWaterfall?"true":"false"),true,"GRAPH_RENDERING_PENDING");
    textNode(o,l.legend,lid+":legend",lid);for(size_t ti=0;ti<l.texts.size();ti++)textNode(o,l.texts[ti],lid+":text:"+std::to_string(ti),lid);
    textNode(o,l.xAxis.formatAxis[0].label,lid+":axis:x",lid);textNode(o,l.yAxis.formatAxis[0].label,lid+":axis:y",lid);
    for(size_t ci=0;ci<l.curves.size();ci++){
     const auto& c=l.curves[ci];const auto cid=lid+":curve:"+std::to_string(ci);
     o.node(cid,lid,"curve",c.yColumnName,std::to_string(ci),"\"plotType\":"+std::to_string(c.type)+",\"hidden\":"+(c.hidden?"true":"false")+",\"lineConnect\":"+std::to_string(c.lineConnect)+",\"lineWidth\":"+number(c.lineWidth)+",\"lineStyle\":"+std::to_string(c.lineStyle)+",\"lineColor\":"+color(c.lineColor)+",\"lineOpacity\":"+number(1.0-c.lineTransparency/255.0)+",\"symbolColor\":"+color(c.symbolColor)+",\"symbolFillColor\":"+color(c.symbolFillColor)+",\"symbolSize\":"+number(c.symbolSize)+",\"symbolShape\":"+std::to_string(c.symbolShape)+",\"sourceXDataID\":"+std::to_string(c.sourceXDataID)+",\"sourceYDataID\":"+std::to_string(c.sourceYDataID),true,"GRAPH_RENDERING_PENDING","["+rangeJson(c.sourceHeaderOffset,c.sourceHeaderSize)+"]");
     o.relation(cid,c.sourceXDataID,"x",datasetIDs);o.relation(cid,c.sourceYDataID,"y",datasetIDs);
    }
   }
  }
  // Tree links retain raw window object IDs, never display names.
  std::vector<std::string> parents;size_t ti=0;for(auto it=parser.projectTree.begin();it!=parser.projectTree.end();++it,++ti){const auto depth=size_t(parser.projectTree.depth(it));if(depth>128)throw std::runtime_error("ORIGIN_TREE_DEPTH");const std::string parent=depth&&depth<=parents.size()?parents[depth-1]:"";const auto id="folder:"+std::to_string(ti);
   if(it->type==ProjectNode::Folder){o.node(id,parent,"folder",it->name,"","\"active\":"+std::string(it->active?"true":"false"));if(parents.size()<=depth)parents.resize(depth+1);parents[depth]=id;}
   else{const auto& lookup=it->type==ProjectNode::Note?noteIDs:windowIDs;auto found=lookup.find(it->sourceObjectID);if(found!=lookup.end())o.relations.push_back("{\"id\":"+quote("tree:"+std::to_string(ti))+",\"from\":"+quote(parent)+",\"to\":"+quote(found->second)+",\"sourceTargetId\":"+quote(std::to_string(it->sourceObjectID))+",\"kind\":\"contains\",\"resolved\":true}");else o.warning("TREE_WINDOW_UNRESOLVED");}
  }
  for(size_t i=0;i<parser.sourceAttachments.size();i++){const auto& a=parser.sourceAttachments[i];const auto bytes=slice(raw,size_t(a.range.offset),size_t(a.range.size));const auto resource=o.resource("opaque",bytes);o.node("attachment:"+std::to_string(i),"","attachment",a.name,"","\"resourceId\":"+resource+",\"type\":"+std::to_string(a.type)+",\"mediaType\":"+quote(attachmentType(bytes))+",\"internal\":"+(a.name.empty()&&a.type==4096?"true":"false"),true,"ATTACHMENT_PASSIVE","["+rangeJson(a.range.offset,a.range.size)+"]");}
  if(!parser.matrixes.empty()||!parser.notes.empty()||!parser.functions.empty())o.warning("ADDITIONAL_OBJECT_CLASSES_ARCHIVED");
  // Preserve every byte outside decoded payloads, even when original embedding is disabled.
  size_t previous=0,opaque=0;for(size_t i=0;i<=knownData.size();i++){const size_t next=i<knownData.size()?knownData[i].offset:raw.size();if(next>previous){const auto r=o.resource("opaque",slice(raw,previous,next-previous));o.ranges.push_back(rangeJson(previous,next-previous));o.node("opaque:"+std::to_string(opaque++),"","opaque","","","\"resourceId\":"+r,false,"SOURCE_RANGE_PARTIALLY_INTERPRETED","["+rangeJson(previous,next-previous)+"]");}if(i<knownData.size())previous=knownData[i].offset+knownData[i].size;}
  std::string model="{\"nodes\":"+array(o.nodes)+",\"columns\":"+array(o.columns)+",\"resources\":"+array(o.resources)+",\"relations\":"+array(o.relations)+",\"diagnostics\":"+array(o.diagnostics)+",\"coverage\":{\"inventory\":\"partial\",\"visualEquivalence\":\"unverified\",\"opaqueRanges\":"+array(o.ranges)+"}}";
  o.protocol.json(1,model);o.protocol.frame(4,{});return 0;
 }catch(const std::exception& e){std::cerr<<e.what()<<'\n';return 65;}catch(...){return 70;}
}
#ifdef _WIN32
int wmain(int argc,wchar_t** argv){std::vector<std::string> arguments;std::vector<char*> pointers;for(int i=0;i<argc;i++)arguments.push_back(std::filesystem::path(argv[i]).u8string());for(auto& s:arguments)pointers.push_back(s.data());return runDecoder(argc,pointers.data());}
#else
int main(int argc,char** argv){return runDecoder(argc,argv);}
#endif
