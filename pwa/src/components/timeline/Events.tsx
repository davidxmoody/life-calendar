import {Box, Tooltip} from "@chakra-ui/react"
import moment from "moment"
import {clamp} from "ramda"
import {CalendarEvent} from "../../types"

interface Props {
  date: string
  events: CalendarEvent[]
}

export default function Events(props: Props) {
  const dayStart = moment(props.date).unix()
  const dayEnd = moment(props.date).endOf("day").unix()

  return (
    <Box
      position="relative"
      height={6}
      background="rgba(256, 256, 256, 0.2)"
      borderRadius="sm"
    >
      {props.events.map((event) => (
        <Tooltip key={event.id} hasArrow={true} label={getLabel(event)}>
          <Box
            position="absolute"
            top={0}
            bottom={0}
            left={formatPercent((event.start - dayStart) / (dayEnd - dayStart))}
            right={formatPercent((dayEnd - event.end) / (dayEnd - dayStart))}
            background={event.color}
            borderRadius="sm"
            display="flex"
            alignItems="center"
          >
            <Box
              fontSize="xs"
              overflow="hidden"
              whiteSpace="nowrap"
              textOverflow="ellipsis"
              pointerEvents="none"
            />
          </Box>
        </Tooltip>
      ))}
    </Box>
  )
}

function formatPercent(value: number) {
  return `${clamp(0, 100, value * 100)}%`
}

function getLabel(event: CalendarEvent) {
  const startTime = moment(event.start * 1000).format("HH:mm")
  const endTime = moment(event.end * 1000).format("HH:mm")
  return `${event.category} ${startTime}-${endTime}`
}
