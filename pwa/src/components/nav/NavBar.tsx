import {memo} from "react"
import LayerButton from "./LayerButton"
import SyncButton from "./SyncButton"
import MobileViewSwitcher from "./MobileViewSwitcher"
import SearchButton from "./SearchButton"
import SearchNavButtons from "./SearchNavButtons"
import TodayButton from "./TodayButton"

export const NAV_BAR_HEIGHT_PX = 72

export default memo(function NavBar() {
  return (
    <div
      className="flex items-center gap-4 p-4 bg-ctp-crust z-10"
      style={{height: NAV_BAR_HEIGHT_PX}}
    >
      <div className="md:hidden">
        <MobileViewSwitcher />
      </div>
      <LayerButton />

      <div className="flex-1" />

      <SearchNavButtons />
      <SearchButton />
      <TodayButton />
      <SyncButton />
    </div>
  )
})
