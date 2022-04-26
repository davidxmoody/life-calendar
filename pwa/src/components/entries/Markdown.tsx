import React, {memo} from "react"
import ReactMarkdown, {Components} from "react-markdown"
import {Link as WouterLink} from "wouter"
import {getWeekStart} from "../../helpers/dates"
import {
  Box,
  Heading,
  Link,
  OrderedList,
  Text,
  UnorderedList,
} from "@chakra-ui/react"

interface Props {
  source: string
}

const paraMarginBottom = 5
const codeBackgroudColor = "rgba(120, 120, 120, 0.5)"

function heading(size: React.ComponentProps<typeof Heading>["size"]) {
  return (props: {children: any}) => (
    <Heading size={size} mb={4}>
      {props.children}
    </Heading>
  )
}

const components: Components = {
  a: (props) =>
    props.href?.startsWith("/") ? (
      <Link as={WouterLink} href={props.href} color="teal.500">
        {props.children}
      </Link>
    ) : (
      <Link href={props.href} isExternal rel="noreferrer" color="teal.500">
        {props.children}
      </Link>
    ),
  p: (props) => <Text mb={paraMarginBottom} {...props} />,
  h1: heading("xl"),
  h2: heading("xl"),
  h3: heading("lg"),
  h4: heading("md"),
  h5: heading("md"),
  h6: heading("md"),
  blockquote: (props) => (
    <Box
      pl={4}
      fontStyle="italic"
      borderColor={codeBackgroudColor}
      borderLeftWidth="8px"
      opacity={0.75}
    >
      {props.children}
    </Box>
  ),
  img: (props) => (
    <img style={{maxWidth: "100%"}} src={props.src} alt={props.alt} />
  ),
  ol: (props) => (
    <OrderedList mb={paraMarginBottom}>{props.children}</OrderedList>
  ),
  ul: (props) => (
    <UnorderedList mb={paraMarginBottom}>{props.children}</UnorderedList>
  ),
  code: (props) =>
    props.inline ? (
      <Box
        as="code"
        backgroundColor={codeBackgroudColor}
        borderRadius="sm"
        px={1}
      >
        {props.children}
      </Box>
    ) : (
      <Box
        display="block"
        as="code"
        mb={paraMarginBottom}
        backgroundColor={codeBackgroudColor}
        py={2}
        px={3}
        borderRadius={3}
      >
        {props.children}
      </Box>
    ),
}

function addDateLinks(source: string): string {
  return source.replace(
    /\b\d{4}-\d{2}-\d{2}\b/g,
    (match) => `[${match}](/weeks/${getWeekStart(match)})`,
  )
}

export default memo(function Markdown(props: Props) {
  return (
    <ReactMarkdown components={components}>
      {addDateLinks(props.source)}
    </ReactMarkdown>
  )
})
