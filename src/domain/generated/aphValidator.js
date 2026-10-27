import * as runtime0Module from "ajv/dist/runtime/ucs2length.js";
const runtime0 = typeof runtime0Module.default === 'function' ? {default:runtime0Module.default} : (runtime0Module.default ?? runtime0Module);
import * as runtime1Module from "ajv-formats/dist/formats.js";
const runtime1 = typeof runtime1Module.default === 'function' ? {default:runtime1Module.default} : (runtime1Module.default ?? runtime1Module);
"use strict";
export const validate = validate20;
export default validate20;
const schema31 = {"if":{"type":"object","properties":{"schemaVersion":{"type":"string","pattern":"^1\\.0\\."}},"required":["schemaVersion"]},"then":{"$ref":"https://github.com/anatamien/APIO-GRAPH/blob/main/schemas/aph-1.0.schema.json"},"else":{"if":{"type":"object","properties":{"schemaVersion":{"type":"string","pattern":"^1\\.1\\."}},"required":["schemaVersion"]},"then":{"$ref":"https://github.com/anatamien/APIO-GRAPH/blob/main/schemas/aph-1.1.schema.json"},"else":{"if":{"type":"object","properties":{"schemaVersion":{"type":"string","pattern":"^1\\.2\\."}},"required":["schemaVersion"]},"then":{"$ref":"https://github.com/anatamien/APIO-GRAPH/blob/main/schemas/aph-1.2.schema.json"},"else":{"$ref":"https://github.com/anatamien/APIO-GRAPH/blob/main/schemas/aph-1.3.schema.json"}}}};
const pattern4 = new RegExp("^1\\.0\\.", "u");
const pattern27 = new RegExp("^1\\.1\\.", "u");
const pattern51 = new RegExp("^1\\.2\\.", "u");
const schema32 = {"$schema":"https://json-schema.org/draft/2020-12/schema","$id":"https://github.com/anatamien/APIO-GRAPH/blob/main/schemas/aph-1.0.schema.json","title":"APIO GRAPH project file v1.0","description":"Self-contained UTF-8 JSON project. Referential and numeric semantic validation is additionally required.","type":"object","additionalProperties":false,"properties":{"format":{"const":"APIO_GRAPH_PROJECT"},"schemaVersion":{"type":"string","pattern":"^1\\.0\\.[0-9]+$"},"createdWith":{"type":"object","additionalProperties":false,"properties":{"name":{"const":"APIO GRAPH"},"version":{"type":"string","minLength":1}},"required":["name","version"]},"project":{"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"title":{"type":"string","maxLength":300},"createdAt":{"type":"string","format":"date-time"},"updatedAt":{"type":"string","format":"date-time"}},"required":["id","title","createdAt","updatedAt"]},"page":{"type":"object","additionalProperties":false,"properties":{"widthPx":{"type":"integer","minimum":100,"maximum":30000},"heightPx":{"type":"integer","minimum":100,"maximum":30000},"background":{"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"},"paddingPx":{"type":"number","minimum":0,"maximum":2000}},"required":["widthPx","heightPx","background","paddingPx"]},"axes":{"type":"object","additionalProperties":false,"properties":{"x":{"$ref":"#/$defs/axis"},"y":{"$ref":"#/$defs/axis"}},"required":["x","y"]},"datasets":{"type":"array","items":{"$ref":"#/$defs/dataset"},"maxItems":1000},"series":{"type":"array","items":{"$ref":"#/$defs/series"},"maxItems":1000},"objects":{"type":"array","items":{"$ref":"#/$defs/drawObject"},"maxItems":100000},"calculations":{"type":"array","items":{"$ref":"#/$defs/calculation"},"maxItems":10000},"legend":{"type":"object","additionalProperties":false,"properties":{"visible":{"type":"boolean"},"anchor":{"$ref":"#/$defs/anchor"}},"required":["visible","anchor"]},"viewport":{"type":"object","additionalProperties":false,"properties":{"xMin":{"type":"number"},"xMax":{"type":"number"},"yMin":{"type":"number"},"yMax":{"type":"number"}},"required":["xMin","xMax","yMin","yMax"]},"editor":{"type":"object","additionalProperties":false,"properties":{"selectedObjectId":{"anyOf":[{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},{"type":"null"}]},"showPointMarkers":{"type":"boolean"}},"required":["selectedObjectId","showPointMarkers"]},"extensions":{"type":"object","additionalProperties":true}},"required":["format","schemaVersion","createdWith","project","page","axes","datasets","series","objects","calculations","legend","viewport","editor","extensions"],"$defs":{"point":{"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"x":{"type":"number"},"y":{"type":"number"}},"required":["id","x","y"]},"anchor":{"oneOf":[{"type":"object","additionalProperties":false,"properties":{"mode":{"const":"data"},"x":{"type":"number"},"y":{"type":"number"}},"required":["mode","x","y"]},{"type":"object","additionalProperties":false,"properties":{"mode":{"const":"page"},"pageX":{"type":"number","minimum":0,"maximum":1},"pageY":{"type":"number","minimum":0,"maximum":1}},"required":["mode","pageX","pageY"]},{"type":"object","additionalProperties":false,"properties":{"mode":{"const":"point"},"datasetId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"pointId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"fallbackX":{"type":"number"},"fallbackY":{"type":"number"},"offsetXpx":{"type":"number"},"offsetYpx":{"type":"number"}},"required":["mode","datasetId","pointId","fallbackX","fallbackY","offsetXpx","offsetYpx"]}]},"axis":{"type":"object","additionalProperties":false,"properties":{"label":{"type":"string","maxLength":500},"unit":{"type":"string","maxLength":100},"scale":{"const":"linear"},"mode":{"enum":["auto","manual"]},"min":{"type":"number"},"max":{"type":"number"},"tickMode":{"enum":["auto","manual"]},"tickStep":{"type":"number","exclusiveMinimum":0},"tickOrigin":{"type":"number"},"minorDivisions":{"type":"integer","minimum":0,"maximum":20},"grid":{"type":"boolean"},"numberFormat":{"enum":["auto","fixed","scientific"]},"precision":{"type":"integer","minimum":0,"maximum":15},"strokeWidthPt":{"type":"number","exclusiveMinimum":0,"maximum":24},"labelSizePt":{"type":"number","minimum":6,"maximum":72}},"required":["label","unit","scale","mode","min","max","tickMode","tickStep","tickOrigin","minorDivisions","grid","numberFormat","precision","strokeWidthPt","labelSizePt"]},"dataset":{"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"name":{"type":"string","maxLength":300},"role":{"enum":["raw","derived"]},"source":{"type":"object","additionalProperties":false,"properties":{"kind":{"enum":["import","clipboard","manual","calculation"]},"displayName":{"type":"string","maxLength":300},"calculationId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"}},"required":["kind"]},"points":{"type":"array","items":{"$ref":"#/$defs/point"},"maxItems":1000000}},"required":["id","name","role","source","points"]},"series":{"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"datasetId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"name":{"type":"string","maxLength":300},"visible":{"type":"boolean"},"includeInAutoRange":{"type":"boolean"},"order":{"type":"integer","minimum":0},"mode":{"enum":["line","points","line-points"]},"style":{"type":"object","additionalProperties":false,"properties":{"stroke":{"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"},"strokeWidthPt":{"type":"number","exclusiveMinimum":0,"maximum":24},"opacity":{"type":"number","minimum":0,"maximum":1},"dash":{"enum":["solid","dash","dot","dash-dot"]},"markerShape":{"enum":["circle","square","triangle","diamond","cross","plus"]},"markerSizePt":{"type":"number","minimum":0,"maximum":32},"markerFill":{"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"},"markerStroke":{"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"},"markerVisible":{"type":"boolean"}},"required":["stroke","strokeWidthPt","opacity","dash","markerShape","markerSizePt","markerFill","markerStroke","markerVisible"]}},"required":["id","datasetId","name","visible","includeInAutoRange","order","mode","style"]},"drawObject":{"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"type":{"enum":["text","segment","line","arrow","callout","rectangle","range-x","range-y","marker"]},"name":{"type":"string","maxLength":300},"anchors":{"type":"array","items":{"$ref":"#/$defs/anchor"},"minItems":1,"maxItems":2},"geometry":{"type":"object","additionalProperties":false,"properties":{"directionX":{"type":"number"},"directionY":{"type":"number"}},"required":[]},"text":{"type":"array","items":{"$ref":"#/$defs/textPart"},"maxItems":1000},"style":{"type":"object","additionalProperties":false,"properties":{"stroke":{"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"},"strokeWidthPt":{"type":"number","exclusiveMinimum":0,"maximum":24},"dash":{"enum":["solid","dash","dot","dash-dot"]},"strokeOpacity":{"type":"number","minimum":0,"maximum":1},"fill":{"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"},"fillOpacity":{"type":"number","minimum":0,"maximum":1},"fontSizePt":{"type":"number","minimum":6,"maximum":72},"fontFamily":{"const":"Courier New"},"arrowHead":{"enum":["none","start","end","both"]},"markerShape":{"enum":["circle","square","triangle","diamond","cross","plus"]},"markerSizePt":{"type":"number","minimum":0,"maximum":32}},"required":["stroke","strokeWidthPt","dash","strokeOpacity","fill","fillOpacity","fontSizePt","fontFamily","arrowHead","markerShape","markerSizePt"]},"zIndex":{"type":"integer"},"visible":{"type":"boolean"},"locked":{"type":"boolean"}},"required":["id","type","name","anchors","geometry","text","style","zIndex","visible","locked"]},"calculation":{"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"kind":{"enum":["linear-fit","polynomial-fit","exponential-fit","power-fit","savitzky-golay","moving-average","derivative","integral","interpolation","statistics"]},"sourceDatasetIds":{"type":"array","items":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"minItems":1},"resultDatasetId":{"anyOf":[{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},{"type":"null"}]},"parameters":{"type":"object","maxProperties":60,"additionalProperties":{"type":["string","number","integer","boolean","null","array","object"]}},"algorithmVersion":{"type":"integer","minimum":1},"status":{"enum":["valid","outdated","invalid"]},"summary":{"type":"object","maxProperties":60,"additionalProperties":{"type":["string","number","integer","boolean","null"]}}},"required":["id","kind","sourceDatasetIds","resultDatasetId","parameters","algorithmVersion","status","summary"]},"textPart":{"type":"object","additionalProperties":false,"properties":{"text":{"type":"string","maxLength":5000},"baseline":{"enum":["normal","sub","super"]},"bold":{"type":"boolean"},"italic":{"type":"boolean"}},"required":["text","baseline","bold","italic"]}}};
const schema33 = {"type":"object","additionalProperties":false,"properties":{"label":{"type":"string","maxLength":500},"unit":{"type":"string","maxLength":100},"scale":{"const":"linear"},"mode":{"enum":["auto","manual"]},"min":{"type":"number"},"max":{"type":"number"},"tickMode":{"enum":["auto","manual"]},"tickStep":{"type":"number","exclusiveMinimum":0},"tickOrigin":{"type":"number"},"minorDivisions":{"type":"integer","minimum":0,"maximum":20},"grid":{"type":"boolean"},"numberFormat":{"enum":["auto","fixed","scientific"]},"precision":{"type":"integer","minimum":0,"maximum":15},"strokeWidthPt":{"type":"number","exclusiveMinimum":0,"maximum":24},"labelSizePt":{"type":"number","minimum":6,"maximum":72}},"required":["label","unit","scale","mode","min","max","tickMode","tickStep","tickOrigin","minorDivisions","grid","numberFormat","precision","strokeWidthPt","labelSizePt"]};
const schema37 = {"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"datasetId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"name":{"type":"string","maxLength":300},"visible":{"type":"boolean"},"includeInAutoRange":{"type":"boolean"},"order":{"type":"integer","minimum":0},"mode":{"enum":["line","points","line-points"]},"style":{"type":"object","additionalProperties":false,"properties":{"stroke":{"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"},"strokeWidthPt":{"type":"number","exclusiveMinimum":0,"maximum":24},"opacity":{"type":"number","minimum":0,"maximum":1},"dash":{"enum":["solid","dash","dot","dash-dot"]},"markerShape":{"enum":["circle","square","triangle","diamond","cross","plus"]},"markerSizePt":{"type":"number","minimum":0,"maximum":32},"markerFill":{"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"},"markerStroke":{"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"},"markerVisible":{"type":"boolean"}},"required":["stroke","strokeWidthPt","opacity","dash","markerShape","markerSizePt","markerFill","markerStroke","markerVisible"]}},"required":["id","datasetId","name","visible","includeInAutoRange","order","mode","style"]};
const schema41 = {"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"kind":{"enum":["linear-fit","polynomial-fit","exponential-fit","power-fit","savitzky-golay","moving-average","derivative","integral","interpolation","statistics"]},"sourceDatasetIds":{"type":"array","items":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"minItems":1},"resultDatasetId":{"anyOf":[{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},{"type":"null"}]},"parameters":{"type":"object","maxProperties":60,"additionalProperties":{"type":["string","number","integer","boolean","null","array","object"]}},"algorithmVersion":{"type":"integer","minimum":1},"status":{"enum":["valid","outdated","invalid"]},"summary":{"type":"object","maxProperties":60,"additionalProperties":{"type":["string","number","integer","boolean","null"]}}},"required":["id","kind","sourceDatasetIds","resultDatasetId","parameters","algorithmVersion","status","summary"]};
const schema39 = {"oneOf":[{"type":"object","additionalProperties":false,"properties":{"mode":{"const":"data"},"x":{"type":"number"},"y":{"type":"number"}},"required":["mode","x","y"]},{"type":"object","additionalProperties":false,"properties":{"mode":{"const":"page"},"pageX":{"type":"number","minimum":0,"maximum":1},"pageY":{"type":"number","minimum":0,"maximum":1}},"required":["mode","pageX","pageY"]},{"type":"object","additionalProperties":false,"properties":{"mode":{"const":"point"},"datasetId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"pointId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"fallbackX":{"type":"number"},"fallbackY":{"type":"number"},"offsetXpx":{"type":"number"},"offsetYpx":{"type":"number"}},"required":["mode","datasetId","pointId","fallbackX","fallbackY","offsetXpx","offsetYpx"]}]};
const func1 = Object.prototype.hasOwnProperty;
const func2 = runtime0.default;
const pattern5 = new RegExp("^1\\.0\\.[0-9]+$", "u");
const pattern6 = new RegExp("^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$", "u");
const pattern7 = new RegExp("^#[0-9A-Fa-f]{6}$", "u");
const formats0 = runtime1.fullFormats["date-time"];
const schema35 = {"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"name":{"type":"string","maxLength":300},"role":{"enum":["raw","derived"]},"source":{"type":"object","additionalProperties":false,"properties":{"kind":{"enum":["import","clipboard","manual","calculation"]},"displayName":{"type":"string","maxLength":300},"calculationId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"}},"required":["kind"]},"points":{"type":"array","items":{"$ref":"#/$defs/point"},"maxItems":1000000}},"required":["id","name","role","source","points"]};
const schema36 = {"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"x":{"type":"number"},"y":{"type":"number"}},"required":["id","x","y"]};

function validate22(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate22.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.id === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.name === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.role === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "role"},message:"must have required property '"+"role"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.source === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "source"},message:"must have required property '"+"source"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.points === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "points"},message:"must have required property '"+"points"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
for(const key0 in data){
if(!(((((key0 === "id") || (key0 === "name")) || (key0 === "role")) || (key0 === "source")) || (key0 === "points"))){
const err5 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
if(data.id !== undefined){
let data0 = data.id;
if(typeof data0 === "string"){
if(!pattern6.test(data0)){
const err6 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"+"\""};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
else {
const err7 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
if(data.name !== undefined){
let data1 = data.name;
if(typeof data1 === "string"){
if(func2(data1) > 300){
const err8 = {instancePath:instancePath+"/name",schemaPath:"#/properties/name/maxLength",keyword:"maxLength",params:{limit: 300},message:"must NOT have more than 300 characters"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
else {
const err9 = {instancePath:instancePath+"/name",schemaPath:"#/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
if(data.role !== undefined){
let data2 = data.role;
if(!((data2 === "raw") || (data2 === "derived"))){
const err10 = {instancePath:instancePath+"/role",schemaPath:"#/properties/role/enum",keyword:"enum",params:{allowedValues: schema35.properties.role.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
if(data.source !== undefined){
let data3 = data.source;
if(data3 && typeof data3 == "object" && !Array.isArray(data3)){
if(data3.kind === undefined){
const err11 = {instancePath:instancePath+"/source",schemaPath:"#/properties/source/required",keyword:"required",params:{missingProperty: "kind"},message:"must have required property '"+"kind"+"'"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
for(const key1 in data3){
if(!(((key1 === "kind") || (key1 === "displayName")) || (key1 === "calculationId"))){
const err12 = {instancePath:instancePath+"/source",schemaPath:"#/properties/source/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
if(data3.kind !== undefined){
let data4 = data3.kind;
if(!((((data4 === "import") || (data4 === "clipboard")) || (data4 === "manual")) || (data4 === "calculation"))){
const err13 = {instancePath:instancePath+"/source/kind",schemaPath:"#/properties/source/properties/kind/enum",keyword:"enum",params:{allowedValues: schema35.properties.source.properties.kind.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
if(data3.displayName !== undefined){
let data5 = data3.displayName;
if(typeof data5 === "string"){
if(func2(data5) > 300){
const err14 = {instancePath:instancePath+"/source/displayName",schemaPath:"#/properties/source/properties/displayName/maxLength",keyword:"maxLength",params:{limit: 300},message:"must NOT have more than 300 characters"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
else {
const err15 = {instancePath:instancePath+"/source/displayName",schemaPath:"#/properties/source/properties/displayName/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
if(data3.calculationId !== undefined){
let data6 = data3.calculationId;
if(typeof data6 === "string"){
if(!pattern6.test(data6)){
const err16 = {instancePath:instancePath+"/source/calculationId",schemaPath:"#/properties/source/properties/calculationId/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"+"\""};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
}
else {
const err17 = {instancePath:instancePath+"/source/calculationId",schemaPath:"#/properties/source/properties/calculationId/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
}
}
else {
const err18 = {instancePath:instancePath+"/source",schemaPath:"#/properties/source/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
}
if(data.points !== undefined){
let data7 = data.points;
if(Array.isArray(data7)){
if(data7.length > 1000000){
const err19 = {instancePath:instancePath+"/points",schemaPath:"#/properties/points/maxItems",keyword:"maxItems",params:{limit: 1000000},message:"must NOT have more than 1000000 items"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
const len0 = data7.length;
for(let i0=0; i0<len0; i0++){
let data8 = data7[i0];
if(data8 && typeof data8 == "object" && !Array.isArray(data8)){
if(data8.id === undefined){
const err20 = {instancePath:instancePath+"/points/" + i0,schemaPath:"#/$defs/point/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
if(data8.x === undefined){
const err21 = {instancePath:instancePath+"/points/" + i0,schemaPath:"#/$defs/point/required",keyword:"required",params:{missingProperty: "x"},message:"must have required property '"+"x"+"'"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
if(data8.y === undefined){
const err22 = {instancePath:instancePath+"/points/" + i0,schemaPath:"#/$defs/point/required",keyword:"required",params:{missingProperty: "y"},message:"must have required property '"+"y"+"'"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
for(const key2 in data8){
if(!(((key2 === "id") || (key2 === "x")) || (key2 === "y"))){
const err23 = {instancePath:instancePath+"/points/" + i0,schemaPath:"#/$defs/point/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key2},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
}
if(data8.id !== undefined){
let data9 = data8.id;
if(typeof data9 === "string"){
if(!pattern6.test(data9)){
const err24 = {instancePath:instancePath+"/points/" + i0+"/id",schemaPath:"#/$defs/point/properties/id/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"+"\""};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
}
else {
const err25 = {instancePath:instancePath+"/points/" + i0+"/id",schemaPath:"#/$defs/point/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
}
if(data8.x !== undefined){
let data10 = data8.x;
if(!((typeof data10 == "number") && (isFinite(data10)))){
const err26 = {instancePath:instancePath+"/points/" + i0+"/x",schemaPath:"#/$defs/point/properties/x/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
}
if(data8.y !== undefined){
let data11 = data8.y;
if(!((typeof data11 == "number") && (isFinite(data11)))){
const err27 = {instancePath:instancePath+"/points/" + i0+"/y",schemaPath:"#/$defs/point/properties/y/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
}
}
else {
const err28 = {instancePath:instancePath+"/points/" + i0,schemaPath:"#/$defs/point/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
}
}
else {
const err29 = {instancePath:instancePath+"/points",schemaPath:"#/properties/points/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
}
}
}
else {
const err30 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err30];
}
else {
vErrors.push(err30);
}
errors++;
}
validate22.errors = vErrors;
return errors === 0;
}
validate22.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema38 = {"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"type":{"enum":["text","segment","line","arrow","callout","rectangle","range-x","range-y","marker"]},"name":{"type":"string","maxLength":300},"anchors":{"type":"array","items":{"$ref":"#/$defs/anchor"},"minItems":1,"maxItems":2},"geometry":{"type":"object","additionalProperties":false,"properties":{"directionX":{"type":"number"},"directionY":{"type":"number"}},"required":[]},"text":{"type":"array","items":{"$ref":"#/$defs/textPart"},"maxItems":1000},"style":{"type":"object","additionalProperties":false,"properties":{"stroke":{"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"},"strokeWidthPt":{"type":"number","exclusiveMinimum":0,"maximum":24},"dash":{"enum":["solid","dash","dot","dash-dot"]},"strokeOpacity":{"type":"number","minimum":0,"maximum":1},"fill":{"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"},"fillOpacity":{"type":"number","minimum":0,"maximum":1},"fontSizePt":{"type":"number","minimum":6,"maximum":72},"fontFamily":{"const":"Courier New"},"arrowHead":{"enum":["none","start","end","both"]},"markerShape":{"enum":["circle","square","triangle","diamond","cross","plus"]},"markerSizePt":{"type":"number","minimum":0,"maximum":32}},"required":["stroke","strokeWidthPt","dash","strokeOpacity","fill","fillOpacity","fontSizePt","fontFamily","arrowHead","markerShape","markerSizePt"]},"zIndex":{"type":"integer"},"visible":{"type":"boolean"},"locked":{"type":"boolean"}},"required":["id","type","name","anchors","geometry","text","style","zIndex","visible","locked"]};
const schema40 = {"type":"object","additionalProperties":false,"properties":{"text":{"type":"string","maxLength":5000},"baseline":{"enum":["normal","sub","super"]},"bold":{"type":"boolean"},"italic":{"type":"boolean"}},"required":["text","baseline","bold","italic"]};

function validate24(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate24.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.id === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.type === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "type"},message:"must have required property '"+"type"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.name === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.anchors === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "anchors"},message:"must have required property '"+"anchors"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.geometry === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "geometry"},message:"must have required property '"+"geometry"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data.text === undefined){
const err5 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "text"},message:"must have required property '"+"text"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data.style === undefined){
const err6 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "style"},message:"must have required property '"+"style"+"'"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
if(data.zIndex === undefined){
const err7 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "zIndex"},message:"must have required property '"+"zIndex"+"'"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
if(data.visible === undefined){
const err8 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "visible"},message:"must have required property '"+"visible"+"'"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
if(data.locked === undefined){
const err9 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "locked"},message:"must have required property '"+"locked"+"'"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
for(const key0 in data){
if(!(func1.call(schema38.properties, key0))){
const err10 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
if(data.id !== undefined){
let data0 = data.id;
if(typeof data0 === "string"){
if(!pattern6.test(data0)){
const err11 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"+"\""};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
else {
const err12 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
if(data.type !== undefined){
let data1 = data.type;
if(!(((((((((data1 === "text") || (data1 === "segment")) || (data1 === "line")) || (data1 === "arrow")) || (data1 === "callout")) || (data1 === "rectangle")) || (data1 === "range-x")) || (data1 === "range-y")) || (data1 === "marker"))){
const err13 = {instancePath:instancePath+"/type",schemaPath:"#/properties/type/enum",keyword:"enum",params:{allowedValues: schema38.properties.type.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
if(data.name !== undefined){
let data2 = data.name;
if(typeof data2 === "string"){
if(func2(data2) > 300){
const err14 = {instancePath:instancePath+"/name",schemaPath:"#/properties/name/maxLength",keyword:"maxLength",params:{limit: 300},message:"must NOT have more than 300 characters"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
else {
const err15 = {instancePath:instancePath+"/name",schemaPath:"#/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
if(data.anchors !== undefined){
let data3 = data.anchors;
if(Array.isArray(data3)){
if(data3.length > 2){
const err16 = {instancePath:instancePath+"/anchors",schemaPath:"#/properties/anchors/maxItems",keyword:"maxItems",params:{limit: 2},message:"must NOT have more than 2 items"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
if(data3.length < 1){
const err17 = {instancePath:instancePath+"/anchors",schemaPath:"#/properties/anchors/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
const len0 = data3.length;
for(let i0=0; i0<len0; i0++){
let data4 = data3[i0];
const _errs11 = errors;
let valid4 = false;
let passing0 = null;
const _errs12 = errors;
if(data4 && typeof data4 == "object" && !Array.isArray(data4)){
if(data4.mode === undefined){
const err18 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/0/required",keyword:"required",params:{missingProperty: "mode"},message:"must have required property '"+"mode"+"'"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
if(data4.x === undefined){
const err19 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/0/required",keyword:"required",params:{missingProperty: "x"},message:"must have required property '"+"x"+"'"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
if(data4.y === undefined){
const err20 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/0/required",keyword:"required",params:{missingProperty: "y"},message:"must have required property '"+"y"+"'"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
for(const key1 in data4){
if(!(((key1 === "mode") || (key1 === "x")) || (key1 === "y"))){
const err21 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/0/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
}
if(data4.mode !== undefined){
if("data" !== data4.mode){
const err22 = {instancePath:instancePath+"/anchors/" + i0+"/mode",schemaPath:"#/$defs/anchor/oneOf/0/properties/mode/const",keyword:"const",params:{allowedValue: "data"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
}
if(data4.x !== undefined){
let data6 = data4.x;
if(!((typeof data6 == "number") && (isFinite(data6)))){
const err23 = {instancePath:instancePath+"/anchors/" + i0+"/x",schemaPath:"#/$defs/anchor/oneOf/0/properties/x/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
}
if(data4.y !== undefined){
let data7 = data4.y;
if(!((typeof data7 == "number") && (isFinite(data7)))){
const err24 = {instancePath:instancePath+"/anchors/" + i0+"/y",schemaPath:"#/$defs/anchor/oneOf/0/properties/y/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
}
}
else {
const err25 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
var _valid0 = _errs12 === errors;
if(_valid0){
valid4 = true;
passing0 = 0;
var props0 = true;
}
const _errs20 = errors;
if(data4 && typeof data4 == "object" && !Array.isArray(data4)){
if(data4.mode === undefined){
const err26 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/1/required",keyword:"required",params:{missingProperty: "mode"},message:"must have required property '"+"mode"+"'"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
if(data4.pageX === undefined){
const err27 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/1/required",keyword:"required",params:{missingProperty: "pageX"},message:"must have required property '"+"pageX"+"'"};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
if(data4.pageY === undefined){
const err28 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/1/required",keyword:"required",params:{missingProperty: "pageY"},message:"must have required property '"+"pageY"+"'"};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
for(const key2 in data4){
if(!(((key2 === "mode") || (key2 === "pageX")) || (key2 === "pageY"))){
const err29 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/1/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key2},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
}
}
if(data4.mode !== undefined){
if("page" !== data4.mode){
const err30 = {instancePath:instancePath+"/anchors/" + i0+"/mode",schemaPath:"#/$defs/anchor/oneOf/1/properties/mode/const",keyword:"const",params:{allowedValue: "page"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err30];
}
else {
vErrors.push(err30);
}
errors++;
}
}
if(data4.pageX !== undefined){
let data9 = data4.pageX;
if((typeof data9 == "number") && (isFinite(data9))){
if(data9 > 1 || isNaN(data9)){
const err31 = {instancePath:instancePath+"/anchors/" + i0+"/pageX",schemaPath:"#/$defs/anchor/oneOf/1/properties/pageX/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1},message:"must be <= 1"};
if(vErrors === null){
vErrors = [err31];
}
else {
vErrors.push(err31);
}
errors++;
}
if(data9 < 0 || isNaN(data9)){
const err32 = {instancePath:instancePath+"/anchors/" + i0+"/pageX",schemaPath:"#/$defs/anchor/oneOf/1/properties/pageX/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err32];
}
else {
vErrors.push(err32);
}
errors++;
}
}
else {
const err33 = {instancePath:instancePath+"/anchors/" + i0+"/pageX",schemaPath:"#/$defs/anchor/oneOf/1/properties/pageX/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err33];
}
else {
vErrors.push(err33);
}
errors++;
}
}
if(data4.pageY !== undefined){
let data10 = data4.pageY;
if((typeof data10 == "number") && (isFinite(data10))){
if(data10 > 1 || isNaN(data10)){
const err34 = {instancePath:instancePath+"/anchors/" + i0+"/pageY",schemaPath:"#/$defs/anchor/oneOf/1/properties/pageY/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1},message:"must be <= 1"};
if(vErrors === null){
vErrors = [err34];
}
else {
vErrors.push(err34);
}
errors++;
}
if(data10 < 0 || isNaN(data10)){
const err35 = {instancePath:instancePath+"/anchors/" + i0+"/pageY",schemaPath:"#/$defs/anchor/oneOf/1/properties/pageY/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err35];
}
else {
vErrors.push(err35);
}
errors++;
}
}
else {
const err36 = {instancePath:instancePath+"/anchors/" + i0+"/pageY",schemaPath:"#/$defs/anchor/oneOf/1/properties/pageY/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err36];
}
else {
vErrors.push(err36);
}
errors++;
}
}
}
else {
const err37 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/1/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err37];
}
else {
vErrors.push(err37);
}
errors++;
}
var _valid0 = _errs20 === errors;
if(_valid0 && valid4){
valid4 = false;
passing0 = [passing0, 1];
}
else {
if(_valid0){
valid4 = true;
passing0 = 1;
if(props0 !== true){
props0 = true;
}
}
const _errs28 = errors;
if(data4 && typeof data4 == "object" && !Array.isArray(data4)){
if(data4.mode === undefined){
const err38 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/2/required",keyword:"required",params:{missingProperty: "mode"},message:"must have required property '"+"mode"+"'"};
if(vErrors === null){
vErrors = [err38];
}
else {
vErrors.push(err38);
}
errors++;
}
if(data4.datasetId === undefined){
const err39 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/2/required",keyword:"required",params:{missingProperty: "datasetId"},message:"must have required property '"+"datasetId"+"'"};
if(vErrors === null){
vErrors = [err39];
}
else {
vErrors.push(err39);
}
errors++;
}
if(data4.pointId === undefined){
const err40 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/2/required",keyword:"required",params:{missingProperty: "pointId"},message:"must have required property '"+"pointId"+"'"};
if(vErrors === null){
vErrors = [err40];
}
else {
vErrors.push(err40);
}
errors++;
}
if(data4.fallbackX === undefined){
const err41 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/2/required",keyword:"required",params:{missingProperty: "fallbackX"},message:"must have required property '"+"fallbackX"+"'"};
if(vErrors === null){
vErrors = [err41];
}
else {
vErrors.push(err41);
}
errors++;
}
if(data4.fallbackY === undefined){
const err42 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/2/required",keyword:"required",params:{missingProperty: "fallbackY"},message:"must have required property '"+"fallbackY"+"'"};
if(vErrors === null){
vErrors = [err42];
}
else {
vErrors.push(err42);
}
errors++;
}
if(data4.offsetXpx === undefined){
const err43 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/2/required",keyword:"required",params:{missingProperty: "offsetXpx"},message:"must have required property '"+"offsetXpx"+"'"};
if(vErrors === null){
vErrors = [err43];
}
else {
vErrors.push(err43);
}
errors++;
}
if(data4.offsetYpx === undefined){
const err44 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/2/required",keyword:"required",params:{missingProperty: "offsetYpx"},message:"must have required property '"+"offsetYpx"+"'"};
if(vErrors === null){
vErrors = [err44];
}
else {
vErrors.push(err44);
}
errors++;
}
for(const key3 in data4){
if(!(((((((key3 === "mode") || (key3 === "datasetId")) || (key3 === "pointId")) || (key3 === "fallbackX")) || (key3 === "fallbackY")) || (key3 === "offsetXpx")) || (key3 === "offsetYpx"))){
const err45 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/2/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key3},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err45];
}
else {
vErrors.push(err45);
}
errors++;
}
}
if(data4.mode !== undefined){
if("point" !== data4.mode){
const err46 = {instancePath:instancePath+"/anchors/" + i0+"/mode",schemaPath:"#/$defs/anchor/oneOf/2/properties/mode/const",keyword:"const",params:{allowedValue: "point"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err46];
}
else {
vErrors.push(err46);
}
errors++;
}
}
if(data4.datasetId !== undefined){
let data12 = data4.datasetId;
if(typeof data12 === "string"){
if(!pattern6.test(data12)){
const err47 = {instancePath:instancePath+"/anchors/" + i0+"/datasetId",schemaPath:"#/$defs/anchor/oneOf/2/properties/datasetId/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"+"\""};
if(vErrors === null){
vErrors = [err47];
}
else {
vErrors.push(err47);
}
errors++;
}
}
else {
const err48 = {instancePath:instancePath+"/anchors/" + i0+"/datasetId",schemaPath:"#/$defs/anchor/oneOf/2/properties/datasetId/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err48];
}
else {
vErrors.push(err48);
}
errors++;
}
}
if(data4.pointId !== undefined){
let data13 = data4.pointId;
if(typeof data13 === "string"){
if(!pattern6.test(data13)){
const err49 = {instancePath:instancePath+"/anchors/" + i0+"/pointId",schemaPath:"#/$defs/anchor/oneOf/2/properties/pointId/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"+"\""};
if(vErrors === null){
vErrors = [err49];
}
else {
vErrors.push(err49);
}
errors++;
}
}
else {
const err50 = {instancePath:instancePath+"/anchors/" + i0+"/pointId",schemaPath:"#/$defs/anchor/oneOf/2/properties/pointId/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err50];
}
else {
vErrors.push(err50);
}
errors++;
}
}
if(data4.fallbackX !== undefined){
let data14 = data4.fallbackX;
if(!((typeof data14 == "number") && (isFinite(data14)))){
const err51 = {instancePath:instancePath+"/anchors/" + i0+"/fallbackX",schemaPath:"#/$defs/anchor/oneOf/2/properties/fallbackX/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err51];
}
else {
vErrors.push(err51);
}
errors++;
}
}
if(data4.fallbackY !== undefined){
let data15 = data4.fallbackY;
if(!((typeof data15 == "number") && (isFinite(data15)))){
const err52 = {instancePath:instancePath+"/anchors/" + i0+"/fallbackY",schemaPath:"#/$defs/anchor/oneOf/2/properties/fallbackY/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err52];
}
else {
vErrors.push(err52);
}
errors++;
}
}
if(data4.offsetXpx !== undefined){
let data16 = data4.offsetXpx;
if(!((typeof data16 == "number") && (isFinite(data16)))){
const err53 = {instancePath:instancePath+"/anchors/" + i0+"/offsetXpx",schemaPath:"#/$defs/anchor/oneOf/2/properties/offsetXpx/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err53];
}
else {
vErrors.push(err53);
}
errors++;
}
}
if(data4.offsetYpx !== undefined){
let data17 = data4.offsetYpx;
if(!((typeof data17 == "number") && (isFinite(data17)))){
const err54 = {instancePath:instancePath+"/anchors/" + i0+"/offsetYpx",schemaPath:"#/$defs/anchor/oneOf/2/properties/offsetYpx/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err54];
}
else {
vErrors.push(err54);
}
errors++;
}
}
}
else {
const err55 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/2/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err55];
}
else {
vErrors.push(err55);
}
errors++;
}
var _valid0 = _errs28 === errors;
if(_valid0 && valid4){
valid4 = false;
passing0 = [passing0, 2];
}
else {
if(_valid0){
valid4 = true;
passing0 = 2;
if(props0 !== true){
props0 = true;
}
}
}
}
if(!valid4){
const err56 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf",keyword:"oneOf",params:{passingSchemas: passing0},message:"must match exactly one schema in oneOf"};
if(vErrors === null){
vErrors = [err56];
}
else {
vErrors.push(err56);
}
errors++;
}
else {
errors = _errs11;
if(vErrors !== null){
if(_errs11){
vErrors.length = _errs11;
}
else {
vErrors = null;
}
}
}
}
}
else {
const err57 = {instancePath:instancePath+"/anchors",schemaPath:"#/properties/anchors/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err57];
}
else {
vErrors.push(err57);
}
errors++;
}
}
if(data.geometry !== undefined){
let data18 = data.geometry;
if(data18 && typeof data18 == "object" && !Array.isArray(data18)){
for(const key4 in data18){
if(!((key4 === "directionX") || (key4 === "directionY"))){
const err58 = {instancePath:instancePath+"/geometry",schemaPath:"#/properties/geometry/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key4},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err58];
}
else {
vErrors.push(err58);
}
errors++;
}
}
if(data18.directionX !== undefined){
let data19 = data18.directionX;
if(!((typeof data19 == "number") && (isFinite(data19)))){
const err59 = {instancePath:instancePath+"/geometry/directionX",schemaPath:"#/properties/geometry/properties/directionX/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err59];
}
else {
vErrors.push(err59);
}
errors++;
}
}
if(data18.directionY !== undefined){
let data20 = data18.directionY;
if(!((typeof data20 == "number") && (isFinite(data20)))){
const err60 = {instancePath:instancePath+"/geometry/directionY",schemaPath:"#/properties/geometry/properties/directionY/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err60];
}
else {
vErrors.push(err60);
}
errors++;
}
}
}
else {
const err61 = {instancePath:instancePath+"/geometry",schemaPath:"#/properties/geometry/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err61];
}
else {
vErrors.push(err61);
}
errors++;
}
}
if(data.text !== undefined){
let data21 = data.text;
if(Array.isArray(data21)){
if(data21.length > 1000){
const err62 = {instancePath:instancePath+"/text",schemaPath:"#/properties/text/maxItems",keyword:"maxItems",params:{limit: 1000},message:"must NOT have more than 1000 items"};
if(vErrors === null){
vErrors = [err62];
}
else {
vErrors.push(err62);
}
errors++;
}
const len1 = data21.length;
for(let i1=0; i1<len1; i1++){
let data22 = data21[i1];
if(data22 && typeof data22 == "object" && !Array.isArray(data22)){
if(data22.text === undefined){
const err63 = {instancePath:instancePath+"/text/" + i1,schemaPath:"#/$defs/textPart/required",keyword:"required",params:{missingProperty: "text"},message:"must have required property '"+"text"+"'"};
if(vErrors === null){
vErrors = [err63];
}
else {
vErrors.push(err63);
}
errors++;
}
if(data22.baseline === undefined){
const err64 = {instancePath:instancePath+"/text/" + i1,schemaPath:"#/$defs/textPart/required",keyword:"required",params:{missingProperty: "baseline"},message:"must have required property '"+"baseline"+"'"};
if(vErrors === null){
vErrors = [err64];
}
else {
vErrors.push(err64);
}
errors++;
}
if(data22.bold === undefined){
const err65 = {instancePath:instancePath+"/text/" + i1,schemaPath:"#/$defs/textPart/required",keyword:"required",params:{missingProperty: "bold"},message:"must have required property '"+"bold"+"'"};
if(vErrors === null){
vErrors = [err65];
}
else {
vErrors.push(err65);
}
errors++;
}
if(data22.italic === undefined){
const err66 = {instancePath:instancePath+"/text/" + i1,schemaPath:"#/$defs/textPart/required",keyword:"required",params:{missingProperty: "italic"},message:"must have required property '"+"italic"+"'"};
if(vErrors === null){
vErrors = [err66];
}
else {
vErrors.push(err66);
}
errors++;
}
for(const key5 in data22){
if(!((((key5 === "text") || (key5 === "baseline")) || (key5 === "bold")) || (key5 === "italic"))){
const err67 = {instancePath:instancePath+"/text/" + i1,schemaPath:"#/$defs/textPart/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key5},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err67];
}
else {
vErrors.push(err67);
}
errors++;
}
}
if(data22.text !== undefined){
let data23 = data22.text;
if(typeof data23 === "string"){
if(func2(data23) > 5000){
const err68 = {instancePath:instancePath+"/text/" + i1+"/text",schemaPath:"#/$defs/textPart/properties/text/maxLength",keyword:"maxLength",params:{limit: 5000},message:"must NOT have more than 5000 characters"};
if(vErrors === null){
vErrors = [err68];
}
else {
vErrors.push(err68);
}
errors++;
}
}
else {
const err69 = {instancePath:instancePath+"/text/" + i1+"/text",schemaPath:"#/$defs/textPart/properties/text/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err69];
}
else {
vErrors.push(err69);
}
errors++;
}
}
if(data22.baseline !== undefined){
let data24 = data22.baseline;
if(!(((data24 === "normal") || (data24 === "sub")) || (data24 === "super"))){
const err70 = {instancePath:instancePath+"/text/" + i1+"/baseline",schemaPath:"#/$defs/textPart/properties/baseline/enum",keyword:"enum",params:{allowedValues: schema40.properties.baseline.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err70];
}
else {
vErrors.push(err70);
}
errors++;
}
}
if(data22.bold !== undefined){
if(typeof data22.bold !== "boolean"){
const err71 = {instancePath:instancePath+"/text/" + i1+"/bold",schemaPath:"#/$defs/textPart/properties/bold/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err71];
}
else {
vErrors.push(err71);
}
errors++;
}
}
if(data22.italic !== undefined){
if(typeof data22.italic !== "boolean"){
const err72 = {instancePath:instancePath+"/text/" + i1+"/italic",schemaPath:"#/$defs/textPart/properties/italic/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err72];
}
else {
vErrors.push(err72);
}
errors++;
}
}
}
else {
const err73 = {instancePath:instancePath+"/text/" + i1,schemaPath:"#/$defs/textPart/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err73];
}
else {
vErrors.push(err73);
}
errors++;
}
}
}
else {
const err74 = {instancePath:instancePath+"/text",schemaPath:"#/properties/text/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err74];
}
else {
vErrors.push(err74);
}
errors++;
}
}
if(data.style !== undefined){
let data27 = data.style;
if(data27 && typeof data27 == "object" && !Array.isArray(data27)){
if(data27.stroke === undefined){
const err75 = {instancePath:instancePath+"/style",schemaPath:"#/properties/style/required",keyword:"required",params:{missingProperty: "stroke"},message:"must have required property '"+"stroke"+"'"};
if(vErrors === null){
vErrors = [err75];
}
else {
vErrors.push(err75);
}
errors++;
}
if(data27.strokeWidthPt === undefined){
const err76 = {instancePath:instancePath+"/style",schemaPath:"#/properties/style/required",keyword:"required",params:{missingProperty: "strokeWidthPt"},message:"must have required property '"+"strokeWidthPt"+"'"};
if(vErrors === null){
vErrors = [err76];
}
else {
vErrors.push(err76);
}
errors++;
}
if(data27.dash === undefined){
const err77 = {instancePath:instancePath+"/style",schemaPath:"#/properties/style/required",keyword:"required",params:{missingProperty: "dash"},message:"must have required property '"+"dash"+"'"};
if(vErrors === null){
vErrors = [err77];
}
else {
vErrors.push(err77);
}
errors++;
}
if(data27.strokeOpacity === undefined){
const err78 = {instancePath:instancePath+"/style",schemaPath:"#/properties/style/required",keyword:"required",params:{missingProperty: "strokeOpacity"},message:"must have required property '"+"strokeOpacity"+"'"};
if(vErrors === null){
vErrors = [err78];
}
else {
vErrors.push(err78);
}
errors++;
}
if(data27.fill === undefined){
const err79 = {instancePath:instancePath+"/style",schemaPath:"#/properties/style/required",keyword:"required",params:{missingProperty: "fill"},message:"must have required property '"+"fill"+"'"};
if(vErrors === null){
vErrors = [err79];
}
else {
vErrors.push(err79);
}
errors++;
}
if(data27.fillOpacity === undefined){
const err80 = {instancePath:instancePath+"/style",schemaPath:"#/properties/style/required",keyword:"required",params:{missingProperty: "fillOpacity"},message:"must have required property '"+"fillOpacity"+"'"};
if(vErrors === null){
vErrors = [err80];
}
else {
vErrors.push(err80);
}
errors++;
}
if(data27.fontSizePt === undefined){
const err81 = {instancePath:instancePath+"/style",schemaPath:"#/properties/style/required",keyword:"required",params:{missingProperty: "fontSizePt"},message:"must have required property '"+"fontSizePt"+"'"};
if(vErrors === null){
vErrors = [err81];
}
else {
vErrors.push(err81);
}
errors++;
}
if(data27.fontFamily === undefined){
const err82 = {instancePath:instancePath+"/style",schemaPath:"#/properties/style/required",keyword:"required",params:{missingProperty: "fontFamily"},message:"must have required property '"+"fontFamily"+"'"};
if(vErrors === null){
vErrors = [err82];
}
else {
vErrors.push(err82);
}
errors++;
}
if(data27.arrowHead === undefined){
const err83 = {instancePath:instancePath+"/style",schemaPath:"#/properties/style/required",keyword:"required",params:{missingProperty: "arrowHead"},message:"must have required property '"+"arrowHead"+"'"};
if(vErrors === null){
vErrors = [err83];
}
else {
vErrors.push(err83);
}
errors++;
}
if(data27.markerShape === undefined){
const err84 = {instancePath:instancePath+"/style",schemaPath:"#/properties/style/required",keyword:"required",params:{missingProperty: "markerShape"},message:"must have required property '"+"markerShape"+"'"};
if(vErrors === null){
vErrors = [err84];
}
else {
vErrors.push(err84);
}
errors++;
}
if(data27.markerSizePt === undefined){
const err85 = {instancePath:instancePath+"/style",schemaPath:"#/properties/style/required",keyword:"required",params:{missingProperty: "markerSizePt"},message:"must have required property '"+"markerSizePt"+"'"};
if(vErrors === null){
vErrors = [err85];
}
else {
vErrors.push(err85);
}
errors++;
}
for(const key6 in data27){
if(!(func1.call(schema38.properties.style.properties, key6))){
const err86 = {instancePath:instancePath+"/style",schemaPath:"#/properties/style/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key6},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err86];
}
else {
vErrors.push(err86);
}
errors++;
}
}
if(data27.stroke !== undefined){
let data28 = data27.stroke;
if(typeof data28 === "string"){
if(!pattern7.test(data28)){
const err87 = {instancePath:instancePath+"/style/stroke",schemaPath:"#/properties/style/properties/stroke/pattern",keyword:"pattern",params:{pattern: "^#[0-9A-Fa-f]{6}$"},message:"must match pattern \""+"^#[0-9A-Fa-f]{6}$"+"\""};
if(vErrors === null){
vErrors = [err87];
}
else {
vErrors.push(err87);
}
errors++;
}
}
else {
const err88 = {instancePath:instancePath+"/style/stroke",schemaPath:"#/properties/style/properties/stroke/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err88];
}
else {
vErrors.push(err88);
}
errors++;
}
}
if(data27.strokeWidthPt !== undefined){
let data29 = data27.strokeWidthPt;
if((typeof data29 == "number") && (isFinite(data29))){
if(data29 > 24 || isNaN(data29)){
const err89 = {instancePath:instancePath+"/style/strokeWidthPt",schemaPath:"#/properties/style/properties/strokeWidthPt/maximum",keyword:"maximum",params:{comparison: "<=", limit: 24},message:"must be <= 24"};
if(vErrors === null){
vErrors = [err89];
}
else {
vErrors.push(err89);
}
errors++;
}
if(data29 <= 0 || isNaN(data29)){
const err90 = {instancePath:instancePath+"/style/strokeWidthPt",schemaPath:"#/properties/style/properties/strokeWidthPt/exclusiveMinimum",keyword:"exclusiveMinimum",params:{comparison: ">", limit: 0},message:"must be > 0"};
if(vErrors === null){
vErrors = [err90];
}
else {
vErrors.push(err90);
}
errors++;
}
}
else {
const err91 = {instancePath:instancePath+"/style/strokeWidthPt",schemaPath:"#/properties/style/properties/strokeWidthPt/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err91];
}
else {
vErrors.push(err91);
}
errors++;
}
}
if(data27.dash !== undefined){
let data30 = data27.dash;
if(!((((data30 === "solid") || (data30 === "dash")) || (data30 === "dot")) || (data30 === "dash-dot"))){
const err92 = {instancePath:instancePath+"/style/dash",schemaPath:"#/properties/style/properties/dash/enum",keyword:"enum",params:{allowedValues: schema38.properties.style.properties.dash.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err92];
}
else {
vErrors.push(err92);
}
errors++;
}
}
if(data27.strokeOpacity !== undefined){
let data31 = data27.strokeOpacity;
if((typeof data31 == "number") && (isFinite(data31))){
if(data31 > 1 || isNaN(data31)){
const err93 = {instancePath:instancePath+"/style/strokeOpacity",schemaPath:"#/properties/style/properties/strokeOpacity/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1},message:"must be <= 1"};
if(vErrors === null){
vErrors = [err93];
}
else {
vErrors.push(err93);
}
errors++;
}
if(data31 < 0 || isNaN(data31)){
const err94 = {instancePath:instancePath+"/style/strokeOpacity",schemaPath:"#/properties/style/properties/strokeOpacity/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err94];
}
else {
vErrors.push(err94);
}
errors++;
}
}
else {
const err95 = {instancePath:instancePath+"/style/strokeOpacity",schemaPath:"#/properties/style/properties/strokeOpacity/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err95];
}
else {
vErrors.push(err95);
}
errors++;
}
}
if(data27.fill !== undefined){
let data32 = data27.fill;
if(typeof data32 === "string"){
if(!pattern7.test(data32)){
const err96 = {instancePath:instancePath+"/style/fill",schemaPath:"#/properties/style/properties/fill/pattern",keyword:"pattern",params:{pattern: "^#[0-9A-Fa-f]{6}$"},message:"must match pattern \""+"^#[0-9A-Fa-f]{6}$"+"\""};
if(vErrors === null){
vErrors = [err96];
}
else {
vErrors.push(err96);
}
errors++;
}
}
else {
const err97 = {instancePath:instancePath+"/style/fill",schemaPath:"#/properties/style/properties/fill/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err97];
}
else {
vErrors.push(err97);
}
errors++;
}
}
if(data27.fillOpacity !== undefined){
let data33 = data27.fillOpacity;
if((typeof data33 == "number") && (isFinite(data33))){
if(data33 > 1 || isNaN(data33)){
const err98 = {instancePath:instancePath+"/style/fillOpacity",schemaPath:"#/properties/style/properties/fillOpacity/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1},message:"must be <= 1"};
if(vErrors === null){
vErrors = [err98];
}
else {
vErrors.push(err98);
}
errors++;
}
if(data33 < 0 || isNaN(data33)){
const err99 = {instancePath:instancePath+"/style/fillOpacity",schemaPath:"#/properties/style/properties/fillOpacity/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err99];
}
else {
vErrors.push(err99);
}
errors++;
}
}
else {
const err100 = {instancePath:instancePath+"/style/fillOpacity",schemaPath:"#/properties/style/properties/fillOpacity/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err100];
}
else {
vErrors.push(err100);
}
errors++;
}
}
if(data27.fontSizePt !== undefined){
let data34 = data27.fontSizePt;
if((typeof data34 == "number") && (isFinite(data34))){
if(data34 > 72 || isNaN(data34)){
const err101 = {instancePath:instancePath+"/style/fontSizePt",schemaPath:"#/properties/style/properties/fontSizePt/maximum",keyword:"maximum",params:{comparison: "<=", limit: 72},message:"must be <= 72"};
if(vErrors === null){
vErrors = [err101];
}
else {
vErrors.push(err101);
}
errors++;
}
if(data34 < 6 || isNaN(data34)){
const err102 = {instancePath:instancePath+"/style/fontSizePt",schemaPath:"#/properties/style/properties/fontSizePt/minimum",keyword:"minimum",params:{comparison: ">=", limit: 6},message:"must be >= 6"};
if(vErrors === null){
vErrors = [err102];
}
else {
vErrors.push(err102);
}
errors++;
}
}
else {
const err103 = {instancePath:instancePath+"/style/fontSizePt",schemaPath:"#/properties/style/properties/fontSizePt/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err103];
}
else {
vErrors.push(err103);
}
errors++;
}
}
if(data27.fontFamily !== undefined){
if("Courier New" !== data27.fontFamily){
const err104 = {instancePath:instancePath+"/style/fontFamily",schemaPath:"#/properties/style/properties/fontFamily/const",keyword:"const",params:{allowedValue: "Courier New"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err104];
}
else {
vErrors.push(err104);
}
errors++;
}
}
if(data27.arrowHead !== undefined){
let data36 = data27.arrowHead;
if(!((((data36 === "none") || (data36 === "start")) || (data36 === "end")) || (data36 === "both"))){
const err105 = {instancePath:instancePath+"/style/arrowHead",schemaPath:"#/properties/style/properties/arrowHead/enum",keyword:"enum",params:{allowedValues: schema38.properties.style.properties.arrowHead.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err105];
}
else {
vErrors.push(err105);
}
errors++;
}
}
if(data27.markerShape !== undefined){
let data37 = data27.markerShape;
if(!((((((data37 === "circle") || (data37 === "square")) || (data37 === "triangle")) || (data37 === "diamond")) || (data37 === "cross")) || (data37 === "plus"))){
const err106 = {instancePath:instancePath+"/style/markerShape",schemaPath:"#/properties/style/properties/markerShape/enum",keyword:"enum",params:{allowedValues: schema38.properties.style.properties.markerShape.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err106];
}
else {
vErrors.push(err106);
}
errors++;
}
}
if(data27.markerSizePt !== undefined){
let data38 = data27.markerSizePt;
if((typeof data38 == "number") && (isFinite(data38))){
if(data38 > 32 || isNaN(data38)){
const err107 = {instancePath:instancePath+"/style/markerSizePt",schemaPath:"#/properties/style/properties/markerSizePt/maximum",keyword:"maximum",params:{comparison: "<=", limit: 32},message:"must be <= 32"};
if(vErrors === null){
vErrors = [err107];
}
else {
vErrors.push(err107);
}
errors++;
}
if(data38 < 0 || isNaN(data38)){
const err108 = {instancePath:instancePath+"/style/markerSizePt",schemaPath:"#/properties/style/properties/markerSizePt/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err108];
}
else {
vErrors.push(err108);
}
errors++;
}
}
else {
const err109 = {instancePath:instancePath+"/style/markerSizePt",schemaPath:"#/properties/style/properties/markerSizePt/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err109];
}
else {
vErrors.push(err109);
}
errors++;
}
}
}
else {
const err110 = {instancePath:instancePath+"/style",schemaPath:"#/properties/style/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err110];
}
else {
vErrors.push(err110);
}
errors++;
}
}
if(data.zIndex !== undefined){
let data39 = data.zIndex;
if(!(((typeof data39 == "number") && (!(data39 % 1) && !isNaN(data39))) && (isFinite(data39)))){
const err111 = {instancePath:instancePath+"/zIndex",schemaPath:"#/properties/zIndex/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err111];
}
else {
vErrors.push(err111);
}
errors++;
}
}
if(data.visible !== undefined){
if(typeof data.visible !== "boolean"){
const err112 = {instancePath:instancePath+"/visible",schemaPath:"#/properties/visible/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err112];
}
else {
vErrors.push(err112);
}
errors++;
}
}
if(data.locked !== undefined){
if(typeof data.locked !== "boolean"){
const err113 = {instancePath:instancePath+"/locked",schemaPath:"#/properties/locked/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err113];
}
else {
vErrors.push(err113);
}
errors++;
}
}
}
else {
const err114 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err114];
}
else {
vErrors.push(err114);
}
errors++;
}
validate24.errors = vErrors;
return errors === 0;
}
validate24.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate21(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
/*# sourceURL="https://github.com/anatamien/APIO-GRAPH/blob/main/schemas/aph-1.0.schema.json" */;
let vErrors = null;
let errors = 0;
const evaluated0 = validate21.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.format === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "format"},message:"must have required property '"+"format"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.schemaVersion === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "schemaVersion"},message:"must have required property '"+"schemaVersion"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.createdWith === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "createdWith"},message:"must have required property '"+"createdWith"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.project === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "project"},message:"must have required property '"+"project"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.page === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "page"},message:"must have required property '"+"page"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data.axes === undefined){
const err5 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "axes"},message:"must have required property '"+"axes"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data.datasets === undefined){
const err6 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "datasets"},message:"must have required property '"+"datasets"+"'"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
if(data.series === undefined){
const err7 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "series"},message:"must have required property '"+"series"+"'"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
if(data.objects === undefined){
const err8 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "objects"},message:"must have required property '"+"objects"+"'"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
if(data.calculations === undefined){
const err9 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "calculations"},message:"must have required property '"+"calculations"+"'"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
if(data.legend === undefined){
const err10 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "legend"},message:"must have required property '"+"legend"+"'"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
if(data.viewport === undefined){
const err11 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "viewport"},message:"must have required property '"+"viewport"+"'"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
if(data.editor === undefined){
const err12 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "editor"},message:"must have required property '"+"editor"+"'"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
if(data.extensions === undefined){
const err13 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "extensions"},message:"must have required property '"+"extensions"+"'"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
for(const key0 in data){
if(!(func1.call(schema32.properties, key0))){
const err14 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
if(data.format !== undefined){
if("APIO_GRAPH_PROJECT" !== data.format){
const err15 = {instancePath:instancePath+"/format",schemaPath:"#/properties/format/const",keyword:"const",params:{allowedValue: "APIO_GRAPH_PROJECT"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
if(data.schemaVersion !== undefined){
let data1 = data.schemaVersion;
if(typeof data1 === "string"){
if(!pattern5.test(data1)){
const err16 = {instancePath:instancePath+"/schemaVersion",schemaPath:"#/properties/schemaVersion/pattern",keyword:"pattern",params:{pattern: "^1\\.0\\.[0-9]+$"},message:"must match pattern \""+"^1\\.0\\.[0-9]+$"+"\""};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
}
else {
const err17 = {instancePath:instancePath+"/schemaVersion",schemaPath:"#/properties/schemaVersion/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
}
if(data.createdWith !== undefined){
let data2 = data.createdWith;
if(data2 && typeof data2 == "object" && !Array.isArray(data2)){
if(data2.name === undefined){
const err18 = {instancePath:instancePath+"/createdWith",schemaPath:"#/properties/createdWith/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
if(data2.version === undefined){
const err19 = {instancePath:instancePath+"/createdWith",schemaPath:"#/properties/createdWith/required",keyword:"required",params:{missingProperty: "version"},message:"must have required property '"+"version"+"'"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
for(const key1 in data2){
if(!((key1 === "name") || (key1 === "version"))){
const err20 = {instancePath:instancePath+"/createdWith",schemaPath:"#/properties/createdWith/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
}
if(data2.name !== undefined){
if("APIO GRAPH" !== data2.name){
const err21 = {instancePath:instancePath+"/createdWith/name",schemaPath:"#/properties/createdWith/properties/name/const",keyword:"const",params:{allowedValue: "APIO GRAPH"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
}
if(data2.version !== undefined){
let data4 = data2.version;
if(typeof data4 === "string"){
if(func2(data4) < 1){
const err22 = {instancePath:instancePath+"/createdWith/version",schemaPath:"#/properties/createdWith/properties/version/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
}
else {
const err23 = {instancePath:instancePath+"/createdWith/version",schemaPath:"#/properties/createdWith/properties/version/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
}
}
else {
const err24 = {instancePath:instancePath+"/createdWith",schemaPath:"#/properties/createdWith/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
}
if(data.project !== undefined){
let data5 = data.project;
if(data5 && typeof data5 == "object" && !Array.isArray(data5)){
if(data5.id === undefined){
const err25 = {instancePath:instancePath+"/project",schemaPath:"#/properties/project/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
if(data5.title === undefined){
const err26 = {instancePath:instancePath+"/project",schemaPath:"#/properties/project/required",keyword:"required",params:{missingProperty: "title"},message:"must have required property '"+"title"+"'"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
if(data5.createdAt === undefined){
const err27 = {instancePath:instancePath+"/project",schemaPath:"#/properties/project/required",keyword:"required",params:{missingProperty: "createdAt"},message:"must have required property '"+"createdAt"+"'"};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
if(data5.updatedAt === undefined){
const err28 = {instancePath:instancePath+"/project",schemaPath:"#/properties/project/required",keyword:"required",params:{missingProperty: "updatedAt"},message:"must have required property '"+"updatedAt"+"'"};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
for(const key2 in data5){
if(!((((key2 === "id") || (key2 === "title")) || (key2 === "createdAt")) || (key2 === "updatedAt"))){
const err29 = {instancePath:instancePath+"/project",schemaPath:"#/properties/project/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key2},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
}
}
if(data5.id !== undefined){
let data6 = data5.id;
if(typeof data6 === "string"){
if(!pattern6.test(data6)){
const err30 = {instancePath:instancePath+"/project/id",schemaPath:"#/properties/project/properties/id/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"+"\""};
if(vErrors === null){
vErrors = [err30];
}
else {
vErrors.push(err30);
}
errors++;
}
}
else {
const err31 = {instancePath:instancePath+"/project/id",schemaPath:"#/properties/project/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err31];
}
else {
vErrors.push(err31);
}
errors++;
}
}
if(data5.title !== undefined){
let data7 = data5.title;
if(typeof data7 === "string"){
if(func2(data7) > 300){
const err32 = {instancePath:instancePath+"/project/title",schemaPath:"#/properties/project/properties/title/maxLength",keyword:"maxLength",params:{limit: 300},message:"must NOT have more than 300 characters"};
if(vErrors === null){
vErrors = [err32];
}
else {
vErrors.push(err32);
}
errors++;
}
}
else {
const err33 = {instancePath:instancePath+"/project/title",schemaPath:"#/properties/project/properties/title/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err33];
}
else {
vErrors.push(err33);
}
errors++;
}
}
if(data5.createdAt !== undefined){
let data8 = data5.createdAt;
if(typeof data8 === "string"){
if(!(formats0.validate(data8))){
const err34 = {instancePath:instancePath+"/project/createdAt",schemaPath:"#/properties/project/properties/createdAt/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
if(vErrors === null){
vErrors = [err34];
}
else {
vErrors.push(err34);
}
errors++;
}
}
else {
const err35 = {instancePath:instancePath+"/project/createdAt",schemaPath:"#/properties/project/properties/createdAt/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err35];
}
else {
vErrors.push(err35);
}
errors++;
}
}
if(data5.updatedAt !== undefined){
let data9 = data5.updatedAt;
if(typeof data9 === "string"){
if(!(formats0.validate(data9))){
const err36 = {instancePath:instancePath+"/project/updatedAt",schemaPath:"#/properties/project/properties/updatedAt/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
if(vErrors === null){
vErrors = [err36];
}
else {
vErrors.push(err36);
}
errors++;
}
}
else {
const err37 = {instancePath:instancePath+"/project/updatedAt",schemaPath:"#/properties/project/properties/updatedAt/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err37];
}
else {
vErrors.push(err37);
}
errors++;
}
}
}
else {
const err38 = {instancePath:instancePath+"/project",schemaPath:"#/properties/project/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err38];
}
else {
vErrors.push(err38);
}
errors++;
}
}
if(data.page !== undefined){
let data10 = data.page;
if(data10 && typeof data10 == "object" && !Array.isArray(data10)){
if(data10.widthPx === undefined){
const err39 = {instancePath:instancePath+"/page",schemaPath:"#/properties/page/required",keyword:"required",params:{missingProperty: "widthPx"},message:"must have required property '"+"widthPx"+"'"};
if(vErrors === null){
vErrors = [err39];
}
else {
vErrors.push(err39);
}
errors++;
}
if(data10.heightPx === undefined){
const err40 = {instancePath:instancePath+"/page",schemaPath:"#/properties/page/required",keyword:"required",params:{missingProperty: "heightPx"},message:"must have required property '"+"heightPx"+"'"};
if(vErrors === null){
vErrors = [err40];
}
else {
vErrors.push(err40);
}
errors++;
}
if(data10.background === undefined){
const err41 = {instancePath:instancePath+"/page",schemaPath:"#/properties/page/required",keyword:"required",params:{missingProperty: "background"},message:"must have required property '"+"background"+"'"};
if(vErrors === null){
vErrors = [err41];
}
else {
vErrors.push(err41);
}
errors++;
}
if(data10.paddingPx === undefined){
const err42 = {instancePath:instancePath+"/page",schemaPath:"#/properties/page/required",keyword:"required",params:{missingProperty: "paddingPx"},message:"must have required property '"+"paddingPx"+"'"};
if(vErrors === null){
vErrors = [err42];
}
else {
vErrors.push(err42);
}
errors++;
}
for(const key3 in data10){
if(!((((key3 === "widthPx") || (key3 === "heightPx")) || (key3 === "background")) || (key3 === "paddingPx"))){
const err43 = {instancePath:instancePath+"/page",schemaPath:"#/properties/page/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key3},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err43];
}
else {
vErrors.push(err43);
}
errors++;
}
}
if(data10.widthPx !== undefined){
let data11 = data10.widthPx;
if(!(((typeof data11 == "number") && (!(data11 % 1) && !isNaN(data11))) && (isFinite(data11)))){
const err44 = {instancePath:instancePath+"/page/widthPx",schemaPath:"#/properties/page/properties/widthPx/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err44];
}
else {
vErrors.push(err44);
}
errors++;
}
if((typeof data11 == "number") && (isFinite(data11))){
if(data11 > 30000 || isNaN(data11)){
const err45 = {instancePath:instancePath+"/page/widthPx",schemaPath:"#/properties/page/properties/widthPx/maximum",keyword:"maximum",params:{comparison: "<=", limit: 30000},message:"must be <= 30000"};
if(vErrors === null){
vErrors = [err45];
}
else {
vErrors.push(err45);
}
errors++;
}
if(data11 < 100 || isNaN(data11)){
const err46 = {instancePath:instancePath+"/page/widthPx",schemaPath:"#/properties/page/properties/widthPx/minimum",keyword:"minimum",params:{comparison: ">=", limit: 100},message:"must be >= 100"};
if(vErrors === null){
vErrors = [err46];
}
else {
vErrors.push(err46);
}
errors++;
}
}
}
if(data10.heightPx !== undefined){
let data12 = data10.heightPx;
if(!(((typeof data12 == "number") && (!(data12 % 1) && !isNaN(data12))) && (isFinite(data12)))){
const err47 = {instancePath:instancePath+"/page/heightPx",schemaPath:"#/properties/page/properties/heightPx/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err47];
}
else {
vErrors.push(err47);
}
errors++;
}
if((typeof data12 == "number") && (isFinite(data12))){
if(data12 > 30000 || isNaN(data12)){
const err48 = {instancePath:instancePath+"/page/heightPx",schemaPath:"#/properties/page/properties/heightPx/maximum",keyword:"maximum",params:{comparison: "<=", limit: 30000},message:"must be <= 30000"};
if(vErrors === null){
vErrors = [err48];
}
else {
vErrors.push(err48);
}
errors++;
}
if(data12 < 100 || isNaN(data12)){
const err49 = {instancePath:instancePath+"/page/heightPx",schemaPath:"#/properties/page/properties/heightPx/minimum",keyword:"minimum",params:{comparison: ">=", limit: 100},message:"must be >= 100"};
if(vErrors === null){
vErrors = [err49];
}
else {
vErrors.push(err49);
}
errors++;
}
}
}
if(data10.background !== undefined){
let data13 = data10.background;
if(typeof data13 === "string"){
if(!pattern7.test(data13)){
const err50 = {instancePath:instancePath+"/page/background",schemaPath:"#/properties/page/properties/background/pattern",keyword:"pattern",params:{pattern: "^#[0-9A-Fa-f]{6}$"},message:"must match pattern \""+"^#[0-9A-Fa-f]{6}$"+"\""};
if(vErrors === null){
vErrors = [err50];
}
else {
vErrors.push(err50);
}
errors++;
}
}
else {
const err51 = {instancePath:instancePath+"/page/background",schemaPath:"#/properties/page/properties/background/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err51];
}
else {
vErrors.push(err51);
}
errors++;
}
}
if(data10.paddingPx !== undefined){
let data14 = data10.paddingPx;
if((typeof data14 == "number") && (isFinite(data14))){
if(data14 > 2000 || isNaN(data14)){
const err52 = {instancePath:instancePath+"/page/paddingPx",schemaPath:"#/properties/page/properties/paddingPx/maximum",keyword:"maximum",params:{comparison: "<=", limit: 2000},message:"must be <= 2000"};
if(vErrors === null){
vErrors = [err52];
}
else {
vErrors.push(err52);
}
errors++;
}
if(data14 < 0 || isNaN(data14)){
const err53 = {instancePath:instancePath+"/page/paddingPx",schemaPath:"#/properties/page/properties/paddingPx/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err53];
}
else {
vErrors.push(err53);
}
errors++;
}
}
else {
const err54 = {instancePath:instancePath+"/page/paddingPx",schemaPath:"#/properties/page/properties/paddingPx/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err54];
}
else {
vErrors.push(err54);
}
errors++;
}
}
}
else {
const err55 = {instancePath:instancePath+"/page",schemaPath:"#/properties/page/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err55];
}
else {
vErrors.push(err55);
}
errors++;
}
}
if(data.axes !== undefined){
let data15 = data.axes;
if(data15 && typeof data15 == "object" && !Array.isArray(data15)){
if(data15.x === undefined){
const err56 = {instancePath:instancePath+"/axes",schemaPath:"#/properties/axes/required",keyword:"required",params:{missingProperty: "x"},message:"must have required property '"+"x"+"'"};
if(vErrors === null){
vErrors = [err56];
}
else {
vErrors.push(err56);
}
errors++;
}
if(data15.y === undefined){
const err57 = {instancePath:instancePath+"/axes",schemaPath:"#/properties/axes/required",keyword:"required",params:{missingProperty: "y"},message:"must have required property '"+"y"+"'"};
if(vErrors === null){
vErrors = [err57];
}
else {
vErrors.push(err57);
}
errors++;
}
for(const key4 in data15){
if(!((key4 === "x") || (key4 === "y"))){
const err58 = {instancePath:instancePath+"/axes",schemaPath:"#/properties/axes/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key4},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err58];
}
else {
vErrors.push(err58);
}
errors++;
}
}
if(data15.x !== undefined){
let data16 = data15.x;
if(data16 && typeof data16 == "object" && !Array.isArray(data16)){
if(data16.label === undefined){
const err59 = {instancePath:instancePath+"/axes/x",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "label"},message:"must have required property '"+"label"+"'"};
if(vErrors === null){
vErrors = [err59];
}
else {
vErrors.push(err59);
}
errors++;
}
if(data16.unit === undefined){
const err60 = {instancePath:instancePath+"/axes/x",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "unit"},message:"must have required property '"+"unit"+"'"};
if(vErrors === null){
vErrors = [err60];
}
else {
vErrors.push(err60);
}
errors++;
}
if(data16.scale === undefined){
const err61 = {instancePath:instancePath+"/axes/x",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "scale"},message:"must have required property '"+"scale"+"'"};
if(vErrors === null){
vErrors = [err61];
}
else {
vErrors.push(err61);
}
errors++;
}
if(data16.mode === undefined){
const err62 = {instancePath:instancePath+"/axes/x",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "mode"},message:"must have required property '"+"mode"+"'"};
if(vErrors === null){
vErrors = [err62];
}
else {
vErrors.push(err62);
}
errors++;
}
if(data16.min === undefined){
const err63 = {instancePath:instancePath+"/axes/x",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "min"},message:"must have required property '"+"min"+"'"};
if(vErrors === null){
vErrors = [err63];
}
else {
vErrors.push(err63);
}
errors++;
}
if(data16.max === undefined){
const err64 = {instancePath:instancePath+"/axes/x",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "max"},message:"must have required property '"+"max"+"'"};
if(vErrors === null){
vErrors = [err64];
}
else {
vErrors.push(err64);
}
errors++;
}
if(data16.tickMode === undefined){
const err65 = {instancePath:instancePath+"/axes/x",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "tickMode"},message:"must have required property '"+"tickMode"+"'"};
if(vErrors === null){
vErrors = [err65];
}
else {
vErrors.push(err65);
}
errors++;
}
if(data16.tickStep === undefined){
const err66 = {instancePath:instancePath+"/axes/x",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "tickStep"},message:"must have required property '"+"tickStep"+"'"};
if(vErrors === null){
vErrors = [err66];
}
else {
vErrors.push(err66);
}
errors++;
}
if(data16.tickOrigin === undefined){
const err67 = {instancePath:instancePath+"/axes/x",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "tickOrigin"},message:"must have required property '"+"tickOrigin"+"'"};
if(vErrors === null){
vErrors = [err67];
}
else {
vErrors.push(err67);
}
errors++;
}
if(data16.minorDivisions === undefined){
const err68 = {instancePath:instancePath+"/axes/x",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "minorDivisions"},message:"must have required property '"+"minorDivisions"+"'"};
if(vErrors === null){
vErrors = [err68];
}
else {
vErrors.push(err68);
}
errors++;
}
if(data16.grid === undefined){
const err69 = {instancePath:instancePath+"/axes/x",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "grid"},message:"must have required property '"+"grid"+"'"};
if(vErrors === null){
vErrors = [err69];
}
else {
vErrors.push(err69);
}
errors++;
}
if(data16.numberFormat === undefined){
const err70 = {instancePath:instancePath+"/axes/x",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "numberFormat"},message:"must have required property '"+"numberFormat"+"'"};
if(vErrors === null){
vErrors = [err70];
}
else {
vErrors.push(err70);
}
errors++;
}
if(data16.precision === undefined){
const err71 = {instancePath:instancePath+"/axes/x",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "precision"},message:"must have required property '"+"precision"+"'"};
if(vErrors === null){
vErrors = [err71];
}
else {
vErrors.push(err71);
}
errors++;
}
if(data16.strokeWidthPt === undefined){
const err72 = {instancePath:instancePath+"/axes/x",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "strokeWidthPt"},message:"must have required property '"+"strokeWidthPt"+"'"};
if(vErrors === null){
vErrors = [err72];
}
else {
vErrors.push(err72);
}
errors++;
}
if(data16.labelSizePt === undefined){
const err73 = {instancePath:instancePath+"/axes/x",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "labelSizePt"},message:"must have required property '"+"labelSizePt"+"'"};
if(vErrors === null){
vErrors = [err73];
}
else {
vErrors.push(err73);
}
errors++;
}
for(const key5 in data16){
if(!(func1.call(schema33.properties, key5))){
const err74 = {instancePath:instancePath+"/axes/x",schemaPath:"#/$defs/axis/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key5},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err74];
}
else {
vErrors.push(err74);
}
errors++;
}
}
if(data16.label !== undefined){
let data17 = data16.label;
if(typeof data17 === "string"){
if(func2(data17) > 500){
const err75 = {instancePath:instancePath+"/axes/x/label",schemaPath:"#/$defs/axis/properties/label/maxLength",keyword:"maxLength",params:{limit: 500},message:"must NOT have more than 500 characters"};
if(vErrors === null){
vErrors = [err75];
}
else {
vErrors.push(err75);
}
errors++;
}
}
else {
const err76 = {instancePath:instancePath+"/axes/x/label",schemaPath:"#/$defs/axis/properties/label/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err76];
}
else {
vErrors.push(err76);
}
errors++;
}
}
if(data16.unit !== undefined){
let data18 = data16.unit;
if(typeof data18 === "string"){
if(func2(data18) > 100){
const err77 = {instancePath:instancePath+"/axes/x/unit",schemaPath:"#/$defs/axis/properties/unit/maxLength",keyword:"maxLength",params:{limit: 100},message:"must NOT have more than 100 characters"};
if(vErrors === null){
vErrors = [err77];
}
else {
vErrors.push(err77);
}
errors++;
}
}
else {
const err78 = {instancePath:instancePath+"/axes/x/unit",schemaPath:"#/$defs/axis/properties/unit/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err78];
}
else {
vErrors.push(err78);
}
errors++;
}
}
if(data16.scale !== undefined){
if("linear" !== data16.scale){
const err79 = {instancePath:instancePath+"/axes/x/scale",schemaPath:"#/$defs/axis/properties/scale/const",keyword:"const",params:{allowedValue: "linear"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err79];
}
else {
vErrors.push(err79);
}
errors++;
}
}
if(data16.mode !== undefined){
let data20 = data16.mode;
if(!((data20 === "auto") || (data20 === "manual"))){
const err80 = {instancePath:instancePath+"/axes/x/mode",schemaPath:"#/$defs/axis/properties/mode/enum",keyword:"enum",params:{allowedValues: schema33.properties.mode.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err80];
}
else {
vErrors.push(err80);
}
errors++;
}
}
if(data16.min !== undefined){
let data21 = data16.min;
if(!((typeof data21 == "number") && (isFinite(data21)))){
const err81 = {instancePath:instancePath+"/axes/x/min",schemaPath:"#/$defs/axis/properties/min/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err81];
}
else {
vErrors.push(err81);
}
errors++;
}
}
if(data16.max !== undefined){
let data22 = data16.max;
if(!((typeof data22 == "number") && (isFinite(data22)))){
const err82 = {instancePath:instancePath+"/axes/x/max",schemaPath:"#/$defs/axis/properties/max/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err82];
}
else {
vErrors.push(err82);
}
errors++;
}
}
if(data16.tickMode !== undefined){
let data23 = data16.tickMode;
if(!((data23 === "auto") || (data23 === "manual"))){
const err83 = {instancePath:instancePath+"/axes/x/tickMode",schemaPath:"#/$defs/axis/properties/tickMode/enum",keyword:"enum",params:{allowedValues: schema33.properties.tickMode.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err83];
}
else {
vErrors.push(err83);
}
errors++;
}
}
if(data16.tickStep !== undefined){
let data24 = data16.tickStep;
if((typeof data24 == "number") && (isFinite(data24))){
if(data24 <= 0 || isNaN(data24)){
const err84 = {instancePath:instancePath+"/axes/x/tickStep",schemaPath:"#/$defs/axis/properties/tickStep/exclusiveMinimum",keyword:"exclusiveMinimum",params:{comparison: ">", limit: 0},message:"must be > 0"};
if(vErrors === null){
vErrors = [err84];
}
else {
vErrors.push(err84);
}
errors++;
}
}
else {
const err85 = {instancePath:instancePath+"/axes/x/tickStep",schemaPath:"#/$defs/axis/properties/tickStep/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err85];
}
else {
vErrors.push(err85);
}
errors++;
}
}
if(data16.tickOrigin !== undefined){
let data25 = data16.tickOrigin;
if(!((typeof data25 == "number") && (isFinite(data25)))){
const err86 = {instancePath:instancePath+"/axes/x/tickOrigin",schemaPath:"#/$defs/axis/properties/tickOrigin/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err86];
}
else {
vErrors.push(err86);
}
errors++;
}
}
if(data16.minorDivisions !== undefined){
let data26 = data16.minorDivisions;
if(!(((typeof data26 == "number") && (!(data26 % 1) && !isNaN(data26))) && (isFinite(data26)))){
const err87 = {instancePath:instancePath+"/axes/x/minorDivisions",schemaPath:"#/$defs/axis/properties/minorDivisions/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err87];
}
else {
vErrors.push(err87);
}
errors++;
}
if((typeof data26 == "number") && (isFinite(data26))){
if(data26 > 20 || isNaN(data26)){
const err88 = {instancePath:instancePath+"/axes/x/minorDivisions",schemaPath:"#/$defs/axis/properties/minorDivisions/maximum",keyword:"maximum",params:{comparison: "<=", limit: 20},message:"must be <= 20"};
if(vErrors === null){
vErrors = [err88];
}
else {
vErrors.push(err88);
}
errors++;
}
if(data26 < 0 || isNaN(data26)){
const err89 = {instancePath:instancePath+"/axes/x/minorDivisions",schemaPath:"#/$defs/axis/properties/minorDivisions/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err89];
}
else {
vErrors.push(err89);
}
errors++;
}
}
}
if(data16.grid !== undefined){
if(typeof data16.grid !== "boolean"){
const err90 = {instancePath:instancePath+"/axes/x/grid",schemaPath:"#/$defs/axis/properties/grid/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err90];
}
else {
vErrors.push(err90);
}
errors++;
}
}
if(data16.numberFormat !== undefined){
let data28 = data16.numberFormat;
if(!(((data28 === "auto") || (data28 === "fixed")) || (data28 === "scientific"))){
const err91 = {instancePath:instancePath+"/axes/x/numberFormat",schemaPath:"#/$defs/axis/properties/numberFormat/enum",keyword:"enum",params:{allowedValues: schema33.properties.numberFormat.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err91];
}
else {
vErrors.push(err91);
}
errors++;
}
}
if(data16.precision !== undefined){
let data29 = data16.precision;
if(!(((typeof data29 == "number") && (!(data29 % 1) && !isNaN(data29))) && (isFinite(data29)))){
const err92 = {instancePath:instancePath+"/axes/x/precision",schemaPath:"#/$defs/axis/properties/precision/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err92];
}
else {
vErrors.push(err92);
}
errors++;
}
if((typeof data29 == "number") && (isFinite(data29))){
if(data29 > 15 || isNaN(data29)){
const err93 = {instancePath:instancePath+"/axes/x/precision",schemaPath:"#/$defs/axis/properties/precision/maximum",keyword:"maximum",params:{comparison: "<=", limit: 15},message:"must be <= 15"};
if(vErrors === null){
vErrors = [err93];
}
else {
vErrors.push(err93);
}
errors++;
}
if(data29 < 0 || isNaN(data29)){
const err94 = {instancePath:instancePath+"/axes/x/precision",schemaPath:"#/$defs/axis/properties/precision/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err94];
}
else {
vErrors.push(err94);
}
errors++;
}
}
}
if(data16.strokeWidthPt !== undefined){
let data30 = data16.strokeWidthPt;
if((typeof data30 == "number") && (isFinite(data30))){
if(data30 > 24 || isNaN(data30)){
const err95 = {instancePath:instancePath+"/axes/x/strokeWidthPt",schemaPath:"#/$defs/axis/properties/strokeWidthPt/maximum",keyword:"maximum",params:{comparison: "<=", limit: 24},message:"must be <= 24"};
if(vErrors === null){
vErrors = [err95];
}
else {
vErrors.push(err95);
}
errors++;
}
if(data30 <= 0 || isNaN(data30)){
const err96 = {instancePath:instancePath+"/axes/x/strokeWidthPt",schemaPath:"#/$defs/axis/properties/strokeWidthPt/exclusiveMinimum",keyword:"exclusiveMinimum",params:{comparison: ">", limit: 0},message:"must be > 0"};
if(vErrors === null){
vErrors = [err96];
}
else {
vErrors.push(err96);
}
errors++;
}
}
else {
const err97 = {instancePath:instancePath+"/axes/x/strokeWidthPt",schemaPath:"#/$defs/axis/properties/strokeWidthPt/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err97];
}
else {
vErrors.push(err97);
}
errors++;
}
}
if(data16.labelSizePt !== undefined){
let data31 = data16.labelSizePt;
if((typeof data31 == "number") && (isFinite(data31))){
if(data31 > 72 || isNaN(data31)){
const err98 = {instancePath:instancePath+"/axes/x/labelSizePt",schemaPath:"#/$defs/axis/properties/labelSizePt/maximum",keyword:"maximum",params:{comparison: "<=", limit: 72},message:"must be <= 72"};
if(vErrors === null){
vErrors = [err98];
}
else {
vErrors.push(err98);
}
errors++;
}
if(data31 < 6 || isNaN(data31)){
const err99 = {instancePath:instancePath+"/axes/x/labelSizePt",schemaPath:"#/$defs/axis/properties/labelSizePt/minimum",keyword:"minimum",params:{comparison: ">=", limit: 6},message:"must be >= 6"};
if(vErrors === null){
vErrors = [err99];
}
else {
vErrors.push(err99);
}
errors++;
}
}
else {
const err100 = {instancePath:instancePath+"/axes/x/labelSizePt",schemaPath:"#/$defs/axis/properties/labelSizePt/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err100];
}
else {
vErrors.push(err100);
}
errors++;
}
}
}
else {
const err101 = {instancePath:instancePath+"/axes/x",schemaPath:"#/$defs/axis/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err101];
}
else {
vErrors.push(err101);
}
errors++;
}
}
if(data15.y !== undefined){
let data32 = data15.y;
if(data32 && typeof data32 == "object" && !Array.isArray(data32)){
if(data32.label === undefined){
const err102 = {instancePath:instancePath+"/axes/y",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "label"},message:"must have required property '"+"label"+"'"};
if(vErrors === null){
vErrors = [err102];
}
else {
vErrors.push(err102);
}
errors++;
}
if(data32.unit === undefined){
const err103 = {instancePath:instancePath+"/axes/y",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "unit"},message:"must have required property '"+"unit"+"'"};
if(vErrors === null){
vErrors = [err103];
}
else {
vErrors.push(err103);
}
errors++;
}
if(data32.scale === undefined){
const err104 = {instancePath:instancePath+"/axes/y",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "scale"},message:"must have required property '"+"scale"+"'"};
if(vErrors === null){
vErrors = [err104];
}
else {
vErrors.push(err104);
}
errors++;
}
if(data32.mode === undefined){
const err105 = {instancePath:instancePath+"/axes/y",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "mode"},message:"must have required property '"+"mode"+"'"};
if(vErrors === null){
vErrors = [err105];
}
else {
vErrors.push(err105);
}
errors++;
}
if(data32.min === undefined){
const err106 = {instancePath:instancePath+"/axes/y",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "min"},message:"must have required property '"+"min"+"'"};
if(vErrors === null){
vErrors = [err106];
}
else {
vErrors.push(err106);
}
errors++;
}
if(data32.max === undefined){
const err107 = {instancePath:instancePath+"/axes/y",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "max"},message:"must have required property '"+"max"+"'"};
if(vErrors === null){
vErrors = [err107];
}
else {
vErrors.push(err107);
}
errors++;
}
if(data32.tickMode === undefined){
const err108 = {instancePath:instancePath+"/axes/y",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "tickMode"},message:"must have required property '"+"tickMode"+"'"};
if(vErrors === null){
vErrors = [err108];
}
else {
vErrors.push(err108);
}
errors++;
}
if(data32.tickStep === undefined){
const err109 = {instancePath:instancePath+"/axes/y",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "tickStep"},message:"must have required property '"+"tickStep"+"'"};
if(vErrors === null){
vErrors = [err109];
}
else {
vErrors.push(err109);
}
errors++;
}
if(data32.tickOrigin === undefined){
const err110 = {instancePath:instancePath+"/axes/y",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "tickOrigin"},message:"must have required property '"+"tickOrigin"+"'"};
if(vErrors === null){
vErrors = [err110];
}
else {
vErrors.push(err110);
}
errors++;
}
if(data32.minorDivisions === undefined){
const err111 = {instancePath:instancePath+"/axes/y",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "minorDivisions"},message:"must have required property '"+"minorDivisions"+"'"};
if(vErrors === null){
vErrors = [err111];
}
else {
vErrors.push(err111);
}
errors++;
}
if(data32.grid === undefined){
const err112 = {instancePath:instancePath+"/axes/y",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "grid"},message:"must have required property '"+"grid"+"'"};
if(vErrors === null){
vErrors = [err112];
}
else {
vErrors.push(err112);
}
errors++;
}
if(data32.numberFormat === undefined){
const err113 = {instancePath:instancePath+"/axes/y",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "numberFormat"},message:"must have required property '"+"numberFormat"+"'"};
if(vErrors === null){
vErrors = [err113];
}
else {
vErrors.push(err113);
}
errors++;
}
if(data32.precision === undefined){
const err114 = {instancePath:instancePath+"/axes/y",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "precision"},message:"must have required property '"+"precision"+"'"};
if(vErrors === null){
vErrors = [err114];
}
else {
vErrors.push(err114);
}
errors++;
}
if(data32.strokeWidthPt === undefined){
const err115 = {instancePath:instancePath+"/axes/y",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "strokeWidthPt"},message:"must have required property '"+"strokeWidthPt"+"'"};
if(vErrors === null){
vErrors = [err115];
}
else {
vErrors.push(err115);
}
errors++;
}
if(data32.labelSizePt === undefined){
const err116 = {instancePath:instancePath+"/axes/y",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "labelSizePt"},message:"must have required property '"+"labelSizePt"+"'"};
if(vErrors === null){
vErrors = [err116];
}
else {
vErrors.push(err116);
}
errors++;
}
for(const key6 in data32){
if(!(func1.call(schema33.properties, key6))){
const err117 = {instancePath:instancePath+"/axes/y",schemaPath:"#/$defs/axis/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key6},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err117];
}
else {
vErrors.push(err117);
}
errors++;
}
}
if(data32.label !== undefined){
let data33 = data32.label;
if(typeof data33 === "string"){
if(func2(data33) > 500){
const err118 = {instancePath:instancePath+"/axes/y/label",schemaPath:"#/$defs/axis/properties/label/maxLength",keyword:"maxLength",params:{limit: 500},message:"must NOT have more than 500 characters"};
if(vErrors === null){
vErrors = [err118];
}
else {
vErrors.push(err118);
}
errors++;
}
}
else {
const err119 = {instancePath:instancePath+"/axes/y/label",schemaPath:"#/$defs/axis/properties/label/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err119];
}
else {
vErrors.push(err119);
}
errors++;
}
}
if(data32.unit !== undefined){
let data34 = data32.unit;
if(typeof data34 === "string"){
if(func2(data34) > 100){
const err120 = {instancePath:instancePath+"/axes/y/unit",schemaPath:"#/$defs/axis/properties/unit/maxLength",keyword:"maxLength",params:{limit: 100},message:"must NOT have more than 100 characters"};
if(vErrors === null){
vErrors = [err120];
}
else {
vErrors.push(err120);
}
errors++;
}
}
else {
const err121 = {instancePath:instancePath+"/axes/y/unit",schemaPath:"#/$defs/axis/properties/unit/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err121];
}
else {
vErrors.push(err121);
}
errors++;
}
}
if(data32.scale !== undefined){
if("linear" !== data32.scale){
const err122 = {instancePath:instancePath+"/axes/y/scale",schemaPath:"#/$defs/axis/properties/scale/const",keyword:"const",params:{allowedValue: "linear"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err122];
}
else {
vErrors.push(err122);
}
errors++;
}
}
if(data32.mode !== undefined){
let data36 = data32.mode;
if(!((data36 === "auto") || (data36 === "manual"))){
const err123 = {instancePath:instancePath+"/axes/y/mode",schemaPath:"#/$defs/axis/properties/mode/enum",keyword:"enum",params:{allowedValues: schema33.properties.mode.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err123];
}
else {
vErrors.push(err123);
}
errors++;
}
}
if(data32.min !== undefined){
let data37 = data32.min;
if(!((typeof data37 == "number") && (isFinite(data37)))){
const err124 = {instancePath:instancePath+"/axes/y/min",schemaPath:"#/$defs/axis/properties/min/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err124];
}
else {
vErrors.push(err124);
}
errors++;
}
}
if(data32.max !== undefined){
let data38 = data32.max;
if(!((typeof data38 == "number") && (isFinite(data38)))){
const err125 = {instancePath:instancePath+"/axes/y/max",schemaPath:"#/$defs/axis/properties/max/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err125];
}
else {
vErrors.push(err125);
}
errors++;
}
}
if(data32.tickMode !== undefined){
let data39 = data32.tickMode;
if(!((data39 === "auto") || (data39 === "manual"))){
const err126 = {instancePath:instancePath+"/axes/y/tickMode",schemaPath:"#/$defs/axis/properties/tickMode/enum",keyword:"enum",params:{allowedValues: schema33.properties.tickMode.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err126];
}
else {
vErrors.push(err126);
}
errors++;
}
}
if(data32.tickStep !== undefined){
let data40 = data32.tickStep;
if((typeof data40 == "number") && (isFinite(data40))){
if(data40 <= 0 || isNaN(data40)){
const err127 = {instancePath:instancePath+"/axes/y/tickStep",schemaPath:"#/$defs/axis/properties/tickStep/exclusiveMinimum",keyword:"exclusiveMinimum",params:{comparison: ">", limit: 0},message:"must be > 0"};
if(vErrors === null){
vErrors = [err127];
}
else {
vErrors.push(err127);
}
errors++;
}
}
else {
const err128 = {instancePath:instancePath+"/axes/y/tickStep",schemaPath:"#/$defs/axis/properties/tickStep/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err128];
}
else {
vErrors.push(err128);
}
errors++;
}
}
if(data32.tickOrigin !== undefined){
let data41 = data32.tickOrigin;
if(!((typeof data41 == "number") && (isFinite(data41)))){
const err129 = {instancePath:instancePath+"/axes/y/tickOrigin",schemaPath:"#/$defs/axis/properties/tickOrigin/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err129];
}
else {
vErrors.push(err129);
}
errors++;
}
}
if(data32.minorDivisions !== undefined){
let data42 = data32.minorDivisions;
if(!(((typeof data42 == "number") && (!(data42 % 1) && !isNaN(data42))) && (isFinite(data42)))){
const err130 = {instancePath:instancePath+"/axes/y/minorDivisions",schemaPath:"#/$defs/axis/properties/minorDivisions/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err130];
}
else {
vErrors.push(err130);
}
errors++;
}
if((typeof data42 == "number") && (isFinite(data42))){
if(data42 > 20 || isNaN(data42)){
const err131 = {instancePath:instancePath+"/axes/y/minorDivisions",schemaPath:"#/$defs/axis/properties/minorDivisions/maximum",keyword:"maximum",params:{comparison: "<=", limit: 20},message:"must be <= 20"};
if(vErrors === null){
vErrors = [err131];
}
else {
vErrors.push(err131);
}
errors++;
}
if(data42 < 0 || isNaN(data42)){
const err132 = {instancePath:instancePath+"/axes/y/minorDivisions",schemaPath:"#/$defs/axis/properties/minorDivisions/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err132];
}
else {
vErrors.push(err132);
}
errors++;
}
}
}
if(data32.grid !== undefined){
if(typeof data32.grid !== "boolean"){
const err133 = {instancePath:instancePath+"/axes/y/grid",schemaPath:"#/$defs/axis/properties/grid/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err133];
}
else {
vErrors.push(err133);
}
errors++;
}
}
if(data32.numberFormat !== undefined){
let data44 = data32.numberFormat;
if(!(((data44 === "auto") || (data44 === "fixed")) || (data44 === "scientific"))){
const err134 = {instancePath:instancePath+"/axes/y/numberFormat",schemaPath:"#/$defs/axis/properties/numberFormat/enum",keyword:"enum",params:{allowedValues: schema33.properties.numberFormat.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err134];
}
else {
vErrors.push(err134);
}
errors++;
}
}
if(data32.precision !== undefined){
let data45 = data32.precision;
if(!(((typeof data45 == "number") && (!(data45 % 1) && !isNaN(data45))) && (isFinite(data45)))){
const err135 = {instancePath:instancePath+"/axes/y/precision",schemaPath:"#/$defs/axis/properties/precision/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err135];
}
else {
vErrors.push(err135);
}
errors++;
}
if((typeof data45 == "number") && (isFinite(data45))){
if(data45 > 15 || isNaN(data45)){
const err136 = {instancePath:instancePath+"/axes/y/precision",schemaPath:"#/$defs/axis/properties/precision/maximum",keyword:"maximum",params:{comparison: "<=", limit: 15},message:"must be <= 15"};
if(vErrors === null){
vErrors = [err136];
}
else {
vErrors.push(err136);
}
errors++;
}
if(data45 < 0 || isNaN(data45)){
const err137 = {instancePath:instancePath+"/axes/y/precision",schemaPath:"#/$defs/axis/properties/precision/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err137];
}
else {
vErrors.push(err137);
}
errors++;
}
}
}
if(data32.strokeWidthPt !== undefined){
let data46 = data32.strokeWidthPt;
if((typeof data46 == "number") && (isFinite(data46))){
if(data46 > 24 || isNaN(data46)){
const err138 = {instancePath:instancePath+"/axes/y/strokeWidthPt",schemaPath:"#/$defs/axis/properties/strokeWidthPt/maximum",keyword:"maximum",params:{comparison: "<=", limit: 24},message:"must be <= 24"};
if(vErrors === null){
vErrors = [err138];
}
else {
vErrors.push(err138);
}
errors++;
}
if(data46 <= 0 || isNaN(data46)){
const err139 = {instancePath:instancePath+"/axes/y/strokeWidthPt",schemaPath:"#/$defs/axis/properties/strokeWidthPt/exclusiveMinimum",keyword:"exclusiveMinimum",params:{comparison: ">", limit: 0},message:"must be > 0"};
if(vErrors === null){
vErrors = [err139];
}
else {
vErrors.push(err139);
}
errors++;
}
}
else {
const err140 = {instancePath:instancePath+"/axes/y/strokeWidthPt",schemaPath:"#/$defs/axis/properties/strokeWidthPt/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err140];
}
else {
vErrors.push(err140);
}
errors++;
}
}
if(data32.labelSizePt !== undefined){
let data47 = data32.labelSizePt;
if((typeof data47 == "number") && (isFinite(data47))){
if(data47 > 72 || isNaN(data47)){
const err141 = {instancePath:instancePath+"/axes/y/labelSizePt",schemaPath:"#/$defs/axis/properties/labelSizePt/maximum",keyword:"maximum",params:{comparison: "<=", limit: 72},message:"must be <= 72"};
if(vErrors === null){
vErrors = [err141];
}
else {
vErrors.push(err141);
}
errors++;
}
if(data47 < 6 || isNaN(data47)){
const err142 = {instancePath:instancePath+"/axes/y/labelSizePt",schemaPath:"#/$defs/axis/properties/labelSizePt/minimum",keyword:"minimum",params:{comparison: ">=", limit: 6},message:"must be >= 6"};
if(vErrors === null){
vErrors = [err142];
}
else {
vErrors.push(err142);
}
errors++;
}
}
else {
const err143 = {instancePath:instancePath+"/axes/y/labelSizePt",schemaPath:"#/$defs/axis/properties/labelSizePt/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err143];
}
else {
vErrors.push(err143);
}
errors++;
}
}
}
else {
const err144 = {instancePath:instancePath+"/axes/y",schemaPath:"#/$defs/axis/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err144];
}
else {
vErrors.push(err144);
}
errors++;
}
}
}
else {
const err145 = {instancePath:instancePath+"/axes",schemaPath:"#/properties/axes/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err145];
}
else {
vErrors.push(err145);
}
errors++;
}
}
if(data.datasets !== undefined){
let data48 = data.datasets;
if(Array.isArray(data48)){
if(data48.length > 1000){
const err146 = {instancePath:instancePath+"/datasets",schemaPath:"#/properties/datasets/maxItems",keyword:"maxItems",params:{limit: 1000},message:"must NOT have more than 1000 items"};
if(vErrors === null){
vErrors = [err146];
}
else {
vErrors.push(err146);
}
errors++;
}
const len0 = data48.length;
for(let i0=0; i0<len0; i0++){
if(!(validate22(data48[i0], {instancePath:instancePath+"/datasets/" + i0,parentData:data48,parentDataProperty:i0,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate22.errors : vErrors.concat(validate22.errors);
errors = vErrors.length;
}
}
}
else {
const err147 = {instancePath:instancePath+"/datasets",schemaPath:"#/properties/datasets/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err147];
}
else {
vErrors.push(err147);
}
errors++;
}
}
if(data.series !== undefined){
let data50 = data.series;
if(Array.isArray(data50)){
if(data50.length > 1000){
const err148 = {instancePath:instancePath+"/series",schemaPath:"#/properties/series/maxItems",keyword:"maxItems",params:{limit: 1000},message:"must NOT have more than 1000 items"};
if(vErrors === null){
vErrors = [err148];
}
else {
vErrors.push(err148);
}
errors++;
}
const len1 = data50.length;
for(let i1=0; i1<len1; i1++){
let data51 = data50[i1];
if(data51 && typeof data51 == "object" && !Array.isArray(data51)){
if(data51.id === undefined){
const err149 = {instancePath:instancePath+"/series/" + i1,schemaPath:"#/$defs/series/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err149];
}
else {
vErrors.push(err149);
}
errors++;
}
if(data51.datasetId === undefined){
const err150 = {instancePath:instancePath+"/series/" + i1,schemaPath:"#/$defs/series/required",keyword:"required",params:{missingProperty: "datasetId"},message:"must have required property '"+"datasetId"+"'"};
if(vErrors === null){
vErrors = [err150];
}
else {
vErrors.push(err150);
}
errors++;
}
if(data51.name === undefined){
const err151 = {instancePath:instancePath+"/series/" + i1,schemaPath:"#/$defs/series/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};
if(vErrors === null){
vErrors = [err151];
}
else {
vErrors.push(err151);
}
errors++;
}
if(data51.visible === undefined){
const err152 = {instancePath:instancePath+"/series/" + i1,schemaPath:"#/$defs/series/required",keyword:"required",params:{missingProperty: "visible"},message:"must have required property '"+"visible"+"'"};
if(vErrors === null){
vErrors = [err152];
}
else {
vErrors.push(err152);
}
errors++;
}
if(data51.includeInAutoRange === undefined){
const err153 = {instancePath:instancePath+"/series/" + i1,schemaPath:"#/$defs/series/required",keyword:"required",params:{missingProperty: "includeInAutoRange"},message:"must have required property '"+"includeInAutoRange"+"'"};
if(vErrors === null){
vErrors = [err153];
}
else {
vErrors.push(err153);
}
errors++;
}
if(data51.order === undefined){
const err154 = {instancePath:instancePath+"/series/" + i1,schemaPath:"#/$defs/series/required",keyword:"required",params:{missingProperty: "order"},message:"must have required property '"+"order"+"'"};
if(vErrors === null){
vErrors = [err154];
}
else {
vErrors.push(err154);
}
errors++;
}
if(data51.mode === undefined){
const err155 = {instancePath:instancePath+"/series/" + i1,schemaPath:"#/$defs/series/required",keyword:"required",params:{missingProperty: "mode"},message:"must have required property '"+"mode"+"'"};
if(vErrors === null){
vErrors = [err155];
}
else {
vErrors.push(err155);
}
errors++;
}
if(data51.style === undefined){
const err156 = {instancePath:instancePath+"/series/" + i1,schemaPath:"#/$defs/series/required",keyword:"required",params:{missingProperty: "style"},message:"must have required property '"+"style"+"'"};
if(vErrors === null){
vErrors = [err156];
}
else {
vErrors.push(err156);
}
errors++;
}
for(const key7 in data51){
if(!((((((((key7 === "id") || (key7 === "datasetId")) || (key7 === "name")) || (key7 === "visible")) || (key7 === "includeInAutoRange")) || (key7 === "order")) || (key7 === "mode")) || (key7 === "style"))){
const err157 = {instancePath:instancePath+"/series/" + i1,schemaPath:"#/$defs/series/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key7},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err157];
}
else {
vErrors.push(err157);
}
errors++;
}
}
if(data51.id !== undefined){
let data52 = data51.id;
if(typeof data52 === "string"){
if(!pattern6.test(data52)){
const err158 = {instancePath:instancePath+"/series/" + i1+"/id",schemaPath:"#/$defs/series/properties/id/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"+"\""};
if(vErrors === null){
vErrors = [err158];
}
else {
vErrors.push(err158);
}
errors++;
}
}
else {
const err159 = {instancePath:instancePath+"/series/" + i1+"/id",schemaPath:"#/$defs/series/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err159];
}
else {
vErrors.push(err159);
}
errors++;
}
}
if(data51.datasetId !== undefined){
let data53 = data51.datasetId;
if(typeof data53 === "string"){
if(!pattern6.test(data53)){
const err160 = {instancePath:instancePath+"/series/" + i1+"/datasetId",schemaPath:"#/$defs/series/properties/datasetId/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"+"\""};
if(vErrors === null){
vErrors = [err160];
}
else {
vErrors.push(err160);
}
errors++;
}
}
else {
const err161 = {instancePath:instancePath+"/series/" + i1+"/datasetId",schemaPath:"#/$defs/series/properties/datasetId/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err161];
}
else {
vErrors.push(err161);
}
errors++;
}
}
if(data51.name !== undefined){
let data54 = data51.name;
if(typeof data54 === "string"){
if(func2(data54) > 300){
const err162 = {instancePath:instancePath+"/series/" + i1+"/name",schemaPath:"#/$defs/series/properties/name/maxLength",keyword:"maxLength",params:{limit: 300},message:"must NOT have more than 300 characters"};
if(vErrors === null){
vErrors = [err162];
}
else {
vErrors.push(err162);
}
errors++;
}
}
else {
const err163 = {instancePath:instancePath+"/series/" + i1+"/name",schemaPath:"#/$defs/series/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err163];
}
else {
vErrors.push(err163);
}
errors++;
}
}
if(data51.visible !== undefined){
if(typeof data51.visible !== "boolean"){
const err164 = {instancePath:instancePath+"/series/" + i1+"/visible",schemaPath:"#/$defs/series/properties/visible/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err164];
}
else {
vErrors.push(err164);
}
errors++;
}
}
if(data51.includeInAutoRange !== undefined){
if(typeof data51.includeInAutoRange !== "boolean"){
const err165 = {instancePath:instancePath+"/series/" + i1+"/includeInAutoRange",schemaPath:"#/$defs/series/properties/includeInAutoRange/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err165];
}
else {
vErrors.push(err165);
}
errors++;
}
}
if(data51.order !== undefined){
let data57 = data51.order;
if(!(((typeof data57 == "number") && (!(data57 % 1) && !isNaN(data57))) && (isFinite(data57)))){
const err166 = {instancePath:instancePath+"/series/" + i1+"/order",schemaPath:"#/$defs/series/properties/order/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err166];
}
else {
vErrors.push(err166);
}
errors++;
}
if((typeof data57 == "number") && (isFinite(data57))){
if(data57 < 0 || isNaN(data57)){
const err167 = {instancePath:instancePath+"/series/" + i1+"/order",schemaPath:"#/$defs/series/properties/order/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err167];
}
else {
vErrors.push(err167);
}
errors++;
}
}
}
if(data51.mode !== undefined){
let data58 = data51.mode;
if(!(((data58 === "line") || (data58 === "points")) || (data58 === "line-points"))){
const err168 = {instancePath:instancePath+"/series/" + i1+"/mode",schemaPath:"#/$defs/series/properties/mode/enum",keyword:"enum",params:{allowedValues: schema37.properties.mode.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err168];
}
else {
vErrors.push(err168);
}
errors++;
}
}
if(data51.style !== undefined){
let data59 = data51.style;
if(data59 && typeof data59 == "object" && !Array.isArray(data59)){
if(data59.stroke === undefined){
const err169 = {instancePath:instancePath+"/series/" + i1+"/style",schemaPath:"#/$defs/series/properties/style/required",keyword:"required",params:{missingProperty: "stroke"},message:"must have required property '"+"stroke"+"'"};
if(vErrors === null){
vErrors = [err169];
}
else {
vErrors.push(err169);
}
errors++;
}
if(data59.strokeWidthPt === undefined){
const err170 = {instancePath:instancePath+"/series/" + i1+"/style",schemaPath:"#/$defs/series/properties/style/required",keyword:"required",params:{missingProperty: "strokeWidthPt"},message:"must have required property '"+"strokeWidthPt"+"'"};
if(vErrors === null){
vErrors = [err170];
}
else {
vErrors.push(err170);
}
errors++;
}
if(data59.opacity === undefined){
const err171 = {instancePath:instancePath+"/series/" + i1+"/style",schemaPath:"#/$defs/series/properties/style/required",keyword:"required",params:{missingProperty: "opacity"},message:"must have required property '"+"opacity"+"'"};
if(vErrors === null){
vErrors = [err171];
}
else {
vErrors.push(err171);
}
errors++;
}
if(data59.dash === undefined){
const err172 = {instancePath:instancePath+"/series/" + i1+"/style",schemaPath:"#/$defs/series/properties/style/required",keyword:"required",params:{missingProperty: "dash"},message:"must have required property '"+"dash"+"'"};
if(vErrors === null){
vErrors = [err172];
}
else {
vErrors.push(err172);
}
errors++;
}
if(data59.markerShape === undefined){
const err173 = {instancePath:instancePath+"/series/" + i1+"/style",schemaPath:"#/$defs/series/properties/style/required",keyword:"required",params:{missingProperty: "markerShape"},message:"must have required property '"+"markerShape"+"'"};
if(vErrors === null){
vErrors = [err173];
}
else {
vErrors.push(err173);
}
errors++;
}
if(data59.markerSizePt === undefined){
const err174 = {instancePath:instancePath+"/series/" + i1+"/style",schemaPath:"#/$defs/series/properties/style/required",keyword:"required",params:{missingProperty: "markerSizePt"},message:"must have required property '"+"markerSizePt"+"'"};
if(vErrors === null){
vErrors = [err174];
}
else {
vErrors.push(err174);
}
errors++;
}
if(data59.markerFill === undefined){
const err175 = {instancePath:instancePath+"/series/" + i1+"/style",schemaPath:"#/$defs/series/properties/style/required",keyword:"required",params:{missingProperty: "markerFill"},message:"must have required property '"+"markerFill"+"'"};
if(vErrors === null){
vErrors = [err175];
}
else {
vErrors.push(err175);
}
errors++;
}
if(data59.markerStroke === undefined){
const err176 = {instancePath:instancePath+"/series/" + i1+"/style",schemaPath:"#/$defs/series/properties/style/required",keyword:"required",params:{missingProperty: "markerStroke"},message:"must have required property '"+"markerStroke"+"'"};
if(vErrors === null){
vErrors = [err176];
}
else {
vErrors.push(err176);
}
errors++;
}
if(data59.markerVisible === undefined){
const err177 = {instancePath:instancePath+"/series/" + i1+"/style",schemaPath:"#/$defs/series/properties/style/required",keyword:"required",params:{missingProperty: "markerVisible"},message:"must have required property '"+"markerVisible"+"'"};
if(vErrors === null){
vErrors = [err177];
}
else {
vErrors.push(err177);
}
errors++;
}
for(const key8 in data59){
if(!(func1.call(schema37.properties.style.properties, key8))){
const err178 = {instancePath:instancePath+"/series/" + i1+"/style",schemaPath:"#/$defs/series/properties/style/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key8},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err178];
}
else {
vErrors.push(err178);
}
errors++;
}
}
if(data59.stroke !== undefined){
let data60 = data59.stroke;
if(typeof data60 === "string"){
if(!pattern7.test(data60)){
const err179 = {instancePath:instancePath+"/series/" + i1+"/style/stroke",schemaPath:"#/$defs/series/properties/style/properties/stroke/pattern",keyword:"pattern",params:{pattern: "^#[0-9A-Fa-f]{6}$"},message:"must match pattern \""+"^#[0-9A-Fa-f]{6}$"+"\""};
if(vErrors === null){
vErrors = [err179];
}
else {
vErrors.push(err179);
}
errors++;
}
}
else {
const err180 = {instancePath:instancePath+"/series/" + i1+"/style/stroke",schemaPath:"#/$defs/series/properties/style/properties/stroke/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err180];
}
else {
vErrors.push(err180);
}
errors++;
}
}
if(data59.strokeWidthPt !== undefined){
let data61 = data59.strokeWidthPt;
if((typeof data61 == "number") && (isFinite(data61))){
if(data61 > 24 || isNaN(data61)){
const err181 = {instancePath:instancePath+"/series/" + i1+"/style/strokeWidthPt",schemaPath:"#/$defs/series/properties/style/properties/strokeWidthPt/maximum",keyword:"maximum",params:{comparison: "<=", limit: 24},message:"must be <= 24"};
if(vErrors === null){
vErrors = [err181];
}
else {
vErrors.push(err181);
}
errors++;
}
if(data61 <= 0 || isNaN(data61)){
const err182 = {instancePath:instancePath+"/series/" + i1+"/style/strokeWidthPt",schemaPath:"#/$defs/series/properties/style/properties/strokeWidthPt/exclusiveMinimum",keyword:"exclusiveMinimum",params:{comparison: ">", limit: 0},message:"must be > 0"};
if(vErrors === null){
vErrors = [err182];
}
else {
vErrors.push(err182);
}
errors++;
}
}
else {
const err183 = {instancePath:instancePath+"/series/" + i1+"/style/strokeWidthPt",schemaPath:"#/$defs/series/properties/style/properties/strokeWidthPt/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err183];
}
else {
vErrors.push(err183);
}
errors++;
}
}
if(data59.opacity !== undefined){
let data62 = data59.opacity;
if((typeof data62 == "number") && (isFinite(data62))){
if(data62 > 1 || isNaN(data62)){
const err184 = {instancePath:instancePath+"/series/" + i1+"/style/opacity",schemaPath:"#/$defs/series/properties/style/properties/opacity/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1},message:"must be <= 1"};
if(vErrors === null){
vErrors = [err184];
}
else {
vErrors.push(err184);
}
errors++;
}
if(data62 < 0 || isNaN(data62)){
const err185 = {instancePath:instancePath+"/series/" + i1+"/style/opacity",schemaPath:"#/$defs/series/properties/style/properties/opacity/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err185];
}
else {
vErrors.push(err185);
}
errors++;
}
}
else {
const err186 = {instancePath:instancePath+"/series/" + i1+"/style/opacity",schemaPath:"#/$defs/series/properties/style/properties/opacity/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err186];
}
else {
vErrors.push(err186);
}
errors++;
}
}
if(data59.dash !== undefined){
let data63 = data59.dash;
if(!((((data63 === "solid") || (data63 === "dash")) || (data63 === "dot")) || (data63 === "dash-dot"))){
const err187 = {instancePath:instancePath+"/series/" + i1+"/style/dash",schemaPath:"#/$defs/series/properties/style/properties/dash/enum",keyword:"enum",params:{allowedValues: schema37.properties.style.properties.dash.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err187];
}
else {
vErrors.push(err187);
}
errors++;
}
}
if(data59.markerShape !== undefined){
let data64 = data59.markerShape;
if(!((((((data64 === "circle") || (data64 === "square")) || (data64 === "triangle")) || (data64 === "diamond")) || (data64 === "cross")) || (data64 === "plus"))){
const err188 = {instancePath:instancePath+"/series/" + i1+"/style/markerShape",schemaPath:"#/$defs/series/properties/style/properties/markerShape/enum",keyword:"enum",params:{allowedValues: schema37.properties.style.properties.markerShape.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err188];
}
else {
vErrors.push(err188);
}
errors++;
}
}
if(data59.markerSizePt !== undefined){
let data65 = data59.markerSizePt;
if((typeof data65 == "number") && (isFinite(data65))){
if(data65 > 32 || isNaN(data65)){
const err189 = {instancePath:instancePath+"/series/" + i1+"/style/markerSizePt",schemaPath:"#/$defs/series/properties/style/properties/markerSizePt/maximum",keyword:"maximum",params:{comparison: "<=", limit: 32},message:"must be <= 32"};
if(vErrors === null){
vErrors = [err189];
}
else {
vErrors.push(err189);
}
errors++;
}
if(data65 < 0 || isNaN(data65)){
const err190 = {instancePath:instancePath+"/series/" + i1+"/style/markerSizePt",schemaPath:"#/$defs/series/properties/style/properties/markerSizePt/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err190];
}
else {
vErrors.push(err190);
}
errors++;
}
}
else {
const err191 = {instancePath:instancePath+"/series/" + i1+"/style/markerSizePt",schemaPath:"#/$defs/series/properties/style/properties/markerSizePt/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err191];
}
else {
vErrors.push(err191);
}
errors++;
}
}
if(data59.markerFill !== undefined){
let data66 = data59.markerFill;
if(typeof data66 === "string"){
if(!pattern7.test(data66)){
const err192 = {instancePath:instancePath+"/series/" + i1+"/style/markerFill",schemaPath:"#/$defs/series/properties/style/properties/markerFill/pattern",keyword:"pattern",params:{pattern: "^#[0-9A-Fa-f]{6}$"},message:"must match pattern \""+"^#[0-9A-Fa-f]{6}$"+"\""};
if(vErrors === null){
vErrors = [err192];
}
else {
vErrors.push(err192);
}
errors++;
}
}
else {
const err193 = {instancePath:instancePath+"/series/" + i1+"/style/markerFill",schemaPath:"#/$defs/series/properties/style/properties/markerFill/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err193];
}
else {
vErrors.push(err193);
}
errors++;
}
}
if(data59.markerStroke !== undefined){
let data67 = data59.markerStroke;
if(typeof data67 === "string"){
if(!pattern7.test(data67)){
const err194 = {instancePath:instancePath+"/series/" + i1+"/style/markerStroke",schemaPath:"#/$defs/series/properties/style/properties/markerStroke/pattern",keyword:"pattern",params:{pattern: "^#[0-9A-Fa-f]{6}$"},message:"must match pattern \""+"^#[0-9A-Fa-f]{6}$"+"\""};
if(vErrors === null){
vErrors = [err194];
}
else {
vErrors.push(err194);
}
errors++;
}
}
else {
const err195 = {instancePath:instancePath+"/series/" + i1+"/style/markerStroke",schemaPath:"#/$defs/series/properties/style/properties/markerStroke/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err195];
}
else {
vErrors.push(err195);
}
errors++;
}
}
if(data59.markerVisible !== undefined){
if(typeof data59.markerVisible !== "boolean"){
const err196 = {instancePath:instancePath+"/series/" + i1+"/style/markerVisible",schemaPath:"#/$defs/series/properties/style/properties/markerVisible/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err196];
}
else {
vErrors.push(err196);
}
errors++;
}
}
}
else {
const err197 = {instancePath:instancePath+"/series/" + i1+"/style",schemaPath:"#/$defs/series/properties/style/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err197];
}
else {
vErrors.push(err197);
}
errors++;
}
}
}
else {
const err198 = {instancePath:instancePath+"/series/" + i1,schemaPath:"#/$defs/series/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err198];
}
else {
vErrors.push(err198);
}
errors++;
}
}
}
else {
const err199 = {instancePath:instancePath+"/series",schemaPath:"#/properties/series/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err199];
}
else {
vErrors.push(err199);
}
errors++;
}
}
if(data.objects !== undefined){
let data69 = data.objects;
if(Array.isArray(data69)){
if(data69.length > 100000){
const err200 = {instancePath:instancePath+"/objects",schemaPath:"#/properties/objects/maxItems",keyword:"maxItems",params:{limit: 100000},message:"must NOT have more than 100000 items"};
if(vErrors === null){
vErrors = [err200];
}
else {
vErrors.push(err200);
}
errors++;
}
const len2 = data69.length;
for(let i2=0; i2<len2; i2++){
if(!(validate24(data69[i2], {instancePath:instancePath+"/objects/" + i2,parentData:data69,parentDataProperty:i2,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate24.errors : vErrors.concat(validate24.errors);
errors = vErrors.length;
}
}
}
else {
const err201 = {instancePath:instancePath+"/objects",schemaPath:"#/properties/objects/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err201];
}
else {
vErrors.push(err201);
}
errors++;
}
}
if(data.calculations !== undefined){
let data71 = data.calculations;
if(Array.isArray(data71)){
if(data71.length > 10000){
const err202 = {instancePath:instancePath+"/calculations",schemaPath:"#/properties/calculations/maxItems",keyword:"maxItems",params:{limit: 10000},message:"must NOT have more than 10000 items"};
if(vErrors === null){
vErrors = [err202];
}
else {
vErrors.push(err202);
}
errors++;
}
const len3 = data71.length;
for(let i3=0; i3<len3; i3++){
let data72 = data71[i3];
if(data72 && typeof data72 == "object" && !Array.isArray(data72)){
if(data72.id === undefined){
const err203 = {instancePath:instancePath+"/calculations/" + i3,schemaPath:"#/$defs/calculation/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err203];
}
else {
vErrors.push(err203);
}
errors++;
}
if(data72.kind === undefined){
const err204 = {instancePath:instancePath+"/calculations/" + i3,schemaPath:"#/$defs/calculation/required",keyword:"required",params:{missingProperty: "kind"},message:"must have required property '"+"kind"+"'"};
if(vErrors === null){
vErrors = [err204];
}
else {
vErrors.push(err204);
}
errors++;
}
if(data72.sourceDatasetIds === undefined){
const err205 = {instancePath:instancePath+"/calculations/" + i3,schemaPath:"#/$defs/calculation/required",keyword:"required",params:{missingProperty: "sourceDatasetIds"},message:"must have required property '"+"sourceDatasetIds"+"'"};
if(vErrors === null){
vErrors = [err205];
}
else {
vErrors.push(err205);
}
errors++;
}
if(data72.resultDatasetId === undefined){
const err206 = {instancePath:instancePath+"/calculations/" + i3,schemaPath:"#/$defs/calculation/required",keyword:"required",params:{missingProperty: "resultDatasetId"},message:"must have required property '"+"resultDatasetId"+"'"};
if(vErrors === null){
vErrors = [err206];
}
else {
vErrors.push(err206);
}
errors++;
}
if(data72.parameters === undefined){
const err207 = {instancePath:instancePath+"/calculations/" + i3,schemaPath:"#/$defs/calculation/required",keyword:"required",params:{missingProperty: "parameters"},message:"must have required property '"+"parameters"+"'"};
if(vErrors === null){
vErrors = [err207];
}
else {
vErrors.push(err207);
}
errors++;
}
if(data72.algorithmVersion === undefined){
const err208 = {instancePath:instancePath+"/calculations/" + i3,schemaPath:"#/$defs/calculation/required",keyword:"required",params:{missingProperty: "algorithmVersion"},message:"must have required property '"+"algorithmVersion"+"'"};
if(vErrors === null){
vErrors = [err208];
}
else {
vErrors.push(err208);
}
errors++;
}
if(data72.status === undefined){
const err209 = {instancePath:instancePath+"/calculations/" + i3,schemaPath:"#/$defs/calculation/required",keyword:"required",params:{missingProperty: "status"},message:"must have required property '"+"status"+"'"};
if(vErrors === null){
vErrors = [err209];
}
else {
vErrors.push(err209);
}
errors++;
}
if(data72.summary === undefined){
const err210 = {instancePath:instancePath+"/calculations/" + i3,schemaPath:"#/$defs/calculation/required",keyword:"required",params:{missingProperty: "summary"},message:"must have required property '"+"summary"+"'"};
if(vErrors === null){
vErrors = [err210];
}
else {
vErrors.push(err210);
}
errors++;
}
for(const key9 in data72){
if(!((((((((key9 === "id") || (key9 === "kind")) || (key9 === "sourceDatasetIds")) || (key9 === "resultDatasetId")) || (key9 === "parameters")) || (key9 === "algorithmVersion")) || (key9 === "status")) || (key9 === "summary"))){
const err211 = {instancePath:instancePath+"/calculations/" + i3,schemaPath:"#/$defs/calculation/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key9},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err211];
}
else {
vErrors.push(err211);
}
errors++;
}
}
if(data72.id !== undefined){
let data73 = data72.id;
if(typeof data73 === "string"){
if(!pattern6.test(data73)){
const err212 = {instancePath:instancePath+"/calculations/" + i3+"/id",schemaPath:"#/$defs/calculation/properties/id/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"+"\""};
if(vErrors === null){
vErrors = [err212];
}
else {
vErrors.push(err212);
}
errors++;
}
}
else {
const err213 = {instancePath:instancePath+"/calculations/" + i3+"/id",schemaPath:"#/$defs/calculation/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err213];
}
else {
vErrors.push(err213);
}
errors++;
}
}
if(data72.kind !== undefined){
let data74 = data72.kind;
if(!((((((((((data74 === "linear-fit") || (data74 === "polynomial-fit")) || (data74 === "exponential-fit")) || (data74 === "power-fit")) || (data74 === "savitzky-golay")) || (data74 === "moving-average")) || (data74 === "derivative")) || (data74 === "integral")) || (data74 === "interpolation")) || (data74 === "statistics"))){
const err214 = {instancePath:instancePath+"/calculations/" + i3+"/kind",schemaPath:"#/$defs/calculation/properties/kind/enum",keyword:"enum",params:{allowedValues: schema41.properties.kind.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err214];
}
else {
vErrors.push(err214);
}
errors++;
}
}
if(data72.sourceDatasetIds !== undefined){
let data75 = data72.sourceDatasetIds;
if(Array.isArray(data75)){
if(data75.length < 1){
const err215 = {instancePath:instancePath+"/calculations/" + i3+"/sourceDatasetIds",schemaPath:"#/$defs/calculation/properties/sourceDatasetIds/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err215];
}
else {
vErrors.push(err215);
}
errors++;
}
const len4 = data75.length;
for(let i4=0; i4<len4; i4++){
let data76 = data75[i4];
if(typeof data76 === "string"){
if(!pattern6.test(data76)){
const err216 = {instancePath:instancePath+"/calculations/" + i3+"/sourceDatasetIds/" + i4,schemaPath:"#/$defs/calculation/properties/sourceDatasetIds/items/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"+"\""};
if(vErrors === null){
vErrors = [err216];
}
else {
vErrors.push(err216);
}
errors++;
}
}
else {
const err217 = {instancePath:instancePath+"/calculations/" + i3+"/sourceDatasetIds/" + i4,schemaPath:"#/$defs/calculation/properties/sourceDatasetIds/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err217];
}
else {
vErrors.push(err217);
}
errors++;
}
}
}
else {
const err218 = {instancePath:instancePath+"/calculations/" + i3+"/sourceDatasetIds",schemaPath:"#/$defs/calculation/properties/sourceDatasetIds/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err218];
}
else {
vErrors.push(err218);
}
errors++;
}
}
if(data72.resultDatasetId !== undefined){
let data77 = data72.resultDatasetId;
const _errs154 = errors;
let valid24 = false;
const _errs155 = errors;
if(typeof data77 === "string"){
if(!pattern6.test(data77)){
const err219 = {instancePath:instancePath+"/calculations/" + i3+"/resultDatasetId",schemaPath:"#/$defs/calculation/properties/resultDatasetId/anyOf/0/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"+"\""};
if(vErrors === null){
vErrors = [err219];
}
else {
vErrors.push(err219);
}
errors++;
}
}
else {
const err220 = {instancePath:instancePath+"/calculations/" + i3+"/resultDatasetId",schemaPath:"#/$defs/calculation/properties/resultDatasetId/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err220];
}
else {
vErrors.push(err220);
}
errors++;
}
var _valid0 = _errs155 === errors;
valid24 = valid24 || _valid0;
const _errs157 = errors;
if(data77 !== null){
const err221 = {instancePath:instancePath+"/calculations/" + i3+"/resultDatasetId",schemaPath:"#/$defs/calculation/properties/resultDatasetId/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err221];
}
else {
vErrors.push(err221);
}
errors++;
}
var _valid0 = _errs157 === errors;
valid24 = valid24 || _valid0;
if(!valid24){
const err222 = {instancePath:instancePath+"/calculations/" + i3+"/resultDatasetId",schemaPath:"#/$defs/calculation/properties/resultDatasetId/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err222];
}
else {
vErrors.push(err222);
}
errors++;
}
else {
errors = _errs154;
if(vErrors !== null){
if(_errs154){
vErrors.length = _errs154;
}
else {
vErrors = null;
}
}
}
}
if(data72.parameters !== undefined){
let data78 = data72.parameters;
if(data78 && typeof data78 == "object" && !Array.isArray(data78)){
if(Object.keys(data78).length > 60){
const err223 = {instancePath:instancePath+"/calculations/" + i3+"/parameters",schemaPath:"#/$defs/calculation/properties/parameters/maxProperties",keyword:"maxProperties",params:{limit: 60},message:"must NOT have more than 60 properties"};
if(vErrors === null){
vErrors = [err223];
}
else {
vErrors.push(err223);
}
errors++;
}
for(const key10 in data78){
let data79 = data78[key10];
if((((typeof data79 != "object") && (typeof data79 !== "string")) && (!((typeof data79 == "number") && (isFinite(data79))))) && (typeof data79 !== "boolean")){
const err224 = {instancePath:instancePath+"/calculations/" + i3+"/parameters/" + key10.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/calculation/properties/parameters/additionalProperties/type",keyword:"type",params:{type: schema41.properties.parameters.additionalProperties.type},message:"must be string,number,integer,boolean,null,array,object"};
if(vErrors === null){
vErrors = [err224];
}
else {
vErrors.push(err224);
}
errors++;
}
}
}
else {
const err225 = {instancePath:instancePath+"/calculations/" + i3+"/parameters",schemaPath:"#/$defs/calculation/properties/parameters/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err225];
}
else {
vErrors.push(err225);
}
errors++;
}
}
if(data72.algorithmVersion !== undefined){
let data80 = data72.algorithmVersion;
if(!(((typeof data80 == "number") && (!(data80 % 1) && !isNaN(data80))) && (isFinite(data80)))){
const err226 = {instancePath:instancePath+"/calculations/" + i3+"/algorithmVersion",schemaPath:"#/$defs/calculation/properties/algorithmVersion/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err226];
}
else {
vErrors.push(err226);
}
errors++;
}
if((typeof data80 == "number") && (isFinite(data80))){
if(data80 < 1 || isNaN(data80)){
const err227 = {instancePath:instancePath+"/calculations/" + i3+"/algorithmVersion",schemaPath:"#/$defs/calculation/properties/algorithmVersion/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
if(vErrors === null){
vErrors = [err227];
}
else {
vErrors.push(err227);
}
errors++;
}
}
}
if(data72.status !== undefined){
let data81 = data72.status;
if(!(((data81 === "valid") || (data81 === "outdated")) || (data81 === "invalid"))){
const err228 = {instancePath:instancePath+"/calculations/" + i3+"/status",schemaPath:"#/$defs/calculation/properties/status/enum",keyword:"enum",params:{allowedValues: schema41.properties.status.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err228];
}
else {
vErrors.push(err228);
}
errors++;
}
}
if(data72.summary !== undefined){
let data82 = data72.summary;
if(data82 && typeof data82 == "object" && !Array.isArray(data82)){
if(Object.keys(data82).length > 60){
const err229 = {instancePath:instancePath+"/calculations/" + i3+"/summary",schemaPath:"#/$defs/calculation/properties/summary/maxProperties",keyword:"maxProperties",params:{limit: 60},message:"must NOT have more than 60 properties"};
if(vErrors === null){
vErrors = [err229];
}
else {
vErrors.push(err229);
}
errors++;
}
for(const key11 in data82){
let data83 = data82[key11];
if((((typeof data83 !== "string") && (!((typeof data83 == "number") && (isFinite(data83))))) && (typeof data83 !== "boolean")) && (data83 !== null)){
const err230 = {instancePath:instancePath+"/calculations/" + i3+"/summary/" + key11.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/calculation/properties/summary/additionalProperties/type",keyword:"type",params:{type: schema41.properties.summary.additionalProperties.type},message:"must be string,number,integer,boolean,null"};
if(vErrors === null){
vErrors = [err230];
}
else {
vErrors.push(err230);
}
errors++;
}
}
}
else {
const err231 = {instancePath:instancePath+"/calculations/" + i3+"/summary",schemaPath:"#/$defs/calculation/properties/summary/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err231];
}
else {
vErrors.push(err231);
}
errors++;
}
}
}
else {
const err232 = {instancePath:instancePath+"/calculations/" + i3,schemaPath:"#/$defs/calculation/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err232];
}
else {
vErrors.push(err232);
}
errors++;
}
}
}
else {
const err233 = {instancePath:instancePath+"/calculations",schemaPath:"#/properties/calculations/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err233];
}
else {
vErrors.push(err233);
}
errors++;
}
}
if(data.legend !== undefined){
let data84 = data.legend;
if(data84 && typeof data84 == "object" && !Array.isArray(data84)){
if(data84.visible === undefined){
const err234 = {instancePath:instancePath+"/legend",schemaPath:"#/properties/legend/required",keyword:"required",params:{missingProperty: "visible"},message:"must have required property '"+"visible"+"'"};
if(vErrors === null){
vErrors = [err234];
}
else {
vErrors.push(err234);
}
errors++;
}
if(data84.anchor === undefined){
const err235 = {instancePath:instancePath+"/legend",schemaPath:"#/properties/legend/required",keyword:"required",params:{missingProperty: "anchor"},message:"must have required property '"+"anchor"+"'"};
if(vErrors === null){
vErrors = [err235];
}
else {
vErrors.push(err235);
}
errors++;
}
for(const key12 in data84){
if(!((key12 === "visible") || (key12 === "anchor"))){
const err236 = {instancePath:instancePath+"/legend",schemaPath:"#/properties/legend/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key12},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err236];
}
else {
vErrors.push(err236);
}
errors++;
}
}
if(data84.visible !== undefined){
if(typeof data84.visible !== "boolean"){
const err237 = {instancePath:instancePath+"/legend/visible",schemaPath:"#/properties/legend/properties/visible/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err237];
}
else {
vErrors.push(err237);
}
errors++;
}
}
if(data84.anchor !== undefined){
let data86 = data84.anchor;
const _errs179 = errors;
let valid29 = false;
let passing0 = null;
const _errs180 = errors;
if(data86 && typeof data86 == "object" && !Array.isArray(data86)){
if(data86.mode === undefined){
const err238 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/0/required",keyword:"required",params:{missingProperty: "mode"},message:"must have required property '"+"mode"+"'"};
if(vErrors === null){
vErrors = [err238];
}
else {
vErrors.push(err238);
}
errors++;
}
if(data86.x === undefined){
const err239 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/0/required",keyword:"required",params:{missingProperty: "x"},message:"must have required property '"+"x"+"'"};
if(vErrors === null){
vErrors = [err239];
}
else {
vErrors.push(err239);
}
errors++;
}
if(data86.y === undefined){
const err240 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/0/required",keyword:"required",params:{missingProperty: "y"},message:"must have required property '"+"y"+"'"};
if(vErrors === null){
vErrors = [err240];
}
else {
vErrors.push(err240);
}
errors++;
}
for(const key13 in data86){
if(!(((key13 === "mode") || (key13 === "x")) || (key13 === "y"))){
const err241 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/0/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key13},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err241];
}
else {
vErrors.push(err241);
}
errors++;
}
}
if(data86.mode !== undefined){
if("data" !== data86.mode){
const err242 = {instancePath:instancePath+"/legend/anchor/mode",schemaPath:"#/$defs/anchor/oneOf/0/properties/mode/const",keyword:"const",params:{allowedValue: "data"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err242];
}
else {
vErrors.push(err242);
}
errors++;
}
}
if(data86.x !== undefined){
let data88 = data86.x;
if(!((typeof data88 == "number") && (isFinite(data88)))){
const err243 = {instancePath:instancePath+"/legend/anchor/x",schemaPath:"#/$defs/anchor/oneOf/0/properties/x/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err243];
}
else {
vErrors.push(err243);
}
errors++;
}
}
if(data86.y !== undefined){
let data89 = data86.y;
if(!((typeof data89 == "number") && (isFinite(data89)))){
const err244 = {instancePath:instancePath+"/legend/anchor/y",schemaPath:"#/$defs/anchor/oneOf/0/properties/y/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err244];
}
else {
vErrors.push(err244);
}
errors++;
}
}
}
else {
const err245 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err245];
}
else {
vErrors.push(err245);
}
errors++;
}
var _valid1 = _errs180 === errors;
if(_valid1){
valid29 = true;
passing0 = 0;
var props0 = true;
}
const _errs188 = errors;
if(data86 && typeof data86 == "object" && !Array.isArray(data86)){
if(data86.mode === undefined){
const err246 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/1/required",keyword:"required",params:{missingProperty: "mode"},message:"must have required property '"+"mode"+"'"};
if(vErrors === null){
vErrors = [err246];
}
else {
vErrors.push(err246);
}
errors++;
}
if(data86.pageX === undefined){
const err247 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/1/required",keyword:"required",params:{missingProperty: "pageX"},message:"must have required property '"+"pageX"+"'"};
if(vErrors === null){
vErrors = [err247];
}
else {
vErrors.push(err247);
}
errors++;
}
if(data86.pageY === undefined){
const err248 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/1/required",keyword:"required",params:{missingProperty: "pageY"},message:"must have required property '"+"pageY"+"'"};
if(vErrors === null){
vErrors = [err248];
}
else {
vErrors.push(err248);
}
errors++;
}
for(const key14 in data86){
if(!(((key14 === "mode") || (key14 === "pageX")) || (key14 === "pageY"))){
const err249 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/1/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key14},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err249];
}
else {
vErrors.push(err249);
}
errors++;
}
}
if(data86.mode !== undefined){
if("page" !== data86.mode){
const err250 = {instancePath:instancePath+"/legend/anchor/mode",schemaPath:"#/$defs/anchor/oneOf/1/properties/mode/const",keyword:"const",params:{allowedValue: "page"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err250];
}
else {
vErrors.push(err250);
}
errors++;
}
}
if(data86.pageX !== undefined){
let data91 = data86.pageX;
if((typeof data91 == "number") && (isFinite(data91))){
if(data91 > 1 || isNaN(data91)){
const err251 = {instancePath:instancePath+"/legend/anchor/pageX",schemaPath:"#/$defs/anchor/oneOf/1/properties/pageX/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1},message:"must be <= 1"};
if(vErrors === null){
vErrors = [err251];
}
else {
vErrors.push(err251);
}
errors++;
}
if(data91 < 0 || isNaN(data91)){
const err252 = {instancePath:instancePath+"/legend/anchor/pageX",schemaPath:"#/$defs/anchor/oneOf/1/properties/pageX/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err252];
}
else {
vErrors.push(err252);
}
errors++;
}
}
else {
const err253 = {instancePath:instancePath+"/legend/anchor/pageX",schemaPath:"#/$defs/anchor/oneOf/1/properties/pageX/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err253];
}
else {
vErrors.push(err253);
}
errors++;
}
}
if(data86.pageY !== undefined){
let data92 = data86.pageY;
if((typeof data92 == "number") && (isFinite(data92))){
if(data92 > 1 || isNaN(data92)){
const err254 = {instancePath:instancePath+"/legend/anchor/pageY",schemaPath:"#/$defs/anchor/oneOf/1/properties/pageY/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1},message:"must be <= 1"};
if(vErrors === null){
vErrors = [err254];
}
else {
vErrors.push(err254);
}
errors++;
}
if(data92 < 0 || isNaN(data92)){
const err255 = {instancePath:instancePath+"/legend/anchor/pageY",schemaPath:"#/$defs/anchor/oneOf/1/properties/pageY/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err255];
}
else {
vErrors.push(err255);
}
errors++;
}
}
else {
const err256 = {instancePath:instancePath+"/legend/anchor/pageY",schemaPath:"#/$defs/anchor/oneOf/1/properties/pageY/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err256];
}
else {
vErrors.push(err256);
}
errors++;
}
}
}
else {
const err257 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/1/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err257];
}
else {
vErrors.push(err257);
}
errors++;
}
var _valid1 = _errs188 === errors;
if(_valid1 && valid29){
valid29 = false;
passing0 = [passing0, 1];
}
else {
if(_valid1){
valid29 = true;
passing0 = 1;
if(props0 !== true){
props0 = true;
}
}
const _errs196 = errors;
if(data86 && typeof data86 == "object" && !Array.isArray(data86)){
if(data86.mode === undefined){
const err258 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/2/required",keyword:"required",params:{missingProperty: "mode"},message:"must have required property '"+"mode"+"'"};
if(vErrors === null){
vErrors = [err258];
}
else {
vErrors.push(err258);
}
errors++;
}
if(data86.datasetId === undefined){
const err259 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/2/required",keyword:"required",params:{missingProperty: "datasetId"},message:"must have required property '"+"datasetId"+"'"};
if(vErrors === null){
vErrors = [err259];
}
else {
vErrors.push(err259);
}
errors++;
}
if(data86.pointId === undefined){
const err260 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/2/required",keyword:"required",params:{missingProperty: "pointId"},message:"must have required property '"+"pointId"+"'"};
if(vErrors === null){
vErrors = [err260];
}
else {
vErrors.push(err260);
}
errors++;
}
if(data86.fallbackX === undefined){
const err261 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/2/required",keyword:"required",params:{missingProperty: "fallbackX"},message:"must have required property '"+"fallbackX"+"'"};
if(vErrors === null){
vErrors = [err261];
}
else {
vErrors.push(err261);
}
errors++;
}
if(data86.fallbackY === undefined){
const err262 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/2/required",keyword:"required",params:{missingProperty: "fallbackY"},message:"must have required property '"+"fallbackY"+"'"};
if(vErrors === null){
vErrors = [err262];
}
else {
vErrors.push(err262);
}
errors++;
}
if(data86.offsetXpx === undefined){
const err263 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/2/required",keyword:"required",params:{missingProperty: "offsetXpx"},message:"must have required property '"+"offsetXpx"+"'"};
if(vErrors === null){
vErrors = [err263];
}
else {
vErrors.push(err263);
}
errors++;
}
if(data86.offsetYpx === undefined){
const err264 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/2/required",keyword:"required",params:{missingProperty: "offsetYpx"},message:"must have required property '"+"offsetYpx"+"'"};
if(vErrors === null){
vErrors = [err264];
}
else {
vErrors.push(err264);
}
errors++;
}
for(const key15 in data86){
if(!(((((((key15 === "mode") || (key15 === "datasetId")) || (key15 === "pointId")) || (key15 === "fallbackX")) || (key15 === "fallbackY")) || (key15 === "offsetXpx")) || (key15 === "offsetYpx"))){
const err265 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/2/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key15},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err265];
}
else {
vErrors.push(err265);
}
errors++;
}
}
if(data86.mode !== undefined){
if("point" !== data86.mode){
const err266 = {instancePath:instancePath+"/legend/anchor/mode",schemaPath:"#/$defs/anchor/oneOf/2/properties/mode/const",keyword:"const",params:{allowedValue: "point"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err266];
}
else {
vErrors.push(err266);
}
errors++;
}
}
if(data86.datasetId !== undefined){
let data94 = data86.datasetId;
if(typeof data94 === "string"){
if(!pattern6.test(data94)){
const err267 = {instancePath:instancePath+"/legend/anchor/datasetId",schemaPath:"#/$defs/anchor/oneOf/2/properties/datasetId/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"+"\""};
if(vErrors === null){
vErrors = [err267];
}
else {
vErrors.push(err267);
}
errors++;
}
}
else {
const err268 = {instancePath:instancePath+"/legend/anchor/datasetId",schemaPath:"#/$defs/anchor/oneOf/2/properties/datasetId/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err268];
}
else {
vErrors.push(err268);
}
errors++;
}
}
if(data86.pointId !== undefined){
let data95 = data86.pointId;
if(typeof data95 === "string"){
if(!pattern6.test(data95)){
const err269 = {instancePath:instancePath+"/legend/anchor/pointId",schemaPath:"#/$defs/anchor/oneOf/2/properties/pointId/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"+"\""};
if(vErrors === null){
vErrors = [err269];
}
else {
vErrors.push(err269);
}
errors++;
}
}
else {
const err270 = {instancePath:instancePath+"/legend/anchor/pointId",schemaPath:"#/$defs/anchor/oneOf/2/properties/pointId/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err270];
}
else {
vErrors.push(err270);
}
errors++;
}
}
if(data86.fallbackX !== undefined){
let data96 = data86.fallbackX;
if(!((typeof data96 == "number") && (isFinite(data96)))){
const err271 = {instancePath:instancePath+"/legend/anchor/fallbackX",schemaPath:"#/$defs/anchor/oneOf/2/properties/fallbackX/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err271];
}
else {
vErrors.push(err271);
}
errors++;
}
}
if(data86.fallbackY !== undefined){
let data97 = data86.fallbackY;
if(!((typeof data97 == "number") && (isFinite(data97)))){
const err272 = {instancePath:instancePath+"/legend/anchor/fallbackY",schemaPath:"#/$defs/anchor/oneOf/2/properties/fallbackY/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err272];
}
else {
vErrors.push(err272);
}
errors++;
}
}
if(data86.offsetXpx !== undefined){
let data98 = data86.offsetXpx;
if(!((typeof data98 == "number") && (isFinite(data98)))){
const err273 = {instancePath:instancePath+"/legend/anchor/offsetXpx",schemaPath:"#/$defs/anchor/oneOf/2/properties/offsetXpx/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err273];
}
else {
vErrors.push(err273);
}
errors++;
}
}
if(data86.offsetYpx !== undefined){
let data99 = data86.offsetYpx;
if(!((typeof data99 == "number") && (isFinite(data99)))){
const err274 = {instancePath:instancePath+"/legend/anchor/offsetYpx",schemaPath:"#/$defs/anchor/oneOf/2/properties/offsetYpx/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err274];
}
else {
vErrors.push(err274);
}
errors++;
}
}
}
else {
const err275 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/2/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err275];
}
else {
vErrors.push(err275);
}
errors++;
}
var _valid1 = _errs196 === errors;
if(_valid1 && valid29){
valid29 = false;
passing0 = [passing0, 2];
}
else {
if(_valid1){
valid29 = true;
passing0 = 2;
if(props0 !== true){
props0 = true;
}
}
}
}
if(!valid29){
const err276 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf",keyword:"oneOf",params:{passingSchemas: passing0},message:"must match exactly one schema in oneOf"};
if(vErrors === null){
vErrors = [err276];
}
else {
vErrors.push(err276);
}
errors++;
}
else {
errors = _errs179;
if(vErrors !== null){
if(_errs179){
vErrors.length = _errs179;
}
else {
vErrors = null;
}
}
}
}
}
else {
const err277 = {instancePath:instancePath+"/legend",schemaPath:"#/properties/legend/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err277];
}
else {
vErrors.push(err277);
}
errors++;
}
}
if(data.viewport !== undefined){
let data100 = data.viewport;
if(data100 && typeof data100 == "object" && !Array.isArray(data100)){
if(data100.xMin === undefined){
const err278 = {instancePath:instancePath+"/viewport",schemaPath:"#/properties/viewport/required",keyword:"required",params:{missingProperty: "xMin"},message:"must have required property '"+"xMin"+"'"};
if(vErrors === null){
vErrors = [err278];
}
else {
vErrors.push(err278);
}
errors++;
}
if(data100.xMax === undefined){
const err279 = {instancePath:instancePath+"/viewport",schemaPath:"#/properties/viewport/required",keyword:"required",params:{missingProperty: "xMax"},message:"must have required property '"+"xMax"+"'"};
if(vErrors === null){
vErrors = [err279];
}
else {
vErrors.push(err279);
}
errors++;
}
if(data100.yMin === undefined){
const err280 = {instancePath:instancePath+"/viewport",schemaPath:"#/properties/viewport/required",keyword:"required",params:{missingProperty: "yMin"},message:"must have required property '"+"yMin"+"'"};
if(vErrors === null){
vErrors = [err280];
}
else {
vErrors.push(err280);
}
errors++;
}
if(data100.yMax === undefined){
const err281 = {instancePath:instancePath+"/viewport",schemaPath:"#/properties/viewport/required",keyword:"required",params:{missingProperty: "yMax"},message:"must have required property '"+"yMax"+"'"};
if(vErrors === null){
vErrors = [err281];
}
else {
vErrors.push(err281);
}
errors++;
}
for(const key16 in data100){
if(!((((key16 === "xMin") || (key16 === "xMax")) || (key16 === "yMin")) || (key16 === "yMax"))){
const err282 = {instancePath:instancePath+"/viewport",schemaPath:"#/properties/viewport/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key16},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err282];
}
else {
vErrors.push(err282);
}
errors++;
}
}
if(data100.xMin !== undefined){
let data101 = data100.xMin;
if(!((typeof data101 == "number") && (isFinite(data101)))){
const err283 = {instancePath:instancePath+"/viewport/xMin",schemaPath:"#/properties/viewport/properties/xMin/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err283];
}
else {
vErrors.push(err283);
}
errors++;
}
}
if(data100.xMax !== undefined){
let data102 = data100.xMax;
if(!((typeof data102 == "number") && (isFinite(data102)))){
const err284 = {instancePath:instancePath+"/viewport/xMax",schemaPath:"#/properties/viewport/properties/xMax/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err284];
}
else {
vErrors.push(err284);
}
errors++;
}
}
if(data100.yMin !== undefined){
let data103 = data100.yMin;
if(!((typeof data103 == "number") && (isFinite(data103)))){
const err285 = {instancePath:instancePath+"/viewport/yMin",schemaPath:"#/properties/viewport/properties/yMin/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err285];
}
else {
vErrors.push(err285);
}
errors++;
}
}
if(data100.yMax !== undefined){
let data104 = data100.yMax;
if(!((typeof data104 == "number") && (isFinite(data104)))){
const err286 = {instancePath:instancePath+"/viewport/yMax",schemaPath:"#/properties/viewport/properties/yMax/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err286];
}
else {
vErrors.push(err286);
}
errors++;
}
}
}
else {
const err287 = {instancePath:instancePath+"/viewport",schemaPath:"#/properties/viewport/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err287];
}
else {
vErrors.push(err287);
}
errors++;
}
}
if(data.editor !== undefined){
let data105 = data.editor;
if(data105 && typeof data105 == "object" && !Array.isArray(data105)){
if(data105.selectedObjectId === undefined){
const err288 = {instancePath:instancePath+"/editor",schemaPath:"#/properties/editor/required",keyword:"required",params:{missingProperty: "selectedObjectId"},message:"must have required property '"+"selectedObjectId"+"'"};
if(vErrors === null){
vErrors = [err288];
}
else {
vErrors.push(err288);
}
errors++;
}
if(data105.showPointMarkers === undefined){
const err289 = {instancePath:instancePath+"/editor",schemaPath:"#/properties/editor/required",keyword:"required",params:{missingProperty: "showPointMarkers"},message:"must have required property '"+"showPointMarkers"+"'"};
if(vErrors === null){
vErrors = [err289];
}
else {
vErrors.push(err289);
}
errors++;
}
for(const key17 in data105){
if(!((key17 === "selectedObjectId") || (key17 === "showPointMarkers"))){
const err290 = {instancePath:instancePath+"/editor",schemaPath:"#/properties/editor/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key17},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err290];
}
else {
vErrors.push(err290);
}
errors++;
}
}
if(data105.selectedObjectId !== undefined){
let data106 = data105.selectedObjectId;
const _errs227 = errors;
let valid35 = false;
const _errs228 = errors;
if(typeof data106 === "string"){
if(!pattern6.test(data106)){
const err291 = {instancePath:instancePath+"/editor/selectedObjectId",schemaPath:"#/properties/editor/properties/selectedObjectId/anyOf/0/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"+"\""};
if(vErrors === null){
vErrors = [err291];
}
else {
vErrors.push(err291);
}
errors++;
}
}
else {
const err292 = {instancePath:instancePath+"/editor/selectedObjectId",schemaPath:"#/properties/editor/properties/selectedObjectId/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err292];
}
else {
vErrors.push(err292);
}
errors++;
}
var _valid2 = _errs228 === errors;
valid35 = valid35 || _valid2;
const _errs230 = errors;
if(data106 !== null){
const err293 = {instancePath:instancePath+"/editor/selectedObjectId",schemaPath:"#/properties/editor/properties/selectedObjectId/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err293];
}
else {
vErrors.push(err293);
}
errors++;
}
var _valid2 = _errs230 === errors;
valid35 = valid35 || _valid2;
if(!valid35){
const err294 = {instancePath:instancePath+"/editor/selectedObjectId",schemaPath:"#/properties/editor/properties/selectedObjectId/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err294];
}
else {
vErrors.push(err294);
}
errors++;
}
else {
errors = _errs227;
if(vErrors !== null){
if(_errs227){
vErrors.length = _errs227;
}
else {
vErrors = null;
}
}
}
}
if(data105.showPointMarkers !== undefined){
if(typeof data105.showPointMarkers !== "boolean"){
const err295 = {instancePath:instancePath+"/editor/showPointMarkers",schemaPath:"#/properties/editor/properties/showPointMarkers/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err295];
}
else {
vErrors.push(err295);
}
errors++;
}
}
}
else {
const err296 = {instancePath:instancePath+"/editor",schemaPath:"#/properties/editor/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err296];
}
else {
vErrors.push(err296);
}
errors++;
}
}
if(data.extensions !== undefined){
let data108 = data.extensions;
if(data108 && typeof data108 == "object" && !Array.isArray(data108)){
}
else {
const err297 = {instancePath:instancePath+"/extensions",schemaPath:"#/properties/extensions/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err297];
}
else {
vErrors.push(err297);
}
errors++;
}
}
}
else {
const err298 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err298];
}
else {
vErrors.push(err298);
}
errors++;
}
validate21.errors = vErrors;
return errors === 0;
}
validate21.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema43 = {"$schema":"https://json-schema.org/draft/2020-12/schema","$id":"https://github.com/anatamien/APIO-GRAPH/blob/main/schemas/aph-1.1.schema.json","title":"APIO GRAPH project file v1.1","description":"Self-contained UTF-8 JSON project. Referential and numeric semantic validation is additionally required.","type":"object","additionalProperties":false,"properties":{"format":{"const":"APIO_GRAPH_PROJECT"},"schemaVersion":{"type":"string","pattern":"^1\\.1\\.[0-9]+$"},"createdWith":{"type":"object","additionalProperties":false,"properties":{"name":{"const":"APIO GRAPH"},"version":{"type":"string","minLength":1}},"required":["name","version"]},"project":{"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"title":{"type":"string","maxLength":300},"createdAt":{"type":"string","format":"date-time"},"updatedAt":{"type":"string","format":"date-time"}},"required":["id","title","createdAt","updatedAt"]},"page":{"type":"object","additionalProperties":false,"properties":{"widthPx":{"type":"integer","minimum":100,"maximum":30000},"heightPx":{"type":"integer","minimum":100,"maximum":30000},"background":{"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"},"paddingPx":{"type":"number","minimum":0,"maximum":2000}},"required":["widthPx","heightPx","background","paddingPx"]},"axes":{"type":"object","additionalProperties":false,"properties":{"x":{"$ref":"#/$defs/axis"},"y":{"$ref":"#/$defs/axis"}},"required":["x","y"]},"datasets":{"type":"array","items":{"$ref":"#/$defs/dataset"},"maxItems":1000},"series":{"type":"array","items":{"$ref":"#/$defs/series"},"maxItems":1000},"objects":{"type":"array","items":{"$ref":"#/$defs/drawObject"},"maxItems":100000},"calculations":{"type":"array","items":{"$ref":"#/$defs/calculation"},"maxItems":10000},"legend":{"type":"object","additionalProperties":false,"properties":{"visible":{"type":"boolean"},"anchor":{"$ref":"#/$defs/anchor"}},"required":["visible","anchor"]},"viewport":{"type":"object","additionalProperties":false,"properties":{"xMin":{"type":"number"},"xMax":{"type":"number"},"yMin":{"type":"number"},"yMax":{"type":"number"}},"required":["xMin","xMax","yMin","yMax"]},"editor":{"type":"object","additionalProperties":false,"properties":{"selectedObjectId":{"anyOf":[{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},{"type":"null"}]},"showPointMarkers":{"type":"boolean"}},"required":["selectedObjectId","showPointMarkers"]},"extensions":{"type":"object","additionalProperties":true}},"required":["format","schemaVersion","createdWith","project","page","axes","datasets","series","objects","calculations","legend","viewport","editor","extensions"],"$defs":{"point":{"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"x":{"type":"number"},"y":{"type":"number"}},"required":["id","x","y"]},"anchor":{"oneOf":[{"type":"object","additionalProperties":false,"properties":{"mode":{"const":"data"},"x":{"type":"number"},"y":{"type":"number"}},"required":["mode","x","y"]},{"type":"object","additionalProperties":false,"properties":{"mode":{"const":"page"},"pageX":{"type":"number","minimum":0,"maximum":1},"pageY":{"type":"number","minimum":0,"maximum":1}},"required":["mode","pageX","pageY"]},{"type":"object","additionalProperties":false,"properties":{"mode":{"const":"point"},"datasetId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"pointId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"fallbackX":{"type":"number"},"fallbackY":{"type":"number"},"offsetXpx":{"type":"number"},"offsetYpx":{"type":"number"}},"required":["mode","datasetId","pointId","fallbackX","fallbackY","offsetXpx","offsetYpx"]}]},"axis":{"type":"object","additionalProperties":false,"properties":{"label":{"type":"string","maxLength":500},"unit":{"type":"string","maxLength":100},"scale":{"const":"linear"},"mode":{"enum":["auto","manual"]},"min":{"type":"number"},"max":{"type":"number"},"tickMode":{"enum":["auto","manual"]},"tickStep":{"type":"number","exclusiveMinimum":0},"tickOrigin":{"type":"number"},"minorDivisions":{"type":"integer","minimum":0,"maximum":20},"grid":{"type":"boolean"},"numberFormat":{"enum":["auto","fixed","scientific"]},"precision":{"type":"integer","minimum":0,"maximum":15},"strokeWidthPt":{"type":"number","exclusiveMinimum":0,"maximum":24},"labelSizePt":{"type":"number","minimum":6,"maximum":72}},"required":["label","unit","scale","mode","min","max","tickMode","tickStep","tickOrigin","minorDivisions","grid","numberFormat","precision","strokeWidthPt","labelSizePt"]},"dataset":{"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"name":{"type":"string","maxLength":300},"role":{"enum":["raw","derived"]},"source":{"type":"object","additionalProperties":false,"properties":{"kind":{"enum":["import","clipboard","manual","calculation"]},"displayName":{"type":"string","maxLength":300},"calculationId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"}},"required":["kind"]},"points":{"type":"array","items":{"$ref":"#/$defs/point"},"maxItems":1000000}},"required":["id","name","role","source","points"]},"series":{"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"datasetId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"name":{"type":"string","maxLength":300},"visible":{"type":"boolean"},"includeInAutoRange":{"type":"boolean"},"order":{"type":"integer","minimum":0},"mode":{"enum":["line","points","line-points"]},"style":{"type":"object","additionalProperties":false,"properties":{"stroke":{"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"},"strokeWidthPt":{"type":"number","exclusiveMinimum":0,"maximum":24},"opacity":{"type":"number","minimum":0,"maximum":1},"dash":{"enum":["solid","dash","dot","dash-dot"]},"markerShape":{"enum":["circle","square","triangle","diamond","cross","plus"]},"markerSizePt":{"type":"number","minimum":0,"maximum":32},"markerFill":{"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"},"markerStroke":{"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"},"markerVisible":{"type":"boolean"}},"required":["stroke","strokeWidthPt","opacity","dash","markerShape","markerSizePt","markerFill","markerStroke","markerVisible"]}},"required":["id","datasetId","name","visible","includeInAutoRange","order","mode","style"]},"drawObject":{"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"type":{"enum":["text","segment","line","arrow","callout","rectangle","range-x","range-y","marker"]},"name":{"type":"string","maxLength":300},"anchors":{"type":"array","items":{"$ref":"#/$defs/anchor"},"minItems":1,"maxItems":2},"geometry":{"type":"object","additionalProperties":false,"properties":{"directionX":{"type":"number"},"directionY":{"type":"number"}},"required":[]},"text":{"type":"array","items":{"$ref":"#/$defs/textPart"},"maxItems":1000},"style":{"type":"object","additionalProperties":false,"properties":{"stroke":{"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"},"strokeWidthPt":{"type":"number","exclusiveMinimum":0,"maximum":24},"dash":{"enum":["solid","dash","dot","dash-dot"]},"strokeOpacity":{"type":"number","minimum":0,"maximum":1},"fill":{"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"},"fillOpacity":{"type":"number","minimum":0,"maximum":1},"fontSizePt":{"type":"number","minimum":6,"maximum":72},"fontFamily":{"const":"Courier New"},"arrowHead":{"enum":["none","start","end","both"]},"markerShape":{"enum":["circle","square","triangle","diamond","cross","plus"]},"markerSizePt":{"type":"number","minimum":0,"maximum":32}},"required":["stroke","strokeWidthPt","dash","strokeOpacity","fill","fillOpacity","fontSizePt","fontFamily","arrowHead","markerShape","markerSizePt"]},"zIndex":{"type":"integer"},"visible":{"type":"boolean"},"locked":{"type":"boolean"}},"required":["id","type","name","anchors","geometry","text","style","zIndex","visible","locked"]},"calculation":{"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"kind":{"enum":["linear-fit","polynomial-fit","exponential-fit","power-fit","savitzky-golay","moving-average","derivative","integral","interpolation","statistics","baseline","peaks","area"]},"sourceDatasetIds":{"type":"array","items":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"minItems":1},"resultDatasetId":{"anyOf":[{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},{"type":"null"}]},"parameters":{"type":"object","maxProperties":60,"additionalProperties":{"type":["string","number","integer","boolean","null","array","object"]}},"algorithmVersion":{"type":"integer","minimum":1},"status":{"enum":["valid","outdated","invalid"]},"summary":{"type":"object","maxProperties":60,"additionalProperties":{"type":["string","number","integer","boolean","null"]}},"data":{"type":"object","additionalProperties":false,"properties":{"peaks":{"type":"array","maxItems":1000000,"items":{"$ref":"#/$defs/peakMeasurement"}}}},"display":{"type":"object","additionalProperties":false,"properties":{"visible":{"type":"boolean"},"stroke":{"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"},"opacity":{"type":"number","minimum":0,"maximum":1},"label":{"type":"boolean"}},"required":["visible","stroke","opacity","label"]}},"required":["id","kind","sourceDatasetIds","resultDatasetId","parameters","algorithmVersion","status","summary"]},"textPart":{"type":"object","additionalProperties":false,"properties":{"text":{"type":"string","maxLength":5000},"baseline":{"enum":["normal","sub","super"]},"bold":{"type":"boolean"},"italic":{"type":"boolean"}},"required":["text","baseline","bold","italic"]},"peakMeasurement":{"type":"object","additionalProperties":false,"properties":{"index":{"type":"integer","minimum":0},"x":{"type":"number"},"y":{"type":"number"},"direction":{"enum":["max","min"]},"prominence":{"type":["number","null"],"minimum":0},"width":{"type":["number","null"],"minimum":0},"left":{"type":["number","null"]},"right":{"type":["number","null"]},"level":{"type":["number","null"]},"incomplete":{"type":"boolean"}},"required":["index","x","y","direction","prominence","width","left","right","level","incomplete"]}}};
const schema44 = {"type":"object","additionalProperties":false,"properties":{"label":{"type":"string","maxLength":500},"unit":{"type":"string","maxLength":100},"scale":{"const":"linear"},"mode":{"enum":["auto","manual"]},"min":{"type":"number"},"max":{"type":"number"},"tickMode":{"enum":["auto","manual"]},"tickStep":{"type":"number","exclusiveMinimum":0},"tickOrigin":{"type":"number"},"minorDivisions":{"type":"integer","minimum":0,"maximum":20},"grid":{"type":"boolean"},"numberFormat":{"enum":["auto","fixed","scientific"]},"precision":{"type":"integer","minimum":0,"maximum":15},"strokeWidthPt":{"type":"number","exclusiveMinimum":0,"maximum":24},"labelSizePt":{"type":"number","minimum":6,"maximum":72}},"required":["label","unit","scale","mode","min","max","tickMode","tickStep","tickOrigin","minorDivisions","grid","numberFormat","precision","strokeWidthPt","labelSizePt"]};
const schema48 = {"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"datasetId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"name":{"type":"string","maxLength":300},"visible":{"type":"boolean"},"includeInAutoRange":{"type":"boolean"},"order":{"type":"integer","minimum":0},"mode":{"enum":["line","points","line-points"]},"style":{"type":"object","additionalProperties":false,"properties":{"stroke":{"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"},"strokeWidthPt":{"type":"number","exclusiveMinimum":0,"maximum":24},"opacity":{"type":"number","minimum":0,"maximum":1},"dash":{"enum":["solid","dash","dot","dash-dot"]},"markerShape":{"enum":["circle","square","triangle","diamond","cross","plus"]},"markerSizePt":{"type":"number","minimum":0,"maximum":32},"markerFill":{"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"},"markerStroke":{"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"},"markerVisible":{"type":"boolean"}},"required":["stroke","strokeWidthPt","opacity","dash","markerShape","markerSizePt","markerFill","markerStroke","markerVisible"]}},"required":["id","datasetId","name","visible","includeInAutoRange","order","mode","style"]};
const schema50 = {"oneOf":[{"type":"object","additionalProperties":false,"properties":{"mode":{"const":"data"},"x":{"type":"number"},"y":{"type":"number"}},"required":["mode","x","y"]},{"type":"object","additionalProperties":false,"properties":{"mode":{"const":"page"},"pageX":{"type":"number","minimum":0,"maximum":1},"pageY":{"type":"number","minimum":0,"maximum":1}},"required":["mode","pageX","pageY"]},{"type":"object","additionalProperties":false,"properties":{"mode":{"const":"point"},"datasetId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"pointId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"fallbackX":{"type":"number"},"fallbackY":{"type":"number"},"offsetXpx":{"type":"number"},"offsetYpx":{"type":"number"}},"required":["mode","datasetId","pointId","fallbackX","fallbackY","offsetXpx","offsetYpx"]}]};
const pattern28 = new RegExp("^1\\.1\\.[0-9]+$", "u");
const schema46 = {"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"name":{"type":"string","maxLength":300},"role":{"enum":["raw","derived"]},"source":{"type":"object","additionalProperties":false,"properties":{"kind":{"enum":["import","clipboard","manual","calculation"]},"displayName":{"type":"string","maxLength":300},"calculationId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"}},"required":["kind"]},"points":{"type":"array","items":{"$ref":"#/$defs/point"},"maxItems":1000000}},"required":["id","name","role","source","points"]};
const schema47 = {"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"x":{"type":"number"},"y":{"type":"number"}},"required":["id","x","y"]};

function validate28(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate28.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.id === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.name === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.role === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "role"},message:"must have required property '"+"role"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.source === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "source"},message:"must have required property '"+"source"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.points === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "points"},message:"must have required property '"+"points"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
for(const key0 in data){
if(!(((((key0 === "id") || (key0 === "name")) || (key0 === "role")) || (key0 === "source")) || (key0 === "points"))){
const err5 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
if(data.id !== undefined){
let data0 = data.id;
if(typeof data0 === "string"){
if(!pattern6.test(data0)){
const err6 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"+"\""};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
else {
const err7 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
if(data.name !== undefined){
let data1 = data.name;
if(typeof data1 === "string"){
if(func2(data1) > 300){
const err8 = {instancePath:instancePath+"/name",schemaPath:"#/properties/name/maxLength",keyword:"maxLength",params:{limit: 300},message:"must NOT have more than 300 characters"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
else {
const err9 = {instancePath:instancePath+"/name",schemaPath:"#/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
if(data.role !== undefined){
let data2 = data.role;
if(!((data2 === "raw") || (data2 === "derived"))){
const err10 = {instancePath:instancePath+"/role",schemaPath:"#/properties/role/enum",keyword:"enum",params:{allowedValues: schema46.properties.role.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
if(data.source !== undefined){
let data3 = data.source;
if(data3 && typeof data3 == "object" && !Array.isArray(data3)){
if(data3.kind === undefined){
const err11 = {instancePath:instancePath+"/source",schemaPath:"#/properties/source/required",keyword:"required",params:{missingProperty: "kind"},message:"must have required property '"+"kind"+"'"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
for(const key1 in data3){
if(!(((key1 === "kind") || (key1 === "displayName")) || (key1 === "calculationId"))){
const err12 = {instancePath:instancePath+"/source",schemaPath:"#/properties/source/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
if(data3.kind !== undefined){
let data4 = data3.kind;
if(!((((data4 === "import") || (data4 === "clipboard")) || (data4 === "manual")) || (data4 === "calculation"))){
const err13 = {instancePath:instancePath+"/source/kind",schemaPath:"#/properties/source/properties/kind/enum",keyword:"enum",params:{allowedValues: schema46.properties.source.properties.kind.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
if(data3.displayName !== undefined){
let data5 = data3.displayName;
if(typeof data5 === "string"){
if(func2(data5) > 300){
const err14 = {instancePath:instancePath+"/source/displayName",schemaPath:"#/properties/source/properties/displayName/maxLength",keyword:"maxLength",params:{limit: 300},message:"must NOT have more than 300 characters"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
else {
const err15 = {instancePath:instancePath+"/source/displayName",schemaPath:"#/properties/source/properties/displayName/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
if(data3.calculationId !== undefined){
let data6 = data3.calculationId;
if(typeof data6 === "string"){
if(!pattern6.test(data6)){
const err16 = {instancePath:instancePath+"/source/calculationId",schemaPath:"#/properties/source/properties/calculationId/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"+"\""};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
}
else {
const err17 = {instancePath:instancePath+"/source/calculationId",schemaPath:"#/properties/source/properties/calculationId/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
}
}
else {
const err18 = {instancePath:instancePath+"/source",schemaPath:"#/properties/source/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
}
if(data.points !== undefined){
let data7 = data.points;
if(Array.isArray(data7)){
if(data7.length > 1000000){
const err19 = {instancePath:instancePath+"/points",schemaPath:"#/properties/points/maxItems",keyword:"maxItems",params:{limit: 1000000},message:"must NOT have more than 1000000 items"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
const len0 = data7.length;
for(let i0=0; i0<len0; i0++){
let data8 = data7[i0];
if(data8 && typeof data8 == "object" && !Array.isArray(data8)){
if(data8.id === undefined){
const err20 = {instancePath:instancePath+"/points/" + i0,schemaPath:"#/$defs/point/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
if(data8.x === undefined){
const err21 = {instancePath:instancePath+"/points/" + i0,schemaPath:"#/$defs/point/required",keyword:"required",params:{missingProperty: "x"},message:"must have required property '"+"x"+"'"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
if(data8.y === undefined){
const err22 = {instancePath:instancePath+"/points/" + i0,schemaPath:"#/$defs/point/required",keyword:"required",params:{missingProperty: "y"},message:"must have required property '"+"y"+"'"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
for(const key2 in data8){
if(!(((key2 === "id") || (key2 === "x")) || (key2 === "y"))){
const err23 = {instancePath:instancePath+"/points/" + i0,schemaPath:"#/$defs/point/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key2},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
}
if(data8.id !== undefined){
let data9 = data8.id;
if(typeof data9 === "string"){
if(!pattern6.test(data9)){
const err24 = {instancePath:instancePath+"/points/" + i0+"/id",schemaPath:"#/$defs/point/properties/id/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"+"\""};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
}
else {
const err25 = {instancePath:instancePath+"/points/" + i0+"/id",schemaPath:"#/$defs/point/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
}
if(data8.x !== undefined){
let data10 = data8.x;
if(!((typeof data10 == "number") && (isFinite(data10)))){
const err26 = {instancePath:instancePath+"/points/" + i0+"/x",schemaPath:"#/$defs/point/properties/x/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
}
if(data8.y !== undefined){
let data11 = data8.y;
if(!((typeof data11 == "number") && (isFinite(data11)))){
const err27 = {instancePath:instancePath+"/points/" + i0+"/y",schemaPath:"#/$defs/point/properties/y/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
}
}
else {
const err28 = {instancePath:instancePath+"/points/" + i0,schemaPath:"#/$defs/point/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
}
}
else {
const err29 = {instancePath:instancePath+"/points",schemaPath:"#/properties/points/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
}
}
}
else {
const err30 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err30];
}
else {
vErrors.push(err30);
}
errors++;
}
validate28.errors = vErrors;
return errors === 0;
}
validate28.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema49 = {"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"type":{"enum":["text","segment","line","arrow","callout","rectangle","range-x","range-y","marker"]},"name":{"type":"string","maxLength":300},"anchors":{"type":"array","items":{"$ref":"#/$defs/anchor"},"minItems":1,"maxItems":2},"geometry":{"type":"object","additionalProperties":false,"properties":{"directionX":{"type":"number"},"directionY":{"type":"number"}},"required":[]},"text":{"type":"array","items":{"$ref":"#/$defs/textPart"},"maxItems":1000},"style":{"type":"object","additionalProperties":false,"properties":{"stroke":{"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"},"strokeWidthPt":{"type":"number","exclusiveMinimum":0,"maximum":24},"dash":{"enum":["solid","dash","dot","dash-dot"]},"strokeOpacity":{"type":"number","minimum":0,"maximum":1},"fill":{"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"},"fillOpacity":{"type":"number","minimum":0,"maximum":1},"fontSizePt":{"type":"number","minimum":6,"maximum":72},"fontFamily":{"const":"Courier New"},"arrowHead":{"enum":["none","start","end","both"]},"markerShape":{"enum":["circle","square","triangle","diamond","cross","plus"]},"markerSizePt":{"type":"number","minimum":0,"maximum":32}},"required":["stroke","strokeWidthPt","dash","strokeOpacity","fill","fillOpacity","fontSizePt","fontFamily","arrowHead","markerShape","markerSizePt"]},"zIndex":{"type":"integer"},"visible":{"type":"boolean"},"locked":{"type":"boolean"}},"required":["id","type","name","anchors","geometry","text","style","zIndex","visible","locked"]};
const schema51 = {"type":"object","additionalProperties":false,"properties":{"text":{"type":"string","maxLength":5000},"baseline":{"enum":["normal","sub","super"]},"bold":{"type":"boolean"},"italic":{"type":"boolean"}},"required":["text","baseline","bold","italic"]};

function validate30(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate30.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.id === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.type === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "type"},message:"must have required property '"+"type"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.name === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.anchors === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "anchors"},message:"must have required property '"+"anchors"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.geometry === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "geometry"},message:"must have required property '"+"geometry"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data.text === undefined){
const err5 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "text"},message:"must have required property '"+"text"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data.style === undefined){
const err6 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "style"},message:"must have required property '"+"style"+"'"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
if(data.zIndex === undefined){
const err7 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "zIndex"},message:"must have required property '"+"zIndex"+"'"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
if(data.visible === undefined){
const err8 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "visible"},message:"must have required property '"+"visible"+"'"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
if(data.locked === undefined){
const err9 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "locked"},message:"must have required property '"+"locked"+"'"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
for(const key0 in data){
if(!(func1.call(schema49.properties, key0))){
const err10 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
if(data.id !== undefined){
let data0 = data.id;
if(typeof data0 === "string"){
if(!pattern6.test(data0)){
const err11 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"+"\""};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
else {
const err12 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
if(data.type !== undefined){
let data1 = data.type;
if(!(((((((((data1 === "text") || (data1 === "segment")) || (data1 === "line")) || (data1 === "arrow")) || (data1 === "callout")) || (data1 === "rectangle")) || (data1 === "range-x")) || (data1 === "range-y")) || (data1 === "marker"))){
const err13 = {instancePath:instancePath+"/type",schemaPath:"#/properties/type/enum",keyword:"enum",params:{allowedValues: schema49.properties.type.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
if(data.name !== undefined){
let data2 = data.name;
if(typeof data2 === "string"){
if(func2(data2) > 300){
const err14 = {instancePath:instancePath+"/name",schemaPath:"#/properties/name/maxLength",keyword:"maxLength",params:{limit: 300},message:"must NOT have more than 300 characters"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
else {
const err15 = {instancePath:instancePath+"/name",schemaPath:"#/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
if(data.anchors !== undefined){
let data3 = data.anchors;
if(Array.isArray(data3)){
if(data3.length > 2){
const err16 = {instancePath:instancePath+"/anchors",schemaPath:"#/properties/anchors/maxItems",keyword:"maxItems",params:{limit: 2},message:"must NOT have more than 2 items"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
if(data3.length < 1){
const err17 = {instancePath:instancePath+"/anchors",schemaPath:"#/properties/anchors/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
const len0 = data3.length;
for(let i0=0; i0<len0; i0++){
let data4 = data3[i0];
const _errs11 = errors;
let valid4 = false;
let passing0 = null;
const _errs12 = errors;
if(data4 && typeof data4 == "object" && !Array.isArray(data4)){
if(data4.mode === undefined){
const err18 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/0/required",keyword:"required",params:{missingProperty: "mode"},message:"must have required property '"+"mode"+"'"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
if(data4.x === undefined){
const err19 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/0/required",keyword:"required",params:{missingProperty: "x"},message:"must have required property '"+"x"+"'"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
if(data4.y === undefined){
const err20 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/0/required",keyword:"required",params:{missingProperty: "y"},message:"must have required property '"+"y"+"'"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
for(const key1 in data4){
if(!(((key1 === "mode") || (key1 === "x")) || (key1 === "y"))){
const err21 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/0/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
}
if(data4.mode !== undefined){
if("data" !== data4.mode){
const err22 = {instancePath:instancePath+"/anchors/" + i0+"/mode",schemaPath:"#/$defs/anchor/oneOf/0/properties/mode/const",keyword:"const",params:{allowedValue: "data"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
}
if(data4.x !== undefined){
let data6 = data4.x;
if(!((typeof data6 == "number") && (isFinite(data6)))){
const err23 = {instancePath:instancePath+"/anchors/" + i0+"/x",schemaPath:"#/$defs/anchor/oneOf/0/properties/x/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
}
if(data4.y !== undefined){
let data7 = data4.y;
if(!((typeof data7 == "number") && (isFinite(data7)))){
const err24 = {instancePath:instancePath+"/anchors/" + i0+"/y",schemaPath:"#/$defs/anchor/oneOf/0/properties/y/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
}
}
else {
const err25 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
var _valid0 = _errs12 === errors;
if(_valid0){
valid4 = true;
passing0 = 0;
var props0 = true;
}
const _errs20 = errors;
if(data4 && typeof data4 == "object" && !Array.isArray(data4)){
if(data4.mode === undefined){
const err26 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/1/required",keyword:"required",params:{missingProperty: "mode"},message:"must have required property '"+"mode"+"'"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
if(data4.pageX === undefined){
const err27 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/1/required",keyword:"required",params:{missingProperty: "pageX"},message:"must have required property '"+"pageX"+"'"};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
if(data4.pageY === undefined){
const err28 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/1/required",keyword:"required",params:{missingProperty: "pageY"},message:"must have required property '"+"pageY"+"'"};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
for(const key2 in data4){
if(!(((key2 === "mode") || (key2 === "pageX")) || (key2 === "pageY"))){
const err29 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/1/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key2},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
}
}
if(data4.mode !== undefined){
if("page" !== data4.mode){
const err30 = {instancePath:instancePath+"/anchors/" + i0+"/mode",schemaPath:"#/$defs/anchor/oneOf/1/properties/mode/const",keyword:"const",params:{allowedValue: "page"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err30];
}
else {
vErrors.push(err30);
}
errors++;
}
}
if(data4.pageX !== undefined){
let data9 = data4.pageX;
if((typeof data9 == "number") && (isFinite(data9))){
if(data9 > 1 || isNaN(data9)){
const err31 = {instancePath:instancePath+"/anchors/" + i0+"/pageX",schemaPath:"#/$defs/anchor/oneOf/1/properties/pageX/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1},message:"must be <= 1"};
if(vErrors === null){
vErrors = [err31];
}
else {
vErrors.push(err31);
}
errors++;
}
if(data9 < 0 || isNaN(data9)){
const err32 = {instancePath:instancePath+"/anchors/" + i0+"/pageX",schemaPath:"#/$defs/anchor/oneOf/1/properties/pageX/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err32];
}
else {
vErrors.push(err32);
}
errors++;
}
}
else {
const err33 = {instancePath:instancePath+"/anchors/" + i0+"/pageX",schemaPath:"#/$defs/anchor/oneOf/1/properties/pageX/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err33];
}
else {
vErrors.push(err33);
}
errors++;
}
}
if(data4.pageY !== undefined){
let data10 = data4.pageY;
if((typeof data10 == "number") && (isFinite(data10))){
if(data10 > 1 || isNaN(data10)){
const err34 = {instancePath:instancePath+"/anchors/" + i0+"/pageY",schemaPath:"#/$defs/anchor/oneOf/1/properties/pageY/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1},message:"must be <= 1"};
if(vErrors === null){
vErrors = [err34];
}
else {
vErrors.push(err34);
}
errors++;
}
if(data10 < 0 || isNaN(data10)){
const err35 = {instancePath:instancePath+"/anchors/" + i0+"/pageY",schemaPath:"#/$defs/anchor/oneOf/1/properties/pageY/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err35];
}
else {
vErrors.push(err35);
}
errors++;
}
}
else {
const err36 = {instancePath:instancePath+"/anchors/" + i0+"/pageY",schemaPath:"#/$defs/anchor/oneOf/1/properties/pageY/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err36];
}
else {
vErrors.push(err36);
}
errors++;
}
}
}
else {
const err37 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/1/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err37];
}
else {
vErrors.push(err37);
}
errors++;
}
var _valid0 = _errs20 === errors;
if(_valid0 && valid4){
valid4 = false;
passing0 = [passing0, 1];
}
else {
if(_valid0){
valid4 = true;
passing0 = 1;
if(props0 !== true){
props0 = true;
}
}
const _errs28 = errors;
if(data4 && typeof data4 == "object" && !Array.isArray(data4)){
if(data4.mode === undefined){
const err38 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/2/required",keyword:"required",params:{missingProperty: "mode"},message:"must have required property '"+"mode"+"'"};
if(vErrors === null){
vErrors = [err38];
}
else {
vErrors.push(err38);
}
errors++;
}
if(data4.datasetId === undefined){
const err39 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/2/required",keyword:"required",params:{missingProperty: "datasetId"},message:"must have required property '"+"datasetId"+"'"};
if(vErrors === null){
vErrors = [err39];
}
else {
vErrors.push(err39);
}
errors++;
}
if(data4.pointId === undefined){
const err40 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/2/required",keyword:"required",params:{missingProperty: "pointId"},message:"must have required property '"+"pointId"+"'"};
if(vErrors === null){
vErrors = [err40];
}
else {
vErrors.push(err40);
}
errors++;
}
if(data4.fallbackX === undefined){
const err41 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/2/required",keyword:"required",params:{missingProperty: "fallbackX"},message:"must have required property '"+"fallbackX"+"'"};
if(vErrors === null){
vErrors = [err41];
}
else {
vErrors.push(err41);
}
errors++;
}
if(data4.fallbackY === undefined){
const err42 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/2/required",keyword:"required",params:{missingProperty: "fallbackY"},message:"must have required property '"+"fallbackY"+"'"};
if(vErrors === null){
vErrors = [err42];
}
else {
vErrors.push(err42);
}
errors++;
}
if(data4.offsetXpx === undefined){
const err43 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/2/required",keyword:"required",params:{missingProperty: "offsetXpx"},message:"must have required property '"+"offsetXpx"+"'"};
if(vErrors === null){
vErrors = [err43];
}
else {
vErrors.push(err43);
}
errors++;
}
if(data4.offsetYpx === undefined){
const err44 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/2/required",keyword:"required",params:{missingProperty: "offsetYpx"},message:"must have required property '"+"offsetYpx"+"'"};
if(vErrors === null){
vErrors = [err44];
}
else {
vErrors.push(err44);
}
errors++;
}
for(const key3 in data4){
if(!(((((((key3 === "mode") || (key3 === "datasetId")) || (key3 === "pointId")) || (key3 === "fallbackX")) || (key3 === "fallbackY")) || (key3 === "offsetXpx")) || (key3 === "offsetYpx"))){
const err45 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/2/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key3},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err45];
}
else {
vErrors.push(err45);
}
errors++;
}
}
if(data4.mode !== undefined){
if("point" !== data4.mode){
const err46 = {instancePath:instancePath+"/anchors/" + i0+"/mode",schemaPath:"#/$defs/anchor/oneOf/2/properties/mode/const",keyword:"const",params:{allowedValue: "point"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err46];
}
else {
vErrors.push(err46);
}
errors++;
}
}
if(data4.datasetId !== undefined){
let data12 = data4.datasetId;
if(typeof data12 === "string"){
if(!pattern6.test(data12)){
const err47 = {instancePath:instancePath+"/anchors/" + i0+"/datasetId",schemaPath:"#/$defs/anchor/oneOf/2/properties/datasetId/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"+"\""};
if(vErrors === null){
vErrors = [err47];
}
else {
vErrors.push(err47);
}
errors++;
}
}
else {
const err48 = {instancePath:instancePath+"/anchors/" + i0+"/datasetId",schemaPath:"#/$defs/anchor/oneOf/2/properties/datasetId/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err48];
}
else {
vErrors.push(err48);
}
errors++;
}
}
if(data4.pointId !== undefined){
let data13 = data4.pointId;
if(typeof data13 === "string"){
if(!pattern6.test(data13)){
const err49 = {instancePath:instancePath+"/anchors/" + i0+"/pointId",schemaPath:"#/$defs/anchor/oneOf/2/properties/pointId/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"+"\""};
if(vErrors === null){
vErrors = [err49];
}
else {
vErrors.push(err49);
}
errors++;
}
}
else {
const err50 = {instancePath:instancePath+"/anchors/" + i0+"/pointId",schemaPath:"#/$defs/anchor/oneOf/2/properties/pointId/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err50];
}
else {
vErrors.push(err50);
}
errors++;
}
}
if(data4.fallbackX !== undefined){
let data14 = data4.fallbackX;
if(!((typeof data14 == "number") && (isFinite(data14)))){
const err51 = {instancePath:instancePath+"/anchors/" + i0+"/fallbackX",schemaPath:"#/$defs/anchor/oneOf/2/properties/fallbackX/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err51];
}
else {
vErrors.push(err51);
}
errors++;
}
}
if(data4.fallbackY !== undefined){
let data15 = data4.fallbackY;
if(!((typeof data15 == "number") && (isFinite(data15)))){
const err52 = {instancePath:instancePath+"/anchors/" + i0+"/fallbackY",schemaPath:"#/$defs/anchor/oneOf/2/properties/fallbackY/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err52];
}
else {
vErrors.push(err52);
}
errors++;
}
}
if(data4.offsetXpx !== undefined){
let data16 = data4.offsetXpx;
if(!((typeof data16 == "number") && (isFinite(data16)))){
const err53 = {instancePath:instancePath+"/anchors/" + i0+"/offsetXpx",schemaPath:"#/$defs/anchor/oneOf/2/properties/offsetXpx/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err53];
}
else {
vErrors.push(err53);
}
errors++;
}
}
if(data4.offsetYpx !== undefined){
let data17 = data4.offsetYpx;
if(!((typeof data17 == "number") && (isFinite(data17)))){
const err54 = {instancePath:instancePath+"/anchors/" + i0+"/offsetYpx",schemaPath:"#/$defs/anchor/oneOf/2/properties/offsetYpx/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err54];
}
else {
vErrors.push(err54);
}
errors++;
}
}
}
else {
const err55 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/2/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err55];
}
else {
vErrors.push(err55);
}
errors++;
}
var _valid0 = _errs28 === errors;
if(_valid0 && valid4){
valid4 = false;
passing0 = [passing0, 2];
}
else {
if(_valid0){
valid4 = true;
passing0 = 2;
if(props0 !== true){
props0 = true;
}
}
}
}
if(!valid4){
const err56 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf",keyword:"oneOf",params:{passingSchemas: passing0},message:"must match exactly one schema in oneOf"};
if(vErrors === null){
vErrors = [err56];
}
else {
vErrors.push(err56);
}
errors++;
}
else {
errors = _errs11;
if(vErrors !== null){
if(_errs11){
vErrors.length = _errs11;
}
else {
vErrors = null;
}
}
}
}
}
else {
const err57 = {instancePath:instancePath+"/anchors",schemaPath:"#/properties/anchors/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err57];
}
else {
vErrors.push(err57);
}
errors++;
}
}
if(data.geometry !== undefined){
let data18 = data.geometry;
if(data18 && typeof data18 == "object" && !Array.isArray(data18)){
for(const key4 in data18){
if(!((key4 === "directionX") || (key4 === "directionY"))){
const err58 = {instancePath:instancePath+"/geometry",schemaPath:"#/properties/geometry/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key4},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err58];
}
else {
vErrors.push(err58);
}
errors++;
}
}
if(data18.directionX !== undefined){
let data19 = data18.directionX;
if(!((typeof data19 == "number") && (isFinite(data19)))){
const err59 = {instancePath:instancePath+"/geometry/directionX",schemaPath:"#/properties/geometry/properties/directionX/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err59];
}
else {
vErrors.push(err59);
}
errors++;
}
}
if(data18.directionY !== undefined){
let data20 = data18.directionY;
if(!((typeof data20 == "number") && (isFinite(data20)))){
const err60 = {instancePath:instancePath+"/geometry/directionY",schemaPath:"#/properties/geometry/properties/directionY/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err60];
}
else {
vErrors.push(err60);
}
errors++;
}
}
}
else {
const err61 = {instancePath:instancePath+"/geometry",schemaPath:"#/properties/geometry/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err61];
}
else {
vErrors.push(err61);
}
errors++;
}
}
if(data.text !== undefined){
let data21 = data.text;
if(Array.isArray(data21)){
if(data21.length > 1000){
const err62 = {instancePath:instancePath+"/text",schemaPath:"#/properties/text/maxItems",keyword:"maxItems",params:{limit: 1000},message:"must NOT have more than 1000 items"};
if(vErrors === null){
vErrors = [err62];
}
else {
vErrors.push(err62);
}
errors++;
}
const len1 = data21.length;
for(let i1=0; i1<len1; i1++){
let data22 = data21[i1];
if(data22 && typeof data22 == "object" && !Array.isArray(data22)){
if(data22.text === undefined){
const err63 = {instancePath:instancePath+"/text/" + i1,schemaPath:"#/$defs/textPart/required",keyword:"required",params:{missingProperty: "text"},message:"must have required property '"+"text"+"'"};
if(vErrors === null){
vErrors = [err63];
}
else {
vErrors.push(err63);
}
errors++;
}
if(data22.baseline === undefined){
const err64 = {instancePath:instancePath+"/text/" + i1,schemaPath:"#/$defs/textPart/required",keyword:"required",params:{missingProperty: "baseline"},message:"must have required property '"+"baseline"+"'"};
if(vErrors === null){
vErrors = [err64];
}
else {
vErrors.push(err64);
}
errors++;
}
if(data22.bold === undefined){
const err65 = {instancePath:instancePath+"/text/" + i1,schemaPath:"#/$defs/textPart/required",keyword:"required",params:{missingProperty: "bold"},message:"must have required property '"+"bold"+"'"};
if(vErrors === null){
vErrors = [err65];
}
else {
vErrors.push(err65);
}
errors++;
}
if(data22.italic === undefined){
const err66 = {instancePath:instancePath+"/text/" + i1,schemaPath:"#/$defs/textPart/required",keyword:"required",params:{missingProperty: "italic"},message:"must have required property '"+"italic"+"'"};
if(vErrors === null){
vErrors = [err66];
}
else {
vErrors.push(err66);
}
errors++;
}
for(const key5 in data22){
if(!((((key5 === "text") || (key5 === "baseline")) || (key5 === "bold")) || (key5 === "italic"))){
const err67 = {instancePath:instancePath+"/text/" + i1,schemaPath:"#/$defs/textPart/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key5},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err67];
}
else {
vErrors.push(err67);
}
errors++;
}
}
if(data22.text !== undefined){
let data23 = data22.text;
if(typeof data23 === "string"){
if(func2(data23) > 5000){
const err68 = {instancePath:instancePath+"/text/" + i1+"/text",schemaPath:"#/$defs/textPart/properties/text/maxLength",keyword:"maxLength",params:{limit: 5000},message:"must NOT have more than 5000 characters"};
if(vErrors === null){
vErrors = [err68];
}
else {
vErrors.push(err68);
}
errors++;
}
}
else {
const err69 = {instancePath:instancePath+"/text/" + i1+"/text",schemaPath:"#/$defs/textPart/properties/text/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err69];
}
else {
vErrors.push(err69);
}
errors++;
}
}
if(data22.baseline !== undefined){
let data24 = data22.baseline;
if(!(((data24 === "normal") || (data24 === "sub")) || (data24 === "super"))){
const err70 = {instancePath:instancePath+"/text/" + i1+"/baseline",schemaPath:"#/$defs/textPart/properties/baseline/enum",keyword:"enum",params:{allowedValues: schema51.properties.baseline.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err70];
}
else {
vErrors.push(err70);
}
errors++;
}
}
if(data22.bold !== undefined){
if(typeof data22.bold !== "boolean"){
const err71 = {instancePath:instancePath+"/text/" + i1+"/bold",schemaPath:"#/$defs/textPart/properties/bold/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err71];
}
else {
vErrors.push(err71);
}
errors++;
}
}
if(data22.italic !== undefined){
if(typeof data22.italic !== "boolean"){
const err72 = {instancePath:instancePath+"/text/" + i1+"/italic",schemaPath:"#/$defs/textPart/properties/italic/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err72];
}
else {
vErrors.push(err72);
}
errors++;
}
}
}
else {
const err73 = {instancePath:instancePath+"/text/" + i1,schemaPath:"#/$defs/textPart/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err73];
}
else {
vErrors.push(err73);
}
errors++;
}
}
}
else {
const err74 = {instancePath:instancePath+"/text",schemaPath:"#/properties/text/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err74];
}
else {
vErrors.push(err74);
}
errors++;
}
}
if(data.style !== undefined){
let data27 = data.style;
if(data27 && typeof data27 == "object" && !Array.isArray(data27)){
if(data27.stroke === undefined){
const err75 = {instancePath:instancePath+"/style",schemaPath:"#/properties/style/required",keyword:"required",params:{missingProperty: "stroke"},message:"must have required property '"+"stroke"+"'"};
if(vErrors === null){
vErrors = [err75];
}
else {
vErrors.push(err75);
}
errors++;
}
if(data27.strokeWidthPt === undefined){
const err76 = {instancePath:instancePath+"/style",schemaPath:"#/properties/style/required",keyword:"required",params:{missingProperty: "strokeWidthPt"},message:"must have required property '"+"strokeWidthPt"+"'"};
if(vErrors === null){
vErrors = [err76];
}
else {
vErrors.push(err76);
}
errors++;
}
if(data27.dash === undefined){
const err77 = {instancePath:instancePath+"/style",schemaPath:"#/properties/style/required",keyword:"required",params:{missingProperty: "dash"},message:"must have required property '"+"dash"+"'"};
if(vErrors === null){
vErrors = [err77];
}
else {
vErrors.push(err77);
}
errors++;
}
if(data27.strokeOpacity === undefined){
const err78 = {instancePath:instancePath+"/style",schemaPath:"#/properties/style/required",keyword:"required",params:{missingProperty: "strokeOpacity"},message:"must have required property '"+"strokeOpacity"+"'"};
if(vErrors === null){
vErrors = [err78];
}
else {
vErrors.push(err78);
}
errors++;
}
if(data27.fill === undefined){
const err79 = {instancePath:instancePath+"/style",schemaPath:"#/properties/style/required",keyword:"required",params:{missingProperty: "fill"},message:"must have required property '"+"fill"+"'"};
if(vErrors === null){
vErrors = [err79];
}
else {
vErrors.push(err79);
}
errors++;
}
if(data27.fillOpacity === undefined){
const err80 = {instancePath:instancePath+"/style",schemaPath:"#/properties/style/required",keyword:"required",params:{missingProperty: "fillOpacity"},message:"must have required property '"+"fillOpacity"+"'"};
if(vErrors === null){
vErrors = [err80];
}
else {
vErrors.push(err80);
}
errors++;
}
if(data27.fontSizePt === undefined){
const err81 = {instancePath:instancePath+"/style",schemaPath:"#/properties/style/required",keyword:"required",params:{missingProperty: "fontSizePt"},message:"must have required property '"+"fontSizePt"+"'"};
if(vErrors === null){
vErrors = [err81];
}
else {
vErrors.push(err81);
}
errors++;
}
if(data27.fontFamily === undefined){
const err82 = {instancePath:instancePath+"/style",schemaPath:"#/properties/style/required",keyword:"required",params:{missingProperty: "fontFamily"},message:"must have required property '"+"fontFamily"+"'"};
if(vErrors === null){
vErrors = [err82];
}
else {
vErrors.push(err82);
}
errors++;
}
if(data27.arrowHead === undefined){
const err83 = {instancePath:instancePath+"/style",schemaPath:"#/properties/style/required",keyword:"required",params:{missingProperty: "arrowHead"},message:"must have required property '"+"arrowHead"+"'"};
if(vErrors === null){
vErrors = [err83];
}
else {
vErrors.push(err83);
}
errors++;
}
if(data27.markerShape === undefined){
const err84 = {instancePath:instancePath+"/style",schemaPath:"#/properties/style/required",keyword:"required",params:{missingProperty: "markerShape"},message:"must have required property '"+"markerShape"+"'"};
if(vErrors === null){
vErrors = [err84];
}
else {
vErrors.push(err84);
}
errors++;
}
if(data27.markerSizePt === undefined){
const err85 = {instancePath:instancePath+"/style",schemaPath:"#/properties/style/required",keyword:"required",params:{missingProperty: "markerSizePt"},message:"must have required property '"+"markerSizePt"+"'"};
if(vErrors === null){
vErrors = [err85];
}
else {
vErrors.push(err85);
}
errors++;
}
for(const key6 in data27){
if(!(func1.call(schema49.properties.style.properties, key6))){
const err86 = {instancePath:instancePath+"/style",schemaPath:"#/properties/style/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key6},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err86];
}
else {
vErrors.push(err86);
}
errors++;
}
}
if(data27.stroke !== undefined){
let data28 = data27.stroke;
if(typeof data28 === "string"){
if(!pattern7.test(data28)){
const err87 = {instancePath:instancePath+"/style/stroke",schemaPath:"#/properties/style/properties/stroke/pattern",keyword:"pattern",params:{pattern: "^#[0-9A-Fa-f]{6}$"},message:"must match pattern \""+"^#[0-9A-Fa-f]{6}$"+"\""};
if(vErrors === null){
vErrors = [err87];
}
else {
vErrors.push(err87);
}
errors++;
}
}
else {
const err88 = {instancePath:instancePath+"/style/stroke",schemaPath:"#/properties/style/properties/stroke/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err88];
}
else {
vErrors.push(err88);
}
errors++;
}
}
if(data27.strokeWidthPt !== undefined){
let data29 = data27.strokeWidthPt;
if((typeof data29 == "number") && (isFinite(data29))){
if(data29 > 24 || isNaN(data29)){
const err89 = {instancePath:instancePath+"/style/strokeWidthPt",schemaPath:"#/properties/style/properties/strokeWidthPt/maximum",keyword:"maximum",params:{comparison: "<=", limit: 24},message:"must be <= 24"};
if(vErrors === null){
vErrors = [err89];
}
else {
vErrors.push(err89);
}
errors++;
}
if(data29 <= 0 || isNaN(data29)){
const err90 = {instancePath:instancePath+"/style/strokeWidthPt",schemaPath:"#/properties/style/properties/strokeWidthPt/exclusiveMinimum",keyword:"exclusiveMinimum",params:{comparison: ">", limit: 0},message:"must be > 0"};
if(vErrors === null){
vErrors = [err90];
}
else {
vErrors.push(err90);
}
errors++;
}
}
else {
const err91 = {instancePath:instancePath+"/style/strokeWidthPt",schemaPath:"#/properties/style/properties/strokeWidthPt/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err91];
}
else {
vErrors.push(err91);
}
errors++;
}
}
if(data27.dash !== undefined){
let data30 = data27.dash;
if(!((((data30 === "solid") || (data30 === "dash")) || (data30 === "dot")) || (data30 === "dash-dot"))){
const err92 = {instancePath:instancePath+"/style/dash",schemaPath:"#/properties/style/properties/dash/enum",keyword:"enum",params:{allowedValues: schema49.properties.style.properties.dash.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err92];
}
else {
vErrors.push(err92);
}
errors++;
}
}
if(data27.strokeOpacity !== undefined){
let data31 = data27.strokeOpacity;
if((typeof data31 == "number") && (isFinite(data31))){
if(data31 > 1 || isNaN(data31)){
const err93 = {instancePath:instancePath+"/style/strokeOpacity",schemaPath:"#/properties/style/properties/strokeOpacity/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1},message:"must be <= 1"};
if(vErrors === null){
vErrors = [err93];
}
else {
vErrors.push(err93);
}
errors++;
}
if(data31 < 0 || isNaN(data31)){
const err94 = {instancePath:instancePath+"/style/strokeOpacity",schemaPath:"#/properties/style/properties/strokeOpacity/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err94];
}
else {
vErrors.push(err94);
}
errors++;
}
}
else {
const err95 = {instancePath:instancePath+"/style/strokeOpacity",schemaPath:"#/properties/style/properties/strokeOpacity/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err95];
}
else {
vErrors.push(err95);
}
errors++;
}
}
if(data27.fill !== undefined){
let data32 = data27.fill;
if(typeof data32 === "string"){
if(!pattern7.test(data32)){
const err96 = {instancePath:instancePath+"/style/fill",schemaPath:"#/properties/style/properties/fill/pattern",keyword:"pattern",params:{pattern: "^#[0-9A-Fa-f]{6}$"},message:"must match pattern \""+"^#[0-9A-Fa-f]{6}$"+"\""};
if(vErrors === null){
vErrors = [err96];
}
else {
vErrors.push(err96);
}
errors++;
}
}
else {
const err97 = {instancePath:instancePath+"/style/fill",schemaPath:"#/properties/style/properties/fill/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err97];
}
else {
vErrors.push(err97);
}
errors++;
}
}
if(data27.fillOpacity !== undefined){
let data33 = data27.fillOpacity;
if((typeof data33 == "number") && (isFinite(data33))){
if(data33 > 1 || isNaN(data33)){
const err98 = {instancePath:instancePath+"/style/fillOpacity",schemaPath:"#/properties/style/properties/fillOpacity/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1},message:"must be <= 1"};
if(vErrors === null){
vErrors = [err98];
}
else {
vErrors.push(err98);
}
errors++;
}
if(data33 < 0 || isNaN(data33)){
const err99 = {instancePath:instancePath+"/style/fillOpacity",schemaPath:"#/properties/style/properties/fillOpacity/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err99];
}
else {
vErrors.push(err99);
}
errors++;
}
}
else {
const err100 = {instancePath:instancePath+"/style/fillOpacity",schemaPath:"#/properties/style/properties/fillOpacity/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err100];
}
else {
vErrors.push(err100);
}
errors++;
}
}
if(data27.fontSizePt !== undefined){
let data34 = data27.fontSizePt;
if((typeof data34 == "number") && (isFinite(data34))){
if(data34 > 72 || isNaN(data34)){
const err101 = {instancePath:instancePath+"/style/fontSizePt",schemaPath:"#/properties/style/properties/fontSizePt/maximum",keyword:"maximum",params:{comparison: "<=", limit: 72},message:"must be <= 72"};
if(vErrors === null){
vErrors = [err101];
}
else {
vErrors.push(err101);
}
errors++;
}
if(data34 < 6 || isNaN(data34)){
const err102 = {instancePath:instancePath+"/style/fontSizePt",schemaPath:"#/properties/style/properties/fontSizePt/minimum",keyword:"minimum",params:{comparison: ">=", limit: 6},message:"must be >= 6"};
if(vErrors === null){
vErrors = [err102];
}
else {
vErrors.push(err102);
}
errors++;
}
}
else {
const err103 = {instancePath:instancePath+"/style/fontSizePt",schemaPath:"#/properties/style/properties/fontSizePt/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err103];
}
else {
vErrors.push(err103);
}
errors++;
}
}
if(data27.fontFamily !== undefined){
if("Courier New" !== data27.fontFamily){
const err104 = {instancePath:instancePath+"/style/fontFamily",schemaPath:"#/properties/style/properties/fontFamily/const",keyword:"const",params:{allowedValue: "Courier New"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err104];
}
else {
vErrors.push(err104);
}
errors++;
}
}
if(data27.arrowHead !== undefined){
let data36 = data27.arrowHead;
if(!((((data36 === "none") || (data36 === "start")) || (data36 === "end")) || (data36 === "both"))){
const err105 = {instancePath:instancePath+"/style/arrowHead",schemaPath:"#/properties/style/properties/arrowHead/enum",keyword:"enum",params:{allowedValues: schema49.properties.style.properties.arrowHead.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err105];
}
else {
vErrors.push(err105);
}
errors++;
}
}
if(data27.markerShape !== undefined){
let data37 = data27.markerShape;
if(!((((((data37 === "circle") || (data37 === "square")) || (data37 === "triangle")) || (data37 === "diamond")) || (data37 === "cross")) || (data37 === "plus"))){
const err106 = {instancePath:instancePath+"/style/markerShape",schemaPath:"#/properties/style/properties/markerShape/enum",keyword:"enum",params:{allowedValues: schema49.properties.style.properties.markerShape.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err106];
}
else {
vErrors.push(err106);
}
errors++;
}
}
if(data27.markerSizePt !== undefined){
let data38 = data27.markerSizePt;
if((typeof data38 == "number") && (isFinite(data38))){
if(data38 > 32 || isNaN(data38)){
const err107 = {instancePath:instancePath+"/style/markerSizePt",schemaPath:"#/properties/style/properties/markerSizePt/maximum",keyword:"maximum",params:{comparison: "<=", limit: 32},message:"must be <= 32"};
if(vErrors === null){
vErrors = [err107];
}
else {
vErrors.push(err107);
}
errors++;
}
if(data38 < 0 || isNaN(data38)){
const err108 = {instancePath:instancePath+"/style/markerSizePt",schemaPath:"#/properties/style/properties/markerSizePt/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err108];
}
else {
vErrors.push(err108);
}
errors++;
}
}
else {
const err109 = {instancePath:instancePath+"/style/markerSizePt",schemaPath:"#/properties/style/properties/markerSizePt/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err109];
}
else {
vErrors.push(err109);
}
errors++;
}
}
}
else {
const err110 = {instancePath:instancePath+"/style",schemaPath:"#/properties/style/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err110];
}
else {
vErrors.push(err110);
}
errors++;
}
}
if(data.zIndex !== undefined){
let data39 = data.zIndex;
if(!(((typeof data39 == "number") && (!(data39 % 1) && !isNaN(data39))) && (isFinite(data39)))){
const err111 = {instancePath:instancePath+"/zIndex",schemaPath:"#/properties/zIndex/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err111];
}
else {
vErrors.push(err111);
}
errors++;
}
}
if(data.visible !== undefined){
if(typeof data.visible !== "boolean"){
const err112 = {instancePath:instancePath+"/visible",schemaPath:"#/properties/visible/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err112];
}
else {
vErrors.push(err112);
}
errors++;
}
}
if(data.locked !== undefined){
if(typeof data.locked !== "boolean"){
const err113 = {instancePath:instancePath+"/locked",schemaPath:"#/properties/locked/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err113];
}
else {
vErrors.push(err113);
}
errors++;
}
}
}
else {
const err114 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err114];
}
else {
vErrors.push(err114);
}
errors++;
}
validate30.errors = vErrors;
return errors === 0;
}
validate30.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema52 = {"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"kind":{"enum":["linear-fit","polynomial-fit","exponential-fit","power-fit","savitzky-golay","moving-average","derivative","integral","interpolation","statistics","baseline","peaks","area"]},"sourceDatasetIds":{"type":"array","items":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"minItems":1},"resultDatasetId":{"anyOf":[{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},{"type":"null"}]},"parameters":{"type":"object","maxProperties":60,"additionalProperties":{"type":["string","number","integer","boolean","null","array","object"]}},"algorithmVersion":{"type":"integer","minimum":1},"status":{"enum":["valid","outdated","invalid"]},"summary":{"type":"object","maxProperties":60,"additionalProperties":{"type":["string","number","integer","boolean","null"]}},"data":{"type":"object","additionalProperties":false,"properties":{"peaks":{"type":"array","maxItems":1000000,"items":{"$ref":"#/$defs/peakMeasurement"}}}},"display":{"type":"object","additionalProperties":false,"properties":{"visible":{"type":"boolean"},"stroke":{"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"},"opacity":{"type":"number","minimum":0,"maximum":1},"label":{"type":"boolean"}},"required":["visible","stroke","opacity","label"]}},"required":["id","kind","sourceDatasetIds","resultDatasetId","parameters","algorithmVersion","status","summary"]};
const schema53 = {"type":"object","additionalProperties":false,"properties":{"index":{"type":"integer","minimum":0},"x":{"type":"number"},"y":{"type":"number"},"direction":{"enum":["max","min"]},"prominence":{"type":["number","null"],"minimum":0},"width":{"type":["number","null"],"minimum":0},"left":{"type":["number","null"]},"right":{"type":["number","null"]},"level":{"type":["number","null"]},"incomplete":{"type":"boolean"}},"required":["index","x","y","direction","prominence","width","left","right","level","incomplete"]};

function validate32(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate32.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.id === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.kind === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "kind"},message:"must have required property '"+"kind"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.sourceDatasetIds === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "sourceDatasetIds"},message:"must have required property '"+"sourceDatasetIds"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.resultDatasetId === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "resultDatasetId"},message:"must have required property '"+"resultDatasetId"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.parameters === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "parameters"},message:"must have required property '"+"parameters"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data.algorithmVersion === undefined){
const err5 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "algorithmVersion"},message:"must have required property '"+"algorithmVersion"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data.status === undefined){
const err6 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "status"},message:"must have required property '"+"status"+"'"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
if(data.summary === undefined){
const err7 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "summary"},message:"must have required property '"+"summary"+"'"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
for(const key0 in data){
if(!(func1.call(schema52.properties, key0))){
const err8 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
if(data.id !== undefined){
let data0 = data.id;
if(typeof data0 === "string"){
if(!pattern6.test(data0)){
const err9 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"+"\""};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
else {
const err10 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
if(data.kind !== undefined){
let data1 = data.kind;
if(!(((((((((((((data1 === "linear-fit") || (data1 === "polynomial-fit")) || (data1 === "exponential-fit")) || (data1 === "power-fit")) || (data1 === "savitzky-golay")) || (data1 === "moving-average")) || (data1 === "derivative")) || (data1 === "integral")) || (data1 === "interpolation")) || (data1 === "statistics")) || (data1 === "baseline")) || (data1 === "peaks")) || (data1 === "area"))){
const err11 = {instancePath:instancePath+"/kind",schemaPath:"#/properties/kind/enum",keyword:"enum",params:{allowedValues: schema52.properties.kind.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
if(data.sourceDatasetIds !== undefined){
let data2 = data.sourceDatasetIds;
if(Array.isArray(data2)){
if(data2.length < 1){
const err12 = {instancePath:instancePath+"/sourceDatasetIds",schemaPath:"#/properties/sourceDatasetIds/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
const len0 = data2.length;
for(let i0=0; i0<len0; i0++){
let data3 = data2[i0];
if(typeof data3 === "string"){
if(!pattern6.test(data3)){
const err13 = {instancePath:instancePath+"/sourceDatasetIds/" + i0,schemaPath:"#/properties/sourceDatasetIds/items/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"+"\""};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
else {
const err14 = {instancePath:instancePath+"/sourceDatasetIds/" + i0,schemaPath:"#/properties/sourceDatasetIds/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
}
else {
const err15 = {instancePath:instancePath+"/sourceDatasetIds",schemaPath:"#/properties/sourceDatasetIds/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
if(data.resultDatasetId !== undefined){
let data4 = data.resultDatasetId;
const _errs10 = errors;
let valid3 = false;
const _errs11 = errors;
if(typeof data4 === "string"){
if(!pattern6.test(data4)){
const err16 = {instancePath:instancePath+"/resultDatasetId",schemaPath:"#/properties/resultDatasetId/anyOf/0/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"+"\""};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
}
else {
const err17 = {instancePath:instancePath+"/resultDatasetId",schemaPath:"#/properties/resultDatasetId/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
var _valid0 = _errs11 === errors;
valid3 = valid3 || _valid0;
const _errs13 = errors;
if(data4 !== null){
const err18 = {instancePath:instancePath+"/resultDatasetId",schemaPath:"#/properties/resultDatasetId/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
var _valid0 = _errs13 === errors;
valid3 = valid3 || _valid0;
if(!valid3){
const err19 = {instancePath:instancePath+"/resultDatasetId",schemaPath:"#/properties/resultDatasetId/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
else {
errors = _errs10;
if(vErrors !== null){
if(_errs10){
vErrors.length = _errs10;
}
else {
vErrors = null;
}
}
}
}
if(data.parameters !== undefined){
let data5 = data.parameters;
if(data5 && typeof data5 == "object" && !Array.isArray(data5)){
if(Object.keys(data5).length > 60){
const err20 = {instancePath:instancePath+"/parameters",schemaPath:"#/properties/parameters/maxProperties",keyword:"maxProperties",params:{limit: 60},message:"must NOT have more than 60 properties"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
for(const key1 in data5){
let data6 = data5[key1];
if((((typeof data6 != "object") && (typeof data6 !== "string")) && (!((typeof data6 == "number") && (isFinite(data6))))) && (typeof data6 !== "boolean")){
const err21 = {instancePath:instancePath+"/parameters/" + key1.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/properties/parameters/additionalProperties/type",keyword:"type",params:{type: schema52.properties.parameters.additionalProperties.type},message:"must be string,number,integer,boolean,null,array,object"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
}
}
else {
const err22 = {instancePath:instancePath+"/parameters",schemaPath:"#/properties/parameters/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
}
if(data.algorithmVersion !== undefined){
let data7 = data.algorithmVersion;
if(!(((typeof data7 == "number") && (!(data7 % 1) && !isNaN(data7))) && (isFinite(data7)))){
const err23 = {instancePath:instancePath+"/algorithmVersion",schemaPath:"#/properties/algorithmVersion/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
if((typeof data7 == "number") && (isFinite(data7))){
if(data7 < 1 || isNaN(data7)){
const err24 = {instancePath:instancePath+"/algorithmVersion",schemaPath:"#/properties/algorithmVersion/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
}
}
if(data.status !== undefined){
let data8 = data.status;
if(!(((data8 === "valid") || (data8 === "outdated")) || (data8 === "invalid"))){
const err25 = {instancePath:instancePath+"/status",schemaPath:"#/properties/status/enum",keyword:"enum",params:{allowedValues: schema52.properties.status.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
}
if(data.summary !== undefined){
let data9 = data.summary;
if(data9 && typeof data9 == "object" && !Array.isArray(data9)){
if(Object.keys(data9).length > 60){
const err26 = {instancePath:instancePath+"/summary",schemaPath:"#/properties/summary/maxProperties",keyword:"maxProperties",params:{limit: 60},message:"must NOT have more than 60 properties"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
for(const key2 in data9){
let data10 = data9[key2];
if((((typeof data10 !== "string") && (!((typeof data10 == "number") && (isFinite(data10))))) && (typeof data10 !== "boolean")) && (data10 !== null)){
const err27 = {instancePath:instancePath+"/summary/" + key2.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/properties/summary/additionalProperties/type",keyword:"type",params:{type: schema52.properties.summary.additionalProperties.type},message:"must be string,number,integer,boolean,null"};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
}
}
else {
const err28 = {instancePath:instancePath+"/summary",schemaPath:"#/properties/summary/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
}
if(data.data !== undefined){
let data11 = data.data;
if(data11 && typeof data11 == "object" && !Array.isArray(data11)){
for(const key3 in data11){
if(!(key3 === "peaks")){
const err29 = {instancePath:instancePath+"/data",schemaPath:"#/properties/data/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key3},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
}
}
if(data11.peaks !== undefined){
let data12 = data11.peaks;
if(Array.isArray(data12)){
if(data12.length > 1000000){
const err30 = {instancePath:instancePath+"/data/peaks",schemaPath:"#/properties/data/properties/peaks/maxItems",keyword:"maxItems",params:{limit: 1000000},message:"must NOT have more than 1000000 items"};
if(vErrors === null){
vErrors = [err30];
}
else {
vErrors.push(err30);
}
errors++;
}
const len1 = data12.length;
for(let i1=0; i1<len1; i1++){
let data13 = data12[i1];
if(data13 && typeof data13 == "object" && !Array.isArray(data13)){
if(data13.index === undefined){
const err31 = {instancePath:instancePath+"/data/peaks/" + i1,schemaPath:"#/$defs/peakMeasurement/required",keyword:"required",params:{missingProperty: "index"},message:"must have required property '"+"index"+"'"};
if(vErrors === null){
vErrors = [err31];
}
else {
vErrors.push(err31);
}
errors++;
}
if(data13.x === undefined){
const err32 = {instancePath:instancePath+"/data/peaks/" + i1,schemaPath:"#/$defs/peakMeasurement/required",keyword:"required",params:{missingProperty: "x"},message:"must have required property '"+"x"+"'"};
if(vErrors === null){
vErrors = [err32];
}
else {
vErrors.push(err32);
}
errors++;
}
if(data13.y === undefined){
const err33 = {instancePath:instancePath+"/data/peaks/" + i1,schemaPath:"#/$defs/peakMeasurement/required",keyword:"required",params:{missingProperty: "y"},message:"must have required property '"+"y"+"'"};
if(vErrors === null){
vErrors = [err33];
}
else {
vErrors.push(err33);
}
errors++;
}
if(data13.direction === undefined){
const err34 = {instancePath:instancePath+"/data/peaks/" + i1,schemaPath:"#/$defs/peakMeasurement/required",keyword:"required",params:{missingProperty: "direction"},message:"must have required property '"+"direction"+"'"};
if(vErrors === null){
vErrors = [err34];
}
else {
vErrors.push(err34);
}
errors++;
}
if(data13.prominence === undefined){
const err35 = {instancePath:instancePath+"/data/peaks/" + i1,schemaPath:"#/$defs/peakMeasurement/required",keyword:"required",params:{missingProperty: "prominence"},message:"must have required property '"+"prominence"+"'"};
if(vErrors === null){
vErrors = [err35];
}
else {
vErrors.push(err35);
}
errors++;
}
if(data13.width === undefined){
const err36 = {instancePath:instancePath+"/data/peaks/" + i1,schemaPath:"#/$defs/peakMeasurement/required",keyword:"required",params:{missingProperty: "width"},message:"must have required property '"+"width"+"'"};
if(vErrors === null){
vErrors = [err36];
}
else {
vErrors.push(err36);
}
errors++;
}
if(data13.left === undefined){
const err37 = {instancePath:instancePath+"/data/peaks/" + i1,schemaPath:"#/$defs/peakMeasurement/required",keyword:"required",params:{missingProperty: "left"},message:"must have required property '"+"left"+"'"};
if(vErrors === null){
vErrors = [err37];
}
else {
vErrors.push(err37);
}
errors++;
}
if(data13.right === undefined){
const err38 = {instancePath:instancePath+"/data/peaks/" + i1,schemaPath:"#/$defs/peakMeasurement/required",keyword:"required",params:{missingProperty: "right"},message:"must have required property '"+"right"+"'"};
if(vErrors === null){
vErrors = [err38];
}
else {
vErrors.push(err38);
}
errors++;
}
if(data13.level === undefined){
const err39 = {instancePath:instancePath+"/data/peaks/" + i1,schemaPath:"#/$defs/peakMeasurement/required",keyword:"required",params:{missingProperty: "level"},message:"must have required property '"+"level"+"'"};
if(vErrors === null){
vErrors = [err39];
}
else {
vErrors.push(err39);
}
errors++;
}
if(data13.incomplete === undefined){
const err40 = {instancePath:instancePath+"/data/peaks/" + i1,schemaPath:"#/$defs/peakMeasurement/required",keyword:"required",params:{missingProperty: "incomplete"},message:"must have required property '"+"incomplete"+"'"};
if(vErrors === null){
vErrors = [err40];
}
else {
vErrors.push(err40);
}
errors++;
}
for(const key4 in data13){
if(!(func1.call(schema53.properties, key4))){
const err41 = {instancePath:instancePath+"/data/peaks/" + i1,schemaPath:"#/$defs/peakMeasurement/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key4},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err41];
}
else {
vErrors.push(err41);
}
errors++;
}
}
if(data13.index !== undefined){
let data14 = data13.index;
if(!(((typeof data14 == "number") && (!(data14 % 1) && !isNaN(data14))) && (isFinite(data14)))){
const err42 = {instancePath:instancePath+"/data/peaks/" + i1+"/index",schemaPath:"#/$defs/peakMeasurement/properties/index/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err42];
}
else {
vErrors.push(err42);
}
errors++;
}
if((typeof data14 == "number") && (isFinite(data14))){
if(data14 < 0 || isNaN(data14)){
const err43 = {instancePath:instancePath+"/data/peaks/" + i1+"/index",schemaPath:"#/$defs/peakMeasurement/properties/index/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err43];
}
else {
vErrors.push(err43);
}
errors++;
}
}
}
if(data13.x !== undefined){
let data15 = data13.x;
if(!((typeof data15 == "number") && (isFinite(data15)))){
const err44 = {instancePath:instancePath+"/data/peaks/" + i1+"/x",schemaPath:"#/$defs/peakMeasurement/properties/x/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err44];
}
else {
vErrors.push(err44);
}
errors++;
}
}
if(data13.y !== undefined){
let data16 = data13.y;
if(!((typeof data16 == "number") && (isFinite(data16)))){
const err45 = {instancePath:instancePath+"/data/peaks/" + i1+"/y",schemaPath:"#/$defs/peakMeasurement/properties/y/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err45];
}
else {
vErrors.push(err45);
}
errors++;
}
}
if(data13.direction !== undefined){
let data17 = data13.direction;
if(!((data17 === "max") || (data17 === "min"))){
const err46 = {instancePath:instancePath+"/data/peaks/" + i1+"/direction",schemaPath:"#/$defs/peakMeasurement/properties/direction/enum",keyword:"enum",params:{allowedValues: schema53.properties.direction.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err46];
}
else {
vErrors.push(err46);
}
errors++;
}
}
if(data13.prominence !== undefined){
let data18 = data13.prominence;
if((!((typeof data18 == "number") && (isFinite(data18)))) && (data18 !== null)){
const err47 = {instancePath:instancePath+"/data/peaks/" + i1+"/prominence",schemaPath:"#/$defs/peakMeasurement/properties/prominence/type",keyword:"type",params:{type: schema53.properties.prominence.type},message:"must be number,null"};
if(vErrors === null){
vErrors = [err47];
}
else {
vErrors.push(err47);
}
errors++;
}
if((typeof data18 == "number") && (isFinite(data18))){
if(data18 < 0 || isNaN(data18)){
const err48 = {instancePath:instancePath+"/data/peaks/" + i1+"/prominence",schemaPath:"#/$defs/peakMeasurement/properties/prominence/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err48];
}
else {
vErrors.push(err48);
}
errors++;
}
}
}
if(data13.width !== undefined){
let data19 = data13.width;
if((!((typeof data19 == "number") && (isFinite(data19)))) && (data19 !== null)){
const err49 = {instancePath:instancePath+"/data/peaks/" + i1+"/width",schemaPath:"#/$defs/peakMeasurement/properties/width/type",keyword:"type",params:{type: schema53.properties.width.type},message:"must be number,null"};
if(vErrors === null){
vErrors = [err49];
}
else {
vErrors.push(err49);
}
errors++;
}
if((typeof data19 == "number") && (isFinite(data19))){
if(data19 < 0 || isNaN(data19)){
const err50 = {instancePath:instancePath+"/data/peaks/" + i1+"/width",schemaPath:"#/$defs/peakMeasurement/properties/width/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err50];
}
else {
vErrors.push(err50);
}
errors++;
}
}
}
if(data13.left !== undefined){
let data20 = data13.left;
if((!((typeof data20 == "number") && (isFinite(data20)))) && (data20 !== null)){
const err51 = {instancePath:instancePath+"/data/peaks/" + i1+"/left",schemaPath:"#/$defs/peakMeasurement/properties/left/type",keyword:"type",params:{type: schema53.properties.left.type},message:"must be number,null"};
if(vErrors === null){
vErrors = [err51];
}
else {
vErrors.push(err51);
}
errors++;
}
}
if(data13.right !== undefined){
let data21 = data13.right;
if((!((typeof data21 == "number") && (isFinite(data21)))) && (data21 !== null)){
const err52 = {instancePath:instancePath+"/data/peaks/" + i1+"/right",schemaPath:"#/$defs/peakMeasurement/properties/right/type",keyword:"type",params:{type: schema53.properties.right.type},message:"must be number,null"};
if(vErrors === null){
vErrors = [err52];
}
else {
vErrors.push(err52);
}
errors++;
}
}
if(data13.level !== undefined){
let data22 = data13.level;
if((!((typeof data22 == "number") && (isFinite(data22)))) && (data22 !== null)){
const err53 = {instancePath:instancePath+"/data/peaks/" + i1+"/level",schemaPath:"#/$defs/peakMeasurement/properties/level/type",keyword:"type",params:{type: schema53.properties.level.type},message:"must be number,null"};
if(vErrors === null){
vErrors = [err53];
}
else {
vErrors.push(err53);
}
errors++;
}
}
if(data13.incomplete !== undefined){
if(typeof data13.incomplete !== "boolean"){
const err54 = {instancePath:instancePath+"/data/peaks/" + i1+"/incomplete",schemaPath:"#/$defs/peakMeasurement/properties/incomplete/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err54];
}
else {
vErrors.push(err54);
}
errors++;
}
}
}
else {
const err55 = {instancePath:instancePath+"/data/peaks/" + i1,schemaPath:"#/$defs/peakMeasurement/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err55];
}
else {
vErrors.push(err55);
}
errors++;
}
}
}
else {
const err56 = {instancePath:instancePath+"/data/peaks",schemaPath:"#/properties/data/properties/peaks/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err56];
}
else {
vErrors.push(err56);
}
errors++;
}
}
}
else {
const err57 = {instancePath:instancePath+"/data",schemaPath:"#/properties/data/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err57];
}
else {
vErrors.push(err57);
}
errors++;
}
}
if(data.display !== undefined){
let data24 = data.display;
if(data24 && typeof data24 == "object" && !Array.isArray(data24)){
if(data24.visible === undefined){
const err58 = {instancePath:instancePath+"/display",schemaPath:"#/properties/display/required",keyword:"required",params:{missingProperty: "visible"},message:"must have required property '"+"visible"+"'"};
if(vErrors === null){
vErrors = [err58];
}
else {
vErrors.push(err58);
}
errors++;
}
if(data24.stroke === undefined){
const err59 = {instancePath:instancePath+"/display",schemaPath:"#/properties/display/required",keyword:"required",params:{missingProperty: "stroke"},message:"must have required property '"+"stroke"+"'"};
if(vErrors === null){
vErrors = [err59];
}
else {
vErrors.push(err59);
}
errors++;
}
if(data24.opacity === undefined){
const err60 = {instancePath:instancePath+"/display",schemaPath:"#/properties/display/required",keyword:"required",params:{missingProperty: "opacity"},message:"must have required property '"+"opacity"+"'"};
if(vErrors === null){
vErrors = [err60];
}
else {
vErrors.push(err60);
}
errors++;
}
if(data24.label === undefined){
const err61 = {instancePath:instancePath+"/display",schemaPath:"#/properties/display/required",keyword:"required",params:{missingProperty: "label"},message:"must have required property '"+"label"+"'"};
if(vErrors === null){
vErrors = [err61];
}
else {
vErrors.push(err61);
}
errors++;
}
for(const key5 in data24){
if(!((((key5 === "visible") || (key5 === "stroke")) || (key5 === "opacity")) || (key5 === "label"))){
const err62 = {instancePath:instancePath+"/display",schemaPath:"#/properties/display/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key5},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err62];
}
else {
vErrors.push(err62);
}
errors++;
}
}
if(data24.visible !== undefined){
if(typeof data24.visible !== "boolean"){
const err63 = {instancePath:instancePath+"/display/visible",schemaPath:"#/properties/display/properties/visible/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err63];
}
else {
vErrors.push(err63);
}
errors++;
}
}
if(data24.stroke !== undefined){
let data26 = data24.stroke;
if(typeof data26 === "string"){
if(!pattern7.test(data26)){
const err64 = {instancePath:instancePath+"/display/stroke",schemaPath:"#/properties/display/properties/stroke/pattern",keyword:"pattern",params:{pattern: "^#[0-9A-Fa-f]{6}$"},message:"must match pattern \""+"^#[0-9A-Fa-f]{6}$"+"\""};
if(vErrors === null){
vErrors = [err64];
}
else {
vErrors.push(err64);
}
errors++;
}
}
else {
const err65 = {instancePath:instancePath+"/display/stroke",schemaPath:"#/properties/display/properties/stroke/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err65];
}
else {
vErrors.push(err65);
}
errors++;
}
}
if(data24.opacity !== undefined){
let data27 = data24.opacity;
if((typeof data27 == "number") && (isFinite(data27))){
if(data27 > 1 || isNaN(data27)){
const err66 = {instancePath:instancePath+"/display/opacity",schemaPath:"#/properties/display/properties/opacity/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1},message:"must be <= 1"};
if(vErrors === null){
vErrors = [err66];
}
else {
vErrors.push(err66);
}
errors++;
}
if(data27 < 0 || isNaN(data27)){
const err67 = {instancePath:instancePath+"/display/opacity",schemaPath:"#/properties/display/properties/opacity/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err67];
}
else {
vErrors.push(err67);
}
errors++;
}
}
else {
const err68 = {instancePath:instancePath+"/display/opacity",schemaPath:"#/properties/display/properties/opacity/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err68];
}
else {
vErrors.push(err68);
}
errors++;
}
}
if(data24.label !== undefined){
if(typeof data24.label !== "boolean"){
const err69 = {instancePath:instancePath+"/display/label",schemaPath:"#/properties/display/properties/label/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err69];
}
else {
vErrors.push(err69);
}
errors++;
}
}
}
else {
const err70 = {instancePath:instancePath+"/display",schemaPath:"#/properties/display/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err70];
}
else {
vErrors.push(err70);
}
errors++;
}
}
}
else {
const err71 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err71];
}
else {
vErrors.push(err71);
}
errors++;
}
validate32.errors = vErrors;
return errors === 0;
}
validate32.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate27(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
/*# sourceURL="https://github.com/anatamien/APIO-GRAPH/blob/main/schemas/aph-1.1.schema.json" */;
let vErrors = null;
let errors = 0;
const evaluated0 = validate27.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.format === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "format"},message:"must have required property '"+"format"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.schemaVersion === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "schemaVersion"},message:"must have required property '"+"schemaVersion"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.createdWith === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "createdWith"},message:"must have required property '"+"createdWith"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.project === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "project"},message:"must have required property '"+"project"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.page === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "page"},message:"must have required property '"+"page"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data.axes === undefined){
const err5 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "axes"},message:"must have required property '"+"axes"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data.datasets === undefined){
const err6 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "datasets"},message:"must have required property '"+"datasets"+"'"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
if(data.series === undefined){
const err7 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "series"},message:"must have required property '"+"series"+"'"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
if(data.objects === undefined){
const err8 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "objects"},message:"must have required property '"+"objects"+"'"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
if(data.calculations === undefined){
const err9 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "calculations"},message:"must have required property '"+"calculations"+"'"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
if(data.legend === undefined){
const err10 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "legend"},message:"must have required property '"+"legend"+"'"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
if(data.viewport === undefined){
const err11 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "viewport"},message:"must have required property '"+"viewport"+"'"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
if(data.editor === undefined){
const err12 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "editor"},message:"must have required property '"+"editor"+"'"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
if(data.extensions === undefined){
const err13 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "extensions"},message:"must have required property '"+"extensions"+"'"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
for(const key0 in data){
if(!(func1.call(schema43.properties, key0))){
const err14 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
if(data.format !== undefined){
if("APIO_GRAPH_PROJECT" !== data.format){
const err15 = {instancePath:instancePath+"/format",schemaPath:"#/properties/format/const",keyword:"const",params:{allowedValue: "APIO_GRAPH_PROJECT"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
if(data.schemaVersion !== undefined){
let data1 = data.schemaVersion;
if(typeof data1 === "string"){
if(!pattern28.test(data1)){
const err16 = {instancePath:instancePath+"/schemaVersion",schemaPath:"#/properties/schemaVersion/pattern",keyword:"pattern",params:{pattern: "^1\\.1\\.[0-9]+$"},message:"must match pattern \""+"^1\\.1\\.[0-9]+$"+"\""};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
}
else {
const err17 = {instancePath:instancePath+"/schemaVersion",schemaPath:"#/properties/schemaVersion/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
}
if(data.createdWith !== undefined){
let data2 = data.createdWith;
if(data2 && typeof data2 == "object" && !Array.isArray(data2)){
if(data2.name === undefined){
const err18 = {instancePath:instancePath+"/createdWith",schemaPath:"#/properties/createdWith/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
if(data2.version === undefined){
const err19 = {instancePath:instancePath+"/createdWith",schemaPath:"#/properties/createdWith/required",keyword:"required",params:{missingProperty: "version"},message:"must have required property '"+"version"+"'"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
for(const key1 in data2){
if(!((key1 === "name") || (key1 === "version"))){
const err20 = {instancePath:instancePath+"/createdWith",schemaPath:"#/properties/createdWith/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
}
if(data2.name !== undefined){
if("APIO GRAPH" !== data2.name){
const err21 = {instancePath:instancePath+"/createdWith/name",schemaPath:"#/properties/createdWith/properties/name/const",keyword:"const",params:{allowedValue: "APIO GRAPH"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
}
if(data2.version !== undefined){
let data4 = data2.version;
if(typeof data4 === "string"){
if(func2(data4) < 1){
const err22 = {instancePath:instancePath+"/createdWith/version",schemaPath:"#/properties/createdWith/properties/version/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
}
else {
const err23 = {instancePath:instancePath+"/createdWith/version",schemaPath:"#/properties/createdWith/properties/version/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
}
}
else {
const err24 = {instancePath:instancePath+"/createdWith",schemaPath:"#/properties/createdWith/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
}
if(data.project !== undefined){
let data5 = data.project;
if(data5 && typeof data5 == "object" && !Array.isArray(data5)){
if(data5.id === undefined){
const err25 = {instancePath:instancePath+"/project",schemaPath:"#/properties/project/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
if(data5.title === undefined){
const err26 = {instancePath:instancePath+"/project",schemaPath:"#/properties/project/required",keyword:"required",params:{missingProperty: "title"},message:"must have required property '"+"title"+"'"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
if(data5.createdAt === undefined){
const err27 = {instancePath:instancePath+"/project",schemaPath:"#/properties/project/required",keyword:"required",params:{missingProperty: "createdAt"},message:"must have required property '"+"createdAt"+"'"};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
if(data5.updatedAt === undefined){
const err28 = {instancePath:instancePath+"/project",schemaPath:"#/properties/project/required",keyword:"required",params:{missingProperty: "updatedAt"},message:"must have required property '"+"updatedAt"+"'"};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
for(const key2 in data5){
if(!((((key2 === "id") || (key2 === "title")) || (key2 === "createdAt")) || (key2 === "updatedAt"))){
const err29 = {instancePath:instancePath+"/project",schemaPath:"#/properties/project/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key2},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
}
}
if(data5.id !== undefined){
let data6 = data5.id;
if(typeof data6 === "string"){
if(!pattern6.test(data6)){
const err30 = {instancePath:instancePath+"/project/id",schemaPath:"#/properties/project/properties/id/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"+"\""};
if(vErrors === null){
vErrors = [err30];
}
else {
vErrors.push(err30);
}
errors++;
}
}
else {
const err31 = {instancePath:instancePath+"/project/id",schemaPath:"#/properties/project/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err31];
}
else {
vErrors.push(err31);
}
errors++;
}
}
if(data5.title !== undefined){
let data7 = data5.title;
if(typeof data7 === "string"){
if(func2(data7) > 300){
const err32 = {instancePath:instancePath+"/project/title",schemaPath:"#/properties/project/properties/title/maxLength",keyword:"maxLength",params:{limit: 300},message:"must NOT have more than 300 characters"};
if(vErrors === null){
vErrors = [err32];
}
else {
vErrors.push(err32);
}
errors++;
}
}
else {
const err33 = {instancePath:instancePath+"/project/title",schemaPath:"#/properties/project/properties/title/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err33];
}
else {
vErrors.push(err33);
}
errors++;
}
}
if(data5.createdAt !== undefined){
let data8 = data5.createdAt;
if(typeof data8 === "string"){
if(!(formats0.validate(data8))){
const err34 = {instancePath:instancePath+"/project/createdAt",schemaPath:"#/properties/project/properties/createdAt/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
if(vErrors === null){
vErrors = [err34];
}
else {
vErrors.push(err34);
}
errors++;
}
}
else {
const err35 = {instancePath:instancePath+"/project/createdAt",schemaPath:"#/properties/project/properties/createdAt/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err35];
}
else {
vErrors.push(err35);
}
errors++;
}
}
if(data5.updatedAt !== undefined){
let data9 = data5.updatedAt;
if(typeof data9 === "string"){
if(!(formats0.validate(data9))){
const err36 = {instancePath:instancePath+"/project/updatedAt",schemaPath:"#/properties/project/properties/updatedAt/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
if(vErrors === null){
vErrors = [err36];
}
else {
vErrors.push(err36);
}
errors++;
}
}
else {
const err37 = {instancePath:instancePath+"/project/updatedAt",schemaPath:"#/properties/project/properties/updatedAt/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err37];
}
else {
vErrors.push(err37);
}
errors++;
}
}
}
else {
const err38 = {instancePath:instancePath+"/project",schemaPath:"#/properties/project/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err38];
}
else {
vErrors.push(err38);
}
errors++;
}
}
if(data.page !== undefined){
let data10 = data.page;
if(data10 && typeof data10 == "object" && !Array.isArray(data10)){
if(data10.widthPx === undefined){
const err39 = {instancePath:instancePath+"/page",schemaPath:"#/properties/page/required",keyword:"required",params:{missingProperty: "widthPx"},message:"must have required property '"+"widthPx"+"'"};
if(vErrors === null){
vErrors = [err39];
}
else {
vErrors.push(err39);
}
errors++;
}
if(data10.heightPx === undefined){
const err40 = {instancePath:instancePath+"/page",schemaPath:"#/properties/page/required",keyword:"required",params:{missingProperty: "heightPx"},message:"must have required property '"+"heightPx"+"'"};
if(vErrors === null){
vErrors = [err40];
}
else {
vErrors.push(err40);
}
errors++;
}
if(data10.background === undefined){
const err41 = {instancePath:instancePath+"/page",schemaPath:"#/properties/page/required",keyword:"required",params:{missingProperty: "background"},message:"must have required property '"+"background"+"'"};
if(vErrors === null){
vErrors = [err41];
}
else {
vErrors.push(err41);
}
errors++;
}
if(data10.paddingPx === undefined){
const err42 = {instancePath:instancePath+"/page",schemaPath:"#/properties/page/required",keyword:"required",params:{missingProperty: "paddingPx"},message:"must have required property '"+"paddingPx"+"'"};
if(vErrors === null){
vErrors = [err42];
}
else {
vErrors.push(err42);
}
errors++;
}
for(const key3 in data10){
if(!((((key3 === "widthPx") || (key3 === "heightPx")) || (key3 === "background")) || (key3 === "paddingPx"))){
const err43 = {instancePath:instancePath+"/page",schemaPath:"#/properties/page/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key3},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err43];
}
else {
vErrors.push(err43);
}
errors++;
}
}
if(data10.widthPx !== undefined){
let data11 = data10.widthPx;
if(!(((typeof data11 == "number") && (!(data11 % 1) && !isNaN(data11))) && (isFinite(data11)))){
const err44 = {instancePath:instancePath+"/page/widthPx",schemaPath:"#/properties/page/properties/widthPx/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err44];
}
else {
vErrors.push(err44);
}
errors++;
}
if((typeof data11 == "number") && (isFinite(data11))){
if(data11 > 30000 || isNaN(data11)){
const err45 = {instancePath:instancePath+"/page/widthPx",schemaPath:"#/properties/page/properties/widthPx/maximum",keyword:"maximum",params:{comparison: "<=", limit: 30000},message:"must be <= 30000"};
if(vErrors === null){
vErrors = [err45];
}
else {
vErrors.push(err45);
}
errors++;
}
if(data11 < 100 || isNaN(data11)){
const err46 = {instancePath:instancePath+"/page/widthPx",schemaPath:"#/properties/page/properties/widthPx/minimum",keyword:"minimum",params:{comparison: ">=", limit: 100},message:"must be >= 100"};
if(vErrors === null){
vErrors = [err46];
}
else {
vErrors.push(err46);
}
errors++;
}
}
}
if(data10.heightPx !== undefined){
let data12 = data10.heightPx;
if(!(((typeof data12 == "number") && (!(data12 % 1) && !isNaN(data12))) && (isFinite(data12)))){
const err47 = {instancePath:instancePath+"/page/heightPx",schemaPath:"#/properties/page/properties/heightPx/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err47];
}
else {
vErrors.push(err47);
}
errors++;
}
if((typeof data12 == "number") && (isFinite(data12))){
if(data12 > 30000 || isNaN(data12)){
const err48 = {instancePath:instancePath+"/page/heightPx",schemaPath:"#/properties/page/properties/heightPx/maximum",keyword:"maximum",params:{comparison: "<=", limit: 30000},message:"must be <= 30000"};
if(vErrors === null){
vErrors = [err48];
}
else {
vErrors.push(err48);
}
errors++;
}
if(data12 < 100 || isNaN(data12)){
const err49 = {instancePath:instancePath+"/page/heightPx",schemaPath:"#/properties/page/properties/heightPx/minimum",keyword:"minimum",params:{comparison: ">=", limit: 100},message:"must be >= 100"};
if(vErrors === null){
vErrors = [err49];
}
else {
vErrors.push(err49);
}
errors++;
}
}
}
if(data10.background !== undefined){
let data13 = data10.background;
if(typeof data13 === "string"){
if(!pattern7.test(data13)){
const err50 = {instancePath:instancePath+"/page/background",schemaPath:"#/properties/page/properties/background/pattern",keyword:"pattern",params:{pattern: "^#[0-9A-Fa-f]{6}$"},message:"must match pattern \""+"^#[0-9A-Fa-f]{6}$"+"\""};
if(vErrors === null){
vErrors = [err50];
}
else {
vErrors.push(err50);
}
errors++;
}
}
else {
const err51 = {instancePath:instancePath+"/page/background",schemaPath:"#/properties/page/properties/background/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err51];
}
else {
vErrors.push(err51);
}
errors++;
}
}
if(data10.paddingPx !== undefined){
let data14 = data10.paddingPx;
if((typeof data14 == "number") && (isFinite(data14))){
if(data14 > 2000 || isNaN(data14)){
const err52 = {instancePath:instancePath+"/page/paddingPx",schemaPath:"#/properties/page/properties/paddingPx/maximum",keyword:"maximum",params:{comparison: "<=", limit: 2000},message:"must be <= 2000"};
if(vErrors === null){
vErrors = [err52];
}
else {
vErrors.push(err52);
}
errors++;
}
if(data14 < 0 || isNaN(data14)){
const err53 = {instancePath:instancePath+"/page/paddingPx",schemaPath:"#/properties/page/properties/paddingPx/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err53];
}
else {
vErrors.push(err53);
}
errors++;
}
}
else {
const err54 = {instancePath:instancePath+"/page/paddingPx",schemaPath:"#/properties/page/properties/paddingPx/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err54];
}
else {
vErrors.push(err54);
}
errors++;
}
}
}
else {
const err55 = {instancePath:instancePath+"/page",schemaPath:"#/properties/page/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err55];
}
else {
vErrors.push(err55);
}
errors++;
}
}
if(data.axes !== undefined){
let data15 = data.axes;
if(data15 && typeof data15 == "object" && !Array.isArray(data15)){
if(data15.x === undefined){
const err56 = {instancePath:instancePath+"/axes",schemaPath:"#/properties/axes/required",keyword:"required",params:{missingProperty: "x"},message:"must have required property '"+"x"+"'"};
if(vErrors === null){
vErrors = [err56];
}
else {
vErrors.push(err56);
}
errors++;
}
if(data15.y === undefined){
const err57 = {instancePath:instancePath+"/axes",schemaPath:"#/properties/axes/required",keyword:"required",params:{missingProperty: "y"},message:"must have required property '"+"y"+"'"};
if(vErrors === null){
vErrors = [err57];
}
else {
vErrors.push(err57);
}
errors++;
}
for(const key4 in data15){
if(!((key4 === "x") || (key4 === "y"))){
const err58 = {instancePath:instancePath+"/axes",schemaPath:"#/properties/axes/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key4},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err58];
}
else {
vErrors.push(err58);
}
errors++;
}
}
if(data15.x !== undefined){
let data16 = data15.x;
if(data16 && typeof data16 == "object" && !Array.isArray(data16)){
if(data16.label === undefined){
const err59 = {instancePath:instancePath+"/axes/x",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "label"},message:"must have required property '"+"label"+"'"};
if(vErrors === null){
vErrors = [err59];
}
else {
vErrors.push(err59);
}
errors++;
}
if(data16.unit === undefined){
const err60 = {instancePath:instancePath+"/axes/x",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "unit"},message:"must have required property '"+"unit"+"'"};
if(vErrors === null){
vErrors = [err60];
}
else {
vErrors.push(err60);
}
errors++;
}
if(data16.scale === undefined){
const err61 = {instancePath:instancePath+"/axes/x",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "scale"},message:"must have required property '"+"scale"+"'"};
if(vErrors === null){
vErrors = [err61];
}
else {
vErrors.push(err61);
}
errors++;
}
if(data16.mode === undefined){
const err62 = {instancePath:instancePath+"/axes/x",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "mode"},message:"must have required property '"+"mode"+"'"};
if(vErrors === null){
vErrors = [err62];
}
else {
vErrors.push(err62);
}
errors++;
}
if(data16.min === undefined){
const err63 = {instancePath:instancePath+"/axes/x",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "min"},message:"must have required property '"+"min"+"'"};
if(vErrors === null){
vErrors = [err63];
}
else {
vErrors.push(err63);
}
errors++;
}
if(data16.max === undefined){
const err64 = {instancePath:instancePath+"/axes/x",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "max"},message:"must have required property '"+"max"+"'"};
if(vErrors === null){
vErrors = [err64];
}
else {
vErrors.push(err64);
}
errors++;
}
if(data16.tickMode === undefined){
const err65 = {instancePath:instancePath+"/axes/x",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "tickMode"},message:"must have required property '"+"tickMode"+"'"};
if(vErrors === null){
vErrors = [err65];
}
else {
vErrors.push(err65);
}
errors++;
}
if(data16.tickStep === undefined){
const err66 = {instancePath:instancePath+"/axes/x",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "tickStep"},message:"must have required property '"+"tickStep"+"'"};
if(vErrors === null){
vErrors = [err66];
}
else {
vErrors.push(err66);
}
errors++;
}
if(data16.tickOrigin === undefined){
const err67 = {instancePath:instancePath+"/axes/x",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "tickOrigin"},message:"must have required property '"+"tickOrigin"+"'"};
if(vErrors === null){
vErrors = [err67];
}
else {
vErrors.push(err67);
}
errors++;
}
if(data16.minorDivisions === undefined){
const err68 = {instancePath:instancePath+"/axes/x",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "minorDivisions"},message:"must have required property '"+"minorDivisions"+"'"};
if(vErrors === null){
vErrors = [err68];
}
else {
vErrors.push(err68);
}
errors++;
}
if(data16.grid === undefined){
const err69 = {instancePath:instancePath+"/axes/x",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "grid"},message:"must have required property '"+"grid"+"'"};
if(vErrors === null){
vErrors = [err69];
}
else {
vErrors.push(err69);
}
errors++;
}
if(data16.numberFormat === undefined){
const err70 = {instancePath:instancePath+"/axes/x",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "numberFormat"},message:"must have required property '"+"numberFormat"+"'"};
if(vErrors === null){
vErrors = [err70];
}
else {
vErrors.push(err70);
}
errors++;
}
if(data16.precision === undefined){
const err71 = {instancePath:instancePath+"/axes/x",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "precision"},message:"must have required property '"+"precision"+"'"};
if(vErrors === null){
vErrors = [err71];
}
else {
vErrors.push(err71);
}
errors++;
}
if(data16.strokeWidthPt === undefined){
const err72 = {instancePath:instancePath+"/axes/x",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "strokeWidthPt"},message:"must have required property '"+"strokeWidthPt"+"'"};
if(vErrors === null){
vErrors = [err72];
}
else {
vErrors.push(err72);
}
errors++;
}
if(data16.labelSizePt === undefined){
const err73 = {instancePath:instancePath+"/axes/x",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "labelSizePt"},message:"must have required property '"+"labelSizePt"+"'"};
if(vErrors === null){
vErrors = [err73];
}
else {
vErrors.push(err73);
}
errors++;
}
for(const key5 in data16){
if(!(func1.call(schema44.properties, key5))){
const err74 = {instancePath:instancePath+"/axes/x",schemaPath:"#/$defs/axis/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key5},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err74];
}
else {
vErrors.push(err74);
}
errors++;
}
}
if(data16.label !== undefined){
let data17 = data16.label;
if(typeof data17 === "string"){
if(func2(data17) > 500){
const err75 = {instancePath:instancePath+"/axes/x/label",schemaPath:"#/$defs/axis/properties/label/maxLength",keyword:"maxLength",params:{limit: 500},message:"must NOT have more than 500 characters"};
if(vErrors === null){
vErrors = [err75];
}
else {
vErrors.push(err75);
}
errors++;
}
}
else {
const err76 = {instancePath:instancePath+"/axes/x/label",schemaPath:"#/$defs/axis/properties/label/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err76];
}
else {
vErrors.push(err76);
}
errors++;
}
}
if(data16.unit !== undefined){
let data18 = data16.unit;
if(typeof data18 === "string"){
if(func2(data18) > 100){
const err77 = {instancePath:instancePath+"/axes/x/unit",schemaPath:"#/$defs/axis/properties/unit/maxLength",keyword:"maxLength",params:{limit: 100},message:"must NOT have more than 100 characters"};
if(vErrors === null){
vErrors = [err77];
}
else {
vErrors.push(err77);
}
errors++;
}
}
else {
const err78 = {instancePath:instancePath+"/axes/x/unit",schemaPath:"#/$defs/axis/properties/unit/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err78];
}
else {
vErrors.push(err78);
}
errors++;
}
}
if(data16.scale !== undefined){
if("linear" !== data16.scale){
const err79 = {instancePath:instancePath+"/axes/x/scale",schemaPath:"#/$defs/axis/properties/scale/const",keyword:"const",params:{allowedValue: "linear"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err79];
}
else {
vErrors.push(err79);
}
errors++;
}
}
if(data16.mode !== undefined){
let data20 = data16.mode;
if(!((data20 === "auto") || (data20 === "manual"))){
const err80 = {instancePath:instancePath+"/axes/x/mode",schemaPath:"#/$defs/axis/properties/mode/enum",keyword:"enum",params:{allowedValues: schema44.properties.mode.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err80];
}
else {
vErrors.push(err80);
}
errors++;
}
}
if(data16.min !== undefined){
let data21 = data16.min;
if(!((typeof data21 == "number") && (isFinite(data21)))){
const err81 = {instancePath:instancePath+"/axes/x/min",schemaPath:"#/$defs/axis/properties/min/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err81];
}
else {
vErrors.push(err81);
}
errors++;
}
}
if(data16.max !== undefined){
let data22 = data16.max;
if(!((typeof data22 == "number") && (isFinite(data22)))){
const err82 = {instancePath:instancePath+"/axes/x/max",schemaPath:"#/$defs/axis/properties/max/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err82];
}
else {
vErrors.push(err82);
}
errors++;
}
}
if(data16.tickMode !== undefined){
let data23 = data16.tickMode;
if(!((data23 === "auto") || (data23 === "manual"))){
const err83 = {instancePath:instancePath+"/axes/x/tickMode",schemaPath:"#/$defs/axis/properties/tickMode/enum",keyword:"enum",params:{allowedValues: schema44.properties.tickMode.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err83];
}
else {
vErrors.push(err83);
}
errors++;
}
}
if(data16.tickStep !== undefined){
let data24 = data16.tickStep;
if((typeof data24 == "number") && (isFinite(data24))){
if(data24 <= 0 || isNaN(data24)){
const err84 = {instancePath:instancePath+"/axes/x/tickStep",schemaPath:"#/$defs/axis/properties/tickStep/exclusiveMinimum",keyword:"exclusiveMinimum",params:{comparison: ">", limit: 0},message:"must be > 0"};
if(vErrors === null){
vErrors = [err84];
}
else {
vErrors.push(err84);
}
errors++;
}
}
else {
const err85 = {instancePath:instancePath+"/axes/x/tickStep",schemaPath:"#/$defs/axis/properties/tickStep/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err85];
}
else {
vErrors.push(err85);
}
errors++;
}
}
if(data16.tickOrigin !== undefined){
let data25 = data16.tickOrigin;
if(!((typeof data25 == "number") && (isFinite(data25)))){
const err86 = {instancePath:instancePath+"/axes/x/tickOrigin",schemaPath:"#/$defs/axis/properties/tickOrigin/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err86];
}
else {
vErrors.push(err86);
}
errors++;
}
}
if(data16.minorDivisions !== undefined){
let data26 = data16.minorDivisions;
if(!(((typeof data26 == "number") && (!(data26 % 1) && !isNaN(data26))) && (isFinite(data26)))){
const err87 = {instancePath:instancePath+"/axes/x/minorDivisions",schemaPath:"#/$defs/axis/properties/minorDivisions/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err87];
}
else {
vErrors.push(err87);
}
errors++;
}
if((typeof data26 == "number") && (isFinite(data26))){
if(data26 > 20 || isNaN(data26)){
const err88 = {instancePath:instancePath+"/axes/x/minorDivisions",schemaPath:"#/$defs/axis/properties/minorDivisions/maximum",keyword:"maximum",params:{comparison: "<=", limit: 20},message:"must be <= 20"};
if(vErrors === null){
vErrors = [err88];
}
else {
vErrors.push(err88);
}
errors++;
}
if(data26 < 0 || isNaN(data26)){
const err89 = {instancePath:instancePath+"/axes/x/minorDivisions",schemaPath:"#/$defs/axis/properties/minorDivisions/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err89];
}
else {
vErrors.push(err89);
}
errors++;
}
}
}
if(data16.grid !== undefined){
if(typeof data16.grid !== "boolean"){
const err90 = {instancePath:instancePath+"/axes/x/grid",schemaPath:"#/$defs/axis/properties/grid/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err90];
}
else {
vErrors.push(err90);
}
errors++;
}
}
if(data16.numberFormat !== undefined){
let data28 = data16.numberFormat;
if(!(((data28 === "auto") || (data28 === "fixed")) || (data28 === "scientific"))){
const err91 = {instancePath:instancePath+"/axes/x/numberFormat",schemaPath:"#/$defs/axis/properties/numberFormat/enum",keyword:"enum",params:{allowedValues: schema44.properties.numberFormat.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err91];
}
else {
vErrors.push(err91);
}
errors++;
}
}
if(data16.precision !== undefined){
let data29 = data16.precision;
if(!(((typeof data29 == "number") && (!(data29 % 1) && !isNaN(data29))) && (isFinite(data29)))){
const err92 = {instancePath:instancePath+"/axes/x/precision",schemaPath:"#/$defs/axis/properties/precision/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err92];
}
else {
vErrors.push(err92);
}
errors++;
}
if((typeof data29 == "number") && (isFinite(data29))){
if(data29 > 15 || isNaN(data29)){
const err93 = {instancePath:instancePath+"/axes/x/precision",schemaPath:"#/$defs/axis/properties/precision/maximum",keyword:"maximum",params:{comparison: "<=", limit: 15},message:"must be <= 15"};
if(vErrors === null){
vErrors = [err93];
}
else {
vErrors.push(err93);
}
errors++;
}
if(data29 < 0 || isNaN(data29)){
const err94 = {instancePath:instancePath+"/axes/x/precision",schemaPath:"#/$defs/axis/properties/precision/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err94];
}
else {
vErrors.push(err94);
}
errors++;
}
}
}
if(data16.strokeWidthPt !== undefined){
let data30 = data16.strokeWidthPt;
if((typeof data30 == "number") && (isFinite(data30))){
if(data30 > 24 || isNaN(data30)){
const err95 = {instancePath:instancePath+"/axes/x/strokeWidthPt",schemaPath:"#/$defs/axis/properties/strokeWidthPt/maximum",keyword:"maximum",params:{comparison: "<=", limit: 24},message:"must be <= 24"};
if(vErrors === null){
vErrors = [err95];
}
else {
vErrors.push(err95);
}
errors++;
}
if(data30 <= 0 || isNaN(data30)){
const err96 = {instancePath:instancePath+"/axes/x/strokeWidthPt",schemaPath:"#/$defs/axis/properties/strokeWidthPt/exclusiveMinimum",keyword:"exclusiveMinimum",params:{comparison: ">", limit: 0},message:"must be > 0"};
if(vErrors === null){
vErrors = [err96];
}
else {
vErrors.push(err96);
}
errors++;
}
}
else {
const err97 = {instancePath:instancePath+"/axes/x/strokeWidthPt",schemaPath:"#/$defs/axis/properties/strokeWidthPt/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err97];
}
else {
vErrors.push(err97);
}
errors++;
}
}
if(data16.labelSizePt !== undefined){
let data31 = data16.labelSizePt;
if((typeof data31 == "number") && (isFinite(data31))){
if(data31 > 72 || isNaN(data31)){
const err98 = {instancePath:instancePath+"/axes/x/labelSizePt",schemaPath:"#/$defs/axis/properties/labelSizePt/maximum",keyword:"maximum",params:{comparison: "<=", limit: 72},message:"must be <= 72"};
if(vErrors === null){
vErrors = [err98];
}
else {
vErrors.push(err98);
}
errors++;
}
if(data31 < 6 || isNaN(data31)){
const err99 = {instancePath:instancePath+"/axes/x/labelSizePt",schemaPath:"#/$defs/axis/properties/labelSizePt/minimum",keyword:"minimum",params:{comparison: ">=", limit: 6},message:"must be >= 6"};
if(vErrors === null){
vErrors = [err99];
}
else {
vErrors.push(err99);
}
errors++;
}
}
else {
const err100 = {instancePath:instancePath+"/axes/x/labelSizePt",schemaPath:"#/$defs/axis/properties/labelSizePt/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err100];
}
else {
vErrors.push(err100);
}
errors++;
}
}
}
else {
const err101 = {instancePath:instancePath+"/axes/x",schemaPath:"#/$defs/axis/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err101];
}
else {
vErrors.push(err101);
}
errors++;
}
}
if(data15.y !== undefined){
let data32 = data15.y;
if(data32 && typeof data32 == "object" && !Array.isArray(data32)){
if(data32.label === undefined){
const err102 = {instancePath:instancePath+"/axes/y",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "label"},message:"must have required property '"+"label"+"'"};
if(vErrors === null){
vErrors = [err102];
}
else {
vErrors.push(err102);
}
errors++;
}
if(data32.unit === undefined){
const err103 = {instancePath:instancePath+"/axes/y",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "unit"},message:"must have required property '"+"unit"+"'"};
if(vErrors === null){
vErrors = [err103];
}
else {
vErrors.push(err103);
}
errors++;
}
if(data32.scale === undefined){
const err104 = {instancePath:instancePath+"/axes/y",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "scale"},message:"must have required property '"+"scale"+"'"};
if(vErrors === null){
vErrors = [err104];
}
else {
vErrors.push(err104);
}
errors++;
}
if(data32.mode === undefined){
const err105 = {instancePath:instancePath+"/axes/y",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "mode"},message:"must have required property '"+"mode"+"'"};
if(vErrors === null){
vErrors = [err105];
}
else {
vErrors.push(err105);
}
errors++;
}
if(data32.min === undefined){
const err106 = {instancePath:instancePath+"/axes/y",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "min"},message:"must have required property '"+"min"+"'"};
if(vErrors === null){
vErrors = [err106];
}
else {
vErrors.push(err106);
}
errors++;
}
if(data32.max === undefined){
const err107 = {instancePath:instancePath+"/axes/y",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "max"},message:"must have required property '"+"max"+"'"};
if(vErrors === null){
vErrors = [err107];
}
else {
vErrors.push(err107);
}
errors++;
}
if(data32.tickMode === undefined){
const err108 = {instancePath:instancePath+"/axes/y",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "tickMode"},message:"must have required property '"+"tickMode"+"'"};
if(vErrors === null){
vErrors = [err108];
}
else {
vErrors.push(err108);
}
errors++;
}
if(data32.tickStep === undefined){
const err109 = {instancePath:instancePath+"/axes/y",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "tickStep"},message:"must have required property '"+"tickStep"+"'"};
if(vErrors === null){
vErrors = [err109];
}
else {
vErrors.push(err109);
}
errors++;
}
if(data32.tickOrigin === undefined){
const err110 = {instancePath:instancePath+"/axes/y",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "tickOrigin"},message:"must have required property '"+"tickOrigin"+"'"};
if(vErrors === null){
vErrors = [err110];
}
else {
vErrors.push(err110);
}
errors++;
}
if(data32.minorDivisions === undefined){
const err111 = {instancePath:instancePath+"/axes/y",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "minorDivisions"},message:"must have required property '"+"minorDivisions"+"'"};
if(vErrors === null){
vErrors = [err111];
}
else {
vErrors.push(err111);
}
errors++;
}
if(data32.grid === undefined){
const err112 = {instancePath:instancePath+"/axes/y",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "grid"},message:"must have required property '"+"grid"+"'"};
if(vErrors === null){
vErrors = [err112];
}
else {
vErrors.push(err112);
}
errors++;
}
if(data32.numberFormat === undefined){
const err113 = {instancePath:instancePath+"/axes/y",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "numberFormat"},message:"must have required property '"+"numberFormat"+"'"};
if(vErrors === null){
vErrors = [err113];
}
else {
vErrors.push(err113);
}
errors++;
}
if(data32.precision === undefined){
const err114 = {instancePath:instancePath+"/axes/y",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "precision"},message:"must have required property '"+"precision"+"'"};
if(vErrors === null){
vErrors = [err114];
}
else {
vErrors.push(err114);
}
errors++;
}
if(data32.strokeWidthPt === undefined){
const err115 = {instancePath:instancePath+"/axes/y",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "strokeWidthPt"},message:"must have required property '"+"strokeWidthPt"+"'"};
if(vErrors === null){
vErrors = [err115];
}
else {
vErrors.push(err115);
}
errors++;
}
if(data32.labelSizePt === undefined){
const err116 = {instancePath:instancePath+"/axes/y",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "labelSizePt"},message:"must have required property '"+"labelSizePt"+"'"};
if(vErrors === null){
vErrors = [err116];
}
else {
vErrors.push(err116);
}
errors++;
}
for(const key6 in data32){
if(!(func1.call(schema44.properties, key6))){
const err117 = {instancePath:instancePath+"/axes/y",schemaPath:"#/$defs/axis/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key6},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err117];
}
else {
vErrors.push(err117);
}
errors++;
}
}
if(data32.label !== undefined){
let data33 = data32.label;
if(typeof data33 === "string"){
if(func2(data33) > 500){
const err118 = {instancePath:instancePath+"/axes/y/label",schemaPath:"#/$defs/axis/properties/label/maxLength",keyword:"maxLength",params:{limit: 500},message:"must NOT have more than 500 characters"};
if(vErrors === null){
vErrors = [err118];
}
else {
vErrors.push(err118);
}
errors++;
}
}
else {
const err119 = {instancePath:instancePath+"/axes/y/label",schemaPath:"#/$defs/axis/properties/label/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err119];
}
else {
vErrors.push(err119);
}
errors++;
}
}
if(data32.unit !== undefined){
let data34 = data32.unit;
if(typeof data34 === "string"){
if(func2(data34) > 100){
const err120 = {instancePath:instancePath+"/axes/y/unit",schemaPath:"#/$defs/axis/properties/unit/maxLength",keyword:"maxLength",params:{limit: 100},message:"must NOT have more than 100 characters"};
if(vErrors === null){
vErrors = [err120];
}
else {
vErrors.push(err120);
}
errors++;
}
}
else {
const err121 = {instancePath:instancePath+"/axes/y/unit",schemaPath:"#/$defs/axis/properties/unit/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err121];
}
else {
vErrors.push(err121);
}
errors++;
}
}
if(data32.scale !== undefined){
if("linear" !== data32.scale){
const err122 = {instancePath:instancePath+"/axes/y/scale",schemaPath:"#/$defs/axis/properties/scale/const",keyword:"const",params:{allowedValue: "linear"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err122];
}
else {
vErrors.push(err122);
}
errors++;
}
}
if(data32.mode !== undefined){
let data36 = data32.mode;
if(!((data36 === "auto") || (data36 === "manual"))){
const err123 = {instancePath:instancePath+"/axes/y/mode",schemaPath:"#/$defs/axis/properties/mode/enum",keyword:"enum",params:{allowedValues: schema44.properties.mode.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err123];
}
else {
vErrors.push(err123);
}
errors++;
}
}
if(data32.min !== undefined){
let data37 = data32.min;
if(!((typeof data37 == "number") && (isFinite(data37)))){
const err124 = {instancePath:instancePath+"/axes/y/min",schemaPath:"#/$defs/axis/properties/min/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err124];
}
else {
vErrors.push(err124);
}
errors++;
}
}
if(data32.max !== undefined){
let data38 = data32.max;
if(!((typeof data38 == "number") && (isFinite(data38)))){
const err125 = {instancePath:instancePath+"/axes/y/max",schemaPath:"#/$defs/axis/properties/max/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err125];
}
else {
vErrors.push(err125);
}
errors++;
}
}
if(data32.tickMode !== undefined){
let data39 = data32.tickMode;
if(!((data39 === "auto") || (data39 === "manual"))){
const err126 = {instancePath:instancePath+"/axes/y/tickMode",schemaPath:"#/$defs/axis/properties/tickMode/enum",keyword:"enum",params:{allowedValues: schema44.properties.tickMode.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err126];
}
else {
vErrors.push(err126);
}
errors++;
}
}
if(data32.tickStep !== undefined){
let data40 = data32.tickStep;
if((typeof data40 == "number") && (isFinite(data40))){
if(data40 <= 0 || isNaN(data40)){
const err127 = {instancePath:instancePath+"/axes/y/tickStep",schemaPath:"#/$defs/axis/properties/tickStep/exclusiveMinimum",keyword:"exclusiveMinimum",params:{comparison: ">", limit: 0},message:"must be > 0"};
if(vErrors === null){
vErrors = [err127];
}
else {
vErrors.push(err127);
}
errors++;
}
}
else {
const err128 = {instancePath:instancePath+"/axes/y/tickStep",schemaPath:"#/$defs/axis/properties/tickStep/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err128];
}
else {
vErrors.push(err128);
}
errors++;
}
}
if(data32.tickOrigin !== undefined){
let data41 = data32.tickOrigin;
if(!((typeof data41 == "number") && (isFinite(data41)))){
const err129 = {instancePath:instancePath+"/axes/y/tickOrigin",schemaPath:"#/$defs/axis/properties/tickOrigin/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err129];
}
else {
vErrors.push(err129);
}
errors++;
}
}
if(data32.minorDivisions !== undefined){
let data42 = data32.minorDivisions;
if(!(((typeof data42 == "number") && (!(data42 % 1) && !isNaN(data42))) && (isFinite(data42)))){
const err130 = {instancePath:instancePath+"/axes/y/minorDivisions",schemaPath:"#/$defs/axis/properties/minorDivisions/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err130];
}
else {
vErrors.push(err130);
}
errors++;
}
if((typeof data42 == "number") && (isFinite(data42))){
if(data42 > 20 || isNaN(data42)){
const err131 = {instancePath:instancePath+"/axes/y/minorDivisions",schemaPath:"#/$defs/axis/properties/minorDivisions/maximum",keyword:"maximum",params:{comparison: "<=", limit: 20},message:"must be <= 20"};
if(vErrors === null){
vErrors = [err131];
}
else {
vErrors.push(err131);
}
errors++;
}
if(data42 < 0 || isNaN(data42)){
const err132 = {instancePath:instancePath+"/axes/y/minorDivisions",schemaPath:"#/$defs/axis/properties/minorDivisions/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err132];
}
else {
vErrors.push(err132);
}
errors++;
}
}
}
if(data32.grid !== undefined){
if(typeof data32.grid !== "boolean"){
const err133 = {instancePath:instancePath+"/axes/y/grid",schemaPath:"#/$defs/axis/properties/grid/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err133];
}
else {
vErrors.push(err133);
}
errors++;
}
}
if(data32.numberFormat !== undefined){
let data44 = data32.numberFormat;
if(!(((data44 === "auto") || (data44 === "fixed")) || (data44 === "scientific"))){
const err134 = {instancePath:instancePath+"/axes/y/numberFormat",schemaPath:"#/$defs/axis/properties/numberFormat/enum",keyword:"enum",params:{allowedValues: schema44.properties.numberFormat.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err134];
}
else {
vErrors.push(err134);
}
errors++;
}
}
if(data32.precision !== undefined){
let data45 = data32.precision;
if(!(((typeof data45 == "number") && (!(data45 % 1) && !isNaN(data45))) && (isFinite(data45)))){
const err135 = {instancePath:instancePath+"/axes/y/precision",schemaPath:"#/$defs/axis/properties/precision/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err135];
}
else {
vErrors.push(err135);
}
errors++;
}
if((typeof data45 == "number") && (isFinite(data45))){
if(data45 > 15 || isNaN(data45)){
const err136 = {instancePath:instancePath+"/axes/y/precision",schemaPath:"#/$defs/axis/properties/precision/maximum",keyword:"maximum",params:{comparison: "<=", limit: 15},message:"must be <= 15"};
if(vErrors === null){
vErrors = [err136];
}
else {
vErrors.push(err136);
}
errors++;
}
if(data45 < 0 || isNaN(data45)){
const err137 = {instancePath:instancePath+"/axes/y/precision",schemaPath:"#/$defs/axis/properties/precision/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err137];
}
else {
vErrors.push(err137);
}
errors++;
}
}
}
if(data32.strokeWidthPt !== undefined){
let data46 = data32.strokeWidthPt;
if((typeof data46 == "number") && (isFinite(data46))){
if(data46 > 24 || isNaN(data46)){
const err138 = {instancePath:instancePath+"/axes/y/strokeWidthPt",schemaPath:"#/$defs/axis/properties/strokeWidthPt/maximum",keyword:"maximum",params:{comparison: "<=", limit: 24},message:"must be <= 24"};
if(vErrors === null){
vErrors = [err138];
}
else {
vErrors.push(err138);
}
errors++;
}
if(data46 <= 0 || isNaN(data46)){
const err139 = {instancePath:instancePath+"/axes/y/strokeWidthPt",schemaPath:"#/$defs/axis/properties/strokeWidthPt/exclusiveMinimum",keyword:"exclusiveMinimum",params:{comparison: ">", limit: 0},message:"must be > 0"};
if(vErrors === null){
vErrors = [err139];
}
else {
vErrors.push(err139);
}
errors++;
}
}
else {
const err140 = {instancePath:instancePath+"/axes/y/strokeWidthPt",schemaPath:"#/$defs/axis/properties/strokeWidthPt/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err140];
}
else {
vErrors.push(err140);
}
errors++;
}
}
if(data32.labelSizePt !== undefined){
let data47 = data32.labelSizePt;
if((typeof data47 == "number") && (isFinite(data47))){
if(data47 > 72 || isNaN(data47)){
const err141 = {instancePath:instancePath+"/axes/y/labelSizePt",schemaPath:"#/$defs/axis/properties/labelSizePt/maximum",keyword:"maximum",params:{comparison: "<=", limit: 72},message:"must be <= 72"};
if(vErrors === null){
vErrors = [err141];
}
else {
vErrors.push(err141);
}
errors++;
}
if(data47 < 6 || isNaN(data47)){
const err142 = {instancePath:instancePath+"/axes/y/labelSizePt",schemaPath:"#/$defs/axis/properties/labelSizePt/minimum",keyword:"minimum",params:{comparison: ">=", limit: 6},message:"must be >= 6"};
if(vErrors === null){
vErrors = [err142];
}
else {
vErrors.push(err142);
}
errors++;
}
}
else {
const err143 = {instancePath:instancePath+"/axes/y/labelSizePt",schemaPath:"#/$defs/axis/properties/labelSizePt/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err143];
}
else {
vErrors.push(err143);
}
errors++;
}
}
}
else {
const err144 = {instancePath:instancePath+"/axes/y",schemaPath:"#/$defs/axis/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err144];
}
else {
vErrors.push(err144);
}
errors++;
}
}
}
else {
const err145 = {instancePath:instancePath+"/axes",schemaPath:"#/properties/axes/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err145];
}
else {
vErrors.push(err145);
}
errors++;
}
}
if(data.datasets !== undefined){
let data48 = data.datasets;
if(Array.isArray(data48)){
if(data48.length > 1000){
const err146 = {instancePath:instancePath+"/datasets",schemaPath:"#/properties/datasets/maxItems",keyword:"maxItems",params:{limit: 1000},message:"must NOT have more than 1000 items"};
if(vErrors === null){
vErrors = [err146];
}
else {
vErrors.push(err146);
}
errors++;
}
const len0 = data48.length;
for(let i0=0; i0<len0; i0++){
if(!(validate28(data48[i0], {instancePath:instancePath+"/datasets/" + i0,parentData:data48,parentDataProperty:i0,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate28.errors : vErrors.concat(validate28.errors);
errors = vErrors.length;
}
}
}
else {
const err147 = {instancePath:instancePath+"/datasets",schemaPath:"#/properties/datasets/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err147];
}
else {
vErrors.push(err147);
}
errors++;
}
}
if(data.series !== undefined){
let data50 = data.series;
if(Array.isArray(data50)){
if(data50.length > 1000){
const err148 = {instancePath:instancePath+"/series",schemaPath:"#/properties/series/maxItems",keyword:"maxItems",params:{limit: 1000},message:"must NOT have more than 1000 items"};
if(vErrors === null){
vErrors = [err148];
}
else {
vErrors.push(err148);
}
errors++;
}
const len1 = data50.length;
for(let i1=0; i1<len1; i1++){
let data51 = data50[i1];
if(data51 && typeof data51 == "object" && !Array.isArray(data51)){
if(data51.id === undefined){
const err149 = {instancePath:instancePath+"/series/" + i1,schemaPath:"#/$defs/series/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err149];
}
else {
vErrors.push(err149);
}
errors++;
}
if(data51.datasetId === undefined){
const err150 = {instancePath:instancePath+"/series/" + i1,schemaPath:"#/$defs/series/required",keyword:"required",params:{missingProperty: "datasetId"},message:"must have required property '"+"datasetId"+"'"};
if(vErrors === null){
vErrors = [err150];
}
else {
vErrors.push(err150);
}
errors++;
}
if(data51.name === undefined){
const err151 = {instancePath:instancePath+"/series/" + i1,schemaPath:"#/$defs/series/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};
if(vErrors === null){
vErrors = [err151];
}
else {
vErrors.push(err151);
}
errors++;
}
if(data51.visible === undefined){
const err152 = {instancePath:instancePath+"/series/" + i1,schemaPath:"#/$defs/series/required",keyword:"required",params:{missingProperty: "visible"},message:"must have required property '"+"visible"+"'"};
if(vErrors === null){
vErrors = [err152];
}
else {
vErrors.push(err152);
}
errors++;
}
if(data51.includeInAutoRange === undefined){
const err153 = {instancePath:instancePath+"/series/" + i1,schemaPath:"#/$defs/series/required",keyword:"required",params:{missingProperty: "includeInAutoRange"},message:"must have required property '"+"includeInAutoRange"+"'"};
if(vErrors === null){
vErrors = [err153];
}
else {
vErrors.push(err153);
}
errors++;
}
if(data51.order === undefined){
const err154 = {instancePath:instancePath+"/series/" + i1,schemaPath:"#/$defs/series/required",keyword:"required",params:{missingProperty: "order"},message:"must have required property '"+"order"+"'"};
if(vErrors === null){
vErrors = [err154];
}
else {
vErrors.push(err154);
}
errors++;
}
if(data51.mode === undefined){
const err155 = {instancePath:instancePath+"/series/" + i1,schemaPath:"#/$defs/series/required",keyword:"required",params:{missingProperty: "mode"},message:"must have required property '"+"mode"+"'"};
if(vErrors === null){
vErrors = [err155];
}
else {
vErrors.push(err155);
}
errors++;
}
if(data51.style === undefined){
const err156 = {instancePath:instancePath+"/series/" + i1,schemaPath:"#/$defs/series/required",keyword:"required",params:{missingProperty: "style"},message:"must have required property '"+"style"+"'"};
if(vErrors === null){
vErrors = [err156];
}
else {
vErrors.push(err156);
}
errors++;
}
for(const key7 in data51){
if(!((((((((key7 === "id") || (key7 === "datasetId")) || (key7 === "name")) || (key7 === "visible")) || (key7 === "includeInAutoRange")) || (key7 === "order")) || (key7 === "mode")) || (key7 === "style"))){
const err157 = {instancePath:instancePath+"/series/" + i1,schemaPath:"#/$defs/series/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key7},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err157];
}
else {
vErrors.push(err157);
}
errors++;
}
}
if(data51.id !== undefined){
let data52 = data51.id;
if(typeof data52 === "string"){
if(!pattern6.test(data52)){
const err158 = {instancePath:instancePath+"/series/" + i1+"/id",schemaPath:"#/$defs/series/properties/id/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"+"\""};
if(vErrors === null){
vErrors = [err158];
}
else {
vErrors.push(err158);
}
errors++;
}
}
else {
const err159 = {instancePath:instancePath+"/series/" + i1+"/id",schemaPath:"#/$defs/series/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err159];
}
else {
vErrors.push(err159);
}
errors++;
}
}
if(data51.datasetId !== undefined){
let data53 = data51.datasetId;
if(typeof data53 === "string"){
if(!pattern6.test(data53)){
const err160 = {instancePath:instancePath+"/series/" + i1+"/datasetId",schemaPath:"#/$defs/series/properties/datasetId/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"+"\""};
if(vErrors === null){
vErrors = [err160];
}
else {
vErrors.push(err160);
}
errors++;
}
}
else {
const err161 = {instancePath:instancePath+"/series/" + i1+"/datasetId",schemaPath:"#/$defs/series/properties/datasetId/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err161];
}
else {
vErrors.push(err161);
}
errors++;
}
}
if(data51.name !== undefined){
let data54 = data51.name;
if(typeof data54 === "string"){
if(func2(data54) > 300){
const err162 = {instancePath:instancePath+"/series/" + i1+"/name",schemaPath:"#/$defs/series/properties/name/maxLength",keyword:"maxLength",params:{limit: 300},message:"must NOT have more than 300 characters"};
if(vErrors === null){
vErrors = [err162];
}
else {
vErrors.push(err162);
}
errors++;
}
}
else {
const err163 = {instancePath:instancePath+"/series/" + i1+"/name",schemaPath:"#/$defs/series/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err163];
}
else {
vErrors.push(err163);
}
errors++;
}
}
if(data51.visible !== undefined){
if(typeof data51.visible !== "boolean"){
const err164 = {instancePath:instancePath+"/series/" + i1+"/visible",schemaPath:"#/$defs/series/properties/visible/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err164];
}
else {
vErrors.push(err164);
}
errors++;
}
}
if(data51.includeInAutoRange !== undefined){
if(typeof data51.includeInAutoRange !== "boolean"){
const err165 = {instancePath:instancePath+"/series/" + i1+"/includeInAutoRange",schemaPath:"#/$defs/series/properties/includeInAutoRange/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err165];
}
else {
vErrors.push(err165);
}
errors++;
}
}
if(data51.order !== undefined){
let data57 = data51.order;
if(!(((typeof data57 == "number") && (!(data57 % 1) && !isNaN(data57))) && (isFinite(data57)))){
const err166 = {instancePath:instancePath+"/series/" + i1+"/order",schemaPath:"#/$defs/series/properties/order/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err166];
}
else {
vErrors.push(err166);
}
errors++;
}
if((typeof data57 == "number") && (isFinite(data57))){
if(data57 < 0 || isNaN(data57)){
const err167 = {instancePath:instancePath+"/series/" + i1+"/order",schemaPath:"#/$defs/series/properties/order/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err167];
}
else {
vErrors.push(err167);
}
errors++;
}
}
}
if(data51.mode !== undefined){
let data58 = data51.mode;
if(!(((data58 === "line") || (data58 === "points")) || (data58 === "line-points"))){
const err168 = {instancePath:instancePath+"/series/" + i1+"/mode",schemaPath:"#/$defs/series/properties/mode/enum",keyword:"enum",params:{allowedValues: schema48.properties.mode.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err168];
}
else {
vErrors.push(err168);
}
errors++;
}
}
if(data51.style !== undefined){
let data59 = data51.style;
if(data59 && typeof data59 == "object" && !Array.isArray(data59)){
if(data59.stroke === undefined){
const err169 = {instancePath:instancePath+"/series/" + i1+"/style",schemaPath:"#/$defs/series/properties/style/required",keyword:"required",params:{missingProperty: "stroke"},message:"must have required property '"+"stroke"+"'"};
if(vErrors === null){
vErrors = [err169];
}
else {
vErrors.push(err169);
}
errors++;
}
if(data59.strokeWidthPt === undefined){
const err170 = {instancePath:instancePath+"/series/" + i1+"/style",schemaPath:"#/$defs/series/properties/style/required",keyword:"required",params:{missingProperty: "strokeWidthPt"},message:"must have required property '"+"strokeWidthPt"+"'"};
if(vErrors === null){
vErrors = [err170];
}
else {
vErrors.push(err170);
}
errors++;
}
if(data59.opacity === undefined){
const err171 = {instancePath:instancePath+"/series/" + i1+"/style",schemaPath:"#/$defs/series/properties/style/required",keyword:"required",params:{missingProperty: "opacity"},message:"must have required property '"+"opacity"+"'"};
if(vErrors === null){
vErrors = [err171];
}
else {
vErrors.push(err171);
}
errors++;
}
if(data59.dash === undefined){
const err172 = {instancePath:instancePath+"/series/" + i1+"/style",schemaPath:"#/$defs/series/properties/style/required",keyword:"required",params:{missingProperty: "dash"},message:"must have required property '"+"dash"+"'"};
if(vErrors === null){
vErrors = [err172];
}
else {
vErrors.push(err172);
}
errors++;
}
if(data59.markerShape === undefined){
const err173 = {instancePath:instancePath+"/series/" + i1+"/style",schemaPath:"#/$defs/series/properties/style/required",keyword:"required",params:{missingProperty: "markerShape"},message:"must have required property '"+"markerShape"+"'"};
if(vErrors === null){
vErrors = [err173];
}
else {
vErrors.push(err173);
}
errors++;
}
if(data59.markerSizePt === undefined){
const err174 = {instancePath:instancePath+"/series/" + i1+"/style",schemaPath:"#/$defs/series/properties/style/required",keyword:"required",params:{missingProperty: "markerSizePt"},message:"must have required property '"+"markerSizePt"+"'"};
if(vErrors === null){
vErrors = [err174];
}
else {
vErrors.push(err174);
}
errors++;
}
if(data59.markerFill === undefined){
const err175 = {instancePath:instancePath+"/series/" + i1+"/style",schemaPath:"#/$defs/series/properties/style/required",keyword:"required",params:{missingProperty: "markerFill"},message:"must have required property '"+"markerFill"+"'"};
if(vErrors === null){
vErrors = [err175];
}
else {
vErrors.push(err175);
}
errors++;
}
if(data59.markerStroke === undefined){
const err176 = {instancePath:instancePath+"/series/" + i1+"/style",schemaPath:"#/$defs/series/properties/style/required",keyword:"required",params:{missingProperty: "markerStroke"},message:"must have required property '"+"markerStroke"+"'"};
if(vErrors === null){
vErrors = [err176];
}
else {
vErrors.push(err176);
}
errors++;
}
if(data59.markerVisible === undefined){
const err177 = {instancePath:instancePath+"/series/" + i1+"/style",schemaPath:"#/$defs/series/properties/style/required",keyword:"required",params:{missingProperty: "markerVisible"},message:"must have required property '"+"markerVisible"+"'"};
if(vErrors === null){
vErrors = [err177];
}
else {
vErrors.push(err177);
}
errors++;
}
for(const key8 in data59){
if(!(func1.call(schema48.properties.style.properties, key8))){
const err178 = {instancePath:instancePath+"/series/" + i1+"/style",schemaPath:"#/$defs/series/properties/style/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key8},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err178];
}
else {
vErrors.push(err178);
}
errors++;
}
}
if(data59.stroke !== undefined){
let data60 = data59.stroke;
if(typeof data60 === "string"){
if(!pattern7.test(data60)){
const err179 = {instancePath:instancePath+"/series/" + i1+"/style/stroke",schemaPath:"#/$defs/series/properties/style/properties/stroke/pattern",keyword:"pattern",params:{pattern: "^#[0-9A-Fa-f]{6}$"},message:"must match pattern \""+"^#[0-9A-Fa-f]{6}$"+"\""};
if(vErrors === null){
vErrors = [err179];
}
else {
vErrors.push(err179);
}
errors++;
}
}
else {
const err180 = {instancePath:instancePath+"/series/" + i1+"/style/stroke",schemaPath:"#/$defs/series/properties/style/properties/stroke/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err180];
}
else {
vErrors.push(err180);
}
errors++;
}
}
if(data59.strokeWidthPt !== undefined){
let data61 = data59.strokeWidthPt;
if((typeof data61 == "number") && (isFinite(data61))){
if(data61 > 24 || isNaN(data61)){
const err181 = {instancePath:instancePath+"/series/" + i1+"/style/strokeWidthPt",schemaPath:"#/$defs/series/properties/style/properties/strokeWidthPt/maximum",keyword:"maximum",params:{comparison: "<=", limit: 24},message:"must be <= 24"};
if(vErrors === null){
vErrors = [err181];
}
else {
vErrors.push(err181);
}
errors++;
}
if(data61 <= 0 || isNaN(data61)){
const err182 = {instancePath:instancePath+"/series/" + i1+"/style/strokeWidthPt",schemaPath:"#/$defs/series/properties/style/properties/strokeWidthPt/exclusiveMinimum",keyword:"exclusiveMinimum",params:{comparison: ">", limit: 0},message:"must be > 0"};
if(vErrors === null){
vErrors = [err182];
}
else {
vErrors.push(err182);
}
errors++;
}
}
else {
const err183 = {instancePath:instancePath+"/series/" + i1+"/style/strokeWidthPt",schemaPath:"#/$defs/series/properties/style/properties/strokeWidthPt/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err183];
}
else {
vErrors.push(err183);
}
errors++;
}
}
if(data59.opacity !== undefined){
let data62 = data59.opacity;
if((typeof data62 == "number") && (isFinite(data62))){
if(data62 > 1 || isNaN(data62)){
const err184 = {instancePath:instancePath+"/series/" + i1+"/style/opacity",schemaPath:"#/$defs/series/properties/style/properties/opacity/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1},message:"must be <= 1"};
if(vErrors === null){
vErrors = [err184];
}
else {
vErrors.push(err184);
}
errors++;
}
if(data62 < 0 || isNaN(data62)){
const err185 = {instancePath:instancePath+"/series/" + i1+"/style/opacity",schemaPath:"#/$defs/series/properties/style/properties/opacity/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err185];
}
else {
vErrors.push(err185);
}
errors++;
}
}
else {
const err186 = {instancePath:instancePath+"/series/" + i1+"/style/opacity",schemaPath:"#/$defs/series/properties/style/properties/opacity/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err186];
}
else {
vErrors.push(err186);
}
errors++;
}
}
if(data59.dash !== undefined){
let data63 = data59.dash;
if(!((((data63 === "solid") || (data63 === "dash")) || (data63 === "dot")) || (data63 === "dash-dot"))){
const err187 = {instancePath:instancePath+"/series/" + i1+"/style/dash",schemaPath:"#/$defs/series/properties/style/properties/dash/enum",keyword:"enum",params:{allowedValues: schema48.properties.style.properties.dash.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err187];
}
else {
vErrors.push(err187);
}
errors++;
}
}
if(data59.markerShape !== undefined){
let data64 = data59.markerShape;
if(!((((((data64 === "circle") || (data64 === "square")) || (data64 === "triangle")) || (data64 === "diamond")) || (data64 === "cross")) || (data64 === "plus"))){
const err188 = {instancePath:instancePath+"/series/" + i1+"/style/markerShape",schemaPath:"#/$defs/series/properties/style/properties/markerShape/enum",keyword:"enum",params:{allowedValues: schema48.properties.style.properties.markerShape.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err188];
}
else {
vErrors.push(err188);
}
errors++;
}
}
if(data59.markerSizePt !== undefined){
let data65 = data59.markerSizePt;
if((typeof data65 == "number") && (isFinite(data65))){
if(data65 > 32 || isNaN(data65)){
const err189 = {instancePath:instancePath+"/series/" + i1+"/style/markerSizePt",schemaPath:"#/$defs/series/properties/style/properties/markerSizePt/maximum",keyword:"maximum",params:{comparison: "<=", limit: 32},message:"must be <= 32"};
if(vErrors === null){
vErrors = [err189];
}
else {
vErrors.push(err189);
}
errors++;
}
if(data65 < 0 || isNaN(data65)){
const err190 = {instancePath:instancePath+"/series/" + i1+"/style/markerSizePt",schemaPath:"#/$defs/series/properties/style/properties/markerSizePt/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err190];
}
else {
vErrors.push(err190);
}
errors++;
}
}
else {
const err191 = {instancePath:instancePath+"/series/" + i1+"/style/markerSizePt",schemaPath:"#/$defs/series/properties/style/properties/markerSizePt/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err191];
}
else {
vErrors.push(err191);
}
errors++;
}
}
if(data59.markerFill !== undefined){
let data66 = data59.markerFill;
if(typeof data66 === "string"){
if(!pattern7.test(data66)){
const err192 = {instancePath:instancePath+"/series/" + i1+"/style/markerFill",schemaPath:"#/$defs/series/properties/style/properties/markerFill/pattern",keyword:"pattern",params:{pattern: "^#[0-9A-Fa-f]{6}$"},message:"must match pattern \""+"^#[0-9A-Fa-f]{6}$"+"\""};
if(vErrors === null){
vErrors = [err192];
}
else {
vErrors.push(err192);
}
errors++;
}
}
else {
const err193 = {instancePath:instancePath+"/series/" + i1+"/style/markerFill",schemaPath:"#/$defs/series/properties/style/properties/markerFill/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err193];
}
else {
vErrors.push(err193);
}
errors++;
}
}
if(data59.markerStroke !== undefined){
let data67 = data59.markerStroke;
if(typeof data67 === "string"){
if(!pattern7.test(data67)){
const err194 = {instancePath:instancePath+"/series/" + i1+"/style/markerStroke",schemaPath:"#/$defs/series/properties/style/properties/markerStroke/pattern",keyword:"pattern",params:{pattern: "^#[0-9A-Fa-f]{6}$"},message:"must match pattern \""+"^#[0-9A-Fa-f]{6}$"+"\""};
if(vErrors === null){
vErrors = [err194];
}
else {
vErrors.push(err194);
}
errors++;
}
}
else {
const err195 = {instancePath:instancePath+"/series/" + i1+"/style/markerStroke",schemaPath:"#/$defs/series/properties/style/properties/markerStroke/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err195];
}
else {
vErrors.push(err195);
}
errors++;
}
}
if(data59.markerVisible !== undefined){
if(typeof data59.markerVisible !== "boolean"){
const err196 = {instancePath:instancePath+"/series/" + i1+"/style/markerVisible",schemaPath:"#/$defs/series/properties/style/properties/markerVisible/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err196];
}
else {
vErrors.push(err196);
}
errors++;
}
}
}
else {
const err197 = {instancePath:instancePath+"/series/" + i1+"/style",schemaPath:"#/$defs/series/properties/style/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err197];
}
else {
vErrors.push(err197);
}
errors++;
}
}
}
else {
const err198 = {instancePath:instancePath+"/series/" + i1,schemaPath:"#/$defs/series/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err198];
}
else {
vErrors.push(err198);
}
errors++;
}
}
}
else {
const err199 = {instancePath:instancePath+"/series",schemaPath:"#/properties/series/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err199];
}
else {
vErrors.push(err199);
}
errors++;
}
}
if(data.objects !== undefined){
let data69 = data.objects;
if(Array.isArray(data69)){
if(data69.length > 100000){
const err200 = {instancePath:instancePath+"/objects",schemaPath:"#/properties/objects/maxItems",keyword:"maxItems",params:{limit: 100000},message:"must NOT have more than 100000 items"};
if(vErrors === null){
vErrors = [err200];
}
else {
vErrors.push(err200);
}
errors++;
}
const len2 = data69.length;
for(let i2=0; i2<len2; i2++){
if(!(validate30(data69[i2], {instancePath:instancePath+"/objects/" + i2,parentData:data69,parentDataProperty:i2,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate30.errors : vErrors.concat(validate30.errors);
errors = vErrors.length;
}
}
}
else {
const err201 = {instancePath:instancePath+"/objects",schemaPath:"#/properties/objects/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err201];
}
else {
vErrors.push(err201);
}
errors++;
}
}
if(data.calculations !== undefined){
let data71 = data.calculations;
if(Array.isArray(data71)){
if(data71.length > 10000){
const err202 = {instancePath:instancePath+"/calculations",schemaPath:"#/properties/calculations/maxItems",keyword:"maxItems",params:{limit: 10000},message:"must NOT have more than 10000 items"};
if(vErrors === null){
vErrors = [err202];
}
else {
vErrors.push(err202);
}
errors++;
}
const len3 = data71.length;
for(let i3=0; i3<len3; i3++){
if(!(validate32(data71[i3], {instancePath:instancePath+"/calculations/" + i3,parentData:data71,parentDataProperty:i3,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate32.errors : vErrors.concat(validate32.errors);
errors = vErrors.length;
}
}
}
else {
const err203 = {instancePath:instancePath+"/calculations",schemaPath:"#/properties/calculations/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err203];
}
else {
vErrors.push(err203);
}
errors++;
}
}
if(data.legend !== undefined){
let data73 = data.legend;
if(data73 && typeof data73 == "object" && !Array.isArray(data73)){
if(data73.visible === undefined){
const err204 = {instancePath:instancePath+"/legend",schemaPath:"#/properties/legend/required",keyword:"required",params:{missingProperty: "visible"},message:"must have required property '"+"visible"+"'"};
if(vErrors === null){
vErrors = [err204];
}
else {
vErrors.push(err204);
}
errors++;
}
if(data73.anchor === undefined){
const err205 = {instancePath:instancePath+"/legend",schemaPath:"#/properties/legend/required",keyword:"required",params:{missingProperty: "anchor"},message:"must have required property '"+"anchor"+"'"};
if(vErrors === null){
vErrors = [err205];
}
else {
vErrors.push(err205);
}
errors++;
}
for(const key9 in data73){
if(!((key9 === "visible") || (key9 === "anchor"))){
const err206 = {instancePath:instancePath+"/legend",schemaPath:"#/properties/legend/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key9},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err206];
}
else {
vErrors.push(err206);
}
errors++;
}
}
if(data73.visible !== undefined){
if(typeof data73.visible !== "boolean"){
const err207 = {instancePath:instancePath+"/legend/visible",schemaPath:"#/properties/legend/properties/visible/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err207];
}
else {
vErrors.push(err207);
}
errors++;
}
}
if(data73.anchor !== undefined){
let data75 = data73.anchor;
const _errs150 = errors;
let valid22 = false;
let passing0 = null;
const _errs151 = errors;
if(data75 && typeof data75 == "object" && !Array.isArray(data75)){
if(data75.mode === undefined){
const err208 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/0/required",keyword:"required",params:{missingProperty: "mode"},message:"must have required property '"+"mode"+"'"};
if(vErrors === null){
vErrors = [err208];
}
else {
vErrors.push(err208);
}
errors++;
}
if(data75.x === undefined){
const err209 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/0/required",keyword:"required",params:{missingProperty: "x"},message:"must have required property '"+"x"+"'"};
if(vErrors === null){
vErrors = [err209];
}
else {
vErrors.push(err209);
}
errors++;
}
if(data75.y === undefined){
const err210 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/0/required",keyword:"required",params:{missingProperty: "y"},message:"must have required property '"+"y"+"'"};
if(vErrors === null){
vErrors = [err210];
}
else {
vErrors.push(err210);
}
errors++;
}
for(const key10 in data75){
if(!(((key10 === "mode") || (key10 === "x")) || (key10 === "y"))){
const err211 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/0/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key10},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err211];
}
else {
vErrors.push(err211);
}
errors++;
}
}
if(data75.mode !== undefined){
if("data" !== data75.mode){
const err212 = {instancePath:instancePath+"/legend/anchor/mode",schemaPath:"#/$defs/anchor/oneOf/0/properties/mode/const",keyword:"const",params:{allowedValue: "data"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err212];
}
else {
vErrors.push(err212);
}
errors++;
}
}
if(data75.x !== undefined){
let data77 = data75.x;
if(!((typeof data77 == "number") && (isFinite(data77)))){
const err213 = {instancePath:instancePath+"/legend/anchor/x",schemaPath:"#/$defs/anchor/oneOf/0/properties/x/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err213];
}
else {
vErrors.push(err213);
}
errors++;
}
}
if(data75.y !== undefined){
let data78 = data75.y;
if(!((typeof data78 == "number") && (isFinite(data78)))){
const err214 = {instancePath:instancePath+"/legend/anchor/y",schemaPath:"#/$defs/anchor/oneOf/0/properties/y/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err214];
}
else {
vErrors.push(err214);
}
errors++;
}
}
}
else {
const err215 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err215];
}
else {
vErrors.push(err215);
}
errors++;
}
var _valid0 = _errs151 === errors;
if(_valid0){
valid22 = true;
passing0 = 0;
var props0 = true;
}
const _errs159 = errors;
if(data75 && typeof data75 == "object" && !Array.isArray(data75)){
if(data75.mode === undefined){
const err216 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/1/required",keyword:"required",params:{missingProperty: "mode"},message:"must have required property '"+"mode"+"'"};
if(vErrors === null){
vErrors = [err216];
}
else {
vErrors.push(err216);
}
errors++;
}
if(data75.pageX === undefined){
const err217 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/1/required",keyword:"required",params:{missingProperty: "pageX"},message:"must have required property '"+"pageX"+"'"};
if(vErrors === null){
vErrors = [err217];
}
else {
vErrors.push(err217);
}
errors++;
}
if(data75.pageY === undefined){
const err218 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/1/required",keyword:"required",params:{missingProperty: "pageY"},message:"must have required property '"+"pageY"+"'"};
if(vErrors === null){
vErrors = [err218];
}
else {
vErrors.push(err218);
}
errors++;
}
for(const key11 in data75){
if(!(((key11 === "mode") || (key11 === "pageX")) || (key11 === "pageY"))){
const err219 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/1/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key11},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err219];
}
else {
vErrors.push(err219);
}
errors++;
}
}
if(data75.mode !== undefined){
if("page" !== data75.mode){
const err220 = {instancePath:instancePath+"/legend/anchor/mode",schemaPath:"#/$defs/anchor/oneOf/1/properties/mode/const",keyword:"const",params:{allowedValue: "page"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err220];
}
else {
vErrors.push(err220);
}
errors++;
}
}
if(data75.pageX !== undefined){
let data80 = data75.pageX;
if((typeof data80 == "number") && (isFinite(data80))){
if(data80 > 1 || isNaN(data80)){
const err221 = {instancePath:instancePath+"/legend/anchor/pageX",schemaPath:"#/$defs/anchor/oneOf/1/properties/pageX/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1},message:"must be <= 1"};
if(vErrors === null){
vErrors = [err221];
}
else {
vErrors.push(err221);
}
errors++;
}
if(data80 < 0 || isNaN(data80)){
const err222 = {instancePath:instancePath+"/legend/anchor/pageX",schemaPath:"#/$defs/anchor/oneOf/1/properties/pageX/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err222];
}
else {
vErrors.push(err222);
}
errors++;
}
}
else {
const err223 = {instancePath:instancePath+"/legend/anchor/pageX",schemaPath:"#/$defs/anchor/oneOf/1/properties/pageX/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err223];
}
else {
vErrors.push(err223);
}
errors++;
}
}
if(data75.pageY !== undefined){
let data81 = data75.pageY;
if((typeof data81 == "number") && (isFinite(data81))){
if(data81 > 1 || isNaN(data81)){
const err224 = {instancePath:instancePath+"/legend/anchor/pageY",schemaPath:"#/$defs/anchor/oneOf/1/properties/pageY/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1},message:"must be <= 1"};
if(vErrors === null){
vErrors = [err224];
}
else {
vErrors.push(err224);
}
errors++;
}
if(data81 < 0 || isNaN(data81)){
const err225 = {instancePath:instancePath+"/legend/anchor/pageY",schemaPath:"#/$defs/anchor/oneOf/1/properties/pageY/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err225];
}
else {
vErrors.push(err225);
}
errors++;
}
}
else {
const err226 = {instancePath:instancePath+"/legend/anchor/pageY",schemaPath:"#/$defs/anchor/oneOf/1/properties/pageY/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err226];
}
else {
vErrors.push(err226);
}
errors++;
}
}
}
else {
const err227 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/1/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err227];
}
else {
vErrors.push(err227);
}
errors++;
}
var _valid0 = _errs159 === errors;
if(_valid0 && valid22){
valid22 = false;
passing0 = [passing0, 1];
}
else {
if(_valid0){
valid22 = true;
passing0 = 1;
if(props0 !== true){
props0 = true;
}
}
const _errs167 = errors;
if(data75 && typeof data75 == "object" && !Array.isArray(data75)){
if(data75.mode === undefined){
const err228 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/2/required",keyword:"required",params:{missingProperty: "mode"},message:"must have required property '"+"mode"+"'"};
if(vErrors === null){
vErrors = [err228];
}
else {
vErrors.push(err228);
}
errors++;
}
if(data75.datasetId === undefined){
const err229 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/2/required",keyword:"required",params:{missingProperty: "datasetId"},message:"must have required property '"+"datasetId"+"'"};
if(vErrors === null){
vErrors = [err229];
}
else {
vErrors.push(err229);
}
errors++;
}
if(data75.pointId === undefined){
const err230 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/2/required",keyword:"required",params:{missingProperty: "pointId"},message:"must have required property '"+"pointId"+"'"};
if(vErrors === null){
vErrors = [err230];
}
else {
vErrors.push(err230);
}
errors++;
}
if(data75.fallbackX === undefined){
const err231 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/2/required",keyword:"required",params:{missingProperty: "fallbackX"},message:"must have required property '"+"fallbackX"+"'"};
if(vErrors === null){
vErrors = [err231];
}
else {
vErrors.push(err231);
}
errors++;
}
if(data75.fallbackY === undefined){
const err232 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/2/required",keyword:"required",params:{missingProperty: "fallbackY"},message:"must have required property '"+"fallbackY"+"'"};
if(vErrors === null){
vErrors = [err232];
}
else {
vErrors.push(err232);
}
errors++;
}
if(data75.offsetXpx === undefined){
const err233 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/2/required",keyword:"required",params:{missingProperty: "offsetXpx"},message:"must have required property '"+"offsetXpx"+"'"};
if(vErrors === null){
vErrors = [err233];
}
else {
vErrors.push(err233);
}
errors++;
}
if(data75.offsetYpx === undefined){
const err234 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/2/required",keyword:"required",params:{missingProperty: "offsetYpx"},message:"must have required property '"+"offsetYpx"+"'"};
if(vErrors === null){
vErrors = [err234];
}
else {
vErrors.push(err234);
}
errors++;
}
for(const key12 in data75){
if(!(((((((key12 === "mode") || (key12 === "datasetId")) || (key12 === "pointId")) || (key12 === "fallbackX")) || (key12 === "fallbackY")) || (key12 === "offsetXpx")) || (key12 === "offsetYpx"))){
const err235 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/2/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key12},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err235];
}
else {
vErrors.push(err235);
}
errors++;
}
}
if(data75.mode !== undefined){
if("point" !== data75.mode){
const err236 = {instancePath:instancePath+"/legend/anchor/mode",schemaPath:"#/$defs/anchor/oneOf/2/properties/mode/const",keyword:"const",params:{allowedValue: "point"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err236];
}
else {
vErrors.push(err236);
}
errors++;
}
}
if(data75.datasetId !== undefined){
let data83 = data75.datasetId;
if(typeof data83 === "string"){
if(!pattern6.test(data83)){
const err237 = {instancePath:instancePath+"/legend/anchor/datasetId",schemaPath:"#/$defs/anchor/oneOf/2/properties/datasetId/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"+"\""};
if(vErrors === null){
vErrors = [err237];
}
else {
vErrors.push(err237);
}
errors++;
}
}
else {
const err238 = {instancePath:instancePath+"/legend/anchor/datasetId",schemaPath:"#/$defs/anchor/oneOf/2/properties/datasetId/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err238];
}
else {
vErrors.push(err238);
}
errors++;
}
}
if(data75.pointId !== undefined){
let data84 = data75.pointId;
if(typeof data84 === "string"){
if(!pattern6.test(data84)){
const err239 = {instancePath:instancePath+"/legend/anchor/pointId",schemaPath:"#/$defs/anchor/oneOf/2/properties/pointId/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"+"\""};
if(vErrors === null){
vErrors = [err239];
}
else {
vErrors.push(err239);
}
errors++;
}
}
else {
const err240 = {instancePath:instancePath+"/legend/anchor/pointId",schemaPath:"#/$defs/anchor/oneOf/2/properties/pointId/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err240];
}
else {
vErrors.push(err240);
}
errors++;
}
}
if(data75.fallbackX !== undefined){
let data85 = data75.fallbackX;
if(!((typeof data85 == "number") && (isFinite(data85)))){
const err241 = {instancePath:instancePath+"/legend/anchor/fallbackX",schemaPath:"#/$defs/anchor/oneOf/2/properties/fallbackX/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err241];
}
else {
vErrors.push(err241);
}
errors++;
}
}
if(data75.fallbackY !== undefined){
let data86 = data75.fallbackY;
if(!((typeof data86 == "number") && (isFinite(data86)))){
const err242 = {instancePath:instancePath+"/legend/anchor/fallbackY",schemaPath:"#/$defs/anchor/oneOf/2/properties/fallbackY/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err242];
}
else {
vErrors.push(err242);
}
errors++;
}
}
if(data75.offsetXpx !== undefined){
let data87 = data75.offsetXpx;
if(!((typeof data87 == "number") && (isFinite(data87)))){
const err243 = {instancePath:instancePath+"/legend/anchor/offsetXpx",schemaPath:"#/$defs/anchor/oneOf/2/properties/offsetXpx/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err243];
}
else {
vErrors.push(err243);
}
errors++;
}
}
if(data75.offsetYpx !== undefined){
let data88 = data75.offsetYpx;
if(!((typeof data88 == "number") && (isFinite(data88)))){
const err244 = {instancePath:instancePath+"/legend/anchor/offsetYpx",schemaPath:"#/$defs/anchor/oneOf/2/properties/offsetYpx/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err244];
}
else {
vErrors.push(err244);
}
errors++;
}
}
}
else {
const err245 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/2/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err245];
}
else {
vErrors.push(err245);
}
errors++;
}
var _valid0 = _errs167 === errors;
if(_valid0 && valid22){
valid22 = false;
passing0 = [passing0, 2];
}
else {
if(_valid0){
valid22 = true;
passing0 = 2;
if(props0 !== true){
props0 = true;
}
}
}
}
if(!valid22){
const err246 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf",keyword:"oneOf",params:{passingSchemas: passing0},message:"must match exactly one schema in oneOf"};
if(vErrors === null){
vErrors = [err246];
}
else {
vErrors.push(err246);
}
errors++;
}
else {
errors = _errs150;
if(vErrors !== null){
if(_errs150){
vErrors.length = _errs150;
}
else {
vErrors = null;
}
}
}
}
}
else {
const err247 = {instancePath:instancePath+"/legend",schemaPath:"#/properties/legend/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err247];
}
else {
vErrors.push(err247);
}
errors++;
}
}
if(data.viewport !== undefined){
let data89 = data.viewport;
if(data89 && typeof data89 == "object" && !Array.isArray(data89)){
if(data89.xMin === undefined){
const err248 = {instancePath:instancePath+"/viewport",schemaPath:"#/properties/viewport/required",keyword:"required",params:{missingProperty: "xMin"},message:"must have required property '"+"xMin"+"'"};
if(vErrors === null){
vErrors = [err248];
}
else {
vErrors.push(err248);
}
errors++;
}
if(data89.xMax === undefined){
const err249 = {instancePath:instancePath+"/viewport",schemaPath:"#/properties/viewport/required",keyword:"required",params:{missingProperty: "xMax"},message:"must have required property '"+"xMax"+"'"};
if(vErrors === null){
vErrors = [err249];
}
else {
vErrors.push(err249);
}
errors++;
}
if(data89.yMin === undefined){
const err250 = {instancePath:instancePath+"/viewport",schemaPath:"#/properties/viewport/required",keyword:"required",params:{missingProperty: "yMin"},message:"must have required property '"+"yMin"+"'"};
if(vErrors === null){
vErrors = [err250];
}
else {
vErrors.push(err250);
}
errors++;
}
if(data89.yMax === undefined){
const err251 = {instancePath:instancePath+"/viewport",schemaPath:"#/properties/viewport/required",keyword:"required",params:{missingProperty: "yMax"},message:"must have required property '"+"yMax"+"'"};
if(vErrors === null){
vErrors = [err251];
}
else {
vErrors.push(err251);
}
errors++;
}
for(const key13 in data89){
if(!((((key13 === "xMin") || (key13 === "xMax")) || (key13 === "yMin")) || (key13 === "yMax"))){
const err252 = {instancePath:instancePath+"/viewport",schemaPath:"#/properties/viewport/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key13},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err252];
}
else {
vErrors.push(err252);
}
errors++;
}
}
if(data89.xMin !== undefined){
let data90 = data89.xMin;
if(!((typeof data90 == "number") && (isFinite(data90)))){
const err253 = {instancePath:instancePath+"/viewport/xMin",schemaPath:"#/properties/viewport/properties/xMin/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err253];
}
else {
vErrors.push(err253);
}
errors++;
}
}
if(data89.xMax !== undefined){
let data91 = data89.xMax;
if(!((typeof data91 == "number") && (isFinite(data91)))){
const err254 = {instancePath:instancePath+"/viewport/xMax",schemaPath:"#/properties/viewport/properties/xMax/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err254];
}
else {
vErrors.push(err254);
}
errors++;
}
}
if(data89.yMin !== undefined){
let data92 = data89.yMin;
if(!((typeof data92 == "number") && (isFinite(data92)))){
const err255 = {instancePath:instancePath+"/viewport/yMin",schemaPath:"#/properties/viewport/properties/yMin/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err255];
}
else {
vErrors.push(err255);
}
errors++;
}
}
if(data89.yMax !== undefined){
let data93 = data89.yMax;
if(!((typeof data93 == "number") && (isFinite(data93)))){
const err256 = {instancePath:instancePath+"/viewport/yMax",schemaPath:"#/properties/viewport/properties/yMax/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err256];
}
else {
vErrors.push(err256);
}
errors++;
}
}
}
else {
const err257 = {instancePath:instancePath+"/viewport",schemaPath:"#/properties/viewport/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err257];
}
else {
vErrors.push(err257);
}
errors++;
}
}
if(data.editor !== undefined){
let data94 = data.editor;
if(data94 && typeof data94 == "object" && !Array.isArray(data94)){
if(data94.selectedObjectId === undefined){
const err258 = {instancePath:instancePath+"/editor",schemaPath:"#/properties/editor/required",keyword:"required",params:{missingProperty: "selectedObjectId"},message:"must have required property '"+"selectedObjectId"+"'"};
if(vErrors === null){
vErrors = [err258];
}
else {
vErrors.push(err258);
}
errors++;
}
if(data94.showPointMarkers === undefined){
const err259 = {instancePath:instancePath+"/editor",schemaPath:"#/properties/editor/required",keyword:"required",params:{missingProperty: "showPointMarkers"},message:"must have required property '"+"showPointMarkers"+"'"};
if(vErrors === null){
vErrors = [err259];
}
else {
vErrors.push(err259);
}
errors++;
}
for(const key14 in data94){
if(!((key14 === "selectedObjectId") || (key14 === "showPointMarkers"))){
const err260 = {instancePath:instancePath+"/editor",schemaPath:"#/properties/editor/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key14},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err260];
}
else {
vErrors.push(err260);
}
errors++;
}
}
if(data94.selectedObjectId !== undefined){
let data95 = data94.selectedObjectId;
const _errs198 = errors;
let valid28 = false;
const _errs199 = errors;
if(typeof data95 === "string"){
if(!pattern6.test(data95)){
const err261 = {instancePath:instancePath+"/editor/selectedObjectId",schemaPath:"#/properties/editor/properties/selectedObjectId/anyOf/0/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"+"\""};
if(vErrors === null){
vErrors = [err261];
}
else {
vErrors.push(err261);
}
errors++;
}
}
else {
const err262 = {instancePath:instancePath+"/editor/selectedObjectId",schemaPath:"#/properties/editor/properties/selectedObjectId/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err262];
}
else {
vErrors.push(err262);
}
errors++;
}
var _valid1 = _errs199 === errors;
valid28 = valid28 || _valid1;
const _errs201 = errors;
if(data95 !== null){
const err263 = {instancePath:instancePath+"/editor/selectedObjectId",schemaPath:"#/properties/editor/properties/selectedObjectId/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err263];
}
else {
vErrors.push(err263);
}
errors++;
}
var _valid1 = _errs201 === errors;
valid28 = valid28 || _valid1;
if(!valid28){
const err264 = {instancePath:instancePath+"/editor/selectedObjectId",schemaPath:"#/properties/editor/properties/selectedObjectId/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err264];
}
else {
vErrors.push(err264);
}
errors++;
}
else {
errors = _errs198;
if(vErrors !== null){
if(_errs198){
vErrors.length = _errs198;
}
else {
vErrors = null;
}
}
}
}
if(data94.showPointMarkers !== undefined){
if(typeof data94.showPointMarkers !== "boolean"){
const err265 = {instancePath:instancePath+"/editor/showPointMarkers",schemaPath:"#/properties/editor/properties/showPointMarkers/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err265];
}
else {
vErrors.push(err265);
}
errors++;
}
}
}
else {
const err266 = {instancePath:instancePath+"/editor",schemaPath:"#/properties/editor/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err266];
}
else {
vErrors.push(err266);
}
errors++;
}
}
if(data.extensions !== undefined){
let data97 = data.extensions;
if(data97 && typeof data97 == "object" && !Array.isArray(data97)){
}
else {
const err267 = {instancePath:instancePath+"/extensions",schemaPath:"#/properties/extensions/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err267];
}
else {
vErrors.push(err267);
}
errors++;
}
}
}
else {
const err268 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err268];
}
else {
vErrors.push(err268);
}
errors++;
}
validate27.errors = vErrors;
return errors === 0;
}
validate27.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema55 = {"$schema":"https://json-schema.org/draft/2020-12/schema","$id":"https://github.com/anatamien/APIO-GRAPH/blob/main/schemas/aph-1.2.schema.json","title":"APIO GRAPH project file v1.2","description":"Self-contained UTF-8 JSON project. Referential and numeric semantic validation is additionally required.","type":"object","additionalProperties":false,"properties":{"format":{"const":"APIO_GRAPH_PROJECT"},"schemaVersion":{"type":"string","pattern":"^1\\.2\\.[0-9]+$"},"createdWith":{"type":"object","additionalProperties":false,"properties":{"name":{"const":"APIO GRAPH"},"version":{"type":"string","minLength":1}},"required":["name","version"]},"project":{"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"title":{"type":"string","maxLength":300},"createdAt":{"type":"string","format":"date-time"},"updatedAt":{"type":"string","format":"date-time"}},"required":["id","title","createdAt","updatedAt"]},"page":{"type":"object","additionalProperties":false,"properties":{"widthPx":{"type":"integer","minimum":100,"maximum":30000},"heightPx":{"type":"integer","minimum":100,"maximum":30000},"background":{"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"},"paddingPx":{"type":"number","minimum":0,"maximum":2000}},"required":["widthPx","heightPx","background","paddingPx"]},"axes":{"type":"object","additionalProperties":false,"properties":{"x":{"$ref":"#/$defs/axis"},"y":{"$ref":"#/$defs/axis"}},"required":["x","y"]},"datasets":{"type":"array","items":{"$ref":"#/$defs/dataset"},"maxItems":1000},"series":{"type":"array","items":{"$ref":"#/$defs/series"},"maxItems":1000},"objects":{"type":"array","items":{"$ref":"#/$defs/drawObject"},"maxItems":100000},"calculations":{"type":"array","items":{"$ref":"#/$defs/calculation"},"maxItems":10000},"legend":{"type":"object","additionalProperties":false,"properties":{"visible":{"type":"boolean"},"anchor":{"$ref":"#/$defs/anchor"}},"required":["visible","anchor"]},"viewport":{"type":"object","additionalProperties":false,"properties":{"xMin":{"type":"number"},"xMax":{"type":"number"},"yMin":{"type":"number"},"yMax":{"type":"number"}},"required":["xMin","xMax","yMin","yMax"]},"editor":{"type":"object","additionalProperties":false,"properties":{"selectedObjectId":{"anyOf":[{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},{"type":"null"}]},"showPointMarkers":{"type":"boolean"}},"required":["selectedObjectId","showPointMarkers"]},"extensions":{"type":"object","additionalProperties":true}},"required":["format","schemaVersion","createdWith","project","page","axes","datasets","series","objects","calculations","legend","viewport","editor","extensions"],"$defs":{"point":{"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"x":{"type":"number"},"y":{"type":"number"}},"required":["id","x","y"]},"anchor":{"oneOf":[{"type":"object","additionalProperties":false,"properties":{"mode":{"const":"data"},"x":{"type":"number"},"y":{"type":"number"}},"required":["mode","x","y"]},{"type":"object","additionalProperties":false,"properties":{"mode":{"const":"page"},"pageX":{"type":"number","minimum":0,"maximum":1},"pageY":{"type":"number","minimum":0,"maximum":1}},"required":["mode","pageX","pageY"]},{"type":"object","additionalProperties":false,"properties":{"mode":{"const":"point"},"datasetId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"pointId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"fallbackX":{"type":"number"},"fallbackY":{"type":"number"},"offsetXpx":{"type":"number"},"offsetYpx":{"type":"number"}},"required":["mode","datasetId","pointId","fallbackX","fallbackY","offsetXpx","offsetYpx"]}]},"axis":{"type":"object","additionalProperties":false,"properties":{"label":{"type":"string","maxLength":500},"unit":{"type":"string","maxLength":100},"scale":{"const":"linear"},"mode":{"enum":["auto","manual"]},"min":{"type":"number"},"max":{"type":"number"},"tickMode":{"enum":["auto","manual"]},"tickStep":{"type":"number","exclusiveMinimum":0},"tickOrigin":{"type":"number"},"minorDivisions":{"type":"integer","minimum":0,"maximum":20},"grid":{"type":"boolean"},"numberFormat":{"enum":["auto","fixed","scientific"]},"precision":{"type":"integer","minimum":0,"maximum":15},"strokeWidthPt":{"type":"number","exclusiveMinimum":0,"maximum":24},"labelSizePt":{"type":"number","minimum":6,"maximum":72}},"required":["label","unit","scale","mode","min","max","tickMode","tickStep","tickOrigin","minorDivisions","grid","numberFormat","precision","strokeWidthPt","labelSizePt"]},"dataset":{"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"name":{"type":"string","maxLength":300},"role":{"enum":["raw","derived"]},"source":{"type":"object","additionalProperties":false,"properties":{"kind":{"enum":["import","clipboard","manual","calculation"]},"displayName":{"type":"string","maxLength":300},"calculationId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"}},"required":["kind"]},"points":{"type":"array","items":{"$ref":"#/$defs/point"},"maxItems":1000000}},"required":["id","name","role","source","points"]},"series":{"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"datasetId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"name":{"type":"string","maxLength":300},"visible":{"type":"boolean"},"includeInAutoRange":{"type":"boolean"},"order":{"type":"integer","minimum":0},"mode":{"enum":["line","points","line-points"]},"style":{"type":"object","additionalProperties":false,"properties":{"stroke":{"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"},"strokeWidthPt":{"type":"number","exclusiveMinimum":0,"maximum":24},"opacity":{"type":"number","minimum":0,"maximum":1},"dash":{"enum":["solid","dash","dot","dash-dot"]},"markerShape":{"enum":["circle","square","triangle","diamond","cross","plus"]},"markerSizePt":{"type":"number","minimum":0,"maximum":32},"markerFill":{"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"},"markerStroke":{"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"},"markerVisible":{"type":"boolean"}},"required":["stroke","strokeWidthPt","opacity","dash","markerShape","markerSizePt","markerFill","markerStroke","markerVisible"]}},"required":["id","datasetId","name","visible","includeInAutoRange","order","mode","style"]},"drawObject":{"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"type":{"enum":["text","segment","line","arrow","callout","rectangle","range-x","range-y","marker","table"]},"name":{"type":"string","maxLength":300},"anchors":{"type":"array","items":{"$ref":"#/$defs/anchor"},"minItems":1,"maxItems":2},"geometry":{"type":"object","additionalProperties":false,"properties":{"directionX":{"type":"number"},"directionY":{"type":"number"},"widthPx":{"type":"number","minimum":16,"maximum":600000},"heightPx":{"type":"number","minimum":16,"maximum":1500000}},"required":[]},"text":{"type":"array","items":{"$ref":"#/$defs/textPart"},"maxItems":1000},"style":{"type":"object","additionalProperties":false,"properties":{"stroke":{"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"},"strokeWidthPt":{"type":"number","exclusiveMinimum":0,"maximum":24},"dash":{"enum":["solid","dash","dot","dash-dot"]},"strokeOpacity":{"type":"number","minimum":0,"maximum":1},"fill":{"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"},"fillOpacity":{"type":"number","minimum":0,"maximum":1},"fontSizePt":{"type":"number","minimum":6,"maximum":72},"fontFamily":{"const":"Courier New"},"arrowHead":{"enum":["none","start","end","both"]},"markerShape":{"enum":["circle","square","triangle","diamond","cross","plus"]},"markerSizePt":{"type":"number","minimum":0,"maximum":32}},"required":["stroke","strokeWidthPt","dash","strokeOpacity","fill","fillOpacity","fontSizePt","fontFamily","arrowHead","markerShape","markerSizePt"]},"zIndex":{"type":"integer"},"visible":{"type":"boolean"},"locked":{"type":"boolean"},"table":{"$ref":"#/$defs/diagramTable"}},"required":["id","type","name","anchors","geometry","text","style","zIndex","visible","locked"],"allOf":[{"if":{"properties":{"type":{"const":"table"}},"required":["type"]},"then":{"required":["table"]},"else":{"not":{"required":["table"]}}}]},"calculation":{"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"kind":{"enum":["linear-fit","polynomial-fit","exponential-fit","power-fit","savitzky-golay","moving-average","derivative","integral","interpolation","statistics","baseline","peaks","area"]},"sourceDatasetIds":{"type":"array","items":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"minItems":1},"resultDatasetId":{"anyOf":[{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},{"type":"null"}]},"parameters":{"type":"object","maxProperties":60,"additionalProperties":{"type":["string","number","integer","boolean","null","array","object"]}},"algorithmVersion":{"type":"integer","minimum":1},"status":{"enum":["valid","outdated","invalid"]},"summary":{"type":"object","maxProperties":60,"additionalProperties":{"type":["string","number","integer","boolean","null"]}},"data":{"type":"object","additionalProperties":false,"properties":{"peaks":{"type":"array","maxItems":1000000,"items":{"$ref":"#/$defs/peakMeasurement"}}}},"display":{"type":"object","additionalProperties":false,"properties":{"visible":{"type":"boolean"},"stroke":{"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"},"opacity":{"type":"number","minimum":0,"maximum":1},"label":{"type":"boolean"}},"required":["visible","stroke","opacity","label"]}},"required":["id","kind","sourceDatasetIds","resultDatasetId","parameters","algorithmVersion","status","summary"]},"textPart":{"type":"object","additionalProperties":false,"properties":{"text":{"type":"string","maxLength":5000},"baseline":{"enum":["normal","sub","super"]},"bold":{"type":"boolean"},"italic":{"type":"boolean"}},"required":["text","baseline","bold","italic"]},"peakMeasurement":{"type":"object","additionalProperties":false,"properties":{"index":{"type":"integer","minimum":0},"x":{"type":"number"},"y":{"type":"number"},"direction":{"enum":["max","min"]},"prominence":{"type":["number","null"],"minimum":0},"width":{"type":["number","null"],"minimum":0},"left":{"type":["number","null"]},"right":{"type":["number","null"]},"level":{"type":["number","null"]},"incomplete":{"type":"boolean"}},"required":["index","x","y","direction","prominence","width","left","right","level","incomplete"]},"diagramTable":{"type":"object","additionalProperties":false,"properties":{"version":{"const":1},"rows":{"type":"array","items":{"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"size":{"type":"number","minimum":16,"maximum":30000}},"required":["id","size"]},"minItems":1,"maxItems":50},"columns":{"type":"array","items":{"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"size":{"type":"number","minimum":16,"maximum":30000}},"required":["id","size"]},"minItems":1,"maxItems":20},"cells":{"type":"array","items":{"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"text":{"type":"array","items":{"$ref":"#/$defs/textPart"},"minItems":0,"maxItems":1000},"align":{"enum":["left","center","right"]},"vertical":{"enum":["top","middle","bottom"]},"fill":{"anyOf":[{"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"},{"type":"null"}]},"color":{"anyOf":[{"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"},{"type":"null"}]},"fontSizePt":{"anyOf":[{"type":"number","minimum":6,"maximum":72},{"type":"null"}]}},"required":["id","text","align","vertical","fill","color","fontSizePt"]},"minItems":1,"maxItems":1000},"merges":{"type":"array","items":{"type":"object","additionalProperties":false,"properties":{"row":{"type":"integer","minimum":0,"maximum":49},"column":{"type":"integer","minimum":0,"maximum":19},"rows":{"type":"integer","minimum":1,"maximum":50},"columns":{"type":"integer","minimum":1,"maximum":20}},"required":["row","column","rows","columns"]},"minItems":0,"maxItems":500},"padding":{"type":"number","minimum":0,"maximum":50},"header":{"type":"boolean"},"fill":{"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"},"headerFill":{"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"},"grid":{"type":"object","additionalProperties":false,"properties":{"visible":{"type":"boolean"},"color":{"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"},"widthPt":{"type":"number","exclusiveMinimum":0,"maximum":24},"dash":{"enum":["solid","dash","dot","dash-dot"]},"horizontal":{"type":"boolean"},"vertical":{"type":"boolean"}},"required":["visible","color","widthPt","dash","horizontal","vertical"]},"fillOpacity":{"type":"number","minimum":0,"maximum":1}},"required":["version","rows","columns","cells","merges","padding","header","fill","headerFill","grid","fillOpacity"]}}};
const schema56 = {"type":"object","additionalProperties":false,"properties":{"label":{"type":"string","maxLength":500},"unit":{"type":"string","maxLength":100},"scale":{"const":"linear"},"mode":{"enum":["auto","manual"]},"min":{"type":"number"},"max":{"type":"number"},"tickMode":{"enum":["auto","manual"]},"tickStep":{"type":"number","exclusiveMinimum":0},"tickOrigin":{"type":"number"},"minorDivisions":{"type":"integer","minimum":0,"maximum":20},"grid":{"type":"boolean"},"numberFormat":{"enum":["auto","fixed","scientific"]},"precision":{"type":"integer","minimum":0,"maximum":15},"strokeWidthPt":{"type":"number","exclusiveMinimum":0,"maximum":24},"labelSizePt":{"type":"number","minimum":6,"maximum":72}},"required":["label","unit","scale","mode","min","max","tickMode","tickStep","tickOrigin","minorDivisions","grid","numberFormat","precision","strokeWidthPt","labelSizePt"]};
const schema60 = {"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"datasetId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"name":{"type":"string","maxLength":300},"visible":{"type":"boolean"},"includeInAutoRange":{"type":"boolean"},"order":{"type":"integer","minimum":0},"mode":{"enum":["line","points","line-points"]},"style":{"type":"object","additionalProperties":false,"properties":{"stroke":{"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"},"strokeWidthPt":{"type":"number","exclusiveMinimum":0,"maximum":24},"opacity":{"type":"number","minimum":0,"maximum":1},"dash":{"enum":["solid","dash","dot","dash-dot"]},"markerShape":{"enum":["circle","square","triangle","diamond","cross","plus"]},"markerSizePt":{"type":"number","minimum":0,"maximum":32},"markerFill":{"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"},"markerStroke":{"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"},"markerVisible":{"type":"boolean"}},"required":["stroke","strokeWidthPt","opacity","dash","markerShape","markerSizePt","markerFill","markerStroke","markerVisible"]}},"required":["id","datasetId","name","visible","includeInAutoRange","order","mode","style"]};
const schema62 = {"oneOf":[{"type":"object","additionalProperties":false,"properties":{"mode":{"const":"data"},"x":{"type":"number"},"y":{"type":"number"}},"required":["mode","x","y"]},{"type":"object","additionalProperties":false,"properties":{"mode":{"const":"page"},"pageX":{"type":"number","minimum":0,"maximum":1},"pageY":{"type":"number","minimum":0,"maximum":1}},"required":["mode","pageX","pageY"]},{"type":"object","additionalProperties":false,"properties":{"mode":{"const":"point"},"datasetId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"pointId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"fallbackX":{"type":"number"},"fallbackY":{"type":"number"},"offsetXpx":{"type":"number"},"offsetYpx":{"type":"number"}},"required":["mode","datasetId","pointId","fallbackX","fallbackY","offsetXpx","offsetYpx"]}]};
const pattern52 = new RegExp("^1\\.2\\.[0-9]+$", "u");
const schema58 = {"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"name":{"type":"string","maxLength":300},"role":{"enum":["raw","derived"]},"source":{"type":"object","additionalProperties":false,"properties":{"kind":{"enum":["import","clipboard","manual","calculation"]},"displayName":{"type":"string","maxLength":300},"calculationId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"}},"required":["kind"]},"points":{"type":"array","items":{"$ref":"#/$defs/point"},"maxItems":1000000}},"required":["id","name","role","source","points"]};
const schema59 = {"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"x":{"type":"number"},"y":{"type":"number"}},"required":["id","x","y"]};

function validate36(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate36.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.id === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.name === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.role === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "role"},message:"must have required property '"+"role"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.source === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "source"},message:"must have required property '"+"source"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.points === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "points"},message:"must have required property '"+"points"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
for(const key0 in data){
if(!(((((key0 === "id") || (key0 === "name")) || (key0 === "role")) || (key0 === "source")) || (key0 === "points"))){
const err5 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
if(data.id !== undefined){
let data0 = data.id;
if(typeof data0 === "string"){
if(!pattern6.test(data0)){
const err6 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"+"\""};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
else {
const err7 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
if(data.name !== undefined){
let data1 = data.name;
if(typeof data1 === "string"){
if(func2(data1) > 300){
const err8 = {instancePath:instancePath+"/name",schemaPath:"#/properties/name/maxLength",keyword:"maxLength",params:{limit: 300},message:"must NOT have more than 300 characters"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
else {
const err9 = {instancePath:instancePath+"/name",schemaPath:"#/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
if(data.role !== undefined){
let data2 = data.role;
if(!((data2 === "raw") || (data2 === "derived"))){
const err10 = {instancePath:instancePath+"/role",schemaPath:"#/properties/role/enum",keyword:"enum",params:{allowedValues: schema58.properties.role.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
if(data.source !== undefined){
let data3 = data.source;
if(data3 && typeof data3 == "object" && !Array.isArray(data3)){
if(data3.kind === undefined){
const err11 = {instancePath:instancePath+"/source",schemaPath:"#/properties/source/required",keyword:"required",params:{missingProperty: "kind"},message:"must have required property '"+"kind"+"'"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
for(const key1 in data3){
if(!(((key1 === "kind") || (key1 === "displayName")) || (key1 === "calculationId"))){
const err12 = {instancePath:instancePath+"/source",schemaPath:"#/properties/source/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
if(data3.kind !== undefined){
let data4 = data3.kind;
if(!((((data4 === "import") || (data4 === "clipboard")) || (data4 === "manual")) || (data4 === "calculation"))){
const err13 = {instancePath:instancePath+"/source/kind",schemaPath:"#/properties/source/properties/kind/enum",keyword:"enum",params:{allowedValues: schema58.properties.source.properties.kind.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
if(data3.displayName !== undefined){
let data5 = data3.displayName;
if(typeof data5 === "string"){
if(func2(data5) > 300){
const err14 = {instancePath:instancePath+"/source/displayName",schemaPath:"#/properties/source/properties/displayName/maxLength",keyword:"maxLength",params:{limit: 300},message:"must NOT have more than 300 characters"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
else {
const err15 = {instancePath:instancePath+"/source/displayName",schemaPath:"#/properties/source/properties/displayName/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
if(data3.calculationId !== undefined){
let data6 = data3.calculationId;
if(typeof data6 === "string"){
if(!pattern6.test(data6)){
const err16 = {instancePath:instancePath+"/source/calculationId",schemaPath:"#/properties/source/properties/calculationId/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"+"\""};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
}
else {
const err17 = {instancePath:instancePath+"/source/calculationId",schemaPath:"#/properties/source/properties/calculationId/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
}
}
else {
const err18 = {instancePath:instancePath+"/source",schemaPath:"#/properties/source/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
}
if(data.points !== undefined){
let data7 = data.points;
if(Array.isArray(data7)){
if(data7.length > 1000000){
const err19 = {instancePath:instancePath+"/points",schemaPath:"#/properties/points/maxItems",keyword:"maxItems",params:{limit: 1000000},message:"must NOT have more than 1000000 items"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
const len0 = data7.length;
for(let i0=0; i0<len0; i0++){
let data8 = data7[i0];
if(data8 && typeof data8 == "object" && !Array.isArray(data8)){
if(data8.id === undefined){
const err20 = {instancePath:instancePath+"/points/" + i0,schemaPath:"#/$defs/point/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
if(data8.x === undefined){
const err21 = {instancePath:instancePath+"/points/" + i0,schemaPath:"#/$defs/point/required",keyword:"required",params:{missingProperty: "x"},message:"must have required property '"+"x"+"'"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
if(data8.y === undefined){
const err22 = {instancePath:instancePath+"/points/" + i0,schemaPath:"#/$defs/point/required",keyword:"required",params:{missingProperty: "y"},message:"must have required property '"+"y"+"'"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
for(const key2 in data8){
if(!(((key2 === "id") || (key2 === "x")) || (key2 === "y"))){
const err23 = {instancePath:instancePath+"/points/" + i0,schemaPath:"#/$defs/point/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key2},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
}
if(data8.id !== undefined){
let data9 = data8.id;
if(typeof data9 === "string"){
if(!pattern6.test(data9)){
const err24 = {instancePath:instancePath+"/points/" + i0+"/id",schemaPath:"#/$defs/point/properties/id/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"+"\""};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
}
else {
const err25 = {instancePath:instancePath+"/points/" + i0+"/id",schemaPath:"#/$defs/point/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
}
if(data8.x !== undefined){
let data10 = data8.x;
if(!((typeof data10 == "number") && (isFinite(data10)))){
const err26 = {instancePath:instancePath+"/points/" + i0+"/x",schemaPath:"#/$defs/point/properties/x/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
}
if(data8.y !== undefined){
let data11 = data8.y;
if(!((typeof data11 == "number") && (isFinite(data11)))){
const err27 = {instancePath:instancePath+"/points/" + i0+"/y",schemaPath:"#/$defs/point/properties/y/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
}
}
else {
const err28 = {instancePath:instancePath+"/points/" + i0,schemaPath:"#/$defs/point/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
}
}
else {
const err29 = {instancePath:instancePath+"/points",schemaPath:"#/properties/points/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
}
}
}
else {
const err30 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err30];
}
else {
vErrors.push(err30);
}
errors++;
}
validate36.errors = vErrors;
return errors === 0;
}
validate36.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema61 = {"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"type":{"enum":["text","segment","line","arrow","callout","rectangle","range-x","range-y","marker","table"]},"name":{"type":"string","maxLength":300},"anchors":{"type":"array","items":{"$ref":"#/$defs/anchor"},"minItems":1,"maxItems":2},"geometry":{"type":"object","additionalProperties":false,"properties":{"directionX":{"type":"number"},"directionY":{"type":"number"},"widthPx":{"type":"number","minimum":16,"maximum":600000},"heightPx":{"type":"number","minimum":16,"maximum":1500000}},"required":[]},"text":{"type":"array","items":{"$ref":"#/$defs/textPart"},"maxItems":1000},"style":{"type":"object","additionalProperties":false,"properties":{"stroke":{"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"},"strokeWidthPt":{"type":"number","exclusiveMinimum":0,"maximum":24},"dash":{"enum":["solid","dash","dot","dash-dot"]},"strokeOpacity":{"type":"number","minimum":0,"maximum":1},"fill":{"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"},"fillOpacity":{"type":"number","minimum":0,"maximum":1},"fontSizePt":{"type":"number","minimum":6,"maximum":72},"fontFamily":{"const":"Courier New"},"arrowHead":{"enum":["none","start","end","both"]},"markerShape":{"enum":["circle","square","triangle","diamond","cross","plus"]},"markerSizePt":{"type":"number","minimum":0,"maximum":32}},"required":["stroke","strokeWidthPt","dash","strokeOpacity","fill","fillOpacity","fontSizePt","fontFamily","arrowHead","markerShape","markerSizePt"]},"zIndex":{"type":"integer"},"visible":{"type":"boolean"},"locked":{"type":"boolean"},"table":{"$ref":"#/$defs/diagramTable"}},"required":["id","type","name","anchors","geometry","text","style","zIndex","visible","locked"],"allOf":[{"if":{"properties":{"type":{"const":"table"}},"required":["type"]},"then":{"required":["table"]},"else":{"not":{"required":["table"]}}}]};
const schema63 = {"type":"object","additionalProperties":false,"properties":{"text":{"type":"string","maxLength":5000},"baseline":{"enum":["normal","sub","super"]},"bold":{"type":"boolean"},"italic":{"type":"boolean"}},"required":["text","baseline","bold","italic"]};
const schema64 = {"type":"object","additionalProperties":false,"properties":{"version":{"const":1},"rows":{"type":"array","items":{"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"size":{"type":"number","minimum":16,"maximum":30000}},"required":["id","size"]},"minItems":1,"maxItems":50},"columns":{"type":"array","items":{"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"size":{"type":"number","minimum":16,"maximum":30000}},"required":["id","size"]},"minItems":1,"maxItems":20},"cells":{"type":"array","items":{"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"text":{"type":"array","items":{"$ref":"#/$defs/textPart"},"minItems":0,"maxItems":1000},"align":{"enum":["left","center","right"]},"vertical":{"enum":["top","middle","bottom"]},"fill":{"anyOf":[{"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"},{"type":"null"}]},"color":{"anyOf":[{"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"},{"type":"null"}]},"fontSizePt":{"anyOf":[{"type":"number","minimum":6,"maximum":72},{"type":"null"}]}},"required":["id","text","align","vertical","fill","color","fontSizePt"]},"minItems":1,"maxItems":1000},"merges":{"type":"array","items":{"type":"object","additionalProperties":false,"properties":{"row":{"type":"integer","minimum":0,"maximum":49},"column":{"type":"integer","minimum":0,"maximum":19},"rows":{"type":"integer","minimum":1,"maximum":50},"columns":{"type":"integer","minimum":1,"maximum":20}},"required":["row","column","rows","columns"]},"minItems":0,"maxItems":500},"padding":{"type":"number","minimum":0,"maximum":50},"header":{"type":"boolean"},"fill":{"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"},"headerFill":{"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"},"grid":{"type":"object","additionalProperties":false,"properties":{"visible":{"type":"boolean"},"color":{"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"},"widthPt":{"type":"number","exclusiveMinimum":0,"maximum":24},"dash":{"enum":["solid","dash","dot","dash-dot"]},"horizontal":{"type":"boolean"},"vertical":{"type":"boolean"}},"required":["visible","color","widthPt","dash","horizontal","vertical"]},"fillOpacity":{"type":"number","minimum":0,"maximum":1}},"required":["version","rows","columns","cells","merges","padding","header","fill","headerFill","grid","fillOpacity"]};

function validate39(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate39.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.version === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "version"},message:"must have required property '"+"version"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.rows === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "rows"},message:"must have required property '"+"rows"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.columns === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "columns"},message:"must have required property '"+"columns"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.cells === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "cells"},message:"must have required property '"+"cells"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.merges === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "merges"},message:"must have required property '"+"merges"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data.padding === undefined){
const err5 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "padding"},message:"must have required property '"+"padding"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data.header === undefined){
const err6 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "header"},message:"must have required property '"+"header"+"'"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
if(data.fill === undefined){
const err7 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "fill"},message:"must have required property '"+"fill"+"'"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
if(data.headerFill === undefined){
const err8 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "headerFill"},message:"must have required property '"+"headerFill"+"'"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
if(data.grid === undefined){
const err9 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "grid"},message:"must have required property '"+"grid"+"'"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
if(data.fillOpacity === undefined){
const err10 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "fillOpacity"},message:"must have required property '"+"fillOpacity"+"'"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
for(const key0 in data){
if(!(func1.call(schema64.properties, key0))){
const err11 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
if(data.version !== undefined){
if(1 !== data.version){
const err12 = {instancePath:instancePath+"/version",schemaPath:"#/properties/version/const",keyword:"const",params:{allowedValue: 1},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
if(data.rows !== undefined){
let data1 = data.rows;
if(Array.isArray(data1)){
if(data1.length > 50){
const err13 = {instancePath:instancePath+"/rows",schemaPath:"#/properties/rows/maxItems",keyword:"maxItems",params:{limit: 50},message:"must NOT have more than 50 items"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
if(data1.length < 1){
const err14 = {instancePath:instancePath+"/rows",schemaPath:"#/properties/rows/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
const len0 = data1.length;
for(let i0=0; i0<len0; i0++){
let data2 = data1[i0];
if(data2 && typeof data2 == "object" && !Array.isArray(data2)){
if(data2.id === undefined){
const err15 = {instancePath:instancePath+"/rows/" + i0,schemaPath:"#/properties/rows/items/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
if(data2.size === undefined){
const err16 = {instancePath:instancePath+"/rows/" + i0,schemaPath:"#/properties/rows/items/required",keyword:"required",params:{missingProperty: "size"},message:"must have required property '"+"size"+"'"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
for(const key1 in data2){
if(!((key1 === "id") || (key1 === "size"))){
const err17 = {instancePath:instancePath+"/rows/" + i0,schemaPath:"#/properties/rows/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
}
if(data2.id !== undefined){
let data3 = data2.id;
if(typeof data3 === "string"){
if(!pattern6.test(data3)){
const err18 = {instancePath:instancePath+"/rows/" + i0+"/id",schemaPath:"#/properties/rows/items/properties/id/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"+"\""};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
}
else {
const err19 = {instancePath:instancePath+"/rows/" + i0+"/id",schemaPath:"#/properties/rows/items/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
}
if(data2.size !== undefined){
let data4 = data2.size;
if((typeof data4 == "number") && (isFinite(data4))){
if(data4 > 30000 || isNaN(data4)){
const err20 = {instancePath:instancePath+"/rows/" + i0+"/size",schemaPath:"#/properties/rows/items/properties/size/maximum",keyword:"maximum",params:{comparison: "<=", limit: 30000},message:"must be <= 30000"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
if(data4 < 16 || isNaN(data4)){
const err21 = {instancePath:instancePath+"/rows/" + i0+"/size",schemaPath:"#/properties/rows/items/properties/size/minimum",keyword:"minimum",params:{comparison: ">=", limit: 16},message:"must be >= 16"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
}
else {
const err22 = {instancePath:instancePath+"/rows/" + i0+"/size",schemaPath:"#/properties/rows/items/properties/size/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
}
}
else {
const err23 = {instancePath:instancePath+"/rows/" + i0,schemaPath:"#/properties/rows/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
}
}
else {
const err24 = {instancePath:instancePath+"/rows",schemaPath:"#/properties/rows/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
}
if(data.columns !== undefined){
let data5 = data.columns;
if(Array.isArray(data5)){
if(data5.length > 20){
const err25 = {instancePath:instancePath+"/columns",schemaPath:"#/properties/columns/maxItems",keyword:"maxItems",params:{limit: 20},message:"must NOT have more than 20 items"};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
if(data5.length < 1){
const err26 = {instancePath:instancePath+"/columns",schemaPath:"#/properties/columns/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
const len1 = data5.length;
for(let i1=0; i1<len1; i1++){
let data6 = data5[i1];
if(data6 && typeof data6 == "object" && !Array.isArray(data6)){
if(data6.id === undefined){
const err27 = {instancePath:instancePath+"/columns/" + i1,schemaPath:"#/properties/columns/items/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
if(data6.size === undefined){
const err28 = {instancePath:instancePath+"/columns/" + i1,schemaPath:"#/properties/columns/items/required",keyword:"required",params:{missingProperty: "size"},message:"must have required property '"+"size"+"'"};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
for(const key2 in data6){
if(!((key2 === "id") || (key2 === "size"))){
const err29 = {instancePath:instancePath+"/columns/" + i1,schemaPath:"#/properties/columns/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key2},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
}
}
if(data6.id !== undefined){
let data7 = data6.id;
if(typeof data7 === "string"){
if(!pattern6.test(data7)){
const err30 = {instancePath:instancePath+"/columns/" + i1+"/id",schemaPath:"#/properties/columns/items/properties/id/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"+"\""};
if(vErrors === null){
vErrors = [err30];
}
else {
vErrors.push(err30);
}
errors++;
}
}
else {
const err31 = {instancePath:instancePath+"/columns/" + i1+"/id",schemaPath:"#/properties/columns/items/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err31];
}
else {
vErrors.push(err31);
}
errors++;
}
}
if(data6.size !== undefined){
let data8 = data6.size;
if((typeof data8 == "number") && (isFinite(data8))){
if(data8 > 30000 || isNaN(data8)){
const err32 = {instancePath:instancePath+"/columns/" + i1+"/size",schemaPath:"#/properties/columns/items/properties/size/maximum",keyword:"maximum",params:{comparison: "<=", limit: 30000},message:"must be <= 30000"};
if(vErrors === null){
vErrors = [err32];
}
else {
vErrors.push(err32);
}
errors++;
}
if(data8 < 16 || isNaN(data8)){
const err33 = {instancePath:instancePath+"/columns/" + i1+"/size",schemaPath:"#/properties/columns/items/properties/size/minimum",keyword:"minimum",params:{comparison: ">=", limit: 16},message:"must be >= 16"};
if(vErrors === null){
vErrors = [err33];
}
else {
vErrors.push(err33);
}
errors++;
}
}
else {
const err34 = {instancePath:instancePath+"/columns/" + i1+"/size",schemaPath:"#/properties/columns/items/properties/size/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err34];
}
else {
vErrors.push(err34);
}
errors++;
}
}
}
else {
const err35 = {instancePath:instancePath+"/columns/" + i1,schemaPath:"#/properties/columns/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err35];
}
else {
vErrors.push(err35);
}
errors++;
}
}
}
else {
const err36 = {instancePath:instancePath+"/columns",schemaPath:"#/properties/columns/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err36];
}
else {
vErrors.push(err36);
}
errors++;
}
}
if(data.cells !== undefined){
let data9 = data.cells;
if(Array.isArray(data9)){
if(data9.length > 1000){
const err37 = {instancePath:instancePath+"/cells",schemaPath:"#/properties/cells/maxItems",keyword:"maxItems",params:{limit: 1000},message:"must NOT have more than 1000 items"};
if(vErrors === null){
vErrors = [err37];
}
else {
vErrors.push(err37);
}
errors++;
}
if(data9.length < 1){
const err38 = {instancePath:instancePath+"/cells",schemaPath:"#/properties/cells/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err38];
}
else {
vErrors.push(err38);
}
errors++;
}
const len2 = data9.length;
for(let i2=0; i2<len2; i2++){
let data10 = data9[i2];
if(data10 && typeof data10 == "object" && !Array.isArray(data10)){
if(data10.id === undefined){
const err39 = {instancePath:instancePath+"/cells/" + i2,schemaPath:"#/properties/cells/items/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err39];
}
else {
vErrors.push(err39);
}
errors++;
}
if(data10.text === undefined){
const err40 = {instancePath:instancePath+"/cells/" + i2,schemaPath:"#/properties/cells/items/required",keyword:"required",params:{missingProperty: "text"},message:"must have required property '"+"text"+"'"};
if(vErrors === null){
vErrors = [err40];
}
else {
vErrors.push(err40);
}
errors++;
}
if(data10.align === undefined){
const err41 = {instancePath:instancePath+"/cells/" + i2,schemaPath:"#/properties/cells/items/required",keyword:"required",params:{missingProperty: "align"},message:"must have required property '"+"align"+"'"};
if(vErrors === null){
vErrors = [err41];
}
else {
vErrors.push(err41);
}
errors++;
}
if(data10.vertical === undefined){
const err42 = {instancePath:instancePath+"/cells/" + i2,schemaPath:"#/properties/cells/items/required",keyword:"required",params:{missingProperty: "vertical"},message:"must have required property '"+"vertical"+"'"};
if(vErrors === null){
vErrors = [err42];
}
else {
vErrors.push(err42);
}
errors++;
}
if(data10.fill === undefined){
const err43 = {instancePath:instancePath+"/cells/" + i2,schemaPath:"#/properties/cells/items/required",keyword:"required",params:{missingProperty: "fill"},message:"must have required property '"+"fill"+"'"};
if(vErrors === null){
vErrors = [err43];
}
else {
vErrors.push(err43);
}
errors++;
}
if(data10.color === undefined){
const err44 = {instancePath:instancePath+"/cells/" + i2,schemaPath:"#/properties/cells/items/required",keyword:"required",params:{missingProperty: "color"},message:"must have required property '"+"color"+"'"};
if(vErrors === null){
vErrors = [err44];
}
else {
vErrors.push(err44);
}
errors++;
}
if(data10.fontSizePt === undefined){
const err45 = {instancePath:instancePath+"/cells/" + i2,schemaPath:"#/properties/cells/items/required",keyword:"required",params:{missingProperty: "fontSizePt"},message:"must have required property '"+"fontSizePt"+"'"};
if(vErrors === null){
vErrors = [err45];
}
else {
vErrors.push(err45);
}
errors++;
}
for(const key3 in data10){
if(!(((((((key3 === "id") || (key3 === "text")) || (key3 === "align")) || (key3 === "vertical")) || (key3 === "fill")) || (key3 === "color")) || (key3 === "fontSizePt"))){
const err46 = {instancePath:instancePath+"/cells/" + i2,schemaPath:"#/properties/cells/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key3},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err46];
}
else {
vErrors.push(err46);
}
errors++;
}
}
if(data10.id !== undefined){
let data11 = data10.id;
if(typeof data11 === "string"){
if(!pattern6.test(data11)){
const err47 = {instancePath:instancePath+"/cells/" + i2+"/id",schemaPath:"#/properties/cells/items/properties/id/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"+"\""};
if(vErrors === null){
vErrors = [err47];
}
else {
vErrors.push(err47);
}
errors++;
}
}
else {
const err48 = {instancePath:instancePath+"/cells/" + i2+"/id",schemaPath:"#/properties/cells/items/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err48];
}
else {
vErrors.push(err48);
}
errors++;
}
}
if(data10.text !== undefined){
let data12 = data10.text;
if(Array.isArray(data12)){
if(data12.length > 1000){
const err49 = {instancePath:instancePath+"/cells/" + i2+"/text",schemaPath:"#/properties/cells/items/properties/text/maxItems",keyword:"maxItems",params:{limit: 1000},message:"must NOT have more than 1000 items"};
if(vErrors === null){
vErrors = [err49];
}
else {
vErrors.push(err49);
}
errors++;
}
if(data12.length < 0){
const err50 = {instancePath:instancePath+"/cells/" + i2+"/text",schemaPath:"#/properties/cells/items/properties/text/minItems",keyword:"minItems",params:{limit: 0},message:"must NOT have fewer than 0 items"};
if(vErrors === null){
vErrors = [err50];
}
else {
vErrors.push(err50);
}
errors++;
}
const len3 = data12.length;
for(let i3=0; i3<len3; i3++){
let data13 = data12[i3];
if(data13 && typeof data13 == "object" && !Array.isArray(data13)){
if(data13.text === undefined){
const err51 = {instancePath:instancePath+"/cells/" + i2+"/text/" + i3,schemaPath:"#/$defs/textPart/required",keyword:"required",params:{missingProperty: "text"},message:"must have required property '"+"text"+"'"};
if(vErrors === null){
vErrors = [err51];
}
else {
vErrors.push(err51);
}
errors++;
}
if(data13.baseline === undefined){
const err52 = {instancePath:instancePath+"/cells/" + i2+"/text/" + i3,schemaPath:"#/$defs/textPart/required",keyword:"required",params:{missingProperty: "baseline"},message:"must have required property '"+"baseline"+"'"};
if(vErrors === null){
vErrors = [err52];
}
else {
vErrors.push(err52);
}
errors++;
}
if(data13.bold === undefined){
const err53 = {instancePath:instancePath+"/cells/" + i2+"/text/" + i3,schemaPath:"#/$defs/textPart/required",keyword:"required",params:{missingProperty: "bold"},message:"must have required property '"+"bold"+"'"};
if(vErrors === null){
vErrors = [err53];
}
else {
vErrors.push(err53);
}
errors++;
}
if(data13.italic === undefined){
const err54 = {instancePath:instancePath+"/cells/" + i2+"/text/" + i3,schemaPath:"#/$defs/textPart/required",keyword:"required",params:{missingProperty: "italic"},message:"must have required property '"+"italic"+"'"};
if(vErrors === null){
vErrors = [err54];
}
else {
vErrors.push(err54);
}
errors++;
}
for(const key4 in data13){
if(!((((key4 === "text") || (key4 === "baseline")) || (key4 === "bold")) || (key4 === "italic"))){
const err55 = {instancePath:instancePath+"/cells/" + i2+"/text/" + i3,schemaPath:"#/$defs/textPart/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key4},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err55];
}
else {
vErrors.push(err55);
}
errors++;
}
}
if(data13.text !== undefined){
let data14 = data13.text;
if(typeof data14 === "string"){
if(func2(data14) > 5000){
const err56 = {instancePath:instancePath+"/cells/" + i2+"/text/" + i3+"/text",schemaPath:"#/$defs/textPart/properties/text/maxLength",keyword:"maxLength",params:{limit: 5000},message:"must NOT have more than 5000 characters"};
if(vErrors === null){
vErrors = [err56];
}
else {
vErrors.push(err56);
}
errors++;
}
}
else {
const err57 = {instancePath:instancePath+"/cells/" + i2+"/text/" + i3+"/text",schemaPath:"#/$defs/textPart/properties/text/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err57];
}
else {
vErrors.push(err57);
}
errors++;
}
}
if(data13.baseline !== undefined){
let data15 = data13.baseline;
if(!(((data15 === "normal") || (data15 === "sub")) || (data15 === "super"))){
const err58 = {instancePath:instancePath+"/cells/" + i2+"/text/" + i3+"/baseline",schemaPath:"#/$defs/textPart/properties/baseline/enum",keyword:"enum",params:{allowedValues: schema63.properties.baseline.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err58];
}
else {
vErrors.push(err58);
}
errors++;
}
}
if(data13.bold !== undefined){
if(typeof data13.bold !== "boolean"){
const err59 = {instancePath:instancePath+"/cells/" + i2+"/text/" + i3+"/bold",schemaPath:"#/$defs/textPart/properties/bold/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err59];
}
else {
vErrors.push(err59);
}
errors++;
}
}
if(data13.italic !== undefined){
if(typeof data13.italic !== "boolean"){
const err60 = {instancePath:instancePath+"/cells/" + i2+"/text/" + i3+"/italic",schemaPath:"#/$defs/textPart/properties/italic/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err60];
}
else {
vErrors.push(err60);
}
errors++;
}
}
}
else {
const err61 = {instancePath:instancePath+"/cells/" + i2+"/text/" + i3,schemaPath:"#/$defs/textPart/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err61];
}
else {
vErrors.push(err61);
}
errors++;
}
}
}
else {
const err62 = {instancePath:instancePath+"/cells/" + i2+"/text",schemaPath:"#/properties/cells/items/properties/text/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err62];
}
else {
vErrors.push(err62);
}
errors++;
}
}
if(data10.align !== undefined){
let data18 = data10.align;
if(!(((data18 === "left") || (data18 === "center")) || (data18 === "right"))){
const err63 = {instancePath:instancePath+"/cells/" + i2+"/align",schemaPath:"#/properties/cells/items/properties/align/enum",keyword:"enum",params:{allowedValues: schema64.properties.cells.items.properties.align.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err63];
}
else {
vErrors.push(err63);
}
errors++;
}
}
if(data10.vertical !== undefined){
let data19 = data10.vertical;
if(!(((data19 === "top") || (data19 === "middle")) || (data19 === "bottom"))){
const err64 = {instancePath:instancePath+"/cells/" + i2+"/vertical",schemaPath:"#/properties/cells/items/properties/vertical/enum",keyword:"enum",params:{allowedValues: schema64.properties.cells.items.properties.vertical.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err64];
}
else {
vErrors.push(err64);
}
errors++;
}
}
if(data10.fill !== undefined){
let data20 = data10.fill;
const _errs44 = errors;
let valid14 = false;
const _errs45 = errors;
if(typeof data20 === "string"){
if(!pattern7.test(data20)){
const err65 = {instancePath:instancePath+"/cells/" + i2+"/fill",schemaPath:"#/properties/cells/items/properties/fill/anyOf/0/pattern",keyword:"pattern",params:{pattern: "^#[0-9A-Fa-f]{6}$"},message:"must match pattern \""+"^#[0-9A-Fa-f]{6}$"+"\""};
if(vErrors === null){
vErrors = [err65];
}
else {
vErrors.push(err65);
}
errors++;
}
}
else {
const err66 = {instancePath:instancePath+"/cells/" + i2+"/fill",schemaPath:"#/properties/cells/items/properties/fill/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err66];
}
else {
vErrors.push(err66);
}
errors++;
}
var _valid0 = _errs45 === errors;
valid14 = valid14 || _valid0;
const _errs47 = errors;
if(data20 !== null){
const err67 = {instancePath:instancePath+"/cells/" + i2+"/fill",schemaPath:"#/properties/cells/items/properties/fill/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err67];
}
else {
vErrors.push(err67);
}
errors++;
}
var _valid0 = _errs47 === errors;
valid14 = valid14 || _valid0;
if(!valid14){
const err68 = {instancePath:instancePath+"/cells/" + i2+"/fill",schemaPath:"#/properties/cells/items/properties/fill/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err68];
}
else {
vErrors.push(err68);
}
errors++;
}
else {
errors = _errs44;
if(vErrors !== null){
if(_errs44){
vErrors.length = _errs44;
}
else {
vErrors = null;
}
}
}
}
if(data10.color !== undefined){
let data21 = data10.color;
const _errs50 = errors;
let valid15 = false;
const _errs51 = errors;
if(typeof data21 === "string"){
if(!pattern7.test(data21)){
const err69 = {instancePath:instancePath+"/cells/" + i2+"/color",schemaPath:"#/properties/cells/items/properties/color/anyOf/0/pattern",keyword:"pattern",params:{pattern: "^#[0-9A-Fa-f]{6}$"},message:"must match pattern \""+"^#[0-9A-Fa-f]{6}$"+"\""};
if(vErrors === null){
vErrors = [err69];
}
else {
vErrors.push(err69);
}
errors++;
}
}
else {
const err70 = {instancePath:instancePath+"/cells/" + i2+"/color",schemaPath:"#/properties/cells/items/properties/color/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err70];
}
else {
vErrors.push(err70);
}
errors++;
}
var _valid1 = _errs51 === errors;
valid15 = valid15 || _valid1;
const _errs53 = errors;
if(data21 !== null){
const err71 = {instancePath:instancePath+"/cells/" + i2+"/color",schemaPath:"#/properties/cells/items/properties/color/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err71];
}
else {
vErrors.push(err71);
}
errors++;
}
var _valid1 = _errs53 === errors;
valid15 = valid15 || _valid1;
if(!valid15){
const err72 = {instancePath:instancePath+"/cells/" + i2+"/color",schemaPath:"#/properties/cells/items/properties/color/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err72];
}
else {
vErrors.push(err72);
}
errors++;
}
else {
errors = _errs50;
if(vErrors !== null){
if(_errs50){
vErrors.length = _errs50;
}
else {
vErrors = null;
}
}
}
}
if(data10.fontSizePt !== undefined){
let data22 = data10.fontSizePt;
const _errs56 = errors;
let valid16 = false;
const _errs57 = errors;
if((typeof data22 == "number") && (isFinite(data22))){
if(data22 > 72 || isNaN(data22)){
const err73 = {instancePath:instancePath+"/cells/" + i2+"/fontSizePt",schemaPath:"#/properties/cells/items/properties/fontSizePt/anyOf/0/maximum",keyword:"maximum",params:{comparison: "<=", limit: 72},message:"must be <= 72"};
if(vErrors === null){
vErrors = [err73];
}
else {
vErrors.push(err73);
}
errors++;
}
if(data22 < 6 || isNaN(data22)){
const err74 = {instancePath:instancePath+"/cells/" + i2+"/fontSizePt",schemaPath:"#/properties/cells/items/properties/fontSizePt/anyOf/0/minimum",keyword:"minimum",params:{comparison: ">=", limit: 6},message:"must be >= 6"};
if(vErrors === null){
vErrors = [err74];
}
else {
vErrors.push(err74);
}
errors++;
}
}
else {
const err75 = {instancePath:instancePath+"/cells/" + i2+"/fontSizePt",schemaPath:"#/properties/cells/items/properties/fontSizePt/anyOf/0/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err75];
}
else {
vErrors.push(err75);
}
errors++;
}
var _valid2 = _errs57 === errors;
valid16 = valid16 || _valid2;
const _errs59 = errors;
if(data22 !== null){
const err76 = {instancePath:instancePath+"/cells/" + i2+"/fontSizePt",schemaPath:"#/properties/cells/items/properties/fontSizePt/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err76];
}
else {
vErrors.push(err76);
}
errors++;
}
var _valid2 = _errs59 === errors;
valid16 = valid16 || _valid2;
if(!valid16){
const err77 = {instancePath:instancePath+"/cells/" + i2+"/fontSizePt",schemaPath:"#/properties/cells/items/properties/fontSizePt/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err77];
}
else {
vErrors.push(err77);
}
errors++;
}
else {
errors = _errs56;
if(vErrors !== null){
if(_errs56){
vErrors.length = _errs56;
}
else {
vErrors = null;
}
}
}
}
}
else {
const err78 = {instancePath:instancePath+"/cells/" + i2,schemaPath:"#/properties/cells/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err78];
}
else {
vErrors.push(err78);
}
errors++;
}
}
}
else {
const err79 = {instancePath:instancePath+"/cells",schemaPath:"#/properties/cells/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err79];
}
else {
vErrors.push(err79);
}
errors++;
}
}
if(data.merges !== undefined){
let data23 = data.merges;
if(Array.isArray(data23)){
if(data23.length > 500){
const err80 = {instancePath:instancePath+"/merges",schemaPath:"#/properties/merges/maxItems",keyword:"maxItems",params:{limit: 500},message:"must NOT have more than 500 items"};
if(vErrors === null){
vErrors = [err80];
}
else {
vErrors.push(err80);
}
errors++;
}
if(data23.length < 0){
const err81 = {instancePath:instancePath+"/merges",schemaPath:"#/properties/merges/minItems",keyword:"minItems",params:{limit: 0},message:"must NOT have fewer than 0 items"};
if(vErrors === null){
vErrors = [err81];
}
else {
vErrors.push(err81);
}
errors++;
}
const len4 = data23.length;
for(let i4=0; i4<len4; i4++){
let data24 = data23[i4];
if(data24 && typeof data24 == "object" && !Array.isArray(data24)){
if(data24.row === undefined){
const err82 = {instancePath:instancePath+"/merges/" + i4,schemaPath:"#/properties/merges/items/required",keyword:"required",params:{missingProperty: "row"},message:"must have required property '"+"row"+"'"};
if(vErrors === null){
vErrors = [err82];
}
else {
vErrors.push(err82);
}
errors++;
}
if(data24.column === undefined){
const err83 = {instancePath:instancePath+"/merges/" + i4,schemaPath:"#/properties/merges/items/required",keyword:"required",params:{missingProperty: "column"},message:"must have required property '"+"column"+"'"};
if(vErrors === null){
vErrors = [err83];
}
else {
vErrors.push(err83);
}
errors++;
}
if(data24.rows === undefined){
const err84 = {instancePath:instancePath+"/merges/" + i4,schemaPath:"#/properties/merges/items/required",keyword:"required",params:{missingProperty: "rows"},message:"must have required property '"+"rows"+"'"};
if(vErrors === null){
vErrors = [err84];
}
else {
vErrors.push(err84);
}
errors++;
}
if(data24.columns === undefined){
const err85 = {instancePath:instancePath+"/merges/" + i4,schemaPath:"#/properties/merges/items/required",keyword:"required",params:{missingProperty: "columns"},message:"must have required property '"+"columns"+"'"};
if(vErrors === null){
vErrors = [err85];
}
else {
vErrors.push(err85);
}
errors++;
}
for(const key5 in data24){
if(!((((key5 === "row") || (key5 === "column")) || (key5 === "rows")) || (key5 === "columns"))){
const err86 = {instancePath:instancePath+"/merges/" + i4,schemaPath:"#/properties/merges/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key5},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err86];
}
else {
vErrors.push(err86);
}
errors++;
}
}
if(data24.row !== undefined){
let data25 = data24.row;
if(!(((typeof data25 == "number") && (!(data25 % 1) && !isNaN(data25))) && (isFinite(data25)))){
const err87 = {instancePath:instancePath+"/merges/" + i4+"/row",schemaPath:"#/properties/merges/items/properties/row/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err87];
}
else {
vErrors.push(err87);
}
errors++;
}
if((typeof data25 == "number") && (isFinite(data25))){
if(data25 > 49 || isNaN(data25)){
const err88 = {instancePath:instancePath+"/merges/" + i4+"/row",schemaPath:"#/properties/merges/items/properties/row/maximum",keyword:"maximum",params:{comparison: "<=", limit: 49},message:"must be <= 49"};
if(vErrors === null){
vErrors = [err88];
}
else {
vErrors.push(err88);
}
errors++;
}
if(data25 < 0 || isNaN(data25)){
const err89 = {instancePath:instancePath+"/merges/" + i4+"/row",schemaPath:"#/properties/merges/items/properties/row/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err89];
}
else {
vErrors.push(err89);
}
errors++;
}
}
}
if(data24.column !== undefined){
let data26 = data24.column;
if(!(((typeof data26 == "number") && (!(data26 % 1) && !isNaN(data26))) && (isFinite(data26)))){
const err90 = {instancePath:instancePath+"/merges/" + i4+"/column",schemaPath:"#/properties/merges/items/properties/column/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err90];
}
else {
vErrors.push(err90);
}
errors++;
}
if((typeof data26 == "number") && (isFinite(data26))){
if(data26 > 19 || isNaN(data26)){
const err91 = {instancePath:instancePath+"/merges/" + i4+"/column",schemaPath:"#/properties/merges/items/properties/column/maximum",keyword:"maximum",params:{comparison: "<=", limit: 19},message:"must be <= 19"};
if(vErrors === null){
vErrors = [err91];
}
else {
vErrors.push(err91);
}
errors++;
}
if(data26 < 0 || isNaN(data26)){
const err92 = {instancePath:instancePath+"/merges/" + i4+"/column",schemaPath:"#/properties/merges/items/properties/column/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err92];
}
else {
vErrors.push(err92);
}
errors++;
}
}
}
if(data24.rows !== undefined){
let data27 = data24.rows;
if(!(((typeof data27 == "number") && (!(data27 % 1) && !isNaN(data27))) && (isFinite(data27)))){
const err93 = {instancePath:instancePath+"/merges/" + i4+"/rows",schemaPath:"#/properties/merges/items/properties/rows/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err93];
}
else {
vErrors.push(err93);
}
errors++;
}
if((typeof data27 == "number") && (isFinite(data27))){
if(data27 > 50 || isNaN(data27)){
const err94 = {instancePath:instancePath+"/merges/" + i4+"/rows",schemaPath:"#/properties/merges/items/properties/rows/maximum",keyword:"maximum",params:{comparison: "<=", limit: 50},message:"must be <= 50"};
if(vErrors === null){
vErrors = [err94];
}
else {
vErrors.push(err94);
}
errors++;
}
if(data27 < 1 || isNaN(data27)){
const err95 = {instancePath:instancePath+"/merges/" + i4+"/rows",schemaPath:"#/properties/merges/items/properties/rows/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
if(vErrors === null){
vErrors = [err95];
}
else {
vErrors.push(err95);
}
errors++;
}
}
}
if(data24.columns !== undefined){
let data28 = data24.columns;
if(!(((typeof data28 == "number") && (!(data28 % 1) && !isNaN(data28))) && (isFinite(data28)))){
const err96 = {instancePath:instancePath+"/merges/" + i4+"/columns",schemaPath:"#/properties/merges/items/properties/columns/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err96];
}
else {
vErrors.push(err96);
}
errors++;
}
if((typeof data28 == "number") && (isFinite(data28))){
if(data28 > 20 || isNaN(data28)){
const err97 = {instancePath:instancePath+"/merges/" + i4+"/columns",schemaPath:"#/properties/merges/items/properties/columns/maximum",keyword:"maximum",params:{comparison: "<=", limit: 20},message:"must be <= 20"};
if(vErrors === null){
vErrors = [err97];
}
else {
vErrors.push(err97);
}
errors++;
}
if(data28 < 1 || isNaN(data28)){
const err98 = {instancePath:instancePath+"/merges/" + i4+"/columns",schemaPath:"#/properties/merges/items/properties/columns/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
if(vErrors === null){
vErrors = [err98];
}
else {
vErrors.push(err98);
}
errors++;
}
}
}
}
else {
const err99 = {instancePath:instancePath+"/merges/" + i4,schemaPath:"#/properties/merges/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err99];
}
else {
vErrors.push(err99);
}
errors++;
}
}
}
else {
const err100 = {instancePath:instancePath+"/merges",schemaPath:"#/properties/merges/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err100];
}
else {
vErrors.push(err100);
}
errors++;
}
}
if(data.padding !== undefined){
let data29 = data.padding;
if((typeof data29 == "number") && (isFinite(data29))){
if(data29 > 50 || isNaN(data29)){
const err101 = {instancePath:instancePath+"/padding",schemaPath:"#/properties/padding/maximum",keyword:"maximum",params:{comparison: "<=", limit: 50},message:"must be <= 50"};
if(vErrors === null){
vErrors = [err101];
}
else {
vErrors.push(err101);
}
errors++;
}
if(data29 < 0 || isNaN(data29)){
const err102 = {instancePath:instancePath+"/padding",schemaPath:"#/properties/padding/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err102];
}
else {
vErrors.push(err102);
}
errors++;
}
}
else {
const err103 = {instancePath:instancePath+"/padding",schemaPath:"#/properties/padding/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err103];
}
else {
vErrors.push(err103);
}
errors++;
}
}
if(data.header !== undefined){
if(typeof data.header !== "boolean"){
const err104 = {instancePath:instancePath+"/header",schemaPath:"#/properties/header/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err104];
}
else {
vErrors.push(err104);
}
errors++;
}
}
if(data.fill !== undefined){
let data31 = data.fill;
if(typeof data31 === "string"){
if(!pattern7.test(data31)){
const err105 = {instancePath:instancePath+"/fill",schemaPath:"#/properties/fill/pattern",keyword:"pattern",params:{pattern: "^#[0-9A-Fa-f]{6}$"},message:"must match pattern \""+"^#[0-9A-Fa-f]{6}$"+"\""};
if(vErrors === null){
vErrors = [err105];
}
else {
vErrors.push(err105);
}
errors++;
}
}
else {
const err106 = {instancePath:instancePath+"/fill",schemaPath:"#/properties/fill/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err106];
}
else {
vErrors.push(err106);
}
errors++;
}
}
if(data.headerFill !== undefined){
let data32 = data.headerFill;
if(typeof data32 === "string"){
if(!pattern7.test(data32)){
const err107 = {instancePath:instancePath+"/headerFill",schemaPath:"#/properties/headerFill/pattern",keyword:"pattern",params:{pattern: "^#[0-9A-Fa-f]{6}$"},message:"must match pattern \""+"^#[0-9A-Fa-f]{6}$"+"\""};
if(vErrors === null){
vErrors = [err107];
}
else {
vErrors.push(err107);
}
errors++;
}
}
else {
const err108 = {instancePath:instancePath+"/headerFill",schemaPath:"#/properties/headerFill/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err108];
}
else {
vErrors.push(err108);
}
errors++;
}
}
if(data.grid !== undefined){
let data33 = data.grid;
if(data33 && typeof data33 == "object" && !Array.isArray(data33)){
if(data33.visible === undefined){
const err109 = {instancePath:instancePath+"/grid",schemaPath:"#/properties/grid/required",keyword:"required",params:{missingProperty: "visible"},message:"must have required property '"+"visible"+"'"};
if(vErrors === null){
vErrors = [err109];
}
else {
vErrors.push(err109);
}
errors++;
}
if(data33.color === undefined){
const err110 = {instancePath:instancePath+"/grid",schemaPath:"#/properties/grid/required",keyword:"required",params:{missingProperty: "color"},message:"must have required property '"+"color"+"'"};
if(vErrors === null){
vErrors = [err110];
}
else {
vErrors.push(err110);
}
errors++;
}
if(data33.widthPt === undefined){
const err111 = {instancePath:instancePath+"/grid",schemaPath:"#/properties/grid/required",keyword:"required",params:{missingProperty: "widthPt"},message:"must have required property '"+"widthPt"+"'"};
if(vErrors === null){
vErrors = [err111];
}
else {
vErrors.push(err111);
}
errors++;
}
if(data33.dash === undefined){
const err112 = {instancePath:instancePath+"/grid",schemaPath:"#/properties/grid/required",keyword:"required",params:{missingProperty: "dash"},message:"must have required property '"+"dash"+"'"};
if(vErrors === null){
vErrors = [err112];
}
else {
vErrors.push(err112);
}
errors++;
}
if(data33.horizontal === undefined){
const err113 = {instancePath:instancePath+"/grid",schemaPath:"#/properties/grid/required",keyword:"required",params:{missingProperty: "horizontal"},message:"must have required property '"+"horizontal"+"'"};
if(vErrors === null){
vErrors = [err113];
}
else {
vErrors.push(err113);
}
errors++;
}
if(data33.vertical === undefined){
const err114 = {instancePath:instancePath+"/grid",schemaPath:"#/properties/grid/required",keyword:"required",params:{missingProperty: "vertical"},message:"must have required property '"+"vertical"+"'"};
if(vErrors === null){
vErrors = [err114];
}
else {
vErrors.push(err114);
}
errors++;
}
for(const key6 in data33){
if(!((((((key6 === "visible") || (key6 === "color")) || (key6 === "widthPt")) || (key6 === "dash")) || (key6 === "horizontal")) || (key6 === "vertical"))){
const err115 = {instancePath:instancePath+"/grid",schemaPath:"#/properties/grid/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key6},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err115];
}
else {
vErrors.push(err115);
}
errors++;
}
}
if(data33.visible !== undefined){
if(typeof data33.visible !== "boolean"){
const err116 = {instancePath:instancePath+"/grid/visible",schemaPath:"#/properties/grid/properties/visible/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err116];
}
else {
vErrors.push(err116);
}
errors++;
}
}
if(data33.color !== undefined){
let data35 = data33.color;
if(typeof data35 === "string"){
if(!pattern7.test(data35)){
const err117 = {instancePath:instancePath+"/grid/color",schemaPath:"#/properties/grid/properties/color/pattern",keyword:"pattern",params:{pattern: "^#[0-9A-Fa-f]{6}$"},message:"must match pattern \""+"^#[0-9A-Fa-f]{6}$"+"\""};
if(vErrors === null){
vErrors = [err117];
}
else {
vErrors.push(err117);
}
errors++;
}
}
else {
const err118 = {instancePath:instancePath+"/grid/color",schemaPath:"#/properties/grid/properties/color/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err118];
}
else {
vErrors.push(err118);
}
errors++;
}
}
if(data33.widthPt !== undefined){
let data36 = data33.widthPt;
if((typeof data36 == "number") && (isFinite(data36))){
if(data36 > 24 || isNaN(data36)){
const err119 = {instancePath:instancePath+"/grid/widthPt",schemaPath:"#/properties/grid/properties/widthPt/maximum",keyword:"maximum",params:{comparison: "<=", limit: 24},message:"must be <= 24"};
if(vErrors === null){
vErrors = [err119];
}
else {
vErrors.push(err119);
}
errors++;
}
if(data36 <= 0 || isNaN(data36)){
const err120 = {instancePath:instancePath+"/grid/widthPt",schemaPath:"#/properties/grid/properties/widthPt/exclusiveMinimum",keyword:"exclusiveMinimum",params:{comparison: ">", limit: 0},message:"must be > 0"};
if(vErrors === null){
vErrors = [err120];
}
else {
vErrors.push(err120);
}
errors++;
}
}
else {
const err121 = {instancePath:instancePath+"/grid/widthPt",schemaPath:"#/properties/grid/properties/widthPt/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err121];
}
else {
vErrors.push(err121);
}
errors++;
}
}
if(data33.dash !== undefined){
let data37 = data33.dash;
if(!((((data37 === "solid") || (data37 === "dash")) || (data37 === "dot")) || (data37 === "dash-dot"))){
const err122 = {instancePath:instancePath+"/grid/dash",schemaPath:"#/properties/grid/properties/dash/enum",keyword:"enum",params:{allowedValues: schema64.properties.grid.properties.dash.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err122];
}
else {
vErrors.push(err122);
}
errors++;
}
}
if(data33.horizontal !== undefined){
if(typeof data33.horizontal !== "boolean"){
const err123 = {instancePath:instancePath+"/grid/horizontal",schemaPath:"#/properties/grid/properties/horizontal/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err123];
}
else {
vErrors.push(err123);
}
errors++;
}
}
if(data33.vertical !== undefined){
if(typeof data33.vertical !== "boolean"){
const err124 = {instancePath:instancePath+"/grid/vertical",schemaPath:"#/properties/grid/properties/vertical/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err124];
}
else {
vErrors.push(err124);
}
errors++;
}
}
}
else {
const err125 = {instancePath:instancePath+"/grid",schemaPath:"#/properties/grid/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err125];
}
else {
vErrors.push(err125);
}
errors++;
}
}
if(data.fillOpacity !== undefined){
let data40 = data.fillOpacity;
if((typeof data40 == "number") && (isFinite(data40))){
if(data40 > 1 || isNaN(data40)){
const err126 = {instancePath:instancePath+"/fillOpacity",schemaPath:"#/properties/fillOpacity/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1},message:"must be <= 1"};
if(vErrors === null){
vErrors = [err126];
}
else {
vErrors.push(err126);
}
errors++;
}
if(data40 < 0 || isNaN(data40)){
const err127 = {instancePath:instancePath+"/fillOpacity",schemaPath:"#/properties/fillOpacity/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err127];
}
else {
vErrors.push(err127);
}
errors++;
}
}
else {
const err128 = {instancePath:instancePath+"/fillOpacity",schemaPath:"#/properties/fillOpacity/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err128];
}
else {
vErrors.push(err128);
}
errors++;
}
}
}
else {
const err129 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err129];
}
else {
vErrors.push(err129);
}
errors++;
}
validate39.errors = vErrors;
return errors === 0;
}
validate39.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate38(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate38.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
const _errs2 = errors;
let valid1 = true;
const _errs3 = errors;
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((data.type === undefined) && (missing0 = "type")){
const err0 = {};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
else {
if(data.type !== undefined){
if("table" !== data.type){
const err1 = {};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
}
}
var _valid0 = _errs3 === errors;
errors = _errs2;
if(vErrors !== null){
if(_errs2){
vErrors.length = _errs2;
}
else {
vErrors = null;
}
}
let ifClause0;
if(_valid0){
const _errs5 = errors;
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.table === undefined){
const err2 = {instancePath,schemaPath:"#/allOf/0/then/required",keyword:"required",params:{missingProperty: "table"},message:"must have required property '"+"table"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
}
var _valid0 = _errs5 === errors;
valid1 = _valid0;
ifClause0 = "then";
}
else {
const _errs6 = errors;
const _errs7 = errors;
const _errs8 = errors;
if(data && typeof data == "object" && !Array.isArray(data)){
let missing1;
if((data.table === undefined) && (missing1 = "table")){
const err3 = {};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
var valid3 = _errs8 === errors;
if(valid3){
const err4 = {instancePath,schemaPath:"#/allOf/0/else/not",keyword:"not",params:{},message:"must NOT be valid"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
else {
errors = _errs7;
if(vErrors !== null){
if(_errs7){
vErrors.length = _errs7;
}
else {
vErrors = null;
}
}
}
var _valid0 = _errs6 === errors;
valid1 = _valid0;
ifClause0 = "else";
}
if(!valid1){
const err5 = {instancePath,schemaPath:"#/allOf/0/if",keyword:"if",params:{failingKeyword: ifClause0},message:"must match \""+ifClause0+"\" schema"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.id === undefined){
const err6 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
if(data.type === undefined){
const err7 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "type"},message:"must have required property '"+"type"+"'"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
if(data.name === undefined){
const err8 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
if(data.anchors === undefined){
const err9 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "anchors"},message:"must have required property '"+"anchors"+"'"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
if(data.geometry === undefined){
const err10 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "geometry"},message:"must have required property '"+"geometry"+"'"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
if(data.text === undefined){
const err11 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "text"},message:"must have required property '"+"text"+"'"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
if(data.style === undefined){
const err12 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "style"},message:"must have required property '"+"style"+"'"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
if(data.zIndex === undefined){
const err13 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "zIndex"},message:"must have required property '"+"zIndex"+"'"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
if(data.visible === undefined){
const err14 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "visible"},message:"must have required property '"+"visible"+"'"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
if(data.locked === undefined){
const err15 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "locked"},message:"must have required property '"+"locked"+"'"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
for(const key0 in data){
if(!(func1.call(schema61.properties, key0))){
const err16 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
}
if(data.id !== undefined){
let data1 = data.id;
if(typeof data1 === "string"){
if(!pattern6.test(data1)){
const err17 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"+"\""};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
}
else {
const err18 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
}
if(data.type !== undefined){
let data2 = data.type;
if(!((((((((((data2 === "text") || (data2 === "segment")) || (data2 === "line")) || (data2 === "arrow")) || (data2 === "callout")) || (data2 === "rectangle")) || (data2 === "range-x")) || (data2 === "range-y")) || (data2 === "marker")) || (data2 === "table"))){
const err19 = {instancePath:instancePath+"/type",schemaPath:"#/properties/type/enum",keyword:"enum",params:{allowedValues: schema61.properties.type.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
}
if(data.name !== undefined){
let data3 = data.name;
if(typeof data3 === "string"){
if(func2(data3) > 300){
const err20 = {instancePath:instancePath+"/name",schemaPath:"#/properties/name/maxLength",keyword:"maxLength",params:{limit: 300},message:"must NOT have more than 300 characters"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
}
else {
const err21 = {instancePath:instancePath+"/name",schemaPath:"#/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
}
if(data.anchors !== undefined){
let data4 = data.anchors;
if(Array.isArray(data4)){
if(data4.length > 2){
const err22 = {instancePath:instancePath+"/anchors",schemaPath:"#/properties/anchors/maxItems",keyword:"maxItems",params:{limit: 2},message:"must NOT have more than 2 items"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
if(data4.length < 1){
const err23 = {instancePath:instancePath+"/anchors",schemaPath:"#/properties/anchors/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
const len0 = data4.length;
for(let i0=0; i0<len0; i0++){
let data5 = data4[i0];
const _errs19 = errors;
let valid8 = false;
let passing0 = null;
const _errs20 = errors;
if(data5 && typeof data5 == "object" && !Array.isArray(data5)){
if(data5.mode === undefined){
const err24 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/0/required",keyword:"required",params:{missingProperty: "mode"},message:"must have required property '"+"mode"+"'"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
if(data5.x === undefined){
const err25 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/0/required",keyword:"required",params:{missingProperty: "x"},message:"must have required property '"+"x"+"'"};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
if(data5.y === undefined){
const err26 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/0/required",keyword:"required",params:{missingProperty: "y"},message:"must have required property '"+"y"+"'"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
for(const key1 in data5){
if(!(((key1 === "mode") || (key1 === "x")) || (key1 === "y"))){
const err27 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/0/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
}
if(data5.mode !== undefined){
if("data" !== data5.mode){
const err28 = {instancePath:instancePath+"/anchors/" + i0+"/mode",schemaPath:"#/$defs/anchor/oneOf/0/properties/mode/const",keyword:"const",params:{allowedValue: "data"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
}
if(data5.x !== undefined){
let data7 = data5.x;
if(!((typeof data7 == "number") && (isFinite(data7)))){
const err29 = {instancePath:instancePath+"/anchors/" + i0+"/x",schemaPath:"#/$defs/anchor/oneOf/0/properties/x/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
}
}
if(data5.y !== undefined){
let data8 = data5.y;
if(!((typeof data8 == "number") && (isFinite(data8)))){
const err30 = {instancePath:instancePath+"/anchors/" + i0+"/y",schemaPath:"#/$defs/anchor/oneOf/0/properties/y/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err30];
}
else {
vErrors.push(err30);
}
errors++;
}
}
}
else {
const err31 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err31];
}
else {
vErrors.push(err31);
}
errors++;
}
var _valid1 = _errs20 === errors;
if(_valid1){
valid8 = true;
passing0 = 0;
var props0 = true;
}
const _errs28 = errors;
if(data5 && typeof data5 == "object" && !Array.isArray(data5)){
if(data5.mode === undefined){
const err32 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/1/required",keyword:"required",params:{missingProperty: "mode"},message:"must have required property '"+"mode"+"'"};
if(vErrors === null){
vErrors = [err32];
}
else {
vErrors.push(err32);
}
errors++;
}
if(data5.pageX === undefined){
const err33 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/1/required",keyword:"required",params:{missingProperty: "pageX"},message:"must have required property '"+"pageX"+"'"};
if(vErrors === null){
vErrors = [err33];
}
else {
vErrors.push(err33);
}
errors++;
}
if(data5.pageY === undefined){
const err34 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/1/required",keyword:"required",params:{missingProperty: "pageY"},message:"must have required property '"+"pageY"+"'"};
if(vErrors === null){
vErrors = [err34];
}
else {
vErrors.push(err34);
}
errors++;
}
for(const key2 in data5){
if(!(((key2 === "mode") || (key2 === "pageX")) || (key2 === "pageY"))){
const err35 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/1/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key2},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err35];
}
else {
vErrors.push(err35);
}
errors++;
}
}
if(data5.mode !== undefined){
if("page" !== data5.mode){
const err36 = {instancePath:instancePath+"/anchors/" + i0+"/mode",schemaPath:"#/$defs/anchor/oneOf/1/properties/mode/const",keyword:"const",params:{allowedValue: "page"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err36];
}
else {
vErrors.push(err36);
}
errors++;
}
}
if(data5.pageX !== undefined){
let data10 = data5.pageX;
if((typeof data10 == "number") && (isFinite(data10))){
if(data10 > 1 || isNaN(data10)){
const err37 = {instancePath:instancePath+"/anchors/" + i0+"/pageX",schemaPath:"#/$defs/anchor/oneOf/1/properties/pageX/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1},message:"must be <= 1"};
if(vErrors === null){
vErrors = [err37];
}
else {
vErrors.push(err37);
}
errors++;
}
if(data10 < 0 || isNaN(data10)){
const err38 = {instancePath:instancePath+"/anchors/" + i0+"/pageX",schemaPath:"#/$defs/anchor/oneOf/1/properties/pageX/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err38];
}
else {
vErrors.push(err38);
}
errors++;
}
}
else {
const err39 = {instancePath:instancePath+"/anchors/" + i0+"/pageX",schemaPath:"#/$defs/anchor/oneOf/1/properties/pageX/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err39];
}
else {
vErrors.push(err39);
}
errors++;
}
}
if(data5.pageY !== undefined){
let data11 = data5.pageY;
if((typeof data11 == "number") && (isFinite(data11))){
if(data11 > 1 || isNaN(data11)){
const err40 = {instancePath:instancePath+"/anchors/" + i0+"/pageY",schemaPath:"#/$defs/anchor/oneOf/1/properties/pageY/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1},message:"must be <= 1"};
if(vErrors === null){
vErrors = [err40];
}
else {
vErrors.push(err40);
}
errors++;
}
if(data11 < 0 || isNaN(data11)){
const err41 = {instancePath:instancePath+"/anchors/" + i0+"/pageY",schemaPath:"#/$defs/anchor/oneOf/1/properties/pageY/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err41];
}
else {
vErrors.push(err41);
}
errors++;
}
}
else {
const err42 = {instancePath:instancePath+"/anchors/" + i0+"/pageY",schemaPath:"#/$defs/anchor/oneOf/1/properties/pageY/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err42];
}
else {
vErrors.push(err42);
}
errors++;
}
}
}
else {
const err43 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/1/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err43];
}
else {
vErrors.push(err43);
}
errors++;
}
var _valid1 = _errs28 === errors;
if(_valid1 && valid8){
valid8 = false;
passing0 = [passing0, 1];
}
else {
if(_valid1){
valid8 = true;
passing0 = 1;
if(props0 !== true){
props0 = true;
}
}
const _errs36 = errors;
if(data5 && typeof data5 == "object" && !Array.isArray(data5)){
if(data5.mode === undefined){
const err44 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/2/required",keyword:"required",params:{missingProperty: "mode"},message:"must have required property '"+"mode"+"'"};
if(vErrors === null){
vErrors = [err44];
}
else {
vErrors.push(err44);
}
errors++;
}
if(data5.datasetId === undefined){
const err45 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/2/required",keyword:"required",params:{missingProperty: "datasetId"},message:"must have required property '"+"datasetId"+"'"};
if(vErrors === null){
vErrors = [err45];
}
else {
vErrors.push(err45);
}
errors++;
}
if(data5.pointId === undefined){
const err46 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/2/required",keyword:"required",params:{missingProperty: "pointId"},message:"must have required property '"+"pointId"+"'"};
if(vErrors === null){
vErrors = [err46];
}
else {
vErrors.push(err46);
}
errors++;
}
if(data5.fallbackX === undefined){
const err47 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/2/required",keyword:"required",params:{missingProperty: "fallbackX"},message:"must have required property '"+"fallbackX"+"'"};
if(vErrors === null){
vErrors = [err47];
}
else {
vErrors.push(err47);
}
errors++;
}
if(data5.fallbackY === undefined){
const err48 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/2/required",keyword:"required",params:{missingProperty: "fallbackY"},message:"must have required property '"+"fallbackY"+"'"};
if(vErrors === null){
vErrors = [err48];
}
else {
vErrors.push(err48);
}
errors++;
}
if(data5.offsetXpx === undefined){
const err49 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/2/required",keyword:"required",params:{missingProperty: "offsetXpx"},message:"must have required property '"+"offsetXpx"+"'"};
if(vErrors === null){
vErrors = [err49];
}
else {
vErrors.push(err49);
}
errors++;
}
if(data5.offsetYpx === undefined){
const err50 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/2/required",keyword:"required",params:{missingProperty: "offsetYpx"},message:"must have required property '"+"offsetYpx"+"'"};
if(vErrors === null){
vErrors = [err50];
}
else {
vErrors.push(err50);
}
errors++;
}
for(const key3 in data5){
if(!(((((((key3 === "mode") || (key3 === "datasetId")) || (key3 === "pointId")) || (key3 === "fallbackX")) || (key3 === "fallbackY")) || (key3 === "offsetXpx")) || (key3 === "offsetYpx"))){
const err51 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/2/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key3},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err51];
}
else {
vErrors.push(err51);
}
errors++;
}
}
if(data5.mode !== undefined){
if("point" !== data5.mode){
const err52 = {instancePath:instancePath+"/anchors/" + i0+"/mode",schemaPath:"#/$defs/anchor/oneOf/2/properties/mode/const",keyword:"const",params:{allowedValue: "point"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err52];
}
else {
vErrors.push(err52);
}
errors++;
}
}
if(data5.datasetId !== undefined){
let data13 = data5.datasetId;
if(typeof data13 === "string"){
if(!pattern6.test(data13)){
const err53 = {instancePath:instancePath+"/anchors/" + i0+"/datasetId",schemaPath:"#/$defs/anchor/oneOf/2/properties/datasetId/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"+"\""};
if(vErrors === null){
vErrors = [err53];
}
else {
vErrors.push(err53);
}
errors++;
}
}
else {
const err54 = {instancePath:instancePath+"/anchors/" + i0+"/datasetId",schemaPath:"#/$defs/anchor/oneOf/2/properties/datasetId/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err54];
}
else {
vErrors.push(err54);
}
errors++;
}
}
if(data5.pointId !== undefined){
let data14 = data5.pointId;
if(typeof data14 === "string"){
if(!pattern6.test(data14)){
const err55 = {instancePath:instancePath+"/anchors/" + i0+"/pointId",schemaPath:"#/$defs/anchor/oneOf/2/properties/pointId/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"+"\""};
if(vErrors === null){
vErrors = [err55];
}
else {
vErrors.push(err55);
}
errors++;
}
}
else {
const err56 = {instancePath:instancePath+"/anchors/" + i0+"/pointId",schemaPath:"#/$defs/anchor/oneOf/2/properties/pointId/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err56];
}
else {
vErrors.push(err56);
}
errors++;
}
}
if(data5.fallbackX !== undefined){
let data15 = data5.fallbackX;
if(!((typeof data15 == "number") && (isFinite(data15)))){
const err57 = {instancePath:instancePath+"/anchors/" + i0+"/fallbackX",schemaPath:"#/$defs/anchor/oneOf/2/properties/fallbackX/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err57];
}
else {
vErrors.push(err57);
}
errors++;
}
}
if(data5.fallbackY !== undefined){
let data16 = data5.fallbackY;
if(!((typeof data16 == "number") && (isFinite(data16)))){
const err58 = {instancePath:instancePath+"/anchors/" + i0+"/fallbackY",schemaPath:"#/$defs/anchor/oneOf/2/properties/fallbackY/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err58];
}
else {
vErrors.push(err58);
}
errors++;
}
}
if(data5.offsetXpx !== undefined){
let data17 = data5.offsetXpx;
if(!((typeof data17 == "number") && (isFinite(data17)))){
const err59 = {instancePath:instancePath+"/anchors/" + i0+"/offsetXpx",schemaPath:"#/$defs/anchor/oneOf/2/properties/offsetXpx/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err59];
}
else {
vErrors.push(err59);
}
errors++;
}
}
if(data5.offsetYpx !== undefined){
let data18 = data5.offsetYpx;
if(!((typeof data18 == "number") && (isFinite(data18)))){
const err60 = {instancePath:instancePath+"/anchors/" + i0+"/offsetYpx",schemaPath:"#/$defs/anchor/oneOf/2/properties/offsetYpx/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err60];
}
else {
vErrors.push(err60);
}
errors++;
}
}
}
else {
const err61 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/2/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err61];
}
else {
vErrors.push(err61);
}
errors++;
}
var _valid1 = _errs36 === errors;
if(_valid1 && valid8){
valid8 = false;
passing0 = [passing0, 2];
}
else {
if(_valid1){
valid8 = true;
passing0 = 2;
if(props0 !== true){
props0 = true;
}
}
}
}
if(!valid8){
const err62 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf",keyword:"oneOf",params:{passingSchemas: passing0},message:"must match exactly one schema in oneOf"};
if(vErrors === null){
vErrors = [err62];
}
else {
vErrors.push(err62);
}
errors++;
}
else {
errors = _errs19;
if(vErrors !== null){
if(_errs19){
vErrors.length = _errs19;
}
else {
vErrors = null;
}
}
}
}
}
else {
const err63 = {instancePath:instancePath+"/anchors",schemaPath:"#/properties/anchors/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err63];
}
else {
vErrors.push(err63);
}
errors++;
}
}
if(data.geometry !== undefined){
let data19 = data.geometry;
if(data19 && typeof data19 == "object" && !Array.isArray(data19)){
for(const key4 in data19){
if(!((((key4 === "directionX") || (key4 === "directionY")) || (key4 === "widthPx")) || (key4 === "heightPx"))){
const err64 = {instancePath:instancePath+"/geometry",schemaPath:"#/properties/geometry/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key4},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err64];
}
else {
vErrors.push(err64);
}
errors++;
}
}
if(data19.directionX !== undefined){
let data20 = data19.directionX;
if(!((typeof data20 == "number") && (isFinite(data20)))){
const err65 = {instancePath:instancePath+"/geometry/directionX",schemaPath:"#/properties/geometry/properties/directionX/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err65];
}
else {
vErrors.push(err65);
}
errors++;
}
}
if(data19.directionY !== undefined){
let data21 = data19.directionY;
if(!((typeof data21 == "number") && (isFinite(data21)))){
const err66 = {instancePath:instancePath+"/geometry/directionY",schemaPath:"#/properties/geometry/properties/directionY/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err66];
}
else {
vErrors.push(err66);
}
errors++;
}
}
if(data19.widthPx !== undefined){
let data22 = data19.widthPx;
if((typeof data22 == "number") && (isFinite(data22))){
if(data22 > 600000 || isNaN(data22)){
const err67 = {instancePath:instancePath+"/geometry/widthPx",schemaPath:"#/properties/geometry/properties/widthPx/maximum",keyword:"maximum",params:{comparison: "<=", limit: 600000},message:"must be <= 600000"};
if(vErrors === null){
vErrors = [err67];
}
else {
vErrors.push(err67);
}
errors++;
}
if(data22 < 16 || isNaN(data22)){
const err68 = {instancePath:instancePath+"/geometry/widthPx",schemaPath:"#/properties/geometry/properties/widthPx/minimum",keyword:"minimum",params:{comparison: ">=", limit: 16},message:"must be >= 16"};
if(vErrors === null){
vErrors = [err68];
}
else {
vErrors.push(err68);
}
errors++;
}
}
else {
const err69 = {instancePath:instancePath+"/geometry/widthPx",schemaPath:"#/properties/geometry/properties/widthPx/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err69];
}
else {
vErrors.push(err69);
}
errors++;
}
}
if(data19.heightPx !== undefined){
let data23 = data19.heightPx;
if((typeof data23 == "number") && (isFinite(data23))){
if(data23 > 1500000 || isNaN(data23)){
const err70 = {instancePath:instancePath+"/geometry/heightPx",schemaPath:"#/properties/geometry/properties/heightPx/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1500000},message:"must be <= 1500000"};
if(vErrors === null){
vErrors = [err70];
}
else {
vErrors.push(err70);
}
errors++;
}
if(data23 < 16 || isNaN(data23)){
const err71 = {instancePath:instancePath+"/geometry/heightPx",schemaPath:"#/properties/geometry/properties/heightPx/minimum",keyword:"minimum",params:{comparison: ">=", limit: 16},message:"must be >= 16"};
if(vErrors === null){
vErrors = [err71];
}
else {
vErrors.push(err71);
}
errors++;
}
}
else {
const err72 = {instancePath:instancePath+"/geometry/heightPx",schemaPath:"#/properties/geometry/properties/heightPx/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err72];
}
else {
vErrors.push(err72);
}
errors++;
}
}
}
else {
const err73 = {instancePath:instancePath+"/geometry",schemaPath:"#/properties/geometry/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err73];
}
else {
vErrors.push(err73);
}
errors++;
}
}
if(data.text !== undefined){
let data24 = data.text;
if(Array.isArray(data24)){
if(data24.length > 1000){
const err74 = {instancePath:instancePath+"/text",schemaPath:"#/properties/text/maxItems",keyword:"maxItems",params:{limit: 1000},message:"must NOT have more than 1000 items"};
if(vErrors === null){
vErrors = [err74];
}
else {
vErrors.push(err74);
}
errors++;
}
const len1 = data24.length;
for(let i1=0; i1<len1; i1++){
let data25 = data24[i1];
if(data25 && typeof data25 == "object" && !Array.isArray(data25)){
if(data25.text === undefined){
const err75 = {instancePath:instancePath+"/text/" + i1,schemaPath:"#/$defs/textPart/required",keyword:"required",params:{missingProperty: "text"},message:"must have required property '"+"text"+"'"};
if(vErrors === null){
vErrors = [err75];
}
else {
vErrors.push(err75);
}
errors++;
}
if(data25.baseline === undefined){
const err76 = {instancePath:instancePath+"/text/" + i1,schemaPath:"#/$defs/textPart/required",keyword:"required",params:{missingProperty: "baseline"},message:"must have required property '"+"baseline"+"'"};
if(vErrors === null){
vErrors = [err76];
}
else {
vErrors.push(err76);
}
errors++;
}
if(data25.bold === undefined){
const err77 = {instancePath:instancePath+"/text/" + i1,schemaPath:"#/$defs/textPart/required",keyword:"required",params:{missingProperty: "bold"},message:"must have required property '"+"bold"+"'"};
if(vErrors === null){
vErrors = [err77];
}
else {
vErrors.push(err77);
}
errors++;
}
if(data25.italic === undefined){
const err78 = {instancePath:instancePath+"/text/" + i1,schemaPath:"#/$defs/textPart/required",keyword:"required",params:{missingProperty: "italic"},message:"must have required property '"+"italic"+"'"};
if(vErrors === null){
vErrors = [err78];
}
else {
vErrors.push(err78);
}
errors++;
}
for(const key5 in data25){
if(!((((key5 === "text") || (key5 === "baseline")) || (key5 === "bold")) || (key5 === "italic"))){
const err79 = {instancePath:instancePath+"/text/" + i1,schemaPath:"#/$defs/textPart/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key5},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err79];
}
else {
vErrors.push(err79);
}
errors++;
}
}
if(data25.text !== undefined){
let data26 = data25.text;
if(typeof data26 === "string"){
if(func2(data26) > 5000){
const err80 = {instancePath:instancePath+"/text/" + i1+"/text",schemaPath:"#/$defs/textPart/properties/text/maxLength",keyword:"maxLength",params:{limit: 5000},message:"must NOT have more than 5000 characters"};
if(vErrors === null){
vErrors = [err80];
}
else {
vErrors.push(err80);
}
errors++;
}
}
else {
const err81 = {instancePath:instancePath+"/text/" + i1+"/text",schemaPath:"#/$defs/textPart/properties/text/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err81];
}
else {
vErrors.push(err81);
}
errors++;
}
}
if(data25.baseline !== undefined){
let data27 = data25.baseline;
if(!(((data27 === "normal") || (data27 === "sub")) || (data27 === "super"))){
const err82 = {instancePath:instancePath+"/text/" + i1+"/baseline",schemaPath:"#/$defs/textPart/properties/baseline/enum",keyword:"enum",params:{allowedValues: schema63.properties.baseline.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err82];
}
else {
vErrors.push(err82);
}
errors++;
}
}
if(data25.bold !== undefined){
if(typeof data25.bold !== "boolean"){
const err83 = {instancePath:instancePath+"/text/" + i1+"/bold",schemaPath:"#/$defs/textPart/properties/bold/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err83];
}
else {
vErrors.push(err83);
}
errors++;
}
}
if(data25.italic !== undefined){
if(typeof data25.italic !== "boolean"){
const err84 = {instancePath:instancePath+"/text/" + i1+"/italic",schemaPath:"#/$defs/textPart/properties/italic/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err84];
}
else {
vErrors.push(err84);
}
errors++;
}
}
}
else {
const err85 = {instancePath:instancePath+"/text/" + i1,schemaPath:"#/$defs/textPart/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err85];
}
else {
vErrors.push(err85);
}
errors++;
}
}
}
else {
const err86 = {instancePath:instancePath+"/text",schemaPath:"#/properties/text/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err86];
}
else {
vErrors.push(err86);
}
errors++;
}
}
if(data.style !== undefined){
let data30 = data.style;
if(data30 && typeof data30 == "object" && !Array.isArray(data30)){
if(data30.stroke === undefined){
const err87 = {instancePath:instancePath+"/style",schemaPath:"#/properties/style/required",keyword:"required",params:{missingProperty: "stroke"},message:"must have required property '"+"stroke"+"'"};
if(vErrors === null){
vErrors = [err87];
}
else {
vErrors.push(err87);
}
errors++;
}
if(data30.strokeWidthPt === undefined){
const err88 = {instancePath:instancePath+"/style",schemaPath:"#/properties/style/required",keyword:"required",params:{missingProperty: "strokeWidthPt"},message:"must have required property '"+"strokeWidthPt"+"'"};
if(vErrors === null){
vErrors = [err88];
}
else {
vErrors.push(err88);
}
errors++;
}
if(data30.dash === undefined){
const err89 = {instancePath:instancePath+"/style",schemaPath:"#/properties/style/required",keyword:"required",params:{missingProperty: "dash"},message:"must have required property '"+"dash"+"'"};
if(vErrors === null){
vErrors = [err89];
}
else {
vErrors.push(err89);
}
errors++;
}
if(data30.strokeOpacity === undefined){
const err90 = {instancePath:instancePath+"/style",schemaPath:"#/properties/style/required",keyword:"required",params:{missingProperty: "strokeOpacity"},message:"must have required property '"+"strokeOpacity"+"'"};
if(vErrors === null){
vErrors = [err90];
}
else {
vErrors.push(err90);
}
errors++;
}
if(data30.fill === undefined){
const err91 = {instancePath:instancePath+"/style",schemaPath:"#/properties/style/required",keyword:"required",params:{missingProperty: "fill"},message:"must have required property '"+"fill"+"'"};
if(vErrors === null){
vErrors = [err91];
}
else {
vErrors.push(err91);
}
errors++;
}
if(data30.fillOpacity === undefined){
const err92 = {instancePath:instancePath+"/style",schemaPath:"#/properties/style/required",keyword:"required",params:{missingProperty: "fillOpacity"},message:"must have required property '"+"fillOpacity"+"'"};
if(vErrors === null){
vErrors = [err92];
}
else {
vErrors.push(err92);
}
errors++;
}
if(data30.fontSizePt === undefined){
const err93 = {instancePath:instancePath+"/style",schemaPath:"#/properties/style/required",keyword:"required",params:{missingProperty: "fontSizePt"},message:"must have required property '"+"fontSizePt"+"'"};
if(vErrors === null){
vErrors = [err93];
}
else {
vErrors.push(err93);
}
errors++;
}
if(data30.fontFamily === undefined){
const err94 = {instancePath:instancePath+"/style",schemaPath:"#/properties/style/required",keyword:"required",params:{missingProperty: "fontFamily"},message:"must have required property '"+"fontFamily"+"'"};
if(vErrors === null){
vErrors = [err94];
}
else {
vErrors.push(err94);
}
errors++;
}
if(data30.arrowHead === undefined){
const err95 = {instancePath:instancePath+"/style",schemaPath:"#/properties/style/required",keyword:"required",params:{missingProperty: "arrowHead"},message:"must have required property '"+"arrowHead"+"'"};
if(vErrors === null){
vErrors = [err95];
}
else {
vErrors.push(err95);
}
errors++;
}
if(data30.markerShape === undefined){
const err96 = {instancePath:instancePath+"/style",schemaPath:"#/properties/style/required",keyword:"required",params:{missingProperty: "markerShape"},message:"must have required property '"+"markerShape"+"'"};
if(vErrors === null){
vErrors = [err96];
}
else {
vErrors.push(err96);
}
errors++;
}
if(data30.markerSizePt === undefined){
const err97 = {instancePath:instancePath+"/style",schemaPath:"#/properties/style/required",keyword:"required",params:{missingProperty: "markerSizePt"},message:"must have required property '"+"markerSizePt"+"'"};
if(vErrors === null){
vErrors = [err97];
}
else {
vErrors.push(err97);
}
errors++;
}
for(const key6 in data30){
if(!(func1.call(schema61.properties.style.properties, key6))){
const err98 = {instancePath:instancePath+"/style",schemaPath:"#/properties/style/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key6},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err98];
}
else {
vErrors.push(err98);
}
errors++;
}
}
if(data30.stroke !== undefined){
let data31 = data30.stroke;
if(typeof data31 === "string"){
if(!pattern7.test(data31)){
const err99 = {instancePath:instancePath+"/style/stroke",schemaPath:"#/properties/style/properties/stroke/pattern",keyword:"pattern",params:{pattern: "^#[0-9A-Fa-f]{6}$"},message:"must match pattern \""+"^#[0-9A-Fa-f]{6}$"+"\""};
if(vErrors === null){
vErrors = [err99];
}
else {
vErrors.push(err99);
}
errors++;
}
}
else {
const err100 = {instancePath:instancePath+"/style/stroke",schemaPath:"#/properties/style/properties/stroke/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err100];
}
else {
vErrors.push(err100);
}
errors++;
}
}
if(data30.strokeWidthPt !== undefined){
let data32 = data30.strokeWidthPt;
if((typeof data32 == "number") && (isFinite(data32))){
if(data32 > 24 || isNaN(data32)){
const err101 = {instancePath:instancePath+"/style/strokeWidthPt",schemaPath:"#/properties/style/properties/strokeWidthPt/maximum",keyword:"maximum",params:{comparison: "<=", limit: 24},message:"must be <= 24"};
if(vErrors === null){
vErrors = [err101];
}
else {
vErrors.push(err101);
}
errors++;
}
if(data32 <= 0 || isNaN(data32)){
const err102 = {instancePath:instancePath+"/style/strokeWidthPt",schemaPath:"#/properties/style/properties/strokeWidthPt/exclusiveMinimum",keyword:"exclusiveMinimum",params:{comparison: ">", limit: 0},message:"must be > 0"};
if(vErrors === null){
vErrors = [err102];
}
else {
vErrors.push(err102);
}
errors++;
}
}
else {
const err103 = {instancePath:instancePath+"/style/strokeWidthPt",schemaPath:"#/properties/style/properties/strokeWidthPt/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err103];
}
else {
vErrors.push(err103);
}
errors++;
}
}
if(data30.dash !== undefined){
let data33 = data30.dash;
if(!((((data33 === "solid") || (data33 === "dash")) || (data33 === "dot")) || (data33 === "dash-dot"))){
const err104 = {instancePath:instancePath+"/style/dash",schemaPath:"#/properties/style/properties/dash/enum",keyword:"enum",params:{allowedValues: schema61.properties.style.properties.dash.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err104];
}
else {
vErrors.push(err104);
}
errors++;
}
}
if(data30.strokeOpacity !== undefined){
let data34 = data30.strokeOpacity;
if((typeof data34 == "number") && (isFinite(data34))){
if(data34 > 1 || isNaN(data34)){
const err105 = {instancePath:instancePath+"/style/strokeOpacity",schemaPath:"#/properties/style/properties/strokeOpacity/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1},message:"must be <= 1"};
if(vErrors === null){
vErrors = [err105];
}
else {
vErrors.push(err105);
}
errors++;
}
if(data34 < 0 || isNaN(data34)){
const err106 = {instancePath:instancePath+"/style/strokeOpacity",schemaPath:"#/properties/style/properties/strokeOpacity/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err106];
}
else {
vErrors.push(err106);
}
errors++;
}
}
else {
const err107 = {instancePath:instancePath+"/style/strokeOpacity",schemaPath:"#/properties/style/properties/strokeOpacity/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err107];
}
else {
vErrors.push(err107);
}
errors++;
}
}
if(data30.fill !== undefined){
let data35 = data30.fill;
if(typeof data35 === "string"){
if(!pattern7.test(data35)){
const err108 = {instancePath:instancePath+"/style/fill",schemaPath:"#/properties/style/properties/fill/pattern",keyword:"pattern",params:{pattern: "^#[0-9A-Fa-f]{6}$"},message:"must match pattern \""+"^#[0-9A-Fa-f]{6}$"+"\""};
if(vErrors === null){
vErrors = [err108];
}
else {
vErrors.push(err108);
}
errors++;
}
}
else {
const err109 = {instancePath:instancePath+"/style/fill",schemaPath:"#/properties/style/properties/fill/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err109];
}
else {
vErrors.push(err109);
}
errors++;
}
}
if(data30.fillOpacity !== undefined){
let data36 = data30.fillOpacity;
if((typeof data36 == "number") && (isFinite(data36))){
if(data36 > 1 || isNaN(data36)){
const err110 = {instancePath:instancePath+"/style/fillOpacity",schemaPath:"#/properties/style/properties/fillOpacity/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1},message:"must be <= 1"};
if(vErrors === null){
vErrors = [err110];
}
else {
vErrors.push(err110);
}
errors++;
}
if(data36 < 0 || isNaN(data36)){
const err111 = {instancePath:instancePath+"/style/fillOpacity",schemaPath:"#/properties/style/properties/fillOpacity/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err111];
}
else {
vErrors.push(err111);
}
errors++;
}
}
else {
const err112 = {instancePath:instancePath+"/style/fillOpacity",schemaPath:"#/properties/style/properties/fillOpacity/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err112];
}
else {
vErrors.push(err112);
}
errors++;
}
}
if(data30.fontSizePt !== undefined){
let data37 = data30.fontSizePt;
if((typeof data37 == "number") && (isFinite(data37))){
if(data37 > 72 || isNaN(data37)){
const err113 = {instancePath:instancePath+"/style/fontSizePt",schemaPath:"#/properties/style/properties/fontSizePt/maximum",keyword:"maximum",params:{comparison: "<=", limit: 72},message:"must be <= 72"};
if(vErrors === null){
vErrors = [err113];
}
else {
vErrors.push(err113);
}
errors++;
}
if(data37 < 6 || isNaN(data37)){
const err114 = {instancePath:instancePath+"/style/fontSizePt",schemaPath:"#/properties/style/properties/fontSizePt/minimum",keyword:"minimum",params:{comparison: ">=", limit: 6},message:"must be >= 6"};
if(vErrors === null){
vErrors = [err114];
}
else {
vErrors.push(err114);
}
errors++;
}
}
else {
const err115 = {instancePath:instancePath+"/style/fontSizePt",schemaPath:"#/properties/style/properties/fontSizePt/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err115];
}
else {
vErrors.push(err115);
}
errors++;
}
}
if(data30.fontFamily !== undefined){
if("Courier New" !== data30.fontFamily){
const err116 = {instancePath:instancePath+"/style/fontFamily",schemaPath:"#/properties/style/properties/fontFamily/const",keyword:"const",params:{allowedValue: "Courier New"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err116];
}
else {
vErrors.push(err116);
}
errors++;
}
}
if(data30.arrowHead !== undefined){
let data39 = data30.arrowHead;
if(!((((data39 === "none") || (data39 === "start")) || (data39 === "end")) || (data39 === "both"))){
const err117 = {instancePath:instancePath+"/style/arrowHead",schemaPath:"#/properties/style/properties/arrowHead/enum",keyword:"enum",params:{allowedValues: schema61.properties.style.properties.arrowHead.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err117];
}
else {
vErrors.push(err117);
}
errors++;
}
}
if(data30.markerShape !== undefined){
let data40 = data30.markerShape;
if(!((((((data40 === "circle") || (data40 === "square")) || (data40 === "triangle")) || (data40 === "diamond")) || (data40 === "cross")) || (data40 === "plus"))){
const err118 = {instancePath:instancePath+"/style/markerShape",schemaPath:"#/properties/style/properties/markerShape/enum",keyword:"enum",params:{allowedValues: schema61.properties.style.properties.markerShape.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err118];
}
else {
vErrors.push(err118);
}
errors++;
}
}
if(data30.markerSizePt !== undefined){
let data41 = data30.markerSizePt;
if((typeof data41 == "number") && (isFinite(data41))){
if(data41 > 32 || isNaN(data41)){
const err119 = {instancePath:instancePath+"/style/markerSizePt",schemaPath:"#/properties/style/properties/markerSizePt/maximum",keyword:"maximum",params:{comparison: "<=", limit: 32},message:"must be <= 32"};
if(vErrors === null){
vErrors = [err119];
}
else {
vErrors.push(err119);
}
errors++;
}
if(data41 < 0 || isNaN(data41)){
const err120 = {instancePath:instancePath+"/style/markerSizePt",schemaPath:"#/properties/style/properties/markerSizePt/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err120];
}
else {
vErrors.push(err120);
}
errors++;
}
}
else {
const err121 = {instancePath:instancePath+"/style/markerSizePt",schemaPath:"#/properties/style/properties/markerSizePt/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err121];
}
else {
vErrors.push(err121);
}
errors++;
}
}
}
else {
const err122 = {instancePath:instancePath+"/style",schemaPath:"#/properties/style/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err122];
}
else {
vErrors.push(err122);
}
errors++;
}
}
if(data.zIndex !== undefined){
let data42 = data.zIndex;
if(!(((typeof data42 == "number") && (!(data42 % 1) && !isNaN(data42))) && (isFinite(data42)))){
const err123 = {instancePath:instancePath+"/zIndex",schemaPath:"#/properties/zIndex/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err123];
}
else {
vErrors.push(err123);
}
errors++;
}
}
if(data.visible !== undefined){
if(typeof data.visible !== "boolean"){
const err124 = {instancePath:instancePath+"/visible",schemaPath:"#/properties/visible/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err124];
}
else {
vErrors.push(err124);
}
errors++;
}
}
if(data.locked !== undefined){
if(typeof data.locked !== "boolean"){
const err125 = {instancePath:instancePath+"/locked",schemaPath:"#/properties/locked/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err125];
}
else {
vErrors.push(err125);
}
errors++;
}
}
if(data.table !== undefined){
if(!(validate39(data.table, {instancePath:instancePath+"/table",parentData:data,parentDataProperty:"table",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate39.errors : vErrors.concat(validate39.errors);
errors = vErrors.length;
}
}
}
else {
const err126 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err126];
}
else {
vErrors.push(err126);
}
errors++;
}
validate38.errors = vErrors;
return errors === 0;
}
validate38.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema66 = {"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"kind":{"enum":["linear-fit","polynomial-fit","exponential-fit","power-fit","savitzky-golay","moving-average","derivative","integral","interpolation","statistics","baseline","peaks","area"]},"sourceDatasetIds":{"type":"array","items":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"minItems":1},"resultDatasetId":{"anyOf":[{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},{"type":"null"}]},"parameters":{"type":"object","maxProperties":60,"additionalProperties":{"type":["string","number","integer","boolean","null","array","object"]}},"algorithmVersion":{"type":"integer","minimum":1},"status":{"enum":["valid","outdated","invalid"]},"summary":{"type":"object","maxProperties":60,"additionalProperties":{"type":["string","number","integer","boolean","null"]}},"data":{"type":"object","additionalProperties":false,"properties":{"peaks":{"type":"array","maxItems":1000000,"items":{"$ref":"#/$defs/peakMeasurement"}}}},"display":{"type":"object","additionalProperties":false,"properties":{"visible":{"type":"boolean"},"stroke":{"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"},"opacity":{"type":"number","minimum":0,"maximum":1},"label":{"type":"boolean"}},"required":["visible","stroke","opacity","label"]}},"required":["id","kind","sourceDatasetIds","resultDatasetId","parameters","algorithmVersion","status","summary"]};
const schema67 = {"type":"object","additionalProperties":false,"properties":{"index":{"type":"integer","minimum":0},"x":{"type":"number"},"y":{"type":"number"},"direction":{"enum":["max","min"]},"prominence":{"type":["number","null"],"minimum":0},"width":{"type":["number","null"],"minimum":0},"left":{"type":["number","null"]},"right":{"type":["number","null"]},"level":{"type":["number","null"]},"incomplete":{"type":"boolean"}},"required":["index","x","y","direction","prominence","width","left","right","level","incomplete"]};

function validate42(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate42.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.id === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.kind === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "kind"},message:"must have required property '"+"kind"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.sourceDatasetIds === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "sourceDatasetIds"},message:"must have required property '"+"sourceDatasetIds"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.resultDatasetId === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "resultDatasetId"},message:"must have required property '"+"resultDatasetId"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.parameters === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "parameters"},message:"must have required property '"+"parameters"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data.algorithmVersion === undefined){
const err5 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "algorithmVersion"},message:"must have required property '"+"algorithmVersion"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data.status === undefined){
const err6 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "status"},message:"must have required property '"+"status"+"'"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
if(data.summary === undefined){
const err7 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "summary"},message:"must have required property '"+"summary"+"'"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
for(const key0 in data){
if(!(func1.call(schema66.properties, key0))){
const err8 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
if(data.id !== undefined){
let data0 = data.id;
if(typeof data0 === "string"){
if(!pattern6.test(data0)){
const err9 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"+"\""};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
else {
const err10 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
if(data.kind !== undefined){
let data1 = data.kind;
if(!(((((((((((((data1 === "linear-fit") || (data1 === "polynomial-fit")) || (data1 === "exponential-fit")) || (data1 === "power-fit")) || (data1 === "savitzky-golay")) || (data1 === "moving-average")) || (data1 === "derivative")) || (data1 === "integral")) || (data1 === "interpolation")) || (data1 === "statistics")) || (data1 === "baseline")) || (data1 === "peaks")) || (data1 === "area"))){
const err11 = {instancePath:instancePath+"/kind",schemaPath:"#/properties/kind/enum",keyword:"enum",params:{allowedValues: schema66.properties.kind.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
if(data.sourceDatasetIds !== undefined){
let data2 = data.sourceDatasetIds;
if(Array.isArray(data2)){
if(data2.length < 1){
const err12 = {instancePath:instancePath+"/sourceDatasetIds",schemaPath:"#/properties/sourceDatasetIds/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
const len0 = data2.length;
for(let i0=0; i0<len0; i0++){
let data3 = data2[i0];
if(typeof data3 === "string"){
if(!pattern6.test(data3)){
const err13 = {instancePath:instancePath+"/sourceDatasetIds/" + i0,schemaPath:"#/properties/sourceDatasetIds/items/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"+"\""};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
else {
const err14 = {instancePath:instancePath+"/sourceDatasetIds/" + i0,schemaPath:"#/properties/sourceDatasetIds/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
}
else {
const err15 = {instancePath:instancePath+"/sourceDatasetIds",schemaPath:"#/properties/sourceDatasetIds/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
if(data.resultDatasetId !== undefined){
let data4 = data.resultDatasetId;
const _errs10 = errors;
let valid3 = false;
const _errs11 = errors;
if(typeof data4 === "string"){
if(!pattern6.test(data4)){
const err16 = {instancePath:instancePath+"/resultDatasetId",schemaPath:"#/properties/resultDatasetId/anyOf/0/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"+"\""};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
}
else {
const err17 = {instancePath:instancePath+"/resultDatasetId",schemaPath:"#/properties/resultDatasetId/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
var _valid0 = _errs11 === errors;
valid3 = valid3 || _valid0;
const _errs13 = errors;
if(data4 !== null){
const err18 = {instancePath:instancePath+"/resultDatasetId",schemaPath:"#/properties/resultDatasetId/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
var _valid0 = _errs13 === errors;
valid3 = valid3 || _valid0;
if(!valid3){
const err19 = {instancePath:instancePath+"/resultDatasetId",schemaPath:"#/properties/resultDatasetId/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
else {
errors = _errs10;
if(vErrors !== null){
if(_errs10){
vErrors.length = _errs10;
}
else {
vErrors = null;
}
}
}
}
if(data.parameters !== undefined){
let data5 = data.parameters;
if(data5 && typeof data5 == "object" && !Array.isArray(data5)){
if(Object.keys(data5).length > 60){
const err20 = {instancePath:instancePath+"/parameters",schemaPath:"#/properties/parameters/maxProperties",keyword:"maxProperties",params:{limit: 60},message:"must NOT have more than 60 properties"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
for(const key1 in data5){
let data6 = data5[key1];
if((((typeof data6 != "object") && (typeof data6 !== "string")) && (!((typeof data6 == "number") && (isFinite(data6))))) && (typeof data6 !== "boolean")){
const err21 = {instancePath:instancePath+"/parameters/" + key1.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/properties/parameters/additionalProperties/type",keyword:"type",params:{type: schema66.properties.parameters.additionalProperties.type},message:"must be string,number,integer,boolean,null,array,object"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
}
}
else {
const err22 = {instancePath:instancePath+"/parameters",schemaPath:"#/properties/parameters/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
}
if(data.algorithmVersion !== undefined){
let data7 = data.algorithmVersion;
if(!(((typeof data7 == "number") && (!(data7 % 1) && !isNaN(data7))) && (isFinite(data7)))){
const err23 = {instancePath:instancePath+"/algorithmVersion",schemaPath:"#/properties/algorithmVersion/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
if((typeof data7 == "number") && (isFinite(data7))){
if(data7 < 1 || isNaN(data7)){
const err24 = {instancePath:instancePath+"/algorithmVersion",schemaPath:"#/properties/algorithmVersion/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
}
}
if(data.status !== undefined){
let data8 = data.status;
if(!(((data8 === "valid") || (data8 === "outdated")) || (data8 === "invalid"))){
const err25 = {instancePath:instancePath+"/status",schemaPath:"#/properties/status/enum",keyword:"enum",params:{allowedValues: schema66.properties.status.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
}
if(data.summary !== undefined){
let data9 = data.summary;
if(data9 && typeof data9 == "object" && !Array.isArray(data9)){
if(Object.keys(data9).length > 60){
const err26 = {instancePath:instancePath+"/summary",schemaPath:"#/properties/summary/maxProperties",keyword:"maxProperties",params:{limit: 60},message:"must NOT have more than 60 properties"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
for(const key2 in data9){
let data10 = data9[key2];
if((((typeof data10 !== "string") && (!((typeof data10 == "number") && (isFinite(data10))))) && (typeof data10 !== "boolean")) && (data10 !== null)){
const err27 = {instancePath:instancePath+"/summary/" + key2.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/properties/summary/additionalProperties/type",keyword:"type",params:{type: schema66.properties.summary.additionalProperties.type},message:"must be string,number,integer,boolean,null"};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
}
}
else {
const err28 = {instancePath:instancePath+"/summary",schemaPath:"#/properties/summary/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
}
if(data.data !== undefined){
let data11 = data.data;
if(data11 && typeof data11 == "object" && !Array.isArray(data11)){
for(const key3 in data11){
if(!(key3 === "peaks")){
const err29 = {instancePath:instancePath+"/data",schemaPath:"#/properties/data/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key3},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
}
}
if(data11.peaks !== undefined){
let data12 = data11.peaks;
if(Array.isArray(data12)){
if(data12.length > 1000000){
const err30 = {instancePath:instancePath+"/data/peaks",schemaPath:"#/properties/data/properties/peaks/maxItems",keyword:"maxItems",params:{limit: 1000000},message:"must NOT have more than 1000000 items"};
if(vErrors === null){
vErrors = [err30];
}
else {
vErrors.push(err30);
}
errors++;
}
const len1 = data12.length;
for(let i1=0; i1<len1; i1++){
let data13 = data12[i1];
if(data13 && typeof data13 == "object" && !Array.isArray(data13)){
if(data13.index === undefined){
const err31 = {instancePath:instancePath+"/data/peaks/" + i1,schemaPath:"#/$defs/peakMeasurement/required",keyword:"required",params:{missingProperty: "index"},message:"must have required property '"+"index"+"'"};
if(vErrors === null){
vErrors = [err31];
}
else {
vErrors.push(err31);
}
errors++;
}
if(data13.x === undefined){
const err32 = {instancePath:instancePath+"/data/peaks/" + i1,schemaPath:"#/$defs/peakMeasurement/required",keyword:"required",params:{missingProperty: "x"},message:"must have required property '"+"x"+"'"};
if(vErrors === null){
vErrors = [err32];
}
else {
vErrors.push(err32);
}
errors++;
}
if(data13.y === undefined){
const err33 = {instancePath:instancePath+"/data/peaks/" + i1,schemaPath:"#/$defs/peakMeasurement/required",keyword:"required",params:{missingProperty: "y"},message:"must have required property '"+"y"+"'"};
if(vErrors === null){
vErrors = [err33];
}
else {
vErrors.push(err33);
}
errors++;
}
if(data13.direction === undefined){
const err34 = {instancePath:instancePath+"/data/peaks/" + i1,schemaPath:"#/$defs/peakMeasurement/required",keyword:"required",params:{missingProperty: "direction"},message:"must have required property '"+"direction"+"'"};
if(vErrors === null){
vErrors = [err34];
}
else {
vErrors.push(err34);
}
errors++;
}
if(data13.prominence === undefined){
const err35 = {instancePath:instancePath+"/data/peaks/" + i1,schemaPath:"#/$defs/peakMeasurement/required",keyword:"required",params:{missingProperty: "prominence"},message:"must have required property '"+"prominence"+"'"};
if(vErrors === null){
vErrors = [err35];
}
else {
vErrors.push(err35);
}
errors++;
}
if(data13.width === undefined){
const err36 = {instancePath:instancePath+"/data/peaks/" + i1,schemaPath:"#/$defs/peakMeasurement/required",keyword:"required",params:{missingProperty: "width"},message:"must have required property '"+"width"+"'"};
if(vErrors === null){
vErrors = [err36];
}
else {
vErrors.push(err36);
}
errors++;
}
if(data13.left === undefined){
const err37 = {instancePath:instancePath+"/data/peaks/" + i1,schemaPath:"#/$defs/peakMeasurement/required",keyword:"required",params:{missingProperty: "left"},message:"must have required property '"+"left"+"'"};
if(vErrors === null){
vErrors = [err37];
}
else {
vErrors.push(err37);
}
errors++;
}
if(data13.right === undefined){
const err38 = {instancePath:instancePath+"/data/peaks/" + i1,schemaPath:"#/$defs/peakMeasurement/required",keyword:"required",params:{missingProperty: "right"},message:"must have required property '"+"right"+"'"};
if(vErrors === null){
vErrors = [err38];
}
else {
vErrors.push(err38);
}
errors++;
}
if(data13.level === undefined){
const err39 = {instancePath:instancePath+"/data/peaks/" + i1,schemaPath:"#/$defs/peakMeasurement/required",keyword:"required",params:{missingProperty: "level"},message:"must have required property '"+"level"+"'"};
if(vErrors === null){
vErrors = [err39];
}
else {
vErrors.push(err39);
}
errors++;
}
if(data13.incomplete === undefined){
const err40 = {instancePath:instancePath+"/data/peaks/" + i1,schemaPath:"#/$defs/peakMeasurement/required",keyword:"required",params:{missingProperty: "incomplete"},message:"must have required property '"+"incomplete"+"'"};
if(vErrors === null){
vErrors = [err40];
}
else {
vErrors.push(err40);
}
errors++;
}
for(const key4 in data13){
if(!(func1.call(schema67.properties, key4))){
const err41 = {instancePath:instancePath+"/data/peaks/" + i1,schemaPath:"#/$defs/peakMeasurement/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key4},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err41];
}
else {
vErrors.push(err41);
}
errors++;
}
}
if(data13.index !== undefined){
let data14 = data13.index;
if(!(((typeof data14 == "number") && (!(data14 % 1) && !isNaN(data14))) && (isFinite(data14)))){
const err42 = {instancePath:instancePath+"/data/peaks/" + i1+"/index",schemaPath:"#/$defs/peakMeasurement/properties/index/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err42];
}
else {
vErrors.push(err42);
}
errors++;
}
if((typeof data14 == "number") && (isFinite(data14))){
if(data14 < 0 || isNaN(data14)){
const err43 = {instancePath:instancePath+"/data/peaks/" + i1+"/index",schemaPath:"#/$defs/peakMeasurement/properties/index/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err43];
}
else {
vErrors.push(err43);
}
errors++;
}
}
}
if(data13.x !== undefined){
let data15 = data13.x;
if(!((typeof data15 == "number") && (isFinite(data15)))){
const err44 = {instancePath:instancePath+"/data/peaks/" + i1+"/x",schemaPath:"#/$defs/peakMeasurement/properties/x/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err44];
}
else {
vErrors.push(err44);
}
errors++;
}
}
if(data13.y !== undefined){
let data16 = data13.y;
if(!((typeof data16 == "number") && (isFinite(data16)))){
const err45 = {instancePath:instancePath+"/data/peaks/" + i1+"/y",schemaPath:"#/$defs/peakMeasurement/properties/y/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err45];
}
else {
vErrors.push(err45);
}
errors++;
}
}
if(data13.direction !== undefined){
let data17 = data13.direction;
if(!((data17 === "max") || (data17 === "min"))){
const err46 = {instancePath:instancePath+"/data/peaks/" + i1+"/direction",schemaPath:"#/$defs/peakMeasurement/properties/direction/enum",keyword:"enum",params:{allowedValues: schema67.properties.direction.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err46];
}
else {
vErrors.push(err46);
}
errors++;
}
}
if(data13.prominence !== undefined){
let data18 = data13.prominence;
if((!((typeof data18 == "number") && (isFinite(data18)))) && (data18 !== null)){
const err47 = {instancePath:instancePath+"/data/peaks/" + i1+"/prominence",schemaPath:"#/$defs/peakMeasurement/properties/prominence/type",keyword:"type",params:{type: schema67.properties.prominence.type},message:"must be number,null"};
if(vErrors === null){
vErrors = [err47];
}
else {
vErrors.push(err47);
}
errors++;
}
if((typeof data18 == "number") && (isFinite(data18))){
if(data18 < 0 || isNaN(data18)){
const err48 = {instancePath:instancePath+"/data/peaks/" + i1+"/prominence",schemaPath:"#/$defs/peakMeasurement/properties/prominence/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err48];
}
else {
vErrors.push(err48);
}
errors++;
}
}
}
if(data13.width !== undefined){
let data19 = data13.width;
if((!((typeof data19 == "number") && (isFinite(data19)))) && (data19 !== null)){
const err49 = {instancePath:instancePath+"/data/peaks/" + i1+"/width",schemaPath:"#/$defs/peakMeasurement/properties/width/type",keyword:"type",params:{type: schema67.properties.width.type},message:"must be number,null"};
if(vErrors === null){
vErrors = [err49];
}
else {
vErrors.push(err49);
}
errors++;
}
if((typeof data19 == "number") && (isFinite(data19))){
if(data19 < 0 || isNaN(data19)){
const err50 = {instancePath:instancePath+"/data/peaks/" + i1+"/width",schemaPath:"#/$defs/peakMeasurement/properties/width/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err50];
}
else {
vErrors.push(err50);
}
errors++;
}
}
}
if(data13.left !== undefined){
let data20 = data13.left;
if((!((typeof data20 == "number") && (isFinite(data20)))) && (data20 !== null)){
const err51 = {instancePath:instancePath+"/data/peaks/" + i1+"/left",schemaPath:"#/$defs/peakMeasurement/properties/left/type",keyword:"type",params:{type: schema67.properties.left.type},message:"must be number,null"};
if(vErrors === null){
vErrors = [err51];
}
else {
vErrors.push(err51);
}
errors++;
}
}
if(data13.right !== undefined){
let data21 = data13.right;
if((!((typeof data21 == "number") && (isFinite(data21)))) && (data21 !== null)){
const err52 = {instancePath:instancePath+"/data/peaks/" + i1+"/right",schemaPath:"#/$defs/peakMeasurement/properties/right/type",keyword:"type",params:{type: schema67.properties.right.type},message:"must be number,null"};
if(vErrors === null){
vErrors = [err52];
}
else {
vErrors.push(err52);
}
errors++;
}
}
if(data13.level !== undefined){
let data22 = data13.level;
if((!((typeof data22 == "number") && (isFinite(data22)))) && (data22 !== null)){
const err53 = {instancePath:instancePath+"/data/peaks/" + i1+"/level",schemaPath:"#/$defs/peakMeasurement/properties/level/type",keyword:"type",params:{type: schema67.properties.level.type},message:"must be number,null"};
if(vErrors === null){
vErrors = [err53];
}
else {
vErrors.push(err53);
}
errors++;
}
}
if(data13.incomplete !== undefined){
if(typeof data13.incomplete !== "boolean"){
const err54 = {instancePath:instancePath+"/data/peaks/" + i1+"/incomplete",schemaPath:"#/$defs/peakMeasurement/properties/incomplete/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err54];
}
else {
vErrors.push(err54);
}
errors++;
}
}
}
else {
const err55 = {instancePath:instancePath+"/data/peaks/" + i1,schemaPath:"#/$defs/peakMeasurement/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err55];
}
else {
vErrors.push(err55);
}
errors++;
}
}
}
else {
const err56 = {instancePath:instancePath+"/data/peaks",schemaPath:"#/properties/data/properties/peaks/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err56];
}
else {
vErrors.push(err56);
}
errors++;
}
}
}
else {
const err57 = {instancePath:instancePath+"/data",schemaPath:"#/properties/data/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err57];
}
else {
vErrors.push(err57);
}
errors++;
}
}
if(data.display !== undefined){
let data24 = data.display;
if(data24 && typeof data24 == "object" && !Array.isArray(data24)){
if(data24.visible === undefined){
const err58 = {instancePath:instancePath+"/display",schemaPath:"#/properties/display/required",keyword:"required",params:{missingProperty: "visible"},message:"must have required property '"+"visible"+"'"};
if(vErrors === null){
vErrors = [err58];
}
else {
vErrors.push(err58);
}
errors++;
}
if(data24.stroke === undefined){
const err59 = {instancePath:instancePath+"/display",schemaPath:"#/properties/display/required",keyword:"required",params:{missingProperty: "stroke"},message:"must have required property '"+"stroke"+"'"};
if(vErrors === null){
vErrors = [err59];
}
else {
vErrors.push(err59);
}
errors++;
}
if(data24.opacity === undefined){
const err60 = {instancePath:instancePath+"/display",schemaPath:"#/properties/display/required",keyword:"required",params:{missingProperty: "opacity"},message:"must have required property '"+"opacity"+"'"};
if(vErrors === null){
vErrors = [err60];
}
else {
vErrors.push(err60);
}
errors++;
}
if(data24.label === undefined){
const err61 = {instancePath:instancePath+"/display",schemaPath:"#/properties/display/required",keyword:"required",params:{missingProperty: "label"},message:"must have required property '"+"label"+"'"};
if(vErrors === null){
vErrors = [err61];
}
else {
vErrors.push(err61);
}
errors++;
}
for(const key5 in data24){
if(!((((key5 === "visible") || (key5 === "stroke")) || (key5 === "opacity")) || (key5 === "label"))){
const err62 = {instancePath:instancePath+"/display",schemaPath:"#/properties/display/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key5},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err62];
}
else {
vErrors.push(err62);
}
errors++;
}
}
if(data24.visible !== undefined){
if(typeof data24.visible !== "boolean"){
const err63 = {instancePath:instancePath+"/display/visible",schemaPath:"#/properties/display/properties/visible/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err63];
}
else {
vErrors.push(err63);
}
errors++;
}
}
if(data24.stroke !== undefined){
let data26 = data24.stroke;
if(typeof data26 === "string"){
if(!pattern7.test(data26)){
const err64 = {instancePath:instancePath+"/display/stroke",schemaPath:"#/properties/display/properties/stroke/pattern",keyword:"pattern",params:{pattern: "^#[0-9A-Fa-f]{6}$"},message:"must match pattern \""+"^#[0-9A-Fa-f]{6}$"+"\""};
if(vErrors === null){
vErrors = [err64];
}
else {
vErrors.push(err64);
}
errors++;
}
}
else {
const err65 = {instancePath:instancePath+"/display/stroke",schemaPath:"#/properties/display/properties/stroke/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err65];
}
else {
vErrors.push(err65);
}
errors++;
}
}
if(data24.opacity !== undefined){
let data27 = data24.opacity;
if((typeof data27 == "number") && (isFinite(data27))){
if(data27 > 1 || isNaN(data27)){
const err66 = {instancePath:instancePath+"/display/opacity",schemaPath:"#/properties/display/properties/opacity/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1},message:"must be <= 1"};
if(vErrors === null){
vErrors = [err66];
}
else {
vErrors.push(err66);
}
errors++;
}
if(data27 < 0 || isNaN(data27)){
const err67 = {instancePath:instancePath+"/display/opacity",schemaPath:"#/properties/display/properties/opacity/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err67];
}
else {
vErrors.push(err67);
}
errors++;
}
}
else {
const err68 = {instancePath:instancePath+"/display/opacity",schemaPath:"#/properties/display/properties/opacity/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err68];
}
else {
vErrors.push(err68);
}
errors++;
}
}
if(data24.label !== undefined){
if(typeof data24.label !== "boolean"){
const err69 = {instancePath:instancePath+"/display/label",schemaPath:"#/properties/display/properties/label/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err69];
}
else {
vErrors.push(err69);
}
errors++;
}
}
}
else {
const err70 = {instancePath:instancePath+"/display",schemaPath:"#/properties/display/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err70];
}
else {
vErrors.push(err70);
}
errors++;
}
}
}
else {
const err71 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err71];
}
else {
vErrors.push(err71);
}
errors++;
}
validate42.errors = vErrors;
return errors === 0;
}
validate42.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate35(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
/*# sourceURL="https://github.com/anatamien/APIO-GRAPH/blob/main/schemas/aph-1.2.schema.json" */;
let vErrors = null;
let errors = 0;
const evaluated0 = validate35.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.format === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "format"},message:"must have required property '"+"format"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.schemaVersion === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "schemaVersion"},message:"must have required property '"+"schemaVersion"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.createdWith === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "createdWith"},message:"must have required property '"+"createdWith"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.project === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "project"},message:"must have required property '"+"project"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.page === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "page"},message:"must have required property '"+"page"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data.axes === undefined){
const err5 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "axes"},message:"must have required property '"+"axes"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data.datasets === undefined){
const err6 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "datasets"},message:"must have required property '"+"datasets"+"'"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
if(data.series === undefined){
const err7 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "series"},message:"must have required property '"+"series"+"'"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
if(data.objects === undefined){
const err8 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "objects"},message:"must have required property '"+"objects"+"'"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
if(data.calculations === undefined){
const err9 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "calculations"},message:"must have required property '"+"calculations"+"'"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
if(data.legend === undefined){
const err10 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "legend"},message:"must have required property '"+"legend"+"'"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
if(data.viewport === undefined){
const err11 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "viewport"},message:"must have required property '"+"viewport"+"'"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
if(data.editor === undefined){
const err12 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "editor"},message:"must have required property '"+"editor"+"'"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
if(data.extensions === undefined){
const err13 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "extensions"},message:"must have required property '"+"extensions"+"'"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
for(const key0 in data){
if(!(func1.call(schema55.properties, key0))){
const err14 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
if(data.format !== undefined){
if("APIO_GRAPH_PROJECT" !== data.format){
const err15 = {instancePath:instancePath+"/format",schemaPath:"#/properties/format/const",keyword:"const",params:{allowedValue: "APIO_GRAPH_PROJECT"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
if(data.schemaVersion !== undefined){
let data1 = data.schemaVersion;
if(typeof data1 === "string"){
if(!pattern52.test(data1)){
const err16 = {instancePath:instancePath+"/schemaVersion",schemaPath:"#/properties/schemaVersion/pattern",keyword:"pattern",params:{pattern: "^1\\.2\\.[0-9]+$"},message:"must match pattern \""+"^1\\.2\\.[0-9]+$"+"\""};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
}
else {
const err17 = {instancePath:instancePath+"/schemaVersion",schemaPath:"#/properties/schemaVersion/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
}
if(data.createdWith !== undefined){
let data2 = data.createdWith;
if(data2 && typeof data2 == "object" && !Array.isArray(data2)){
if(data2.name === undefined){
const err18 = {instancePath:instancePath+"/createdWith",schemaPath:"#/properties/createdWith/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
if(data2.version === undefined){
const err19 = {instancePath:instancePath+"/createdWith",schemaPath:"#/properties/createdWith/required",keyword:"required",params:{missingProperty: "version"},message:"must have required property '"+"version"+"'"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
for(const key1 in data2){
if(!((key1 === "name") || (key1 === "version"))){
const err20 = {instancePath:instancePath+"/createdWith",schemaPath:"#/properties/createdWith/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
}
if(data2.name !== undefined){
if("APIO GRAPH" !== data2.name){
const err21 = {instancePath:instancePath+"/createdWith/name",schemaPath:"#/properties/createdWith/properties/name/const",keyword:"const",params:{allowedValue: "APIO GRAPH"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
}
if(data2.version !== undefined){
let data4 = data2.version;
if(typeof data4 === "string"){
if(func2(data4) < 1){
const err22 = {instancePath:instancePath+"/createdWith/version",schemaPath:"#/properties/createdWith/properties/version/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
}
else {
const err23 = {instancePath:instancePath+"/createdWith/version",schemaPath:"#/properties/createdWith/properties/version/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
}
}
else {
const err24 = {instancePath:instancePath+"/createdWith",schemaPath:"#/properties/createdWith/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
}
if(data.project !== undefined){
let data5 = data.project;
if(data5 && typeof data5 == "object" && !Array.isArray(data5)){
if(data5.id === undefined){
const err25 = {instancePath:instancePath+"/project",schemaPath:"#/properties/project/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
if(data5.title === undefined){
const err26 = {instancePath:instancePath+"/project",schemaPath:"#/properties/project/required",keyword:"required",params:{missingProperty: "title"},message:"must have required property '"+"title"+"'"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
if(data5.createdAt === undefined){
const err27 = {instancePath:instancePath+"/project",schemaPath:"#/properties/project/required",keyword:"required",params:{missingProperty: "createdAt"},message:"must have required property '"+"createdAt"+"'"};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
if(data5.updatedAt === undefined){
const err28 = {instancePath:instancePath+"/project",schemaPath:"#/properties/project/required",keyword:"required",params:{missingProperty: "updatedAt"},message:"must have required property '"+"updatedAt"+"'"};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
for(const key2 in data5){
if(!((((key2 === "id") || (key2 === "title")) || (key2 === "createdAt")) || (key2 === "updatedAt"))){
const err29 = {instancePath:instancePath+"/project",schemaPath:"#/properties/project/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key2},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
}
}
if(data5.id !== undefined){
let data6 = data5.id;
if(typeof data6 === "string"){
if(!pattern6.test(data6)){
const err30 = {instancePath:instancePath+"/project/id",schemaPath:"#/properties/project/properties/id/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"+"\""};
if(vErrors === null){
vErrors = [err30];
}
else {
vErrors.push(err30);
}
errors++;
}
}
else {
const err31 = {instancePath:instancePath+"/project/id",schemaPath:"#/properties/project/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err31];
}
else {
vErrors.push(err31);
}
errors++;
}
}
if(data5.title !== undefined){
let data7 = data5.title;
if(typeof data7 === "string"){
if(func2(data7) > 300){
const err32 = {instancePath:instancePath+"/project/title",schemaPath:"#/properties/project/properties/title/maxLength",keyword:"maxLength",params:{limit: 300},message:"must NOT have more than 300 characters"};
if(vErrors === null){
vErrors = [err32];
}
else {
vErrors.push(err32);
}
errors++;
}
}
else {
const err33 = {instancePath:instancePath+"/project/title",schemaPath:"#/properties/project/properties/title/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err33];
}
else {
vErrors.push(err33);
}
errors++;
}
}
if(data5.createdAt !== undefined){
let data8 = data5.createdAt;
if(typeof data8 === "string"){
if(!(formats0.validate(data8))){
const err34 = {instancePath:instancePath+"/project/createdAt",schemaPath:"#/properties/project/properties/createdAt/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
if(vErrors === null){
vErrors = [err34];
}
else {
vErrors.push(err34);
}
errors++;
}
}
else {
const err35 = {instancePath:instancePath+"/project/createdAt",schemaPath:"#/properties/project/properties/createdAt/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err35];
}
else {
vErrors.push(err35);
}
errors++;
}
}
if(data5.updatedAt !== undefined){
let data9 = data5.updatedAt;
if(typeof data9 === "string"){
if(!(formats0.validate(data9))){
const err36 = {instancePath:instancePath+"/project/updatedAt",schemaPath:"#/properties/project/properties/updatedAt/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
if(vErrors === null){
vErrors = [err36];
}
else {
vErrors.push(err36);
}
errors++;
}
}
else {
const err37 = {instancePath:instancePath+"/project/updatedAt",schemaPath:"#/properties/project/properties/updatedAt/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err37];
}
else {
vErrors.push(err37);
}
errors++;
}
}
}
else {
const err38 = {instancePath:instancePath+"/project",schemaPath:"#/properties/project/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err38];
}
else {
vErrors.push(err38);
}
errors++;
}
}
if(data.page !== undefined){
let data10 = data.page;
if(data10 && typeof data10 == "object" && !Array.isArray(data10)){
if(data10.widthPx === undefined){
const err39 = {instancePath:instancePath+"/page",schemaPath:"#/properties/page/required",keyword:"required",params:{missingProperty: "widthPx"},message:"must have required property '"+"widthPx"+"'"};
if(vErrors === null){
vErrors = [err39];
}
else {
vErrors.push(err39);
}
errors++;
}
if(data10.heightPx === undefined){
const err40 = {instancePath:instancePath+"/page",schemaPath:"#/properties/page/required",keyword:"required",params:{missingProperty: "heightPx"},message:"must have required property '"+"heightPx"+"'"};
if(vErrors === null){
vErrors = [err40];
}
else {
vErrors.push(err40);
}
errors++;
}
if(data10.background === undefined){
const err41 = {instancePath:instancePath+"/page",schemaPath:"#/properties/page/required",keyword:"required",params:{missingProperty: "background"},message:"must have required property '"+"background"+"'"};
if(vErrors === null){
vErrors = [err41];
}
else {
vErrors.push(err41);
}
errors++;
}
if(data10.paddingPx === undefined){
const err42 = {instancePath:instancePath+"/page",schemaPath:"#/properties/page/required",keyword:"required",params:{missingProperty: "paddingPx"},message:"must have required property '"+"paddingPx"+"'"};
if(vErrors === null){
vErrors = [err42];
}
else {
vErrors.push(err42);
}
errors++;
}
for(const key3 in data10){
if(!((((key3 === "widthPx") || (key3 === "heightPx")) || (key3 === "background")) || (key3 === "paddingPx"))){
const err43 = {instancePath:instancePath+"/page",schemaPath:"#/properties/page/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key3},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err43];
}
else {
vErrors.push(err43);
}
errors++;
}
}
if(data10.widthPx !== undefined){
let data11 = data10.widthPx;
if(!(((typeof data11 == "number") && (!(data11 % 1) && !isNaN(data11))) && (isFinite(data11)))){
const err44 = {instancePath:instancePath+"/page/widthPx",schemaPath:"#/properties/page/properties/widthPx/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err44];
}
else {
vErrors.push(err44);
}
errors++;
}
if((typeof data11 == "number") && (isFinite(data11))){
if(data11 > 30000 || isNaN(data11)){
const err45 = {instancePath:instancePath+"/page/widthPx",schemaPath:"#/properties/page/properties/widthPx/maximum",keyword:"maximum",params:{comparison: "<=", limit: 30000},message:"must be <= 30000"};
if(vErrors === null){
vErrors = [err45];
}
else {
vErrors.push(err45);
}
errors++;
}
if(data11 < 100 || isNaN(data11)){
const err46 = {instancePath:instancePath+"/page/widthPx",schemaPath:"#/properties/page/properties/widthPx/minimum",keyword:"minimum",params:{comparison: ">=", limit: 100},message:"must be >= 100"};
if(vErrors === null){
vErrors = [err46];
}
else {
vErrors.push(err46);
}
errors++;
}
}
}
if(data10.heightPx !== undefined){
let data12 = data10.heightPx;
if(!(((typeof data12 == "number") && (!(data12 % 1) && !isNaN(data12))) && (isFinite(data12)))){
const err47 = {instancePath:instancePath+"/page/heightPx",schemaPath:"#/properties/page/properties/heightPx/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err47];
}
else {
vErrors.push(err47);
}
errors++;
}
if((typeof data12 == "number") && (isFinite(data12))){
if(data12 > 30000 || isNaN(data12)){
const err48 = {instancePath:instancePath+"/page/heightPx",schemaPath:"#/properties/page/properties/heightPx/maximum",keyword:"maximum",params:{comparison: "<=", limit: 30000},message:"must be <= 30000"};
if(vErrors === null){
vErrors = [err48];
}
else {
vErrors.push(err48);
}
errors++;
}
if(data12 < 100 || isNaN(data12)){
const err49 = {instancePath:instancePath+"/page/heightPx",schemaPath:"#/properties/page/properties/heightPx/minimum",keyword:"minimum",params:{comparison: ">=", limit: 100},message:"must be >= 100"};
if(vErrors === null){
vErrors = [err49];
}
else {
vErrors.push(err49);
}
errors++;
}
}
}
if(data10.background !== undefined){
let data13 = data10.background;
if(typeof data13 === "string"){
if(!pattern7.test(data13)){
const err50 = {instancePath:instancePath+"/page/background",schemaPath:"#/properties/page/properties/background/pattern",keyword:"pattern",params:{pattern: "^#[0-9A-Fa-f]{6}$"},message:"must match pattern \""+"^#[0-9A-Fa-f]{6}$"+"\""};
if(vErrors === null){
vErrors = [err50];
}
else {
vErrors.push(err50);
}
errors++;
}
}
else {
const err51 = {instancePath:instancePath+"/page/background",schemaPath:"#/properties/page/properties/background/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err51];
}
else {
vErrors.push(err51);
}
errors++;
}
}
if(data10.paddingPx !== undefined){
let data14 = data10.paddingPx;
if((typeof data14 == "number") && (isFinite(data14))){
if(data14 > 2000 || isNaN(data14)){
const err52 = {instancePath:instancePath+"/page/paddingPx",schemaPath:"#/properties/page/properties/paddingPx/maximum",keyword:"maximum",params:{comparison: "<=", limit: 2000},message:"must be <= 2000"};
if(vErrors === null){
vErrors = [err52];
}
else {
vErrors.push(err52);
}
errors++;
}
if(data14 < 0 || isNaN(data14)){
const err53 = {instancePath:instancePath+"/page/paddingPx",schemaPath:"#/properties/page/properties/paddingPx/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err53];
}
else {
vErrors.push(err53);
}
errors++;
}
}
else {
const err54 = {instancePath:instancePath+"/page/paddingPx",schemaPath:"#/properties/page/properties/paddingPx/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err54];
}
else {
vErrors.push(err54);
}
errors++;
}
}
}
else {
const err55 = {instancePath:instancePath+"/page",schemaPath:"#/properties/page/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err55];
}
else {
vErrors.push(err55);
}
errors++;
}
}
if(data.axes !== undefined){
let data15 = data.axes;
if(data15 && typeof data15 == "object" && !Array.isArray(data15)){
if(data15.x === undefined){
const err56 = {instancePath:instancePath+"/axes",schemaPath:"#/properties/axes/required",keyword:"required",params:{missingProperty: "x"},message:"must have required property '"+"x"+"'"};
if(vErrors === null){
vErrors = [err56];
}
else {
vErrors.push(err56);
}
errors++;
}
if(data15.y === undefined){
const err57 = {instancePath:instancePath+"/axes",schemaPath:"#/properties/axes/required",keyword:"required",params:{missingProperty: "y"},message:"must have required property '"+"y"+"'"};
if(vErrors === null){
vErrors = [err57];
}
else {
vErrors.push(err57);
}
errors++;
}
for(const key4 in data15){
if(!((key4 === "x") || (key4 === "y"))){
const err58 = {instancePath:instancePath+"/axes",schemaPath:"#/properties/axes/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key4},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err58];
}
else {
vErrors.push(err58);
}
errors++;
}
}
if(data15.x !== undefined){
let data16 = data15.x;
if(data16 && typeof data16 == "object" && !Array.isArray(data16)){
if(data16.label === undefined){
const err59 = {instancePath:instancePath+"/axes/x",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "label"},message:"must have required property '"+"label"+"'"};
if(vErrors === null){
vErrors = [err59];
}
else {
vErrors.push(err59);
}
errors++;
}
if(data16.unit === undefined){
const err60 = {instancePath:instancePath+"/axes/x",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "unit"},message:"must have required property '"+"unit"+"'"};
if(vErrors === null){
vErrors = [err60];
}
else {
vErrors.push(err60);
}
errors++;
}
if(data16.scale === undefined){
const err61 = {instancePath:instancePath+"/axes/x",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "scale"},message:"must have required property '"+"scale"+"'"};
if(vErrors === null){
vErrors = [err61];
}
else {
vErrors.push(err61);
}
errors++;
}
if(data16.mode === undefined){
const err62 = {instancePath:instancePath+"/axes/x",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "mode"},message:"must have required property '"+"mode"+"'"};
if(vErrors === null){
vErrors = [err62];
}
else {
vErrors.push(err62);
}
errors++;
}
if(data16.min === undefined){
const err63 = {instancePath:instancePath+"/axes/x",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "min"},message:"must have required property '"+"min"+"'"};
if(vErrors === null){
vErrors = [err63];
}
else {
vErrors.push(err63);
}
errors++;
}
if(data16.max === undefined){
const err64 = {instancePath:instancePath+"/axes/x",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "max"},message:"must have required property '"+"max"+"'"};
if(vErrors === null){
vErrors = [err64];
}
else {
vErrors.push(err64);
}
errors++;
}
if(data16.tickMode === undefined){
const err65 = {instancePath:instancePath+"/axes/x",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "tickMode"},message:"must have required property '"+"tickMode"+"'"};
if(vErrors === null){
vErrors = [err65];
}
else {
vErrors.push(err65);
}
errors++;
}
if(data16.tickStep === undefined){
const err66 = {instancePath:instancePath+"/axes/x",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "tickStep"},message:"must have required property '"+"tickStep"+"'"};
if(vErrors === null){
vErrors = [err66];
}
else {
vErrors.push(err66);
}
errors++;
}
if(data16.tickOrigin === undefined){
const err67 = {instancePath:instancePath+"/axes/x",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "tickOrigin"},message:"must have required property '"+"tickOrigin"+"'"};
if(vErrors === null){
vErrors = [err67];
}
else {
vErrors.push(err67);
}
errors++;
}
if(data16.minorDivisions === undefined){
const err68 = {instancePath:instancePath+"/axes/x",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "minorDivisions"},message:"must have required property '"+"minorDivisions"+"'"};
if(vErrors === null){
vErrors = [err68];
}
else {
vErrors.push(err68);
}
errors++;
}
if(data16.grid === undefined){
const err69 = {instancePath:instancePath+"/axes/x",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "grid"},message:"must have required property '"+"grid"+"'"};
if(vErrors === null){
vErrors = [err69];
}
else {
vErrors.push(err69);
}
errors++;
}
if(data16.numberFormat === undefined){
const err70 = {instancePath:instancePath+"/axes/x",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "numberFormat"},message:"must have required property '"+"numberFormat"+"'"};
if(vErrors === null){
vErrors = [err70];
}
else {
vErrors.push(err70);
}
errors++;
}
if(data16.precision === undefined){
const err71 = {instancePath:instancePath+"/axes/x",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "precision"},message:"must have required property '"+"precision"+"'"};
if(vErrors === null){
vErrors = [err71];
}
else {
vErrors.push(err71);
}
errors++;
}
if(data16.strokeWidthPt === undefined){
const err72 = {instancePath:instancePath+"/axes/x",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "strokeWidthPt"},message:"must have required property '"+"strokeWidthPt"+"'"};
if(vErrors === null){
vErrors = [err72];
}
else {
vErrors.push(err72);
}
errors++;
}
if(data16.labelSizePt === undefined){
const err73 = {instancePath:instancePath+"/axes/x",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "labelSizePt"},message:"must have required property '"+"labelSizePt"+"'"};
if(vErrors === null){
vErrors = [err73];
}
else {
vErrors.push(err73);
}
errors++;
}
for(const key5 in data16){
if(!(func1.call(schema56.properties, key5))){
const err74 = {instancePath:instancePath+"/axes/x",schemaPath:"#/$defs/axis/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key5},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err74];
}
else {
vErrors.push(err74);
}
errors++;
}
}
if(data16.label !== undefined){
let data17 = data16.label;
if(typeof data17 === "string"){
if(func2(data17) > 500){
const err75 = {instancePath:instancePath+"/axes/x/label",schemaPath:"#/$defs/axis/properties/label/maxLength",keyword:"maxLength",params:{limit: 500},message:"must NOT have more than 500 characters"};
if(vErrors === null){
vErrors = [err75];
}
else {
vErrors.push(err75);
}
errors++;
}
}
else {
const err76 = {instancePath:instancePath+"/axes/x/label",schemaPath:"#/$defs/axis/properties/label/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err76];
}
else {
vErrors.push(err76);
}
errors++;
}
}
if(data16.unit !== undefined){
let data18 = data16.unit;
if(typeof data18 === "string"){
if(func2(data18) > 100){
const err77 = {instancePath:instancePath+"/axes/x/unit",schemaPath:"#/$defs/axis/properties/unit/maxLength",keyword:"maxLength",params:{limit: 100},message:"must NOT have more than 100 characters"};
if(vErrors === null){
vErrors = [err77];
}
else {
vErrors.push(err77);
}
errors++;
}
}
else {
const err78 = {instancePath:instancePath+"/axes/x/unit",schemaPath:"#/$defs/axis/properties/unit/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err78];
}
else {
vErrors.push(err78);
}
errors++;
}
}
if(data16.scale !== undefined){
if("linear" !== data16.scale){
const err79 = {instancePath:instancePath+"/axes/x/scale",schemaPath:"#/$defs/axis/properties/scale/const",keyword:"const",params:{allowedValue: "linear"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err79];
}
else {
vErrors.push(err79);
}
errors++;
}
}
if(data16.mode !== undefined){
let data20 = data16.mode;
if(!((data20 === "auto") || (data20 === "manual"))){
const err80 = {instancePath:instancePath+"/axes/x/mode",schemaPath:"#/$defs/axis/properties/mode/enum",keyword:"enum",params:{allowedValues: schema56.properties.mode.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err80];
}
else {
vErrors.push(err80);
}
errors++;
}
}
if(data16.min !== undefined){
let data21 = data16.min;
if(!((typeof data21 == "number") && (isFinite(data21)))){
const err81 = {instancePath:instancePath+"/axes/x/min",schemaPath:"#/$defs/axis/properties/min/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err81];
}
else {
vErrors.push(err81);
}
errors++;
}
}
if(data16.max !== undefined){
let data22 = data16.max;
if(!((typeof data22 == "number") && (isFinite(data22)))){
const err82 = {instancePath:instancePath+"/axes/x/max",schemaPath:"#/$defs/axis/properties/max/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err82];
}
else {
vErrors.push(err82);
}
errors++;
}
}
if(data16.tickMode !== undefined){
let data23 = data16.tickMode;
if(!((data23 === "auto") || (data23 === "manual"))){
const err83 = {instancePath:instancePath+"/axes/x/tickMode",schemaPath:"#/$defs/axis/properties/tickMode/enum",keyword:"enum",params:{allowedValues: schema56.properties.tickMode.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err83];
}
else {
vErrors.push(err83);
}
errors++;
}
}
if(data16.tickStep !== undefined){
let data24 = data16.tickStep;
if((typeof data24 == "number") && (isFinite(data24))){
if(data24 <= 0 || isNaN(data24)){
const err84 = {instancePath:instancePath+"/axes/x/tickStep",schemaPath:"#/$defs/axis/properties/tickStep/exclusiveMinimum",keyword:"exclusiveMinimum",params:{comparison: ">", limit: 0},message:"must be > 0"};
if(vErrors === null){
vErrors = [err84];
}
else {
vErrors.push(err84);
}
errors++;
}
}
else {
const err85 = {instancePath:instancePath+"/axes/x/tickStep",schemaPath:"#/$defs/axis/properties/tickStep/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err85];
}
else {
vErrors.push(err85);
}
errors++;
}
}
if(data16.tickOrigin !== undefined){
let data25 = data16.tickOrigin;
if(!((typeof data25 == "number") && (isFinite(data25)))){
const err86 = {instancePath:instancePath+"/axes/x/tickOrigin",schemaPath:"#/$defs/axis/properties/tickOrigin/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err86];
}
else {
vErrors.push(err86);
}
errors++;
}
}
if(data16.minorDivisions !== undefined){
let data26 = data16.minorDivisions;
if(!(((typeof data26 == "number") && (!(data26 % 1) && !isNaN(data26))) && (isFinite(data26)))){
const err87 = {instancePath:instancePath+"/axes/x/minorDivisions",schemaPath:"#/$defs/axis/properties/minorDivisions/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err87];
}
else {
vErrors.push(err87);
}
errors++;
}
if((typeof data26 == "number") && (isFinite(data26))){
if(data26 > 20 || isNaN(data26)){
const err88 = {instancePath:instancePath+"/axes/x/minorDivisions",schemaPath:"#/$defs/axis/properties/minorDivisions/maximum",keyword:"maximum",params:{comparison: "<=", limit: 20},message:"must be <= 20"};
if(vErrors === null){
vErrors = [err88];
}
else {
vErrors.push(err88);
}
errors++;
}
if(data26 < 0 || isNaN(data26)){
const err89 = {instancePath:instancePath+"/axes/x/minorDivisions",schemaPath:"#/$defs/axis/properties/minorDivisions/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err89];
}
else {
vErrors.push(err89);
}
errors++;
}
}
}
if(data16.grid !== undefined){
if(typeof data16.grid !== "boolean"){
const err90 = {instancePath:instancePath+"/axes/x/grid",schemaPath:"#/$defs/axis/properties/grid/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err90];
}
else {
vErrors.push(err90);
}
errors++;
}
}
if(data16.numberFormat !== undefined){
let data28 = data16.numberFormat;
if(!(((data28 === "auto") || (data28 === "fixed")) || (data28 === "scientific"))){
const err91 = {instancePath:instancePath+"/axes/x/numberFormat",schemaPath:"#/$defs/axis/properties/numberFormat/enum",keyword:"enum",params:{allowedValues: schema56.properties.numberFormat.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err91];
}
else {
vErrors.push(err91);
}
errors++;
}
}
if(data16.precision !== undefined){
let data29 = data16.precision;
if(!(((typeof data29 == "number") && (!(data29 % 1) && !isNaN(data29))) && (isFinite(data29)))){
const err92 = {instancePath:instancePath+"/axes/x/precision",schemaPath:"#/$defs/axis/properties/precision/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err92];
}
else {
vErrors.push(err92);
}
errors++;
}
if((typeof data29 == "number") && (isFinite(data29))){
if(data29 > 15 || isNaN(data29)){
const err93 = {instancePath:instancePath+"/axes/x/precision",schemaPath:"#/$defs/axis/properties/precision/maximum",keyword:"maximum",params:{comparison: "<=", limit: 15},message:"must be <= 15"};
if(vErrors === null){
vErrors = [err93];
}
else {
vErrors.push(err93);
}
errors++;
}
if(data29 < 0 || isNaN(data29)){
const err94 = {instancePath:instancePath+"/axes/x/precision",schemaPath:"#/$defs/axis/properties/precision/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err94];
}
else {
vErrors.push(err94);
}
errors++;
}
}
}
if(data16.strokeWidthPt !== undefined){
let data30 = data16.strokeWidthPt;
if((typeof data30 == "number") && (isFinite(data30))){
if(data30 > 24 || isNaN(data30)){
const err95 = {instancePath:instancePath+"/axes/x/strokeWidthPt",schemaPath:"#/$defs/axis/properties/strokeWidthPt/maximum",keyword:"maximum",params:{comparison: "<=", limit: 24},message:"must be <= 24"};
if(vErrors === null){
vErrors = [err95];
}
else {
vErrors.push(err95);
}
errors++;
}
if(data30 <= 0 || isNaN(data30)){
const err96 = {instancePath:instancePath+"/axes/x/strokeWidthPt",schemaPath:"#/$defs/axis/properties/strokeWidthPt/exclusiveMinimum",keyword:"exclusiveMinimum",params:{comparison: ">", limit: 0},message:"must be > 0"};
if(vErrors === null){
vErrors = [err96];
}
else {
vErrors.push(err96);
}
errors++;
}
}
else {
const err97 = {instancePath:instancePath+"/axes/x/strokeWidthPt",schemaPath:"#/$defs/axis/properties/strokeWidthPt/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err97];
}
else {
vErrors.push(err97);
}
errors++;
}
}
if(data16.labelSizePt !== undefined){
let data31 = data16.labelSizePt;
if((typeof data31 == "number") && (isFinite(data31))){
if(data31 > 72 || isNaN(data31)){
const err98 = {instancePath:instancePath+"/axes/x/labelSizePt",schemaPath:"#/$defs/axis/properties/labelSizePt/maximum",keyword:"maximum",params:{comparison: "<=", limit: 72},message:"must be <= 72"};
if(vErrors === null){
vErrors = [err98];
}
else {
vErrors.push(err98);
}
errors++;
}
if(data31 < 6 || isNaN(data31)){
const err99 = {instancePath:instancePath+"/axes/x/labelSizePt",schemaPath:"#/$defs/axis/properties/labelSizePt/minimum",keyword:"minimum",params:{comparison: ">=", limit: 6},message:"must be >= 6"};
if(vErrors === null){
vErrors = [err99];
}
else {
vErrors.push(err99);
}
errors++;
}
}
else {
const err100 = {instancePath:instancePath+"/axes/x/labelSizePt",schemaPath:"#/$defs/axis/properties/labelSizePt/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err100];
}
else {
vErrors.push(err100);
}
errors++;
}
}
}
else {
const err101 = {instancePath:instancePath+"/axes/x",schemaPath:"#/$defs/axis/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err101];
}
else {
vErrors.push(err101);
}
errors++;
}
}
if(data15.y !== undefined){
let data32 = data15.y;
if(data32 && typeof data32 == "object" && !Array.isArray(data32)){
if(data32.label === undefined){
const err102 = {instancePath:instancePath+"/axes/y",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "label"},message:"must have required property '"+"label"+"'"};
if(vErrors === null){
vErrors = [err102];
}
else {
vErrors.push(err102);
}
errors++;
}
if(data32.unit === undefined){
const err103 = {instancePath:instancePath+"/axes/y",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "unit"},message:"must have required property '"+"unit"+"'"};
if(vErrors === null){
vErrors = [err103];
}
else {
vErrors.push(err103);
}
errors++;
}
if(data32.scale === undefined){
const err104 = {instancePath:instancePath+"/axes/y",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "scale"},message:"must have required property '"+"scale"+"'"};
if(vErrors === null){
vErrors = [err104];
}
else {
vErrors.push(err104);
}
errors++;
}
if(data32.mode === undefined){
const err105 = {instancePath:instancePath+"/axes/y",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "mode"},message:"must have required property '"+"mode"+"'"};
if(vErrors === null){
vErrors = [err105];
}
else {
vErrors.push(err105);
}
errors++;
}
if(data32.min === undefined){
const err106 = {instancePath:instancePath+"/axes/y",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "min"},message:"must have required property '"+"min"+"'"};
if(vErrors === null){
vErrors = [err106];
}
else {
vErrors.push(err106);
}
errors++;
}
if(data32.max === undefined){
const err107 = {instancePath:instancePath+"/axes/y",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "max"},message:"must have required property '"+"max"+"'"};
if(vErrors === null){
vErrors = [err107];
}
else {
vErrors.push(err107);
}
errors++;
}
if(data32.tickMode === undefined){
const err108 = {instancePath:instancePath+"/axes/y",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "tickMode"},message:"must have required property '"+"tickMode"+"'"};
if(vErrors === null){
vErrors = [err108];
}
else {
vErrors.push(err108);
}
errors++;
}
if(data32.tickStep === undefined){
const err109 = {instancePath:instancePath+"/axes/y",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "tickStep"},message:"must have required property '"+"tickStep"+"'"};
if(vErrors === null){
vErrors = [err109];
}
else {
vErrors.push(err109);
}
errors++;
}
if(data32.tickOrigin === undefined){
const err110 = {instancePath:instancePath+"/axes/y",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "tickOrigin"},message:"must have required property '"+"tickOrigin"+"'"};
if(vErrors === null){
vErrors = [err110];
}
else {
vErrors.push(err110);
}
errors++;
}
if(data32.minorDivisions === undefined){
const err111 = {instancePath:instancePath+"/axes/y",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "minorDivisions"},message:"must have required property '"+"minorDivisions"+"'"};
if(vErrors === null){
vErrors = [err111];
}
else {
vErrors.push(err111);
}
errors++;
}
if(data32.grid === undefined){
const err112 = {instancePath:instancePath+"/axes/y",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "grid"},message:"must have required property '"+"grid"+"'"};
if(vErrors === null){
vErrors = [err112];
}
else {
vErrors.push(err112);
}
errors++;
}
if(data32.numberFormat === undefined){
const err113 = {instancePath:instancePath+"/axes/y",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "numberFormat"},message:"must have required property '"+"numberFormat"+"'"};
if(vErrors === null){
vErrors = [err113];
}
else {
vErrors.push(err113);
}
errors++;
}
if(data32.precision === undefined){
const err114 = {instancePath:instancePath+"/axes/y",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "precision"},message:"must have required property '"+"precision"+"'"};
if(vErrors === null){
vErrors = [err114];
}
else {
vErrors.push(err114);
}
errors++;
}
if(data32.strokeWidthPt === undefined){
const err115 = {instancePath:instancePath+"/axes/y",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "strokeWidthPt"},message:"must have required property '"+"strokeWidthPt"+"'"};
if(vErrors === null){
vErrors = [err115];
}
else {
vErrors.push(err115);
}
errors++;
}
if(data32.labelSizePt === undefined){
const err116 = {instancePath:instancePath+"/axes/y",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "labelSizePt"},message:"must have required property '"+"labelSizePt"+"'"};
if(vErrors === null){
vErrors = [err116];
}
else {
vErrors.push(err116);
}
errors++;
}
for(const key6 in data32){
if(!(func1.call(schema56.properties, key6))){
const err117 = {instancePath:instancePath+"/axes/y",schemaPath:"#/$defs/axis/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key6},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err117];
}
else {
vErrors.push(err117);
}
errors++;
}
}
if(data32.label !== undefined){
let data33 = data32.label;
if(typeof data33 === "string"){
if(func2(data33) > 500){
const err118 = {instancePath:instancePath+"/axes/y/label",schemaPath:"#/$defs/axis/properties/label/maxLength",keyword:"maxLength",params:{limit: 500},message:"must NOT have more than 500 characters"};
if(vErrors === null){
vErrors = [err118];
}
else {
vErrors.push(err118);
}
errors++;
}
}
else {
const err119 = {instancePath:instancePath+"/axes/y/label",schemaPath:"#/$defs/axis/properties/label/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err119];
}
else {
vErrors.push(err119);
}
errors++;
}
}
if(data32.unit !== undefined){
let data34 = data32.unit;
if(typeof data34 === "string"){
if(func2(data34) > 100){
const err120 = {instancePath:instancePath+"/axes/y/unit",schemaPath:"#/$defs/axis/properties/unit/maxLength",keyword:"maxLength",params:{limit: 100},message:"must NOT have more than 100 characters"};
if(vErrors === null){
vErrors = [err120];
}
else {
vErrors.push(err120);
}
errors++;
}
}
else {
const err121 = {instancePath:instancePath+"/axes/y/unit",schemaPath:"#/$defs/axis/properties/unit/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err121];
}
else {
vErrors.push(err121);
}
errors++;
}
}
if(data32.scale !== undefined){
if("linear" !== data32.scale){
const err122 = {instancePath:instancePath+"/axes/y/scale",schemaPath:"#/$defs/axis/properties/scale/const",keyword:"const",params:{allowedValue: "linear"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err122];
}
else {
vErrors.push(err122);
}
errors++;
}
}
if(data32.mode !== undefined){
let data36 = data32.mode;
if(!((data36 === "auto") || (data36 === "manual"))){
const err123 = {instancePath:instancePath+"/axes/y/mode",schemaPath:"#/$defs/axis/properties/mode/enum",keyword:"enum",params:{allowedValues: schema56.properties.mode.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err123];
}
else {
vErrors.push(err123);
}
errors++;
}
}
if(data32.min !== undefined){
let data37 = data32.min;
if(!((typeof data37 == "number") && (isFinite(data37)))){
const err124 = {instancePath:instancePath+"/axes/y/min",schemaPath:"#/$defs/axis/properties/min/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err124];
}
else {
vErrors.push(err124);
}
errors++;
}
}
if(data32.max !== undefined){
let data38 = data32.max;
if(!((typeof data38 == "number") && (isFinite(data38)))){
const err125 = {instancePath:instancePath+"/axes/y/max",schemaPath:"#/$defs/axis/properties/max/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err125];
}
else {
vErrors.push(err125);
}
errors++;
}
}
if(data32.tickMode !== undefined){
let data39 = data32.tickMode;
if(!((data39 === "auto") || (data39 === "manual"))){
const err126 = {instancePath:instancePath+"/axes/y/tickMode",schemaPath:"#/$defs/axis/properties/tickMode/enum",keyword:"enum",params:{allowedValues: schema56.properties.tickMode.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err126];
}
else {
vErrors.push(err126);
}
errors++;
}
}
if(data32.tickStep !== undefined){
let data40 = data32.tickStep;
if((typeof data40 == "number") && (isFinite(data40))){
if(data40 <= 0 || isNaN(data40)){
const err127 = {instancePath:instancePath+"/axes/y/tickStep",schemaPath:"#/$defs/axis/properties/tickStep/exclusiveMinimum",keyword:"exclusiveMinimum",params:{comparison: ">", limit: 0},message:"must be > 0"};
if(vErrors === null){
vErrors = [err127];
}
else {
vErrors.push(err127);
}
errors++;
}
}
else {
const err128 = {instancePath:instancePath+"/axes/y/tickStep",schemaPath:"#/$defs/axis/properties/tickStep/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err128];
}
else {
vErrors.push(err128);
}
errors++;
}
}
if(data32.tickOrigin !== undefined){
let data41 = data32.tickOrigin;
if(!((typeof data41 == "number") && (isFinite(data41)))){
const err129 = {instancePath:instancePath+"/axes/y/tickOrigin",schemaPath:"#/$defs/axis/properties/tickOrigin/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err129];
}
else {
vErrors.push(err129);
}
errors++;
}
}
if(data32.minorDivisions !== undefined){
let data42 = data32.minorDivisions;
if(!(((typeof data42 == "number") && (!(data42 % 1) && !isNaN(data42))) && (isFinite(data42)))){
const err130 = {instancePath:instancePath+"/axes/y/minorDivisions",schemaPath:"#/$defs/axis/properties/minorDivisions/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err130];
}
else {
vErrors.push(err130);
}
errors++;
}
if((typeof data42 == "number") && (isFinite(data42))){
if(data42 > 20 || isNaN(data42)){
const err131 = {instancePath:instancePath+"/axes/y/minorDivisions",schemaPath:"#/$defs/axis/properties/minorDivisions/maximum",keyword:"maximum",params:{comparison: "<=", limit: 20},message:"must be <= 20"};
if(vErrors === null){
vErrors = [err131];
}
else {
vErrors.push(err131);
}
errors++;
}
if(data42 < 0 || isNaN(data42)){
const err132 = {instancePath:instancePath+"/axes/y/minorDivisions",schemaPath:"#/$defs/axis/properties/minorDivisions/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err132];
}
else {
vErrors.push(err132);
}
errors++;
}
}
}
if(data32.grid !== undefined){
if(typeof data32.grid !== "boolean"){
const err133 = {instancePath:instancePath+"/axes/y/grid",schemaPath:"#/$defs/axis/properties/grid/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err133];
}
else {
vErrors.push(err133);
}
errors++;
}
}
if(data32.numberFormat !== undefined){
let data44 = data32.numberFormat;
if(!(((data44 === "auto") || (data44 === "fixed")) || (data44 === "scientific"))){
const err134 = {instancePath:instancePath+"/axes/y/numberFormat",schemaPath:"#/$defs/axis/properties/numberFormat/enum",keyword:"enum",params:{allowedValues: schema56.properties.numberFormat.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err134];
}
else {
vErrors.push(err134);
}
errors++;
}
}
if(data32.precision !== undefined){
let data45 = data32.precision;
if(!(((typeof data45 == "number") && (!(data45 % 1) && !isNaN(data45))) && (isFinite(data45)))){
const err135 = {instancePath:instancePath+"/axes/y/precision",schemaPath:"#/$defs/axis/properties/precision/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err135];
}
else {
vErrors.push(err135);
}
errors++;
}
if((typeof data45 == "number") && (isFinite(data45))){
if(data45 > 15 || isNaN(data45)){
const err136 = {instancePath:instancePath+"/axes/y/precision",schemaPath:"#/$defs/axis/properties/precision/maximum",keyword:"maximum",params:{comparison: "<=", limit: 15},message:"must be <= 15"};
if(vErrors === null){
vErrors = [err136];
}
else {
vErrors.push(err136);
}
errors++;
}
if(data45 < 0 || isNaN(data45)){
const err137 = {instancePath:instancePath+"/axes/y/precision",schemaPath:"#/$defs/axis/properties/precision/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err137];
}
else {
vErrors.push(err137);
}
errors++;
}
}
}
if(data32.strokeWidthPt !== undefined){
let data46 = data32.strokeWidthPt;
if((typeof data46 == "number") && (isFinite(data46))){
if(data46 > 24 || isNaN(data46)){
const err138 = {instancePath:instancePath+"/axes/y/strokeWidthPt",schemaPath:"#/$defs/axis/properties/strokeWidthPt/maximum",keyword:"maximum",params:{comparison: "<=", limit: 24},message:"must be <= 24"};
if(vErrors === null){
vErrors = [err138];
}
else {
vErrors.push(err138);
}
errors++;
}
if(data46 <= 0 || isNaN(data46)){
const err139 = {instancePath:instancePath+"/axes/y/strokeWidthPt",schemaPath:"#/$defs/axis/properties/strokeWidthPt/exclusiveMinimum",keyword:"exclusiveMinimum",params:{comparison: ">", limit: 0},message:"must be > 0"};
if(vErrors === null){
vErrors = [err139];
}
else {
vErrors.push(err139);
}
errors++;
}
}
else {
const err140 = {instancePath:instancePath+"/axes/y/strokeWidthPt",schemaPath:"#/$defs/axis/properties/strokeWidthPt/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err140];
}
else {
vErrors.push(err140);
}
errors++;
}
}
if(data32.labelSizePt !== undefined){
let data47 = data32.labelSizePt;
if((typeof data47 == "number") && (isFinite(data47))){
if(data47 > 72 || isNaN(data47)){
const err141 = {instancePath:instancePath+"/axes/y/labelSizePt",schemaPath:"#/$defs/axis/properties/labelSizePt/maximum",keyword:"maximum",params:{comparison: "<=", limit: 72},message:"must be <= 72"};
if(vErrors === null){
vErrors = [err141];
}
else {
vErrors.push(err141);
}
errors++;
}
if(data47 < 6 || isNaN(data47)){
const err142 = {instancePath:instancePath+"/axes/y/labelSizePt",schemaPath:"#/$defs/axis/properties/labelSizePt/minimum",keyword:"minimum",params:{comparison: ">=", limit: 6},message:"must be >= 6"};
if(vErrors === null){
vErrors = [err142];
}
else {
vErrors.push(err142);
}
errors++;
}
}
else {
const err143 = {instancePath:instancePath+"/axes/y/labelSizePt",schemaPath:"#/$defs/axis/properties/labelSizePt/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err143];
}
else {
vErrors.push(err143);
}
errors++;
}
}
}
else {
const err144 = {instancePath:instancePath+"/axes/y",schemaPath:"#/$defs/axis/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err144];
}
else {
vErrors.push(err144);
}
errors++;
}
}
}
else {
const err145 = {instancePath:instancePath+"/axes",schemaPath:"#/properties/axes/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err145];
}
else {
vErrors.push(err145);
}
errors++;
}
}
if(data.datasets !== undefined){
let data48 = data.datasets;
if(Array.isArray(data48)){
if(data48.length > 1000){
const err146 = {instancePath:instancePath+"/datasets",schemaPath:"#/properties/datasets/maxItems",keyword:"maxItems",params:{limit: 1000},message:"must NOT have more than 1000 items"};
if(vErrors === null){
vErrors = [err146];
}
else {
vErrors.push(err146);
}
errors++;
}
const len0 = data48.length;
for(let i0=0; i0<len0; i0++){
if(!(validate36(data48[i0], {instancePath:instancePath+"/datasets/" + i0,parentData:data48,parentDataProperty:i0,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate36.errors : vErrors.concat(validate36.errors);
errors = vErrors.length;
}
}
}
else {
const err147 = {instancePath:instancePath+"/datasets",schemaPath:"#/properties/datasets/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err147];
}
else {
vErrors.push(err147);
}
errors++;
}
}
if(data.series !== undefined){
let data50 = data.series;
if(Array.isArray(data50)){
if(data50.length > 1000){
const err148 = {instancePath:instancePath+"/series",schemaPath:"#/properties/series/maxItems",keyword:"maxItems",params:{limit: 1000},message:"must NOT have more than 1000 items"};
if(vErrors === null){
vErrors = [err148];
}
else {
vErrors.push(err148);
}
errors++;
}
const len1 = data50.length;
for(let i1=0; i1<len1; i1++){
let data51 = data50[i1];
if(data51 && typeof data51 == "object" && !Array.isArray(data51)){
if(data51.id === undefined){
const err149 = {instancePath:instancePath+"/series/" + i1,schemaPath:"#/$defs/series/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err149];
}
else {
vErrors.push(err149);
}
errors++;
}
if(data51.datasetId === undefined){
const err150 = {instancePath:instancePath+"/series/" + i1,schemaPath:"#/$defs/series/required",keyword:"required",params:{missingProperty: "datasetId"},message:"must have required property '"+"datasetId"+"'"};
if(vErrors === null){
vErrors = [err150];
}
else {
vErrors.push(err150);
}
errors++;
}
if(data51.name === undefined){
const err151 = {instancePath:instancePath+"/series/" + i1,schemaPath:"#/$defs/series/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};
if(vErrors === null){
vErrors = [err151];
}
else {
vErrors.push(err151);
}
errors++;
}
if(data51.visible === undefined){
const err152 = {instancePath:instancePath+"/series/" + i1,schemaPath:"#/$defs/series/required",keyword:"required",params:{missingProperty: "visible"},message:"must have required property '"+"visible"+"'"};
if(vErrors === null){
vErrors = [err152];
}
else {
vErrors.push(err152);
}
errors++;
}
if(data51.includeInAutoRange === undefined){
const err153 = {instancePath:instancePath+"/series/" + i1,schemaPath:"#/$defs/series/required",keyword:"required",params:{missingProperty: "includeInAutoRange"},message:"must have required property '"+"includeInAutoRange"+"'"};
if(vErrors === null){
vErrors = [err153];
}
else {
vErrors.push(err153);
}
errors++;
}
if(data51.order === undefined){
const err154 = {instancePath:instancePath+"/series/" + i1,schemaPath:"#/$defs/series/required",keyword:"required",params:{missingProperty: "order"},message:"must have required property '"+"order"+"'"};
if(vErrors === null){
vErrors = [err154];
}
else {
vErrors.push(err154);
}
errors++;
}
if(data51.mode === undefined){
const err155 = {instancePath:instancePath+"/series/" + i1,schemaPath:"#/$defs/series/required",keyword:"required",params:{missingProperty: "mode"},message:"must have required property '"+"mode"+"'"};
if(vErrors === null){
vErrors = [err155];
}
else {
vErrors.push(err155);
}
errors++;
}
if(data51.style === undefined){
const err156 = {instancePath:instancePath+"/series/" + i1,schemaPath:"#/$defs/series/required",keyword:"required",params:{missingProperty: "style"},message:"must have required property '"+"style"+"'"};
if(vErrors === null){
vErrors = [err156];
}
else {
vErrors.push(err156);
}
errors++;
}
for(const key7 in data51){
if(!((((((((key7 === "id") || (key7 === "datasetId")) || (key7 === "name")) || (key7 === "visible")) || (key7 === "includeInAutoRange")) || (key7 === "order")) || (key7 === "mode")) || (key7 === "style"))){
const err157 = {instancePath:instancePath+"/series/" + i1,schemaPath:"#/$defs/series/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key7},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err157];
}
else {
vErrors.push(err157);
}
errors++;
}
}
if(data51.id !== undefined){
let data52 = data51.id;
if(typeof data52 === "string"){
if(!pattern6.test(data52)){
const err158 = {instancePath:instancePath+"/series/" + i1+"/id",schemaPath:"#/$defs/series/properties/id/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"+"\""};
if(vErrors === null){
vErrors = [err158];
}
else {
vErrors.push(err158);
}
errors++;
}
}
else {
const err159 = {instancePath:instancePath+"/series/" + i1+"/id",schemaPath:"#/$defs/series/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err159];
}
else {
vErrors.push(err159);
}
errors++;
}
}
if(data51.datasetId !== undefined){
let data53 = data51.datasetId;
if(typeof data53 === "string"){
if(!pattern6.test(data53)){
const err160 = {instancePath:instancePath+"/series/" + i1+"/datasetId",schemaPath:"#/$defs/series/properties/datasetId/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"+"\""};
if(vErrors === null){
vErrors = [err160];
}
else {
vErrors.push(err160);
}
errors++;
}
}
else {
const err161 = {instancePath:instancePath+"/series/" + i1+"/datasetId",schemaPath:"#/$defs/series/properties/datasetId/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err161];
}
else {
vErrors.push(err161);
}
errors++;
}
}
if(data51.name !== undefined){
let data54 = data51.name;
if(typeof data54 === "string"){
if(func2(data54) > 300){
const err162 = {instancePath:instancePath+"/series/" + i1+"/name",schemaPath:"#/$defs/series/properties/name/maxLength",keyword:"maxLength",params:{limit: 300},message:"must NOT have more than 300 characters"};
if(vErrors === null){
vErrors = [err162];
}
else {
vErrors.push(err162);
}
errors++;
}
}
else {
const err163 = {instancePath:instancePath+"/series/" + i1+"/name",schemaPath:"#/$defs/series/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err163];
}
else {
vErrors.push(err163);
}
errors++;
}
}
if(data51.visible !== undefined){
if(typeof data51.visible !== "boolean"){
const err164 = {instancePath:instancePath+"/series/" + i1+"/visible",schemaPath:"#/$defs/series/properties/visible/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err164];
}
else {
vErrors.push(err164);
}
errors++;
}
}
if(data51.includeInAutoRange !== undefined){
if(typeof data51.includeInAutoRange !== "boolean"){
const err165 = {instancePath:instancePath+"/series/" + i1+"/includeInAutoRange",schemaPath:"#/$defs/series/properties/includeInAutoRange/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err165];
}
else {
vErrors.push(err165);
}
errors++;
}
}
if(data51.order !== undefined){
let data57 = data51.order;
if(!(((typeof data57 == "number") && (!(data57 % 1) && !isNaN(data57))) && (isFinite(data57)))){
const err166 = {instancePath:instancePath+"/series/" + i1+"/order",schemaPath:"#/$defs/series/properties/order/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err166];
}
else {
vErrors.push(err166);
}
errors++;
}
if((typeof data57 == "number") && (isFinite(data57))){
if(data57 < 0 || isNaN(data57)){
const err167 = {instancePath:instancePath+"/series/" + i1+"/order",schemaPath:"#/$defs/series/properties/order/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err167];
}
else {
vErrors.push(err167);
}
errors++;
}
}
}
if(data51.mode !== undefined){
let data58 = data51.mode;
if(!(((data58 === "line") || (data58 === "points")) || (data58 === "line-points"))){
const err168 = {instancePath:instancePath+"/series/" + i1+"/mode",schemaPath:"#/$defs/series/properties/mode/enum",keyword:"enum",params:{allowedValues: schema60.properties.mode.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err168];
}
else {
vErrors.push(err168);
}
errors++;
}
}
if(data51.style !== undefined){
let data59 = data51.style;
if(data59 && typeof data59 == "object" && !Array.isArray(data59)){
if(data59.stroke === undefined){
const err169 = {instancePath:instancePath+"/series/" + i1+"/style",schemaPath:"#/$defs/series/properties/style/required",keyword:"required",params:{missingProperty: "stroke"},message:"must have required property '"+"stroke"+"'"};
if(vErrors === null){
vErrors = [err169];
}
else {
vErrors.push(err169);
}
errors++;
}
if(data59.strokeWidthPt === undefined){
const err170 = {instancePath:instancePath+"/series/" + i1+"/style",schemaPath:"#/$defs/series/properties/style/required",keyword:"required",params:{missingProperty: "strokeWidthPt"},message:"must have required property '"+"strokeWidthPt"+"'"};
if(vErrors === null){
vErrors = [err170];
}
else {
vErrors.push(err170);
}
errors++;
}
if(data59.opacity === undefined){
const err171 = {instancePath:instancePath+"/series/" + i1+"/style",schemaPath:"#/$defs/series/properties/style/required",keyword:"required",params:{missingProperty: "opacity"},message:"must have required property '"+"opacity"+"'"};
if(vErrors === null){
vErrors = [err171];
}
else {
vErrors.push(err171);
}
errors++;
}
if(data59.dash === undefined){
const err172 = {instancePath:instancePath+"/series/" + i1+"/style",schemaPath:"#/$defs/series/properties/style/required",keyword:"required",params:{missingProperty: "dash"},message:"must have required property '"+"dash"+"'"};
if(vErrors === null){
vErrors = [err172];
}
else {
vErrors.push(err172);
}
errors++;
}
if(data59.markerShape === undefined){
const err173 = {instancePath:instancePath+"/series/" + i1+"/style",schemaPath:"#/$defs/series/properties/style/required",keyword:"required",params:{missingProperty: "markerShape"},message:"must have required property '"+"markerShape"+"'"};
if(vErrors === null){
vErrors = [err173];
}
else {
vErrors.push(err173);
}
errors++;
}
if(data59.markerSizePt === undefined){
const err174 = {instancePath:instancePath+"/series/" + i1+"/style",schemaPath:"#/$defs/series/properties/style/required",keyword:"required",params:{missingProperty: "markerSizePt"},message:"must have required property '"+"markerSizePt"+"'"};
if(vErrors === null){
vErrors = [err174];
}
else {
vErrors.push(err174);
}
errors++;
}
if(data59.markerFill === undefined){
const err175 = {instancePath:instancePath+"/series/" + i1+"/style",schemaPath:"#/$defs/series/properties/style/required",keyword:"required",params:{missingProperty: "markerFill"},message:"must have required property '"+"markerFill"+"'"};
if(vErrors === null){
vErrors = [err175];
}
else {
vErrors.push(err175);
}
errors++;
}
if(data59.markerStroke === undefined){
const err176 = {instancePath:instancePath+"/series/" + i1+"/style",schemaPath:"#/$defs/series/properties/style/required",keyword:"required",params:{missingProperty: "markerStroke"},message:"must have required property '"+"markerStroke"+"'"};
if(vErrors === null){
vErrors = [err176];
}
else {
vErrors.push(err176);
}
errors++;
}
if(data59.markerVisible === undefined){
const err177 = {instancePath:instancePath+"/series/" + i1+"/style",schemaPath:"#/$defs/series/properties/style/required",keyword:"required",params:{missingProperty: "markerVisible"},message:"must have required property '"+"markerVisible"+"'"};
if(vErrors === null){
vErrors = [err177];
}
else {
vErrors.push(err177);
}
errors++;
}
for(const key8 in data59){
if(!(func1.call(schema60.properties.style.properties, key8))){
const err178 = {instancePath:instancePath+"/series/" + i1+"/style",schemaPath:"#/$defs/series/properties/style/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key8},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err178];
}
else {
vErrors.push(err178);
}
errors++;
}
}
if(data59.stroke !== undefined){
let data60 = data59.stroke;
if(typeof data60 === "string"){
if(!pattern7.test(data60)){
const err179 = {instancePath:instancePath+"/series/" + i1+"/style/stroke",schemaPath:"#/$defs/series/properties/style/properties/stroke/pattern",keyword:"pattern",params:{pattern: "^#[0-9A-Fa-f]{6}$"},message:"must match pattern \""+"^#[0-9A-Fa-f]{6}$"+"\""};
if(vErrors === null){
vErrors = [err179];
}
else {
vErrors.push(err179);
}
errors++;
}
}
else {
const err180 = {instancePath:instancePath+"/series/" + i1+"/style/stroke",schemaPath:"#/$defs/series/properties/style/properties/stroke/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err180];
}
else {
vErrors.push(err180);
}
errors++;
}
}
if(data59.strokeWidthPt !== undefined){
let data61 = data59.strokeWidthPt;
if((typeof data61 == "number") && (isFinite(data61))){
if(data61 > 24 || isNaN(data61)){
const err181 = {instancePath:instancePath+"/series/" + i1+"/style/strokeWidthPt",schemaPath:"#/$defs/series/properties/style/properties/strokeWidthPt/maximum",keyword:"maximum",params:{comparison: "<=", limit: 24},message:"must be <= 24"};
if(vErrors === null){
vErrors = [err181];
}
else {
vErrors.push(err181);
}
errors++;
}
if(data61 <= 0 || isNaN(data61)){
const err182 = {instancePath:instancePath+"/series/" + i1+"/style/strokeWidthPt",schemaPath:"#/$defs/series/properties/style/properties/strokeWidthPt/exclusiveMinimum",keyword:"exclusiveMinimum",params:{comparison: ">", limit: 0},message:"must be > 0"};
if(vErrors === null){
vErrors = [err182];
}
else {
vErrors.push(err182);
}
errors++;
}
}
else {
const err183 = {instancePath:instancePath+"/series/" + i1+"/style/strokeWidthPt",schemaPath:"#/$defs/series/properties/style/properties/strokeWidthPt/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err183];
}
else {
vErrors.push(err183);
}
errors++;
}
}
if(data59.opacity !== undefined){
let data62 = data59.opacity;
if((typeof data62 == "number") && (isFinite(data62))){
if(data62 > 1 || isNaN(data62)){
const err184 = {instancePath:instancePath+"/series/" + i1+"/style/opacity",schemaPath:"#/$defs/series/properties/style/properties/opacity/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1},message:"must be <= 1"};
if(vErrors === null){
vErrors = [err184];
}
else {
vErrors.push(err184);
}
errors++;
}
if(data62 < 0 || isNaN(data62)){
const err185 = {instancePath:instancePath+"/series/" + i1+"/style/opacity",schemaPath:"#/$defs/series/properties/style/properties/opacity/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err185];
}
else {
vErrors.push(err185);
}
errors++;
}
}
else {
const err186 = {instancePath:instancePath+"/series/" + i1+"/style/opacity",schemaPath:"#/$defs/series/properties/style/properties/opacity/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err186];
}
else {
vErrors.push(err186);
}
errors++;
}
}
if(data59.dash !== undefined){
let data63 = data59.dash;
if(!((((data63 === "solid") || (data63 === "dash")) || (data63 === "dot")) || (data63 === "dash-dot"))){
const err187 = {instancePath:instancePath+"/series/" + i1+"/style/dash",schemaPath:"#/$defs/series/properties/style/properties/dash/enum",keyword:"enum",params:{allowedValues: schema60.properties.style.properties.dash.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err187];
}
else {
vErrors.push(err187);
}
errors++;
}
}
if(data59.markerShape !== undefined){
let data64 = data59.markerShape;
if(!((((((data64 === "circle") || (data64 === "square")) || (data64 === "triangle")) || (data64 === "diamond")) || (data64 === "cross")) || (data64 === "plus"))){
const err188 = {instancePath:instancePath+"/series/" + i1+"/style/markerShape",schemaPath:"#/$defs/series/properties/style/properties/markerShape/enum",keyword:"enum",params:{allowedValues: schema60.properties.style.properties.markerShape.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err188];
}
else {
vErrors.push(err188);
}
errors++;
}
}
if(data59.markerSizePt !== undefined){
let data65 = data59.markerSizePt;
if((typeof data65 == "number") && (isFinite(data65))){
if(data65 > 32 || isNaN(data65)){
const err189 = {instancePath:instancePath+"/series/" + i1+"/style/markerSizePt",schemaPath:"#/$defs/series/properties/style/properties/markerSizePt/maximum",keyword:"maximum",params:{comparison: "<=", limit: 32},message:"must be <= 32"};
if(vErrors === null){
vErrors = [err189];
}
else {
vErrors.push(err189);
}
errors++;
}
if(data65 < 0 || isNaN(data65)){
const err190 = {instancePath:instancePath+"/series/" + i1+"/style/markerSizePt",schemaPath:"#/$defs/series/properties/style/properties/markerSizePt/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err190];
}
else {
vErrors.push(err190);
}
errors++;
}
}
else {
const err191 = {instancePath:instancePath+"/series/" + i1+"/style/markerSizePt",schemaPath:"#/$defs/series/properties/style/properties/markerSizePt/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err191];
}
else {
vErrors.push(err191);
}
errors++;
}
}
if(data59.markerFill !== undefined){
let data66 = data59.markerFill;
if(typeof data66 === "string"){
if(!pattern7.test(data66)){
const err192 = {instancePath:instancePath+"/series/" + i1+"/style/markerFill",schemaPath:"#/$defs/series/properties/style/properties/markerFill/pattern",keyword:"pattern",params:{pattern: "^#[0-9A-Fa-f]{6}$"},message:"must match pattern \""+"^#[0-9A-Fa-f]{6}$"+"\""};
if(vErrors === null){
vErrors = [err192];
}
else {
vErrors.push(err192);
}
errors++;
}
}
else {
const err193 = {instancePath:instancePath+"/series/" + i1+"/style/markerFill",schemaPath:"#/$defs/series/properties/style/properties/markerFill/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err193];
}
else {
vErrors.push(err193);
}
errors++;
}
}
if(data59.markerStroke !== undefined){
let data67 = data59.markerStroke;
if(typeof data67 === "string"){
if(!pattern7.test(data67)){
const err194 = {instancePath:instancePath+"/series/" + i1+"/style/markerStroke",schemaPath:"#/$defs/series/properties/style/properties/markerStroke/pattern",keyword:"pattern",params:{pattern: "^#[0-9A-Fa-f]{6}$"},message:"must match pattern \""+"^#[0-9A-Fa-f]{6}$"+"\""};
if(vErrors === null){
vErrors = [err194];
}
else {
vErrors.push(err194);
}
errors++;
}
}
else {
const err195 = {instancePath:instancePath+"/series/" + i1+"/style/markerStroke",schemaPath:"#/$defs/series/properties/style/properties/markerStroke/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err195];
}
else {
vErrors.push(err195);
}
errors++;
}
}
if(data59.markerVisible !== undefined){
if(typeof data59.markerVisible !== "boolean"){
const err196 = {instancePath:instancePath+"/series/" + i1+"/style/markerVisible",schemaPath:"#/$defs/series/properties/style/properties/markerVisible/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err196];
}
else {
vErrors.push(err196);
}
errors++;
}
}
}
else {
const err197 = {instancePath:instancePath+"/series/" + i1+"/style",schemaPath:"#/$defs/series/properties/style/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err197];
}
else {
vErrors.push(err197);
}
errors++;
}
}
}
else {
const err198 = {instancePath:instancePath+"/series/" + i1,schemaPath:"#/$defs/series/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err198];
}
else {
vErrors.push(err198);
}
errors++;
}
}
}
else {
const err199 = {instancePath:instancePath+"/series",schemaPath:"#/properties/series/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err199];
}
else {
vErrors.push(err199);
}
errors++;
}
}
if(data.objects !== undefined){
let data69 = data.objects;
if(Array.isArray(data69)){
if(data69.length > 100000){
const err200 = {instancePath:instancePath+"/objects",schemaPath:"#/properties/objects/maxItems",keyword:"maxItems",params:{limit: 100000},message:"must NOT have more than 100000 items"};
if(vErrors === null){
vErrors = [err200];
}
else {
vErrors.push(err200);
}
errors++;
}
const len2 = data69.length;
for(let i2=0; i2<len2; i2++){
if(!(validate38(data69[i2], {instancePath:instancePath+"/objects/" + i2,parentData:data69,parentDataProperty:i2,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate38.errors : vErrors.concat(validate38.errors);
errors = vErrors.length;
}
}
}
else {
const err201 = {instancePath:instancePath+"/objects",schemaPath:"#/properties/objects/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err201];
}
else {
vErrors.push(err201);
}
errors++;
}
}
if(data.calculations !== undefined){
let data71 = data.calculations;
if(Array.isArray(data71)){
if(data71.length > 10000){
const err202 = {instancePath:instancePath+"/calculations",schemaPath:"#/properties/calculations/maxItems",keyword:"maxItems",params:{limit: 10000},message:"must NOT have more than 10000 items"};
if(vErrors === null){
vErrors = [err202];
}
else {
vErrors.push(err202);
}
errors++;
}
const len3 = data71.length;
for(let i3=0; i3<len3; i3++){
if(!(validate42(data71[i3], {instancePath:instancePath+"/calculations/" + i3,parentData:data71,parentDataProperty:i3,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate42.errors : vErrors.concat(validate42.errors);
errors = vErrors.length;
}
}
}
else {
const err203 = {instancePath:instancePath+"/calculations",schemaPath:"#/properties/calculations/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err203];
}
else {
vErrors.push(err203);
}
errors++;
}
}
if(data.legend !== undefined){
let data73 = data.legend;
if(data73 && typeof data73 == "object" && !Array.isArray(data73)){
if(data73.visible === undefined){
const err204 = {instancePath:instancePath+"/legend",schemaPath:"#/properties/legend/required",keyword:"required",params:{missingProperty: "visible"},message:"must have required property '"+"visible"+"'"};
if(vErrors === null){
vErrors = [err204];
}
else {
vErrors.push(err204);
}
errors++;
}
if(data73.anchor === undefined){
const err205 = {instancePath:instancePath+"/legend",schemaPath:"#/properties/legend/required",keyword:"required",params:{missingProperty: "anchor"},message:"must have required property '"+"anchor"+"'"};
if(vErrors === null){
vErrors = [err205];
}
else {
vErrors.push(err205);
}
errors++;
}
for(const key9 in data73){
if(!((key9 === "visible") || (key9 === "anchor"))){
const err206 = {instancePath:instancePath+"/legend",schemaPath:"#/properties/legend/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key9},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err206];
}
else {
vErrors.push(err206);
}
errors++;
}
}
if(data73.visible !== undefined){
if(typeof data73.visible !== "boolean"){
const err207 = {instancePath:instancePath+"/legend/visible",schemaPath:"#/properties/legend/properties/visible/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err207];
}
else {
vErrors.push(err207);
}
errors++;
}
}
if(data73.anchor !== undefined){
let data75 = data73.anchor;
const _errs150 = errors;
let valid22 = false;
let passing0 = null;
const _errs151 = errors;
if(data75 && typeof data75 == "object" && !Array.isArray(data75)){
if(data75.mode === undefined){
const err208 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/0/required",keyword:"required",params:{missingProperty: "mode"},message:"must have required property '"+"mode"+"'"};
if(vErrors === null){
vErrors = [err208];
}
else {
vErrors.push(err208);
}
errors++;
}
if(data75.x === undefined){
const err209 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/0/required",keyword:"required",params:{missingProperty: "x"},message:"must have required property '"+"x"+"'"};
if(vErrors === null){
vErrors = [err209];
}
else {
vErrors.push(err209);
}
errors++;
}
if(data75.y === undefined){
const err210 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/0/required",keyword:"required",params:{missingProperty: "y"},message:"must have required property '"+"y"+"'"};
if(vErrors === null){
vErrors = [err210];
}
else {
vErrors.push(err210);
}
errors++;
}
for(const key10 in data75){
if(!(((key10 === "mode") || (key10 === "x")) || (key10 === "y"))){
const err211 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/0/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key10},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err211];
}
else {
vErrors.push(err211);
}
errors++;
}
}
if(data75.mode !== undefined){
if("data" !== data75.mode){
const err212 = {instancePath:instancePath+"/legend/anchor/mode",schemaPath:"#/$defs/anchor/oneOf/0/properties/mode/const",keyword:"const",params:{allowedValue: "data"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err212];
}
else {
vErrors.push(err212);
}
errors++;
}
}
if(data75.x !== undefined){
let data77 = data75.x;
if(!((typeof data77 == "number") && (isFinite(data77)))){
const err213 = {instancePath:instancePath+"/legend/anchor/x",schemaPath:"#/$defs/anchor/oneOf/0/properties/x/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err213];
}
else {
vErrors.push(err213);
}
errors++;
}
}
if(data75.y !== undefined){
let data78 = data75.y;
if(!((typeof data78 == "number") && (isFinite(data78)))){
const err214 = {instancePath:instancePath+"/legend/anchor/y",schemaPath:"#/$defs/anchor/oneOf/0/properties/y/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err214];
}
else {
vErrors.push(err214);
}
errors++;
}
}
}
else {
const err215 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err215];
}
else {
vErrors.push(err215);
}
errors++;
}
var _valid0 = _errs151 === errors;
if(_valid0){
valid22 = true;
passing0 = 0;
var props0 = true;
}
const _errs159 = errors;
if(data75 && typeof data75 == "object" && !Array.isArray(data75)){
if(data75.mode === undefined){
const err216 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/1/required",keyword:"required",params:{missingProperty: "mode"},message:"must have required property '"+"mode"+"'"};
if(vErrors === null){
vErrors = [err216];
}
else {
vErrors.push(err216);
}
errors++;
}
if(data75.pageX === undefined){
const err217 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/1/required",keyword:"required",params:{missingProperty: "pageX"},message:"must have required property '"+"pageX"+"'"};
if(vErrors === null){
vErrors = [err217];
}
else {
vErrors.push(err217);
}
errors++;
}
if(data75.pageY === undefined){
const err218 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/1/required",keyword:"required",params:{missingProperty: "pageY"},message:"must have required property '"+"pageY"+"'"};
if(vErrors === null){
vErrors = [err218];
}
else {
vErrors.push(err218);
}
errors++;
}
for(const key11 in data75){
if(!(((key11 === "mode") || (key11 === "pageX")) || (key11 === "pageY"))){
const err219 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/1/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key11},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err219];
}
else {
vErrors.push(err219);
}
errors++;
}
}
if(data75.mode !== undefined){
if("page" !== data75.mode){
const err220 = {instancePath:instancePath+"/legend/anchor/mode",schemaPath:"#/$defs/anchor/oneOf/1/properties/mode/const",keyword:"const",params:{allowedValue: "page"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err220];
}
else {
vErrors.push(err220);
}
errors++;
}
}
if(data75.pageX !== undefined){
let data80 = data75.pageX;
if((typeof data80 == "number") && (isFinite(data80))){
if(data80 > 1 || isNaN(data80)){
const err221 = {instancePath:instancePath+"/legend/anchor/pageX",schemaPath:"#/$defs/anchor/oneOf/1/properties/pageX/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1},message:"must be <= 1"};
if(vErrors === null){
vErrors = [err221];
}
else {
vErrors.push(err221);
}
errors++;
}
if(data80 < 0 || isNaN(data80)){
const err222 = {instancePath:instancePath+"/legend/anchor/pageX",schemaPath:"#/$defs/anchor/oneOf/1/properties/pageX/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err222];
}
else {
vErrors.push(err222);
}
errors++;
}
}
else {
const err223 = {instancePath:instancePath+"/legend/anchor/pageX",schemaPath:"#/$defs/anchor/oneOf/1/properties/pageX/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err223];
}
else {
vErrors.push(err223);
}
errors++;
}
}
if(data75.pageY !== undefined){
let data81 = data75.pageY;
if((typeof data81 == "number") && (isFinite(data81))){
if(data81 > 1 || isNaN(data81)){
const err224 = {instancePath:instancePath+"/legend/anchor/pageY",schemaPath:"#/$defs/anchor/oneOf/1/properties/pageY/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1},message:"must be <= 1"};
if(vErrors === null){
vErrors = [err224];
}
else {
vErrors.push(err224);
}
errors++;
}
if(data81 < 0 || isNaN(data81)){
const err225 = {instancePath:instancePath+"/legend/anchor/pageY",schemaPath:"#/$defs/anchor/oneOf/1/properties/pageY/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err225];
}
else {
vErrors.push(err225);
}
errors++;
}
}
else {
const err226 = {instancePath:instancePath+"/legend/anchor/pageY",schemaPath:"#/$defs/anchor/oneOf/1/properties/pageY/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err226];
}
else {
vErrors.push(err226);
}
errors++;
}
}
}
else {
const err227 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/1/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err227];
}
else {
vErrors.push(err227);
}
errors++;
}
var _valid0 = _errs159 === errors;
if(_valid0 && valid22){
valid22 = false;
passing0 = [passing0, 1];
}
else {
if(_valid0){
valid22 = true;
passing0 = 1;
if(props0 !== true){
props0 = true;
}
}
const _errs167 = errors;
if(data75 && typeof data75 == "object" && !Array.isArray(data75)){
if(data75.mode === undefined){
const err228 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/2/required",keyword:"required",params:{missingProperty: "mode"},message:"must have required property '"+"mode"+"'"};
if(vErrors === null){
vErrors = [err228];
}
else {
vErrors.push(err228);
}
errors++;
}
if(data75.datasetId === undefined){
const err229 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/2/required",keyword:"required",params:{missingProperty: "datasetId"},message:"must have required property '"+"datasetId"+"'"};
if(vErrors === null){
vErrors = [err229];
}
else {
vErrors.push(err229);
}
errors++;
}
if(data75.pointId === undefined){
const err230 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/2/required",keyword:"required",params:{missingProperty: "pointId"},message:"must have required property '"+"pointId"+"'"};
if(vErrors === null){
vErrors = [err230];
}
else {
vErrors.push(err230);
}
errors++;
}
if(data75.fallbackX === undefined){
const err231 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/2/required",keyword:"required",params:{missingProperty: "fallbackX"},message:"must have required property '"+"fallbackX"+"'"};
if(vErrors === null){
vErrors = [err231];
}
else {
vErrors.push(err231);
}
errors++;
}
if(data75.fallbackY === undefined){
const err232 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/2/required",keyword:"required",params:{missingProperty: "fallbackY"},message:"must have required property '"+"fallbackY"+"'"};
if(vErrors === null){
vErrors = [err232];
}
else {
vErrors.push(err232);
}
errors++;
}
if(data75.offsetXpx === undefined){
const err233 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/2/required",keyword:"required",params:{missingProperty: "offsetXpx"},message:"must have required property '"+"offsetXpx"+"'"};
if(vErrors === null){
vErrors = [err233];
}
else {
vErrors.push(err233);
}
errors++;
}
if(data75.offsetYpx === undefined){
const err234 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/2/required",keyword:"required",params:{missingProperty: "offsetYpx"},message:"must have required property '"+"offsetYpx"+"'"};
if(vErrors === null){
vErrors = [err234];
}
else {
vErrors.push(err234);
}
errors++;
}
for(const key12 in data75){
if(!(((((((key12 === "mode") || (key12 === "datasetId")) || (key12 === "pointId")) || (key12 === "fallbackX")) || (key12 === "fallbackY")) || (key12 === "offsetXpx")) || (key12 === "offsetYpx"))){
const err235 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/2/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key12},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err235];
}
else {
vErrors.push(err235);
}
errors++;
}
}
if(data75.mode !== undefined){
if("point" !== data75.mode){
const err236 = {instancePath:instancePath+"/legend/anchor/mode",schemaPath:"#/$defs/anchor/oneOf/2/properties/mode/const",keyword:"const",params:{allowedValue: "point"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err236];
}
else {
vErrors.push(err236);
}
errors++;
}
}
if(data75.datasetId !== undefined){
let data83 = data75.datasetId;
if(typeof data83 === "string"){
if(!pattern6.test(data83)){
const err237 = {instancePath:instancePath+"/legend/anchor/datasetId",schemaPath:"#/$defs/anchor/oneOf/2/properties/datasetId/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"+"\""};
if(vErrors === null){
vErrors = [err237];
}
else {
vErrors.push(err237);
}
errors++;
}
}
else {
const err238 = {instancePath:instancePath+"/legend/anchor/datasetId",schemaPath:"#/$defs/anchor/oneOf/2/properties/datasetId/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err238];
}
else {
vErrors.push(err238);
}
errors++;
}
}
if(data75.pointId !== undefined){
let data84 = data75.pointId;
if(typeof data84 === "string"){
if(!pattern6.test(data84)){
const err239 = {instancePath:instancePath+"/legend/anchor/pointId",schemaPath:"#/$defs/anchor/oneOf/2/properties/pointId/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"+"\""};
if(vErrors === null){
vErrors = [err239];
}
else {
vErrors.push(err239);
}
errors++;
}
}
else {
const err240 = {instancePath:instancePath+"/legend/anchor/pointId",schemaPath:"#/$defs/anchor/oneOf/2/properties/pointId/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err240];
}
else {
vErrors.push(err240);
}
errors++;
}
}
if(data75.fallbackX !== undefined){
let data85 = data75.fallbackX;
if(!((typeof data85 == "number") && (isFinite(data85)))){
const err241 = {instancePath:instancePath+"/legend/anchor/fallbackX",schemaPath:"#/$defs/anchor/oneOf/2/properties/fallbackX/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err241];
}
else {
vErrors.push(err241);
}
errors++;
}
}
if(data75.fallbackY !== undefined){
let data86 = data75.fallbackY;
if(!((typeof data86 == "number") && (isFinite(data86)))){
const err242 = {instancePath:instancePath+"/legend/anchor/fallbackY",schemaPath:"#/$defs/anchor/oneOf/2/properties/fallbackY/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err242];
}
else {
vErrors.push(err242);
}
errors++;
}
}
if(data75.offsetXpx !== undefined){
let data87 = data75.offsetXpx;
if(!((typeof data87 == "number") && (isFinite(data87)))){
const err243 = {instancePath:instancePath+"/legend/anchor/offsetXpx",schemaPath:"#/$defs/anchor/oneOf/2/properties/offsetXpx/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err243];
}
else {
vErrors.push(err243);
}
errors++;
}
}
if(data75.offsetYpx !== undefined){
let data88 = data75.offsetYpx;
if(!((typeof data88 == "number") && (isFinite(data88)))){
const err244 = {instancePath:instancePath+"/legend/anchor/offsetYpx",schemaPath:"#/$defs/anchor/oneOf/2/properties/offsetYpx/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err244];
}
else {
vErrors.push(err244);
}
errors++;
}
}
}
else {
const err245 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/2/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err245];
}
else {
vErrors.push(err245);
}
errors++;
}
var _valid0 = _errs167 === errors;
if(_valid0 && valid22){
valid22 = false;
passing0 = [passing0, 2];
}
else {
if(_valid0){
valid22 = true;
passing0 = 2;
if(props0 !== true){
props0 = true;
}
}
}
}
if(!valid22){
const err246 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf",keyword:"oneOf",params:{passingSchemas: passing0},message:"must match exactly one schema in oneOf"};
if(vErrors === null){
vErrors = [err246];
}
else {
vErrors.push(err246);
}
errors++;
}
else {
errors = _errs150;
if(vErrors !== null){
if(_errs150){
vErrors.length = _errs150;
}
else {
vErrors = null;
}
}
}
}
}
else {
const err247 = {instancePath:instancePath+"/legend",schemaPath:"#/properties/legend/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err247];
}
else {
vErrors.push(err247);
}
errors++;
}
}
if(data.viewport !== undefined){
let data89 = data.viewport;
if(data89 && typeof data89 == "object" && !Array.isArray(data89)){
if(data89.xMin === undefined){
const err248 = {instancePath:instancePath+"/viewport",schemaPath:"#/properties/viewport/required",keyword:"required",params:{missingProperty: "xMin"},message:"must have required property '"+"xMin"+"'"};
if(vErrors === null){
vErrors = [err248];
}
else {
vErrors.push(err248);
}
errors++;
}
if(data89.xMax === undefined){
const err249 = {instancePath:instancePath+"/viewport",schemaPath:"#/properties/viewport/required",keyword:"required",params:{missingProperty: "xMax"},message:"must have required property '"+"xMax"+"'"};
if(vErrors === null){
vErrors = [err249];
}
else {
vErrors.push(err249);
}
errors++;
}
if(data89.yMin === undefined){
const err250 = {instancePath:instancePath+"/viewport",schemaPath:"#/properties/viewport/required",keyword:"required",params:{missingProperty: "yMin"},message:"must have required property '"+"yMin"+"'"};
if(vErrors === null){
vErrors = [err250];
}
else {
vErrors.push(err250);
}
errors++;
}
if(data89.yMax === undefined){
const err251 = {instancePath:instancePath+"/viewport",schemaPath:"#/properties/viewport/required",keyword:"required",params:{missingProperty: "yMax"},message:"must have required property '"+"yMax"+"'"};
if(vErrors === null){
vErrors = [err251];
}
else {
vErrors.push(err251);
}
errors++;
}
for(const key13 in data89){
if(!((((key13 === "xMin") || (key13 === "xMax")) || (key13 === "yMin")) || (key13 === "yMax"))){
const err252 = {instancePath:instancePath+"/viewport",schemaPath:"#/properties/viewport/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key13},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err252];
}
else {
vErrors.push(err252);
}
errors++;
}
}
if(data89.xMin !== undefined){
let data90 = data89.xMin;
if(!((typeof data90 == "number") && (isFinite(data90)))){
const err253 = {instancePath:instancePath+"/viewport/xMin",schemaPath:"#/properties/viewport/properties/xMin/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err253];
}
else {
vErrors.push(err253);
}
errors++;
}
}
if(data89.xMax !== undefined){
let data91 = data89.xMax;
if(!((typeof data91 == "number") && (isFinite(data91)))){
const err254 = {instancePath:instancePath+"/viewport/xMax",schemaPath:"#/properties/viewport/properties/xMax/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err254];
}
else {
vErrors.push(err254);
}
errors++;
}
}
if(data89.yMin !== undefined){
let data92 = data89.yMin;
if(!((typeof data92 == "number") && (isFinite(data92)))){
const err255 = {instancePath:instancePath+"/viewport/yMin",schemaPath:"#/properties/viewport/properties/yMin/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err255];
}
else {
vErrors.push(err255);
}
errors++;
}
}
if(data89.yMax !== undefined){
let data93 = data89.yMax;
if(!((typeof data93 == "number") && (isFinite(data93)))){
const err256 = {instancePath:instancePath+"/viewport/yMax",schemaPath:"#/properties/viewport/properties/yMax/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err256];
}
else {
vErrors.push(err256);
}
errors++;
}
}
}
else {
const err257 = {instancePath:instancePath+"/viewport",schemaPath:"#/properties/viewport/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err257];
}
else {
vErrors.push(err257);
}
errors++;
}
}
if(data.editor !== undefined){
let data94 = data.editor;
if(data94 && typeof data94 == "object" && !Array.isArray(data94)){
if(data94.selectedObjectId === undefined){
const err258 = {instancePath:instancePath+"/editor",schemaPath:"#/properties/editor/required",keyword:"required",params:{missingProperty: "selectedObjectId"},message:"must have required property '"+"selectedObjectId"+"'"};
if(vErrors === null){
vErrors = [err258];
}
else {
vErrors.push(err258);
}
errors++;
}
if(data94.showPointMarkers === undefined){
const err259 = {instancePath:instancePath+"/editor",schemaPath:"#/properties/editor/required",keyword:"required",params:{missingProperty: "showPointMarkers"},message:"must have required property '"+"showPointMarkers"+"'"};
if(vErrors === null){
vErrors = [err259];
}
else {
vErrors.push(err259);
}
errors++;
}
for(const key14 in data94){
if(!((key14 === "selectedObjectId") || (key14 === "showPointMarkers"))){
const err260 = {instancePath:instancePath+"/editor",schemaPath:"#/properties/editor/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key14},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err260];
}
else {
vErrors.push(err260);
}
errors++;
}
}
if(data94.selectedObjectId !== undefined){
let data95 = data94.selectedObjectId;
const _errs198 = errors;
let valid28 = false;
const _errs199 = errors;
if(typeof data95 === "string"){
if(!pattern6.test(data95)){
const err261 = {instancePath:instancePath+"/editor/selectedObjectId",schemaPath:"#/properties/editor/properties/selectedObjectId/anyOf/0/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"+"\""};
if(vErrors === null){
vErrors = [err261];
}
else {
vErrors.push(err261);
}
errors++;
}
}
else {
const err262 = {instancePath:instancePath+"/editor/selectedObjectId",schemaPath:"#/properties/editor/properties/selectedObjectId/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err262];
}
else {
vErrors.push(err262);
}
errors++;
}
var _valid1 = _errs199 === errors;
valid28 = valid28 || _valid1;
const _errs201 = errors;
if(data95 !== null){
const err263 = {instancePath:instancePath+"/editor/selectedObjectId",schemaPath:"#/properties/editor/properties/selectedObjectId/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err263];
}
else {
vErrors.push(err263);
}
errors++;
}
var _valid1 = _errs201 === errors;
valid28 = valid28 || _valid1;
if(!valid28){
const err264 = {instancePath:instancePath+"/editor/selectedObjectId",schemaPath:"#/properties/editor/properties/selectedObjectId/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err264];
}
else {
vErrors.push(err264);
}
errors++;
}
else {
errors = _errs198;
if(vErrors !== null){
if(_errs198){
vErrors.length = _errs198;
}
else {
vErrors = null;
}
}
}
}
if(data94.showPointMarkers !== undefined){
if(typeof data94.showPointMarkers !== "boolean"){
const err265 = {instancePath:instancePath+"/editor/showPointMarkers",schemaPath:"#/properties/editor/properties/showPointMarkers/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err265];
}
else {
vErrors.push(err265);
}
errors++;
}
}
}
else {
const err266 = {instancePath:instancePath+"/editor",schemaPath:"#/properties/editor/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err266];
}
else {
vErrors.push(err266);
}
errors++;
}
}
if(data.extensions !== undefined){
let data97 = data.extensions;
if(data97 && typeof data97 == "object" && !Array.isArray(data97)){
}
else {
const err267 = {instancePath:instancePath+"/extensions",schemaPath:"#/properties/extensions/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err267];
}
else {
vErrors.push(err267);
}
errors++;
}
}
}
else {
const err268 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err268];
}
else {
vErrors.push(err268);
}
errors++;
}
validate35.errors = vErrors;
return errors === 0;
}
validate35.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema69 = {"$schema":"https://json-schema.org/draft/2020-12/schema","$id":"https://github.com/anatamien/APIO-GRAPH/blob/main/schemas/aph-1.3.schema.json","title":"APIO GRAPH project 1.3","description":"Self-contained UTF-8 JSON project. Referential and numeric semantic validation is additionally required.","type":"object","additionalProperties":false,"properties":{"format":{"const":"APIO_GRAPH_PROJECT"},"schemaVersion":{"type":"string","pattern":"^1\\.3\\.[0-9]+$"},"createdWith":{"type":"object","additionalProperties":false,"properties":{"name":{"const":"APIO GRAPH"},"version":{"type":"string","minLength":1}},"required":["name","version"]},"project":{"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"title":{"type":"string","maxLength":300},"createdAt":{"type":"string","format":"date-time"},"updatedAt":{"type":"string","format":"date-time"}},"required":["id","title","createdAt","updatedAt"]},"page":{"type":"object","additionalProperties":false,"properties":{"widthPx":{"type":"integer","minimum":100,"maximum":30000},"heightPx":{"type":"integer","minimum":100,"maximum":30000},"background":{"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"},"paddingPx":{"type":"number","minimum":0,"maximum":2000}},"required":["widthPx","heightPx","background","paddingPx"]},"axes":{"type":"object","additionalProperties":false,"properties":{"x":{"$ref":"#/$defs/axis"},"y":{"$ref":"#/$defs/axis"}},"required":["x","y"]},"datasets":{"type":"array","items":{"$ref":"#/$defs/dataset"},"maxItems":1000},"series":{"type":"array","items":{"$ref":"#/$defs/series"},"maxItems":1000},"objects":{"type":"array","items":{"$ref":"#/$defs/drawObject"},"maxItems":100000},"calculations":{"type":"array","items":{"$ref":"#/$defs/calculation"},"maxItems":10000},"legend":{"type":"object","additionalProperties":false,"properties":{"visible":{"type":"boolean"},"anchor":{"$ref":"#/$defs/anchor"}},"required":["visible","anchor"]},"viewport":{"type":"object","additionalProperties":false,"properties":{"xMin":{"type":"number"},"xMax":{"type":"number"},"yMin":{"type":"number"},"yMax":{"type":"number"}},"required":["xMin","xMax","yMin","yMax"]},"editor":{"type":"object","additionalProperties":false,"properties":{"selectedObjectId":{"anyOf":[{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},{"type":"null"}]},"showPointMarkers":{"type":"boolean"}},"required":["selectedObjectId","showPointMarkers"]},"extensions":{"type":"object","additionalProperties":true}},"required":["format","schemaVersion","createdWith","project","page","axes","datasets","series","objects","calculations","legend","viewport","editor","extensions"],"$defs":{"point":{"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"x":{"type":"number"},"y":{"type":"number"},"errorX":{"type":"number","minimum":0},"errorY":{"type":"number","minimum":0}},"required":["id","x","y"]},"anchor":{"oneOf":[{"type":"object","additionalProperties":false,"properties":{"mode":{"const":"data"},"x":{"type":"number"},"y":{"type":"number"}},"required":["mode","x","y"]},{"type":"object","additionalProperties":false,"properties":{"mode":{"const":"page"},"pageX":{"type":"number","minimum":0,"maximum":1},"pageY":{"type":"number","minimum":0,"maximum":1}},"required":["mode","pageX","pageY"]},{"type":"object","additionalProperties":false,"properties":{"mode":{"const":"point"},"datasetId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"pointId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"fallbackX":{"type":"number"},"fallbackY":{"type":"number"},"offsetXpx":{"type":"number"},"offsetYpx":{"type":"number"}},"required":["mode","datasetId","pointId","fallbackX","fallbackY","offsetXpx","offsetYpx"]}]},"axis":{"type":"object","additionalProperties":false,"properties":{"label":{"type":"string","maxLength":500},"unit":{"type":"string","maxLength":100},"scale":{"const":"linear"},"mode":{"enum":["auto","manual"]},"min":{"type":"number"},"max":{"type":"number"},"tickMode":{"enum":["auto","manual"]},"tickStep":{"type":"number","exclusiveMinimum":0},"tickOrigin":{"type":"number"},"minorDivisions":{"type":"integer","minimum":0,"maximum":20},"grid":{"type":"boolean"},"numberFormat":{"enum":["auto","fixed","scientific"]},"precision":{"type":"integer","minimum":0,"maximum":15},"strokeWidthPt":{"type":"number","exclusiveMinimum":0,"maximum":24},"labelSizePt":{"type":"number","minimum":6,"maximum":72}},"required":["label","unit","scale","mode","min","max","tickMode","tickStep","tickOrigin","minorDivisions","grid","numberFormat","precision","strokeWidthPt","labelSizePt"]},"dataset":{"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"name":{"type":"string","maxLength":300},"role":{"enum":["raw","derived"]},"source":{"type":"object","additionalProperties":false,"properties":{"kind":{"enum":["import","clipboard","manual","calculation"]},"displayName":{"type":"string","maxLength":300},"calculationId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"}},"required":["kind"]},"points":{"type":"array","items":{"$ref":"#/$defs/point"},"maxItems":1000000},"uncertainty":{"type":"object","additionalProperties":false,"properties":{"x":{"$ref":"#/$defs/uncertaintyAxis"},"y":{"$ref":"#/$defs/uncertaintyAxis"}},"required":["x","y"]}},"required":["id","name","role","source","points"]},"series":{"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"datasetId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"name":{"type":"string","maxLength":300},"visible":{"type":"boolean"},"includeInAutoRange":{"type":"boolean"},"order":{"type":"integer","minimum":0},"mode":{"enum":["line","points","line-points"]},"style":{"type":"object","additionalProperties":false,"properties":{"stroke":{"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"},"strokeWidthPt":{"type":"number","exclusiveMinimum":0,"maximum":24},"opacity":{"type":"number","minimum":0,"maximum":1},"dash":{"enum":["solid","dash","dot","dash-dot"]},"markerShape":{"enum":["circle","square","triangle","diamond","cross","plus"]},"markerSizePt":{"type":"number","minimum":0,"maximum":32},"markerFill":{"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"},"markerStroke":{"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"},"markerVisible":{"type":"boolean"}},"required":["stroke","strokeWidthPt","opacity","dash","markerShape","markerSizePt","markerFill","markerStroke","markerVisible"]},"errorBars":{"type":"object","additionalProperties":false,"properties":{"x":{"type":"boolean"},"y":{"type":"boolean"},"capSizePt":{"type":"number","minimum":0,"maximum":32},"widthPt":{"type":"number","exclusiveMinimum":0,"maximum":24},"color":{"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"}},"required":["x","y","capSizePt","widthPt","color"]},"uncertainty":{"type":"object","additionalProperties":false,"properties":{"x":{"$ref":"#/$defs/uncertaintyAxis"},"y":{"$ref":"#/$defs/uncertaintyAxis"}},"required":["x","y"]}},"required":["id","datasetId","name","visible","includeInAutoRange","order","mode","style"]},"drawObject":{"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"type":{"enum":["text","segment","line","arrow","callout","rectangle","range-x","range-y","marker","table"]},"name":{"type":"string","maxLength":300},"anchors":{"type":"array","items":{"$ref":"#/$defs/anchor"},"minItems":1,"maxItems":2},"geometry":{"type":"object","additionalProperties":false,"properties":{"directionX":{"type":"number"},"directionY":{"type":"number"},"widthPx":{"type":"number","minimum":16,"maximum":600000},"heightPx":{"type":"number","minimum":16,"maximum":1500000}},"required":[]},"text":{"type":"array","items":{"$ref":"#/$defs/textPart"},"maxItems":1000},"style":{"type":"object","additionalProperties":false,"properties":{"stroke":{"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"},"strokeWidthPt":{"type":"number","exclusiveMinimum":0,"maximum":24},"dash":{"enum":["solid","dash","dot","dash-dot"]},"strokeOpacity":{"type":"number","minimum":0,"maximum":1},"fill":{"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"},"fillOpacity":{"type":"number","minimum":0,"maximum":1},"fontSizePt":{"type":"number","minimum":6,"maximum":72},"fontFamily":{"const":"Courier New"},"arrowHead":{"enum":["none","start","end","both"]},"markerShape":{"enum":["circle","square","triangle","diamond","cross","plus"]},"markerSizePt":{"type":"number","minimum":0,"maximum":32}},"required":["stroke","strokeWidthPt","dash","strokeOpacity","fill","fillOpacity","fontSizePt","fontFamily","arrowHead","markerShape","markerSizePt"]},"zIndex":{"type":"integer"},"visible":{"type":"boolean"},"locked":{"type":"boolean"},"table":{"$ref":"#/$defs/diagramTable"}},"required":["id","type","name","anchors","geometry","text","style","zIndex","visible","locked"],"allOf":[{"if":{"properties":{"type":{"const":"table"}},"required":["type"]},"then":{"required":["table"]},"else":{"not":{"required":["table"]}}}]},"calculation":{"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"kind":{"enum":["linear-fit","polynomial-fit","exponential-fit","power-fit","savitzky-golay","moving-average","derivative","integral","interpolation","statistics","baseline","peaks","area","peak-fit","peak-fit-output"]},"sourceDatasetIds":{"type":"array","items":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"minItems":1},"resultDatasetId":{"anyOf":[{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},{"type":"null"}]},"parameters":{"type":"object","maxProperties":60,"additionalProperties":{"type":["string","number","integer","boolean","null","array","object"]}},"algorithmVersion":{"type":"integer","minimum":1},"status":{"enum":["valid","outdated","invalid"]},"summary":{"type":"object","maxProperties":60,"additionalProperties":{"type":["string","number","integer","boolean","null"]}},"data":{"type":"object","additionalProperties":false,"properties":{"peaks":{"type":"array","maxItems":1000000,"items":{"$ref":"#/$defs/peakMeasurement"}},"peakFit":{"$ref":"#/$defs/peakFit"}}},"display":{"type":"object","additionalProperties":false,"properties":{"visible":{"type":"boolean"},"stroke":{"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"},"opacity":{"type":"number","minimum":0,"maximum":1},"label":{"type":"boolean"}},"required":["visible","stroke","opacity","label"]}},"required":["id","kind","sourceDatasetIds","resultDatasetId","parameters","algorithmVersion","status","summary"]},"textPart":{"type":"object","additionalProperties":false,"properties":{"text":{"type":"string","maxLength":5000},"baseline":{"enum":["normal","sub","super"]},"bold":{"type":"boolean"},"italic":{"type":"boolean"}},"required":["text","baseline","bold","italic"]},"peakMeasurement":{"type":"object","additionalProperties":false,"properties":{"index":{"type":"integer","minimum":0},"x":{"type":"number"},"y":{"type":"number"},"direction":{"enum":["max","min"]},"prominence":{"type":["number","null"],"minimum":0},"width":{"type":["number","null"],"minimum":0},"left":{"type":["number","null"]},"right":{"type":["number","null"]},"level":{"type":["number","null"]},"incomplete":{"type":"boolean"}},"required":["index","x","y","direction","prominence","width","left","right","level","incomplete"]},"diagramTable":{"type":"object","additionalProperties":false,"properties":{"version":{"const":1},"rows":{"type":"array","items":{"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"size":{"type":"number","minimum":16,"maximum":30000}},"required":["id","size"]},"minItems":1,"maxItems":50},"columns":{"type":"array","items":{"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"size":{"type":"number","minimum":16,"maximum":30000}},"required":["id","size"]},"minItems":1,"maxItems":20},"cells":{"type":"array","items":{"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"text":{"type":"array","items":{"$ref":"#/$defs/textPart"},"minItems":0,"maxItems":1000},"align":{"enum":["left","center","right"]},"vertical":{"enum":["top","middle","bottom"]},"fill":{"anyOf":[{"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"},{"type":"null"}]},"color":{"anyOf":[{"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"},{"type":"null"}]},"fontSizePt":{"anyOf":[{"type":"number","minimum":6,"maximum":72},{"type":"null"}]},"numberFormat":{"type":"object","additionalProperties":false,"properties":{"mode":{"enum":["original","fixed","scientific"]},"digits":{"type":"integer","minimum":0,"maximum":15}},"required":["mode","digits"]}},"required":["id","text","align","vertical","fill","color","fontSizePt"]},"minItems":1,"maxItems":1000},"merges":{"type":"array","items":{"type":"object","additionalProperties":false,"properties":{"row":{"type":"integer","minimum":0,"maximum":49},"column":{"type":"integer","minimum":0,"maximum":19},"rows":{"type":"integer","minimum":1,"maximum":50},"columns":{"type":"integer","minimum":1,"maximum":20}},"required":["row","column","rows","columns"]},"minItems":0,"maxItems":500},"padding":{"type":"number","minimum":0,"maximum":50},"header":{"type":"boolean"},"fill":{"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"},"headerFill":{"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"},"grid":{"type":"object","additionalProperties":false,"properties":{"visible":{"type":"boolean"},"color":{"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"},"widthPt":{"type":"number","exclusiveMinimum":0,"maximum":24},"dash":{"enum":["solid","dash","dot","dash-dot"]},"horizontal":{"type":"boolean"},"vertical":{"type":"boolean"}},"required":["visible","color","widthPt","dash","horizontal","vertical"]},"fillOpacity":{"type":"number","minimum":0,"maximum":1}},"required":["version","rows","columns","cells","merges","padding","header","fill","headerFill","grid","fillOpacity"]},"uncertaintyAxis":{"type":"object","additionalProperties":false,"properties":{"mode":{"enum":["none","per-point","constant"]},"value":{"type":"number","minimum":0}},"required":["mode"],"allOf":[{"if":{"properties":{"mode":{"const":"constant"}}},"then":{"required":["value"]},"else":{"not":{"required":["value"]}}}]},"peakFitComponent":{"type":"object","additionalProperties":false,"properties":{"model":{"enum":["gaussian","lorentzian","pseudo-voigt"]},"center":{"type":"number"},"height":{"type":"number"},"fwhm":{"type":"number","exclusiveMinimum":0},"eta":{"type":"number","minimum":0,"maximum":1},"area":{"type":"number"}},"required":["model","center","height","fwhm","eta","area"]},"peakFit":{"type":"object","additionalProperties":false,"properties":{"version":{"const":1},"components":{"type":"array","minItems":1,"maxItems":8,"items":{"$ref":"#/$defs/peakFitComponent"}},"baseline":{"type":"object","additionalProperties":false,"properties":{"mode":{"enum":["none","constant","linear"]},"referenceX":{"type":"number"},"intercept":{"type":"number"},"slope":{"type":"number"}},"required":["mode","referenceX","intercept","slope"]},"range":{"type":"array","minItems":2,"maxItems":2,"items":{"type":"number"}},"n":{"type":"integer","minimum":1,"maximum":1000000},"sse":{"type":"number","minimum":0},"rmse":{"type":"number","minimum":0},"rSquared":{"type":["number","null"]},"iterations":{"type":"integer","minimum":0,"maximum":1000},"condition":{"type":"number","minimum":1,"maximum":1000000000000},"method":{"const":"scaled-projected-lm-givens-qr"}},"required":["version","components","baseline","range","n","sse","rmse","rSquared","iterations","condition","method"]}}};
const schema70 = {"type":"object","additionalProperties":false,"properties":{"label":{"type":"string","maxLength":500},"unit":{"type":"string","maxLength":100},"scale":{"const":"linear"},"mode":{"enum":["auto","manual"]},"min":{"type":"number"},"max":{"type":"number"},"tickMode":{"enum":["auto","manual"]},"tickStep":{"type":"number","exclusiveMinimum":0},"tickOrigin":{"type":"number"},"minorDivisions":{"type":"integer","minimum":0,"maximum":20},"grid":{"type":"boolean"},"numberFormat":{"enum":["auto","fixed","scientific"]},"precision":{"type":"integer","minimum":0,"maximum":15},"strokeWidthPt":{"type":"number","exclusiveMinimum":0,"maximum":24},"labelSizePt":{"type":"number","minimum":6,"maximum":72}},"required":["label","unit","scale","mode","min","max","tickMode","tickStep","tickOrigin","minorDivisions","grid","numberFormat","precision","strokeWidthPt","labelSizePt"]};
const schema80 = {"oneOf":[{"type":"object","additionalProperties":false,"properties":{"mode":{"const":"data"},"x":{"type":"number"},"y":{"type":"number"}},"required":["mode","x","y"]},{"type":"object","additionalProperties":false,"properties":{"mode":{"const":"page"},"pageX":{"type":"number","minimum":0,"maximum":1},"pageY":{"type":"number","minimum":0,"maximum":1}},"required":["mode","pageX","pageY"]},{"type":"object","additionalProperties":false,"properties":{"mode":{"const":"point"},"datasetId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"pointId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"fallbackX":{"type":"number"},"fallbackY":{"type":"number"},"offsetXpx":{"type":"number"},"offsetYpx":{"type":"number"}},"required":["mode","datasetId","pointId","fallbackX","fallbackY","offsetXpx","offsetYpx"]}]};
const pattern83 = new RegExp("^1\\.3\\.[0-9]+$", "u");
const schema72 = {"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"name":{"type":"string","maxLength":300},"role":{"enum":["raw","derived"]},"source":{"type":"object","additionalProperties":false,"properties":{"kind":{"enum":["import","clipboard","manual","calculation"]},"displayName":{"type":"string","maxLength":300},"calculationId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"}},"required":["kind"]},"points":{"type":"array","items":{"$ref":"#/$defs/point"},"maxItems":1000000},"uncertainty":{"type":"object","additionalProperties":false,"properties":{"x":{"$ref":"#/$defs/uncertaintyAxis"},"y":{"$ref":"#/$defs/uncertaintyAxis"}},"required":["x","y"]}},"required":["id","name","role","source","points"]};
const schema73 = {"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"x":{"type":"number"},"y":{"type":"number"},"errorX":{"type":"number","minimum":0},"errorY":{"type":"number","minimum":0}},"required":["id","x","y"]};
const schema74 = {"type":"object","additionalProperties":false,"properties":{"mode":{"enum":["none","per-point","constant"]},"value":{"type":"number","minimum":0}},"required":["mode"],"allOf":[{"if":{"properties":{"mode":{"const":"constant"}}},"then":{"required":["value"]},"else":{"not":{"required":["value"]}}}]};

function validate46(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate46.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.id === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.name === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.role === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "role"},message:"must have required property '"+"role"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.source === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "source"},message:"must have required property '"+"source"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.points === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "points"},message:"must have required property '"+"points"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
for(const key0 in data){
if(!((((((key0 === "id") || (key0 === "name")) || (key0 === "role")) || (key0 === "source")) || (key0 === "points")) || (key0 === "uncertainty"))){
const err5 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
if(data.id !== undefined){
let data0 = data.id;
if(typeof data0 === "string"){
if(!pattern6.test(data0)){
const err6 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"+"\""};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
else {
const err7 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
if(data.name !== undefined){
let data1 = data.name;
if(typeof data1 === "string"){
if(func2(data1) > 300){
const err8 = {instancePath:instancePath+"/name",schemaPath:"#/properties/name/maxLength",keyword:"maxLength",params:{limit: 300},message:"must NOT have more than 300 characters"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
else {
const err9 = {instancePath:instancePath+"/name",schemaPath:"#/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
if(data.role !== undefined){
let data2 = data.role;
if(!((data2 === "raw") || (data2 === "derived"))){
const err10 = {instancePath:instancePath+"/role",schemaPath:"#/properties/role/enum",keyword:"enum",params:{allowedValues: schema72.properties.role.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
if(data.source !== undefined){
let data3 = data.source;
if(data3 && typeof data3 == "object" && !Array.isArray(data3)){
if(data3.kind === undefined){
const err11 = {instancePath:instancePath+"/source",schemaPath:"#/properties/source/required",keyword:"required",params:{missingProperty: "kind"},message:"must have required property '"+"kind"+"'"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
for(const key1 in data3){
if(!(((key1 === "kind") || (key1 === "displayName")) || (key1 === "calculationId"))){
const err12 = {instancePath:instancePath+"/source",schemaPath:"#/properties/source/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
if(data3.kind !== undefined){
let data4 = data3.kind;
if(!((((data4 === "import") || (data4 === "clipboard")) || (data4 === "manual")) || (data4 === "calculation"))){
const err13 = {instancePath:instancePath+"/source/kind",schemaPath:"#/properties/source/properties/kind/enum",keyword:"enum",params:{allowedValues: schema72.properties.source.properties.kind.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
if(data3.displayName !== undefined){
let data5 = data3.displayName;
if(typeof data5 === "string"){
if(func2(data5) > 300){
const err14 = {instancePath:instancePath+"/source/displayName",schemaPath:"#/properties/source/properties/displayName/maxLength",keyword:"maxLength",params:{limit: 300},message:"must NOT have more than 300 characters"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
else {
const err15 = {instancePath:instancePath+"/source/displayName",schemaPath:"#/properties/source/properties/displayName/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
if(data3.calculationId !== undefined){
let data6 = data3.calculationId;
if(typeof data6 === "string"){
if(!pattern6.test(data6)){
const err16 = {instancePath:instancePath+"/source/calculationId",schemaPath:"#/properties/source/properties/calculationId/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"+"\""};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
}
else {
const err17 = {instancePath:instancePath+"/source/calculationId",schemaPath:"#/properties/source/properties/calculationId/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
}
}
else {
const err18 = {instancePath:instancePath+"/source",schemaPath:"#/properties/source/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
}
if(data.points !== undefined){
let data7 = data.points;
if(Array.isArray(data7)){
if(data7.length > 1000000){
const err19 = {instancePath:instancePath+"/points",schemaPath:"#/properties/points/maxItems",keyword:"maxItems",params:{limit: 1000000},message:"must NOT have more than 1000000 items"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
const len0 = data7.length;
for(let i0=0; i0<len0; i0++){
let data8 = data7[i0];
if(data8 && typeof data8 == "object" && !Array.isArray(data8)){
if(data8.id === undefined){
const err20 = {instancePath:instancePath+"/points/" + i0,schemaPath:"#/$defs/point/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
if(data8.x === undefined){
const err21 = {instancePath:instancePath+"/points/" + i0,schemaPath:"#/$defs/point/required",keyword:"required",params:{missingProperty: "x"},message:"must have required property '"+"x"+"'"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
if(data8.y === undefined){
const err22 = {instancePath:instancePath+"/points/" + i0,schemaPath:"#/$defs/point/required",keyword:"required",params:{missingProperty: "y"},message:"must have required property '"+"y"+"'"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
for(const key2 in data8){
if(!(((((key2 === "id") || (key2 === "x")) || (key2 === "y")) || (key2 === "errorX")) || (key2 === "errorY"))){
const err23 = {instancePath:instancePath+"/points/" + i0,schemaPath:"#/$defs/point/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key2},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
}
if(data8.id !== undefined){
let data9 = data8.id;
if(typeof data9 === "string"){
if(!pattern6.test(data9)){
const err24 = {instancePath:instancePath+"/points/" + i0+"/id",schemaPath:"#/$defs/point/properties/id/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"+"\""};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
}
else {
const err25 = {instancePath:instancePath+"/points/" + i0+"/id",schemaPath:"#/$defs/point/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
}
if(data8.x !== undefined){
let data10 = data8.x;
if(!((typeof data10 == "number") && (isFinite(data10)))){
const err26 = {instancePath:instancePath+"/points/" + i0+"/x",schemaPath:"#/$defs/point/properties/x/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
}
if(data8.y !== undefined){
let data11 = data8.y;
if(!((typeof data11 == "number") && (isFinite(data11)))){
const err27 = {instancePath:instancePath+"/points/" + i0+"/y",schemaPath:"#/$defs/point/properties/y/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
}
if(data8.errorX !== undefined){
let data12 = data8.errorX;
if((typeof data12 == "number") && (isFinite(data12))){
if(data12 < 0 || isNaN(data12)){
const err28 = {instancePath:instancePath+"/points/" + i0+"/errorX",schemaPath:"#/$defs/point/properties/errorX/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
}
else {
const err29 = {instancePath:instancePath+"/points/" + i0+"/errorX",schemaPath:"#/$defs/point/properties/errorX/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
}
}
if(data8.errorY !== undefined){
let data13 = data8.errorY;
if((typeof data13 == "number") && (isFinite(data13))){
if(data13 < 0 || isNaN(data13)){
const err30 = {instancePath:instancePath+"/points/" + i0+"/errorY",schemaPath:"#/$defs/point/properties/errorY/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err30];
}
else {
vErrors.push(err30);
}
errors++;
}
}
else {
const err31 = {instancePath:instancePath+"/points/" + i0+"/errorY",schemaPath:"#/$defs/point/properties/errorY/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err31];
}
else {
vErrors.push(err31);
}
errors++;
}
}
}
else {
const err32 = {instancePath:instancePath+"/points/" + i0,schemaPath:"#/$defs/point/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err32];
}
else {
vErrors.push(err32);
}
errors++;
}
}
}
else {
const err33 = {instancePath:instancePath+"/points",schemaPath:"#/properties/points/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err33];
}
else {
vErrors.push(err33);
}
errors++;
}
}
if(data.uncertainty !== undefined){
let data14 = data.uncertainty;
if(data14 && typeof data14 == "object" && !Array.isArray(data14)){
if(data14.x === undefined){
const err34 = {instancePath:instancePath+"/uncertainty",schemaPath:"#/properties/uncertainty/required",keyword:"required",params:{missingProperty: "x"},message:"must have required property '"+"x"+"'"};
if(vErrors === null){
vErrors = [err34];
}
else {
vErrors.push(err34);
}
errors++;
}
if(data14.y === undefined){
const err35 = {instancePath:instancePath+"/uncertainty",schemaPath:"#/properties/uncertainty/required",keyword:"required",params:{missingProperty: "y"},message:"must have required property '"+"y"+"'"};
if(vErrors === null){
vErrors = [err35];
}
else {
vErrors.push(err35);
}
errors++;
}
for(const key3 in data14){
if(!((key3 === "x") || (key3 === "y"))){
const err36 = {instancePath:instancePath+"/uncertainty",schemaPath:"#/properties/uncertainty/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key3},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err36];
}
else {
vErrors.push(err36);
}
errors++;
}
}
if(data14.x !== undefined){
let data15 = data14.x;
const _errs38 = errors;
let valid9 = true;
const _errs39 = errors;
if(data15 && typeof data15 == "object" && !Array.isArray(data15)){
if(data15.mode !== undefined){
if("constant" !== data15.mode){
const err37 = {};
if(vErrors === null){
vErrors = [err37];
}
else {
vErrors.push(err37);
}
errors++;
}
}
}
var _valid0 = _errs39 === errors;
errors = _errs38;
if(vErrors !== null){
if(_errs38){
vErrors.length = _errs38;
}
else {
vErrors = null;
}
}
let ifClause0;
if(_valid0){
const _errs41 = errors;
if(data15 && typeof data15 == "object" && !Array.isArray(data15)){
if(data15.value === undefined){
const err38 = {instancePath:instancePath+"/uncertainty/x",schemaPath:"#/$defs/uncertaintyAxis/allOf/0/then/required",keyword:"required",params:{missingProperty: "value"},message:"must have required property '"+"value"+"'"};
if(vErrors === null){
vErrors = [err38];
}
else {
vErrors.push(err38);
}
errors++;
}
}
var _valid0 = _errs41 === errors;
valid9 = _valid0;
ifClause0 = "then";
}
else {
const _errs42 = errors;
const _errs43 = errors;
const _errs44 = errors;
if(data15 && typeof data15 == "object" && !Array.isArray(data15)){
let missing0;
if((data15.value === undefined) && (missing0 = "value")){
const err39 = {};
if(vErrors === null){
vErrors = [err39];
}
else {
vErrors.push(err39);
}
errors++;
}
}
var valid11 = _errs44 === errors;
if(valid11){
const err40 = {instancePath:instancePath+"/uncertainty/x",schemaPath:"#/$defs/uncertaintyAxis/allOf/0/else/not",keyword:"not",params:{},message:"must NOT be valid"};
if(vErrors === null){
vErrors = [err40];
}
else {
vErrors.push(err40);
}
errors++;
}
else {
errors = _errs43;
if(vErrors !== null){
if(_errs43){
vErrors.length = _errs43;
}
else {
vErrors = null;
}
}
}
var _valid0 = _errs42 === errors;
valid9 = _valid0;
ifClause0 = "else";
}
if(!valid9){
const err41 = {instancePath:instancePath+"/uncertainty/x",schemaPath:"#/$defs/uncertaintyAxis/allOf/0/if",keyword:"if",params:{failingKeyword: ifClause0},message:"must match \""+ifClause0+"\" schema"};
if(vErrors === null){
vErrors = [err41];
}
else {
vErrors.push(err41);
}
errors++;
}
if(data15 && typeof data15 == "object" && !Array.isArray(data15)){
if(data15.mode === undefined){
const err42 = {instancePath:instancePath+"/uncertainty/x",schemaPath:"#/$defs/uncertaintyAxis/required",keyword:"required",params:{missingProperty: "mode"},message:"must have required property '"+"mode"+"'"};
if(vErrors === null){
vErrors = [err42];
}
else {
vErrors.push(err42);
}
errors++;
}
for(const key4 in data15){
if(!((key4 === "mode") || (key4 === "value"))){
const err43 = {instancePath:instancePath+"/uncertainty/x",schemaPath:"#/$defs/uncertaintyAxis/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key4},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err43];
}
else {
vErrors.push(err43);
}
errors++;
}
}
if(data15.mode !== undefined){
let data17 = data15.mode;
if(!(((data17 === "none") || (data17 === "per-point")) || (data17 === "constant"))){
const err44 = {instancePath:instancePath+"/uncertainty/x/mode",schemaPath:"#/$defs/uncertaintyAxis/properties/mode/enum",keyword:"enum",params:{allowedValues: schema74.properties.mode.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err44];
}
else {
vErrors.push(err44);
}
errors++;
}
}
if(data15.value !== undefined){
let data18 = data15.value;
if((typeof data18 == "number") && (isFinite(data18))){
if(data18 < 0 || isNaN(data18)){
const err45 = {instancePath:instancePath+"/uncertainty/x/value",schemaPath:"#/$defs/uncertaintyAxis/properties/value/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err45];
}
else {
vErrors.push(err45);
}
errors++;
}
}
else {
const err46 = {instancePath:instancePath+"/uncertainty/x/value",schemaPath:"#/$defs/uncertaintyAxis/properties/value/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err46];
}
else {
vErrors.push(err46);
}
errors++;
}
}
}
else {
const err47 = {instancePath:instancePath+"/uncertainty/x",schemaPath:"#/$defs/uncertaintyAxis/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err47];
}
else {
vErrors.push(err47);
}
errors++;
}
}
if(data14.y !== undefined){
let data19 = data14.y;
const _errs53 = errors;
let valid15 = true;
const _errs54 = errors;
if(data19 && typeof data19 == "object" && !Array.isArray(data19)){
if(data19.mode !== undefined){
if("constant" !== data19.mode){
const err48 = {};
if(vErrors === null){
vErrors = [err48];
}
else {
vErrors.push(err48);
}
errors++;
}
}
}
var _valid1 = _errs54 === errors;
errors = _errs53;
if(vErrors !== null){
if(_errs53){
vErrors.length = _errs53;
}
else {
vErrors = null;
}
}
let ifClause1;
if(_valid1){
const _errs56 = errors;
if(data19 && typeof data19 == "object" && !Array.isArray(data19)){
if(data19.value === undefined){
const err49 = {instancePath:instancePath+"/uncertainty/y",schemaPath:"#/$defs/uncertaintyAxis/allOf/0/then/required",keyword:"required",params:{missingProperty: "value"},message:"must have required property '"+"value"+"'"};
if(vErrors === null){
vErrors = [err49];
}
else {
vErrors.push(err49);
}
errors++;
}
}
var _valid1 = _errs56 === errors;
valid15 = _valid1;
ifClause1 = "then";
}
else {
const _errs57 = errors;
const _errs58 = errors;
const _errs59 = errors;
if(data19 && typeof data19 == "object" && !Array.isArray(data19)){
let missing1;
if((data19.value === undefined) && (missing1 = "value")){
const err50 = {};
if(vErrors === null){
vErrors = [err50];
}
else {
vErrors.push(err50);
}
errors++;
}
}
var valid17 = _errs59 === errors;
if(valid17){
const err51 = {instancePath:instancePath+"/uncertainty/y",schemaPath:"#/$defs/uncertaintyAxis/allOf/0/else/not",keyword:"not",params:{},message:"must NOT be valid"};
if(vErrors === null){
vErrors = [err51];
}
else {
vErrors.push(err51);
}
errors++;
}
else {
errors = _errs58;
if(vErrors !== null){
if(_errs58){
vErrors.length = _errs58;
}
else {
vErrors = null;
}
}
}
var _valid1 = _errs57 === errors;
valid15 = _valid1;
ifClause1 = "else";
}
if(!valid15){
const err52 = {instancePath:instancePath+"/uncertainty/y",schemaPath:"#/$defs/uncertaintyAxis/allOf/0/if",keyword:"if",params:{failingKeyword: ifClause1},message:"must match \""+ifClause1+"\" schema"};
if(vErrors === null){
vErrors = [err52];
}
else {
vErrors.push(err52);
}
errors++;
}
if(data19 && typeof data19 == "object" && !Array.isArray(data19)){
if(data19.mode === undefined){
const err53 = {instancePath:instancePath+"/uncertainty/y",schemaPath:"#/$defs/uncertaintyAxis/required",keyword:"required",params:{missingProperty: "mode"},message:"must have required property '"+"mode"+"'"};
if(vErrors === null){
vErrors = [err53];
}
else {
vErrors.push(err53);
}
errors++;
}
for(const key5 in data19){
if(!((key5 === "mode") || (key5 === "value"))){
const err54 = {instancePath:instancePath+"/uncertainty/y",schemaPath:"#/$defs/uncertaintyAxis/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key5},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err54];
}
else {
vErrors.push(err54);
}
errors++;
}
}
if(data19.mode !== undefined){
let data21 = data19.mode;
if(!(((data21 === "none") || (data21 === "per-point")) || (data21 === "constant"))){
const err55 = {instancePath:instancePath+"/uncertainty/y/mode",schemaPath:"#/$defs/uncertaintyAxis/properties/mode/enum",keyword:"enum",params:{allowedValues: schema74.properties.mode.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err55];
}
else {
vErrors.push(err55);
}
errors++;
}
}
if(data19.value !== undefined){
let data22 = data19.value;
if((typeof data22 == "number") && (isFinite(data22))){
if(data22 < 0 || isNaN(data22)){
const err56 = {instancePath:instancePath+"/uncertainty/y/value",schemaPath:"#/$defs/uncertaintyAxis/properties/value/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err56];
}
else {
vErrors.push(err56);
}
errors++;
}
}
else {
const err57 = {instancePath:instancePath+"/uncertainty/y/value",schemaPath:"#/$defs/uncertaintyAxis/properties/value/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err57];
}
else {
vErrors.push(err57);
}
errors++;
}
}
}
else {
const err58 = {instancePath:instancePath+"/uncertainty/y",schemaPath:"#/$defs/uncertaintyAxis/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err58];
}
else {
vErrors.push(err58);
}
errors++;
}
}
}
else {
const err59 = {instancePath:instancePath+"/uncertainty",schemaPath:"#/properties/uncertainty/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err59];
}
else {
vErrors.push(err59);
}
errors++;
}
}
}
else {
const err60 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err60];
}
else {
vErrors.push(err60);
}
errors++;
}
validate46.errors = vErrors;
return errors === 0;
}
validate46.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema76 = {"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"datasetId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"name":{"type":"string","maxLength":300},"visible":{"type":"boolean"},"includeInAutoRange":{"type":"boolean"},"order":{"type":"integer","minimum":0},"mode":{"enum":["line","points","line-points"]},"style":{"type":"object","additionalProperties":false,"properties":{"stroke":{"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"},"strokeWidthPt":{"type":"number","exclusiveMinimum":0,"maximum":24},"opacity":{"type":"number","minimum":0,"maximum":1},"dash":{"enum":["solid","dash","dot","dash-dot"]},"markerShape":{"enum":["circle","square","triangle","diamond","cross","plus"]},"markerSizePt":{"type":"number","minimum":0,"maximum":32},"markerFill":{"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"},"markerStroke":{"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"},"markerVisible":{"type":"boolean"}},"required":["stroke","strokeWidthPt","opacity","dash","markerShape","markerSizePt","markerFill","markerStroke","markerVisible"]},"errorBars":{"type":"object","additionalProperties":false,"properties":{"x":{"type":"boolean"},"y":{"type":"boolean"},"capSizePt":{"type":"number","minimum":0,"maximum":32},"widthPt":{"type":"number","exclusiveMinimum":0,"maximum":24},"color":{"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"}},"required":["x","y","capSizePt","widthPt","color"]},"uncertainty":{"type":"object","additionalProperties":false,"properties":{"x":{"$ref":"#/$defs/uncertaintyAxis"},"y":{"$ref":"#/$defs/uncertaintyAxis"}},"required":["x","y"]}},"required":["id","datasetId","name","visible","includeInAutoRange","order","mode","style"]};

function validate48(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate48.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.id === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.datasetId === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "datasetId"},message:"must have required property '"+"datasetId"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.name === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.visible === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "visible"},message:"must have required property '"+"visible"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.includeInAutoRange === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "includeInAutoRange"},message:"must have required property '"+"includeInAutoRange"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data.order === undefined){
const err5 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "order"},message:"must have required property '"+"order"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data.mode === undefined){
const err6 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "mode"},message:"must have required property '"+"mode"+"'"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
if(data.style === undefined){
const err7 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "style"},message:"must have required property '"+"style"+"'"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
for(const key0 in data){
if(!(func1.call(schema76.properties, key0))){
const err8 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
if(data.id !== undefined){
let data0 = data.id;
if(typeof data0 === "string"){
if(!pattern6.test(data0)){
const err9 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"+"\""};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
else {
const err10 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
if(data.datasetId !== undefined){
let data1 = data.datasetId;
if(typeof data1 === "string"){
if(!pattern6.test(data1)){
const err11 = {instancePath:instancePath+"/datasetId",schemaPath:"#/properties/datasetId/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"+"\""};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
else {
const err12 = {instancePath:instancePath+"/datasetId",schemaPath:"#/properties/datasetId/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
if(data.name !== undefined){
let data2 = data.name;
if(typeof data2 === "string"){
if(func2(data2) > 300){
const err13 = {instancePath:instancePath+"/name",schemaPath:"#/properties/name/maxLength",keyword:"maxLength",params:{limit: 300},message:"must NOT have more than 300 characters"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
else {
const err14 = {instancePath:instancePath+"/name",schemaPath:"#/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
if(data.visible !== undefined){
if(typeof data.visible !== "boolean"){
const err15 = {instancePath:instancePath+"/visible",schemaPath:"#/properties/visible/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
if(data.includeInAutoRange !== undefined){
if(typeof data.includeInAutoRange !== "boolean"){
const err16 = {instancePath:instancePath+"/includeInAutoRange",schemaPath:"#/properties/includeInAutoRange/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
}
if(data.order !== undefined){
let data5 = data.order;
if(!(((typeof data5 == "number") && (!(data5 % 1) && !isNaN(data5))) && (isFinite(data5)))){
const err17 = {instancePath:instancePath+"/order",schemaPath:"#/properties/order/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
if((typeof data5 == "number") && (isFinite(data5))){
if(data5 < 0 || isNaN(data5)){
const err18 = {instancePath:instancePath+"/order",schemaPath:"#/properties/order/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
}
}
if(data.mode !== undefined){
let data6 = data.mode;
if(!(((data6 === "line") || (data6 === "points")) || (data6 === "line-points"))){
const err19 = {instancePath:instancePath+"/mode",schemaPath:"#/properties/mode/enum",keyword:"enum",params:{allowedValues: schema76.properties.mode.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
}
if(data.style !== undefined){
let data7 = data.style;
if(data7 && typeof data7 == "object" && !Array.isArray(data7)){
if(data7.stroke === undefined){
const err20 = {instancePath:instancePath+"/style",schemaPath:"#/properties/style/required",keyword:"required",params:{missingProperty: "stroke"},message:"must have required property '"+"stroke"+"'"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
if(data7.strokeWidthPt === undefined){
const err21 = {instancePath:instancePath+"/style",schemaPath:"#/properties/style/required",keyword:"required",params:{missingProperty: "strokeWidthPt"},message:"must have required property '"+"strokeWidthPt"+"'"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
if(data7.opacity === undefined){
const err22 = {instancePath:instancePath+"/style",schemaPath:"#/properties/style/required",keyword:"required",params:{missingProperty: "opacity"},message:"must have required property '"+"opacity"+"'"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
if(data7.dash === undefined){
const err23 = {instancePath:instancePath+"/style",schemaPath:"#/properties/style/required",keyword:"required",params:{missingProperty: "dash"},message:"must have required property '"+"dash"+"'"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
if(data7.markerShape === undefined){
const err24 = {instancePath:instancePath+"/style",schemaPath:"#/properties/style/required",keyword:"required",params:{missingProperty: "markerShape"},message:"must have required property '"+"markerShape"+"'"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
if(data7.markerSizePt === undefined){
const err25 = {instancePath:instancePath+"/style",schemaPath:"#/properties/style/required",keyword:"required",params:{missingProperty: "markerSizePt"},message:"must have required property '"+"markerSizePt"+"'"};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
if(data7.markerFill === undefined){
const err26 = {instancePath:instancePath+"/style",schemaPath:"#/properties/style/required",keyword:"required",params:{missingProperty: "markerFill"},message:"must have required property '"+"markerFill"+"'"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
if(data7.markerStroke === undefined){
const err27 = {instancePath:instancePath+"/style",schemaPath:"#/properties/style/required",keyword:"required",params:{missingProperty: "markerStroke"},message:"must have required property '"+"markerStroke"+"'"};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
if(data7.markerVisible === undefined){
const err28 = {instancePath:instancePath+"/style",schemaPath:"#/properties/style/required",keyword:"required",params:{missingProperty: "markerVisible"},message:"must have required property '"+"markerVisible"+"'"};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
for(const key1 in data7){
if(!(func1.call(schema76.properties.style.properties, key1))){
const err29 = {instancePath:instancePath+"/style",schemaPath:"#/properties/style/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
}
}
if(data7.stroke !== undefined){
let data8 = data7.stroke;
if(typeof data8 === "string"){
if(!pattern7.test(data8)){
const err30 = {instancePath:instancePath+"/style/stroke",schemaPath:"#/properties/style/properties/stroke/pattern",keyword:"pattern",params:{pattern: "^#[0-9A-Fa-f]{6}$"},message:"must match pattern \""+"^#[0-9A-Fa-f]{6}$"+"\""};
if(vErrors === null){
vErrors = [err30];
}
else {
vErrors.push(err30);
}
errors++;
}
}
else {
const err31 = {instancePath:instancePath+"/style/stroke",schemaPath:"#/properties/style/properties/stroke/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err31];
}
else {
vErrors.push(err31);
}
errors++;
}
}
if(data7.strokeWidthPt !== undefined){
let data9 = data7.strokeWidthPt;
if((typeof data9 == "number") && (isFinite(data9))){
if(data9 > 24 || isNaN(data9)){
const err32 = {instancePath:instancePath+"/style/strokeWidthPt",schemaPath:"#/properties/style/properties/strokeWidthPt/maximum",keyword:"maximum",params:{comparison: "<=", limit: 24},message:"must be <= 24"};
if(vErrors === null){
vErrors = [err32];
}
else {
vErrors.push(err32);
}
errors++;
}
if(data9 <= 0 || isNaN(data9)){
const err33 = {instancePath:instancePath+"/style/strokeWidthPt",schemaPath:"#/properties/style/properties/strokeWidthPt/exclusiveMinimum",keyword:"exclusiveMinimum",params:{comparison: ">", limit: 0},message:"must be > 0"};
if(vErrors === null){
vErrors = [err33];
}
else {
vErrors.push(err33);
}
errors++;
}
}
else {
const err34 = {instancePath:instancePath+"/style/strokeWidthPt",schemaPath:"#/properties/style/properties/strokeWidthPt/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err34];
}
else {
vErrors.push(err34);
}
errors++;
}
}
if(data7.opacity !== undefined){
let data10 = data7.opacity;
if((typeof data10 == "number") && (isFinite(data10))){
if(data10 > 1 || isNaN(data10)){
const err35 = {instancePath:instancePath+"/style/opacity",schemaPath:"#/properties/style/properties/opacity/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1},message:"must be <= 1"};
if(vErrors === null){
vErrors = [err35];
}
else {
vErrors.push(err35);
}
errors++;
}
if(data10 < 0 || isNaN(data10)){
const err36 = {instancePath:instancePath+"/style/opacity",schemaPath:"#/properties/style/properties/opacity/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err36];
}
else {
vErrors.push(err36);
}
errors++;
}
}
else {
const err37 = {instancePath:instancePath+"/style/opacity",schemaPath:"#/properties/style/properties/opacity/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err37];
}
else {
vErrors.push(err37);
}
errors++;
}
}
if(data7.dash !== undefined){
let data11 = data7.dash;
if(!((((data11 === "solid") || (data11 === "dash")) || (data11 === "dot")) || (data11 === "dash-dot"))){
const err38 = {instancePath:instancePath+"/style/dash",schemaPath:"#/properties/style/properties/dash/enum",keyword:"enum",params:{allowedValues: schema76.properties.style.properties.dash.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err38];
}
else {
vErrors.push(err38);
}
errors++;
}
}
if(data7.markerShape !== undefined){
let data12 = data7.markerShape;
if(!((((((data12 === "circle") || (data12 === "square")) || (data12 === "triangle")) || (data12 === "diamond")) || (data12 === "cross")) || (data12 === "plus"))){
const err39 = {instancePath:instancePath+"/style/markerShape",schemaPath:"#/properties/style/properties/markerShape/enum",keyword:"enum",params:{allowedValues: schema76.properties.style.properties.markerShape.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err39];
}
else {
vErrors.push(err39);
}
errors++;
}
}
if(data7.markerSizePt !== undefined){
let data13 = data7.markerSizePt;
if((typeof data13 == "number") && (isFinite(data13))){
if(data13 > 32 || isNaN(data13)){
const err40 = {instancePath:instancePath+"/style/markerSizePt",schemaPath:"#/properties/style/properties/markerSizePt/maximum",keyword:"maximum",params:{comparison: "<=", limit: 32},message:"must be <= 32"};
if(vErrors === null){
vErrors = [err40];
}
else {
vErrors.push(err40);
}
errors++;
}
if(data13 < 0 || isNaN(data13)){
const err41 = {instancePath:instancePath+"/style/markerSizePt",schemaPath:"#/properties/style/properties/markerSizePt/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err41];
}
else {
vErrors.push(err41);
}
errors++;
}
}
else {
const err42 = {instancePath:instancePath+"/style/markerSizePt",schemaPath:"#/properties/style/properties/markerSizePt/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err42];
}
else {
vErrors.push(err42);
}
errors++;
}
}
if(data7.markerFill !== undefined){
let data14 = data7.markerFill;
if(typeof data14 === "string"){
if(!pattern7.test(data14)){
const err43 = {instancePath:instancePath+"/style/markerFill",schemaPath:"#/properties/style/properties/markerFill/pattern",keyword:"pattern",params:{pattern: "^#[0-9A-Fa-f]{6}$"},message:"must match pattern \""+"^#[0-9A-Fa-f]{6}$"+"\""};
if(vErrors === null){
vErrors = [err43];
}
else {
vErrors.push(err43);
}
errors++;
}
}
else {
const err44 = {instancePath:instancePath+"/style/markerFill",schemaPath:"#/properties/style/properties/markerFill/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err44];
}
else {
vErrors.push(err44);
}
errors++;
}
}
if(data7.markerStroke !== undefined){
let data15 = data7.markerStroke;
if(typeof data15 === "string"){
if(!pattern7.test(data15)){
const err45 = {instancePath:instancePath+"/style/markerStroke",schemaPath:"#/properties/style/properties/markerStroke/pattern",keyword:"pattern",params:{pattern: "^#[0-9A-Fa-f]{6}$"},message:"must match pattern \""+"^#[0-9A-Fa-f]{6}$"+"\""};
if(vErrors === null){
vErrors = [err45];
}
else {
vErrors.push(err45);
}
errors++;
}
}
else {
const err46 = {instancePath:instancePath+"/style/markerStroke",schemaPath:"#/properties/style/properties/markerStroke/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err46];
}
else {
vErrors.push(err46);
}
errors++;
}
}
if(data7.markerVisible !== undefined){
if(typeof data7.markerVisible !== "boolean"){
const err47 = {instancePath:instancePath+"/style/markerVisible",schemaPath:"#/properties/style/properties/markerVisible/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err47];
}
else {
vErrors.push(err47);
}
errors++;
}
}
}
else {
const err48 = {instancePath:instancePath+"/style",schemaPath:"#/properties/style/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err48];
}
else {
vErrors.push(err48);
}
errors++;
}
}
if(data.errorBars !== undefined){
let data17 = data.errorBars;
if(data17 && typeof data17 == "object" && !Array.isArray(data17)){
if(data17.x === undefined){
const err49 = {instancePath:instancePath+"/errorBars",schemaPath:"#/properties/errorBars/required",keyword:"required",params:{missingProperty: "x"},message:"must have required property '"+"x"+"'"};
if(vErrors === null){
vErrors = [err49];
}
else {
vErrors.push(err49);
}
errors++;
}
if(data17.y === undefined){
const err50 = {instancePath:instancePath+"/errorBars",schemaPath:"#/properties/errorBars/required",keyword:"required",params:{missingProperty: "y"},message:"must have required property '"+"y"+"'"};
if(vErrors === null){
vErrors = [err50];
}
else {
vErrors.push(err50);
}
errors++;
}
if(data17.capSizePt === undefined){
const err51 = {instancePath:instancePath+"/errorBars",schemaPath:"#/properties/errorBars/required",keyword:"required",params:{missingProperty: "capSizePt"},message:"must have required property '"+"capSizePt"+"'"};
if(vErrors === null){
vErrors = [err51];
}
else {
vErrors.push(err51);
}
errors++;
}
if(data17.widthPt === undefined){
const err52 = {instancePath:instancePath+"/errorBars",schemaPath:"#/properties/errorBars/required",keyword:"required",params:{missingProperty: "widthPt"},message:"must have required property '"+"widthPt"+"'"};
if(vErrors === null){
vErrors = [err52];
}
else {
vErrors.push(err52);
}
errors++;
}
if(data17.color === undefined){
const err53 = {instancePath:instancePath+"/errorBars",schemaPath:"#/properties/errorBars/required",keyword:"required",params:{missingProperty: "color"},message:"must have required property '"+"color"+"'"};
if(vErrors === null){
vErrors = [err53];
}
else {
vErrors.push(err53);
}
errors++;
}
for(const key2 in data17){
if(!(((((key2 === "x") || (key2 === "y")) || (key2 === "capSizePt")) || (key2 === "widthPt")) || (key2 === "color"))){
const err54 = {instancePath:instancePath+"/errorBars",schemaPath:"#/properties/errorBars/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key2},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err54];
}
else {
vErrors.push(err54);
}
errors++;
}
}
if(data17.x !== undefined){
if(typeof data17.x !== "boolean"){
const err55 = {instancePath:instancePath+"/errorBars/x",schemaPath:"#/properties/errorBars/properties/x/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err55];
}
else {
vErrors.push(err55);
}
errors++;
}
}
if(data17.y !== undefined){
if(typeof data17.y !== "boolean"){
const err56 = {instancePath:instancePath+"/errorBars/y",schemaPath:"#/properties/errorBars/properties/y/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err56];
}
else {
vErrors.push(err56);
}
errors++;
}
}
if(data17.capSizePt !== undefined){
let data20 = data17.capSizePt;
if((typeof data20 == "number") && (isFinite(data20))){
if(data20 > 32 || isNaN(data20)){
const err57 = {instancePath:instancePath+"/errorBars/capSizePt",schemaPath:"#/properties/errorBars/properties/capSizePt/maximum",keyword:"maximum",params:{comparison: "<=", limit: 32},message:"must be <= 32"};
if(vErrors === null){
vErrors = [err57];
}
else {
vErrors.push(err57);
}
errors++;
}
if(data20 < 0 || isNaN(data20)){
const err58 = {instancePath:instancePath+"/errorBars/capSizePt",schemaPath:"#/properties/errorBars/properties/capSizePt/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err58];
}
else {
vErrors.push(err58);
}
errors++;
}
}
else {
const err59 = {instancePath:instancePath+"/errorBars/capSizePt",schemaPath:"#/properties/errorBars/properties/capSizePt/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err59];
}
else {
vErrors.push(err59);
}
errors++;
}
}
if(data17.widthPt !== undefined){
let data21 = data17.widthPt;
if((typeof data21 == "number") && (isFinite(data21))){
if(data21 > 24 || isNaN(data21)){
const err60 = {instancePath:instancePath+"/errorBars/widthPt",schemaPath:"#/properties/errorBars/properties/widthPt/maximum",keyword:"maximum",params:{comparison: "<=", limit: 24},message:"must be <= 24"};
if(vErrors === null){
vErrors = [err60];
}
else {
vErrors.push(err60);
}
errors++;
}
if(data21 <= 0 || isNaN(data21)){
const err61 = {instancePath:instancePath+"/errorBars/widthPt",schemaPath:"#/properties/errorBars/properties/widthPt/exclusiveMinimum",keyword:"exclusiveMinimum",params:{comparison: ">", limit: 0},message:"must be > 0"};
if(vErrors === null){
vErrors = [err61];
}
else {
vErrors.push(err61);
}
errors++;
}
}
else {
const err62 = {instancePath:instancePath+"/errorBars/widthPt",schemaPath:"#/properties/errorBars/properties/widthPt/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err62];
}
else {
vErrors.push(err62);
}
errors++;
}
}
if(data17.color !== undefined){
let data22 = data17.color;
if(typeof data22 === "string"){
if(!pattern7.test(data22)){
const err63 = {instancePath:instancePath+"/errorBars/color",schemaPath:"#/properties/errorBars/properties/color/pattern",keyword:"pattern",params:{pattern: "^#[0-9A-Fa-f]{6}$"},message:"must match pattern \""+"^#[0-9A-Fa-f]{6}$"+"\""};
if(vErrors === null){
vErrors = [err63];
}
else {
vErrors.push(err63);
}
errors++;
}
}
else {
const err64 = {instancePath:instancePath+"/errorBars/color",schemaPath:"#/properties/errorBars/properties/color/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err64];
}
else {
vErrors.push(err64);
}
errors++;
}
}
}
else {
const err65 = {instancePath:instancePath+"/errorBars",schemaPath:"#/properties/errorBars/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err65];
}
else {
vErrors.push(err65);
}
errors++;
}
}
if(data.uncertainty !== undefined){
let data23 = data.uncertainty;
if(data23 && typeof data23 == "object" && !Array.isArray(data23)){
if(data23.x === undefined){
const err66 = {instancePath:instancePath+"/uncertainty",schemaPath:"#/properties/uncertainty/required",keyword:"required",params:{missingProperty: "x"},message:"must have required property '"+"x"+"'"};
if(vErrors === null){
vErrors = [err66];
}
else {
vErrors.push(err66);
}
errors++;
}
if(data23.y === undefined){
const err67 = {instancePath:instancePath+"/uncertainty",schemaPath:"#/properties/uncertainty/required",keyword:"required",params:{missingProperty: "y"},message:"must have required property '"+"y"+"'"};
if(vErrors === null){
vErrors = [err67];
}
else {
vErrors.push(err67);
}
errors++;
}
for(const key3 in data23){
if(!((key3 === "x") || (key3 === "y"))){
const err68 = {instancePath:instancePath+"/uncertainty",schemaPath:"#/properties/uncertainty/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key3},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err68];
}
else {
vErrors.push(err68);
}
errors++;
}
}
if(data23.x !== undefined){
let data24 = data23.x;
const _errs54 = errors;
let valid6 = true;
const _errs55 = errors;
if(data24 && typeof data24 == "object" && !Array.isArray(data24)){
if(data24.mode !== undefined){
if("constant" !== data24.mode){
const err69 = {};
if(vErrors === null){
vErrors = [err69];
}
else {
vErrors.push(err69);
}
errors++;
}
}
}
var _valid0 = _errs55 === errors;
errors = _errs54;
if(vErrors !== null){
if(_errs54){
vErrors.length = _errs54;
}
else {
vErrors = null;
}
}
let ifClause0;
if(_valid0){
const _errs57 = errors;
if(data24 && typeof data24 == "object" && !Array.isArray(data24)){
if(data24.value === undefined){
const err70 = {instancePath:instancePath+"/uncertainty/x",schemaPath:"#/$defs/uncertaintyAxis/allOf/0/then/required",keyword:"required",params:{missingProperty: "value"},message:"must have required property '"+"value"+"'"};
if(vErrors === null){
vErrors = [err70];
}
else {
vErrors.push(err70);
}
errors++;
}
}
var _valid0 = _errs57 === errors;
valid6 = _valid0;
ifClause0 = "then";
}
else {
const _errs58 = errors;
const _errs59 = errors;
const _errs60 = errors;
if(data24 && typeof data24 == "object" && !Array.isArray(data24)){
let missing0;
if((data24.value === undefined) && (missing0 = "value")){
const err71 = {};
if(vErrors === null){
vErrors = [err71];
}
else {
vErrors.push(err71);
}
errors++;
}
}
var valid8 = _errs60 === errors;
if(valid8){
const err72 = {instancePath:instancePath+"/uncertainty/x",schemaPath:"#/$defs/uncertaintyAxis/allOf/0/else/not",keyword:"not",params:{},message:"must NOT be valid"};
if(vErrors === null){
vErrors = [err72];
}
else {
vErrors.push(err72);
}
errors++;
}
else {
errors = _errs59;
if(vErrors !== null){
if(_errs59){
vErrors.length = _errs59;
}
else {
vErrors = null;
}
}
}
var _valid0 = _errs58 === errors;
valid6 = _valid0;
ifClause0 = "else";
}
if(!valid6){
const err73 = {instancePath:instancePath+"/uncertainty/x",schemaPath:"#/$defs/uncertaintyAxis/allOf/0/if",keyword:"if",params:{failingKeyword: ifClause0},message:"must match \""+ifClause0+"\" schema"};
if(vErrors === null){
vErrors = [err73];
}
else {
vErrors.push(err73);
}
errors++;
}
if(data24 && typeof data24 == "object" && !Array.isArray(data24)){
if(data24.mode === undefined){
const err74 = {instancePath:instancePath+"/uncertainty/x",schemaPath:"#/$defs/uncertaintyAxis/required",keyword:"required",params:{missingProperty: "mode"},message:"must have required property '"+"mode"+"'"};
if(vErrors === null){
vErrors = [err74];
}
else {
vErrors.push(err74);
}
errors++;
}
for(const key4 in data24){
if(!((key4 === "mode") || (key4 === "value"))){
const err75 = {instancePath:instancePath+"/uncertainty/x",schemaPath:"#/$defs/uncertaintyAxis/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key4},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err75];
}
else {
vErrors.push(err75);
}
errors++;
}
}
if(data24.mode !== undefined){
let data26 = data24.mode;
if(!(((data26 === "none") || (data26 === "per-point")) || (data26 === "constant"))){
const err76 = {instancePath:instancePath+"/uncertainty/x/mode",schemaPath:"#/$defs/uncertaintyAxis/properties/mode/enum",keyword:"enum",params:{allowedValues: schema74.properties.mode.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err76];
}
else {
vErrors.push(err76);
}
errors++;
}
}
if(data24.value !== undefined){
let data27 = data24.value;
if((typeof data27 == "number") && (isFinite(data27))){
if(data27 < 0 || isNaN(data27)){
const err77 = {instancePath:instancePath+"/uncertainty/x/value",schemaPath:"#/$defs/uncertaintyAxis/properties/value/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err77];
}
else {
vErrors.push(err77);
}
errors++;
}
}
else {
const err78 = {instancePath:instancePath+"/uncertainty/x/value",schemaPath:"#/$defs/uncertaintyAxis/properties/value/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err78];
}
else {
vErrors.push(err78);
}
errors++;
}
}
}
else {
const err79 = {instancePath:instancePath+"/uncertainty/x",schemaPath:"#/$defs/uncertaintyAxis/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err79];
}
else {
vErrors.push(err79);
}
errors++;
}
}
if(data23.y !== undefined){
let data28 = data23.y;
const _errs69 = errors;
let valid12 = true;
const _errs70 = errors;
if(data28 && typeof data28 == "object" && !Array.isArray(data28)){
if(data28.mode !== undefined){
if("constant" !== data28.mode){
const err80 = {};
if(vErrors === null){
vErrors = [err80];
}
else {
vErrors.push(err80);
}
errors++;
}
}
}
var _valid1 = _errs70 === errors;
errors = _errs69;
if(vErrors !== null){
if(_errs69){
vErrors.length = _errs69;
}
else {
vErrors = null;
}
}
let ifClause1;
if(_valid1){
const _errs72 = errors;
if(data28 && typeof data28 == "object" && !Array.isArray(data28)){
if(data28.value === undefined){
const err81 = {instancePath:instancePath+"/uncertainty/y",schemaPath:"#/$defs/uncertaintyAxis/allOf/0/then/required",keyword:"required",params:{missingProperty: "value"},message:"must have required property '"+"value"+"'"};
if(vErrors === null){
vErrors = [err81];
}
else {
vErrors.push(err81);
}
errors++;
}
}
var _valid1 = _errs72 === errors;
valid12 = _valid1;
ifClause1 = "then";
}
else {
const _errs73 = errors;
const _errs74 = errors;
const _errs75 = errors;
if(data28 && typeof data28 == "object" && !Array.isArray(data28)){
let missing1;
if((data28.value === undefined) && (missing1 = "value")){
const err82 = {};
if(vErrors === null){
vErrors = [err82];
}
else {
vErrors.push(err82);
}
errors++;
}
}
var valid14 = _errs75 === errors;
if(valid14){
const err83 = {instancePath:instancePath+"/uncertainty/y",schemaPath:"#/$defs/uncertaintyAxis/allOf/0/else/not",keyword:"not",params:{},message:"must NOT be valid"};
if(vErrors === null){
vErrors = [err83];
}
else {
vErrors.push(err83);
}
errors++;
}
else {
errors = _errs74;
if(vErrors !== null){
if(_errs74){
vErrors.length = _errs74;
}
else {
vErrors = null;
}
}
}
var _valid1 = _errs73 === errors;
valid12 = _valid1;
ifClause1 = "else";
}
if(!valid12){
const err84 = {instancePath:instancePath+"/uncertainty/y",schemaPath:"#/$defs/uncertaintyAxis/allOf/0/if",keyword:"if",params:{failingKeyword: ifClause1},message:"must match \""+ifClause1+"\" schema"};
if(vErrors === null){
vErrors = [err84];
}
else {
vErrors.push(err84);
}
errors++;
}
if(data28 && typeof data28 == "object" && !Array.isArray(data28)){
if(data28.mode === undefined){
const err85 = {instancePath:instancePath+"/uncertainty/y",schemaPath:"#/$defs/uncertaintyAxis/required",keyword:"required",params:{missingProperty: "mode"},message:"must have required property '"+"mode"+"'"};
if(vErrors === null){
vErrors = [err85];
}
else {
vErrors.push(err85);
}
errors++;
}
for(const key5 in data28){
if(!((key5 === "mode") || (key5 === "value"))){
const err86 = {instancePath:instancePath+"/uncertainty/y",schemaPath:"#/$defs/uncertaintyAxis/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key5},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err86];
}
else {
vErrors.push(err86);
}
errors++;
}
}
if(data28.mode !== undefined){
let data30 = data28.mode;
if(!(((data30 === "none") || (data30 === "per-point")) || (data30 === "constant"))){
const err87 = {instancePath:instancePath+"/uncertainty/y/mode",schemaPath:"#/$defs/uncertaintyAxis/properties/mode/enum",keyword:"enum",params:{allowedValues: schema74.properties.mode.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err87];
}
else {
vErrors.push(err87);
}
errors++;
}
}
if(data28.value !== undefined){
let data31 = data28.value;
if((typeof data31 == "number") && (isFinite(data31))){
if(data31 < 0 || isNaN(data31)){
const err88 = {instancePath:instancePath+"/uncertainty/y/value",schemaPath:"#/$defs/uncertaintyAxis/properties/value/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err88];
}
else {
vErrors.push(err88);
}
errors++;
}
}
else {
const err89 = {instancePath:instancePath+"/uncertainty/y/value",schemaPath:"#/$defs/uncertaintyAxis/properties/value/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err89];
}
else {
vErrors.push(err89);
}
errors++;
}
}
}
else {
const err90 = {instancePath:instancePath+"/uncertainty/y",schemaPath:"#/$defs/uncertaintyAxis/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err90];
}
else {
vErrors.push(err90);
}
errors++;
}
}
}
else {
const err91 = {instancePath:instancePath+"/uncertainty",schemaPath:"#/properties/uncertainty/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err91];
}
else {
vErrors.push(err91);
}
errors++;
}
}
}
else {
const err92 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err92];
}
else {
vErrors.push(err92);
}
errors++;
}
validate48.errors = vErrors;
return errors === 0;
}
validate48.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema79 = {"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"type":{"enum":["text","segment","line","arrow","callout","rectangle","range-x","range-y","marker","table"]},"name":{"type":"string","maxLength":300},"anchors":{"type":"array","items":{"$ref":"#/$defs/anchor"},"minItems":1,"maxItems":2},"geometry":{"type":"object","additionalProperties":false,"properties":{"directionX":{"type":"number"},"directionY":{"type":"number"},"widthPx":{"type":"number","minimum":16,"maximum":600000},"heightPx":{"type":"number","minimum":16,"maximum":1500000}},"required":[]},"text":{"type":"array","items":{"$ref":"#/$defs/textPart"},"maxItems":1000},"style":{"type":"object","additionalProperties":false,"properties":{"stroke":{"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"},"strokeWidthPt":{"type":"number","exclusiveMinimum":0,"maximum":24},"dash":{"enum":["solid","dash","dot","dash-dot"]},"strokeOpacity":{"type":"number","minimum":0,"maximum":1},"fill":{"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"},"fillOpacity":{"type":"number","minimum":0,"maximum":1},"fontSizePt":{"type":"number","minimum":6,"maximum":72},"fontFamily":{"const":"Courier New"},"arrowHead":{"enum":["none","start","end","both"]},"markerShape":{"enum":["circle","square","triangle","diamond","cross","plus"]},"markerSizePt":{"type":"number","minimum":0,"maximum":32}},"required":["stroke","strokeWidthPt","dash","strokeOpacity","fill","fillOpacity","fontSizePt","fontFamily","arrowHead","markerShape","markerSizePt"]},"zIndex":{"type":"integer"},"visible":{"type":"boolean"},"locked":{"type":"boolean"},"table":{"$ref":"#/$defs/diagramTable"}},"required":["id","type","name","anchors","geometry","text","style","zIndex","visible","locked"],"allOf":[{"if":{"properties":{"type":{"const":"table"}},"required":["type"]},"then":{"required":["table"]},"else":{"not":{"required":["table"]}}}]};
const schema81 = {"type":"object","additionalProperties":false,"properties":{"text":{"type":"string","maxLength":5000},"baseline":{"enum":["normal","sub","super"]},"bold":{"type":"boolean"},"italic":{"type":"boolean"}},"required":["text","baseline","bold","italic"]};
const schema82 = {"type":"object","additionalProperties":false,"properties":{"version":{"const":1},"rows":{"type":"array","items":{"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"size":{"type":"number","minimum":16,"maximum":30000}},"required":["id","size"]},"minItems":1,"maxItems":50},"columns":{"type":"array","items":{"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"size":{"type":"number","minimum":16,"maximum":30000}},"required":["id","size"]},"minItems":1,"maxItems":20},"cells":{"type":"array","items":{"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"text":{"type":"array","items":{"$ref":"#/$defs/textPart"},"minItems":0,"maxItems":1000},"align":{"enum":["left","center","right"]},"vertical":{"enum":["top","middle","bottom"]},"fill":{"anyOf":[{"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"},{"type":"null"}]},"color":{"anyOf":[{"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"},{"type":"null"}]},"fontSizePt":{"anyOf":[{"type":"number","minimum":6,"maximum":72},{"type":"null"}]},"numberFormat":{"type":"object","additionalProperties":false,"properties":{"mode":{"enum":["original","fixed","scientific"]},"digits":{"type":"integer","minimum":0,"maximum":15}},"required":["mode","digits"]}},"required":["id","text","align","vertical","fill","color","fontSizePt"]},"minItems":1,"maxItems":1000},"merges":{"type":"array","items":{"type":"object","additionalProperties":false,"properties":{"row":{"type":"integer","minimum":0,"maximum":49},"column":{"type":"integer","minimum":0,"maximum":19},"rows":{"type":"integer","minimum":1,"maximum":50},"columns":{"type":"integer","minimum":1,"maximum":20}},"required":["row","column","rows","columns"]},"minItems":0,"maxItems":500},"padding":{"type":"number","minimum":0,"maximum":50},"header":{"type":"boolean"},"fill":{"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"},"headerFill":{"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"},"grid":{"type":"object","additionalProperties":false,"properties":{"visible":{"type":"boolean"},"color":{"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"},"widthPt":{"type":"number","exclusiveMinimum":0,"maximum":24},"dash":{"enum":["solid","dash","dot","dash-dot"]},"horizontal":{"type":"boolean"},"vertical":{"type":"boolean"}},"required":["visible","color","widthPt","dash","horizontal","vertical"]},"fillOpacity":{"type":"number","minimum":0,"maximum":1}},"required":["version","rows","columns","cells","merges","padding","header","fill","headerFill","grid","fillOpacity"]};

function validate51(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate51.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.version === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "version"},message:"must have required property '"+"version"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.rows === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "rows"},message:"must have required property '"+"rows"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.columns === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "columns"},message:"must have required property '"+"columns"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.cells === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "cells"},message:"must have required property '"+"cells"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.merges === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "merges"},message:"must have required property '"+"merges"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data.padding === undefined){
const err5 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "padding"},message:"must have required property '"+"padding"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data.header === undefined){
const err6 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "header"},message:"must have required property '"+"header"+"'"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
if(data.fill === undefined){
const err7 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "fill"},message:"must have required property '"+"fill"+"'"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
if(data.headerFill === undefined){
const err8 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "headerFill"},message:"must have required property '"+"headerFill"+"'"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
if(data.grid === undefined){
const err9 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "grid"},message:"must have required property '"+"grid"+"'"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
if(data.fillOpacity === undefined){
const err10 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "fillOpacity"},message:"must have required property '"+"fillOpacity"+"'"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
for(const key0 in data){
if(!(func1.call(schema82.properties, key0))){
const err11 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
if(data.version !== undefined){
if(1 !== data.version){
const err12 = {instancePath:instancePath+"/version",schemaPath:"#/properties/version/const",keyword:"const",params:{allowedValue: 1},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
if(data.rows !== undefined){
let data1 = data.rows;
if(Array.isArray(data1)){
if(data1.length > 50){
const err13 = {instancePath:instancePath+"/rows",schemaPath:"#/properties/rows/maxItems",keyword:"maxItems",params:{limit: 50},message:"must NOT have more than 50 items"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
if(data1.length < 1){
const err14 = {instancePath:instancePath+"/rows",schemaPath:"#/properties/rows/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
const len0 = data1.length;
for(let i0=0; i0<len0; i0++){
let data2 = data1[i0];
if(data2 && typeof data2 == "object" && !Array.isArray(data2)){
if(data2.id === undefined){
const err15 = {instancePath:instancePath+"/rows/" + i0,schemaPath:"#/properties/rows/items/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
if(data2.size === undefined){
const err16 = {instancePath:instancePath+"/rows/" + i0,schemaPath:"#/properties/rows/items/required",keyword:"required",params:{missingProperty: "size"},message:"must have required property '"+"size"+"'"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
for(const key1 in data2){
if(!((key1 === "id") || (key1 === "size"))){
const err17 = {instancePath:instancePath+"/rows/" + i0,schemaPath:"#/properties/rows/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
}
if(data2.id !== undefined){
let data3 = data2.id;
if(typeof data3 === "string"){
if(!pattern6.test(data3)){
const err18 = {instancePath:instancePath+"/rows/" + i0+"/id",schemaPath:"#/properties/rows/items/properties/id/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"+"\""};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
}
else {
const err19 = {instancePath:instancePath+"/rows/" + i0+"/id",schemaPath:"#/properties/rows/items/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
}
if(data2.size !== undefined){
let data4 = data2.size;
if((typeof data4 == "number") && (isFinite(data4))){
if(data4 > 30000 || isNaN(data4)){
const err20 = {instancePath:instancePath+"/rows/" + i0+"/size",schemaPath:"#/properties/rows/items/properties/size/maximum",keyword:"maximum",params:{comparison: "<=", limit: 30000},message:"must be <= 30000"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
if(data4 < 16 || isNaN(data4)){
const err21 = {instancePath:instancePath+"/rows/" + i0+"/size",schemaPath:"#/properties/rows/items/properties/size/minimum",keyword:"minimum",params:{comparison: ">=", limit: 16},message:"must be >= 16"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
}
else {
const err22 = {instancePath:instancePath+"/rows/" + i0+"/size",schemaPath:"#/properties/rows/items/properties/size/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
}
}
else {
const err23 = {instancePath:instancePath+"/rows/" + i0,schemaPath:"#/properties/rows/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
}
}
else {
const err24 = {instancePath:instancePath+"/rows",schemaPath:"#/properties/rows/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
}
if(data.columns !== undefined){
let data5 = data.columns;
if(Array.isArray(data5)){
if(data5.length > 20){
const err25 = {instancePath:instancePath+"/columns",schemaPath:"#/properties/columns/maxItems",keyword:"maxItems",params:{limit: 20},message:"must NOT have more than 20 items"};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
if(data5.length < 1){
const err26 = {instancePath:instancePath+"/columns",schemaPath:"#/properties/columns/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
const len1 = data5.length;
for(let i1=0; i1<len1; i1++){
let data6 = data5[i1];
if(data6 && typeof data6 == "object" && !Array.isArray(data6)){
if(data6.id === undefined){
const err27 = {instancePath:instancePath+"/columns/" + i1,schemaPath:"#/properties/columns/items/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
if(data6.size === undefined){
const err28 = {instancePath:instancePath+"/columns/" + i1,schemaPath:"#/properties/columns/items/required",keyword:"required",params:{missingProperty: "size"},message:"must have required property '"+"size"+"'"};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
for(const key2 in data6){
if(!((key2 === "id") || (key2 === "size"))){
const err29 = {instancePath:instancePath+"/columns/" + i1,schemaPath:"#/properties/columns/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key2},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
}
}
if(data6.id !== undefined){
let data7 = data6.id;
if(typeof data7 === "string"){
if(!pattern6.test(data7)){
const err30 = {instancePath:instancePath+"/columns/" + i1+"/id",schemaPath:"#/properties/columns/items/properties/id/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"+"\""};
if(vErrors === null){
vErrors = [err30];
}
else {
vErrors.push(err30);
}
errors++;
}
}
else {
const err31 = {instancePath:instancePath+"/columns/" + i1+"/id",schemaPath:"#/properties/columns/items/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err31];
}
else {
vErrors.push(err31);
}
errors++;
}
}
if(data6.size !== undefined){
let data8 = data6.size;
if((typeof data8 == "number") && (isFinite(data8))){
if(data8 > 30000 || isNaN(data8)){
const err32 = {instancePath:instancePath+"/columns/" + i1+"/size",schemaPath:"#/properties/columns/items/properties/size/maximum",keyword:"maximum",params:{comparison: "<=", limit: 30000},message:"must be <= 30000"};
if(vErrors === null){
vErrors = [err32];
}
else {
vErrors.push(err32);
}
errors++;
}
if(data8 < 16 || isNaN(data8)){
const err33 = {instancePath:instancePath+"/columns/" + i1+"/size",schemaPath:"#/properties/columns/items/properties/size/minimum",keyword:"minimum",params:{comparison: ">=", limit: 16},message:"must be >= 16"};
if(vErrors === null){
vErrors = [err33];
}
else {
vErrors.push(err33);
}
errors++;
}
}
else {
const err34 = {instancePath:instancePath+"/columns/" + i1+"/size",schemaPath:"#/properties/columns/items/properties/size/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err34];
}
else {
vErrors.push(err34);
}
errors++;
}
}
}
else {
const err35 = {instancePath:instancePath+"/columns/" + i1,schemaPath:"#/properties/columns/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err35];
}
else {
vErrors.push(err35);
}
errors++;
}
}
}
else {
const err36 = {instancePath:instancePath+"/columns",schemaPath:"#/properties/columns/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err36];
}
else {
vErrors.push(err36);
}
errors++;
}
}
if(data.cells !== undefined){
let data9 = data.cells;
if(Array.isArray(data9)){
if(data9.length > 1000){
const err37 = {instancePath:instancePath+"/cells",schemaPath:"#/properties/cells/maxItems",keyword:"maxItems",params:{limit: 1000},message:"must NOT have more than 1000 items"};
if(vErrors === null){
vErrors = [err37];
}
else {
vErrors.push(err37);
}
errors++;
}
if(data9.length < 1){
const err38 = {instancePath:instancePath+"/cells",schemaPath:"#/properties/cells/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err38];
}
else {
vErrors.push(err38);
}
errors++;
}
const len2 = data9.length;
for(let i2=0; i2<len2; i2++){
let data10 = data9[i2];
if(data10 && typeof data10 == "object" && !Array.isArray(data10)){
if(data10.id === undefined){
const err39 = {instancePath:instancePath+"/cells/" + i2,schemaPath:"#/properties/cells/items/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err39];
}
else {
vErrors.push(err39);
}
errors++;
}
if(data10.text === undefined){
const err40 = {instancePath:instancePath+"/cells/" + i2,schemaPath:"#/properties/cells/items/required",keyword:"required",params:{missingProperty: "text"},message:"must have required property '"+"text"+"'"};
if(vErrors === null){
vErrors = [err40];
}
else {
vErrors.push(err40);
}
errors++;
}
if(data10.align === undefined){
const err41 = {instancePath:instancePath+"/cells/" + i2,schemaPath:"#/properties/cells/items/required",keyword:"required",params:{missingProperty: "align"},message:"must have required property '"+"align"+"'"};
if(vErrors === null){
vErrors = [err41];
}
else {
vErrors.push(err41);
}
errors++;
}
if(data10.vertical === undefined){
const err42 = {instancePath:instancePath+"/cells/" + i2,schemaPath:"#/properties/cells/items/required",keyword:"required",params:{missingProperty: "vertical"},message:"must have required property '"+"vertical"+"'"};
if(vErrors === null){
vErrors = [err42];
}
else {
vErrors.push(err42);
}
errors++;
}
if(data10.fill === undefined){
const err43 = {instancePath:instancePath+"/cells/" + i2,schemaPath:"#/properties/cells/items/required",keyword:"required",params:{missingProperty: "fill"},message:"must have required property '"+"fill"+"'"};
if(vErrors === null){
vErrors = [err43];
}
else {
vErrors.push(err43);
}
errors++;
}
if(data10.color === undefined){
const err44 = {instancePath:instancePath+"/cells/" + i2,schemaPath:"#/properties/cells/items/required",keyword:"required",params:{missingProperty: "color"},message:"must have required property '"+"color"+"'"};
if(vErrors === null){
vErrors = [err44];
}
else {
vErrors.push(err44);
}
errors++;
}
if(data10.fontSizePt === undefined){
const err45 = {instancePath:instancePath+"/cells/" + i2,schemaPath:"#/properties/cells/items/required",keyword:"required",params:{missingProperty: "fontSizePt"},message:"must have required property '"+"fontSizePt"+"'"};
if(vErrors === null){
vErrors = [err45];
}
else {
vErrors.push(err45);
}
errors++;
}
for(const key3 in data10){
if(!((((((((key3 === "id") || (key3 === "text")) || (key3 === "align")) || (key3 === "vertical")) || (key3 === "fill")) || (key3 === "color")) || (key3 === "fontSizePt")) || (key3 === "numberFormat"))){
const err46 = {instancePath:instancePath+"/cells/" + i2,schemaPath:"#/properties/cells/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key3},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err46];
}
else {
vErrors.push(err46);
}
errors++;
}
}
if(data10.id !== undefined){
let data11 = data10.id;
if(typeof data11 === "string"){
if(!pattern6.test(data11)){
const err47 = {instancePath:instancePath+"/cells/" + i2+"/id",schemaPath:"#/properties/cells/items/properties/id/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"+"\""};
if(vErrors === null){
vErrors = [err47];
}
else {
vErrors.push(err47);
}
errors++;
}
}
else {
const err48 = {instancePath:instancePath+"/cells/" + i2+"/id",schemaPath:"#/properties/cells/items/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err48];
}
else {
vErrors.push(err48);
}
errors++;
}
}
if(data10.text !== undefined){
let data12 = data10.text;
if(Array.isArray(data12)){
if(data12.length > 1000){
const err49 = {instancePath:instancePath+"/cells/" + i2+"/text",schemaPath:"#/properties/cells/items/properties/text/maxItems",keyword:"maxItems",params:{limit: 1000},message:"must NOT have more than 1000 items"};
if(vErrors === null){
vErrors = [err49];
}
else {
vErrors.push(err49);
}
errors++;
}
if(data12.length < 0){
const err50 = {instancePath:instancePath+"/cells/" + i2+"/text",schemaPath:"#/properties/cells/items/properties/text/minItems",keyword:"minItems",params:{limit: 0},message:"must NOT have fewer than 0 items"};
if(vErrors === null){
vErrors = [err50];
}
else {
vErrors.push(err50);
}
errors++;
}
const len3 = data12.length;
for(let i3=0; i3<len3; i3++){
let data13 = data12[i3];
if(data13 && typeof data13 == "object" && !Array.isArray(data13)){
if(data13.text === undefined){
const err51 = {instancePath:instancePath+"/cells/" + i2+"/text/" + i3,schemaPath:"#/$defs/textPart/required",keyword:"required",params:{missingProperty: "text"},message:"must have required property '"+"text"+"'"};
if(vErrors === null){
vErrors = [err51];
}
else {
vErrors.push(err51);
}
errors++;
}
if(data13.baseline === undefined){
const err52 = {instancePath:instancePath+"/cells/" + i2+"/text/" + i3,schemaPath:"#/$defs/textPart/required",keyword:"required",params:{missingProperty: "baseline"},message:"must have required property '"+"baseline"+"'"};
if(vErrors === null){
vErrors = [err52];
}
else {
vErrors.push(err52);
}
errors++;
}
if(data13.bold === undefined){
const err53 = {instancePath:instancePath+"/cells/" + i2+"/text/" + i3,schemaPath:"#/$defs/textPart/required",keyword:"required",params:{missingProperty: "bold"},message:"must have required property '"+"bold"+"'"};
if(vErrors === null){
vErrors = [err53];
}
else {
vErrors.push(err53);
}
errors++;
}
if(data13.italic === undefined){
const err54 = {instancePath:instancePath+"/cells/" + i2+"/text/" + i3,schemaPath:"#/$defs/textPart/required",keyword:"required",params:{missingProperty: "italic"},message:"must have required property '"+"italic"+"'"};
if(vErrors === null){
vErrors = [err54];
}
else {
vErrors.push(err54);
}
errors++;
}
for(const key4 in data13){
if(!((((key4 === "text") || (key4 === "baseline")) || (key4 === "bold")) || (key4 === "italic"))){
const err55 = {instancePath:instancePath+"/cells/" + i2+"/text/" + i3,schemaPath:"#/$defs/textPart/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key4},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err55];
}
else {
vErrors.push(err55);
}
errors++;
}
}
if(data13.text !== undefined){
let data14 = data13.text;
if(typeof data14 === "string"){
if(func2(data14) > 5000){
const err56 = {instancePath:instancePath+"/cells/" + i2+"/text/" + i3+"/text",schemaPath:"#/$defs/textPart/properties/text/maxLength",keyword:"maxLength",params:{limit: 5000},message:"must NOT have more than 5000 characters"};
if(vErrors === null){
vErrors = [err56];
}
else {
vErrors.push(err56);
}
errors++;
}
}
else {
const err57 = {instancePath:instancePath+"/cells/" + i2+"/text/" + i3+"/text",schemaPath:"#/$defs/textPart/properties/text/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err57];
}
else {
vErrors.push(err57);
}
errors++;
}
}
if(data13.baseline !== undefined){
let data15 = data13.baseline;
if(!(((data15 === "normal") || (data15 === "sub")) || (data15 === "super"))){
const err58 = {instancePath:instancePath+"/cells/" + i2+"/text/" + i3+"/baseline",schemaPath:"#/$defs/textPart/properties/baseline/enum",keyword:"enum",params:{allowedValues: schema81.properties.baseline.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err58];
}
else {
vErrors.push(err58);
}
errors++;
}
}
if(data13.bold !== undefined){
if(typeof data13.bold !== "boolean"){
const err59 = {instancePath:instancePath+"/cells/" + i2+"/text/" + i3+"/bold",schemaPath:"#/$defs/textPart/properties/bold/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err59];
}
else {
vErrors.push(err59);
}
errors++;
}
}
if(data13.italic !== undefined){
if(typeof data13.italic !== "boolean"){
const err60 = {instancePath:instancePath+"/cells/" + i2+"/text/" + i3+"/italic",schemaPath:"#/$defs/textPart/properties/italic/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err60];
}
else {
vErrors.push(err60);
}
errors++;
}
}
}
else {
const err61 = {instancePath:instancePath+"/cells/" + i2+"/text/" + i3,schemaPath:"#/$defs/textPart/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err61];
}
else {
vErrors.push(err61);
}
errors++;
}
}
}
else {
const err62 = {instancePath:instancePath+"/cells/" + i2+"/text",schemaPath:"#/properties/cells/items/properties/text/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err62];
}
else {
vErrors.push(err62);
}
errors++;
}
}
if(data10.align !== undefined){
let data18 = data10.align;
if(!(((data18 === "left") || (data18 === "center")) || (data18 === "right"))){
const err63 = {instancePath:instancePath+"/cells/" + i2+"/align",schemaPath:"#/properties/cells/items/properties/align/enum",keyword:"enum",params:{allowedValues: schema82.properties.cells.items.properties.align.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err63];
}
else {
vErrors.push(err63);
}
errors++;
}
}
if(data10.vertical !== undefined){
let data19 = data10.vertical;
if(!(((data19 === "top") || (data19 === "middle")) || (data19 === "bottom"))){
const err64 = {instancePath:instancePath+"/cells/" + i2+"/vertical",schemaPath:"#/properties/cells/items/properties/vertical/enum",keyword:"enum",params:{allowedValues: schema82.properties.cells.items.properties.vertical.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err64];
}
else {
vErrors.push(err64);
}
errors++;
}
}
if(data10.fill !== undefined){
let data20 = data10.fill;
const _errs44 = errors;
let valid14 = false;
const _errs45 = errors;
if(typeof data20 === "string"){
if(!pattern7.test(data20)){
const err65 = {instancePath:instancePath+"/cells/" + i2+"/fill",schemaPath:"#/properties/cells/items/properties/fill/anyOf/0/pattern",keyword:"pattern",params:{pattern: "^#[0-9A-Fa-f]{6}$"},message:"must match pattern \""+"^#[0-9A-Fa-f]{6}$"+"\""};
if(vErrors === null){
vErrors = [err65];
}
else {
vErrors.push(err65);
}
errors++;
}
}
else {
const err66 = {instancePath:instancePath+"/cells/" + i2+"/fill",schemaPath:"#/properties/cells/items/properties/fill/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err66];
}
else {
vErrors.push(err66);
}
errors++;
}
var _valid0 = _errs45 === errors;
valid14 = valid14 || _valid0;
const _errs47 = errors;
if(data20 !== null){
const err67 = {instancePath:instancePath+"/cells/" + i2+"/fill",schemaPath:"#/properties/cells/items/properties/fill/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err67];
}
else {
vErrors.push(err67);
}
errors++;
}
var _valid0 = _errs47 === errors;
valid14 = valid14 || _valid0;
if(!valid14){
const err68 = {instancePath:instancePath+"/cells/" + i2+"/fill",schemaPath:"#/properties/cells/items/properties/fill/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err68];
}
else {
vErrors.push(err68);
}
errors++;
}
else {
errors = _errs44;
if(vErrors !== null){
if(_errs44){
vErrors.length = _errs44;
}
else {
vErrors = null;
}
}
}
}
if(data10.color !== undefined){
let data21 = data10.color;
const _errs50 = errors;
let valid15 = false;
const _errs51 = errors;
if(typeof data21 === "string"){
if(!pattern7.test(data21)){
const err69 = {instancePath:instancePath+"/cells/" + i2+"/color",schemaPath:"#/properties/cells/items/properties/color/anyOf/0/pattern",keyword:"pattern",params:{pattern: "^#[0-9A-Fa-f]{6}$"},message:"must match pattern \""+"^#[0-9A-Fa-f]{6}$"+"\""};
if(vErrors === null){
vErrors = [err69];
}
else {
vErrors.push(err69);
}
errors++;
}
}
else {
const err70 = {instancePath:instancePath+"/cells/" + i2+"/color",schemaPath:"#/properties/cells/items/properties/color/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err70];
}
else {
vErrors.push(err70);
}
errors++;
}
var _valid1 = _errs51 === errors;
valid15 = valid15 || _valid1;
const _errs53 = errors;
if(data21 !== null){
const err71 = {instancePath:instancePath+"/cells/" + i2+"/color",schemaPath:"#/properties/cells/items/properties/color/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err71];
}
else {
vErrors.push(err71);
}
errors++;
}
var _valid1 = _errs53 === errors;
valid15 = valid15 || _valid1;
if(!valid15){
const err72 = {instancePath:instancePath+"/cells/" + i2+"/color",schemaPath:"#/properties/cells/items/properties/color/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err72];
}
else {
vErrors.push(err72);
}
errors++;
}
else {
errors = _errs50;
if(vErrors !== null){
if(_errs50){
vErrors.length = _errs50;
}
else {
vErrors = null;
}
}
}
}
if(data10.fontSizePt !== undefined){
let data22 = data10.fontSizePt;
const _errs56 = errors;
let valid16 = false;
const _errs57 = errors;
if((typeof data22 == "number") && (isFinite(data22))){
if(data22 > 72 || isNaN(data22)){
const err73 = {instancePath:instancePath+"/cells/" + i2+"/fontSizePt",schemaPath:"#/properties/cells/items/properties/fontSizePt/anyOf/0/maximum",keyword:"maximum",params:{comparison: "<=", limit: 72},message:"must be <= 72"};
if(vErrors === null){
vErrors = [err73];
}
else {
vErrors.push(err73);
}
errors++;
}
if(data22 < 6 || isNaN(data22)){
const err74 = {instancePath:instancePath+"/cells/" + i2+"/fontSizePt",schemaPath:"#/properties/cells/items/properties/fontSizePt/anyOf/0/minimum",keyword:"minimum",params:{comparison: ">=", limit: 6},message:"must be >= 6"};
if(vErrors === null){
vErrors = [err74];
}
else {
vErrors.push(err74);
}
errors++;
}
}
else {
const err75 = {instancePath:instancePath+"/cells/" + i2+"/fontSizePt",schemaPath:"#/properties/cells/items/properties/fontSizePt/anyOf/0/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err75];
}
else {
vErrors.push(err75);
}
errors++;
}
var _valid2 = _errs57 === errors;
valid16 = valid16 || _valid2;
const _errs59 = errors;
if(data22 !== null){
const err76 = {instancePath:instancePath+"/cells/" + i2+"/fontSizePt",schemaPath:"#/properties/cells/items/properties/fontSizePt/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err76];
}
else {
vErrors.push(err76);
}
errors++;
}
var _valid2 = _errs59 === errors;
valid16 = valid16 || _valid2;
if(!valid16){
const err77 = {instancePath:instancePath+"/cells/" + i2+"/fontSizePt",schemaPath:"#/properties/cells/items/properties/fontSizePt/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err77];
}
else {
vErrors.push(err77);
}
errors++;
}
else {
errors = _errs56;
if(vErrors !== null){
if(_errs56){
vErrors.length = _errs56;
}
else {
vErrors = null;
}
}
}
}
if(data10.numberFormat !== undefined){
let data23 = data10.numberFormat;
if(data23 && typeof data23 == "object" && !Array.isArray(data23)){
if(data23.mode === undefined){
const err78 = {instancePath:instancePath+"/cells/" + i2+"/numberFormat",schemaPath:"#/properties/cells/items/properties/numberFormat/required",keyword:"required",params:{missingProperty: "mode"},message:"must have required property '"+"mode"+"'"};
if(vErrors === null){
vErrors = [err78];
}
else {
vErrors.push(err78);
}
errors++;
}
if(data23.digits === undefined){
const err79 = {instancePath:instancePath+"/cells/" + i2+"/numberFormat",schemaPath:"#/properties/cells/items/properties/numberFormat/required",keyword:"required",params:{missingProperty: "digits"},message:"must have required property '"+"digits"+"'"};
if(vErrors === null){
vErrors = [err79];
}
else {
vErrors.push(err79);
}
errors++;
}
for(const key5 in data23){
if(!((key5 === "mode") || (key5 === "digits"))){
const err80 = {instancePath:instancePath+"/cells/" + i2+"/numberFormat",schemaPath:"#/properties/cells/items/properties/numberFormat/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key5},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err80];
}
else {
vErrors.push(err80);
}
errors++;
}
}
if(data23.mode !== undefined){
let data24 = data23.mode;
if(!(((data24 === "original") || (data24 === "fixed")) || (data24 === "scientific"))){
const err81 = {instancePath:instancePath+"/cells/" + i2+"/numberFormat/mode",schemaPath:"#/properties/cells/items/properties/numberFormat/properties/mode/enum",keyword:"enum",params:{allowedValues: schema82.properties.cells.items.properties.numberFormat.properties.mode.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err81];
}
else {
vErrors.push(err81);
}
errors++;
}
}
if(data23.digits !== undefined){
let data25 = data23.digits;
if(!(((typeof data25 == "number") && (!(data25 % 1) && !isNaN(data25))) && (isFinite(data25)))){
const err82 = {instancePath:instancePath+"/cells/" + i2+"/numberFormat/digits",schemaPath:"#/properties/cells/items/properties/numberFormat/properties/digits/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err82];
}
else {
vErrors.push(err82);
}
errors++;
}
if((typeof data25 == "number") && (isFinite(data25))){
if(data25 > 15 || isNaN(data25)){
const err83 = {instancePath:instancePath+"/cells/" + i2+"/numberFormat/digits",schemaPath:"#/properties/cells/items/properties/numberFormat/properties/digits/maximum",keyword:"maximum",params:{comparison: "<=", limit: 15},message:"must be <= 15"};
if(vErrors === null){
vErrors = [err83];
}
else {
vErrors.push(err83);
}
errors++;
}
if(data25 < 0 || isNaN(data25)){
const err84 = {instancePath:instancePath+"/cells/" + i2+"/numberFormat/digits",schemaPath:"#/properties/cells/items/properties/numberFormat/properties/digits/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err84];
}
else {
vErrors.push(err84);
}
errors++;
}
}
}
}
else {
const err85 = {instancePath:instancePath+"/cells/" + i2+"/numberFormat",schemaPath:"#/properties/cells/items/properties/numberFormat/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err85];
}
else {
vErrors.push(err85);
}
errors++;
}
}
}
else {
const err86 = {instancePath:instancePath+"/cells/" + i2,schemaPath:"#/properties/cells/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err86];
}
else {
vErrors.push(err86);
}
errors++;
}
}
}
else {
const err87 = {instancePath:instancePath+"/cells",schemaPath:"#/properties/cells/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err87];
}
else {
vErrors.push(err87);
}
errors++;
}
}
if(data.merges !== undefined){
let data26 = data.merges;
if(Array.isArray(data26)){
if(data26.length > 500){
const err88 = {instancePath:instancePath+"/merges",schemaPath:"#/properties/merges/maxItems",keyword:"maxItems",params:{limit: 500},message:"must NOT have more than 500 items"};
if(vErrors === null){
vErrors = [err88];
}
else {
vErrors.push(err88);
}
errors++;
}
if(data26.length < 0){
const err89 = {instancePath:instancePath+"/merges",schemaPath:"#/properties/merges/minItems",keyword:"minItems",params:{limit: 0},message:"must NOT have fewer than 0 items"};
if(vErrors === null){
vErrors = [err89];
}
else {
vErrors.push(err89);
}
errors++;
}
const len4 = data26.length;
for(let i4=0; i4<len4; i4++){
let data27 = data26[i4];
if(data27 && typeof data27 == "object" && !Array.isArray(data27)){
if(data27.row === undefined){
const err90 = {instancePath:instancePath+"/merges/" + i4,schemaPath:"#/properties/merges/items/required",keyword:"required",params:{missingProperty: "row"},message:"must have required property '"+"row"+"'"};
if(vErrors === null){
vErrors = [err90];
}
else {
vErrors.push(err90);
}
errors++;
}
if(data27.column === undefined){
const err91 = {instancePath:instancePath+"/merges/" + i4,schemaPath:"#/properties/merges/items/required",keyword:"required",params:{missingProperty: "column"},message:"must have required property '"+"column"+"'"};
if(vErrors === null){
vErrors = [err91];
}
else {
vErrors.push(err91);
}
errors++;
}
if(data27.rows === undefined){
const err92 = {instancePath:instancePath+"/merges/" + i4,schemaPath:"#/properties/merges/items/required",keyword:"required",params:{missingProperty: "rows"},message:"must have required property '"+"rows"+"'"};
if(vErrors === null){
vErrors = [err92];
}
else {
vErrors.push(err92);
}
errors++;
}
if(data27.columns === undefined){
const err93 = {instancePath:instancePath+"/merges/" + i4,schemaPath:"#/properties/merges/items/required",keyword:"required",params:{missingProperty: "columns"},message:"must have required property '"+"columns"+"'"};
if(vErrors === null){
vErrors = [err93];
}
else {
vErrors.push(err93);
}
errors++;
}
for(const key6 in data27){
if(!((((key6 === "row") || (key6 === "column")) || (key6 === "rows")) || (key6 === "columns"))){
const err94 = {instancePath:instancePath+"/merges/" + i4,schemaPath:"#/properties/merges/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key6},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err94];
}
else {
vErrors.push(err94);
}
errors++;
}
}
if(data27.row !== undefined){
let data28 = data27.row;
if(!(((typeof data28 == "number") && (!(data28 % 1) && !isNaN(data28))) && (isFinite(data28)))){
const err95 = {instancePath:instancePath+"/merges/" + i4+"/row",schemaPath:"#/properties/merges/items/properties/row/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err95];
}
else {
vErrors.push(err95);
}
errors++;
}
if((typeof data28 == "number") && (isFinite(data28))){
if(data28 > 49 || isNaN(data28)){
const err96 = {instancePath:instancePath+"/merges/" + i4+"/row",schemaPath:"#/properties/merges/items/properties/row/maximum",keyword:"maximum",params:{comparison: "<=", limit: 49},message:"must be <= 49"};
if(vErrors === null){
vErrors = [err96];
}
else {
vErrors.push(err96);
}
errors++;
}
if(data28 < 0 || isNaN(data28)){
const err97 = {instancePath:instancePath+"/merges/" + i4+"/row",schemaPath:"#/properties/merges/items/properties/row/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err97];
}
else {
vErrors.push(err97);
}
errors++;
}
}
}
if(data27.column !== undefined){
let data29 = data27.column;
if(!(((typeof data29 == "number") && (!(data29 % 1) && !isNaN(data29))) && (isFinite(data29)))){
const err98 = {instancePath:instancePath+"/merges/" + i4+"/column",schemaPath:"#/properties/merges/items/properties/column/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err98];
}
else {
vErrors.push(err98);
}
errors++;
}
if((typeof data29 == "number") && (isFinite(data29))){
if(data29 > 19 || isNaN(data29)){
const err99 = {instancePath:instancePath+"/merges/" + i4+"/column",schemaPath:"#/properties/merges/items/properties/column/maximum",keyword:"maximum",params:{comparison: "<=", limit: 19},message:"must be <= 19"};
if(vErrors === null){
vErrors = [err99];
}
else {
vErrors.push(err99);
}
errors++;
}
if(data29 < 0 || isNaN(data29)){
const err100 = {instancePath:instancePath+"/merges/" + i4+"/column",schemaPath:"#/properties/merges/items/properties/column/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err100];
}
else {
vErrors.push(err100);
}
errors++;
}
}
}
if(data27.rows !== undefined){
let data30 = data27.rows;
if(!(((typeof data30 == "number") && (!(data30 % 1) && !isNaN(data30))) && (isFinite(data30)))){
const err101 = {instancePath:instancePath+"/merges/" + i4+"/rows",schemaPath:"#/properties/merges/items/properties/rows/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err101];
}
else {
vErrors.push(err101);
}
errors++;
}
if((typeof data30 == "number") && (isFinite(data30))){
if(data30 > 50 || isNaN(data30)){
const err102 = {instancePath:instancePath+"/merges/" + i4+"/rows",schemaPath:"#/properties/merges/items/properties/rows/maximum",keyword:"maximum",params:{comparison: "<=", limit: 50},message:"must be <= 50"};
if(vErrors === null){
vErrors = [err102];
}
else {
vErrors.push(err102);
}
errors++;
}
if(data30 < 1 || isNaN(data30)){
const err103 = {instancePath:instancePath+"/merges/" + i4+"/rows",schemaPath:"#/properties/merges/items/properties/rows/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
if(vErrors === null){
vErrors = [err103];
}
else {
vErrors.push(err103);
}
errors++;
}
}
}
if(data27.columns !== undefined){
let data31 = data27.columns;
if(!(((typeof data31 == "number") && (!(data31 % 1) && !isNaN(data31))) && (isFinite(data31)))){
const err104 = {instancePath:instancePath+"/merges/" + i4+"/columns",schemaPath:"#/properties/merges/items/properties/columns/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err104];
}
else {
vErrors.push(err104);
}
errors++;
}
if((typeof data31 == "number") && (isFinite(data31))){
if(data31 > 20 || isNaN(data31)){
const err105 = {instancePath:instancePath+"/merges/" + i4+"/columns",schemaPath:"#/properties/merges/items/properties/columns/maximum",keyword:"maximum",params:{comparison: "<=", limit: 20},message:"must be <= 20"};
if(vErrors === null){
vErrors = [err105];
}
else {
vErrors.push(err105);
}
errors++;
}
if(data31 < 1 || isNaN(data31)){
const err106 = {instancePath:instancePath+"/merges/" + i4+"/columns",schemaPath:"#/properties/merges/items/properties/columns/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
if(vErrors === null){
vErrors = [err106];
}
else {
vErrors.push(err106);
}
errors++;
}
}
}
}
else {
const err107 = {instancePath:instancePath+"/merges/" + i4,schemaPath:"#/properties/merges/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err107];
}
else {
vErrors.push(err107);
}
errors++;
}
}
}
else {
const err108 = {instancePath:instancePath+"/merges",schemaPath:"#/properties/merges/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err108];
}
else {
vErrors.push(err108);
}
errors++;
}
}
if(data.padding !== undefined){
let data32 = data.padding;
if((typeof data32 == "number") && (isFinite(data32))){
if(data32 > 50 || isNaN(data32)){
const err109 = {instancePath:instancePath+"/padding",schemaPath:"#/properties/padding/maximum",keyword:"maximum",params:{comparison: "<=", limit: 50},message:"must be <= 50"};
if(vErrors === null){
vErrors = [err109];
}
else {
vErrors.push(err109);
}
errors++;
}
if(data32 < 0 || isNaN(data32)){
const err110 = {instancePath:instancePath+"/padding",schemaPath:"#/properties/padding/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err110];
}
else {
vErrors.push(err110);
}
errors++;
}
}
else {
const err111 = {instancePath:instancePath+"/padding",schemaPath:"#/properties/padding/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err111];
}
else {
vErrors.push(err111);
}
errors++;
}
}
if(data.header !== undefined){
if(typeof data.header !== "boolean"){
const err112 = {instancePath:instancePath+"/header",schemaPath:"#/properties/header/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err112];
}
else {
vErrors.push(err112);
}
errors++;
}
}
if(data.fill !== undefined){
let data34 = data.fill;
if(typeof data34 === "string"){
if(!pattern7.test(data34)){
const err113 = {instancePath:instancePath+"/fill",schemaPath:"#/properties/fill/pattern",keyword:"pattern",params:{pattern: "^#[0-9A-Fa-f]{6}$"},message:"must match pattern \""+"^#[0-9A-Fa-f]{6}$"+"\""};
if(vErrors === null){
vErrors = [err113];
}
else {
vErrors.push(err113);
}
errors++;
}
}
else {
const err114 = {instancePath:instancePath+"/fill",schemaPath:"#/properties/fill/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err114];
}
else {
vErrors.push(err114);
}
errors++;
}
}
if(data.headerFill !== undefined){
let data35 = data.headerFill;
if(typeof data35 === "string"){
if(!pattern7.test(data35)){
const err115 = {instancePath:instancePath+"/headerFill",schemaPath:"#/properties/headerFill/pattern",keyword:"pattern",params:{pattern: "^#[0-9A-Fa-f]{6}$"},message:"must match pattern \""+"^#[0-9A-Fa-f]{6}$"+"\""};
if(vErrors === null){
vErrors = [err115];
}
else {
vErrors.push(err115);
}
errors++;
}
}
else {
const err116 = {instancePath:instancePath+"/headerFill",schemaPath:"#/properties/headerFill/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err116];
}
else {
vErrors.push(err116);
}
errors++;
}
}
if(data.grid !== undefined){
let data36 = data.grid;
if(data36 && typeof data36 == "object" && !Array.isArray(data36)){
if(data36.visible === undefined){
const err117 = {instancePath:instancePath+"/grid",schemaPath:"#/properties/grid/required",keyword:"required",params:{missingProperty: "visible"},message:"must have required property '"+"visible"+"'"};
if(vErrors === null){
vErrors = [err117];
}
else {
vErrors.push(err117);
}
errors++;
}
if(data36.color === undefined){
const err118 = {instancePath:instancePath+"/grid",schemaPath:"#/properties/grid/required",keyword:"required",params:{missingProperty: "color"},message:"must have required property '"+"color"+"'"};
if(vErrors === null){
vErrors = [err118];
}
else {
vErrors.push(err118);
}
errors++;
}
if(data36.widthPt === undefined){
const err119 = {instancePath:instancePath+"/grid",schemaPath:"#/properties/grid/required",keyword:"required",params:{missingProperty: "widthPt"},message:"must have required property '"+"widthPt"+"'"};
if(vErrors === null){
vErrors = [err119];
}
else {
vErrors.push(err119);
}
errors++;
}
if(data36.dash === undefined){
const err120 = {instancePath:instancePath+"/grid",schemaPath:"#/properties/grid/required",keyword:"required",params:{missingProperty: "dash"},message:"must have required property '"+"dash"+"'"};
if(vErrors === null){
vErrors = [err120];
}
else {
vErrors.push(err120);
}
errors++;
}
if(data36.horizontal === undefined){
const err121 = {instancePath:instancePath+"/grid",schemaPath:"#/properties/grid/required",keyword:"required",params:{missingProperty: "horizontal"},message:"must have required property '"+"horizontal"+"'"};
if(vErrors === null){
vErrors = [err121];
}
else {
vErrors.push(err121);
}
errors++;
}
if(data36.vertical === undefined){
const err122 = {instancePath:instancePath+"/grid",schemaPath:"#/properties/grid/required",keyword:"required",params:{missingProperty: "vertical"},message:"must have required property '"+"vertical"+"'"};
if(vErrors === null){
vErrors = [err122];
}
else {
vErrors.push(err122);
}
errors++;
}
for(const key7 in data36){
if(!((((((key7 === "visible") || (key7 === "color")) || (key7 === "widthPt")) || (key7 === "dash")) || (key7 === "horizontal")) || (key7 === "vertical"))){
const err123 = {instancePath:instancePath+"/grid",schemaPath:"#/properties/grid/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key7},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err123];
}
else {
vErrors.push(err123);
}
errors++;
}
}
if(data36.visible !== undefined){
if(typeof data36.visible !== "boolean"){
const err124 = {instancePath:instancePath+"/grid/visible",schemaPath:"#/properties/grid/properties/visible/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err124];
}
else {
vErrors.push(err124);
}
errors++;
}
}
if(data36.color !== undefined){
let data38 = data36.color;
if(typeof data38 === "string"){
if(!pattern7.test(data38)){
const err125 = {instancePath:instancePath+"/grid/color",schemaPath:"#/properties/grid/properties/color/pattern",keyword:"pattern",params:{pattern: "^#[0-9A-Fa-f]{6}$"},message:"must match pattern \""+"^#[0-9A-Fa-f]{6}$"+"\""};
if(vErrors === null){
vErrors = [err125];
}
else {
vErrors.push(err125);
}
errors++;
}
}
else {
const err126 = {instancePath:instancePath+"/grid/color",schemaPath:"#/properties/grid/properties/color/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err126];
}
else {
vErrors.push(err126);
}
errors++;
}
}
if(data36.widthPt !== undefined){
let data39 = data36.widthPt;
if((typeof data39 == "number") && (isFinite(data39))){
if(data39 > 24 || isNaN(data39)){
const err127 = {instancePath:instancePath+"/grid/widthPt",schemaPath:"#/properties/grid/properties/widthPt/maximum",keyword:"maximum",params:{comparison: "<=", limit: 24},message:"must be <= 24"};
if(vErrors === null){
vErrors = [err127];
}
else {
vErrors.push(err127);
}
errors++;
}
if(data39 <= 0 || isNaN(data39)){
const err128 = {instancePath:instancePath+"/grid/widthPt",schemaPath:"#/properties/grid/properties/widthPt/exclusiveMinimum",keyword:"exclusiveMinimum",params:{comparison: ">", limit: 0},message:"must be > 0"};
if(vErrors === null){
vErrors = [err128];
}
else {
vErrors.push(err128);
}
errors++;
}
}
else {
const err129 = {instancePath:instancePath+"/grid/widthPt",schemaPath:"#/properties/grid/properties/widthPt/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err129];
}
else {
vErrors.push(err129);
}
errors++;
}
}
if(data36.dash !== undefined){
let data40 = data36.dash;
if(!((((data40 === "solid") || (data40 === "dash")) || (data40 === "dot")) || (data40 === "dash-dot"))){
const err130 = {instancePath:instancePath+"/grid/dash",schemaPath:"#/properties/grid/properties/dash/enum",keyword:"enum",params:{allowedValues: schema82.properties.grid.properties.dash.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err130];
}
else {
vErrors.push(err130);
}
errors++;
}
}
if(data36.horizontal !== undefined){
if(typeof data36.horizontal !== "boolean"){
const err131 = {instancePath:instancePath+"/grid/horizontal",schemaPath:"#/properties/grid/properties/horizontal/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err131];
}
else {
vErrors.push(err131);
}
errors++;
}
}
if(data36.vertical !== undefined){
if(typeof data36.vertical !== "boolean"){
const err132 = {instancePath:instancePath+"/grid/vertical",schemaPath:"#/properties/grid/properties/vertical/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err132];
}
else {
vErrors.push(err132);
}
errors++;
}
}
}
else {
const err133 = {instancePath:instancePath+"/grid",schemaPath:"#/properties/grid/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err133];
}
else {
vErrors.push(err133);
}
errors++;
}
}
if(data.fillOpacity !== undefined){
let data43 = data.fillOpacity;
if((typeof data43 == "number") && (isFinite(data43))){
if(data43 > 1 || isNaN(data43)){
const err134 = {instancePath:instancePath+"/fillOpacity",schemaPath:"#/properties/fillOpacity/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1},message:"must be <= 1"};
if(vErrors === null){
vErrors = [err134];
}
else {
vErrors.push(err134);
}
errors++;
}
if(data43 < 0 || isNaN(data43)){
const err135 = {instancePath:instancePath+"/fillOpacity",schemaPath:"#/properties/fillOpacity/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err135];
}
else {
vErrors.push(err135);
}
errors++;
}
}
else {
const err136 = {instancePath:instancePath+"/fillOpacity",schemaPath:"#/properties/fillOpacity/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err136];
}
else {
vErrors.push(err136);
}
errors++;
}
}
}
else {
const err137 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err137];
}
else {
vErrors.push(err137);
}
errors++;
}
validate51.errors = vErrors;
return errors === 0;
}
validate51.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate50(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate50.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
const _errs2 = errors;
let valid1 = true;
const _errs3 = errors;
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((data.type === undefined) && (missing0 = "type")){
const err0 = {};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
else {
if(data.type !== undefined){
if("table" !== data.type){
const err1 = {};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
}
}
var _valid0 = _errs3 === errors;
errors = _errs2;
if(vErrors !== null){
if(_errs2){
vErrors.length = _errs2;
}
else {
vErrors = null;
}
}
let ifClause0;
if(_valid0){
const _errs5 = errors;
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.table === undefined){
const err2 = {instancePath,schemaPath:"#/allOf/0/then/required",keyword:"required",params:{missingProperty: "table"},message:"must have required property '"+"table"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
}
var _valid0 = _errs5 === errors;
valid1 = _valid0;
ifClause0 = "then";
}
else {
const _errs6 = errors;
const _errs7 = errors;
const _errs8 = errors;
if(data && typeof data == "object" && !Array.isArray(data)){
let missing1;
if((data.table === undefined) && (missing1 = "table")){
const err3 = {};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
var valid3 = _errs8 === errors;
if(valid3){
const err4 = {instancePath,schemaPath:"#/allOf/0/else/not",keyword:"not",params:{},message:"must NOT be valid"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
else {
errors = _errs7;
if(vErrors !== null){
if(_errs7){
vErrors.length = _errs7;
}
else {
vErrors = null;
}
}
}
var _valid0 = _errs6 === errors;
valid1 = _valid0;
ifClause0 = "else";
}
if(!valid1){
const err5 = {instancePath,schemaPath:"#/allOf/0/if",keyword:"if",params:{failingKeyword: ifClause0},message:"must match \""+ifClause0+"\" schema"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.id === undefined){
const err6 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
if(data.type === undefined){
const err7 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "type"},message:"must have required property '"+"type"+"'"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
if(data.name === undefined){
const err8 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
if(data.anchors === undefined){
const err9 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "anchors"},message:"must have required property '"+"anchors"+"'"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
if(data.geometry === undefined){
const err10 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "geometry"},message:"must have required property '"+"geometry"+"'"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
if(data.text === undefined){
const err11 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "text"},message:"must have required property '"+"text"+"'"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
if(data.style === undefined){
const err12 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "style"},message:"must have required property '"+"style"+"'"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
if(data.zIndex === undefined){
const err13 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "zIndex"},message:"must have required property '"+"zIndex"+"'"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
if(data.visible === undefined){
const err14 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "visible"},message:"must have required property '"+"visible"+"'"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
if(data.locked === undefined){
const err15 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "locked"},message:"must have required property '"+"locked"+"'"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
for(const key0 in data){
if(!(func1.call(schema79.properties, key0))){
const err16 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
}
if(data.id !== undefined){
let data1 = data.id;
if(typeof data1 === "string"){
if(!pattern6.test(data1)){
const err17 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"+"\""};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
}
else {
const err18 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
}
if(data.type !== undefined){
let data2 = data.type;
if(!((((((((((data2 === "text") || (data2 === "segment")) || (data2 === "line")) || (data2 === "arrow")) || (data2 === "callout")) || (data2 === "rectangle")) || (data2 === "range-x")) || (data2 === "range-y")) || (data2 === "marker")) || (data2 === "table"))){
const err19 = {instancePath:instancePath+"/type",schemaPath:"#/properties/type/enum",keyword:"enum",params:{allowedValues: schema79.properties.type.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
}
if(data.name !== undefined){
let data3 = data.name;
if(typeof data3 === "string"){
if(func2(data3) > 300){
const err20 = {instancePath:instancePath+"/name",schemaPath:"#/properties/name/maxLength",keyword:"maxLength",params:{limit: 300},message:"must NOT have more than 300 characters"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
}
else {
const err21 = {instancePath:instancePath+"/name",schemaPath:"#/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
}
if(data.anchors !== undefined){
let data4 = data.anchors;
if(Array.isArray(data4)){
if(data4.length > 2){
const err22 = {instancePath:instancePath+"/anchors",schemaPath:"#/properties/anchors/maxItems",keyword:"maxItems",params:{limit: 2},message:"must NOT have more than 2 items"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
if(data4.length < 1){
const err23 = {instancePath:instancePath+"/anchors",schemaPath:"#/properties/anchors/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
const len0 = data4.length;
for(let i0=0; i0<len0; i0++){
let data5 = data4[i0];
const _errs19 = errors;
let valid8 = false;
let passing0 = null;
const _errs20 = errors;
if(data5 && typeof data5 == "object" && !Array.isArray(data5)){
if(data5.mode === undefined){
const err24 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/0/required",keyword:"required",params:{missingProperty: "mode"},message:"must have required property '"+"mode"+"'"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
if(data5.x === undefined){
const err25 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/0/required",keyword:"required",params:{missingProperty: "x"},message:"must have required property '"+"x"+"'"};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
if(data5.y === undefined){
const err26 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/0/required",keyword:"required",params:{missingProperty: "y"},message:"must have required property '"+"y"+"'"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
for(const key1 in data5){
if(!(((key1 === "mode") || (key1 === "x")) || (key1 === "y"))){
const err27 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/0/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
}
if(data5.mode !== undefined){
if("data" !== data5.mode){
const err28 = {instancePath:instancePath+"/anchors/" + i0+"/mode",schemaPath:"#/$defs/anchor/oneOf/0/properties/mode/const",keyword:"const",params:{allowedValue: "data"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
}
if(data5.x !== undefined){
let data7 = data5.x;
if(!((typeof data7 == "number") && (isFinite(data7)))){
const err29 = {instancePath:instancePath+"/anchors/" + i0+"/x",schemaPath:"#/$defs/anchor/oneOf/0/properties/x/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
}
}
if(data5.y !== undefined){
let data8 = data5.y;
if(!((typeof data8 == "number") && (isFinite(data8)))){
const err30 = {instancePath:instancePath+"/anchors/" + i0+"/y",schemaPath:"#/$defs/anchor/oneOf/0/properties/y/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err30];
}
else {
vErrors.push(err30);
}
errors++;
}
}
}
else {
const err31 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err31];
}
else {
vErrors.push(err31);
}
errors++;
}
var _valid1 = _errs20 === errors;
if(_valid1){
valid8 = true;
passing0 = 0;
var props0 = true;
}
const _errs28 = errors;
if(data5 && typeof data5 == "object" && !Array.isArray(data5)){
if(data5.mode === undefined){
const err32 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/1/required",keyword:"required",params:{missingProperty: "mode"},message:"must have required property '"+"mode"+"'"};
if(vErrors === null){
vErrors = [err32];
}
else {
vErrors.push(err32);
}
errors++;
}
if(data5.pageX === undefined){
const err33 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/1/required",keyword:"required",params:{missingProperty: "pageX"},message:"must have required property '"+"pageX"+"'"};
if(vErrors === null){
vErrors = [err33];
}
else {
vErrors.push(err33);
}
errors++;
}
if(data5.pageY === undefined){
const err34 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/1/required",keyword:"required",params:{missingProperty: "pageY"},message:"must have required property '"+"pageY"+"'"};
if(vErrors === null){
vErrors = [err34];
}
else {
vErrors.push(err34);
}
errors++;
}
for(const key2 in data5){
if(!(((key2 === "mode") || (key2 === "pageX")) || (key2 === "pageY"))){
const err35 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/1/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key2},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err35];
}
else {
vErrors.push(err35);
}
errors++;
}
}
if(data5.mode !== undefined){
if("page" !== data5.mode){
const err36 = {instancePath:instancePath+"/anchors/" + i0+"/mode",schemaPath:"#/$defs/anchor/oneOf/1/properties/mode/const",keyword:"const",params:{allowedValue: "page"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err36];
}
else {
vErrors.push(err36);
}
errors++;
}
}
if(data5.pageX !== undefined){
let data10 = data5.pageX;
if((typeof data10 == "number") && (isFinite(data10))){
if(data10 > 1 || isNaN(data10)){
const err37 = {instancePath:instancePath+"/anchors/" + i0+"/pageX",schemaPath:"#/$defs/anchor/oneOf/1/properties/pageX/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1},message:"must be <= 1"};
if(vErrors === null){
vErrors = [err37];
}
else {
vErrors.push(err37);
}
errors++;
}
if(data10 < 0 || isNaN(data10)){
const err38 = {instancePath:instancePath+"/anchors/" + i0+"/pageX",schemaPath:"#/$defs/anchor/oneOf/1/properties/pageX/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err38];
}
else {
vErrors.push(err38);
}
errors++;
}
}
else {
const err39 = {instancePath:instancePath+"/anchors/" + i0+"/pageX",schemaPath:"#/$defs/anchor/oneOf/1/properties/pageX/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err39];
}
else {
vErrors.push(err39);
}
errors++;
}
}
if(data5.pageY !== undefined){
let data11 = data5.pageY;
if((typeof data11 == "number") && (isFinite(data11))){
if(data11 > 1 || isNaN(data11)){
const err40 = {instancePath:instancePath+"/anchors/" + i0+"/pageY",schemaPath:"#/$defs/anchor/oneOf/1/properties/pageY/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1},message:"must be <= 1"};
if(vErrors === null){
vErrors = [err40];
}
else {
vErrors.push(err40);
}
errors++;
}
if(data11 < 0 || isNaN(data11)){
const err41 = {instancePath:instancePath+"/anchors/" + i0+"/pageY",schemaPath:"#/$defs/anchor/oneOf/1/properties/pageY/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err41];
}
else {
vErrors.push(err41);
}
errors++;
}
}
else {
const err42 = {instancePath:instancePath+"/anchors/" + i0+"/pageY",schemaPath:"#/$defs/anchor/oneOf/1/properties/pageY/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err42];
}
else {
vErrors.push(err42);
}
errors++;
}
}
}
else {
const err43 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/1/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err43];
}
else {
vErrors.push(err43);
}
errors++;
}
var _valid1 = _errs28 === errors;
if(_valid1 && valid8){
valid8 = false;
passing0 = [passing0, 1];
}
else {
if(_valid1){
valid8 = true;
passing0 = 1;
if(props0 !== true){
props0 = true;
}
}
const _errs36 = errors;
if(data5 && typeof data5 == "object" && !Array.isArray(data5)){
if(data5.mode === undefined){
const err44 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/2/required",keyword:"required",params:{missingProperty: "mode"},message:"must have required property '"+"mode"+"'"};
if(vErrors === null){
vErrors = [err44];
}
else {
vErrors.push(err44);
}
errors++;
}
if(data5.datasetId === undefined){
const err45 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/2/required",keyword:"required",params:{missingProperty: "datasetId"},message:"must have required property '"+"datasetId"+"'"};
if(vErrors === null){
vErrors = [err45];
}
else {
vErrors.push(err45);
}
errors++;
}
if(data5.pointId === undefined){
const err46 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/2/required",keyword:"required",params:{missingProperty: "pointId"},message:"must have required property '"+"pointId"+"'"};
if(vErrors === null){
vErrors = [err46];
}
else {
vErrors.push(err46);
}
errors++;
}
if(data5.fallbackX === undefined){
const err47 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/2/required",keyword:"required",params:{missingProperty: "fallbackX"},message:"must have required property '"+"fallbackX"+"'"};
if(vErrors === null){
vErrors = [err47];
}
else {
vErrors.push(err47);
}
errors++;
}
if(data5.fallbackY === undefined){
const err48 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/2/required",keyword:"required",params:{missingProperty: "fallbackY"},message:"must have required property '"+"fallbackY"+"'"};
if(vErrors === null){
vErrors = [err48];
}
else {
vErrors.push(err48);
}
errors++;
}
if(data5.offsetXpx === undefined){
const err49 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/2/required",keyword:"required",params:{missingProperty: "offsetXpx"},message:"must have required property '"+"offsetXpx"+"'"};
if(vErrors === null){
vErrors = [err49];
}
else {
vErrors.push(err49);
}
errors++;
}
if(data5.offsetYpx === undefined){
const err50 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/2/required",keyword:"required",params:{missingProperty: "offsetYpx"},message:"must have required property '"+"offsetYpx"+"'"};
if(vErrors === null){
vErrors = [err50];
}
else {
vErrors.push(err50);
}
errors++;
}
for(const key3 in data5){
if(!(((((((key3 === "mode") || (key3 === "datasetId")) || (key3 === "pointId")) || (key3 === "fallbackX")) || (key3 === "fallbackY")) || (key3 === "offsetXpx")) || (key3 === "offsetYpx"))){
const err51 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/2/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key3},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err51];
}
else {
vErrors.push(err51);
}
errors++;
}
}
if(data5.mode !== undefined){
if("point" !== data5.mode){
const err52 = {instancePath:instancePath+"/anchors/" + i0+"/mode",schemaPath:"#/$defs/anchor/oneOf/2/properties/mode/const",keyword:"const",params:{allowedValue: "point"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err52];
}
else {
vErrors.push(err52);
}
errors++;
}
}
if(data5.datasetId !== undefined){
let data13 = data5.datasetId;
if(typeof data13 === "string"){
if(!pattern6.test(data13)){
const err53 = {instancePath:instancePath+"/anchors/" + i0+"/datasetId",schemaPath:"#/$defs/anchor/oneOf/2/properties/datasetId/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"+"\""};
if(vErrors === null){
vErrors = [err53];
}
else {
vErrors.push(err53);
}
errors++;
}
}
else {
const err54 = {instancePath:instancePath+"/anchors/" + i0+"/datasetId",schemaPath:"#/$defs/anchor/oneOf/2/properties/datasetId/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err54];
}
else {
vErrors.push(err54);
}
errors++;
}
}
if(data5.pointId !== undefined){
let data14 = data5.pointId;
if(typeof data14 === "string"){
if(!pattern6.test(data14)){
const err55 = {instancePath:instancePath+"/anchors/" + i0+"/pointId",schemaPath:"#/$defs/anchor/oneOf/2/properties/pointId/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"+"\""};
if(vErrors === null){
vErrors = [err55];
}
else {
vErrors.push(err55);
}
errors++;
}
}
else {
const err56 = {instancePath:instancePath+"/anchors/" + i0+"/pointId",schemaPath:"#/$defs/anchor/oneOf/2/properties/pointId/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err56];
}
else {
vErrors.push(err56);
}
errors++;
}
}
if(data5.fallbackX !== undefined){
let data15 = data5.fallbackX;
if(!((typeof data15 == "number") && (isFinite(data15)))){
const err57 = {instancePath:instancePath+"/anchors/" + i0+"/fallbackX",schemaPath:"#/$defs/anchor/oneOf/2/properties/fallbackX/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err57];
}
else {
vErrors.push(err57);
}
errors++;
}
}
if(data5.fallbackY !== undefined){
let data16 = data5.fallbackY;
if(!((typeof data16 == "number") && (isFinite(data16)))){
const err58 = {instancePath:instancePath+"/anchors/" + i0+"/fallbackY",schemaPath:"#/$defs/anchor/oneOf/2/properties/fallbackY/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err58];
}
else {
vErrors.push(err58);
}
errors++;
}
}
if(data5.offsetXpx !== undefined){
let data17 = data5.offsetXpx;
if(!((typeof data17 == "number") && (isFinite(data17)))){
const err59 = {instancePath:instancePath+"/anchors/" + i0+"/offsetXpx",schemaPath:"#/$defs/anchor/oneOf/2/properties/offsetXpx/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err59];
}
else {
vErrors.push(err59);
}
errors++;
}
}
if(data5.offsetYpx !== undefined){
let data18 = data5.offsetYpx;
if(!((typeof data18 == "number") && (isFinite(data18)))){
const err60 = {instancePath:instancePath+"/anchors/" + i0+"/offsetYpx",schemaPath:"#/$defs/anchor/oneOf/2/properties/offsetYpx/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err60];
}
else {
vErrors.push(err60);
}
errors++;
}
}
}
else {
const err61 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf/2/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err61];
}
else {
vErrors.push(err61);
}
errors++;
}
var _valid1 = _errs36 === errors;
if(_valid1 && valid8){
valid8 = false;
passing0 = [passing0, 2];
}
else {
if(_valid1){
valid8 = true;
passing0 = 2;
if(props0 !== true){
props0 = true;
}
}
}
}
if(!valid8){
const err62 = {instancePath:instancePath+"/anchors/" + i0,schemaPath:"#/$defs/anchor/oneOf",keyword:"oneOf",params:{passingSchemas: passing0},message:"must match exactly one schema in oneOf"};
if(vErrors === null){
vErrors = [err62];
}
else {
vErrors.push(err62);
}
errors++;
}
else {
errors = _errs19;
if(vErrors !== null){
if(_errs19){
vErrors.length = _errs19;
}
else {
vErrors = null;
}
}
}
}
}
else {
const err63 = {instancePath:instancePath+"/anchors",schemaPath:"#/properties/anchors/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err63];
}
else {
vErrors.push(err63);
}
errors++;
}
}
if(data.geometry !== undefined){
let data19 = data.geometry;
if(data19 && typeof data19 == "object" && !Array.isArray(data19)){
for(const key4 in data19){
if(!((((key4 === "directionX") || (key4 === "directionY")) || (key4 === "widthPx")) || (key4 === "heightPx"))){
const err64 = {instancePath:instancePath+"/geometry",schemaPath:"#/properties/geometry/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key4},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err64];
}
else {
vErrors.push(err64);
}
errors++;
}
}
if(data19.directionX !== undefined){
let data20 = data19.directionX;
if(!((typeof data20 == "number") && (isFinite(data20)))){
const err65 = {instancePath:instancePath+"/geometry/directionX",schemaPath:"#/properties/geometry/properties/directionX/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err65];
}
else {
vErrors.push(err65);
}
errors++;
}
}
if(data19.directionY !== undefined){
let data21 = data19.directionY;
if(!((typeof data21 == "number") && (isFinite(data21)))){
const err66 = {instancePath:instancePath+"/geometry/directionY",schemaPath:"#/properties/geometry/properties/directionY/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err66];
}
else {
vErrors.push(err66);
}
errors++;
}
}
if(data19.widthPx !== undefined){
let data22 = data19.widthPx;
if((typeof data22 == "number") && (isFinite(data22))){
if(data22 > 600000 || isNaN(data22)){
const err67 = {instancePath:instancePath+"/geometry/widthPx",schemaPath:"#/properties/geometry/properties/widthPx/maximum",keyword:"maximum",params:{comparison: "<=", limit: 600000},message:"must be <= 600000"};
if(vErrors === null){
vErrors = [err67];
}
else {
vErrors.push(err67);
}
errors++;
}
if(data22 < 16 || isNaN(data22)){
const err68 = {instancePath:instancePath+"/geometry/widthPx",schemaPath:"#/properties/geometry/properties/widthPx/minimum",keyword:"minimum",params:{comparison: ">=", limit: 16},message:"must be >= 16"};
if(vErrors === null){
vErrors = [err68];
}
else {
vErrors.push(err68);
}
errors++;
}
}
else {
const err69 = {instancePath:instancePath+"/geometry/widthPx",schemaPath:"#/properties/geometry/properties/widthPx/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err69];
}
else {
vErrors.push(err69);
}
errors++;
}
}
if(data19.heightPx !== undefined){
let data23 = data19.heightPx;
if((typeof data23 == "number") && (isFinite(data23))){
if(data23 > 1500000 || isNaN(data23)){
const err70 = {instancePath:instancePath+"/geometry/heightPx",schemaPath:"#/properties/geometry/properties/heightPx/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1500000},message:"must be <= 1500000"};
if(vErrors === null){
vErrors = [err70];
}
else {
vErrors.push(err70);
}
errors++;
}
if(data23 < 16 || isNaN(data23)){
const err71 = {instancePath:instancePath+"/geometry/heightPx",schemaPath:"#/properties/geometry/properties/heightPx/minimum",keyword:"minimum",params:{comparison: ">=", limit: 16},message:"must be >= 16"};
if(vErrors === null){
vErrors = [err71];
}
else {
vErrors.push(err71);
}
errors++;
}
}
else {
const err72 = {instancePath:instancePath+"/geometry/heightPx",schemaPath:"#/properties/geometry/properties/heightPx/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err72];
}
else {
vErrors.push(err72);
}
errors++;
}
}
}
else {
const err73 = {instancePath:instancePath+"/geometry",schemaPath:"#/properties/geometry/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err73];
}
else {
vErrors.push(err73);
}
errors++;
}
}
if(data.text !== undefined){
let data24 = data.text;
if(Array.isArray(data24)){
if(data24.length > 1000){
const err74 = {instancePath:instancePath+"/text",schemaPath:"#/properties/text/maxItems",keyword:"maxItems",params:{limit: 1000},message:"must NOT have more than 1000 items"};
if(vErrors === null){
vErrors = [err74];
}
else {
vErrors.push(err74);
}
errors++;
}
const len1 = data24.length;
for(let i1=0; i1<len1; i1++){
let data25 = data24[i1];
if(data25 && typeof data25 == "object" && !Array.isArray(data25)){
if(data25.text === undefined){
const err75 = {instancePath:instancePath+"/text/" + i1,schemaPath:"#/$defs/textPart/required",keyword:"required",params:{missingProperty: "text"},message:"must have required property '"+"text"+"'"};
if(vErrors === null){
vErrors = [err75];
}
else {
vErrors.push(err75);
}
errors++;
}
if(data25.baseline === undefined){
const err76 = {instancePath:instancePath+"/text/" + i1,schemaPath:"#/$defs/textPart/required",keyword:"required",params:{missingProperty: "baseline"},message:"must have required property '"+"baseline"+"'"};
if(vErrors === null){
vErrors = [err76];
}
else {
vErrors.push(err76);
}
errors++;
}
if(data25.bold === undefined){
const err77 = {instancePath:instancePath+"/text/" + i1,schemaPath:"#/$defs/textPart/required",keyword:"required",params:{missingProperty: "bold"},message:"must have required property '"+"bold"+"'"};
if(vErrors === null){
vErrors = [err77];
}
else {
vErrors.push(err77);
}
errors++;
}
if(data25.italic === undefined){
const err78 = {instancePath:instancePath+"/text/" + i1,schemaPath:"#/$defs/textPart/required",keyword:"required",params:{missingProperty: "italic"},message:"must have required property '"+"italic"+"'"};
if(vErrors === null){
vErrors = [err78];
}
else {
vErrors.push(err78);
}
errors++;
}
for(const key5 in data25){
if(!((((key5 === "text") || (key5 === "baseline")) || (key5 === "bold")) || (key5 === "italic"))){
const err79 = {instancePath:instancePath+"/text/" + i1,schemaPath:"#/$defs/textPart/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key5},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err79];
}
else {
vErrors.push(err79);
}
errors++;
}
}
if(data25.text !== undefined){
let data26 = data25.text;
if(typeof data26 === "string"){
if(func2(data26) > 5000){
const err80 = {instancePath:instancePath+"/text/" + i1+"/text",schemaPath:"#/$defs/textPart/properties/text/maxLength",keyword:"maxLength",params:{limit: 5000},message:"must NOT have more than 5000 characters"};
if(vErrors === null){
vErrors = [err80];
}
else {
vErrors.push(err80);
}
errors++;
}
}
else {
const err81 = {instancePath:instancePath+"/text/" + i1+"/text",schemaPath:"#/$defs/textPart/properties/text/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err81];
}
else {
vErrors.push(err81);
}
errors++;
}
}
if(data25.baseline !== undefined){
let data27 = data25.baseline;
if(!(((data27 === "normal") || (data27 === "sub")) || (data27 === "super"))){
const err82 = {instancePath:instancePath+"/text/" + i1+"/baseline",schemaPath:"#/$defs/textPart/properties/baseline/enum",keyword:"enum",params:{allowedValues: schema81.properties.baseline.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err82];
}
else {
vErrors.push(err82);
}
errors++;
}
}
if(data25.bold !== undefined){
if(typeof data25.bold !== "boolean"){
const err83 = {instancePath:instancePath+"/text/" + i1+"/bold",schemaPath:"#/$defs/textPart/properties/bold/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err83];
}
else {
vErrors.push(err83);
}
errors++;
}
}
if(data25.italic !== undefined){
if(typeof data25.italic !== "boolean"){
const err84 = {instancePath:instancePath+"/text/" + i1+"/italic",schemaPath:"#/$defs/textPart/properties/italic/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err84];
}
else {
vErrors.push(err84);
}
errors++;
}
}
}
else {
const err85 = {instancePath:instancePath+"/text/" + i1,schemaPath:"#/$defs/textPart/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err85];
}
else {
vErrors.push(err85);
}
errors++;
}
}
}
else {
const err86 = {instancePath:instancePath+"/text",schemaPath:"#/properties/text/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err86];
}
else {
vErrors.push(err86);
}
errors++;
}
}
if(data.style !== undefined){
let data30 = data.style;
if(data30 && typeof data30 == "object" && !Array.isArray(data30)){
if(data30.stroke === undefined){
const err87 = {instancePath:instancePath+"/style",schemaPath:"#/properties/style/required",keyword:"required",params:{missingProperty: "stroke"},message:"must have required property '"+"stroke"+"'"};
if(vErrors === null){
vErrors = [err87];
}
else {
vErrors.push(err87);
}
errors++;
}
if(data30.strokeWidthPt === undefined){
const err88 = {instancePath:instancePath+"/style",schemaPath:"#/properties/style/required",keyword:"required",params:{missingProperty: "strokeWidthPt"},message:"must have required property '"+"strokeWidthPt"+"'"};
if(vErrors === null){
vErrors = [err88];
}
else {
vErrors.push(err88);
}
errors++;
}
if(data30.dash === undefined){
const err89 = {instancePath:instancePath+"/style",schemaPath:"#/properties/style/required",keyword:"required",params:{missingProperty: "dash"},message:"must have required property '"+"dash"+"'"};
if(vErrors === null){
vErrors = [err89];
}
else {
vErrors.push(err89);
}
errors++;
}
if(data30.strokeOpacity === undefined){
const err90 = {instancePath:instancePath+"/style",schemaPath:"#/properties/style/required",keyword:"required",params:{missingProperty: "strokeOpacity"},message:"must have required property '"+"strokeOpacity"+"'"};
if(vErrors === null){
vErrors = [err90];
}
else {
vErrors.push(err90);
}
errors++;
}
if(data30.fill === undefined){
const err91 = {instancePath:instancePath+"/style",schemaPath:"#/properties/style/required",keyword:"required",params:{missingProperty: "fill"},message:"must have required property '"+"fill"+"'"};
if(vErrors === null){
vErrors = [err91];
}
else {
vErrors.push(err91);
}
errors++;
}
if(data30.fillOpacity === undefined){
const err92 = {instancePath:instancePath+"/style",schemaPath:"#/properties/style/required",keyword:"required",params:{missingProperty: "fillOpacity"},message:"must have required property '"+"fillOpacity"+"'"};
if(vErrors === null){
vErrors = [err92];
}
else {
vErrors.push(err92);
}
errors++;
}
if(data30.fontSizePt === undefined){
const err93 = {instancePath:instancePath+"/style",schemaPath:"#/properties/style/required",keyword:"required",params:{missingProperty: "fontSizePt"},message:"must have required property '"+"fontSizePt"+"'"};
if(vErrors === null){
vErrors = [err93];
}
else {
vErrors.push(err93);
}
errors++;
}
if(data30.fontFamily === undefined){
const err94 = {instancePath:instancePath+"/style",schemaPath:"#/properties/style/required",keyword:"required",params:{missingProperty: "fontFamily"},message:"must have required property '"+"fontFamily"+"'"};
if(vErrors === null){
vErrors = [err94];
}
else {
vErrors.push(err94);
}
errors++;
}
if(data30.arrowHead === undefined){
const err95 = {instancePath:instancePath+"/style",schemaPath:"#/properties/style/required",keyword:"required",params:{missingProperty: "arrowHead"},message:"must have required property '"+"arrowHead"+"'"};
if(vErrors === null){
vErrors = [err95];
}
else {
vErrors.push(err95);
}
errors++;
}
if(data30.markerShape === undefined){
const err96 = {instancePath:instancePath+"/style",schemaPath:"#/properties/style/required",keyword:"required",params:{missingProperty: "markerShape"},message:"must have required property '"+"markerShape"+"'"};
if(vErrors === null){
vErrors = [err96];
}
else {
vErrors.push(err96);
}
errors++;
}
if(data30.markerSizePt === undefined){
const err97 = {instancePath:instancePath+"/style",schemaPath:"#/properties/style/required",keyword:"required",params:{missingProperty: "markerSizePt"},message:"must have required property '"+"markerSizePt"+"'"};
if(vErrors === null){
vErrors = [err97];
}
else {
vErrors.push(err97);
}
errors++;
}
for(const key6 in data30){
if(!(func1.call(schema79.properties.style.properties, key6))){
const err98 = {instancePath:instancePath+"/style",schemaPath:"#/properties/style/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key6},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err98];
}
else {
vErrors.push(err98);
}
errors++;
}
}
if(data30.stroke !== undefined){
let data31 = data30.stroke;
if(typeof data31 === "string"){
if(!pattern7.test(data31)){
const err99 = {instancePath:instancePath+"/style/stroke",schemaPath:"#/properties/style/properties/stroke/pattern",keyword:"pattern",params:{pattern: "^#[0-9A-Fa-f]{6}$"},message:"must match pattern \""+"^#[0-9A-Fa-f]{6}$"+"\""};
if(vErrors === null){
vErrors = [err99];
}
else {
vErrors.push(err99);
}
errors++;
}
}
else {
const err100 = {instancePath:instancePath+"/style/stroke",schemaPath:"#/properties/style/properties/stroke/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err100];
}
else {
vErrors.push(err100);
}
errors++;
}
}
if(data30.strokeWidthPt !== undefined){
let data32 = data30.strokeWidthPt;
if((typeof data32 == "number") && (isFinite(data32))){
if(data32 > 24 || isNaN(data32)){
const err101 = {instancePath:instancePath+"/style/strokeWidthPt",schemaPath:"#/properties/style/properties/strokeWidthPt/maximum",keyword:"maximum",params:{comparison: "<=", limit: 24},message:"must be <= 24"};
if(vErrors === null){
vErrors = [err101];
}
else {
vErrors.push(err101);
}
errors++;
}
if(data32 <= 0 || isNaN(data32)){
const err102 = {instancePath:instancePath+"/style/strokeWidthPt",schemaPath:"#/properties/style/properties/strokeWidthPt/exclusiveMinimum",keyword:"exclusiveMinimum",params:{comparison: ">", limit: 0},message:"must be > 0"};
if(vErrors === null){
vErrors = [err102];
}
else {
vErrors.push(err102);
}
errors++;
}
}
else {
const err103 = {instancePath:instancePath+"/style/strokeWidthPt",schemaPath:"#/properties/style/properties/strokeWidthPt/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err103];
}
else {
vErrors.push(err103);
}
errors++;
}
}
if(data30.dash !== undefined){
let data33 = data30.dash;
if(!((((data33 === "solid") || (data33 === "dash")) || (data33 === "dot")) || (data33 === "dash-dot"))){
const err104 = {instancePath:instancePath+"/style/dash",schemaPath:"#/properties/style/properties/dash/enum",keyword:"enum",params:{allowedValues: schema79.properties.style.properties.dash.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err104];
}
else {
vErrors.push(err104);
}
errors++;
}
}
if(data30.strokeOpacity !== undefined){
let data34 = data30.strokeOpacity;
if((typeof data34 == "number") && (isFinite(data34))){
if(data34 > 1 || isNaN(data34)){
const err105 = {instancePath:instancePath+"/style/strokeOpacity",schemaPath:"#/properties/style/properties/strokeOpacity/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1},message:"must be <= 1"};
if(vErrors === null){
vErrors = [err105];
}
else {
vErrors.push(err105);
}
errors++;
}
if(data34 < 0 || isNaN(data34)){
const err106 = {instancePath:instancePath+"/style/strokeOpacity",schemaPath:"#/properties/style/properties/strokeOpacity/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err106];
}
else {
vErrors.push(err106);
}
errors++;
}
}
else {
const err107 = {instancePath:instancePath+"/style/strokeOpacity",schemaPath:"#/properties/style/properties/strokeOpacity/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err107];
}
else {
vErrors.push(err107);
}
errors++;
}
}
if(data30.fill !== undefined){
let data35 = data30.fill;
if(typeof data35 === "string"){
if(!pattern7.test(data35)){
const err108 = {instancePath:instancePath+"/style/fill",schemaPath:"#/properties/style/properties/fill/pattern",keyword:"pattern",params:{pattern: "^#[0-9A-Fa-f]{6}$"},message:"must match pattern \""+"^#[0-9A-Fa-f]{6}$"+"\""};
if(vErrors === null){
vErrors = [err108];
}
else {
vErrors.push(err108);
}
errors++;
}
}
else {
const err109 = {instancePath:instancePath+"/style/fill",schemaPath:"#/properties/style/properties/fill/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err109];
}
else {
vErrors.push(err109);
}
errors++;
}
}
if(data30.fillOpacity !== undefined){
let data36 = data30.fillOpacity;
if((typeof data36 == "number") && (isFinite(data36))){
if(data36 > 1 || isNaN(data36)){
const err110 = {instancePath:instancePath+"/style/fillOpacity",schemaPath:"#/properties/style/properties/fillOpacity/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1},message:"must be <= 1"};
if(vErrors === null){
vErrors = [err110];
}
else {
vErrors.push(err110);
}
errors++;
}
if(data36 < 0 || isNaN(data36)){
const err111 = {instancePath:instancePath+"/style/fillOpacity",schemaPath:"#/properties/style/properties/fillOpacity/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err111];
}
else {
vErrors.push(err111);
}
errors++;
}
}
else {
const err112 = {instancePath:instancePath+"/style/fillOpacity",schemaPath:"#/properties/style/properties/fillOpacity/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err112];
}
else {
vErrors.push(err112);
}
errors++;
}
}
if(data30.fontSizePt !== undefined){
let data37 = data30.fontSizePt;
if((typeof data37 == "number") && (isFinite(data37))){
if(data37 > 72 || isNaN(data37)){
const err113 = {instancePath:instancePath+"/style/fontSizePt",schemaPath:"#/properties/style/properties/fontSizePt/maximum",keyword:"maximum",params:{comparison: "<=", limit: 72},message:"must be <= 72"};
if(vErrors === null){
vErrors = [err113];
}
else {
vErrors.push(err113);
}
errors++;
}
if(data37 < 6 || isNaN(data37)){
const err114 = {instancePath:instancePath+"/style/fontSizePt",schemaPath:"#/properties/style/properties/fontSizePt/minimum",keyword:"minimum",params:{comparison: ">=", limit: 6},message:"must be >= 6"};
if(vErrors === null){
vErrors = [err114];
}
else {
vErrors.push(err114);
}
errors++;
}
}
else {
const err115 = {instancePath:instancePath+"/style/fontSizePt",schemaPath:"#/properties/style/properties/fontSizePt/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err115];
}
else {
vErrors.push(err115);
}
errors++;
}
}
if(data30.fontFamily !== undefined){
if("Courier New" !== data30.fontFamily){
const err116 = {instancePath:instancePath+"/style/fontFamily",schemaPath:"#/properties/style/properties/fontFamily/const",keyword:"const",params:{allowedValue: "Courier New"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err116];
}
else {
vErrors.push(err116);
}
errors++;
}
}
if(data30.arrowHead !== undefined){
let data39 = data30.arrowHead;
if(!((((data39 === "none") || (data39 === "start")) || (data39 === "end")) || (data39 === "both"))){
const err117 = {instancePath:instancePath+"/style/arrowHead",schemaPath:"#/properties/style/properties/arrowHead/enum",keyword:"enum",params:{allowedValues: schema79.properties.style.properties.arrowHead.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err117];
}
else {
vErrors.push(err117);
}
errors++;
}
}
if(data30.markerShape !== undefined){
let data40 = data30.markerShape;
if(!((((((data40 === "circle") || (data40 === "square")) || (data40 === "triangle")) || (data40 === "diamond")) || (data40 === "cross")) || (data40 === "plus"))){
const err118 = {instancePath:instancePath+"/style/markerShape",schemaPath:"#/properties/style/properties/markerShape/enum",keyword:"enum",params:{allowedValues: schema79.properties.style.properties.markerShape.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err118];
}
else {
vErrors.push(err118);
}
errors++;
}
}
if(data30.markerSizePt !== undefined){
let data41 = data30.markerSizePt;
if((typeof data41 == "number") && (isFinite(data41))){
if(data41 > 32 || isNaN(data41)){
const err119 = {instancePath:instancePath+"/style/markerSizePt",schemaPath:"#/properties/style/properties/markerSizePt/maximum",keyword:"maximum",params:{comparison: "<=", limit: 32},message:"must be <= 32"};
if(vErrors === null){
vErrors = [err119];
}
else {
vErrors.push(err119);
}
errors++;
}
if(data41 < 0 || isNaN(data41)){
const err120 = {instancePath:instancePath+"/style/markerSizePt",schemaPath:"#/properties/style/properties/markerSizePt/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err120];
}
else {
vErrors.push(err120);
}
errors++;
}
}
else {
const err121 = {instancePath:instancePath+"/style/markerSizePt",schemaPath:"#/properties/style/properties/markerSizePt/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err121];
}
else {
vErrors.push(err121);
}
errors++;
}
}
}
else {
const err122 = {instancePath:instancePath+"/style",schemaPath:"#/properties/style/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err122];
}
else {
vErrors.push(err122);
}
errors++;
}
}
if(data.zIndex !== undefined){
let data42 = data.zIndex;
if(!(((typeof data42 == "number") && (!(data42 % 1) && !isNaN(data42))) && (isFinite(data42)))){
const err123 = {instancePath:instancePath+"/zIndex",schemaPath:"#/properties/zIndex/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err123];
}
else {
vErrors.push(err123);
}
errors++;
}
}
if(data.visible !== undefined){
if(typeof data.visible !== "boolean"){
const err124 = {instancePath:instancePath+"/visible",schemaPath:"#/properties/visible/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err124];
}
else {
vErrors.push(err124);
}
errors++;
}
}
if(data.locked !== undefined){
if(typeof data.locked !== "boolean"){
const err125 = {instancePath:instancePath+"/locked",schemaPath:"#/properties/locked/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err125];
}
else {
vErrors.push(err125);
}
errors++;
}
}
if(data.table !== undefined){
if(!(validate51(data.table, {instancePath:instancePath+"/table",parentData:data,parentDataProperty:"table",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate51.errors : vErrors.concat(validate51.errors);
errors = vErrors.length;
}
}
}
else {
const err126 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err126];
}
else {
vErrors.push(err126);
}
errors++;
}
validate50.errors = vErrors;
return errors === 0;
}
validate50.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema84 = {"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"kind":{"enum":["linear-fit","polynomial-fit","exponential-fit","power-fit","savitzky-golay","moving-average","derivative","integral","interpolation","statistics","baseline","peaks","area","peak-fit","peak-fit-output"]},"sourceDatasetIds":{"type":"array","items":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},"minItems":1},"resultDatasetId":{"anyOf":[{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},{"type":"null"}]},"parameters":{"type":"object","maxProperties":60,"additionalProperties":{"type":["string","number","integer","boolean","null","array","object"]}},"algorithmVersion":{"type":"integer","minimum":1},"status":{"enum":["valid","outdated","invalid"]},"summary":{"type":"object","maxProperties":60,"additionalProperties":{"type":["string","number","integer","boolean","null"]}},"data":{"type":"object","additionalProperties":false,"properties":{"peaks":{"type":"array","maxItems":1000000,"items":{"$ref":"#/$defs/peakMeasurement"}},"peakFit":{"$ref":"#/$defs/peakFit"}}},"display":{"type":"object","additionalProperties":false,"properties":{"visible":{"type":"boolean"},"stroke":{"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"},"opacity":{"type":"number","minimum":0,"maximum":1},"label":{"type":"boolean"}},"required":["visible","stroke","opacity","label"]}},"required":["id","kind","sourceDatasetIds","resultDatasetId","parameters","algorithmVersion","status","summary"]};
const schema85 = {"type":"object","additionalProperties":false,"properties":{"index":{"type":"integer","minimum":0},"x":{"type":"number"},"y":{"type":"number"},"direction":{"enum":["max","min"]},"prominence":{"type":["number","null"],"minimum":0},"width":{"type":["number","null"],"minimum":0},"left":{"type":["number","null"]},"right":{"type":["number","null"]},"level":{"type":["number","null"]},"incomplete":{"type":"boolean"}},"required":["index","x","y","direction","prominence","width","left","right","level","incomplete"]};
const schema86 = {"type":"object","additionalProperties":false,"properties":{"version":{"const":1},"components":{"type":"array","minItems":1,"maxItems":8,"items":{"$ref":"#/$defs/peakFitComponent"}},"baseline":{"type":"object","additionalProperties":false,"properties":{"mode":{"enum":["none","constant","linear"]},"referenceX":{"type":"number"},"intercept":{"type":"number"},"slope":{"type":"number"}},"required":["mode","referenceX","intercept","slope"]},"range":{"type":"array","minItems":2,"maxItems":2,"items":{"type":"number"}},"n":{"type":"integer","minimum":1,"maximum":1000000},"sse":{"type":"number","minimum":0},"rmse":{"type":"number","minimum":0},"rSquared":{"type":["number","null"]},"iterations":{"type":"integer","minimum":0,"maximum":1000},"condition":{"type":"number","minimum":1,"maximum":1000000000000},"method":{"const":"scaled-projected-lm-givens-qr"}},"required":["version","components","baseline","range","n","sse","rmse","rSquared","iterations","condition","method"]};
const schema87 = {"type":"object","additionalProperties":false,"properties":{"model":{"enum":["gaussian","lorentzian","pseudo-voigt"]},"center":{"type":"number"},"height":{"type":"number"},"fwhm":{"type":"number","exclusiveMinimum":0},"eta":{"type":"number","minimum":0,"maximum":1},"area":{"type":"number"}},"required":["model","center","height","fwhm","eta","area"]};

function validate55(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate55.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.version === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "version"},message:"must have required property '"+"version"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.components === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "components"},message:"must have required property '"+"components"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.baseline === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "baseline"},message:"must have required property '"+"baseline"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.range === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "range"},message:"must have required property '"+"range"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.n === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "n"},message:"must have required property '"+"n"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data.sse === undefined){
const err5 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "sse"},message:"must have required property '"+"sse"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data.rmse === undefined){
const err6 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "rmse"},message:"must have required property '"+"rmse"+"'"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
if(data.rSquared === undefined){
const err7 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "rSquared"},message:"must have required property '"+"rSquared"+"'"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
if(data.iterations === undefined){
const err8 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "iterations"},message:"must have required property '"+"iterations"+"'"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
if(data.condition === undefined){
const err9 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "condition"},message:"must have required property '"+"condition"+"'"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
if(data.method === undefined){
const err10 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "method"},message:"must have required property '"+"method"+"'"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
for(const key0 in data){
if(!(func1.call(schema86.properties, key0))){
const err11 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
if(data.version !== undefined){
if(1 !== data.version){
const err12 = {instancePath:instancePath+"/version",schemaPath:"#/properties/version/const",keyword:"const",params:{allowedValue: 1},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
if(data.components !== undefined){
let data1 = data.components;
if(Array.isArray(data1)){
if(data1.length > 8){
const err13 = {instancePath:instancePath+"/components",schemaPath:"#/properties/components/maxItems",keyword:"maxItems",params:{limit: 8},message:"must NOT have more than 8 items"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
if(data1.length < 1){
const err14 = {instancePath:instancePath+"/components",schemaPath:"#/properties/components/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
const len0 = data1.length;
for(let i0=0; i0<len0; i0++){
let data2 = data1[i0];
if(data2 && typeof data2 == "object" && !Array.isArray(data2)){
if(data2.model === undefined){
const err15 = {instancePath:instancePath+"/components/" + i0,schemaPath:"#/$defs/peakFitComponent/required",keyword:"required",params:{missingProperty: "model"},message:"must have required property '"+"model"+"'"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
if(data2.center === undefined){
const err16 = {instancePath:instancePath+"/components/" + i0,schemaPath:"#/$defs/peakFitComponent/required",keyword:"required",params:{missingProperty: "center"},message:"must have required property '"+"center"+"'"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
if(data2.height === undefined){
const err17 = {instancePath:instancePath+"/components/" + i0,schemaPath:"#/$defs/peakFitComponent/required",keyword:"required",params:{missingProperty: "height"},message:"must have required property '"+"height"+"'"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
if(data2.fwhm === undefined){
const err18 = {instancePath:instancePath+"/components/" + i0,schemaPath:"#/$defs/peakFitComponent/required",keyword:"required",params:{missingProperty: "fwhm"},message:"must have required property '"+"fwhm"+"'"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
if(data2.eta === undefined){
const err19 = {instancePath:instancePath+"/components/" + i0,schemaPath:"#/$defs/peakFitComponent/required",keyword:"required",params:{missingProperty: "eta"},message:"must have required property '"+"eta"+"'"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
if(data2.area === undefined){
const err20 = {instancePath:instancePath+"/components/" + i0,schemaPath:"#/$defs/peakFitComponent/required",keyword:"required",params:{missingProperty: "area"},message:"must have required property '"+"area"+"'"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
for(const key1 in data2){
if(!((((((key1 === "model") || (key1 === "center")) || (key1 === "height")) || (key1 === "fwhm")) || (key1 === "eta")) || (key1 === "area"))){
const err21 = {instancePath:instancePath+"/components/" + i0,schemaPath:"#/$defs/peakFitComponent/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
}
if(data2.model !== undefined){
let data3 = data2.model;
if(!(((data3 === "gaussian") || (data3 === "lorentzian")) || (data3 === "pseudo-voigt"))){
const err22 = {instancePath:instancePath+"/components/" + i0+"/model",schemaPath:"#/$defs/peakFitComponent/properties/model/enum",keyword:"enum",params:{allowedValues: schema87.properties.model.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
}
if(data2.center !== undefined){
let data4 = data2.center;
if(!((typeof data4 == "number") && (isFinite(data4)))){
const err23 = {instancePath:instancePath+"/components/" + i0+"/center",schemaPath:"#/$defs/peakFitComponent/properties/center/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
}
if(data2.height !== undefined){
let data5 = data2.height;
if(!((typeof data5 == "number") && (isFinite(data5)))){
const err24 = {instancePath:instancePath+"/components/" + i0+"/height",schemaPath:"#/$defs/peakFitComponent/properties/height/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
}
if(data2.fwhm !== undefined){
let data6 = data2.fwhm;
if((typeof data6 == "number") && (isFinite(data6))){
if(data6 <= 0 || isNaN(data6)){
const err25 = {instancePath:instancePath+"/components/" + i0+"/fwhm",schemaPath:"#/$defs/peakFitComponent/properties/fwhm/exclusiveMinimum",keyword:"exclusiveMinimum",params:{comparison: ">", limit: 0},message:"must be > 0"};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
}
else {
const err26 = {instancePath:instancePath+"/components/" + i0+"/fwhm",schemaPath:"#/$defs/peakFitComponent/properties/fwhm/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
}
if(data2.eta !== undefined){
let data7 = data2.eta;
if((typeof data7 == "number") && (isFinite(data7))){
if(data7 > 1 || isNaN(data7)){
const err27 = {instancePath:instancePath+"/components/" + i0+"/eta",schemaPath:"#/$defs/peakFitComponent/properties/eta/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1},message:"must be <= 1"};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
if(data7 < 0 || isNaN(data7)){
const err28 = {instancePath:instancePath+"/components/" + i0+"/eta",schemaPath:"#/$defs/peakFitComponent/properties/eta/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
}
else {
const err29 = {instancePath:instancePath+"/components/" + i0+"/eta",schemaPath:"#/$defs/peakFitComponent/properties/eta/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
}
}
if(data2.area !== undefined){
let data8 = data2.area;
if(!((typeof data8 == "number") && (isFinite(data8)))){
const err30 = {instancePath:instancePath+"/components/" + i0+"/area",schemaPath:"#/$defs/peakFitComponent/properties/area/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err30];
}
else {
vErrors.push(err30);
}
errors++;
}
}
}
else {
const err31 = {instancePath:instancePath+"/components/" + i0,schemaPath:"#/$defs/peakFitComponent/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err31];
}
else {
vErrors.push(err31);
}
errors++;
}
}
}
else {
const err32 = {instancePath:instancePath+"/components",schemaPath:"#/properties/components/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err32];
}
else {
vErrors.push(err32);
}
errors++;
}
}
if(data.baseline !== undefined){
let data9 = data.baseline;
if(data9 && typeof data9 == "object" && !Array.isArray(data9)){
if(data9.mode === undefined){
const err33 = {instancePath:instancePath+"/baseline",schemaPath:"#/properties/baseline/required",keyword:"required",params:{missingProperty: "mode"},message:"must have required property '"+"mode"+"'"};
if(vErrors === null){
vErrors = [err33];
}
else {
vErrors.push(err33);
}
errors++;
}
if(data9.referenceX === undefined){
const err34 = {instancePath:instancePath+"/baseline",schemaPath:"#/properties/baseline/required",keyword:"required",params:{missingProperty: "referenceX"},message:"must have required property '"+"referenceX"+"'"};
if(vErrors === null){
vErrors = [err34];
}
else {
vErrors.push(err34);
}
errors++;
}
if(data9.intercept === undefined){
const err35 = {instancePath:instancePath+"/baseline",schemaPath:"#/properties/baseline/required",keyword:"required",params:{missingProperty: "intercept"},message:"must have required property '"+"intercept"+"'"};
if(vErrors === null){
vErrors = [err35];
}
else {
vErrors.push(err35);
}
errors++;
}
if(data9.slope === undefined){
const err36 = {instancePath:instancePath+"/baseline",schemaPath:"#/properties/baseline/required",keyword:"required",params:{missingProperty: "slope"},message:"must have required property '"+"slope"+"'"};
if(vErrors === null){
vErrors = [err36];
}
else {
vErrors.push(err36);
}
errors++;
}
for(const key2 in data9){
if(!((((key2 === "mode") || (key2 === "referenceX")) || (key2 === "intercept")) || (key2 === "slope"))){
const err37 = {instancePath:instancePath+"/baseline",schemaPath:"#/properties/baseline/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key2},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err37];
}
else {
vErrors.push(err37);
}
errors++;
}
}
if(data9.mode !== undefined){
let data10 = data9.mode;
if(!(((data10 === "none") || (data10 === "constant")) || (data10 === "linear"))){
const err38 = {instancePath:instancePath+"/baseline/mode",schemaPath:"#/properties/baseline/properties/mode/enum",keyword:"enum",params:{allowedValues: schema86.properties.baseline.properties.mode.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err38];
}
else {
vErrors.push(err38);
}
errors++;
}
}
if(data9.referenceX !== undefined){
let data11 = data9.referenceX;
if(!((typeof data11 == "number") && (isFinite(data11)))){
const err39 = {instancePath:instancePath+"/baseline/referenceX",schemaPath:"#/properties/baseline/properties/referenceX/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err39];
}
else {
vErrors.push(err39);
}
errors++;
}
}
if(data9.intercept !== undefined){
let data12 = data9.intercept;
if(!((typeof data12 == "number") && (isFinite(data12)))){
const err40 = {instancePath:instancePath+"/baseline/intercept",schemaPath:"#/properties/baseline/properties/intercept/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err40];
}
else {
vErrors.push(err40);
}
errors++;
}
}
if(data9.slope !== undefined){
let data13 = data9.slope;
if(!((typeof data13 == "number") && (isFinite(data13)))){
const err41 = {instancePath:instancePath+"/baseline/slope",schemaPath:"#/properties/baseline/properties/slope/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err41];
}
else {
vErrors.push(err41);
}
errors++;
}
}
}
else {
const err42 = {instancePath:instancePath+"/baseline",schemaPath:"#/properties/baseline/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err42];
}
else {
vErrors.push(err42);
}
errors++;
}
}
if(data.range !== undefined){
let data14 = data.range;
if(Array.isArray(data14)){
if(data14.length > 2){
const err43 = {instancePath:instancePath+"/range",schemaPath:"#/properties/range/maxItems",keyword:"maxItems",params:{limit: 2},message:"must NOT have more than 2 items"};
if(vErrors === null){
vErrors = [err43];
}
else {
vErrors.push(err43);
}
errors++;
}
if(data14.length < 2){
const err44 = {instancePath:instancePath+"/range",schemaPath:"#/properties/range/minItems",keyword:"minItems",params:{limit: 2},message:"must NOT have fewer than 2 items"};
if(vErrors === null){
vErrors = [err44];
}
else {
vErrors.push(err44);
}
errors++;
}
const len1 = data14.length;
for(let i1=0; i1<len1; i1++){
let data15 = data14[i1];
if(!((typeof data15 == "number") && (isFinite(data15)))){
const err45 = {instancePath:instancePath+"/range/" + i1,schemaPath:"#/properties/range/items/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err45];
}
else {
vErrors.push(err45);
}
errors++;
}
}
}
else {
const err46 = {instancePath:instancePath+"/range",schemaPath:"#/properties/range/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err46];
}
else {
vErrors.push(err46);
}
errors++;
}
}
if(data.n !== undefined){
let data16 = data.n;
if(!(((typeof data16 == "number") && (!(data16 % 1) && !isNaN(data16))) && (isFinite(data16)))){
const err47 = {instancePath:instancePath+"/n",schemaPath:"#/properties/n/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err47];
}
else {
vErrors.push(err47);
}
errors++;
}
if((typeof data16 == "number") && (isFinite(data16))){
if(data16 > 1000000 || isNaN(data16)){
const err48 = {instancePath:instancePath+"/n",schemaPath:"#/properties/n/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1000000},message:"must be <= 1000000"};
if(vErrors === null){
vErrors = [err48];
}
else {
vErrors.push(err48);
}
errors++;
}
if(data16 < 1 || isNaN(data16)){
const err49 = {instancePath:instancePath+"/n",schemaPath:"#/properties/n/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
if(vErrors === null){
vErrors = [err49];
}
else {
vErrors.push(err49);
}
errors++;
}
}
}
if(data.sse !== undefined){
let data17 = data.sse;
if((typeof data17 == "number") && (isFinite(data17))){
if(data17 < 0 || isNaN(data17)){
const err50 = {instancePath:instancePath+"/sse",schemaPath:"#/properties/sse/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err50];
}
else {
vErrors.push(err50);
}
errors++;
}
}
else {
const err51 = {instancePath:instancePath+"/sse",schemaPath:"#/properties/sse/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err51];
}
else {
vErrors.push(err51);
}
errors++;
}
}
if(data.rmse !== undefined){
let data18 = data.rmse;
if((typeof data18 == "number") && (isFinite(data18))){
if(data18 < 0 || isNaN(data18)){
const err52 = {instancePath:instancePath+"/rmse",schemaPath:"#/properties/rmse/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err52];
}
else {
vErrors.push(err52);
}
errors++;
}
}
else {
const err53 = {instancePath:instancePath+"/rmse",schemaPath:"#/properties/rmse/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err53];
}
else {
vErrors.push(err53);
}
errors++;
}
}
if(data.rSquared !== undefined){
let data19 = data.rSquared;
if((!((typeof data19 == "number") && (isFinite(data19)))) && (data19 !== null)){
const err54 = {instancePath:instancePath+"/rSquared",schemaPath:"#/properties/rSquared/type",keyword:"type",params:{type: schema86.properties.rSquared.type},message:"must be number,null"};
if(vErrors === null){
vErrors = [err54];
}
else {
vErrors.push(err54);
}
errors++;
}
}
if(data.iterations !== undefined){
let data20 = data.iterations;
if(!(((typeof data20 == "number") && (!(data20 % 1) && !isNaN(data20))) && (isFinite(data20)))){
const err55 = {instancePath:instancePath+"/iterations",schemaPath:"#/properties/iterations/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err55];
}
else {
vErrors.push(err55);
}
errors++;
}
if((typeof data20 == "number") && (isFinite(data20))){
if(data20 > 1000 || isNaN(data20)){
const err56 = {instancePath:instancePath+"/iterations",schemaPath:"#/properties/iterations/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1000},message:"must be <= 1000"};
if(vErrors === null){
vErrors = [err56];
}
else {
vErrors.push(err56);
}
errors++;
}
if(data20 < 0 || isNaN(data20)){
const err57 = {instancePath:instancePath+"/iterations",schemaPath:"#/properties/iterations/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err57];
}
else {
vErrors.push(err57);
}
errors++;
}
}
}
if(data.condition !== undefined){
let data21 = data.condition;
if((typeof data21 == "number") && (isFinite(data21))){
if(data21 > 1000000000000 || isNaN(data21)){
const err58 = {instancePath:instancePath+"/condition",schemaPath:"#/properties/condition/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1000000000000},message:"must be <= 1000000000000"};
if(vErrors === null){
vErrors = [err58];
}
else {
vErrors.push(err58);
}
errors++;
}
if(data21 < 1 || isNaN(data21)){
const err59 = {instancePath:instancePath+"/condition",schemaPath:"#/properties/condition/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
if(vErrors === null){
vErrors = [err59];
}
else {
vErrors.push(err59);
}
errors++;
}
}
else {
const err60 = {instancePath:instancePath+"/condition",schemaPath:"#/properties/condition/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err60];
}
else {
vErrors.push(err60);
}
errors++;
}
}
if(data.method !== undefined){
if("scaled-projected-lm-givens-qr" !== data.method){
const err61 = {instancePath:instancePath+"/method",schemaPath:"#/properties/method/const",keyword:"const",params:{allowedValue: "scaled-projected-lm-givens-qr"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err61];
}
else {
vErrors.push(err61);
}
errors++;
}
}
}
else {
const err62 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err62];
}
else {
vErrors.push(err62);
}
errors++;
}
validate55.errors = vErrors;
return errors === 0;
}
validate55.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate54(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate54.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.id === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.kind === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "kind"},message:"must have required property '"+"kind"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.sourceDatasetIds === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "sourceDatasetIds"},message:"must have required property '"+"sourceDatasetIds"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.resultDatasetId === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "resultDatasetId"},message:"must have required property '"+"resultDatasetId"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.parameters === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "parameters"},message:"must have required property '"+"parameters"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data.algorithmVersion === undefined){
const err5 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "algorithmVersion"},message:"must have required property '"+"algorithmVersion"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data.status === undefined){
const err6 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "status"},message:"must have required property '"+"status"+"'"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
if(data.summary === undefined){
const err7 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "summary"},message:"must have required property '"+"summary"+"'"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
for(const key0 in data){
if(!(func1.call(schema84.properties, key0))){
const err8 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
if(data.id !== undefined){
let data0 = data.id;
if(typeof data0 === "string"){
if(!pattern6.test(data0)){
const err9 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"+"\""};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
else {
const err10 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
if(data.kind !== undefined){
let data1 = data.kind;
if(!(((((((((((((((data1 === "linear-fit") || (data1 === "polynomial-fit")) || (data1 === "exponential-fit")) || (data1 === "power-fit")) || (data1 === "savitzky-golay")) || (data1 === "moving-average")) || (data1 === "derivative")) || (data1 === "integral")) || (data1 === "interpolation")) || (data1 === "statistics")) || (data1 === "baseline")) || (data1 === "peaks")) || (data1 === "area")) || (data1 === "peak-fit")) || (data1 === "peak-fit-output"))){
const err11 = {instancePath:instancePath+"/kind",schemaPath:"#/properties/kind/enum",keyword:"enum",params:{allowedValues: schema84.properties.kind.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
if(data.sourceDatasetIds !== undefined){
let data2 = data.sourceDatasetIds;
if(Array.isArray(data2)){
if(data2.length < 1){
const err12 = {instancePath:instancePath+"/sourceDatasetIds",schemaPath:"#/properties/sourceDatasetIds/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
const len0 = data2.length;
for(let i0=0; i0<len0; i0++){
let data3 = data2[i0];
if(typeof data3 === "string"){
if(!pattern6.test(data3)){
const err13 = {instancePath:instancePath+"/sourceDatasetIds/" + i0,schemaPath:"#/properties/sourceDatasetIds/items/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"+"\""};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
else {
const err14 = {instancePath:instancePath+"/sourceDatasetIds/" + i0,schemaPath:"#/properties/sourceDatasetIds/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
}
else {
const err15 = {instancePath:instancePath+"/sourceDatasetIds",schemaPath:"#/properties/sourceDatasetIds/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
if(data.resultDatasetId !== undefined){
let data4 = data.resultDatasetId;
const _errs10 = errors;
let valid3 = false;
const _errs11 = errors;
if(typeof data4 === "string"){
if(!pattern6.test(data4)){
const err16 = {instancePath:instancePath+"/resultDatasetId",schemaPath:"#/properties/resultDatasetId/anyOf/0/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"+"\""};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
}
else {
const err17 = {instancePath:instancePath+"/resultDatasetId",schemaPath:"#/properties/resultDatasetId/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
var _valid0 = _errs11 === errors;
valid3 = valid3 || _valid0;
const _errs13 = errors;
if(data4 !== null){
const err18 = {instancePath:instancePath+"/resultDatasetId",schemaPath:"#/properties/resultDatasetId/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
var _valid0 = _errs13 === errors;
valid3 = valid3 || _valid0;
if(!valid3){
const err19 = {instancePath:instancePath+"/resultDatasetId",schemaPath:"#/properties/resultDatasetId/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
else {
errors = _errs10;
if(vErrors !== null){
if(_errs10){
vErrors.length = _errs10;
}
else {
vErrors = null;
}
}
}
}
if(data.parameters !== undefined){
let data5 = data.parameters;
if(data5 && typeof data5 == "object" && !Array.isArray(data5)){
if(Object.keys(data5).length > 60){
const err20 = {instancePath:instancePath+"/parameters",schemaPath:"#/properties/parameters/maxProperties",keyword:"maxProperties",params:{limit: 60},message:"must NOT have more than 60 properties"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
for(const key1 in data5){
let data6 = data5[key1];
if((((typeof data6 != "object") && (typeof data6 !== "string")) && (!((typeof data6 == "number") && (isFinite(data6))))) && (typeof data6 !== "boolean")){
const err21 = {instancePath:instancePath+"/parameters/" + key1.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/properties/parameters/additionalProperties/type",keyword:"type",params:{type: schema84.properties.parameters.additionalProperties.type},message:"must be string,number,integer,boolean,null,array,object"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
}
}
else {
const err22 = {instancePath:instancePath+"/parameters",schemaPath:"#/properties/parameters/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
}
if(data.algorithmVersion !== undefined){
let data7 = data.algorithmVersion;
if(!(((typeof data7 == "number") && (!(data7 % 1) && !isNaN(data7))) && (isFinite(data7)))){
const err23 = {instancePath:instancePath+"/algorithmVersion",schemaPath:"#/properties/algorithmVersion/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
if((typeof data7 == "number") && (isFinite(data7))){
if(data7 < 1 || isNaN(data7)){
const err24 = {instancePath:instancePath+"/algorithmVersion",schemaPath:"#/properties/algorithmVersion/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
}
}
if(data.status !== undefined){
let data8 = data.status;
if(!(((data8 === "valid") || (data8 === "outdated")) || (data8 === "invalid"))){
const err25 = {instancePath:instancePath+"/status",schemaPath:"#/properties/status/enum",keyword:"enum",params:{allowedValues: schema84.properties.status.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
}
if(data.summary !== undefined){
let data9 = data.summary;
if(data9 && typeof data9 == "object" && !Array.isArray(data9)){
if(Object.keys(data9).length > 60){
const err26 = {instancePath:instancePath+"/summary",schemaPath:"#/properties/summary/maxProperties",keyword:"maxProperties",params:{limit: 60},message:"must NOT have more than 60 properties"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
for(const key2 in data9){
let data10 = data9[key2];
if((((typeof data10 !== "string") && (!((typeof data10 == "number") && (isFinite(data10))))) && (typeof data10 !== "boolean")) && (data10 !== null)){
const err27 = {instancePath:instancePath+"/summary/" + key2.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/properties/summary/additionalProperties/type",keyword:"type",params:{type: schema84.properties.summary.additionalProperties.type},message:"must be string,number,integer,boolean,null"};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
}
}
else {
const err28 = {instancePath:instancePath+"/summary",schemaPath:"#/properties/summary/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
}
if(data.data !== undefined){
let data11 = data.data;
if(data11 && typeof data11 == "object" && !Array.isArray(data11)){
for(const key3 in data11){
if(!((key3 === "peaks") || (key3 === "peakFit"))){
const err29 = {instancePath:instancePath+"/data",schemaPath:"#/properties/data/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key3},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
}
}
if(data11.peaks !== undefined){
let data12 = data11.peaks;
if(Array.isArray(data12)){
if(data12.length > 1000000){
const err30 = {instancePath:instancePath+"/data/peaks",schemaPath:"#/properties/data/properties/peaks/maxItems",keyword:"maxItems",params:{limit: 1000000},message:"must NOT have more than 1000000 items"};
if(vErrors === null){
vErrors = [err30];
}
else {
vErrors.push(err30);
}
errors++;
}
const len1 = data12.length;
for(let i1=0; i1<len1; i1++){
let data13 = data12[i1];
if(data13 && typeof data13 == "object" && !Array.isArray(data13)){
if(data13.index === undefined){
const err31 = {instancePath:instancePath+"/data/peaks/" + i1,schemaPath:"#/$defs/peakMeasurement/required",keyword:"required",params:{missingProperty: "index"},message:"must have required property '"+"index"+"'"};
if(vErrors === null){
vErrors = [err31];
}
else {
vErrors.push(err31);
}
errors++;
}
if(data13.x === undefined){
const err32 = {instancePath:instancePath+"/data/peaks/" + i1,schemaPath:"#/$defs/peakMeasurement/required",keyword:"required",params:{missingProperty: "x"},message:"must have required property '"+"x"+"'"};
if(vErrors === null){
vErrors = [err32];
}
else {
vErrors.push(err32);
}
errors++;
}
if(data13.y === undefined){
const err33 = {instancePath:instancePath+"/data/peaks/" + i1,schemaPath:"#/$defs/peakMeasurement/required",keyword:"required",params:{missingProperty: "y"},message:"must have required property '"+"y"+"'"};
if(vErrors === null){
vErrors = [err33];
}
else {
vErrors.push(err33);
}
errors++;
}
if(data13.direction === undefined){
const err34 = {instancePath:instancePath+"/data/peaks/" + i1,schemaPath:"#/$defs/peakMeasurement/required",keyword:"required",params:{missingProperty: "direction"},message:"must have required property '"+"direction"+"'"};
if(vErrors === null){
vErrors = [err34];
}
else {
vErrors.push(err34);
}
errors++;
}
if(data13.prominence === undefined){
const err35 = {instancePath:instancePath+"/data/peaks/" + i1,schemaPath:"#/$defs/peakMeasurement/required",keyword:"required",params:{missingProperty: "prominence"},message:"must have required property '"+"prominence"+"'"};
if(vErrors === null){
vErrors = [err35];
}
else {
vErrors.push(err35);
}
errors++;
}
if(data13.width === undefined){
const err36 = {instancePath:instancePath+"/data/peaks/" + i1,schemaPath:"#/$defs/peakMeasurement/required",keyword:"required",params:{missingProperty: "width"},message:"must have required property '"+"width"+"'"};
if(vErrors === null){
vErrors = [err36];
}
else {
vErrors.push(err36);
}
errors++;
}
if(data13.left === undefined){
const err37 = {instancePath:instancePath+"/data/peaks/" + i1,schemaPath:"#/$defs/peakMeasurement/required",keyword:"required",params:{missingProperty: "left"},message:"must have required property '"+"left"+"'"};
if(vErrors === null){
vErrors = [err37];
}
else {
vErrors.push(err37);
}
errors++;
}
if(data13.right === undefined){
const err38 = {instancePath:instancePath+"/data/peaks/" + i1,schemaPath:"#/$defs/peakMeasurement/required",keyword:"required",params:{missingProperty: "right"},message:"must have required property '"+"right"+"'"};
if(vErrors === null){
vErrors = [err38];
}
else {
vErrors.push(err38);
}
errors++;
}
if(data13.level === undefined){
const err39 = {instancePath:instancePath+"/data/peaks/" + i1,schemaPath:"#/$defs/peakMeasurement/required",keyword:"required",params:{missingProperty: "level"},message:"must have required property '"+"level"+"'"};
if(vErrors === null){
vErrors = [err39];
}
else {
vErrors.push(err39);
}
errors++;
}
if(data13.incomplete === undefined){
const err40 = {instancePath:instancePath+"/data/peaks/" + i1,schemaPath:"#/$defs/peakMeasurement/required",keyword:"required",params:{missingProperty: "incomplete"},message:"must have required property '"+"incomplete"+"'"};
if(vErrors === null){
vErrors = [err40];
}
else {
vErrors.push(err40);
}
errors++;
}
for(const key4 in data13){
if(!(func1.call(schema85.properties, key4))){
const err41 = {instancePath:instancePath+"/data/peaks/" + i1,schemaPath:"#/$defs/peakMeasurement/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key4},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err41];
}
else {
vErrors.push(err41);
}
errors++;
}
}
if(data13.index !== undefined){
let data14 = data13.index;
if(!(((typeof data14 == "number") && (!(data14 % 1) && !isNaN(data14))) && (isFinite(data14)))){
const err42 = {instancePath:instancePath+"/data/peaks/" + i1+"/index",schemaPath:"#/$defs/peakMeasurement/properties/index/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err42];
}
else {
vErrors.push(err42);
}
errors++;
}
if((typeof data14 == "number") && (isFinite(data14))){
if(data14 < 0 || isNaN(data14)){
const err43 = {instancePath:instancePath+"/data/peaks/" + i1+"/index",schemaPath:"#/$defs/peakMeasurement/properties/index/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err43];
}
else {
vErrors.push(err43);
}
errors++;
}
}
}
if(data13.x !== undefined){
let data15 = data13.x;
if(!((typeof data15 == "number") && (isFinite(data15)))){
const err44 = {instancePath:instancePath+"/data/peaks/" + i1+"/x",schemaPath:"#/$defs/peakMeasurement/properties/x/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err44];
}
else {
vErrors.push(err44);
}
errors++;
}
}
if(data13.y !== undefined){
let data16 = data13.y;
if(!((typeof data16 == "number") && (isFinite(data16)))){
const err45 = {instancePath:instancePath+"/data/peaks/" + i1+"/y",schemaPath:"#/$defs/peakMeasurement/properties/y/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err45];
}
else {
vErrors.push(err45);
}
errors++;
}
}
if(data13.direction !== undefined){
let data17 = data13.direction;
if(!((data17 === "max") || (data17 === "min"))){
const err46 = {instancePath:instancePath+"/data/peaks/" + i1+"/direction",schemaPath:"#/$defs/peakMeasurement/properties/direction/enum",keyword:"enum",params:{allowedValues: schema85.properties.direction.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err46];
}
else {
vErrors.push(err46);
}
errors++;
}
}
if(data13.prominence !== undefined){
let data18 = data13.prominence;
if((!((typeof data18 == "number") && (isFinite(data18)))) && (data18 !== null)){
const err47 = {instancePath:instancePath+"/data/peaks/" + i1+"/prominence",schemaPath:"#/$defs/peakMeasurement/properties/prominence/type",keyword:"type",params:{type: schema85.properties.prominence.type},message:"must be number,null"};
if(vErrors === null){
vErrors = [err47];
}
else {
vErrors.push(err47);
}
errors++;
}
if((typeof data18 == "number") && (isFinite(data18))){
if(data18 < 0 || isNaN(data18)){
const err48 = {instancePath:instancePath+"/data/peaks/" + i1+"/prominence",schemaPath:"#/$defs/peakMeasurement/properties/prominence/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err48];
}
else {
vErrors.push(err48);
}
errors++;
}
}
}
if(data13.width !== undefined){
let data19 = data13.width;
if((!((typeof data19 == "number") && (isFinite(data19)))) && (data19 !== null)){
const err49 = {instancePath:instancePath+"/data/peaks/" + i1+"/width",schemaPath:"#/$defs/peakMeasurement/properties/width/type",keyword:"type",params:{type: schema85.properties.width.type},message:"must be number,null"};
if(vErrors === null){
vErrors = [err49];
}
else {
vErrors.push(err49);
}
errors++;
}
if((typeof data19 == "number") && (isFinite(data19))){
if(data19 < 0 || isNaN(data19)){
const err50 = {instancePath:instancePath+"/data/peaks/" + i1+"/width",schemaPath:"#/$defs/peakMeasurement/properties/width/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err50];
}
else {
vErrors.push(err50);
}
errors++;
}
}
}
if(data13.left !== undefined){
let data20 = data13.left;
if((!((typeof data20 == "number") && (isFinite(data20)))) && (data20 !== null)){
const err51 = {instancePath:instancePath+"/data/peaks/" + i1+"/left",schemaPath:"#/$defs/peakMeasurement/properties/left/type",keyword:"type",params:{type: schema85.properties.left.type},message:"must be number,null"};
if(vErrors === null){
vErrors = [err51];
}
else {
vErrors.push(err51);
}
errors++;
}
}
if(data13.right !== undefined){
let data21 = data13.right;
if((!((typeof data21 == "number") && (isFinite(data21)))) && (data21 !== null)){
const err52 = {instancePath:instancePath+"/data/peaks/" + i1+"/right",schemaPath:"#/$defs/peakMeasurement/properties/right/type",keyword:"type",params:{type: schema85.properties.right.type},message:"must be number,null"};
if(vErrors === null){
vErrors = [err52];
}
else {
vErrors.push(err52);
}
errors++;
}
}
if(data13.level !== undefined){
let data22 = data13.level;
if((!((typeof data22 == "number") && (isFinite(data22)))) && (data22 !== null)){
const err53 = {instancePath:instancePath+"/data/peaks/" + i1+"/level",schemaPath:"#/$defs/peakMeasurement/properties/level/type",keyword:"type",params:{type: schema85.properties.level.type},message:"must be number,null"};
if(vErrors === null){
vErrors = [err53];
}
else {
vErrors.push(err53);
}
errors++;
}
}
if(data13.incomplete !== undefined){
if(typeof data13.incomplete !== "boolean"){
const err54 = {instancePath:instancePath+"/data/peaks/" + i1+"/incomplete",schemaPath:"#/$defs/peakMeasurement/properties/incomplete/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err54];
}
else {
vErrors.push(err54);
}
errors++;
}
}
}
else {
const err55 = {instancePath:instancePath+"/data/peaks/" + i1,schemaPath:"#/$defs/peakMeasurement/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err55];
}
else {
vErrors.push(err55);
}
errors++;
}
}
}
else {
const err56 = {instancePath:instancePath+"/data/peaks",schemaPath:"#/properties/data/properties/peaks/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err56];
}
else {
vErrors.push(err56);
}
errors++;
}
}
if(data11.peakFit !== undefined){
if(!(validate55(data11.peakFit, {instancePath:instancePath+"/data/peakFit",parentData:data11,parentDataProperty:"peakFit",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate55.errors : vErrors.concat(validate55.errors);
errors = vErrors.length;
}
}
}
else {
const err57 = {instancePath:instancePath+"/data",schemaPath:"#/properties/data/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err57];
}
else {
vErrors.push(err57);
}
errors++;
}
}
if(data.display !== undefined){
let data25 = data.display;
if(data25 && typeof data25 == "object" && !Array.isArray(data25)){
if(data25.visible === undefined){
const err58 = {instancePath:instancePath+"/display",schemaPath:"#/properties/display/required",keyword:"required",params:{missingProperty: "visible"},message:"must have required property '"+"visible"+"'"};
if(vErrors === null){
vErrors = [err58];
}
else {
vErrors.push(err58);
}
errors++;
}
if(data25.stroke === undefined){
const err59 = {instancePath:instancePath+"/display",schemaPath:"#/properties/display/required",keyword:"required",params:{missingProperty: "stroke"},message:"must have required property '"+"stroke"+"'"};
if(vErrors === null){
vErrors = [err59];
}
else {
vErrors.push(err59);
}
errors++;
}
if(data25.opacity === undefined){
const err60 = {instancePath:instancePath+"/display",schemaPath:"#/properties/display/required",keyword:"required",params:{missingProperty: "opacity"},message:"must have required property '"+"opacity"+"'"};
if(vErrors === null){
vErrors = [err60];
}
else {
vErrors.push(err60);
}
errors++;
}
if(data25.label === undefined){
const err61 = {instancePath:instancePath+"/display",schemaPath:"#/properties/display/required",keyword:"required",params:{missingProperty: "label"},message:"must have required property '"+"label"+"'"};
if(vErrors === null){
vErrors = [err61];
}
else {
vErrors.push(err61);
}
errors++;
}
for(const key5 in data25){
if(!((((key5 === "visible") || (key5 === "stroke")) || (key5 === "opacity")) || (key5 === "label"))){
const err62 = {instancePath:instancePath+"/display",schemaPath:"#/properties/display/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key5},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err62];
}
else {
vErrors.push(err62);
}
errors++;
}
}
if(data25.visible !== undefined){
if(typeof data25.visible !== "boolean"){
const err63 = {instancePath:instancePath+"/display/visible",schemaPath:"#/properties/display/properties/visible/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err63];
}
else {
vErrors.push(err63);
}
errors++;
}
}
if(data25.stroke !== undefined){
let data27 = data25.stroke;
if(typeof data27 === "string"){
if(!pattern7.test(data27)){
const err64 = {instancePath:instancePath+"/display/stroke",schemaPath:"#/properties/display/properties/stroke/pattern",keyword:"pattern",params:{pattern: "^#[0-9A-Fa-f]{6}$"},message:"must match pattern \""+"^#[0-9A-Fa-f]{6}$"+"\""};
if(vErrors === null){
vErrors = [err64];
}
else {
vErrors.push(err64);
}
errors++;
}
}
else {
const err65 = {instancePath:instancePath+"/display/stroke",schemaPath:"#/properties/display/properties/stroke/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err65];
}
else {
vErrors.push(err65);
}
errors++;
}
}
if(data25.opacity !== undefined){
let data28 = data25.opacity;
if((typeof data28 == "number") && (isFinite(data28))){
if(data28 > 1 || isNaN(data28)){
const err66 = {instancePath:instancePath+"/display/opacity",schemaPath:"#/properties/display/properties/opacity/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1},message:"must be <= 1"};
if(vErrors === null){
vErrors = [err66];
}
else {
vErrors.push(err66);
}
errors++;
}
if(data28 < 0 || isNaN(data28)){
const err67 = {instancePath:instancePath+"/display/opacity",schemaPath:"#/properties/display/properties/opacity/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err67];
}
else {
vErrors.push(err67);
}
errors++;
}
}
else {
const err68 = {instancePath:instancePath+"/display/opacity",schemaPath:"#/properties/display/properties/opacity/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err68];
}
else {
vErrors.push(err68);
}
errors++;
}
}
if(data25.label !== undefined){
if(typeof data25.label !== "boolean"){
const err69 = {instancePath:instancePath+"/display/label",schemaPath:"#/properties/display/properties/label/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err69];
}
else {
vErrors.push(err69);
}
errors++;
}
}
}
else {
const err70 = {instancePath:instancePath+"/display",schemaPath:"#/properties/display/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err70];
}
else {
vErrors.push(err70);
}
errors++;
}
}
}
else {
const err71 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err71];
}
else {
vErrors.push(err71);
}
errors++;
}
validate54.errors = vErrors;
return errors === 0;
}
validate54.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate45(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
/*# sourceURL="https://github.com/anatamien/APIO-GRAPH/blob/main/schemas/aph-1.3.schema.json" */;
let vErrors = null;
let errors = 0;
const evaluated0 = validate45.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.format === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "format"},message:"must have required property '"+"format"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.schemaVersion === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "schemaVersion"},message:"must have required property '"+"schemaVersion"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.createdWith === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "createdWith"},message:"must have required property '"+"createdWith"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.project === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "project"},message:"must have required property '"+"project"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.page === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "page"},message:"must have required property '"+"page"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data.axes === undefined){
const err5 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "axes"},message:"must have required property '"+"axes"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data.datasets === undefined){
const err6 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "datasets"},message:"must have required property '"+"datasets"+"'"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
if(data.series === undefined){
const err7 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "series"},message:"must have required property '"+"series"+"'"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
if(data.objects === undefined){
const err8 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "objects"},message:"must have required property '"+"objects"+"'"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
if(data.calculations === undefined){
const err9 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "calculations"},message:"must have required property '"+"calculations"+"'"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
if(data.legend === undefined){
const err10 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "legend"},message:"must have required property '"+"legend"+"'"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
if(data.viewport === undefined){
const err11 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "viewport"},message:"must have required property '"+"viewport"+"'"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
if(data.editor === undefined){
const err12 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "editor"},message:"must have required property '"+"editor"+"'"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
if(data.extensions === undefined){
const err13 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "extensions"},message:"must have required property '"+"extensions"+"'"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
for(const key0 in data){
if(!(func1.call(schema69.properties, key0))){
const err14 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
if(data.format !== undefined){
if("APIO_GRAPH_PROJECT" !== data.format){
const err15 = {instancePath:instancePath+"/format",schemaPath:"#/properties/format/const",keyword:"const",params:{allowedValue: "APIO_GRAPH_PROJECT"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
if(data.schemaVersion !== undefined){
let data1 = data.schemaVersion;
if(typeof data1 === "string"){
if(!pattern83.test(data1)){
const err16 = {instancePath:instancePath+"/schemaVersion",schemaPath:"#/properties/schemaVersion/pattern",keyword:"pattern",params:{pattern: "^1\\.3\\.[0-9]+$"},message:"must match pattern \""+"^1\\.3\\.[0-9]+$"+"\""};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
}
else {
const err17 = {instancePath:instancePath+"/schemaVersion",schemaPath:"#/properties/schemaVersion/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
}
if(data.createdWith !== undefined){
let data2 = data.createdWith;
if(data2 && typeof data2 == "object" && !Array.isArray(data2)){
if(data2.name === undefined){
const err18 = {instancePath:instancePath+"/createdWith",schemaPath:"#/properties/createdWith/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
if(data2.version === undefined){
const err19 = {instancePath:instancePath+"/createdWith",schemaPath:"#/properties/createdWith/required",keyword:"required",params:{missingProperty: "version"},message:"must have required property '"+"version"+"'"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
for(const key1 in data2){
if(!((key1 === "name") || (key1 === "version"))){
const err20 = {instancePath:instancePath+"/createdWith",schemaPath:"#/properties/createdWith/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
}
if(data2.name !== undefined){
if("APIO GRAPH" !== data2.name){
const err21 = {instancePath:instancePath+"/createdWith/name",schemaPath:"#/properties/createdWith/properties/name/const",keyword:"const",params:{allowedValue: "APIO GRAPH"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
}
if(data2.version !== undefined){
let data4 = data2.version;
if(typeof data4 === "string"){
if(func2(data4) < 1){
const err22 = {instancePath:instancePath+"/createdWith/version",schemaPath:"#/properties/createdWith/properties/version/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
}
else {
const err23 = {instancePath:instancePath+"/createdWith/version",schemaPath:"#/properties/createdWith/properties/version/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
}
}
else {
const err24 = {instancePath:instancePath+"/createdWith",schemaPath:"#/properties/createdWith/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
}
if(data.project !== undefined){
let data5 = data.project;
if(data5 && typeof data5 == "object" && !Array.isArray(data5)){
if(data5.id === undefined){
const err25 = {instancePath:instancePath+"/project",schemaPath:"#/properties/project/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
if(data5.title === undefined){
const err26 = {instancePath:instancePath+"/project",schemaPath:"#/properties/project/required",keyword:"required",params:{missingProperty: "title"},message:"must have required property '"+"title"+"'"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
if(data5.createdAt === undefined){
const err27 = {instancePath:instancePath+"/project",schemaPath:"#/properties/project/required",keyword:"required",params:{missingProperty: "createdAt"},message:"must have required property '"+"createdAt"+"'"};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
if(data5.updatedAt === undefined){
const err28 = {instancePath:instancePath+"/project",schemaPath:"#/properties/project/required",keyword:"required",params:{missingProperty: "updatedAt"},message:"must have required property '"+"updatedAt"+"'"};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
for(const key2 in data5){
if(!((((key2 === "id") || (key2 === "title")) || (key2 === "createdAt")) || (key2 === "updatedAt"))){
const err29 = {instancePath:instancePath+"/project",schemaPath:"#/properties/project/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key2},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
}
}
if(data5.id !== undefined){
let data6 = data5.id;
if(typeof data6 === "string"){
if(!pattern6.test(data6)){
const err30 = {instancePath:instancePath+"/project/id",schemaPath:"#/properties/project/properties/id/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"+"\""};
if(vErrors === null){
vErrors = [err30];
}
else {
vErrors.push(err30);
}
errors++;
}
}
else {
const err31 = {instancePath:instancePath+"/project/id",schemaPath:"#/properties/project/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err31];
}
else {
vErrors.push(err31);
}
errors++;
}
}
if(data5.title !== undefined){
let data7 = data5.title;
if(typeof data7 === "string"){
if(func2(data7) > 300){
const err32 = {instancePath:instancePath+"/project/title",schemaPath:"#/properties/project/properties/title/maxLength",keyword:"maxLength",params:{limit: 300},message:"must NOT have more than 300 characters"};
if(vErrors === null){
vErrors = [err32];
}
else {
vErrors.push(err32);
}
errors++;
}
}
else {
const err33 = {instancePath:instancePath+"/project/title",schemaPath:"#/properties/project/properties/title/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err33];
}
else {
vErrors.push(err33);
}
errors++;
}
}
if(data5.createdAt !== undefined){
let data8 = data5.createdAt;
if(typeof data8 === "string"){
if(!(formats0.validate(data8))){
const err34 = {instancePath:instancePath+"/project/createdAt",schemaPath:"#/properties/project/properties/createdAt/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
if(vErrors === null){
vErrors = [err34];
}
else {
vErrors.push(err34);
}
errors++;
}
}
else {
const err35 = {instancePath:instancePath+"/project/createdAt",schemaPath:"#/properties/project/properties/createdAt/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err35];
}
else {
vErrors.push(err35);
}
errors++;
}
}
if(data5.updatedAt !== undefined){
let data9 = data5.updatedAt;
if(typeof data9 === "string"){
if(!(formats0.validate(data9))){
const err36 = {instancePath:instancePath+"/project/updatedAt",schemaPath:"#/properties/project/properties/updatedAt/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
if(vErrors === null){
vErrors = [err36];
}
else {
vErrors.push(err36);
}
errors++;
}
}
else {
const err37 = {instancePath:instancePath+"/project/updatedAt",schemaPath:"#/properties/project/properties/updatedAt/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err37];
}
else {
vErrors.push(err37);
}
errors++;
}
}
}
else {
const err38 = {instancePath:instancePath+"/project",schemaPath:"#/properties/project/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err38];
}
else {
vErrors.push(err38);
}
errors++;
}
}
if(data.page !== undefined){
let data10 = data.page;
if(data10 && typeof data10 == "object" && !Array.isArray(data10)){
if(data10.widthPx === undefined){
const err39 = {instancePath:instancePath+"/page",schemaPath:"#/properties/page/required",keyword:"required",params:{missingProperty: "widthPx"},message:"must have required property '"+"widthPx"+"'"};
if(vErrors === null){
vErrors = [err39];
}
else {
vErrors.push(err39);
}
errors++;
}
if(data10.heightPx === undefined){
const err40 = {instancePath:instancePath+"/page",schemaPath:"#/properties/page/required",keyword:"required",params:{missingProperty: "heightPx"},message:"must have required property '"+"heightPx"+"'"};
if(vErrors === null){
vErrors = [err40];
}
else {
vErrors.push(err40);
}
errors++;
}
if(data10.background === undefined){
const err41 = {instancePath:instancePath+"/page",schemaPath:"#/properties/page/required",keyword:"required",params:{missingProperty: "background"},message:"must have required property '"+"background"+"'"};
if(vErrors === null){
vErrors = [err41];
}
else {
vErrors.push(err41);
}
errors++;
}
if(data10.paddingPx === undefined){
const err42 = {instancePath:instancePath+"/page",schemaPath:"#/properties/page/required",keyword:"required",params:{missingProperty: "paddingPx"},message:"must have required property '"+"paddingPx"+"'"};
if(vErrors === null){
vErrors = [err42];
}
else {
vErrors.push(err42);
}
errors++;
}
for(const key3 in data10){
if(!((((key3 === "widthPx") || (key3 === "heightPx")) || (key3 === "background")) || (key3 === "paddingPx"))){
const err43 = {instancePath:instancePath+"/page",schemaPath:"#/properties/page/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key3},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err43];
}
else {
vErrors.push(err43);
}
errors++;
}
}
if(data10.widthPx !== undefined){
let data11 = data10.widthPx;
if(!(((typeof data11 == "number") && (!(data11 % 1) && !isNaN(data11))) && (isFinite(data11)))){
const err44 = {instancePath:instancePath+"/page/widthPx",schemaPath:"#/properties/page/properties/widthPx/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err44];
}
else {
vErrors.push(err44);
}
errors++;
}
if((typeof data11 == "number") && (isFinite(data11))){
if(data11 > 30000 || isNaN(data11)){
const err45 = {instancePath:instancePath+"/page/widthPx",schemaPath:"#/properties/page/properties/widthPx/maximum",keyword:"maximum",params:{comparison: "<=", limit: 30000},message:"must be <= 30000"};
if(vErrors === null){
vErrors = [err45];
}
else {
vErrors.push(err45);
}
errors++;
}
if(data11 < 100 || isNaN(data11)){
const err46 = {instancePath:instancePath+"/page/widthPx",schemaPath:"#/properties/page/properties/widthPx/minimum",keyword:"minimum",params:{comparison: ">=", limit: 100},message:"must be >= 100"};
if(vErrors === null){
vErrors = [err46];
}
else {
vErrors.push(err46);
}
errors++;
}
}
}
if(data10.heightPx !== undefined){
let data12 = data10.heightPx;
if(!(((typeof data12 == "number") && (!(data12 % 1) && !isNaN(data12))) && (isFinite(data12)))){
const err47 = {instancePath:instancePath+"/page/heightPx",schemaPath:"#/properties/page/properties/heightPx/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err47];
}
else {
vErrors.push(err47);
}
errors++;
}
if((typeof data12 == "number") && (isFinite(data12))){
if(data12 > 30000 || isNaN(data12)){
const err48 = {instancePath:instancePath+"/page/heightPx",schemaPath:"#/properties/page/properties/heightPx/maximum",keyword:"maximum",params:{comparison: "<=", limit: 30000},message:"must be <= 30000"};
if(vErrors === null){
vErrors = [err48];
}
else {
vErrors.push(err48);
}
errors++;
}
if(data12 < 100 || isNaN(data12)){
const err49 = {instancePath:instancePath+"/page/heightPx",schemaPath:"#/properties/page/properties/heightPx/minimum",keyword:"minimum",params:{comparison: ">=", limit: 100},message:"must be >= 100"};
if(vErrors === null){
vErrors = [err49];
}
else {
vErrors.push(err49);
}
errors++;
}
}
}
if(data10.background !== undefined){
let data13 = data10.background;
if(typeof data13 === "string"){
if(!pattern7.test(data13)){
const err50 = {instancePath:instancePath+"/page/background",schemaPath:"#/properties/page/properties/background/pattern",keyword:"pattern",params:{pattern: "^#[0-9A-Fa-f]{6}$"},message:"must match pattern \""+"^#[0-9A-Fa-f]{6}$"+"\""};
if(vErrors === null){
vErrors = [err50];
}
else {
vErrors.push(err50);
}
errors++;
}
}
else {
const err51 = {instancePath:instancePath+"/page/background",schemaPath:"#/properties/page/properties/background/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err51];
}
else {
vErrors.push(err51);
}
errors++;
}
}
if(data10.paddingPx !== undefined){
let data14 = data10.paddingPx;
if((typeof data14 == "number") && (isFinite(data14))){
if(data14 > 2000 || isNaN(data14)){
const err52 = {instancePath:instancePath+"/page/paddingPx",schemaPath:"#/properties/page/properties/paddingPx/maximum",keyword:"maximum",params:{comparison: "<=", limit: 2000},message:"must be <= 2000"};
if(vErrors === null){
vErrors = [err52];
}
else {
vErrors.push(err52);
}
errors++;
}
if(data14 < 0 || isNaN(data14)){
const err53 = {instancePath:instancePath+"/page/paddingPx",schemaPath:"#/properties/page/properties/paddingPx/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err53];
}
else {
vErrors.push(err53);
}
errors++;
}
}
else {
const err54 = {instancePath:instancePath+"/page/paddingPx",schemaPath:"#/properties/page/properties/paddingPx/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err54];
}
else {
vErrors.push(err54);
}
errors++;
}
}
}
else {
const err55 = {instancePath:instancePath+"/page",schemaPath:"#/properties/page/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err55];
}
else {
vErrors.push(err55);
}
errors++;
}
}
if(data.axes !== undefined){
let data15 = data.axes;
if(data15 && typeof data15 == "object" && !Array.isArray(data15)){
if(data15.x === undefined){
const err56 = {instancePath:instancePath+"/axes",schemaPath:"#/properties/axes/required",keyword:"required",params:{missingProperty: "x"},message:"must have required property '"+"x"+"'"};
if(vErrors === null){
vErrors = [err56];
}
else {
vErrors.push(err56);
}
errors++;
}
if(data15.y === undefined){
const err57 = {instancePath:instancePath+"/axes",schemaPath:"#/properties/axes/required",keyword:"required",params:{missingProperty: "y"},message:"must have required property '"+"y"+"'"};
if(vErrors === null){
vErrors = [err57];
}
else {
vErrors.push(err57);
}
errors++;
}
for(const key4 in data15){
if(!((key4 === "x") || (key4 === "y"))){
const err58 = {instancePath:instancePath+"/axes",schemaPath:"#/properties/axes/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key4},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err58];
}
else {
vErrors.push(err58);
}
errors++;
}
}
if(data15.x !== undefined){
let data16 = data15.x;
if(data16 && typeof data16 == "object" && !Array.isArray(data16)){
if(data16.label === undefined){
const err59 = {instancePath:instancePath+"/axes/x",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "label"},message:"must have required property '"+"label"+"'"};
if(vErrors === null){
vErrors = [err59];
}
else {
vErrors.push(err59);
}
errors++;
}
if(data16.unit === undefined){
const err60 = {instancePath:instancePath+"/axes/x",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "unit"},message:"must have required property '"+"unit"+"'"};
if(vErrors === null){
vErrors = [err60];
}
else {
vErrors.push(err60);
}
errors++;
}
if(data16.scale === undefined){
const err61 = {instancePath:instancePath+"/axes/x",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "scale"},message:"must have required property '"+"scale"+"'"};
if(vErrors === null){
vErrors = [err61];
}
else {
vErrors.push(err61);
}
errors++;
}
if(data16.mode === undefined){
const err62 = {instancePath:instancePath+"/axes/x",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "mode"},message:"must have required property '"+"mode"+"'"};
if(vErrors === null){
vErrors = [err62];
}
else {
vErrors.push(err62);
}
errors++;
}
if(data16.min === undefined){
const err63 = {instancePath:instancePath+"/axes/x",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "min"},message:"must have required property '"+"min"+"'"};
if(vErrors === null){
vErrors = [err63];
}
else {
vErrors.push(err63);
}
errors++;
}
if(data16.max === undefined){
const err64 = {instancePath:instancePath+"/axes/x",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "max"},message:"must have required property '"+"max"+"'"};
if(vErrors === null){
vErrors = [err64];
}
else {
vErrors.push(err64);
}
errors++;
}
if(data16.tickMode === undefined){
const err65 = {instancePath:instancePath+"/axes/x",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "tickMode"},message:"must have required property '"+"tickMode"+"'"};
if(vErrors === null){
vErrors = [err65];
}
else {
vErrors.push(err65);
}
errors++;
}
if(data16.tickStep === undefined){
const err66 = {instancePath:instancePath+"/axes/x",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "tickStep"},message:"must have required property '"+"tickStep"+"'"};
if(vErrors === null){
vErrors = [err66];
}
else {
vErrors.push(err66);
}
errors++;
}
if(data16.tickOrigin === undefined){
const err67 = {instancePath:instancePath+"/axes/x",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "tickOrigin"},message:"must have required property '"+"tickOrigin"+"'"};
if(vErrors === null){
vErrors = [err67];
}
else {
vErrors.push(err67);
}
errors++;
}
if(data16.minorDivisions === undefined){
const err68 = {instancePath:instancePath+"/axes/x",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "minorDivisions"},message:"must have required property '"+"minorDivisions"+"'"};
if(vErrors === null){
vErrors = [err68];
}
else {
vErrors.push(err68);
}
errors++;
}
if(data16.grid === undefined){
const err69 = {instancePath:instancePath+"/axes/x",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "grid"},message:"must have required property '"+"grid"+"'"};
if(vErrors === null){
vErrors = [err69];
}
else {
vErrors.push(err69);
}
errors++;
}
if(data16.numberFormat === undefined){
const err70 = {instancePath:instancePath+"/axes/x",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "numberFormat"},message:"must have required property '"+"numberFormat"+"'"};
if(vErrors === null){
vErrors = [err70];
}
else {
vErrors.push(err70);
}
errors++;
}
if(data16.precision === undefined){
const err71 = {instancePath:instancePath+"/axes/x",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "precision"},message:"must have required property '"+"precision"+"'"};
if(vErrors === null){
vErrors = [err71];
}
else {
vErrors.push(err71);
}
errors++;
}
if(data16.strokeWidthPt === undefined){
const err72 = {instancePath:instancePath+"/axes/x",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "strokeWidthPt"},message:"must have required property '"+"strokeWidthPt"+"'"};
if(vErrors === null){
vErrors = [err72];
}
else {
vErrors.push(err72);
}
errors++;
}
if(data16.labelSizePt === undefined){
const err73 = {instancePath:instancePath+"/axes/x",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "labelSizePt"},message:"must have required property '"+"labelSizePt"+"'"};
if(vErrors === null){
vErrors = [err73];
}
else {
vErrors.push(err73);
}
errors++;
}
for(const key5 in data16){
if(!(func1.call(schema70.properties, key5))){
const err74 = {instancePath:instancePath+"/axes/x",schemaPath:"#/$defs/axis/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key5},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err74];
}
else {
vErrors.push(err74);
}
errors++;
}
}
if(data16.label !== undefined){
let data17 = data16.label;
if(typeof data17 === "string"){
if(func2(data17) > 500){
const err75 = {instancePath:instancePath+"/axes/x/label",schemaPath:"#/$defs/axis/properties/label/maxLength",keyword:"maxLength",params:{limit: 500},message:"must NOT have more than 500 characters"};
if(vErrors === null){
vErrors = [err75];
}
else {
vErrors.push(err75);
}
errors++;
}
}
else {
const err76 = {instancePath:instancePath+"/axes/x/label",schemaPath:"#/$defs/axis/properties/label/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err76];
}
else {
vErrors.push(err76);
}
errors++;
}
}
if(data16.unit !== undefined){
let data18 = data16.unit;
if(typeof data18 === "string"){
if(func2(data18) > 100){
const err77 = {instancePath:instancePath+"/axes/x/unit",schemaPath:"#/$defs/axis/properties/unit/maxLength",keyword:"maxLength",params:{limit: 100},message:"must NOT have more than 100 characters"};
if(vErrors === null){
vErrors = [err77];
}
else {
vErrors.push(err77);
}
errors++;
}
}
else {
const err78 = {instancePath:instancePath+"/axes/x/unit",schemaPath:"#/$defs/axis/properties/unit/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err78];
}
else {
vErrors.push(err78);
}
errors++;
}
}
if(data16.scale !== undefined){
if("linear" !== data16.scale){
const err79 = {instancePath:instancePath+"/axes/x/scale",schemaPath:"#/$defs/axis/properties/scale/const",keyword:"const",params:{allowedValue: "linear"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err79];
}
else {
vErrors.push(err79);
}
errors++;
}
}
if(data16.mode !== undefined){
let data20 = data16.mode;
if(!((data20 === "auto") || (data20 === "manual"))){
const err80 = {instancePath:instancePath+"/axes/x/mode",schemaPath:"#/$defs/axis/properties/mode/enum",keyword:"enum",params:{allowedValues: schema70.properties.mode.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err80];
}
else {
vErrors.push(err80);
}
errors++;
}
}
if(data16.min !== undefined){
let data21 = data16.min;
if(!((typeof data21 == "number") && (isFinite(data21)))){
const err81 = {instancePath:instancePath+"/axes/x/min",schemaPath:"#/$defs/axis/properties/min/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err81];
}
else {
vErrors.push(err81);
}
errors++;
}
}
if(data16.max !== undefined){
let data22 = data16.max;
if(!((typeof data22 == "number") && (isFinite(data22)))){
const err82 = {instancePath:instancePath+"/axes/x/max",schemaPath:"#/$defs/axis/properties/max/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err82];
}
else {
vErrors.push(err82);
}
errors++;
}
}
if(data16.tickMode !== undefined){
let data23 = data16.tickMode;
if(!((data23 === "auto") || (data23 === "manual"))){
const err83 = {instancePath:instancePath+"/axes/x/tickMode",schemaPath:"#/$defs/axis/properties/tickMode/enum",keyword:"enum",params:{allowedValues: schema70.properties.tickMode.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err83];
}
else {
vErrors.push(err83);
}
errors++;
}
}
if(data16.tickStep !== undefined){
let data24 = data16.tickStep;
if((typeof data24 == "number") && (isFinite(data24))){
if(data24 <= 0 || isNaN(data24)){
const err84 = {instancePath:instancePath+"/axes/x/tickStep",schemaPath:"#/$defs/axis/properties/tickStep/exclusiveMinimum",keyword:"exclusiveMinimum",params:{comparison: ">", limit: 0},message:"must be > 0"};
if(vErrors === null){
vErrors = [err84];
}
else {
vErrors.push(err84);
}
errors++;
}
}
else {
const err85 = {instancePath:instancePath+"/axes/x/tickStep",schemaPath:"#/$defs/axis/properties/tickStep/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err85];
}
else {
vErrors.push(err85);
}
errors++;
}
}
if(data16.tickOrigin !== undefined){
let data25 = data16.tickOrigin;
if(!((typeof data25 == "number") && (isFinite(data25)))){
const err86 = {instancePath:instancePath+"/axes/x/tickOrigin",schemaPath:"#/$defs/axis/properties/tickOrigin/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err86];
}
else {
vErrors.push(err86);
}
errors++;
}
}
if(data16.minorDivisions !== undefined){
let data26 = data16.minorDivisions;
if(!(((typeof data26 == "number") && (!(data26 % 1) && !isNaN(data26))) && (isFinite(data26)))){
const err87 = {instancePath:instancePath+"/axes/x/minorDivisions",schemaPath:"#/$defs/axis/properties/minorDivisions/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err87];
}
else {
vErrors.push(err87);
}
errors++;
}
if((typeof data26 == "number") && (isFinite(data26))){
if(data26 > 20 || isNaN(data26)){
const err88 = {instancePath:instancePath+"/axes/x/minorDivisions",schemaPath:"#/$defs/axis/properties/minorDivisions/maximum",keyword:"maximum",params:{comparison: "<=", limit: 20},message:"must be <= 20"};
if(vErrors === null){
vErrors = [err88];
}
else {
vErrors.push(err88);
}
errors++;
}
if(data26 < 0 || isNaN(data26)){
const err89 = {instancePath:instancePath+"/axes/x/minorDivisions",schemaPath:"#/$defs/axis/properties/minorDivisions/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err89];
}
else {
vErrors.push(err89);
}
errors++;
}
}
}
if(data16.grid !== undefined){
if(typeof data16.grid !== "boolean"){
const err90 = {instancePath:instancePath+"/axes/x/grid",schemaPath:"#/$defs/axis/properties/grid/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err90];
}
else {
vErrors.push(err90);
}
errors++;
}
}
if(data16.numberFormat !== undefined){
let data28 = data16.numberFormat;
if(!(((data28 === "auto") || (data28 === "fixed")) || (data28 === "scientific"))){
const err91 = {instancePath:instancePath+"/axes/x/numberFormat",schemaPath:"#/$defs/axis/properties/numberFormat/enum",keyword:"enum",params:{allowedValues: schema70.properties.numberFormat.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err91];
}
else {
vErrors.push(err91);
}
errors++;
}
}
if(data16.precision !== undefined){
let data29 = data16.precision;
if(!(((typeof data29 == "number") && (!(data29 % 1) && !isNaN(data29))) && (isFinite(data29)))){
const err92 = {instancePath:instancePath+"/axes/x/precision",schemaPath:"#/$defs/axis/properties/precision/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err92];
}
else {
vErrors.push(err92);
}
errors++;
}
if((typeof data29 == "number") && (isFinite(data29))){
if(data29 > 15 || isNaN(data29)){
const err93 = {instancePath:instancePath+"/axes/x/precision",schemaPath:"#/$defs/axis/properties/precision/maximum",keyword:"maximum",params:{comparison: "<=", limit: 15},message:"must be <= 15"};
if(vErrors === null){
vErrors = [err93];
}
else {
vErrors.push(err93);
}
errors++;
}
if(data29 < 0 || isNaN(data29)){
const err94 = {instancePath:instancePath+"/axes/x/precision",schemaPath:"#/$defs/axis/properties/precision/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err94];
}
else {
vErrors.push(err94);
}
errors++;
}
}
}
if(data16.strokeWidthPt !== undefined){
let data30 = data16.strokeWidthPt;
if((typeof data30 == "number") && (isFinite(data30))){
if(data30 > 24 || isNaN(data30)){
const err95 = {instancePath:instancePath+"/axes/x/strokeWidthPt",schemaPath:"#/$defs/axis/properties/strokeWidthPt/maximum",keyword:"maximum",params:{comparison: "<=", limit: 24},message:"must be <= 24"};
if(vErrors === null){
vErrors = [err95];
}
else {
vErrors.push(err95);
}
errors++;
}
if(data30 <= 0 || isNaN(data30)){
const err96 = {instancePath:instancePath+"/axes/x/strokeWidthPt",schemaPath:"#/$defs/axis/properties/strokeWidthPt/exclusiveMinimum",keyword:"exclusiveMinimum",params:{comparison: ">", limit: 0},message:"must be > 0"};
if(vErrors === null){
vErrors = [err96];
}
else {
vErrors.push(err96);
}
errors++;
}
}
else {
const err97 = {instancePath:instancePath+"/axes/x/strokeWidthPt",schemaPath:"#/$defs/axis/properties/strokeWidthPt/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err97];
}
else {
vErrors.push(err97);
}
errors++;
}
}
if(data16.labelSizePt !== undefined){
let data31 = data16.labelSizePt;
if((typeof data31 == "number") && (isFinite(data31))){
if(data31 > 72 || isNaN(data31)){
const err98 = {instancePath:instancePath+"/axes/x/labelSizePt",schemaPath:"#/$defs/axis/properties/labelSizePt/maximum",keyword:"maximum",params:{comparison: "<=", limit: 72},message:"must be <= 72"};
if(vErrors === null){
vErrors = [err98];
}
else {
vErrors.push(err98);
}
errors++;
}
if(data31 < 6 || isNaN(data31)){
const err99 = {instancePath:instancePath+"/axes/x/labelSizePt",schemaPath:"#/$defs/axis/properties/labelSizePt/minimum",keyword:"minimum",params:{comparison: ">=", limit: 6},message:"must be >= 6"};
if(vErrors === null){
vErrors = [err99];
}
else {
vErrors.push(err99);
}
errors++;
}
}
else {
const err100 = {instancePath:instancePath+"/axes/x/labelSizePt",schemaPath:"#/$defs/axis/properties/labelSizePt/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err100];
}
else {
vErrors.push(err100);
}
errors++;
}
}
}
else {
const err101 = {instancePath:instancePath+"/axes/x",schemaPath:"#/$defs/axis/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err101];
}
else {
vErrors.push(err101);
}
errors++;
}
}
if(data15.y !== undefined){
let data32 = data15.y;
if(data32 && typeof data32 == "object" && !Array.isArray(data32)){
if(data32.label === undefined){
const err102 = {instancePath:instancePath+"/axes/y",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "label"},message:"must have required property '"+"label"+"'"};
if(vErrors === null){
vErrors = [err102];
}
else {
vErrors.push(err102);
}
errors++;
}
if(data32.unit === undefined){
const err103 = {instancePath:instancePath+"/axes/y",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "unit"},message:"must have required property '"+"unit"+"'"};
if(vErrors === null){
vErrors = [err103];
}
else {
vErrors.push(err103);
}
errors++;
}
if(data32.scale === undefined){
const err104 = {instancePath:instancePath+"/axes/y",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "scale"},message:"must have required property '"+"scale"+"'"};
if(vErrors === null){
vErrors = [err104];
}
else {
vErrors.push(err104);
}
errors++;
}
if(data32.mode === undefined){
const err105 = {instancePath:instancePath+"/axes/y",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "mode"},message:"must have required property '"+"mode"+"'"};
if(vErrors === null){
vErrors = [err105];
}
else {
vErrors.push(err105);
}
errors++;
}
if(data32.min === undefined){
const err106 = {instancePath:instancePath+"/axes/y",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "min"},message:"must have required property '"+"min"+"'"};
if(vErrors === null){
vErrors = [err106];
}
else {
vErrors.push(err106);
}
errors++;
}
if(data32.max === undefined){
const err107 = {instancePath:instancePath+"/axes/y",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "max"},message:"must have required property '"+"max"+"'"};
if(vErrors === null){
vErrors = [err107];
}
else {
vErrors.push(err107);
}
errors++;
}
if(data32.tickMode === undefined){
const err108 = {instancePath:instancePath+"/axes/y",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "tickMode"},message:"must have required property '"+"tickMode"+"'"};
if(vErrors === null){
vErrors = [err108];
}
else {
vErrors.push(err108);
}
errors++;
}
if(data32.tickStep === undefined){
const err109 = {instancePath:instancePath+"/axes/y",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "tickStep"},message:"must have required property '"+"tickStep"+"'"};
if(vErrors === null){
vErrors = [err109];
}
else {
vErrors.push(err109);
}
errors++;
}
if(data32.tickOrigin === undefined){
const err110 = {instancePath:instancePath+"/axes/y",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "tickOrigin"},message:"must have required property '"+"tickOrigin"+"'"};
if(vErrors === null){
vErrors = [err110];
}
else {
vErrors.push(err110);
}
errors++;
}
if(data32.minorDivisions === undefined){
const err111 = {instancePath:instancePath+"/axes/y",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "minorDivisions"},message:"must have required property '"+"minorDivisions"+"'"};
if(vErrors === null){
vErrors = [err111];
}
else {
vErrors.push(err111);
}
errors++;
}
if(data32.grid === undefined){
const err112 = {instancePath:instancePath+"/axes/y",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "grid"},message:"must have required property '"+"grid"+"'"};
if(vErrors === null){
vErrors = [err112];
}
else {
vErrors.push(err112);
}
errors++;
}
if(data32.numberFormat === undefined){
const err113 = {instancePath:instancePath+"/axes/y",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "numberFormat"},message:"must have required property '"+"numberFormat"+"'"};
if(vErrors === null){
vErrors = [err113];
}
else {
vErrors.push(err113);
}
errors++;
}
if(data32.precision === undefined){
const err114 = {instancePath:instancePath+"/axes/y",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "precision"},message:"must have required property '"+"precision"+"'"};
if(vErrors === null){
vErrors = [err114];
}
else {
vErrors.push(err114);
}
errors++;
}
if(data32.strokeWidthPt === undefined){
const err115 = {instancePath:instancePath+"/axes/y",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "strokeWidthPt"},message:"must have required property '"+"strokeWidthPt"+"'"};
if(vErrors === null){
vErrors = [err115];
}
else {
vErrors.push(err115);
}
errors++;
}
if(data32.labelSizePt === undefined){
const err116 = {instancePath:instancePath+"/axes/y",schemaPath:"#/$defs/axis/required",keyword:"required",params:{missingProperty: "labelSizePt"},message:"must have required property '"+"labelSizePt"+"'"};
if(vErrors === null){
vErrors = [err116];
}
else {
vErrors.push(err116);
}
errors++;
}
for(const key6 in data32){
if(!(func1.call(schema70.properties, key6))){
const err117 = {instancePath:instancePath+"/axes/y",schemaPath:"#/$defs/axis/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key6},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err117];
}
else {
vErrors.push(err117);
}
errors++;
}
}
if(data32.label !== undefined){
let data33 = data32.label;
if(typeof data33 === "string"){
if(func2(data33) > 500){
const err118 = {instancePath:instancePath+"/axes/y/label",schemaPath:"#/$defs/axis/properties/label/maxLength",keyword:"maxLength",params:{limit: 500},message:"must NOT have more than 500 characters"};
if(vErrors === null){
vErrors = [err118];
}
else {
vErrors.push(err118);
}
errors++;
}
}
else {
const err119 = {instancePath:instancePath+"/axes/y/label",schemaPath:"#/$defs/axis/properties/label/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err119];
}
else {
vErrors.push(err119);
}
errors++;
}
}
if(data32.unit !== undefined){
let data34 = data32.unit;
if(typeof data34 === "string"){
if(func2(data34) > 100){
const err120 = {instancePath:instancePath+"/axes/y/unit",schemaPath:"#/$defs/axis/properties/unit/maxLength",keyword:"maxLength",params:{limit: 100},message:"must NOT have more than 100 characters"};
if(vErrors === null){
vErrors = [err120];
}
else {
vErrors.push(err120);
}
errors++;
}
}
else {
const err121 = {instancePath:instancePath+"/axes/y/unit",schemaPath:"#/$defs/axis/properties/unit/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err121];
}
else {
vErrors.push(err121);
}
errors++;
}
}
if(data32.scale !== undefined){
if("linear" !== data32.scale){
const err122 = {instancePath:instancePath+"/axes/y/scale",schemaPath:"#/$defs/axis/properties/scale/const",keyword:"const",params:{allowedValue: "linear"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err122];
}
else {
vErrors.push(err122);
}
errors++;
}
}
if(data32.mode !== undefined){
let data36 = data32.mode;
if(!((data36 === "auto") || (data36 === "manual"))){
const err123 = {instancePath:instancePath+"/axes/y/mode",schemaPath:"#/$defs/axis/properties/mode/enum",keyword:"enum",params:{allowedValues: schema70.properties.mode.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err123];
}
else {
vErrors.push(err123);
}
errors++;
}
}
if(data32.min !== undefined){
let data37 = data32.min;
if(!((typeof data37 == "number") && (isFinite(data37)))){
const err124 = {instancePath:instancePath+"/axes/y/min",schemaPath:"#/$defs/axis/properties/min/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err124];
}
else {
vErrors.push(err124);
}
errors++;
}
}
if(data32.max !== undefined){
let data38 = data32.max;
if(!((typeof data38 == "number") && (isFinite(data38)))){
const err125 = {instancePath:instancePath+"/axes/y/max",schemaPath:"#/$defs/axis/properties/max/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err125];
}
else {
vErrors.push(err125);
}
errors++;
}
}
if(data32.tickMode !== undefined){
let data39 = data32.tickMode;
if(!((data39 === "auto") || (data39 === "manual"))){
const err126 = {instancePath:instancePath+"/axes/y/tickMode",schemaPath:"#/$defs/axis/properties/tickMode/enum",keyword:"enum",params:{allowedValues: schema70.properties.tickMode.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err126];
}
else {
vErrors.push(err126);
}
errors++;
}
}
if(data32.tickStep !== undefined){
let data40 = data32.tickStep;
if((typeof data40 == "number") && (isFinite(data40))){
if(data40 <= 0 || isNaN(data40)){
const err127 = {instancePath:instancePath+"/axes/y/tickStep",schemaPath:"#/$defs/axis/properties/tickStep/exclusiveMinimum",keyword:"exclusiveMinimum",params:{comparison: ">", limit: 0},message:"must be > 0"};
if(vErrors === null){
vErrors = [err127];
}
else {
vErrors.push(err127);
}
errors++;
}
}
else {
const err128 = {instancePath:instancePath+"/axes/y/tickStep",schemaPath:"#/$defs/axis/properties/tickStep/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err128];
}
else {
vErrors.push(err128);
}
errors++;
}
}
if(data32.tickOrigin !== undefined){
let data41 = data32.tickOrigin;
if(!((typeof data41 == "number") && (isFinite(data41)))){
const err129 = {instancePath:instancePath+"/axes/y/tickOrigin",schemaPath:"#/$defs/axis/properties/tickOrigin/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err129];
}
else {
vErrors.push(err129);
}
errors++;
}
}
if(data32.minorDivisions !== undefined){
let data42 = data32.minorDivisions;
if(!(((typeof data42 == "number") && (!(data42 % 1) && !isNaN(data42))) && (isFinite(data42)))){
const err130 = {instancePath:instancePath+"/axes/y/minorDivisions",schemaPath:"#/$defs/axis/properties/minorDivisions/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err130];
}
else {
vErrors.push(err130);
}
errors++;
}
if((typeof data42 == "number") && (isFinite(data42))){
if(data42 > 20 || isNaN(data42)){
const err131 = {instancePath:instancePath+"/axes/y/minorDivisions",schemaPath:"#/$defs/axis/properties/minorDivisions/maximum",keyword:"maximum",params:{comparison: "<=", limit: 20},message:"must be <= 20"};
if(vErrors === null){
vErrors = [err131];
}
else {
vErrors.push(err131);
}
errors++;
}
if(data42 < 0 || isNaN(data42)){
const err132 = {instancePath:instancePath+"/axes/y/minorDivisions",schemaPath:"#/$defs/axis/properties/minorDivisions/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err132];
}
else {
vErrors.push(err132);
}
errors++;
}
}
}
if(data32.grid !== undefined){
if(typeof data32.grid !== "boolean"){
const err133 = {instancePath:instancePath+"/axes/y/grid",schemaPath:"#/$defs/axis/properties/grid/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err133];
}
else {
vErrors.push(err133);
}
errors++;
}
}
if(data32.numberFormat !== undefined){
let data44 = data32.numberFormat;
if(!(((data44 === "auto") || (data44 === "fixed")) || (data44 === "scientific"))){
const err134 = {instancePath:instancePath+"/axes/y/numberFormat",schemaPath:"#/$defs/axis/properties/numberFormat/enum",keyword:"enum",params:{allowedValues: schema70.properties.numberFormat.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err134];
}
else {
vErrors.push(err134);
}
errors++;
}
}
if(data32.precision !== undefined){
let data45 = data32.precision;
if(!(((typeof data45 == "number") && (!(data45 % 1) && !isNaN(data45))) && (isFinite(data45)))){
const err135 = {instancePath:instancePath+"/axes/y/precision",schemaPath:"#/$defs/axis/properties/precision/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err135];
}
else {
vErrors.push(err135);
}
errors++;
}
if((typeof data45 == "number") && (isFinite(data45))){
if(data45 > 15 || isNaN(data45)){
const err136 = {instancePath:instancePath+"/axes/y/precision",schemaPath:"#/$defs/axis/properties/precision/maximum",keyword:"maximum",params:{comparison: "<=", limit: 15},message:"must be <= 15"};
if(vErrors === null){
vErrors = [err136];
}
else {
vErrors.push(err136);
}
errors++;
}
if(data45 < 0 || isNaN(data45)){
const err137 = {instancePath:instancePath+"/axes/y/precision",schemaPath:"#/$defs/axis/properties/precision/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err137];
}
else {
vErrors.push(err137);
}
errors++;
}
}
}
if(data32.strokeWidthPt !== undefined){
let data46 = data32.strokeWidthPt;
if((typeof data46 == "number") && (isFinite(data46))){
if(data46 > 24 || isNaN(data46)){
const err138 = {instancePath:instancePath+"/axes/y/strokeWidthPt",schemaPath:"#/$defs/axis/properties/strokeWidthPt/maximum",keyword:"maximum",params:{comparison: "<=", limit: 24},message:"must be <= 24"};
if(vErrors === null){
vErrors = [err138];
}
else {
vErrors.push(err138);
}
errors++;
}
if(data46 <= 0 || isNaN(data46)){
const err139 = {instancePath:instancePath+"/axes/y/strokeWidthPt",schemaPath:"#/$defs/axis/properties/strokeWidthPt/exclusiveMinimum",keyword:"exclusiveMinimum",params:{comparison: ">", limit: 0},message:"must be > 0"};
if(vErrors === null){
vErrors = [err139];
}
else {
vErrors.push(err139);
}
errors++;
}
}
else {
const err140 = {instancePath:instancePath+"/axes/y/strokeWidthPt",schemaPath:"#/$defs/axis/properties/strokeWidthPt/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err140];
}
else {
vErrors.push(err140);
}
errors++;
}
}
if(data32.labelSizePt !== undefined){
let data47 = data32.labelSizePt;
if((typeof data47 == "number") && (isFinite(data47))){
if(data47 > 72 || isNaN(data47)){
const err141 = {instancePath:instancePath+"/axes/y/labelSizePt",schemaPath:"#/$defs/axis/properties/labelSizePt/maximum",keyword:"maximum",params:{comparison: "<=", limit: 72},message:"must be <= 72"};
if(vErrors === null){
vErrors = [err141];
}
else {
vErrors.push(err141);
}
errors++;
}
if(data47 < 6 || isNaN(data47)){
const err142 = {instancePath:instancePath+"/axes/y/labelSizePt",schemaPath:"#/$defs/axis/properties/labelSizePt/minimum",keyword:"minimum",params:{comparison: ">=", limit: 6},message:"must be >= 6"};
if(vErrors === null){
vErrors = [err142];
}
else {
vErrors.push(err142);
}
errors++;
}
}
else {
const err143 = {instancePath:instancePath+"/axes/y/labelSizePt",schemaPath:"#/$defs/axis/properties/labelSizePt/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err143];
}
else {
vErrors.push(err143);
}
errors++;
}
}
}
else {
const err144 = {instancePath:instancePath+"/axes/y",schemaPath:"#/$defs/axis/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err144];
}
else {
vErrors.push(err144);
}
errors++;
}
}
}
else {
const err145 = {instancePath:instancePath+"/axes",schemaPath:"#/properties/axes/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err145];
}
else {
vErrors.push(err145);
}
errors++;
}
}
if(data.datasets !== undefined){
let data48 = data.datasets;
if(Array.isArray(data48)){
if(data48.length > 1000){
const err146 = {instancePath:instancePath+"/datasets",schemaPath:"#/properties/datasets/maxItems",keyword:"maxItems",params:{limit: 1000},message:"must NOT have more than 1000 items"};
if(vErrors === null){
vErrors = [err146];
}
else {
vErrors.push(err146);
}
errors++;
}
const len0 = data48.length;
for(let i0=0; i0<len0; i0++){
if(!(validate46(data48[i0], {instancePath:instancePath+"/datasets/" + i0,parentData:data48,parentDataProperty:i0,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate46.errors : vErrors.concat(validate46.errors);
errors = vErrors.length;
}
}
}
else {
const err147 = {instancePath:instancePath+"/datasets",schemaPath:"#/properties/datasets/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err147];
}
else {
vErrors.push(err147);
}
errors++;
}
}
if(data.series !== undefined){
let data50 = data.series;
if(Array.isArray(data50)){
if(data50.length > 1000){
const err148 = {instancePath:instancePath+"/series",schemaPath:"#/properties/series/maxItems",keyword:"maxItems",params:{limit: 1000},message:"must NOT have more than 1000 items"};
if(vErrors === null){
vErrors = [err148];
}
else {
vErrors.push(err148);
}
errors++;
}
const len1 = data50.length;
for(let i1=0; i1<len1; i1++){
if(!(validate48(data50[i1], {instancePath:instancePath+"/series/" + i1,parentData:data50,parentDataProperty:i1,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate48.errors : vErrors.concat(validate48.errors);
errors = vErrors.length;
}
}
}
else {
const err149 = {instancePath:instancePath+"/series",schemaPath:"#/properties/series/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err149];
}
else {
vErrors.push(err149);
}
errors++;
}
}
if(data.objects !== undefined){
let data52 = data.objects;
if(Array.isArray(data52)){
if(data52.length > 100000){
const err150 = {instancePath:instancePath+"/objects",schemaPath:"#/properties/objects/maxItems",keyword:"maxItems",params:{limit: 100000},message:"must NOT have more than 100000 items"};
if(vErrors === null){
vErrors = [err150];
}
else {
vErrors.push(err150);
}
errors++;
}
const len2 = data52.length;
for(let i2=0; i2<len2; i2++){
if(!(validate50(data52[i2], {instancePath:instancePath+"/objects/" + i2,parentData:data52,parentDataProperty:i2,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate50.errors : vErrors.concat(validate50.errors);
errors = vErrors.length;
}
}
}
else {
const err151 = {instancePath:instancePath+"/objects",schemaPath:"#/properties/objects/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err151];
}
else {
vErrors.push(err151);
}
errors++;
}
}
if(data.calculations !== undefined){
let data54 = data.calculations;
if(Array.isArray(data54)){
if(data54.length > 10000){
const err152 = {instancePath:instancePath+"/calculations",schemaPath:"#/properties/calculations/maxItems",keyword:"maxItems",params:{limit: 10000},message:"must NOT have more than 10000 items"};
if(vErrors === null){
vErrors = [err152];
}
else {
vErrors.push(err152);
}
errors++;
}
const len3 = data54.length;
for(let i3=0; i3<len3; i3++){
if(!(validate54(data54[i3], {instancePath:instancePath+"/calculations/" + i3,parentData:data54,parentDataProperty:i3,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate54.errors : vErrors.concat(validate54.errors);
errors = vErrors.length;
}
}
}
else {
const err153 = {instancePath:instancePath+"/calculations",schemaPath:"#/properties/calculations/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err153];
}
else {
vErrors.push(err153);
}
errors++;
}
}
if(data.legend !== undefined){
let data56 = data.legend;
if(data56 && typeof data56 == "object" && !Array.isArray(data56)){
if(data56.visible === undefined){
const err154 = {instancePath:instancePath+"/legend",schemaPath:"#/properties/legend/required",keyword:"required",params:{missingProperty: "visible"},message:"must have required property '"+"visible"+"'"};
if(vErrors === null){
vErrors = [err154];
}
else {
vErrors.push(err154);
}
errors++;
}
if(data56.anchor === undefined){
const err155 = {instancePath:instancePath+"/legend",schemaPath:"#/properties/legend/required",keyword:"required",params:{missingProperty: "anchor"},message:"must have required property '"+"anchor"+"'"};
if(vErrors === null){
vErrors = [err155];
}
else {
vErrors.push(err155);
}
errors++;
}
for(const key7 in data56){
if(!((key7 === "visible") || (key7 === "anchor"))){
const err156 = {instancePath:instancePath+"/legend",schemaPath:"#/properties/legend/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key7},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err156];
}
else {
vErrors.push(err156);
}
errors++;
}
}
if(data56.visible !== undefined){
if(typeof data56.visible !== "boolean"){
const err157 = {instancePath:instancePath+"/legend/visible",schemaPath:"#/properties/legend/properties/visible/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err157];
}
else {
vErrors.push(err157);
}
errors++;
}
}
if(data56.anchor !== undefined){
let data58 = data56.anchor;
const _errs115 = errors;
let valid19 = false;
let passing0 = null;
const _errs116 = errors;
if(data58 && typeof data58 == "object" && !Array.isArray(data58)){
if(data58.mode === undefined){
const err158 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/0/required",keyword:"required",params:{missingProperty: "mode"},message:"must have required property '"+"mode"+"'"};
if(vErrors === null){
vErrors = [err158];
}
else {
vErrors.push(err158);
}
errors++;
}
if(data58.x === undefined){
const err159 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/0/required",keyword:"required",params:{missingProperty: "x"},message:"must have required property '"+"x"+"'"};
if(vErrors === null){
vErrors = [err159];
}
else {
vErrors.push(err159);
}
errors++;
}
if(data58.y === undefined){
const err160 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/0/required",keyword:"required",params:{missingProperty: "y"},message:"must have required property '"+"y"+"'"};
if(vErrors === null){
vErrors = [err160];
}
else {
vErrors.push(err160);
}
errors++;
}
for(const key8 in data58){
if(!(((key8 === "mode") || (key8 === "x")) || (key8 === "y"))){
const err161 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/0/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key8},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err161];
}
else {
vErrors.push(err161);
}
errors++;
}
}
if(data58.mode !== undefined){
if("data" !== data58.mode){
const err162 = {instancePath:instancePath+"/legend/anchor/mode",schemaPath:"#/$defs/anchor/oneOf/0/properties/mode/const",keyword:"const",params:{allowedValue: "data"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err162];
}
else {
vErrors.push(err162);
}
errors++;
}
}
if(data58.x !== undefined){
let data60 = data58.x;
if(!((typeof data60 == "number") && (isFinite(data60)))){
const err163 = {instancePath:instancePath+"/legend/anchor/x",schemaPath:"#/$defs/anchor/oneOf/0/properties/x/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err163];
}
else {
vErrors.push(err163);
}
errors++;
}
}
if(data58.y !== undefined){
let data61 = data58.y;
if(!((typeof data61 == "number") && (isFinite(data61)))){
const err164 = {instancePath:instancePath+"/legend/anchor/y",schemaPath:"#/$defs/anchor/oneOf/0/properties/y/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err164];
}
else {
vErrors.push(err164);
}
errors++;
}
}
}
else {
const err165 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err165];
}
else {
vErrors.push(err165);
}
errors++;
}
var _valid0 = _errs116 === errors;
if(_valid0){
valid19 = true;
passing0 = 0;
var props0 = true;
}
const _errs124 = errors;
if(data58 && typeof data58 == "object" && !Array.isArray(data58)){
if(data58.mode === undefined){
const err166 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/1/required",keyword:"required",params:{missingProperty: "mode"},message:"must have required property '"+"mode"+"'"};
if(vErrors === null){
vErrors = [err166];
}
else {
vErrors.push(err166);
}
errors++;
}
if(data58.pageX === undefined){
const err167 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/1/required",keyword:"required",params:{missingProperty: "pageX"},message:"must have required property '"+"pageX"+"'"};
if(vErrors === null){
vErrors = [err167];
}
else {
vErrors.push(err167);
}
errors++;
}
if(data58.pageY === undefined){
const err168 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/1/required",keyword:"required",params:{missingProperty: "pageY"},message:"must have required property '"+"pageY"+"'"};
if(vErrors === null){
vErrors = [err168];
}
else {
vErrors.push(err168);
}
errors++;
}
for(const key9 in data58){
if(!(((key9 === "mode") || (key9 === "pageX")) || (key9 === "pageY"))){
const err169 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/1/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key9},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err169];
}
else {
vErrors.push(err169);
}
errors++;
}
}
if(data58.mode !== undefined){
if("page" !== data58.mode){
const err170 = {instancePath:instancePath+"/legend/anchor/mode",schemaPath:"#/$defs/anchor/oneOf/1/properties/mode/const",keyword:"const",params:{allowedValue: "page"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err170];
}
else {
vErrors.push(err170);
}
errors++;
}
}
if(data58.pageX !== undefined){
let data63 = data58.pageX;
if((typeof data63 == "number") && (isFinite(data63))){
if(data63 > 1 || isNaN(data63)){
const err171 = {instancePath:instancePath+"/legend/anchor/pageX",schemaPath:"#/$defs/anchor/oneOf/1/properties/pageX/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1},message:"must be <= 1"};
if(vErrors === null){
vErrors = [err171];
}
else {
vErrors.push(err171);
}
errors++;
}
if(data63 < 0 || isNaN(data63)){
const err172 = {instancePath:instancePath+"/legend/anchor/pageX",schemaPath:"#/$defs/anchor/oneOf/1/properties/pageX/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err172];
}
else {
vErrors.push(err172);
}
errors++;
}
}
else {
const err173 = {instancePath:instancePath+"/legend/anchor/pageX",schemaPath:"#/$defs/anchor/oneOf/1/properties/pageX/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err173];
}
else {
vErrors.push(err173);
}
errors++;
}
}
if(data58.pageY !== undefined){
let data64 = data58.pageY;
if((typeof data64 == "number") && (isFinite(data64))){
if(data64 > 1 || isNaN(data64)){
const err174 = {instancePath:instancePath+"/legend/anchor/pageY",schemaPath:"#/$defs/anchor/oneOf/1/properties/pageY/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1},message:"must be <= 1"};
if(vErrors === null){
vErrors = [err174];
}
else {
vErrors.push(err174);
}
errors++;
}
if(data64 < 0 || isNaN(data64)){
const err175 = {instancePath:instancePath+"/legend/anchor/pageY",schemaPath:"#/$defs/anchor/oneOf/1/properties/pageY/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err175];
}
else {
vErrors.push(err175);
}
errors++;
}
}
else {
const err176 = {instancePath:instancePath+"/legend/anchor/pageY",schemaPath:"#/$defs/anchor/oneOf/1/properties/pageY/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err176];
}
else {
vErrors.push(err176);
}
errors++;
}
}
}
else {
const err177 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/1/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err177];
}
else {
vErrors.push(err177);
}
errors++;
}
var _valid0 = _errs124 === errors;
if(_valid0 && valid19){
valid19 = false;
passing0 = [passing0, 1];
}
else {
if(_valid0){
valid19 = true;
passing0 = 1;
if(props0 !== true){
props0 = true;
}
}
const _errs132 = errors;
if(data58 && typeof data58 == "object" && !Array.isArray(data58)){
if(data58.mode === undefined){
const err178 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/2/required",keyword:"required",params:{missingProperty: "mode"},message:"must have required property '"+"mode"+"'"};
if(vErrors === null){
vErrors = [err178];
}
else {
vErrors.push(err178);
}
errors++;
}
if(data58.datasetId === undefined){
const err179 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/2/required",keyword:"required",params:{missingProperty: "datasetId"},message:"must have required property '"+"datasetId"+"'"};
if(vErrors === null){
vErrors = [err179];
}
else {
vErrors.push(err179);
}
errors++;
}
if(data58.pointId === undefined){
const err180 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/2/required",keyword:"required",params:{missingProperty: "pointId"},message:"must have required property '"+"pointId"+"'"};
if(vErrors === null){
vErrors = [err180];
}
else {
vErrors.push(err180);
}
errors++;
}
if(data58.fallbackX === undefined){
const err181 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/2/required",keyword:"required",params:{missingProperty: "fallbackX"},message:"must have required property '"+"fallbackX"+"'"};
if(vErrors === null){
vErrors = [err181];
}
else {
vErrors.push(err181);
}
errors++;
}
if(data58.fallbackY === undefined){
const err182 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/2/required",keyword:"required",params:{missingProperty: "fallbackY"},message:"must have required property '"+"fallbackY"+"'"};
if(vErrors === null){
vErrors = [err182];
}
else {
vErrors.push(err182);
}
errors++;
}
if(data58.offsetXpx === undefined){
const err183 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/2/required",keyword:"required",params:{missingProperty: "offsetXpx"},message:"must have required property '"+"offsetXpx"+"'"};
if(vErrors === null){
vErrors = [err183];
}
else {
vErrors.push(err183);
}
errors++;
}
if(data58.offsetYpx === undefined){
const err184 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/2/required",keyword:"required",params:{missingProperty: "offsetYpx"},message:"must have required property '"+"offsetYpx"+"'"};
if(vErrors === null){
vErrors = [err184];
}
else {
vErrors.push(err184);
}
errors++;
}
for(const key10 in data58){
if(!(((((((key10 === "mode") || (key10 === "datasetId")) || (key10 === "pointId")) || (key10 === "fallbackX")) || (key10 === "fallbackY")) || (key10 === "offsetXpx")) || (key10 === "offsetYpx"))){
const err185 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/2/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key10},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err185];
}
else {
vErrors.push(err185);
}
errors++;
}
}
if(data58.mode !== undefined){
if("point" !== data58.mode){
const err186 = {instancePath:instancePath+"/legend/anchor/mode",schemaPath:"#/$defs/anchor/oneOf/2/properties/mode/const",keyword:"const",params:{allowedValue: "point"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err186];
}
else {
vErrors.push(err186);
}
errors++;
}
}
if(data58.datasetId !== undefined){
let data66 = data58.datasetId;
if(typeof data66 === "string"){
if(!pattern6.test(data66)){
const err187 = {instancePath:instancePath+"/legend/anchor/datasetId",schemaPath:"#/$defs/anchor/oneOf/2/properties/datasetId/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"+"\""};
if(vErrors === null){
vErrors = [err187];
}
else {
vErrors.push(err187);
}
errors++;
}
}
else {
const err188 = {instancePath:instancePath+"/legend/anchor/datasetId",schemaPath:"#/$defs/anchor/oneOf/2/properties/datasetId/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err188];
}
else {
vErrors.push(err188);
}
errors++;
}
}
if(data58.pointId !== undefined){
let data67 = data58.pointId;
if(typeof data67 === "string"){
if(!pattern6.test(data67)){
const err189 = {instancePath:instancePath+"/legend/anchor/pointId",schemaPath:"#/$defs/anchor/oneOf/2/properties/pointId/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"+"\""};
if(vErrors === null){
vErrors = [err189];
}
else {
vErrors.push(err189);
}
errors++;
}
}
else {
const err190 = {instancePath:instancePath+"/legend/anchor/pointId",schemaPath:"#/$defs/anchor/oneOf/2/properties/pointId/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err190];
}
else {
vErrors.push(err190);
}
errors++;
}
}
if(data58.fallbackX !== undefined){
let data68 = data58.fallbackX;
if(!((typeof data68 == "number") && (isFinite(data68)))){
const err191 = {instancePath:instancePath+"/legend/anchor/fallbackX",schemaPath:"#/$defs/anchor/oneOf/2/properties/fallbackX/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err191];
}
else {
vErrors.push(err191);
}
errors++;
}
}
if(data58.fallbackY !== undefined){
let data69 = data58.fallbackY;
if(!((typeof data69 == "number") && (isFinite(data69)))){
const err192 = {instancePath:instancePath+"/legend/anchor/fallbackY",schemaPath:"#/$defs/anchor/oneOf/2/properties/fallbackY/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err192];
}
else {
vErrors.push(err192);
}
errors++;
}
}
if(data58.offsetXpx !== undefined){
let data70 = data58.offsetXpx;
if(!((typeof data70 == "number") && (isFinite(data70)))){
const err193 = {instancePath:instancePath+"/legend/anchor/offsetXpx",schemaPath:"#/$defs/anchor/oneOf/2/properties/offsetXpx/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err193];
}
else {
vErrors.push(err193);
}
errors++;
}
}
if(data58.offsetYpx !== undefined){
let data71 = data58.offsetYpx;
if(!((typeof data71 == "number") && (isFinite(data71)))){
const err194 = {instancePath:instancePath+"/legend/anchor/offsetYpx",schemaPath:"#/$defs/anchor/oneOf/2/properties/offsetYpx/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err194];
}
else {
vErrors.push(err194);
}
errors++;
}
}
}
else {
const err195 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf/2/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err195];
}
else {
vErrors.push(err195);
}
errors++;
}
var _valid0 = _errs132 === errors;
if(_valid0 && valid19){
valid19 = false;
passing0 = [passing0, 2];
}
else {
if(_valid0){
valid19 = true;
passing0 = 2;
if(props0 !== true){
props0 = true;
}
}
}
}
if(!valid19){
const err196 = {instancePath:instancePath+"/legend/anchor",schemaPath:"#/$defs/anchor/oneOf",keyword:"oneOf",params:{passingSchemas: passing0},message:"must match exactly one schema in oneOf"};
if(vErrors === null){
vErrors = [err196];
}
else {
vErrors.push(err196);
}
errors++;
}
else {
errors = _errs115;
if(vErrors !== null){
if(_errs115){
vErrors.length = _errs115;
}
else {
vErrors = null;
}
}
}
}
}
else {
const err197 = {instancePath:instancePath+"/legend",schemaPath:"#/properties/legend/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err197];
}
else {
vErrors.push(err197);
}
errors++;
}
}
if(data.viewport !== undefined){
let data72 = data.viewport;
if(data72 && typeof data72 == "object" && !Array.isArray(data72)){
if(data72.xMin === undefined){
const err198 = {instancePath:instancePath+"/viewport",schemaPath:"#/properties/viewport/required",keyword:"required",params:{missingProperty: "xMin"},message:"must have required property '"+"xMin"+"'"};
if(vErrors === null){
vErrors = [err198];
}
else {
vErrors.push(err198);
}
errors++;
}
if(data72.xMax === undefined){
const err199 = {instancePath:instancePath+"/viewport",schemaPath:"#/properties/viewport/required",keyword:"required",params:{missingProperty: "xMax"},message:"must have required property '"+"xMax"+"'"};
if(vErrors === null){
vErrors = [err199];
}
else {
vErrors.push(err199);
}
errors++;
}
if(data72.yMin === undefined){
const err200 = {instancePath:instancePath+"/viewport",schemaPath:"#/properties/viewport/required",keyword:"required",params:{missingProperty: "yMin"},message:"must have required property '"+"yMin"+"'"};
if(vErrors === null){
vErrors = [err200];
}
else {
vErrors.push(err200);
}
errors++;
}
if(data72.yMax === undefined){
const err201 = {instancePath:instancePath+"/viewport",schemaPath:"#/properties/viewport/required",keyword:"required",params:{missingProperty: "yMax"},message:"must have required property '"+"yMax"+"'"};
if(vErrors === null){
vErrors = [err201];
}
else {
vErrors.push(err201);
}
errors++;
}
for(const key11 in data72){
if(!((((key11 === "xMin") || (key11 === "xMax")) || (key11 === "yMin")) || (key11 === "yMax"))){
const err202 = {instancePath:instancePath+"/viewport",schemaPath:"#/properties/viewport/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key11},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err202];
}
else {
vErrors.push(err202);
}
errors++;
}
}
if(data72.xMin !== undefined){
let data73 = data72.xMin;
if(!((typeof data73 == "number") && (isFinite(data73)))){
const err203 = {instancePath:instancePath+"/viewport/xMin",schemaPath:"#/properties/viewport/properties/xMin/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err203];
}
else {
vErrors.push(err203);
}
errors++;
}
}
if(data72.xMax !== undefined){
let data74 = data72.xMax;
if(!((typeof data74 == "number") && (isFinite(data74)))){
const err204 = {instancePath:instancePath+"/viewport/xMax",schemaPath:"#/properties/viewport/properties/xMax/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err204];
}
else {
vErrors.push(err204);
}
errors++;
}
}
if(data72.yMin !== undefined){
let data75 = data72.yMin;
if(!((typeof data75 == "number") && (isFinite(data75)))){
const err205 = {instancePath:instancePath+"/viewport/yMin",schemaPath:"#/properties/viewport/properties/yMin/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err205];
}
else {
vErrors.push(err205);
}
errors++;
}
}
if(data72.yMax !== undefined){
let data76 = data72.yMax;
if(!((typeof data76 == "number") && (isFinite(data76)))){
const err206 = {instancePath:instancePath+"/viewport/yMax",schemaPath:"#/properties/viewport/properties/yMax/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err206];
}
else {
vErrors.push(err206);
}
errors++;
}
}
}
else {
const err207 = {instancePath:instancePath+"/viewport",schemaPath:"#/properties/viewport/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err207];
}
else {
vErrors.push(err207);
}
errors++;
}
}
if(data.editor !== undefined){
let data77 = data.editor;
if(data77 && typeof data77 == "object" && !Array.isArray(data77)){
if(data77.selectedObjectId === undefined){
const err208 = {instancePath:instancePath+"/editor",schemaPath:"#/properties/editor/required",keyword:"required",params:{missingProperty: "selectedObjectId"},message:"must have required property '"+"selectedObjectId"+"'"};
if(vErrors === null){
vErrors = [err208];
}
else {
vErrors.push(err208);
}
errors++;
}
if(data77.showPointMarkers === undefined){
const err209 = {instancePath:instancePath+"/editor",schemaPath:"#/properties/editor/required",keyword:"required",params:{missingProperty: "showPointMarkers"},message:"must have required property '"+"showPointMarkers"+"'"};
if(vErrors === null){
vErrors = [err209];
}
else {
vErrors.push(err209);
}
errors++;
}
for(const key12 in data77){
if(!((key12 === "selectedObjectId") || (key12 === "showPointMarkers"))){
const err210 = {instancePath:instancePath+"/editor",schemaPath:"#/properties/editor/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key12},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err210];
}
else {
vErrors.push(err210);
}
errors++;
}
}
if(data77.selectedObjectId !== undefined){
let data78 = data77.selectedObjectId;
const _errs163 = errors;
let valid25 = false;
const _errs164 = errors;
if(typeof data78 === "string"){
if(!pattern6.test(data78)){
const err211 = {instancePath:instancePath+"/editor/selectedObjectId",schemaPath:"#/properties/editor/properties/selectedObjectId/anyOf/0/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"+"\""};
if(vErrors === null){
vErrors = [err211];
}
else {
vErrors.push(err211);
}
errors++;
}
}
else {
const err212 = {instancePath:instancePath+"/editor/selectedObjectId",schemaPath:"#/properties/editor/properties/selectedObjectId/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err212];
}
else {
vErrors.push(err212);
}
errors++;
}
var _valid1 = _errs164 === errors;
valid25 = valid25 || _valid1;
const _errs166 = errors;
if(data78 !== null){
const err213 = {instancePath:instancePath+"/editor/selectedObjectId",schemaPath:"#/properties/editor/properties/selectedObjectId/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err213];
}
else {
vErrors.push(err213);
}
errors++;
}
var _valid1 = _errs166 === errors;
valid25 = valid25 || _valid1;
if(!valid25){
const err214 = {instancePath:instancePath+"/editor/selectedObjectId",schemaPath:"#/properties/editor/properties/selectedObjectId/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err214];
}
else {
vErrors.push(err214);
}
errors++;
}
else {
errors = _errs163;
if(vErrors !== null){
if(_errs163){
vErrors.length = _errs163;
}
else {
vErrors = null;
}
}
}
}
if(data77.showPointMarkers !== undefined){
if(typeof data77.showPointMarkers !== "boolean"){
const err215 = {instancePath:instancePath+"/editor/showPointMarkers",schemaPath:"#/properties/editor/properties/showPointMarkers/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err215];
}
else {
vErrors.push(err215);
}
errors++;
}
}
}
else {
const err216 = {instancePath:instancePath+"/editor",schemaPath:"#/properties/editor/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err216];
}
else {
vErrors.push(err216);
}
errors++;
}
}
if(data.extensions !== undefined){
let data80 = data.extensions;
if(data80 && typeof data80 == "object" && !Array.isArray(data80)){
}
else {
const err217 = {instancePath:instancePath+"/extensions",schemaPath:"#/properties/extensions/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err217];
}
else {
vErrors.push(err217);
}
errors++;
}
}
}
else {
const err218 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err218];
}
else {
vErrors.push(err218);
}
errors++;
}
validate45.errors = vErrors;
return errors === 0;
}
validate45.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate20(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate20.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
const _errs0 = errors;
let valid0 = true;
const _errs1 = errors;
if(errors === _errs1){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((data.schemaVersion === undefined) && (missing0 = "schemaVersion")){
const err0 = {};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
else {
if(data.schemaVersion !== undefined){
let data0 = data.schemaVersion;
const _errs3 = errors;
if(errors === _errs3){
if(typeof data0 === "string"){
if(!pattern4.test(data0)){
const err1 = {};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
else {
const err2 = {};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
}
}
}
}
else {
const err3 = {};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
var _valid0 = _errs1 === errors;
errors = _errs0;
if(vErrors !== null){
if(_errs0){
vErrors.length = _errs0;
}
else {
vErrors = null;
}
}
let ifClause0;
if(_valid0){
const _errs5 = errors;
if(!(validate21(data, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate21.errors : vErrors.concat(validate21.errors);
errors = vErrors.length;
}
var _valid0 = _errs5 === errors;
valid0 = _valid0;
if(valid0){
var props0 = true;
}
ifClause0 = "then";
}
else {
const _errs6 = errors;
const _errs7 = errors;
let valid2 = true;
const _errs8 = errors;
if(errors === _errs8){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing1;
if((data.schemaVersion === undefined) && (missing1 = "schemaVersion")){
const err4 = {};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
else {
if(data.schemaVersion !== undefined){
let data1 = data.schemaVersion;
const _errs10 = errors;
if(errors === _errs10){
if(typeof data1 === "string"){
if(!pattern27.test(data1)){
const err5 = {};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
else {
const err6 = {};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
}
}
}
else {
const err7 = {};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
var _valid1 = _errs8 === errors;
errors = _errs7;
if(vErrors !== null){
if(_errs7){
vErrors.length = _errs7;
}
else {
vErrors = null;
}
}
let ifClause1;
if(_valid1){
const _errs12 = errors;
if(!(validate27(data, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate27.errors : vErrors.concat(validate27.errors);
errors = vErrors.length;
}
var _valid1 = _errs12 === errors;
valid2 = _valid1;
if(valid2){
var props1 = true;
}
ifClause1 = "then";
}
else {
const _errs13 = errors;
const _errs14 = errors;
let valid4 = true;
const _errs15 = errors;
if(errors === _errs15){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing2;
if((data.schemaVersion === undefined) && (missing2 = "schemaVersion")){
const err8 = {};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
else {
if(data.schemaVersion !== undefined){
let data2 = data.schemaVersion;
const _errs17 = errors;
if(errors === _errs17){
if(typeof data2 === "string"){
if(!pattern51.test(data2)){
const err9 = {};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
else {
const err10 = {};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
}
}
}
else {
const err11 = {};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
var _valid2 = _errs15 === errors;
errors = _errs14;
if(vErrors !== null){
if(_errs14){
vErrors.length = _errs14;
}
else {
vErrors = null;
}
}
let ifClause2;
if(_valid2){
const _errs19 = errors;
if(!(validate35(data, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate35.errors : vErrors.concat(validate35.errors);
errors = vErrors.length;
}
var _valid2 = _errs19 === errors;
valid4 = _valid2;
if(valid4){
var props2 = true;
}
ifClause2 = "then";
}
else {
const _errs20 = errors;
if(!(validate45(data, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate45.errors : vErrors.concat(validate45.errors);
errors = vErrors.length;
}
var _valid2 = _errs20 === errors;
valid4 = _valid2;
if(valid4){
if(props2 !== true){
props2 = true;
}
}
ifClause2 = "else";
}
if(!valid4){
const err12 = {instancePath,schemaPath:"#/else/else/if",keyword:"if",params:{failingKeyword: ifClause2},message:"must match \""+ifClause2+"\" schema"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
var _valid1 = _errs13 === errors;
valid2 = _valid1;
if(valid2){
if(props1 !== true && props2 !== undefined){
if(props2 === true){
props1 = true;
}
else {
props1 = props1 || {};
Object.assign(props1, props2);
}
}
}
ifClause1 = "else";
}
if(!valid2){
const err13 = {instancePath,schemaPath:"#/else/if",keyword:"if",params:{failingKeyword: ifClause1},message:"must match \""+ifClause1+"\" schema"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
var _valid0 = _errs6 === errors;
valid0 = _valid0;
if(valid0){
if(props0 !== true && props1 !== undefined){
if(props1 === true){
props0 = true;
}
else {
props0 = props0 || {};
Object.assign(props0, props1);
}
}
}
ifClause0 = "else";
}
if(!valid0){
const err14 = {instancePath,schemaPath:"#/if",keyword:"if",params:{failingKeyword: ifClause0},message:"must match \""+ifClause0+"\" schema"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
validate20.errors = vErrors;
evaluated0.props = props0;
return errors === 0;
}
validate20.evaluated = {"dynamicProps":true,"dynamicItems":false};
