#include "OriginAnyParser.h"
#include "checked-reader.hpp"
#include <filesystem>
#include <fstream>
#include <functional>
#include <iostream>

class TestParser:public OriginAnyParser {
public:
 explicit TestParser(const std::string& path):OriginAnyParser(path){file.seekg(0,std::ios::end);d_file_size=file.tellg();file.seekg(0);fileVersion=930;buildVersion=3168;}
 using OriginAnyParser::readObjectSize;using OriginAnyParser::readObjectAsString;using OriginAnyParser::readAttachmentList;using OriginAnyParser::getColumnInfoAndData;
 using OriginAnyParser::getCurveProperties;
 using OriginParser::findColumnByName;using OriginParser::findExcelColumnByName;
 void spreadsheet(){ispread=0;iexcel=-1;spreadSheets.emplace_back("own");spreadSheets[0].columns={Origin::SpreadColumn("duplicate",0),Origin::SpreadColumn("duplicate",1)};}
 void workbook(){ispread=-1;iexcel=0;excels.emplace_back("own");excels[0].sheets.emplace_back("own-sheet");excels[0].sheets[0].columns={Origin::SpreadColumn("duplicate",0),Origin::SpreadColumn("duplicate",1)};datasets=excels[0].sheets[0].columns;}
};
static std::string fixture(const apio::Bytes& b){const auto p=std::filesystem::temp_directory_path()/"apio-origin-parser-test.dat";std::ofstream f(p,std::ios::binary);f.write(reinterpret_cast<const char*>(b.data()),b.size());f.close();return p.u8string();}
static void check(bool ok){if(!ok)throw std::runtime_error("assertion failed");}
static void rejects(const std::function<void()>& f){try{f();}catch(const std::exception&){return;}throw std::runtime_error("unsafe input accepted");}
int main(){int failures=0;auto test=[&](const char* name,const std::function<void()>& f){try{f();std::cout<<name<<": passed\n";}catch(const std::exception& e){failures++;std::cerr<<name<<": "<<e.what()<<'\n';}};
 test("oversized-block-before-allocation",[]{TestParser p(fixture({255,255,255,255,10}));rejects([&]{p.readObjectSize();});});
 test("short-body-is-an-error",[]{TestParser p(fixture({1,2,3,10}));rejects([&]{p.readObjectAsString(12);});});
 test("truncated-attachment-is-an-error",[]{apio::Bytes b(14);apio::put32(b,0,13);apio::put32(b,8,10);TestParser p(fixture(b));rejects([&]{p.readAttachmentList();});});
 test("raw-control-byte-is-passive-text",[]{
  std::string h(128,0);h[0x16]=0x21;h[0x17]=0x61;h[0x3d]=10;h.replace(0x58,3,"T_A");
  const std::string data("\1\0A\16B\0\0\0\0\0",10);TestParser p(fixture({0}));
  p.getColumnInfoAndData(h,unsigned(h.size()),data,unsigned(data.size()));
  check(p.datasets.size()==1&&p.datasets[0].data.size()==1&&p.datasets[0].data[0].as_string()==std::string("A\16B"));
 });
 test("spreadsheet-metadata-uses-data-id-not-renamed-duplicate-name",[]{TestParser p(fixture({0}));p.spreadsheet();std::string h(128,0);h[4]=2;h[0x11]=3;h.replace(0x12,7,"renamed");p.getCurveProperties(h,unsigned(h.size()),"comment",7);check(p.spreadSheets[0].columns[1].type==Origin::SpreadColumn::X&&p.spreadSheets[0].columns[1].comment=="comment"&&p.spreadSheets[0].columns[0].comment.empty());});
 test("workbook-metadata-uses-data-id-not-renamed-duplicate-name",[]{TestParser p(fixture({0}));p.workbook();std::string h(128,0);h[4]=2;h[0x11]=3;h.replace(0x12,7,"renamed");p.getCurveProperties(h,unsigned(h.size()),"comment",7);check(p.excels[0].sheets[0].columns[1].type==Origin::SpreadColumn::X&&p.excels[0].sheets[0].columns[1].comment=="comment"&&p.excels[0].sheets[0].columns[0].comment.empty());});
 test("unresolved-data-id-does-not-fall-back-to-display-name",[]{TestParser p(fixture({0}));p.workbook();std::string h(128,0);h[4]=99;h[0x11]=3;h.replace(0x12,9,"duplicate");p.getCurveProperties(h,unsigned(h.size()),"comment",7);check(p.excels[0].sheets[0].columns[0].comment.empty()&&!p.sourceWarnings.empty());});
 test("passive-formulas-never-bind-to-the-first-ambiguous-name",[]{TestParser p(fixture({0}));p.spreadsheet();check(p.findColumnByName(0,"duplicate")==-2);p.workbook();check(p.findExcelColumnByName(0,0,"duplicate")==-2);p.excels[0].sheets[0].columns[1].name="unique";check(p.findExcelColumnByName(0,0,"unique")==1);});
 return failures?1:0;
}
