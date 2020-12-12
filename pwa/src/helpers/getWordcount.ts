export default function getWordcount(text: string): number {
  return text.trim().split(/\s+/).length
}
