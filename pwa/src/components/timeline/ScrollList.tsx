/* eslint-disable react-hooks/exhaustive-deps */

import React, {useCallback, useEffect, useRef} from "react"
import {Box} from "@chakra-ui/react"
import debounce from "lodash.debounce"
import {NAV_BAR_HEIGHT_PX} from "../nav/NavBar"
import {memo} from "react"

const DEBOUNCE_DELAY_MS = 100
const TOP_OFFSET_PX = 58

const genericMemo: <C>(component: C) => C = memo

type RenderItem<T> = (args: {item: T; isSelected: boolean}) => React.ReactNode

interface Props<T> {
  header: React.ReactNode
  footer: React.ReactNode
  items: T[]
  renderItem: RenderItem<T>
  getScrollKey: (item: T) => string
  currentScrollKey: string
  onChangeScrollKey: (newKey: string) => void
}

let initialIdNum = 1

export default function ScrollList<T>(props: Props<T>) {
  const containerId = `scroll-list-${useRef(initialIdNum++).current}`
  const skipNextScrollToRef = useRef<string | null>(null)
  const heights = useRef<Record<string, number>>({})

  const checkCurrentScrollKey = useCallback(
    debounce(() => {
      const scrollTop =
        document.querySelector(`#${containerId}`)?.scrollTop ?? 0
      let currentHeight = 0
      for (const [scrollKey, height] of Object.entries(heights.current)) {
        currentHeight += height
        if (scrollTop + TOP_OFFSET_PX < currentHeight) {
          skipNextScrollToRef.current = scrollKey
          props.onChangeScrollKey(scrollKey)
          break
        }
      }
    }, DEBOUNCE_DELAY_MS),
    [props.onChangeScrollKey],
  )

  const onHeightChange = useCallback(
    (scrollKey: string, height: number) => {
      if (height === 0) {
        delete heights.current[scrollKey]
      } else {
        heights.current[scrollKey] = height
      }
      checkCurrentScrollKey()
    },
    [checkCurrentScrollKey],
  )

  useEffect(() => {
    if (skipNextScrollToRef.current === props.currentScrollKey) {
      skipNextScrollToRef.current = null
    } else {
      document
        .querySelector(
          `#${containerId} [data-scroll-key="${props.currentScrollKey}"]`,
        )
        ?.scrollIntoView()
    }
  }, [props.currentScrollKey])

  return (
    <Box
      id={containerId}
      overflowY="scroll"
      height="100%"
      onScroll={checkCurrentScrollKey}
    >
      {props.items.map((item, index) => (
        <ScrollBlock
          key={props.getScrollKey(item)}
          header={index === 0 ? props.header : null}
          footer={index === props.items.length - 1 ? props.footer : null}
          scrollKey={props.getScrollKey(item)}
          isSelected={props.getScrollKey(item) === props.currentScrollKey}
          item={item}
          renderItem={props.renderItem}
          minHeight={
            index === props.items.length - 1
              ? `calc(100vh - ${NAV_BAR_HEIGHT_PX}px)`
              : undefined
          }
          onHeightChange={onHeightChange}
        />
      ))}
    </Box>
  )
}

const ScrollBlock = genericMemo(
  <T,>(props: {
    header: React.ReactNode
    footer: React.ReactNode
    scrollKey: string
    isSelected: boolean
    item: T
    renderItem: RenderItem<T>
    minHeight?: string
    onHeightChange: (scrollKey: string, height: number) => void
  }) => {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
      const boxElement = ref.current
      if (boxElement) {
        const resizeObserver = new ResizeObserver((entries) => {
          props.onHeightChange(
            props.scrollKey,
            entries[0]?.borderBoxSize[0].blockSize,
          )
        })
        resizeObserver.observe(boxElement)
        return () => {
          resizeObserver.unobserve(boxElement)
          props.onHeightChange(props.scrollKey, 0)
        }
      }
    }, [props.scrollKey, props.onHeightChange])

    // TODO fix minHeight not working properly when last element is zero height

    return (
      <Box
        ref={ref}
        data-scroll-key={props.scrollKey}
        minHeight={props.minHeight}
      >
        {props.header}
        {props.renderItem({item: props.item, isSelected: props.isSelected})}
        {props.footer}
      </Box>
    )
  },
)
