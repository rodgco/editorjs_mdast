import {
  EditorJSBlock,
  MdastNode,
  MdastParagraph,
  MdastHeading,
  MdastText,
  MdastList,
  MdastListItem,
  MdastImage,
  MdastCode,
  MdastBlockquote,
} from '../types';

/**
 * Convert a paragraph block to MDAST paragraph
 */
export function convertParagraph(block: EditorJSBlock): MdastParagraph {
  return {
    type: 'paragraph',
    children: [
      {
        type: 'text',
        value: block.data.text || '',
      },
    ],
  };
}

/**
 * Convert a heading block to MDAST heading
 */
export function convertHeader(block: EditorJSBlock): MdastHeading {
  return {
    type: 'heading',
    depth: block.data.level || 1,
    children: [
      {
        type: 'text',
        value: block.data.text || '',
      },
    ],
  };
}

/**
 * Convert a list block to MDAST list
 */
export function convertList(block: EditorJSBlock): MdastList {
  const items = (block.data.items || []).map(
    (item: string | { content: string }): MdastListItem => {
      const itemText = typeof item === 'string' ? item : item.content || '';

      return {
        type: 'listItem',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                value: itemText,
              },
            ],
          },
        ],
      };
    }
  );

  return {
    type: 'list',
    ordered: block.data.style === 'ordered',
    children: items,
  };
}

/**
 * Convert an image block to MDAST image
 */
export function convertImage(block: EditorJSBlock): MdastImage {
  return {
    type: 'image',
    url: block.data.file?.url || block.data.url || '',
    alt: block.data.caption || '',
    title: block.data.caption || '',
  };
}

/**
 * Convert a code block to MDAST code
 */
export function convertCode(block: EditorJSBlock): MdastCode {
  return {
    type: 'code',
    lang: block.data.language || null,
    value: block.data.code || '',
  };
}

/**
 * Convert a quote block to MDAST blockquote
 */
export function convertQuote(block: EditorJSBlock): MdastBlockquote {
  const children: MdastNode[] = [];
  
  // Add the quote text
  if (block.data.text) {
    children.push({
      type: 'paragraph',
      children: [
        {
          type: 'text',
          value: block.data.text,
        },
      ],
    });
  }
  
  // Add the caption if it exists
  if (block.data.caption) {
    children.push({
      type: 'paragraph',
      children: [
        {
          type: 'text',
          value: `— ${block.data.caption}`,
        },
      ],
    });
  }
  
  return {
    type: 'blockquote',
    children,
  };
}

/**
 * Convert a delimiter block to MDAST thematic break
 */
export function convertDelimiter(): MdastNode {
  return {
    type: 'thematicBreak',
  };
}

/**
 * Map of converter functions for each EditorJS block type
 */
export const converters: Record<string, (block: EditorJSBlock) => MdastNode> = {
  paragraph: convertParagraph,
  header: convertHeader,
  list: convertList,
  image: convertImage,
  code: convertCode,
  quote: convertQuote,
  delimiter: convertDelimiter,
};