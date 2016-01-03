import {memoize} from 'ramda'
import randomSeed from 'random-seed'

const getBaseColor = memoize(era => {
  // TODO Prefixing with a '9' gives slightly more distinct random colors with
  // the eras I'm using. Would be far batter to either be able to choose colors
  // for eras or else have a method to generate distinct colors more easily.
  const seeded = randomSeed.create('9' + era)
  return seeded(360)
})

export default function({era}) {
  // May someday use other week parameters
  const baseColor = getBaseColor(era)
  return `hsl(${baseColor}, 100%, 50%)`
}
