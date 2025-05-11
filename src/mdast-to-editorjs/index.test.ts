import { mdastToEditorJs } from './index';
import { MdastRoot } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Mock the uuid function for consistent test results
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid')
}));

describe('mdastToEditorJs', () => {
  it('should convert a paragraph node', () => {
    const mdast: MdastRoot = {
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

    const result = mdastToEditorJs(mdast);
    
    // Test only the relevant parts (ignoring time which will vary)
    expect(result.blocks).toEqual([
      {
        id: 'test-uuid',
        type: 'paragraph',
        data: {
          text: 'Hello, world!',
        },
      },
    ]);
  });

  it('should convert a heading node', () => {
    const mdast: MdastRoot = {
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

    const result = mdastToEditorJs(mdast);
    
    expect(result.blocks).toEqual([
      {
        id: 'test-uuid',
        type: 'header',
        data: {
          text: 'This is a heading',
          level: 2,
        },
      },
    ]);
  });

  it('should convert a simple list node', () => {
    const mdast: MdastRoot = {
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
          ],
        },
      ],
    };

    const result = mdastToEditorJs(mdast);

    expect(result.blocks).toEqual([
      {
        id: 'test-uuid',
        type: 'list',
        data: {
          style: 'ordered',
          items: ['First item', 'Second item'],
        },
      },
    ]);
  });

  it('should convert a nested list node', () => {
    const mdast: MdastRoot = {
      type: 'root',
      children: [
        {
          type: 'list',
          ordered: false,
          children: [
            // First item (simple)
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
            // Second item with nested list
            {
              type: 'listItem',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value: 'Second item with nested list',
                    },
                  ],
                },
                {
                  type: 'list',
                  ordered: false,
                  children: [
                    // Nested item 1
                    {
                      type: 'listItem',
                      children: [
                        {
                          type: 'paragraph',
                          children: [
                            {
                              type: 'text',
                              value: 'Nested item 1',
                            },
                          ],
                        },
                      ],
                    },
                    // Nested item 2 with deeper nesting
                    {
                      type: 'listItem',
                      children: [
                        {
                          type: 'paragraph',
                          children: [
                            {
                              type: 'text',
                              value: 'Nested item with deeper nesting',
                            },
                          ],
                        },
                        {
                          type: 'list',
                          ordered: true, // Note: different list style
                          children: [
                            // Deep nested item
                            {
                              type: 'listItem',
                              children: [
                                {
                                  type: 'paragraph',
                                  children: [
                                    {
                                      type: 'text',
                                      value: 'Deep nested item',
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            // Third item (simple)
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

    const result = mdastToEditorJs(mdast);

    expect(result.blocks).toEqual([
      {
        id: 'test-uuid',
        type: 'list',
        data: {
          style: 'unordered',
          items: [
            'First item',
            {
              content: 'Second item with nested list',
              items: [
                { content: 'Nested item 1' },
                {
                  content: 'Nested item with deeper nesting',
                  items: [
                    { content: 'Deep nested item' }
                  ]
                }
              ]
            },
            'Third item'
          ],
        },
      },
    ]);
  });

  it('should convert a code node', () => {
    const mdast: MdastRoot = {
      type: 'root',
      children: [
        {
          type: 'code',
          lang: 'javascript',
          value: 'const x = 1;',
        },
      ],
    };

    const result = mdastToEditorJs(mdast);
    
    expect(result.blocks).toEqual([
      {
        id: 'test-uuid',
        type: 'code',
        data: {
          code: 'const x = 1;',
          language: 'javascript',
        },
      },
    ]);
  });

  it('should handle missing converters gracefully', () => {
    const mdast: MdastRoot = {
      type: 'root',
      children: [
        {
          type: 'unknown',
          children: [],
        },
      ],
    };

    const result = mdastToEditorJs(mdast);
    
    expect(result.blocks).toEqual([]);
  });

  it('should throw an error if not given a root node', () => {
    const invalidMdast = {
      type: 'paragraph',
      children: [],
    } as any;

    expect(() => mdastToEditorJs(invalidMdast)).toThrow('Expected a root MDAST node');
  });
});