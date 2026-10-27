import {buildSignalGrid,type SignalGridPacket} from './signalGrid';
import {unpackCoordinates} from './pointBuffer';
const scope=self as unknown as {onmessage:((event:MessageEvent<{coordinates:Float64Array;parameters:Record<string,unknown>}>)=>void)|null;postMessage:(value:SignalGridPacket|{error:true},transfer?:Transferable[])=>void};
scope.onmessage=({data})=>{try{const result=buildSignalGrid(unpackCoordinates(data.coordinates),data.parameters);scope.postMessage(result,[result.coordinates.buffer,...(result.index?.levels.map(level=>level.indices.buffer)??[])])}catch{scope.postMessage({error:true})}};
