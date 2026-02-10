import {visit} from "unist-util-visit"
import type {Plugin} from "unified"
import type {Root} from "mdast"
import {createAuthedUrl} from "./auth"

const VIDEO_EXTENSIONS = /\.(mp4|webm|mov|avi|mkv)$/i
const AUDIO_EXTENSIONS = /\.(mp3|m4a|wav|ogg)$/i

export default function remarkMedia(date: string): Plugin<[], Root> {
  return () => (tree) => {
    visit(tree, "image", (node, index, parent) => {
      const src = node.url
      const isRemote = src.startsWith("http") || src.startsWith("//")

      let resolvedSrc = src

      // Prefix relative paths with /files/YYYY/MM/DD/
      if (!src.startsWith("/") && !isRemote) {
        const [year, month, day] = date.split("-")
        resolvedSrc = `/files/${year}/${month}/${day}/${src}`
      }

      // Add auth token for local paths
      if (!isRemote) {
        resolvedSrc = createAuthedUrl(resolvedSrc)
      }

      // Replace image nodes for video files with a custom video node
      if (VIDEO_EXTENSIONS.test(src)) {
        if (parent && typeof index === "number") {
          parent.children[index] = {
            type: "video" as any,
            data: {
              hName: "video",
              hProperties: {src: resolvedSrc},
            },
          }
        }
        return
      }

      // Replace image nodes for audio files with a custom audio node
      if (AUDIO_EXTENSIONS.test(src)) {
        if (parent && typeof index === "number") {
          parent.children[index] = {
            type: "audio" as any,
            data: {
              hName: "audio",
              hProperties: {src: resolvedSrc},
            },
          }
        }
        return
      }

      // For regular images, just update the URL in place
      node.url = resolvedSrc
    })
  }
}
