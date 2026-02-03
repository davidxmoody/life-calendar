import {memo} from "react"
import ReactMarkdown, {Components} from "react-markdown"
import remarkGfm from "remark-gfm"
import HighlightedText from "./HighlightedText"
import {createAuthedUrl} from "../../helpers/auth"
import {Checkbox} from "../ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"

function MarkdownHeading(props: {
  node?: {tagName: string}
  children?: React.ReactNode
}) {
  const sizeClass =
    {h1: "text-2xl", h2: "text-2xl", h3: "text-xl"}[
      props.node?.tagName ?? ""
    ] ?? "text-lg"

  return (
    <h3 className={`${sizeClass} font-bold mb-4 text-pretty`}>
      <HighlightedText addDateLinks>{props.children}</HighlightedText>
    </h3>
  )
}

function MarkdownLink(props: {href?: string; children?: React.ReactNode}) {
  return (
    <a
      href={props.href}
      target="_blank"
      rel="noreferrer"
      className="text-teal-500 hover:underline"
    >
      {props.children}
    </a>
  )
}

function MarkdownParagraph(props: {children?: React.ReactNode}) {
  return (
    <p className="mb-5">
      <HighlightedText addDateLinks>{props.children}</HighlightedText>
    </p>
  )
}

function MarkdownBlockquote(props: {children?: React.ReactNode}) {
  return (
    <blockquote className="pl-4 italic border-l-8 border-gray-600 opacity-75">
      {props.children}
    </blockquote>
  )
}

function MarkdownImage(props: {src?: string; alt?: string; title?: string}) {
  const src = props.src?.startsWith("/images/")
    ? createAuthedUrl(props.src)
    : props.src
  return (
    <img className="max-w-full" src={src} alt={props.alt} title={props.title} />
  )
}

function MarkdownOrderedList(props: {children?: React.ReactNode}) {
  return (
    <ol className="mb-5 list-decimal list-inside ms-0">{props.children}</ol>
  )
}

function MarkdownUnorderedList(props: {
  className?: string
  children?: React.ReactNode
}) {
  const isTaskList = props.className?.includes("contains-task-list")
  return (
    <ul
      className={`mb-5 ${
        isTaskList ? "list-none ms-0" : "list-disc list-inside"
      }`}
    >
      {props.children}
    </ul>
  )
}

function MarkdownListItem(props: {children?: React.ReactNode}) {
  return (
    <HighlightedText addDateLinks as="li">
      {props.children}
    </HighlightedText>
  )
}

function MarkdownPre(props: {children?: React.ReactNode}) {
  return (
    <pre className="mb-5 bg-gray-600 rounded-sm py-2 px-3">
      {props.children}
    </pre>
  )
}

function MarkdownCode(props: {inline?: boolean; children?: React.ReactNode}) {
  return (
    <code className="bg-gray-600 rounded-sm">
      <HighlightedText addDateLinks>{props.children}</HighlightedText>
    </code>
  )
}

function MarkdownEmphasis(props: {children?: React.ReactNode}) {
  return (
    <HighlightedText addDateLinks as="em">
      {props.children}
    </HighlightedText>
  )
}

function MarkdownStrong(props: {children?: React.ReactNode}) {
  return (
    <HighlightedText addDateLinks as="strong">
      {props.children}
    </HighlightedText>
  )
}

function MarkdownStrikethrough(props: {children?: React.ReactNode}) {
  return <del className="opacity-60">{props.children}</del>
}

function MarkdownCheckbox(props: {checked?: boolean}) {
  return (
    <Checkbox checked={props.checked} disabled className="mr-2 align-middle" />
  )
}

function HorizontalRule() {
  return <hr className="border-b border-gray-600 mb-5 border-dashed" />
}

function MarkdownTable(props: {children?: React.ReactNode}) {
  return (
    <div className="overflow-x-auto mb-5">
      <Table>{props.children}</Table>
    </div>
  )
}

function MarkdownThead(props: {children?: React.ReactNode}) {
  return <TableHeader>{props.children}</TableHeader>
}

function MarkdownTbody(props: {children?: React.ReactNode}) {
  return <TableBody>{props.children}</TableBody>
}

function MarkdownTr(props: {children?: React.ReactNode}) {
  return <TableRow>{props.children}</TableRow>
}

function MarkdownTh(props: {children?: React.ReactNode}) {
  return <TableHead>{props.children}</TableHead>
}

function MarkdownTd(props: {children?: React.ReactNode}) {
  return <TableCell>{props.children}</TableCell>
}

const components: Components = {
  a: MarkdownLink,
  blockquote: MarkdownBlockquote,
  code: MarkdownCode,
  del: MarkdownStrikethrough,
  em: MarkdownEmphasis,
  h1: MarkdownHeading,
  h2: MarkdownHeading,
  h3: MarkdownHeading,
  h4: MarkdownHeading,
  h5: MarkdownHeading,
  h6: MarkdownHeading,
  hr: HorizontalRule,
  img: MarkdownImage,
  input: MarkdownCheckbox,
  li: MarkdownListItem,
  ol: MarkdownOrderedList,
  p: MarkdownParagraph,
  pre: MarkdownPre,
  strong: MarkdownStrong,
  table: MarkdownTable,
  tbody: MarkdownTbody,
  td: MarkdownTd,
  th: MarkdownTh,
  thead: MarkdownThead,
  tr: MarkdownTr,
  ul: MarkdownUnorderedList,
}

export default memo(function Markdown(props: {source: string}) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {props.source}
    </ReactMarkdown>
  )
})
