/**
 * Types for Editor.js data structures
 */

export interface EditorJSData {
  time: number;
  blocks: EditorJSBlock[];
  version: string;
}

export interface EditorJSBlock {
  id: string;
  type: string;
  data: Record<string, any>;
}

/**
 * Common MDAST node properties
 */
export interface MdastNode {
  type: string;
  children?: MdastNode[];
  value?: string;
  [key: string]: any;
}

export interface MdastRoot extends MdastNode {
  type: 'root';
  children: MdastNode[];
}

export interface MdastParagraph extends MdastNode {
  type: 'paragraph';
  children: MdastNode[];
}

export interface MdastHeading extends MdastNode {
  type: 'heading';
  depth: number;
  children: MdastNode[];
}

export interface MdastText extends MdastNode {
  type: 'text';
  value: string;
}

export interface MdastList extends MdastNode {
  type: 'list';
  ordered: boolean;
  children: MdastNode[];
}

export interface MdastListItem extends MdastNode {
  type: 'listItem';
  children: MdastNode[];
}

export interface MdastCode extends MdastNode {
  type: 'code';
  lang?: string;
  value: string;
}

export interface MdastImage extends MdastNode {
  type: 'image';
  url: string;
  alt?: string;
  title?: string;
}

export interface MdastLink extends MdastNode {
  type: 'link';
  url: string;
  title?: string;
  children: MdastNode[];
}

export interface MdastBlockquote extends MdastNode {
  type: 'blockquote';
  children: MdastNode[];
}

export interface MdastTable extends MdastNode {
  type: 'table';
  children: MdastNode[];
}

export interface MdastTableRow extends MdastNode {
  type: 'tableRow';
  children: MdastNode[];
}

export interface MdastTableCell extends MdastNode {
  type: 'tableCell';
  children: MdastNode[];
}

export interface MdastEmphasis extends MdastNode {
  type: 'emphasis';
  children: MdastNode[];
}

export interface MdastStrong extends MdastNode {
  type: 'strong';
  children: MdastNode[];
}