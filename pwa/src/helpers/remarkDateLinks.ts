import {visit} from "unist-util-visit"
import type {Plugin} from "unified"
import type {Root, Link, PhrasingContent} from "mdast"

const DATE_REGEX = /\b(\d{4}-\d{2}-\d{2})\b/g

const remarkDateLinks: Plugin<[], Root> = () => (tree) => {
  visit(tree, "text", (node, index, parent) => {
    if (parent == null || typeof index !== "number") return
    if (parent.type === "link" || parent.type === "linkReference") return

    const matches = [...node.value.matchAll(DATE_REGEX)]
    if (matches.length === 0) return

    const children: PhrasingContent[] = []
    let lastIndex = 0

    for (const match of matches) {
      const matchStart = match.index!
      const matchText = match[0]

      if (matchStart > lastIndex) {
        children.push({
          type: "text",
          value: node.value.slice(lastIndex, matchStart),
        })
      }

      children.push({
        type: "link",
        url: matchText,
        children: [{type: "text", value: matchText}],
      } satisfies Link)

      lastIndex = matchStart + matchText.length
    }

    if (lastIndex < node.value.length) {
      children.push({type: "text", value: node.value.slice(lastIndex)})
    }

    parent.children.splice(index, 1, ...children)
  })
}

export default remarkDateLinks
