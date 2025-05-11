import { mdastToEditorJs } from '../src';
import { fromMarkdown } from 'mdast-util-from-markdown';

// Parse markdown to MDAST
const mdast = fromMarkdown(`
# Converting Markdown to Editor.js

This example demonstrates converting Markdown to Editor.js JSON format
using the MDAST as an intermediate representation.

## Features

- Supports headings of different levels
- Handles paragraphs with text
- Works with lists:
  - Unordered lists
  - Ordered lists
  
## Code Example

\`\`\`javascript
// Convert MDAST to Editor.js data
const editorJsData = mdastToEditorJs(mdast);
console.log(JSON.stringify(editorJsData, null, 2));
\`\`\`

---

> The library makes it easy to bridge the gap between
> Markdown and Editor.js
> 
> — Documentation

`);

// Convert to Editor.js data
const editorJsData = mdastToEditorJs(mdast);

// Print the result
console.log('Editor.js Structure:');
console.log(JSON.stringify(editorJsData, null, 2));