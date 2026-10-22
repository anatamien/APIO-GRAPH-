import {rasterDpi} from './dpiMetadata';
export async function rasterize(svg:string,width:number,height:number,format:'png'|'jpeg',quality=0.92,dpi=96,signal?:AbortSignal):Promise<Uint8Array>{
 signal?.throwIfAborted();
 if(width*height>100_000_000)throw new Error('RASTER_MEMORY_LIMIT');
 const url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml;charset=utf-8'}));
 try{const img=new Image(),abort=()=>{img.src=''};signal?.addEventListener('abort',abort,{once:true});try{img.src=url;await img.decode()}finally{signal?.removeEventListener('abort',abort)}signal?.throwIfAborted();const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;const ctx=canvas.getContext('2d');if(!ctx)throw new Error('CANVAS_UNAVAILABLE');if(format==='jpeg'){ctx.fillStyle='#FFFFFF';ctx.fillRect(0,0,width,height)}ctx.drawImage(img,0,0,width,height);signal?.throwIfAborted();const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('RASTER_FAILED')),`image/${format}`,quality));signal?.throwIfAborted();return rasterDpi(new Uint8Array(await blob.arrayBuffer()),format,dpi)}finally{URL.revokeObjectURL(url)}
}
