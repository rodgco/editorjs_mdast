import { editorJsToMdast, mdastToEditorJs } from './index';
import { EditorJSData, MdastNode, MdastRoot } from './types';
import { v4 as uuidv4 } from 'uuid';

// Mock the uuid function for consistent test results
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid')
}));

describe('Nested Lists: Complex Scenarios', () => {
  describe('EditorJS to MDAST conversion', () => {
    it('should convert deeply nested lists (3+ levels) correctly', () => {
      const editorData: EditorJSData = {
        time: 1625756954764,
        blocks: [
          {
            id: '1',
            type: 'list',
            data: {
              style: 'unordered',
              items: [
                'Level 1 - Item 1',
                {
                  content: 'Level 1 - Item 2 with nested list',
                  items: [
                    { content: 'Level 2 - Item 1' },
                    {
                      content: 'Level 2 - Item 2 with deeper nesting',
                      items: [
                        { content: 'Level 3 - Item 1' },
                        {
                          content: 'Level 3 - Item 2 with deepest nesting',
                          items: [
                            { content: 'Level 4 - Item 1' },
                            { content: 'Level 4 - Item 2' }
                          ]
                        },
                        { content: 'Level 3 - Item 3' }
                      ]
                    },
                    { content: 'Level 2 - Item 3' }
                  ]
                },
                'Level 1 - Item 3'
              ],
            },
          },
        ],
        version: '2.22.2',
      };

      const result = editorJsToMdast(editorData);

      // Verify structure at each nesting level
      expect(result.type).toBe('root');
      expect(result.children.length).toBe(1);

      // Level 1 - Main list
      const mainList = result.children[0] as MdastNode;
      expect(mainList.type).toBe('list');
      expect(mainList.ordered).toBe(false);
      expect(mainList.children?.length).toBe(3);

      // Level 2 - First nested list
      const level1Item2 = mainList.children?.[1] as MdastNode;
      expect(level1Item2.children?.length).toBe(2); // Content paragraph + nested list
      expect(level1Item2.children?.[0].type).toBe('paragraph');

      const level2List = level1Item2.children?.[1] as MdastNode;
      expect(level2List.type).toBe('list');
      expect(level2List.children?.length).toBe(3);

      // Level 3 - Second nested list
      const level2Item2 = level2List.children?.[1] as MdastNode;
      expect(level2Item2.children?.length).toBe(2); // Content paragraph + nested list

      const level3List = level2Item2.children?.[1] as MdastNode;
      expect(level3List.type).toBe('list');
      expect(level3List.children?.length).toBe(3);

      // Level 4 - Deepest nested list
      const level3Item2 = level3List.children?.[1] as MdastNode;
      expect(level3Item2.children?.length).toBe(2); // Content paragraph + nested list

      const level4List = level3Item2.children?.[1] as MdastNode;
      expect(level4List.type).toBe('list');
      expect(level4List.children?.length).toBe(2);
    });

    it('should convert mixed list types (ordered and unordered) at different levels', () => {
      const editorData: EditorJSData = {
        time: 1625756954764,
        blocks: [
          {
            id: '1',
            type: 'list',
            data: {
              style: 'ordered',
              items: [
                'First ordered item',
                {
                  content: 'Second ordered item with unordered sublist',
                  items: [
                    { content: 'First unordered subitem' },
                    {
                      content: 'Second unordered subitem with ordered sub-sublist',
                      items: [
                        { content: 'First ordered sub-subitem' },
                        { content: 'Second ordered sub-subitem' }
                      ]
                    },
                    { content: 'Third unordered subitem' }
                  ]
                },
                'Third ordered item'
              ],
            },
          },
        ],
        version: '2.22.2',
      };

      const result = editorJsToMdast(editorData);

      // Verify the main list is ordered
      const mainList = result.children[0] as MdastNode;
      expect(mainList.type).toBe('list');
      expect(mainList.ordered).toBe(true);

      // The first nested list should inherit the parent style (ordered)
      const level1Item2 = mainList.children?.[1] as MdastNode;
      const level2List = level1Item2.children?.[1] as MdastNode;
      expect(level2List.type).toBe('list');
      expect(level2List.ordered).toBe(true); // Inherits 'ordered' from parent

      // The third-level list should also inherit the parent style (ordered)
      const level2Item2 = level2List.children?.[1] as MdastNode;
      const level3List = level2Item2.children?.[1] as MdastNode;
      expect(level3List.type).toBe('list');
      expect(level3List.ordered).toBe(true); // Inherits 'ordered' from parent
    });

    it('should handle multiple consecutive nested lists', () => {
      const editorData: EditorJSData = {
        time: 1625756954764,
        blocks: [
          {
            id: '1',
            type: 'list',
            data: {
              style: 'unordered',
              items: [
                'Simple item',
                {
                  content: 'Item with nested list 1',
                  items: [
                    { content: 'Nested item 1.1' },
                    { content: 'Nested item 1.2' }
                  ]
                },
                {
                  content: 'Item with nested list 2',
                  items: [
                    { content: 'Nested item 2.1' },
                    { content: 'Nested item 2.2' }
                  ]
                },
                'Another simple item'
              ],
            },
          },
        ],
        version: '2.22.2',
      };

      const result = editorJsToMdast(editorData);

      // Verify we have two separate nested lists
      const mainList = result.children[0] as MdastNode;
      expect(mainList.children?.length).toBe(4);

      const item1 = mainList.children?.[1] as MdastNode;
      const nestedList1 = item1.children?.[1] as MdastNode;
      expect(nestedList1.type).toBe('list');
      expect(nestedList1.children?.length).toBe(2);

      const item2 = mainList.children?.[2] as MdastNode;
      const nestedList2 = item2.children?.[1] as MdastNode;
      expect(nestedList2.type).toBe('list');
      expect(nestedList2.children?.length).toBe(2);
    });

    it('should handle empty lists and empty nested lists', () => {
      const editorData: EditorJSData = {
        time: 1625756954764,
        blocks: [
          {
            id: '1',
            type: 'list',
            data: {
              style: 'unordered',
              items: [
                'Item with empty nested list',
                {
                  content: 'Item with empty nested list',
                  items: []
                },
                {
                  content: 'Item with nested list containing empty item',
                  items: [
                    { content: '' }
                  ]
                }
              ],
            },
          },
        ],
        version: '2.22.2',
      };

      const result = editorJsToMdast(editorData);

      // Empty nested lists should still be converted properly
      const mainList = result.children[0] as MdastNode;
      expect(mainList.children?.length).toBe(3);

      // Item with empty nested list - should not have a nested list in the MDAST
      const item2 = mainList.children?.[1] as MdastNode;
      expect(item2.children?.length).toBe(1); // Just the content paragraph

      // Item with nested list containing empty item
      const item3 = mainList.children?.[2] as MdastNode;
      expect(item3.children?.length).toBe(2); // Content paragraph + nested list

      const nestedList = item3.children?.[1] as MdastNode;
      expect(nestedList.children?.length).toBe(1);

      const nestedItem = nestedList.children?.[0] as MdastNode;
      const paragraph = nestedItem.children?.[0] as MdastNode;
      const textNode = paragraph.children?.[0] as MdastNode;
      expect(textNode.value).toBe('');
    });
  });

  describe('MDAST to EditorJS conversion', () => {
    it('should convert deeply nested lists (3+ levels) correctly', () => {
      const mdast: MdastRoot = {
        type: 'root',
        children: [
          {
            type: 'list',
            ordered: false,
            children: [
              // Level 1 - Item 1
              {
                type: 'listItem',
                children: [
                  {
                    type: 'paragraph',
                    children: [{ type: 'text', value: 'Level 1 - Item 1' }]
                  }
                ]
              },
              // Level 1 - Item 2 with nested list
              {
                type: 'listItem',
                children: [
                  {
                    type: 'paragraph',
                    children: [{ type: 'text', value: 'Level 1 - Item 2 with nested list' }]
                  },
                  {
                    type: 'list',
                    ordered: true,
                    children: [
                      // Level 2 - Item 1
                      {
                        type: 'listItem',
                        children: [
                          {
                            type: 'paragraph',
                            children: [{ type: 'text', value: 'Level 2 - Item 1' }]
                          }
                        ]
                      },
                      // Level 2 - Item 2 with deeper nesting
                      {
                        type: 'listItem',
                        children: [
                          {
                            type: 'paragraph',
                            children: [{ type: 'text', value: 'Level 2 - Item 2 with deeper nesting' }]
                          },
                          {
                            type: 'list',
                            ordered: false,
                            children: [
                              // Level 3 - Item 1
                              {
                                type: 'listItem',
                                children: [
                                  {
                                    type: 'paragraph',
                                    children: [{ type: 'text', value: 'Level 3 - Item 1' }]
                                  }
                                ]
                              },
                              // Level 3 - Item 2 with deepest nesting
                              {
                                type: 'listItem',
                                children: [
                                  {
                                    type: 'paragraph',
                                    children: [{ type: 'text', value: 'Level 3 - Item 2 with deepest nesting' }]
                                  },
                                  {
                                    type: 'list',
                                    ordered: true,
                                    children: [
                                      // Level 4 - Item 1
                                      {
                                        type: 'listItem',
                                        children: [
                                          {
                                            type: 'paragraph',
                                            children: [{ type: 'text', value: 'Level 4 - Item 1' }]
                                          }
                                        ]
                                      },
                                      // Level 4 - Item 2
                                      {
                                        type: 'listItem',
                                        children: [
                                          {
                                            type: 'paragraph',
                                            children: [{ type: 'text', value: 'Level 4 - Item 2' }]
                                          }
                                        ]
                                      }
                                    ]
                                  }
                                ]
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              // Level 1 - Item 3
              {
                type: 'listItem',
                children: [
                  {
                    type: 'paragraph',
                    children: [{ type: 'text', value: 'Level 1 - Item 3' }]
                  }
                ]
              }
            ]
          }
        ]
      };

      const result = mdastToEditorJs(mdast);

      // Verify the main list structure
      expect(result.blocks.length).toBe(1);
      expect(result.blocks[0].type).toBe('list');
      expect(result.blocks[0].data.style).toBe('unordered');

      const items = result.blocks[0].data.items;
      expect(items.length).toBe(3);
      expect(items[0]).toBe('Level 1 - Item 1');
      expect(items[2]).toBe('Level 1 - Item 3');

      // Verify first nested list
      const nestedItem = items[1] as any;
      expect(nestedItem.content).toBe('Level 1 - Item 2 with nested list');
      expect(nestedItem.items.length).toBe(2);

      // Verify second level of nesting
      const secondLevelItem = nestedItem.items[1] as any;
      expect(secondLevelItem.content).toBe('Level 2 - Item 2 with deeper nesting');
      expect(secondLevelItem.items.length).toBe(2);

      // Verify third level of nesting
      const thirdLevelItem = secondLevelItem.items[1] as any;
      expect(thirdLevelItem.content).toBe('Level 3 - Item 2 with deepest nesting');
      expect(thirdLevelItem.items.length).toBe(2);
      expect(thirdLevelItem.items[0].content).toBe('Level 4 - Item 1');
      expect(thirdLevelItem.items[1].content).toBe('Level 4 - Item 2');
    });

    it('should handle alternating list types at different nesting levels', () => {
      const mdast: MdastRoot = {
        type: 'root',
        children: [
          {
            type: 'list',
            ordered: true, // First level: ordered
            children: [
              {
                type: 'listItem',
                children: [
                  {
                    type: 'paragraph',
                    children: [{ type: 'text', value: 'First ordered item' }]
                  }
                ]
              },
              {
                type: 'listItem',
                children: [
                  {
                    type: 'paragraph',
                    children: [{ type: 'text', value: 'Second ordered item with unordered sublist' }]
                  },
                  {
                    type: 'list',
                    ordered: false, // Second level: unordered
                    children: [
                      {
                        type: 'listItem',
                        children: [
                          {
                            type: 'paragraph',
                            children: [{ type: 'text', value: 'First unordered subitem' }]
                          }
                        ]
                      },
                      {
                        type: 'listItem',
                        children: [
                          {
                            type: 'paragraph',
                            children: [{ type: 'text', value: 'Second unordered subitem with ordered sub-sublist' }]
                          },
                          {
                            type: 'list',
                            ordered: true, // Third level: ordered
                            children: [
                              {
                                type: 'listItem',
                                children: [
                                  {
                                    type: 'paragraph',
                                    children: [{ type: 'text', value: 'First ordered sub-subitem' }]
                                  }
                                ]
                              },
                              {
                                type: 'listItem',
                                children: [
                                  {
                                    type: 'paragraph',
                                    children: [{ type: 'text', value: 'Second ordered sub-subitem with unordered deepest list' }]
                                  },
                                  {
                                    type: 'list',
                                    ordered: false, // Fourth level: unordered
                                    children: [
                                      {
                                        type: 'listItem',
                                        children: [
                                          {
                                            type: 'paragraph',
                                            children: [{ type: 'text', value: 'First unordered deepest item' }]
                                          }
                                        ]
                                      }
                                    ]
                                  }
                                ]
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      };

      const result = mdastToEditorJs(mdast);

      // Verify the list types at each level
      expect(result.blocks[0].data.style).toBe('ordered');

      const level2Item = result.blocks[0].data.items[1] as any;
      expect(level2Item.content).toBe('Second ordered item with unordered sublist');

      const level3Item = level2Item.items[1] as any;
      expect(level3Item.content).toBe('Second unordered subitem with ordered sub-sublist');

      const level4Item = level3Item.items[1] as any;
      expect(level4Item.content).toBe('Second ordered sub-subitem with unordered deepest list');
      expect(level4Item.items[0].content).toBe('First unordered deepest item');
    });

    it('should handle complex mixed structure with multiple nested lists at same level', () => {
      const mdast: MdastRoot = {
        type: 'root',
        children: [
          {
            type: 'list',
            ordered: false,
            children: [
              // First item with nested ordered list
              {
                type: 'listItem',
                children: [
                  {
                    type: 'paragraph',
                    children: [{ type: 'text', value: 'First item with nested ordered list' }]
                  },
                  {
                    type: 'list',
                    ordered: true,
                    children: [
                      {
                        type: 'listItem',
                        children: [
                          {
                            type: 'paragraph',
                            children: [{ type: 'text', value: 'Nested ordered item 1' }]
                          }
                        ]
                      },
                      {
                        type: 'listItem',
                        children: [
                          {
                            type: 'paragraph',
                            children: [{ type: 'text', value: 'Nested ordered item 2' }]
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              // Second item with nested unordered list
              {
                type: 'listItem',
                children: [
                  {
                    type: 'paragraph',
                    children: [{ type: 'text', value: 'Second item with nested unordered list' }]
                  },
                  {
                    type: 'list',
                    ordered: false,
                    children: [
                      {
                        type: 'listItem',
                        children: [
                          {
                            type: 'paragraph',
                            children: [{ type: 'text', value: 'Nested unordered item 1' }]
                          }
                        ]
                      },
                      {
                        type: 'listItem',
                        children: [
                          {
                            type: 'paragraph',
                            children: [{ type: 'text', value: 'Nested unordered item 2' }]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      };

      const result = mdastToEditorJs(mdast);

      expect(result.blocks[0].data.style).toBe('unordered');
      expect(result.blocks[0].data.items.length).toBe(2);

      // Verify both nested lists were processed correctly
      const item1 = result.blocks[0].data.items[0] as any;
      expect(item1.content).toBe('First item with nested ordered list');
      expect(item1.items.length).toBe(2);
      expect(item1.items[0].content).toBe('Nested ordered item 1');

      const item2 = result.blocks[0].data.items[1] as any;
      expect(item2.content).toBe('Second item with nested unordered list');
      expect(item2.items.length).toBe(2);
      expect(item2.items[0].content).toBe('Nested unordered item 1');
    });

    it('should handle round-trip conversion of complex nested lists', () => {
      // Create a complex structure with mixed list types and deep nesting
      const editorData: EditorJSData = {
        time: 1625756954764,
        blocks: [
          {
            id: '1',
            type: 'list',
            data: {
              style: 'ordered',
              items: [
                'Top level ordered item 1',
                {
                  content: 'Top level ordered item 2 with unordered sublist',
                  items: [
                    { content: 'Unordered subitem 1' },
                    {
                      content: 'Unordered subitem 2 with ordered sub-sublist',
                      items: [
                        { content: 'Ordered sub-subitem 1' },
                        {
                          content: 'Ordered sub-subitem 2 with unordered sub-sub-sublist',
                          items: [
                            { content: 'Unordered deepest item 1' },
                            { content: 'Unordered deepest item 2' }
                          ]
                        }
                      ]
                    },
                    { content: 'Unordered subitem 3' }
                  ]
                },
                'Top level ordered item 3'
              ],
            },
          },
        ],
        version: '2.22.2',
      };

      // Convert from EditorJS to MDAST
      const mdast = editorJsToMdast(editorData);

      // Convert back from MDAST to EditorJS
      const resultEditorJs = mdastToEditorJs(mdast);

      // Check if the round-trip conversion maintains the structure
      expect(resultEditorJs.blocks.length).toBe(1);
      expect(resultEditorJs.blocks[0].type).toBe('list');
      expect(resultEditorJs.blocks[0].data.style).toBe('ordered');

      const items = resultEditorJs.blocks[0].data.items;
      expect(items.length).toBe(3);
      expect(items[0]).toBe('Top level ordered item 1');
      expect(items[2]).toBe('Top level ordered item 3');

      // Verify the nested structure was preserved
      const nestedItem = items[1] as any;
      expect(nestedItem.content).toBe('Top level ordered item 2 with unordered sublist');
      expect(nestedItem.items.length).toBe(3);

      const deepNestedItem = nestedItem.items[1] as any;
      expect(deepNestedItem.content).toBe('Unordered subitem 2 with ordered sub-sublist');
      expect(deepNestedItem.items.length).toBe(2);

      const deepestNestedItem = deepNestedItem.items[1] as any;
      expect(deepestNestedItem.content).toBe('Ordered sub-subitem 2 with unordered sub-sub-sublist');
      expect(deepestNestedItem.items.length).toBe(2);
      expect(deepestNestedItem.items[0].content).toBe('Unordered deepest item 1');
      expect(deepestNestedItem.items[1].content).toBe('Unordered deepest item 2');
    });
  });
});