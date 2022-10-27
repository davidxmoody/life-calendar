import * as React from "react"
import {Box} from "@chakra-ui/react"

interface Props {
  searchRegex: string
  children: string
}

export default function HighlightedText(props: Props) {
  if (!props.searchRegex) {
    return <>{props.children}</>
  }

  const regex = new RegExp(props.searchRegex, "gi")
  const matches = props.children.match(regex)
  const parts = props.children.split(regex)

  const results = parts.flatMap((part, index) => {
    if (index === 0) {
      return [part]
    }

    return [<Highlight>{matches?.[index - 1]}</Highlight>, part]
  })

  return <>{results}</>
}

export function Highlight(props: {children: React.ReactNode}) {
  return (
    <Box as="span" bg="orange.500" borderRadius="sm">
      {props.children}
    </Box>
  )
}
