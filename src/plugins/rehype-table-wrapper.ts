type Node = {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: Node[];
};

/** Wrap content tables so horizontal overflow stays within the article. */
export function rehypeTableWrapper() {
  return (tree: Node) => {
    function visit(node: Node) {
      if (!Array.isArray(node.children)) return;

      for (let index = 0; index < node.children.length; index += 1) {
        const child = node.children[index];

        if (child.type === 'element' && child.tagName === 'table') {
          node.children[index] = {
            type: 'element',
            tagName: 'div',
            properties: { className: ['table-scroll'] },
            children: [child],
          };
          continue;
        }

        visit(child);
      }
    }

    visit(tree);
  };
}
