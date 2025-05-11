import { EditorJSData, EditorJSBlock, MdastRoot, MdastNode } from '../types';
import { converters } from './converters';

/**
 * Convert MDAST to EditorJS data
 */
export function mdastToEditorJs(mdast: MdastRoot): EditorJSData {
  // Make sure we have a root node
  if (mdast.type !== 'root') {
    throw new Error('Expected a root MDAST node');
  }
  
  // Convert each MDAST node to its corresponding EditorJS block
  const blocks = mdast.children
    .map(convertNode)
    .filter((block): block is EditorJSBlock => block !== null);
  
  return {
    time: Date.now(),
    blocks,
    version: '2.28.0', // Current version as of creation, can be customized
  };
}

/**
 * Convert a single MDAST node to an EditorJS block
 */
function convertNode(node: MdastNode): EditorJSBlock | null {
  const converter = converters[node.type];
  
  if (!converter) {
    console.warn(`No converter found for MDAST node type: ${node.type}`);
    return null;
  }
  
  try {
    return converter(node);
  } catch (error) {
    console.error(`Error converting MDAST node of type ${node.type}:`, error);
    return null;
  }
}

export * from './converters';