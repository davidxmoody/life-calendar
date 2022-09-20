export default function getMarkdownWordcount(content: string) {
  return content.trim().split(/\s+/).length
}
