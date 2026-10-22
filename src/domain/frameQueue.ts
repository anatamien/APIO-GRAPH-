/** At most one update per display frame, with an explicit synchronous final flush. */
export function frameQueue<T>(apply:(value:T)=>void,request:(callback:()=>void)=>number=callback=>requestAnimationFrame(callback),cancel:(handle:number)=>void=handle=>cancelAnimationFrame(handle)){
 let handle:number|null=null,pending:T|undefined,hasPending=false;
 const discard=()=>{if(handle!==null)cancel(handle);handle=null;pending=undefined;hasPending=false};
 return {
  push(value:T){pending=value;hasPending=true;if(handle===null)handle=request(()=>{handle=null;const value=pending;pending=undefined;if(hasPending){hasPending=false;apply(value!)}})},
  flush(value:T){discard();apply(value)},
  cancel:discard,
 };
}
