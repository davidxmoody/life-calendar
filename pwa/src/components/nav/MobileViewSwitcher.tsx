import {IconButton} from "@chakra-ui/react"
import {useAtom} from "jotai"
import {memo} from "react"
import {mobileViewAtom} from "../../atoms"
import {BsCalendar2Fill, BsCalendar2XFill} from "react-icons/bs"

export default memo(function MobileViewSwitcher() {
  const [mobileView, setMobileView] = useAtom(mobileViewAtom)

  return (
    <IconButton
      colorScheme="blue"
      aria-label="Switch view"
      icon={
        mobileView === "calendar" ? <BsCalendar2Fill /> : <BsCalendar2XFill />
      }
      fontSize="20px"
      onClick={() =>
        setMobileView(mobileView === "calendar" ? "timeline" : "calendar")
      }
    />
  )
})
