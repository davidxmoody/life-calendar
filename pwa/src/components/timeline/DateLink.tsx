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
    <button
      className="!text-ctp-sapphire hover:underline cursor-pointer"
      onClick={() => startTransition(() => setSelectedDay(date))}
    >
      {date}
    </button>
  )
}
