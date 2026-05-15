import {visit} from "unist-util-visit"
import type {Plugin} from "unified"
import type {Root} from "mdast"

const remarkHeadingIds: Plugin<[], Root> = () => (tree) => {
  let index = 0
  visit(tree, "heading", (node) => {
    const data = (node.data ?? (node.data = {})) as {
      hProperties?: Record<string, unknown>
    }
    const hProperties = data.hProperties ?? (data.hProperties = {})
    hProperties.id = `heading-${index++}`
  })
}

export default remarkHeadingIds
