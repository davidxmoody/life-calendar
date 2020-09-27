import * as React from "react"
import {memo} from "react"
import ReactMarkdown from "react-markdown"
import {Link} from "wouter"
import {getWeekStart} from "../helpers/dates"
import "./Markdown.css"

interface Props {
  source: string
}

export default memo(function Markdown(props: Props) {
  return (
    <div className="markdown-wrapper">
      <ReactMarkdown renderers={{link: CustomLink}}>
        {addDateLinks(props.source)}
      </ReactMarkdown>
    </div>
  )
})

function CustomLink(props: {href: string; children: React.ReactNode}) {
  if (props.href.startsWith("/")) {
    return <Link href={props.href}>{props.children}</Link>
  }

  return (
    <a href={props.href} target="_blank" rel="noopener noreferrer">
      {props.children}
    </a>
  )
}

function addDateLinks(source: string): string {
  return source.replaceAll(
    /\b\d{4}-\d{2}-\d{2}\b/g,
    (match) => `[${match}](/weeks/${getWeekStart(match)})`,
  )
}
