import {useAtomValue} from "jotai"
import {Children, Fragment} from "react"
import {searchRegexAtom} from "../../atoms"

interface Props {
  as?: React.ElementType<{children: React.ReactNode}>
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

        if (!searchRegex) {
          return child
        }

        return surroundMatches(child, searchRegex)
      })}
    </Container>
  )
}

function surroundMatches(text: string, regex: RegExp): React.ReactNode {
  const matches = text.match(regex)
  const parts = text.split(regex)

  return parts.flatMap((part, index) => {
    if (index === 0) {
      return [part]
    }

    return [
      <HighlightMatch key={index}>{matches?.[index - 1] ?? ""}</HighlightMatch>,
      part,
    ]
  })
}

function HighlightMatch(props: {children: React.ReactNode}) {
  return (
    <span className="rounded-xs bg-ctp-peach/30 text-ctp-peach selection:bg-ctp-peach/50">
      {props.children}
    </span>
  )
}
