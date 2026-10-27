import {describe,it,expect} from 'vitest';
import {ownOriginModel} from '../fixtures/origin';
import {setOriginIncluded} from '../../src/features/origin/selection';
describe('Origin working-set dependencies',()=>{
 const m=ownOriginModel();m.nodes.push({...m.nodes[0],id:'c',parentId:'sheet',kind:'column'},{...m.nodes[0],id:'g',kind:'graph'},{...m.nodes[0],id:'curve',parentId:'g',kind:'curve'});m.relations=[{id:'x',from:'curve',to:'c',sourceTargetId:'7',kind:'x',resolved:true}];
 it('includes required columns and their ancestors when a curve is selected',()=>{expect(new Set(setOriginIncluded(m,[],'curve',true))).toEqual(new Set(['curve','g','c','sheet']))});
 it('excludes dependent curves when their source column or parent sheet is excluded',()=>{
  expect(setOriginIncluded(m,['sheet','c','g','curve'],'sheet',false)).toEqual(['g']);
 });
 it('includes and excludes folder members connected through contains relations',()=>{
  const folderModel={...m,nodes:[...m.nodes,{...m.nodes[0],id:'folder',parentId:null,kind:'folder' as const}],relations:[...m.relations,{id:'member',from:'folder',to:'g',sourceTargetId:'0',kind:'contains' as const,resolved:true}]};
  expect(new Set(setOriginIncluded(folderModel,[],'folder',true))).toEqual(new Set(['folder','g','curve','c','sheet']));
  expect(setOriginIncluded(folderModel,['folder','g','curve','c','sheet'],'folder',false)).toEqual(['sheet','c']);
  expect(new Set(setOriginIncluded(folderModel,[],'curve',true))).toEqual(new Set(['curve','g','folder','c','sheet']));
 });
});
