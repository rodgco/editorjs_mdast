# editorjs_mdast

Two-way conversion between [Editor.js](https://editorjs.io/) JSON blocks and [MDAST](https://github.com/syntax-tree/mdast) (Markdown Abstract Syntax Tree).

## Installation

```bash
npm install editorjs_mdast
# or
yarn add editorjs_mdast
# or
pnpm add editorjs_mdast
```

## Usage

### Converting Editor.js to MDAST

```typescript
import { editorJsToMdast } from 'editorjs_mdast';
import { toMarkdown } from 'mdast-util-to-markdown';

// Your Editor.js data
const editorJsData = {
  time: 1625756954764,
  blocks: [
    {
      id: '1',
      type: 'paragraph',
      data: {
        text: 'Hello, world!',
      },
    },
    {
      id: '2',
      type: 'header',
      data: {
        text: 'This is a heading',
        level: 2,
      },
    },
  ],
  version: '2.22.2',
};

// Convert to MDAST
const mdast = editorJsToMdast(editorJsData);

// Convert MDAST to Markdown (optional)
const markdown = toMarkdown(mdast);
console.log(markdown);
// Output:
// Hello, world!
//
// ## This is a heading
```

### Converting MDAST to Editor.js

```typescript
import { mdastToEditorJs } from 'editorjs_mdast';
import { fromMarkdown } from 'mdast-util-from-markdown';

// Create or parse MDAST
const mdast = fromMarkdown(`
# Heading

This is a paragraph with some text.

- List item 1
- List item 2
`);

// Convert to Editor.js data
const editorJsData = mdastToEditorJs(mdast);

console.log(JSON.stringify(editorJsData, null, 2));
// Output: Editor.js compatible JSON structure
```

## Library Structure

The library is organized into two main modules:

- **editorjs-to-mdast**: Converts Editor.js JSON blocks to MDAST structure
- **mdast-to-editorjs**: Converts MDAST structure to Editor.js JSON blocks

## Supported Conversions

| Editor.js Block | MDAST Node    | Notes                       |
|-----------------|---------------|----------------------------|
| paragraph       | paragraph     | Text content is preserved   |
| header          | heading       | Level is preserved          |
| list            | list          | Ordered/unordered preserved |
| nested list     | nested list   | Full nested structure preserved |
| image           | image         | URL and caption preserved   |
| code            | code          | Language is preserved       |
| quote           | blockquote    | Caption becomes attribution |
| delimiter       | thematicBreak | Horizontal rule            |

### Nested Lists Support

This library fully supports nested lists conversion between Editor.js and MDAST. It works with:

- Lists with arbitrary nesting depth
- Mixed ordered/unordered nested lists
- The official Editor.js nested list format

Example Editor.js nested list structure:
```javascript
{
  type: "list",
  data: {
    style: "unordered",
    items: [
      "Simple item",
      {
        content: "Item with nested list",
        items: [
          { content: "Nested item 1" },
          { content: "Nested item 2" }
        ]
      }
    ]
  }
}
```

## Development

```bash
# Install dependencies
pnpm install

# Build the project
pnpm build

# Run tests
pnpm test

# Lint code
pnpm lint

# Format code
pnpm format
```

## License

ISC