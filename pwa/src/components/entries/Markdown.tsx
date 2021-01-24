import React, {ElementType, memo, ReactNode} from "react"
import ReactMarkdown from "react-markdown"
import {Link} from "wouter"
import {getWeekStart} from "../../helpers/dates"
import {Box, Heading, Text} from "@chakra-ui/react"

interface Props {
  source: string
}

const paraMarginBottom = 5

const renderers: Record<string, ElementType> = {
  link: CustomLink,
  paragraph: (props: any) => <Text mb={paraMarginBottom} {...props} />,
  heading: (props: {level: number; children: any}) => (
    <Heading
      size={props.level <= 2 ? "xl" : props.level === 3 ? "lg" : "md"}
      mb={4}
    >
      {props.children}
    </Heading>
  ),
  blockquote: (props: any) => (
    <Text
      pl={4}
      fontStyle="italic"
      borderLeft="8px solid #eee"
      opacity={0.7}
      {...props}
    />
  ),
  image: (props: any) => (
    <img style={{maxWidth: "100%"}} src={props.src} alt={props.alt} />
  ),
  list: (props: any) => (
    <Box mb={paraMarginBottom} pl={5}>
      {React.createElement(ReactMarkdown.renderers.list as any, props)}
    </Box>
  ),
  code: (props: {value: any}) => (
    <Box
      display="block"
      as="code"
      mb={paraMarginBottom}
      backgroundColor="#eee"
      py={2}
      px={3}
      borderRadius={3}
    >
      {props.value}
    </Box>
  ),
  inlineCode: (props: {children: any}) => (
    <Box as="code" backgroundColor="#eee">
      {props.children}
    </Box>
  ),
}

export default memo(function Markdown(props: Props) {
  return (
    <ReactMarkdown renderers={renderers}>
      {addDateLinks(props.source)}
    </ReactMarkdown>
  )
})

function CustomLink(props: {href: string; children: ReactNode}) {
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
