import { editorJsToMdast } from './index';
import { EditorJSData, MdastRoot } from '../types';

describe('editorJsToMdast', () => {
  it('should convert a paragraph block', () => {
    const editorData: EditorJSData = {
      time: 1625756954764,
      blocks: [
        {
          id: '1',
          type: 'paragraph',
          data: {
            text: 'Hello, world!',
          },
        },
      ],
      version: '2.22.2',
    };

    const expected: MdastRoot = {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'Hello, world!',
            },
          ],
        },
      ],
    };

    const result = editorJsToMdast(editorData);
    expect(result).toEqual(expected);
  });

  it('should convert a header block', () => {
    const editorData: EditorJSData = {
      time: 1625756954764,
      blocks: [
        {
          id: '1',
          type: 'header',
          data: {
            text: 'This is a heading',
            level: 2,
          },
        },
      ],
      version: '2.22.2',
    };

    const expected: MdastRoot = {
      type: 'root',
      children: [
        {
          type: 'heading',
          depth: 2,
          children: [
            {
              type: 'text',
              value: 'This is a heading',
            },
          ],
        },
      ],
    };

    const result = editorJsToMdast(editorData);
    expect(result).toEqual(expected);
  });

  it('should convert a list block', () => {
    const editorData: EditorJSData = {
      time: 1625756954764,
      blocks: [
        {
          id: '1',
          type: 'list',
          data: {
            style: 'ordered',
            items: ['First item', 'Second item', 'Third item'],
          },
        },
      ],
      version: '2.22.2',
    };

    const expected: MdastRoot = {
      type: 'root',
      children: [
        {
          type: 'list',
          ordered: true,
          children: [
            {
              type: 'listItem',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value: 'First item',
                    },
                  ],
                },
              ],
            },
            {
              type: 'listItem',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value: 'Second item',
                    },
                  ],
                },
              ],
            },
            {
              type: 'listItem',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value: 'Third item',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };

    const result = editorJsToMdast(editorData);
    expect(result).toEqual(expected);
  });

  it('should handle missing converters gracefully', () => {
    const editorData: EditorJSData = {
      time: 1625756954764,
      blocks: [
        {
          id: '1',
          type: 'nonexistent',
          data: {},
        },
      ],
      version: '2.22.2',
    };

    const expected: MdastRoot = {
      type: 'root',
      children: [],
    };

    const result = editorJsToMdast(editorData);
    expect(result).toEqual(expected);
  });
});