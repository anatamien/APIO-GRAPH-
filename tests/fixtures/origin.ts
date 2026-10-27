import type {OriginModel} from '../../src/features/origin/model';
import {originHash} from '../../src/features/origin/archive';
export function ownOriginModel():OriginModel {
 return {format:'APIO_ORIGIN_DOCUMENT',schemaVersion:1,source:{name:'Own synthetic.opj',size:3,sha256:'039058c6f2c0cb492c533b0a4d14ef77cc0f78abccced5287d84a1a2011cfb81',detected:{family:'unknown',header:'own',build:null,version:null,canDecode:false}},decoder:{name:'own-synthetic',version:'1',revision:'test'},nodes:[{id:'sheet',parentId:null,kind:'worksheet',nameHex:'4f776e',sourceId:'1',properties:{},capabilities:{recognized:true,extracted:true,rendered:false,editable:false,recalculable:false,archived:true,unsupportedReason:null},provenance:[]}],columns:[],resources:[{id:'original',kind:'original',size:3,sha256:'039058c6f2c0cb492c533b0a4d14ef77cc0f78abccced5287d84a1a2011cfb81'}],relations:[],diagnostics:[],coverage:{inventory:'partial',visualEquivalence:'unverified',opaqueRanges:[]},sourceResourceId:'original'};
}
/** Own scientific fixture: arbitrary column order, shared X, two page regions, a gap and passive formula. */
export async function ownXYOrigin(rows=5){
 const model=ownOriginModel(),resources=new Map<string,Uint8Array>([['original',new Uint8Array([1,2,3])]]),base=model.nodes[0];
 const node=(id:string,kind:typeof base.kind,parentId:string|null,properties:Record<string,unknown>={},name=id)=>{const n={...base,id,parentId,kind,nameHex:Array.from(new TextEncoder().encode(name),b=>b.toString(16).padStart(2,'0')).join(''),properties};model.nodes.push(n);return n};
 for(const [id,role,order]of [['y','Y',0],['x','X',1],['z','Y',2]]as const){
  node(id,'column','sheet',{columnOrder:order,unitHex:role==='X'?'73':'6d56',...(id==='z'?{commandHex:'436f6c2841292a32'}:{})},id.toUpperCase());
  const values=new Uint8Array(rows*8),tags=new Uint8Array(rows),v=new DataView(values.buffer);for(let i=0;i<rows;i++)v.setFloat64(i*8,id==='x'?(i===0?-0:i):id==='y'?i*i:i*2,true);if(id==='y'&&rows===5)tags[2]=1;
  for(const [rid,kind,bytes]of [[id+'v','f64',values],[id+'t','tags',tags]]as const){resources.set(rid,bytes);model.resources.push({id:rid,kind,size:bytes.length,sha256:await originHash(bytes)})}model.columns.push({nodeId:id,role,rowCount:rows,values:id+'v',tags:id+'t',originType:'f64'});
 }
 node('page','graph',null,{widthOriginUnits:1000,heightOriginUnits:800,is3D:false},'Own page');
 for(let i=0;i<2;i++){const layer=`area${i}`,axis={min:0,max:rows,scale:0,step:1,grid:false};node(layer,'layer','page',{frame:i?[130,450,930,700]:[130,100,930,350],xAxis:axis,yAxis:{...axis,max:rows*rows}},`Region ${i+1}`);node(layer+':axis:x','text',layer,{textHex:'54696d65'});node(layer+':axis:y','text',layer,{textHex:'5369676e616c'});const curve=`curve${i}`;node(curve,'curve',layer,{plotType:200,lineConnect:i?8:1,lineColor:i?'#336699':'#000000',lineWidth:1,lineOpacity:1});for(const [kind,target]of [['x','x'],['y',i?'z':'y']])model.relations.push({id:curve+':'+kind,from:curve,to:target,sourceTargetId:target,kind,resolved:true})}
 return {model,resources};
}
