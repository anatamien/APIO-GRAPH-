#include "sandbox.hpp"
#include <stdexcept>
#include <filesystem>
#include <string>
#include <iostream>
#include <vector>
#include <algorithm>
#ifdef _WIN32
#include <winsock2.h>
#include <windows.h>
#include <userenv.h>
#include <sddl.h>
#include <io.h>
#include <fcntl.h>

namespace {
std::wstring wide(const std::string& value){return std::filesystem::u8path(value).wstring();}
std::wstring quoteArg(const std::wstring& value){std::wstring s=L"\"";unsigned slashes=0;for(auto c:value){if(c==L'\\'){slashes++;continue;}if(c==L'"')s.append(slashes*2+1,L'\\');else s.append(slashes,L'\\');slashes=0;s+=c;}s.append(slashes*2,L'\\');return s+L'"';}
struct Handle {HANDLE value=nullptr;~Handle(){if(value&&value!=INVALID_HANDLE_VALUE)CloseHandle(value);}operator HANDLE()const{return value;}};
// Destroy the worker before its private profile, including exception/cancel paths.
struct ChildJob {Handle job,process;~ChildJob(){if(job)TerminateJobObject(job,125);if(process){DWORD status=0;if(GetExitCodeProcess(process,&status)&&status==STILL_ACTIVE)TerminateProcess(process,125);WaitForSingleObject(process,5000);}}};
void require(bool good,const char* code){if(!good)throw std::runtime_error(std::string(code)+":"+std::to_string(GetLastError()));}
// The system creates and removes only this newly-created private profile.
// No ACL of the selected source, staging directory or application is changed.
struct Profile {std::wstring name;PSID sid=nullptr;bool created=false;~Profile(){if(sid)FreeSid(sid);if(created)DeleteAppContainerProfile(name.c_str());}};
struct Attributes {std::vector<unsigned char> memory;LPPROC_THREAD_ATTRIBUTE_LIST list=nullptr;~Attributes(){if(list)DeleteProcThreadAttributeList(list);}};
}
int sandboxRun(const std::string& source,bool probe,const std::string& canary,unsigned port){
 try{
  Profile profile;profile.name=L"APIO.Origin."+std::to_wstring(GetCurrentProcessId())+L"."+std::to_wstring(GetTickCount64());
  const auto hr=CreateAppContainerProfile(profile.name.c_str(),L"APIO Origin decoder",L"Isolated passive Origin decoder",nullptr,0,&profile.sid);
  require(SUCCEEDED(hr),"ORIGIN_SANDBOX_PROFILE");profile.created=true;
  LPWSTR sidText=nullptr;require(ConvertSidToStringSidW(profile.sid,&sidText),"ORIGIN_SANDBOX_SID");LPWSTR folder=nullptr;const auto folderHR=GetAppContainerFolderPath(sidText,&folder);LocalFree(sidText);require(SUCCEEDED(folderHR),"ORIGIN_SANDBOX_FOLDER");
  const auto stage=std::filesystem::path(folder)/L"Temp";CoTaskMemFree(folder);std::filesystem::create_directories(stage);
  wchar_t image[MAX_PATH*4];const auto n=GetModuleFileNameW(nullptr,image,DWORD(std::size(image)));require(n&&n<std::size(image),"ORIGIN_SANDBOX_IMAGE");
  const auto childImage=stage/L"decoder.exe",childSource=stage/L"input.opj";
  std::filesystem::copy_file(image,childImage);std::filesystem::copy_file(std::filesystem::u8path(source),childSource);
  ChildJob child;auto& job=child.job;job.value=CreateJobObjectW(nullptr,nullptr);require(job.value,"ORIGIN_SANDBOX_JOB");
  JOBOBJECT_EXTENDED_LIMIT_INFORMATION limits{};limits.BasicLimitInformation.LimitFlags=JOB_OBJECT_LIMIT_KILL_ON_JOB_CLOSE|JOB_OBJECT_LIMIT_PROCESS_MEMORY|JOB_OBJECT_LIMIT_PROCESS_TIME|JOB_OBJECT_LIMIT_ACTIVE_PROCESS;
  limits.BasicLimitInformation.PerProcessUserTimeLimit.QuadPart=15LL*10000000;limits.BasicLimitInformation.ActiveProcessLimit=1;limits.ProcessMemoryLimit=512ULL*1024*1024;
  require(SetInformationJobObject(job,JobObjectExtendedLimitInformation,&limits,sizeof(limits)),"ORIGIN_SANDBOX_LIMITS");
  SECURITY_ATTRIBUTES sa{sizeof(sa),nullptr,TRUE};Handle readPipe,writePipe;
  require(CreatePipe(&readPipe.value,&writePipe.value,&sa,65536),"ORIGIN_SANDBOX_PIPE");require(SetHandleInformation(readPipe,HANDLE_FLAG_INHERIT,0),"ORIGIN_SANDBOX_PIPE");
  Handle nullInput;nullInput.value=CreateFileW(L"NUL",GENERIC_READ|GENERIC_WRITE,FILE_SHARE_READ|FILE_SHARE_WRITE,&sa,OPEN_EXISTING,0,nullptr);require(nullInput.value!=INVALID_HANDLE_VALUE,"ORIGIN_SANDBOX_STDIN");
  Attributes attrs;SIZE_T attrSize=0;InitializeProcThreadAttributeList(nullptr,2,0,&attrSize);attrs.memory.resize(attrSize);attrs.list=reinterpret_cast<LPPROC_THREAD_ATTRIBUTE_LIST>(attrs.memory.data());
  require(InitializeProcThreadAttributeList(attrs.list,2,0,&attrSize),"ORIGIN_SANDBOX_ATTRIBUTES");
  SECURITY_CAPABILITIES capabilities{};capabilities.AppContainerSid=profile.sid;
  require(UpdateProcThreadAttribute(attrs.list,0,PROC_THREAD_ATTRIBUTE_SECURITY_CAPABILITIES,&capabilities,sizeof(capabilities),nullptr,nullptr),"ORIGIN_SANDBOX_CAPABILITIES");
  HANDLE handles[]={writePipe.value,nullInput.value};require(UpdateProcThreadAttribute(attrs.list,0,PROC_THREAD_ATTRIBUTE_HANDLE_LIST,handles,sizeof(handles),nullptr,nullptr),"ORIGIN_SANDBOX_HANDLES");
  DWORD childPolicy=PROCESS_CREATION_CHILD_PROCESS_RESTRICTED;
  (void)childPolicy; // Child creation is blocked by the one-process Job limit.
  STARTUPINFOEXW startup{};startup.StartupInfo.cb=sizeof(startup);startup.lpAttributeList=attrs.list;startup.StartupInfo.dwFlags=STARTF_USESTDHANDLES;startup.StartupInfo.hStdInput=nullInput;startup.StartupInfo.hStdOutput=writePipe;startup.StartupInfo.hStdError=nullInput;
  std::wstring command=quoteArg(childImage.wstring())+L" "+(probe?L"--probe "+quoteArg(wide(canary))+L" "+std::to_wstring(port):quoteArg(childSource.wstring()));
  PROCESS_INFORMATION pi{};require(CreateProcessW(childImage.c_str(),command.data(),nullptr,nullptr,TRUE,EXTENDED_STARTUPINFO_PRESENT|CREATE_SUSPENDED|CREATE_NO_WINDOW,nullptr,stage.c_str(),&startup.StartupInfo,&pi),"ORIGIN_SANDBOX_LAUNCH");
  auto& process=child.process;process.value=pi.hProcess;Handle thread;thread.value=pi.hThread;
  if(!AssignProcessToJobObject(job,process)){TerminateProcess(process,125);throw std::runtime_error("ORIGIN_SANDBOX_ASSIGN");}
  require(ResumeThread(thread)!=DWORD(-1),"ORIGIN_SANDBOX_RESUME");CloseHandle(writePipe.value);writePipe.value=nullptr;
  _setmode(_fileno(stdout),_O_BINARY);const auto start=GetTickCount64();size_t total=0;char data[65536];bool ended=false;
  while(true){
   DWORD incoming=0;const HANDLE control=GetStdHandle(STD_INPUT_HANDLE);
   if(control&&control!=INVALID_HANDLE_VALUE){const auto connected=PeekNamedPipe(control,nullptr,0,nullptr,&incoming,nullptr);if(!connected&&GetLastError()==ERROR_BROKEN_PIPE)throw std::runtime_error("ORIGIN_PARENT_CLOSED");if(connected&&incoming){char cancel=0;DWORD read=0;ReadFile(control,&cancel,1,&read,nullptr);if(read&&cancel=='C')throw std::runtime_error("ORIGIN_CANCELLED");}}
   DWORD available=0;if(!PeekNamedPipe(readPipe,nullptr,0,nullptr,&available,nullptr)){if(GetLastError()==ERROR_BROKEN_PIPE)break;throw std::runtime_error("ORIGIN_SANDBOX_PIPE");}
   if(available){DWORD read=0;require(ReadFile(readPipe,data,DWORD(std::min<size_t>(sizeof(data),available)),&read,nullptr),"ORIGIN_SANDBOX_PIPE");total+=read;if(total>1024ULL*1024*1024)throw std::runtime_error("ORIGIN_PROTOCOL_LIMIT");std::cout.write(data,read);std::cout.flush();if(!std::cout)throw std::runtime_error("ORIGIN_PROTOCOL_WRITE");continue;}
   if(WaitForSingleObject(process,0)==WAIT_OBJECT_0){if(ended)break;ended=true;}
   if(GetTickCount64()-start>30000)throw std::runtime_error("ORIGIN_TIMEOUT");Sleep(1);
  }
  DWORD exit=0;require(GetExitCodeProcess(process,&exit)&&exit!=STILL_ACTIVE,"ORIGIN_SANDBOX_EXIT");return int(exit);
 }catch(const std::exception& e){std::cerr<<e.what()<<'\n';return 75;}
}
int sandboxProbe(const std::string& canary,unsigned port){
 Handle token;require(OpenProcessToken(GetCurrentProcess(),TOKEN_QUERY,&token.value),"probe-token");DWORD isContainer=0,returned=0;require(GetTokenInformation(token,TokenIsAppContainer,&isContainer,sizeof(isContainer),&returned)&&isContainer,"probe-not-appcontainer");
 Handle file;file.value=CreateFileW(wide(canary).c_str(),GENERIC_READ,FILE_SHARE_READ,nullptr,OPEN_EXISTING,0,nullptr);const bool fileDenied=file.value==INVALID_HANDLE_VALUE&&GetLastError()==ERROR_ACCESS_DENIED;
 WSADATA data{};WSAStartup(MAKEWORD(2,2),&data);SOCKET socketHandle=socket(AF_INET,SOCK_STREAM,IPPROTO_TCP);sockaddr_in address{};address.sin_family=AF_INET;address.sin_addr.s_addr=htonl(INADDR_LOOPBACK);address.sin_port=htons(static_cast<u_short>(port));const int connected=connect(socketHandle,reinterpret_cast<sockaddr*>(&address),sizeof(address));const int networkError=WSAGetLastError();const bool networkDenied=connected==SOCKET_ERROR&&networkError==WSAEACCES;closesocket(socketHandle);WSACleanup();
 wchar_t self[MAX_PATH*4];GetModuleFileNameW(nullptr,self,DWORD(std::size(self)));STARTUPINFOW si{};si.cb=sizeof(si);PROCESS_INFORMATION pi{};std::wstring command=quoteArg(self)+L" --child";BOOL created=CreateProcessW(self,command.data(),nullptr,nullptr,FALSE,CREATE_NO_WINDOW,nullptr,nullptr,&si,&pi);const bool childDenied=!created;if(created){TerminateProcess(pi.hProcess,126);CloseHandle(pi.hThread);CloseHandle(pi.hProcess);}
 std::cout<<"{\"appContainer\":true,\"fileDenied\":"<<(fileDenied?"true":"false")<<",\"networkDenied\":"<<(networkDenied?"true":"false")<<",\"networkError\":"<<networkError<<",\"childDenied\":"<<(childDenied?"true":"false")<<"}";return fileDenied&&networkDenied&&childDenied?0:76;
}
#else
int sandboxRun(const std::string&,bool,const std::string&,unsigned){return 75;}
int sandboxProbe(const std::string&,unsigned){return 75;}
#endif
