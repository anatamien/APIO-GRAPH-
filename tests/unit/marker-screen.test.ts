import {it,expect} from 'vitest';
import {renderSvg} from '../../src/features/export/svgRenderer';
import {largeProject} from '../fixtures/large-data';
it('batches a dense screen marker layer without drawing connecting lines or sampling the export',()=>{
 const p=largeProject(10000);p.series[0].mode='points';p.series[0].style.markerVisible=true;
 const svg=renderSvg(p,{width:1440,height:940,screen:true});
 const series=svg.slice(svg.indexOf('data-series="'),svg.indexOf('data-target="axis:x"'));
 expect((series.match(/<path/g)??[]).length).toBeLessThan(100);
 expect(series).not.toContain('fill="none"');
 const exact=renderSvg(p,{width:1440,height:940});expect((exact.match(/data-point=/g)??[]).length).toBe(10000);
});
