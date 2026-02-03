import {useAtomValue} from "jotai"
import {Children, Fragment} from "react"
import {searchRegexAtom} from "../../atoms"
import DateLink from "./DateLink"

const DATE_REGEX = /\b\d{4}-\d{2}-\d{2}\b/g

interface Props {
  as?: React.ElementType<{children: React.ReactNode}>
  addDateLinks?: boolean
  children: React.ReactNode
}

export default function HighlightedText(props: Props) {
  const searchRegexString = useAtomValue(searchRegexAtom)
  const searchRegex = searchRegexString
    ? new RegExp(searchRegexString, "gi")
    : null

  const Container = props.as ?? Fragment

  return (
    <Container>
      {Children.map(props.children, (child) => {
        if (typeof child !== "string") {
          return child
        }

        return surroundMatches(child, [
          ...(searchRegex
            ? [{regex: searchRegex, MatchComponent: HighlightMatch}]
            : []),
          ...(props.addDateLinks
            ? [{regex: DATE_REGEX, MatchComponent: DateLink}]
            : []),
        ])
      })}
    </Container>
  )
}

function surroundMatches(
  text: string,
  replacements: Array<{
    regex: RegExp
    MatchComponent: React.ComponentType<{children: string}>
  }>,
): React.ReactNode {
  if (replacements.length === 0) {
    return text
  }

  const [{regex, MatchComponent}, ...rest] = replacements

  const matches = text.match(regex)
  const parts = text.split(regex)

  return parts.flatMap((part, index) => {
    if (index === 0) {
      return [surroundMatches(part, rest)]
    }

    return [
      <MatchComponent key={index}>{matches?.[index - 1] ?? ""}</MatchComponent>,
      surroundMatches(part, rest),
    ]
  })
}

function HighlightMatch(props: {children: React.ReactNode}) {
  return (
    <span className="rounded-xs bg-orange-600 selection:bg-orange-400">
      {props.children}
    </span>
  )
}
