const scope=self as unknown as {onmessage:(event:MessageEvent)=>void;postMessage:(value:unknown)=>void};
scope.onmessage=({data}:{data:{id:number;values:ArrayBuffer;tags:ArrayBuffer}})=>{
 const v=new DataView(data.values),tags=new Uint8Array(data.tags);let longest='';
 for(let row=0;row<tags.length;row++){const kind=tags[row]&127;if(kind===0){const value=v.getFloat64(row*8,true),text=Number.isFinite(value)?Object.is(value,-0)?'−0':String(value):'0x0000000000000000';if(text.length>longest.length)longest=text}else if(kind===3&&longest.length<18)longest='0x0000000000000000'}
 scope.postMessage({id:data.id,longest});
};
