import {Link} from "@chakra-ui/react"
import {useSetAtom} from "jotai"
import {startTransition} from "react"
import {selectedDayAtom} from "../../atoms"

interface Props {
  children: string
}

export default function DateLink(props: Props) {
  const date = props.children
  const setSelectedDay = useSetAtom(selectedDayAtom)

  return (
    <Link
      color="teal.500"
      onClick={() => startTransition(() => setSelectedDay(date))}
    >
      {date}
    </Link>
  )
}
