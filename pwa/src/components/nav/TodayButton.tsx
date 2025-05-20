import {IconButton} from "@chakra-ui/react"
import {useSetAtom} from "jotai"
import {memo, startTransition} from "react"
import {mobileViewAtom, selectedDayAtom} from "../../atoms"
import {BsFastForwardFill} from "react-icons/bs"
import {getToday} from "../../helpers/dates"

export default memo(function TodayButton() {
  const setMobileView = useSetAtom(mobileViewAtom)
  const setSelectedDay = useSetAtom(selectedDayAtom)

  return (
    <IconButton
      colorScheme="blue"
      aria-label="Jump to today"
      icon={<BsFastForwardFill />}
      fontSize="20px"
      onClick={() =>
        startTransition(() => {
          setSelectedDay(getToday())
          setMobileView("timeline")
        })
      }
    />
  )
})
