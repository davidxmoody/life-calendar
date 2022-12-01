import generateDatesLayers from "./generateDatesLayers"
import generateGitLayer from "./generateGitLayer"
import generateHolidaysLayer from "./generateHolidaysLayer"
import generateStreaksLayers from "./generateStreaksLayers"

generateGitLayer("dotfiles")
generateGitLayer("life-calendar")
generateDatesLayers()
generateHolidaysLayer()
generateStreaksLayers()
