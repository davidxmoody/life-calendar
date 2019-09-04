import * as React from "react"
import {memo} from "react"
import ReactMarkdown from "react-markdown"
import "./Markdown.css"

interface Props {
  source: string
}

export default memo(function Markdown(props: Props) {
  return (
    <div className="markdown-wrapper">
      <ReactMarkdown>{props.source}</ReactMarkdown>
    </div>
  )
})
