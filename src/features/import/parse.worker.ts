import {parseText,type ParseOptions} from './parser';
self.onmessage=(event:MessageEvent<{text:string;options:ParseOptions}>)=>{
 try{self.postMessage({table:parseText(event.data.text,event.data.options)})}
 catch{self.postMessage({error:'import.parseFailure'})}
};
