import {memoize} from 'ramda'
import randomSeed from 'random-seed'

const getBaseColor = memoize(era => {
  const seeded = randomSeed.create(era)
  return seeded(360)
})

export default function({era}) {
  // May someday use other week parameters
  const baseColor = getBaseColor(era)
  return `hsl(${baseColor}, 100%, 50%)`
}
