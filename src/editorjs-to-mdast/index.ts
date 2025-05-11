import { EditorJSData, EditorJSBlock, MdastRoot, MdastNode } from '../types';
import { converters } from './converters';

/**
 * Convert EditorJS data to MDAST
 */
export function editorJsToMdast(editorData: EditorJSData): MdastRoot {
  // Convert each block to its corresponding MDAST node
  const children = editorData.blocks
    .map(convertBlock)
    .filter((node): node is MdastNode => node !== null);

  return {
    type: 'root',
    children,
  };
}

/**
 * Convert a single EditorJS block to a MDAST node
 */
function convertBlock(block: EditorJSBlock): MdastNode | null {
  const converter = converters[block.type];
  
  if (!converter) {
    console.warn(`No converter found for block type: ${block.type}`);
    return null;
  }
  
  try {
    return converter(block);
  } catch (error) {
    console.error(`Error converting block of type ${block.type}:`, error);
    return null;
  }
}

export * from './converters';