import generateDatesLayers from "./generateDatesLayers"
import generateGitLayer from "./generateGitLayer"
import generateStreaksLayers from "./generateStreaksLayers"

generateGitLayer("dotfiles")
generateGitLayer("life-calendar")
generateDatesLayers()
generateStreaksLayers()
