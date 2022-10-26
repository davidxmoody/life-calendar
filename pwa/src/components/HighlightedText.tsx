import * as React from "react"
import {Box} from "@chakra-ui/react"

interface Props {
  searchRegex: string
  text: string
}

export default function HighlightedText(props: Props) {
  if (!props.searchRegex) {
    return <>{props.text}</>
  }

  const regex = new RegExp(props.searchRegex, "gi")
  const matches = props.text.match(regex)
  const parts = props.text.split(regex)

  const results = parts.flatMap((part, index) => {
    if (index === 0) {
      return [part]
    }

    return [
      <Box as="span" bg="orange.500" borderRadius="sm">
        {matches?.[index - 1]}
      </Box>,
      part,
    ]
  })

  return <>{results}</>
}
