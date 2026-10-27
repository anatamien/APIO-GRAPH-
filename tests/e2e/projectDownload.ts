import {deserialize} from '../../src/domain/project';
import {readWorkspace,workspaceKind} from '../../src/features/workspace/archive';
/** A test inspecting the active graph must also inspect the current multi-tab save format. */
export async function downloadedGraph(input:Uint8Array|string){const bytes=typeof input==='string'?new TextEncoder().encode(input):new Uint8Array(input);if(workspaceKind(bytes)){const archive=await readWorkspace(bytes);if(!archive.manifest.activeId)throw new Error('EMPTY_WORKSPACE');return archive.graph(archive.manifest.activeId)}return deserialize(new TextDecoder().decode(bytes)).project}
