import React, {ElementType, memo, ReactNode} from "react"
import ReactMarkdown from "react-markdown"
import {Link as WouterLink} from "wouter"
import {getWeekStart} from "../../helpers/dates"
import {Box, Heading, Link, Text} from "@chakra-ui/react"

interface Props {
  source: string
}

const paraMarginBottom = 5
const codeBackgroudColor = "rgba(120, 120, 120, 0.5)"

const renderers: Record<string, ElementType> = {
  link: (props: {href: string; children: ReactNode}) => {
    if (props.href.startsWith("/")) {
      return (
        <Link as={WouterLink} href={props.href} color="teal.500">
          {props.children}
        </Link>
      )
    }
    return (
      <Link href={props.href} isExternal color="teal.500">
        {props.children}
      </Link>
    )
  },
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
      borderColor={codeBackgroudColor}
      borderLeftWidth="8px"
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
      backgroundColor={codeBackgroudColor}
      py={2}
      px={3}
      borderRadius={3}
    >
      {props.value}
    </Box>
  ),
  inlineCode: (props: {children: any}) => (
    <Box
      as="code"
      backgroundColor={codeBackgroudColor}
      borderRadius="sm"
      px={1}
    >
      {props.children}
    </Box>
  ),
}

function addDateLinks(source: string): string {
  return source.replaceAll(
    /\b\d{4}-\d{2}-\d{2}\b/g,
    (match) => `[${match}](/weeks/${getWeekStart(match)})`,
  )
}

export default memo(function Markdown(props: Props) {
  return (
    <ReactMarkdown renderers={renderers}>
      {addDateLinks(props.source)}
    </ReactMarkdown>
  )
})
