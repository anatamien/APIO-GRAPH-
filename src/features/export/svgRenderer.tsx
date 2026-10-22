import {renderToStaticMarkup} from 'react-dom/server';
import type {ProjectDocument} from '../../domain/model';
import {ChartScene,type RenderOptions} from '../chart/ChartScene';
export function renderSvg(p:ProjectDocument,options:RenderOptions):string {
 const dpi=options.dpi??96;
 if(!Number.isFinite(dpi)||dpi<36||dpi>2400)throw new Error('INVALID_DPI');
 const width=options.width*96/dpi,height=options.height*96/dpi;
 return '<?xml version="1.0" encoding="UTF-8"?>\n'+renderToStaticMarkup(<svg xmlns="http://www.w3.org/2000/svg" width={options.width} height={options.height} viewBox={`0 0 ${width} ${height}`}><ChartScene p={p} {...options} width={width} height={height}/></svg>);
}
