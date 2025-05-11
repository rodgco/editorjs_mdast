import { editorJsToMdast } from '../src';
import { toMarkdown } from 'mdast-util-to-markdown';

// Sample Editor.js data
const editorJsData = {
  time: 1625756954764,
  blocks: [
    {
      id: '1',
      type: 'header',
      data: {
        text: 'Editor.js to MDAST Example',
        level: 1,
      },
    },
    {
      id: '2',
      type: 'paragraph',
      data: {
        text: 'This is a simple example of converting Editor.js output to MDAST format.',
      },
    },
    {
      id: '3',
      type: 'list',
      data: {
        style: 'unordered',
        items: [
          'It works with paragraphs',
          'Headers of different levels',
          'Lists (both ordered and unordered)',
          'And many other block types!',
        ],
      },
    },
    {
      id: '4',
      type: 'code',
      data: {
        code: 'const mdast = editorJsToMdast(editorJsData);\nconsole.log(JSON.stringify(mdast, null, 2));',
        language: 'javascript',
      },
    },
    {
      id: '5',
      type: 'quote',
      data: {
        text: 'Editor.js and MDAST work great together!',
        caption: 'Happy Developer',
      },
    },
    {
      id: '6',
      type: 'delimiter',
      data: {},
    },
    {
      id: '7',
      type: 'paragraph',
      data: {
        text: 'Now you can use this MDAST structure with other unist/mdast utilities!',
      },
    },
  ],
  version: '2.22.2',
};

// Convert to MDAST
const mdast = editorJsToMdast(editorJsData);

// Print the MDAST structure
console.log('MDAST Structure:');
console.log(JSON.stringify(mdast, null, 2));

// Convert to Markdown to show the result
const markdown = toMarkdown(mdast);
console.log('\nMarkdown Output:');
console.log(markdown);