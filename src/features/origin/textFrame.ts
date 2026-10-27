/** Legacy OPJ text rectangles store the rotated extent beside their reference corner.
 * The reference corner is not the top-left ink corner for rotated text. */
export function originTextFrame(rect:unknown,rotation:number):[number,number,number,number]|null{
 if(!Array.isArray(rect)||rect.length!==4||rect.some(v=>typeof v!=='number'||!Number.isFinite(v)))return null;
 const [x,y,right,bottom]=rect,w=right-x,h=bottom-y;if(w<=0||h<=0)return null;
 const angle=((rotation%360)+360)%360;
 if(angle===90)return [x,y-h,right,y];
 if(angle===180)return [x-w,y-h,x,y];
 if(angle===270)return [x-w,y,x,bottom];
 return [x,y,right,bottom];
}
