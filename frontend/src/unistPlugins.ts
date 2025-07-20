import { visit } from 'unist-util-visit';
import { Root } from 'mdast';

export const indexParagraphs = () => {
    return (tree: any) => {
        let index = 0

        visit(tree, (node) => {
            if(node.type === "element" && node.tagName === "p") {
                node.properties.index = index++
            }
        });
    }
}
