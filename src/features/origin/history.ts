import type {OriginModel,OriginViewState} from './model';
export function initialOriginView(model:OriginModel):OriginViewState{return {encoding:model.source.detected.family==='opju'?'utf-8':'windows-1251',selectedId:model.nodes.find(n=>n.kind==='worksheet')?.id??model.nodes[0]?.id??null,includedIds:model.nodes.filter(n=>n.kind!=='opaque').map(n=>n.id),includeSource:model.sourceResourceId!==null}}
export class OriginViewHistory {
 private states:OriginViewState[];private at=0;private saved:OriginViewState|null;
 constructor(view:OriginViewState,dirty=false){this.states=[view];this.saved=dirty?null:view}
 get current(){return this.states[this.at]}
 get dirty(){return this.saved!==this.current}
 get canUndo(){return this.at>0}get canRedo(){return this.at+1<this.states.length}
 edit(patch:Partial<OriginViewState>){const next={...this.current,...patch};if(JSON.stringify(next)===JSON.stringify(this.current))return;this.states=this.states.slice(0,this.at+1);this.states.push(next);this.at++;if(this.states.length>100){this.states.shift();this.at--}}
 navigate(selectedId:string){const before=this.current;if(before.selectedId===selectedId)return;const next={...before,selectedId};this.states[this.at]=next;if(this.saved===before)this.saved=next}
 undo(){if(this.canUndo)this.at--}redo(){if(this.canRedo)this.at++}
 saveCheckpoint(){const view=this.current;return ()=>{this.saved=view}}
}
export interface OriginTabState {sessionId:string;model:OriginModel;history:OriginViewHistory}
