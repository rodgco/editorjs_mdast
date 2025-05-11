import { EditorJSBlock, MdastNode } from '../types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Convert MDAST paragraph to EditorJS paragraph block
 */
export function convertParagraphToEditorJs(node: MdastNode): EditorJSBlock {
  const text = getTextContent(node);
  
  return {
    id: uuidv4(),
    type: 'paragraph',
    data: {
      text,
    },
  };
}

/**
 * Convert MDAST heading to EditorJS header block
 */
export function convertHeadingToEditorJs(node: MdastNode): EditorJSBlock {
  const text = getTextContent(node);
  
  return {
    id: uuidv4(),
    type: 'header',
    data: {
      text,
      level: node.depth || 1,
    },
  };
}

/**
 * Convert MDAST list to EditorJS list block
 */
export function convertListToEditorJs(node: MdastNode): EditorJSBlock {
  const items = node.children?.map(item => {
    // A list item usually contains at least one paragraph
    const content = getTextContent(item);
    return { content };
  }) || [];

  return {
    id: uuidv4(),
    type: 'list',
    data: {
      style: node.ordered ? 'ordered' : 'unordered',
      items,
    },
  };
}

/**
 * Convert MDAST code to EditorJS code block
 */
export function convertCodeToEditorJs(node: MdastNode): EditorJSBlock {
  return {
    id: uuidv4(),
    type: 'code',
    data: {
      code: node.value || '',
      language: node.lang || '',
    },
  };
}

/**
 * Convert MDAST image to EditorJS image block
 */
export function convertImageToEditorJs(node: MdastNode): EditorJSBlock {
  return {
    id: uuidv4(),
    type: 'image',
    data: {
      url: node.url || '',
      caption: node.alt || '',
      withBorder: false,
      withBackground: false,
      stretched: false,
    },
  };
}

/**
 * Convert MDAST blockquote to EditorJS quote block
 */
export function convertBlockquoteToEditorJs(node: MdastNode): EditorJSBlock {
  // A blockquote may contain multiple children
  // We'll use the first paragraph for the quote text
  // and look for a caption format in subsequent paragraphs
  let text = '';
  let caption = '';
  
  if (node.children && node.children.length > 0) {
    // First paragraph is the quote text
    const firstChild = node.children[0];
    text = getTextContent(firstChild);
    
    // If there's a second paragraph, it might be the caption
    if (node.children.length > 1) {
      const secondChild = node.children[1];
      const secondText = getTextContent(secondChild);
      
      // If the text starts with an em-dash or similar, it's likely a caption
      if (secondText.startsWith('—') || secondText.startsWith('-')) {
        caption = secondText.replace(/^[—-]\s*/, '');
      } else {
        // Otherwise, it's part of the quote
        text += '\\n\\n' + secondText;
      }
    }
  }
  
  return {
    id: uuidv4(),
    type: 'quote',
    data: {
      text,
      caption,
      alignment: 'left',
    },
  };
}

/**
 * Convert MDAST thematic break to EditorJS delimiter block
 */
export function convertThematicBreakToEditorJs(): EditorJSBlock {
  return {
    id: uuidv4(),
    type: 'delimiter',
    data: {},
  };
}

/**
 * Helper function to extract text content from a node and its children
 */
function getTextContent(node: MdastNode): string {
  if (node.type === 'text') {
    return node.value || '';
  }

  if (node.children && node.children.length > 0) {
    return node.children.map(getTextContent).join('');
  }

  // For nodes with no children but with a value property (like code blocks)
  if (node.value) {
    return node.value;
  }

  return '';
}

/**
 * Map of converter functions for each MDAST node type
 */
export const converters: Record<string, (node: MdastNode) => EditorJSBlock> = {
  paragraph: convertParagraphToEditorJs,
  heading: convertHeadingToEditorJs,
  list: convertListToEditorJs,
  code: convertCodeToEditorJs,
  image: convertImageToEditorJs,
  blockquote: convertBlockquoteToEditorJs,
  thematicBreak: convertThematicBreakToEditorJs,
};