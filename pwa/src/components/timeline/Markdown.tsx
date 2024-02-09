import {memo} from "react"
import ReactMarkdown, {Components} from "react-markdown"
import {
  Box,
  Heading,
  Link,
  ListItem,
  OrderedList,
  Text,
  UnorderedList,
} from "@chakra-ui/react"
import HighlightedText from "./HighlightedText"

const paraMarginBottom = 5
const codeBackgroudColor = "gray.600"

function MarkdownHeading(props: {
  node?: {tagName: string}
  children?: React.ReactNode
}) {
  const size = {h1: "xl", h2: "xl", h3: "lg"}[props.node?.tagName ?? ""] ?? "md"

  return (
    <Heading size={size} mb={4}>
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

function MarkdownImage(props: {src?: string; alt?: string}) {
  return <img style={{maxWidth: "100%"}} src={props.src} alt={props.alt} />
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

function MarkdownUnorderedList(props: {children?: React.ReactNode}) {
  return <UnorderedList mb={paraMarginBottom}>{props.children}</UnorderedList>
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

const components: Components = {
  a: MarkdownLink,
  blockquote: MarkdownBlockquote,
  code: MarkdownCode,
  em: MarkdownEmphasis,
  h1: MarkdownHeading,
  h2: MarkdownHeading,
  h3: MarkdownHeading,
  h4: MarkdownHeading,
  h5: MarkdownHeading,
  h6: MarkdownHeading,
  hr: HorizontalRule,
  img: MarkdownImage,
  li: MarkdownListItem,
  ol: MarkdownOrderedList,
  p: MarkdownParagraph,
  pre: MarkdownPre,
  strong: MarkdownStrong,
  ul: MarkdownUnorderedList,
}

export default memo(function Markdown(props: {source: string}) {
  return <ReactMarkdown components={components}>{props.source}</ReactMarkdown>
})
