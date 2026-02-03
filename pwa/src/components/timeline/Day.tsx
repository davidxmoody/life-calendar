import {Atom, useAtomValue} from "jotai"
import {memo, startTransition, useRef, useState} from "react"
import {createDataForDayAtom, nullAtom} from "../../atoms"
import {prettyFormatDateTime} from "../../helpers/dates"
import {Entry} from "../../types"
import HighlightedText from "./HighlightedText"
import AudioPlayer from "./AudioPlayer"
import Markdown from "./Markdown"
import ScannedPage from "./ScannedPage"
import {NAV_BAR_HEIGHT_PX} from "../nav/NavBar"

interface Props {
  date: string
  headings: string[] | null
  selected: boolean
}

export default memo(function Day(props: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const [dataAtom, setDataAtom] =
    useState<Atom<Promise<{entries: Entry[]}> | null>>(nullAtom)
  const data = useAtomValue(dataAtom)

  if (!props.headings?.length) {
    return (
      <div className="max-w-[800px] md:px-2 pb-4 md:pb-2">
        <EmptyDayHeader date={props.date} selected={props.selected} />
      </div>
    )
  }

  function onToggle() {
    startTransition(() => {
      if (dataAtom === nullAtom) {
        setDataAtom(createDataForDayAtom(props.date))
      } else {
        setDataAtom(nullAtom)
      }

      const isHeaderSticky =
        headerRef.current?.getBoundingClientRect().top === NAV_BAR_HEIGHT_PX

      if (isHeaderSticky) {
        containerRef.current?.scrollIntoView()
      }
    })
  }

  return (
    <div className="max-w-[800px] md:px-2 pb-4 md:pb-2" ref={containerRef}>
      <div className="relative md:rounded-md" style={{contain: "paint"}}>
        <DayHeader
          headerRef={headerRef}
          date={props.date}
          selected={props.selected}
          onClick={onToggle}
        />

        <div
          className={`
            md:border-l md:border-r md:border-b md:rounded-b-md border-gray-600
            overflow-hidden
            ${data ? "" : "cursor-pointer"}
          `}
          onClick={data ? undefined : onToggle}
        >
          {data ? (
            <Full entries={data.entries} />
          ) : (
            <Summary headings={props.headings} />
          )}
        </div>

        <div className="absolute pointer-events-none bottom-0 left-0 right-0 z-40 h-5 md:border-l md:border-r md:border-b md:rounded-b-md border-gray-600" />
      </div>
    </div>
  )
})

function EmptyDayHeader(props: {date: string; selected: boolean}) {
  return (
    <div className="bg-gray-800 opacity-50 md:pt-2">
      <div
        className={`
          p-4 md:rounded-md md:border border-gray-600 transition-colors duration-300
          ${props.selected ? "bg-blue-700" : "bg-blue-900"}
        `}
      >
        <h3 className="text-lg font-bold text-white">
          {prettyFormatDateTime({date: props.date})}
        </h3>
      </div>
    </div>
  )
}

function DayHeader(props: {
  date: string
  selected: boolean
  onClick: () => void
  headerRef: React.Ref<HTMLDivElement>
}) {
  return (
    <div
      ref={props.headerRef}
      className="bg-gray-800 sticky top-0 z-40 md:pt-2"
    >
      <div
        className={`
          p-4 md:rounded-t-md md:border border-gray-600 cursor-pointer
          ${props.selected ? "bg-blue-700" : "bg-blue-900"}
        `}
        onClick={props.onClick}
      >
        <h3 className="text-lg font-bold text-white">
          {prettyFormatDateTime({date: props.date})}
        </h3>
      </div>
    </div>
  )
}

function Summary(props: {headings: NonNullable<Props["headings"]>}) {
  return (
    <div className="px-4 py-2">
      {props.headings.map((heading, index) => (
        <HighlightedText key={index} as="div">
          {heading}
        </HighlightedText>
      ))}
    </div>
  )
}

function Full(props: {entries: Entry[]}) {
  return (
    <div>
      {props.entries.map((entry, i) => (
        <div
          key={entry.id}
          className={i === props.entries.length - 1 ? "" : "mb-2"}
        >
          {entry.type === "markdown" ? (
            <div className="mx-4 md:mx-8 my-4 md:my-6">
              <Markdown source={entry.content} />
            </div>
          ) : entry.type === "scanned" ? (
            <ScannedPage entry={entry} />
          ) : entry.type === "audio" ? (
            <div className="mx-4 md:mx-8 my-4 md:my-6">
              <AudioPlayer sourceUrl={entry.fileUrl} />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  )
}
