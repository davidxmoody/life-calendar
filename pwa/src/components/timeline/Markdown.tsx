import {memo} from "react"
import ReactMarkdown, {Components} from "react-markdown"
import remarkGfm from "remark-gfm"
import {
  Box,
  Checkbox,
  Heading,
  Link,
  ListItem,
  OrderedList,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  UnorderedList,
} from "@chakra-ui/react"
import HighlightedText from "./HighlightedText"
import {createAuthedUrl} from "../../helpers/auth"

const paraMarginBottom = 5
const codeBackgroudColor = "gray.600"

function MarkdownHeading(props: {
  node?: {tagName: string}
  children?: React.ReactNode
}) {
  const size = {h1: "xl", h2: "xl", h3: "lg"}[props.node?.tagName ?? ""] ?? "md"

  return (
    <Heading size={size} mb={4} sx={{textWrap: "pretty"}}>
      <HighlightedText addDateLinks>{props.children}</HighlightedText>
    </Heading>
  )
}

function MarkdownLink(props: {href?: string; children?: React.ReactNode}) {
  return (
    <Link href={props.href} isExternal rel="noreferrer" color="teal.500">
      {props.children}
    </Link>
  )
}

function MarkdownParagraph(props: {children?: React.ReactNode}) {
  return (
    <Text mb={paraMarginBottom}>
      <HighlightedText addDateLinks>{props.children}</HighlightedText>
    </Text>
  )
}

function MarkdownBlockquote(props: {children?: React.ReactNode}) {
  return (
    <Box
      pl={4}
      fontStyle="italic"
      borderColor={codeBackgroudColor}
      borderLeftWidth="8px"
      opacity={0.75}
    >
      {props.children}
    </Box>
  )
}

function MarkdownImage(props: {src?: string; alt?: string; title?: string}) {
  const src = props.src?.startsWith("/images/")
    ? createAuthedUrl(props.src)
    : props.src
  return (
    <img
      style={{maxWidth: "100%"}}
      src={src}
      alt={props.alt}
      title={props.title}
    />
  )
}

function MarkdownOrderedList(props: {children?: React.ReactNode}) {
  return (
    <OrderedList
      mb={paraMarginBottom}
      listStylePosition="inside"
      marginInlineStart={0}
    >
      {props.children}
    </OrderedList>
  )
}

function MarkdownUnorderedList(props: {
  className?: string
  children?: React.ReactNode
}) {
  const isTaskList = props.className?.includes("contains-task-list")
  return (
    <UnorderedList
      mb={paraMarginBottom}
      styleType={isTaskList ? "none" : undefined}
      marginInlineStart={isTaskList ? 0 : undefined}
    >
      {props.children}
    </UnorderedList>
  )
}

function MarkdownListItem(props: {children?: React.ReactNode}) {
  return (
    <HighlightedText addDateLinks as={ListItem}>
      {props.children}
    </HighlightedText>
  )
}

function MarkdownPre(props: {children?: React.ReactNode}) {
  return (
    <Box
      mb={paraMarginBottom}
      backgroundColor={codeBackgroudColor}
      borderRadius={3}
      py={2}
      px={3}
    >
      {props.children}
    </Box>
  )
}

function MarkdownCode(props: {inline?: boolean; children?: React.ReactNode}) {
  return (
    <Box as="code" backgroundColor={codeBackgroudColor} borderRadius="sm">
      <HighlightedText addDateLinks>{props.children}</HighlightedText>
    </Box>
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
  return (
    <Text as="del" opacity={0.6}>
      {props.children}
    </Text>
  )
}

function MarkdownCheckbox(props: {checked?: boolean}) {
  return (
    <Checkbox
      isChecked={props.checked}
      isReadOnly
      mr={2}
      verticalAlign="middle"
    />
  )
}

function HorizontalRule() {
  return (
    <Box
      borderBottomWidth="thin"
      borderColor="gray.600"
      mb={paraMarginBottom}
      borderStyle="dashed"
    />
  )
}

function MarkdownTable(props: {children?: React.ReactNode}) {
  return (
    <Box overflowX="auto" mb={paraMarginBottom}>
      <Table size="sm">{props.children}</Table>
    </Box>
  )
}

function MarkdownThead(props: {children?: React.ReactNode}) {
  return <Thead>{props.children}</Thead>
}

function MarkdownTbody(props: {children?: React.ReactNode}) {
  return <Tbody>{props.children}</Tbody>
}

function MarkdownTr(props: {children?: React.ReactNode}) {
  return <Tr>{props.children}</Tr>
}

function MarkdownTh(props: {children?: React.ReactNode}) {
  return <Th>{props.children}</Th>
}

function MarkdownTd(props: {children?: React.ReactNode}) {
  return <Td>{props.children}</Td>
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
