import {beforeEach,it,expect,vi} from 'vitest';
const {win,monitor}=vi.hoisted(()=>({win:{scaleFactor:vi.fn(),innerSize:vi.fn(),outerPosition:vi.fn(),isMaximized:vi.fn(),unmaximize:vi.fn(),setMinSize:vi.fn(),setResizable:vi.fn(),setMaximizable:vi.fn(),setSize:vi.fn(),center:vi.fn(),setPosition:vi.fn(),maximize:vi.fn(),show:vi.fn()},monitor:vi.fn()}));
vi.mock('../../src/platform/files',()=>({isDesktop:()=>true}));
vi.mock('@tauri-apps/api/window',()=>({getCurrentWindow:()=>win,currentMonitor:monitor}));
beforeEach(()=>{vi.resetModules();for(const method of Object.values(win))method.mockReset().mockResolvedValue(undefined);win.scaleFactor.mockResolvedValue(2);win.isMaximized.mockResolvedValue(false);win.innerSize.mockResolvedValue({width:2200,height:1600});win.outerPosition.mockResolvedValue({x:100,y:80});monitor.mockResolvedValue({scaleFactor:2,workArea:{size:{width:2560,height:1800},position:{x:0,y:0}}})});
it('shows only a small launcher first and expands the same window within the monitor work area',async()=>{
 const {setWindowLayout}=await import('../../src/platform/window');await setWindowLayout('welcome');
 expect(win.setSize).toHaveBeenLastCalledWith(expect.objectContaining({width:600,height:420}));expect(win.setResizable).toHaveBeenLastCalledWith(false);expect(win.show).toHaveBeenCalledOnce();
 await setWindowLayout('editor');expect(win.setSize).toHaveBeenLastCalledWith(expect.objectContaining({width:1280,height:900}));expect(win.setMinSize).toHaveBeenLastCalledWith(expect.objectContaining({width:700,height:500}));expect(win.setResizable).toHaveBeenLastCalledWith(true);
 await setWindowLayout('editor');expect(win.show).toHaveBeenCalledTimes(2);
});
it('restores the editor size and position after returning to the new-project chooser',async()=>{
 const {setWindowLayout}=await import('../../src/platform/window');await setWindowLayout('editor');await setWindowLayout('welcome');await setWindowLayout('editor');
 expect(win.setSize).toHaveBeenLastCalledWith(expect.objectContaining({width:1100,height:800}));expect(win.setPosition).toHaveBeenLastCalledWith(expect.objectContaining({x:50,y:40}));
});
it('keeps data preparation in a small window until plotting, including smaller monitors',async()=>{
 const {setWindowLayout}=await import('../../src/platform/window');await setWindowLayout('welcome');await setWindowLayout('data');
 expect(win.setSize).toHaveBeenLastCalledWith(expect.objectContaining({width:600,height:720}));expect(win.setResizable).toHaveBeenLastCalledWith(false);expect(win.innerSize).not.toHaveBeenCalled();
 monitor.mockResolvedValue({scaleFactor:2,workArea:{size:{width:2560,height:1300}}});await setWindowLayout('welcome');await setWindowLayout('data');expect(win.setSize).toHaveBeenLastCalledWith(expect.objectContaining({height:650}));
 await setWindowLayout('editor');expect(win.setResizable).toHaveBeenLastCalledWith(true);
});
