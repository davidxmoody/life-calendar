import debounce from "lodash.debounce"
import {useEffect, useState} from "react"

const waitTimeMs = 500

export default function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  useEffect(() => {
    const onResize = debounce(() => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }, waitTimeMs)

    window.addEventListener("resize", onResize)

    return () => window.removeEventListener("resize", onResize)
  }, [setWindowSize])

  return windowSize
}
