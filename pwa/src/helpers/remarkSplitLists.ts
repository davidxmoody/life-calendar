import {visit, SKIP} from "unist-util-visit"
import type {Plugin} from "unified"
import type {Root, List, ListItem} from "mdast"

/**
 * remark plugin: splits a single loose list into multiple tight lists
 * wherever a blank line appears between items.
 *
 * e.g.
 *   * one        →  <ul><li>one</li><li>two</li></ul>
 *   * two
 *                   <ul><li>three</li><li>four</li></ul>
 *   * three
 *   * four
 */
const remarkSplitLists: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, "list", (node, index, parent) => {
      if (!parent || index == null) return

      // Group items by blank-line boundaries
      const groups: ListItem[][] = []
      let current: ListItem[] = []

      for (let i = 0; i < node.children.length; i++) {
        const item = node.children[i]
        const next = node.children[i + 1] as ListItem | undefined
        current.push(item)

        const hasBlankLineBefore =
          next &&
          item.position &&
          next.position &&
          next.position.start.line - item.position.end.line > 1

        if (!next || hasBlankLineBefore) {
          groups.push([...current])
          current = []
        }
      }

      // Nothing to split
      if (groups.length <= 1) return

      // Build a new list node for each group
      const newLists: List[] = groups.map((items) => ({
        ...node,
        spread: false,
        children: items.map((item) => ({...item, spread: false})),
        position: {
          start: items[0].position!.start,
          end: items[items.length - 1].position!.end,
        },
      }))

      // Replace the original list node with the split lists
      parent.children.splice(index, 1, ...(newLists as typeof parent.children))

      // Tell unist-util-visit to skip re-visiting these new nodes
      // and continue from after the inserted nodes
      return [SKIP, index + newLists.length]
    })
  }
}

export default remarkSplitLists
