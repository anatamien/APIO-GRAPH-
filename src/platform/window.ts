import {isDesktop} from './files';
let pending=Promise.resolve();
let current:'welcome'|'data'|'editor'|undefined;
let editor:{width:number;height:number;x:number;y:number;maximized:boolean}|undefined;
/** Resize the existing window; the launcher never creates another WebView or process. */
export function setWindowLayout(layout:'welcome'|'data'|'editor'):Promise<void>{
 if(!isDesktop())return Promise.resolve();
 pending=pending.catch(()=>{}).then(async()=>{
  if(current===layout)return;
  const {getCurrentWindow,currentMonitor}=await import('@tauri-apps/api/window');
  const {LogicalSize,LogicalPosition}=await import('@tauri-apps/api/dpi');
  const win=getCurrentWindow(),scale=await win.scaleFactor();
  if(current==='editor'){const size=await win.innerSize(),position=await win.outerPosition();editor={width:size.width/scale,height:size.height/scale,x:position.x/scale,y:position.y/scale,maximized:await win.isMaximized()}}
  if(await win.isMaximized())await win.unmaximize();
  await win.setMinSize(new LogicalSize(layout==='editor'?700:520,layout==='editor'?500:360));
  await win.setResizable(layout==='editor');await win.setMaximizable(layout==='editor');
  if(layout!=='editor'){const monitor=await currentMonitor(),work=monitor?.workArea??monitor;const availableHeight=work?work.size.height/(monitor?.scaleFactor??scale):760;await win.setSize(new LogicalSize(600,Math.min(layout==='data'?720:420,availableHeight)));await win.center()}
  else{
   const monitor=await currentMonitor(),work=monitor?.workArea??monitor,availableWidth=work?work.size.width/(monitor?.scaleFactor??scale):1440,availableHeight=work?work.size.height/(monitor?.scaleFactor??scale):940;
   await win.setSize(new LogicalSize(Math.min(editor?.width??1440,availableWidth),Math.min(editor?.height??940,availableHeight)));
   if(editor)await win.setPosition(new LogicalPosition(editor.x,editor.y));else await win.center();
   if(editor?.maximized)await win.maximize();
  }
  current=layout;await win.show();
 });return pending;
}
