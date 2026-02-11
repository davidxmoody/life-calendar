import {memo, createContext, useContext, useRef} from "react"
import ReactMarkdown, {Components} from "react-markdown"
import remarkGfm from "remark-gfm"
import HighlightedText from "./HighlightedText"
import {Checkbox} from "../ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"
import remarkSplitLists from "../../helpers/remarkSplitLists"
import remarkMedia from "../../helpers/remarkMedia"

const HeadingCounterContext = createContext<React.RefObject<number> | null>(
  null,
)

function MarkdownHeading(props: {
  node?: {tagName: string}
  children?: React.ReactNode
}) {
  const counterRef = useContext(HeadingCounterContext)
  const index = counterRef ? counterRef.current++ : 0

  const sizeClass =
    {h1: "text-4xl", h2: "text-4xl", h3: "text-2xl"}[
      props.node?.tagName ?? ""
    ] ?? "text-xl"

  return (
    <h3
      id={`heading-${index}`}
      className={`${sizeClass} font-bold mb-4 text-pretty scroll-mt-16`}
    >
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
  return (
    <img
      className="max-w-full"
      src={props.src}
      alt={props.alt}
      title={props.title}
    />
  )
}

function MarkdownVideo(props: {src?: string}) {
  return <video className="max-w-full" src={props.src} controls={true} />
}

function MarkdownAudio(props: {src?: string}) {
  return <audio className="max-w-full" src={props.src} controls={true} />
}

function MarkdownOrderedList(props: {
  "data-nested"?: boolean
  children?: React.ReactNode
}) {
  return (
    <ol
      className={`${props["data-nested"] ? "" : "mb-5 "}list-decimal list-outside ms-5`}
    >
      {props.children}
    </ol>
  )
}

function MarkdownUnorderedList(props: {
  className?: string
  "data-nested"?: boolean
  children?: React.ReactNode
}) {
  const isTaskList = props.className?.includes("contains-task-list")
  return (
    <ul
      className={`${props["data-nested"] ? "" : "mb-5 "}${
        isTaskList ? "list-none ms-0" : "list-disc list-outside ms-5"
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
  audio: MarkdownAudio,
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
  video: MarkdownVideo,
}

export default memo(function Markdown(props: {source: string; date: string}) {
  const counterRef = useRef(0)
  counterRef.current = 0

  return (
    <HeadingCounterContext.Provider value={counterRef}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkSplitLists, remarkMedia(props.date)]}
        components={components}
      >
        {props.source}
      </ReactMarkdown>
    </HeadingCounterContext.Provider>
  )
})
