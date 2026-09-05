import {visit, SKIP} from "unist-util-visit"
import type {Plugin} from "unified"
import type {Root} from "mdast"

// Ids must line up index-for-index with getHeadings, which the timeline uses to
// scroll the content pane to a clicked heading. Keep the two in sync.
const remarkHeadingIds: Plugin<[], Root> = () => (tree) => {
  let index = 0
  visit(tree, (node) => {
    // Don't descend into blockquotes, so their headings get no ids
    if (node.type === "blockquote") return SKIP
    if (node.type !== "heading") return
    if (node.depth > 2) return
    const data = (node.data ?? (node.data = {})) as {
      hProperties?: Record<string, unknown>
    }
    const hProperties = data.hProperties ?? (data.hProperties = {})
    hProperties.id = `heading-${index++}`
  })
}

export default remarkHeadingIds
