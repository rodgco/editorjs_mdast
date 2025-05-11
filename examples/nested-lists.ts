import { editorJsToMdast, mdastToEditorJs } from '../src';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { toMarkdown } from 'mdast-util-to-markdown';

// Example 1: Convert from Editor.js to MDAST
console.log('========= EDITOR.JS TO MDAST CONVERSION =========');
const editorJsData = {
  time: 1625756954764,
  blocks: [
    {
      id: '1',
      type: 'header',
      data: {
        text: 'Nested Lists Example',
        level: 1,
      },
    },
    {
      id: '2',
      type: 'paragraph',
      data: {
        text: 'This example demonstrates nested lists conversion between Editor.js and MDAST.',
      },
    },
    {
      id: '3',
      type: 'list',
      data: {
        style: 'unordered',
        items: [
          'Simple item at root level',
          {
            content: 'Item with a nested unordered list',
            items: [
              { content: 'First nested item' },
              { content: 'Second nested item' },
              { 
                content: 'Third nested item with deeper nesting',
                items: [
                  { content: 'Deep nested item 1' },
                  { content: 'Deep nested item 2' }
                ]
              }
            ]
          },
          'Another simple item at root level',
          {
            content: 'Item with a nested ordered list',
            items: [
              { content: 'First ordered nested item' },
              { content: 'Second ordered nested item' }
            ]
          }
        ],
      },
    },
    {
      id: '4',
      type: 'paragraph',
      data: {
        text: 'The nested lists should be preserved when converting to MDAST and back.',
      },
    },
  ],
  version: '2.28.0',
};

// Convert from Editor.js to MDAST
const mdast = editorJsToMdast(editorJsData);
console.log('MDAST Structure:');
console.log(JSON.stringify(mdast, null, 2));

// Convert MDAST to Markdown
const markdown = toMarkdown(mdast);
console.log('\nResulting Markdown:');
console.log(markdown);

// Example 2: Convert Markdown with nested lists to Editor.js
console.log('\n\n========= MARKDOWN TO EDITOR.JS CONVERSION =========');
const markdownContent = `
# Nested Lists in Markdown

This example demonstrates converting Markdown with nested lists to Editor.js.

- First level item
- Another first level item
  - Second level item A
  - Second level item B
    - Third level item 1
    - Third level item 2
  - Back to second level
- Final first level item

1. First ordered item
2. Second ordered item
   - Unordered inside ordered
   - Another unordered inside ordered
     1. Ordered inside unordered inside ordered
     2. Another level of nesting
   - Back to unordered
3. Back to first level ordered
`;

// Parse Markdown to MDAST
const mdastFromMarkdown = fromMarkdown(markdownContent);

// Convert MDAST to Editor.js
const editorJsResult = mdastToEditorJs(mdastFromMarkdown);

console.log('Editor.js Structure:');
console.log(JSON.stringify(editorJsResult, null, 2));

// Full round trip: Markdown -> MDAST -> Editor.js -> MDAST -> Markdown
console.log('\n\n========= FULL ROUND TRIP CONVERSION =========');
const mdastAgain = editorJsToMdast(editorJsResult);
const markdownAgain = toMarkdown(mdastAgain);

console.log('Markdown after full round trip:');
console.log(markdownAgain);