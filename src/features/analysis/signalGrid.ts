import type {XY} from '../../domain/model';
import {signalOrder} from '../../domain/math/signals';
import {adoptDisplayIndex,displayPoints,readDisplayIndex,type DisplayIndex} from '../chart/displayPoints';
import {packCoordinates} from './pointBuffer';

export interface SignalGridPacket {coordinates:Float64Array;index?:DisplayIndex}
interface Entry {points?:readonly XY[];pending?:boolean;failed?:boolean;listeners:Set<()=>void>;worker?:Worker}
const grids=new WeakMap<readonly XY[],Map<string,Entry>>();
const key=(p:Record<string,unknown>)=>JSON.stringify([p.sortCopy,p.duplicates]);
function entry(points:readonly XY[],p:Record<string,unknown>):Entry{let map=grids.get(points);if(!map){map=new Map();grids.set(points,map)}let value=map.get(key(p));if(!value){value={listeners:new Set()};map.set(key(p),value)}return value}
/** All ordering and duplicate aggregation precedes LOD, including hidden sources. */
export function buildSignalGrid(points:readonly XY[],p:Record<string,unknown>):SignalGridPacket{
 const ordered=signalOrder(points,p) as XY[];if(ordered.length)displayPoints(ordered,6);
 const prepared=readDisplayIndex(ordered),index=prepared?{direction:prepared.direction,verticalDirection:prepared.verticalDirection,strict:prepared.strict,xMin:prepared.xMin,xMax:prepared.xMax,levels:prepared.levels}:undefined;
 return {coordinates:packCoordinates(ordered),index};
}
export function installSignalGrid(source:readonly XY[],p:Record<string,unknown>,points:XY[],index?:DisplayIndex){if(index)adoptDisplayIndex(points,index);const value=entry(source,p);value.points=points;value.pending=false;for(const listener of value.listeners)listener()}
export function signalGrid(points:readonly XY[],p:Record<string,unknown>):readonly XY[]|undefined{
 const prepared=readDisplayIndex(points);if(prepared?.direction===1&&prepared.strict)return points;
 const value=entry(points,p);if(value.points)return value.points;if(value.failed)return undefined;
 if(points.length<=4096){value.points=signalOrder(points,p);return value.points}return undefined;
}
const yieldTask=()=>new Promise<void>(resolve=>{const channel=new MessageChannel();channel.port1.onmessage=()=>{channel.port1.close();channel.port2.close();resolve()};channel.port2.postMessage(null)});
/** Copy/hydration slices yield to input; no full-array structured clone on UI. */
export function observeSignalGrid(points:readonly XY[],p:Record<string,unknown>,listener:()=>void):()=>void{
 // Close the render-to-effect race when a different subscriber finishes first.
 try{if(signalGrid(points,p)){listener();return()=>{}}}catch{return()=>{}}const value=entry(points,p);value.listeners.add(listener);
 if(!value.pending&&!value.failed){value.pending=true;let worker:Worker;try{worker=new Worker(new URL('./signalGrid.worker.ts',import.meta.url),{type:'module'})}catch{value.failed=true;value.pending=false;value.listeners.delete(listener);return()=>{}}value.worker=worker;
  const fail=()=>{if(value.worker!==worker)return;value.failed=true;value.pending=false;worker.terminate();value.worker=undefined;for(const update of value.listeners)update()};worker.onerror=fail;
  worker.onmessage=async({data}:{data:SignalGridPacket|{error:true}})=>{if('error'in data){fail();return}const ordered=new Array<XY>(data.coordinates.length/2);let start=performance.now();for(let i=0;i<ordered.length;i++){if(value.worker!==worker)return;ordered[i]={x:data.coordinates[i*2],y:data.coordinates[i*2+1]};if((i&2047)===0&&performance.now()-start>3){await yieldTask();start=performance.now()}}if(value.worker!==worker)return;worker.terminate();value.worker=undefined;installSignalGrid(points,p,ordered,data.index)};
  void(async()=>{try{const coordinates=new Float64Array(points.length*2);let start=performance.now();for(let i=0;i<points.length;i++){if(value.worker!==worker)return;coordinates[i*2]=points[i].x;coordinates[i*2+1]=points[i].y;if((i&2047)===0&&performance.now()-start>3){await yieldTask();start=performance.now()}}if(value.worker===worker)worker.postMessage({coordinates,parameters:p},[coordinates.buffer])}catch{fail()}})();
 }
 return()=>{value.listeners.delete(listener);if(!value.listeners.size&&value.worker){value.worker.terminate();value.worker=undefined;value.pending=false}};
}
