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
  // Handle both string items and nested list items
  const items = (block.data.items || []).map((item: string | any): MdastListItem => {
    // Check if this is a nested list item (object with content and items)
    if (typeof item === 'object' && item !== null) {
      const children: MdastNode[] = [
        // First add the content as a paragraph
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: item.content || '',
            },
          ],
        }
      ];

      // If there are nested items, recursively convert them to a nested list
      if (Array.isArray(item.items) && item.items.length > 0) {
        children.push(
          convertNestedList(item.items, block.data.style)
        );
      }

      return {
        type: 'listItem',
        children,
      };
    } else {
      // Handle simple string items (non-nested)
      return {
        type: 'listItem',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                value: item,
              },
            ],
          },
        ],
      };
    }
  });

  return {
    type: 'list',
    ordered: block.data.style === 'ordered',
    children: items,
  };
}

/**
 * Helper function to convert nested list items
 */
function convertNestedList(items: any[], style: string): MdastList {
  const listItems = items.map((item): MdastListItem => {
    const children: MdastNode[] = [
      // First add the content as a paragraph
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            value: typeof item === 'object' ? (item.content || '') : (item || ''),
          },
        ],
      }
    ];

    // If there are nested items, recursively convert them
    if (typeof item === 'object' && Array.isArray(item.items) && item.items.length > 0) {
      children.push(
        convertNestedList(item.items, style)
      );
    }

    return {
      type: 'listItem',
      children,
    };
  });

  return {
    type: 'list',
    ordered: style === 'ordered',
    children: listItems,
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