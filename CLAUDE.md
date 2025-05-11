# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

The `editorjs_mdast` project provides two-way conversion between [Editor.js](https://editorjs.io/) JSON blocks and [MDAST](https://github.com/syntax-tree/mdast) (Markdown Abstract Syntax Tree). This allows for seamless integration between Editor.js content and markdown processing pipelines.

## Development Setup

The project uses pnpm as its package manager.

### Install Dependencies
```bash
pnpm install
```

### Build Commands
```bash
# Compile TypeScript to JavaScript
pnpm build

# Format code
pnpm format

# Lint code
pnpm lint
```

### Test Commands
```bash
# Run all tests
pnpm test

# Run a specific test file
pnpm jest src/path/to/file.test.ts
```

## Architecture

The project is organized with a clear module structure:

- `src/types.ts`: TypeScript type definitions for Editor.js blocks and MDAST nodes
- `src/editorjs-to-mdast/`: Module for converting Editor.js blocks to MDAST
  - `src/editorjs-to-mdast/converters.ts`: Individual converter functions for each block type
  - `src/editorjs-to-mdast/index.ts`: Main conversion logic and API
- `src/mdast-to-editorjs/`: Module for converting MDAST nodes to Editor.js blocks
  - `src/mdast-to-editorjs/converters.ts`: Individual converter functions for each node type
  - `src/mdast-to-editorjs/index.ts`: Main conversion logic and API
- `src/index.ts`: Main entry point that exports all conversion functionality

### Conversion Flows:

#### Editor.js to MDAST:
1. `editorJsToMdast()` processes each Editor.js block sequentially
2. Each block is dispatched to its specific converter based on its type
3. Converters transform the block data into valid MDAST nodes
4. The resulting nodes are combined into a complete MDAST tree

#### MDAST to Editor.js:
1. `mdastToEditorJs()` processes each MDAST node sequentially
2. Each node is dispatched to its specific converter based on its type
3. Converters transform the node into valid Editor.js blocks
4. The resulting blocks are combined into a complete Editor.js data structure

## Tech Stack

- Language: TypeScript
- Package manager: pnpm v10.4.1
- Testing: Jest
- Linting: ESLint
- Formatting: Prettier
- Runtime: Node.js
- Dependencies:
  - uuid: for generating block IDs
  - mdast utilities: for markdown processing

## Supported Conversions

### Editor.js to MDAST:
- paragraph → paragraph
- header → heading
- list → list
- image → image
- code → code
- quote → blockquote
- delimiter → thematicBreak

### MDAST to Editor.js:
- paragraph → paragraph
- heading → header
- list → list
- code → code
- image → image
- blockquote → quote
- thematicBreak → delimiter