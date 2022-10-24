import * as React from "react"
import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  Text,
} from "@chakra-ui/react"
import {startTransition, useState} from "react"
import useToday from "../hooks/useToday"
import moment from "moment"
import {getWeekStart} from "../helpers/dates"
import {useAtom} from "jotai"
import {mobileViewAtom, selectedWeekStartAtom} from "../atoms"

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function JumpToModal(props: Props) {
  const [, setSelectedWeekStart] = useAtom(selectedWeekStartAtom)
  const [, setMobileView] = useAtom(mobileViewAtom)
  const today = useToday()
  const [initialYear, initialMonth, initialDay] = today
    .split("-")
    .map((x) => parseInt(x, 10))
  const [year, setYear] = useState(initialYear)
  const [month, setMonth] = useState(initialMonth)
  const [day, setDay] = useState(initialDay)

  const selectedDate = getDate(year, month, day)
  const selectedDateValid = moment(selectedDate).isValid()

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} size="xs">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Jump to date</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            <Flex alignItems="center">
              <Text w="80px" textAlign="right" pr={3}>
                Year:
              </Text>
              <Select
                placeholder="Year"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value, 10))}
              >
                {range(1990, initialYear).map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </Select>
            </Flex>

            <Flex alignItems="center">
              <Text w="80px" textAlign="right" pr={3}>
                Month:
              </Text>
              <Select
                placeholder="Month"
                value={month}
                onChange={(e) => setMonth(parseInt(e.target.value, 10))}
              >
                {range(1, 12).map((x) => (
                  <option key={x} value={x}>
                    {x} ({months[x - 1]})
                  </option>
                ))}
              </Select>
            </Flex>

            <Flex alignItems="center">
              <Text w="80px" textAlign="right" pr={3}>
                Day:
              </Text>
              <Select
                placeholder="Day"
                value={day}
                onChange={(e) => setDay(parseInt(e.target.value, 10))}
              >
                {range(1, 31).map((x) => (
                  <option key={x} value={x}>
                    {isValidDay(year, month, x) ? x : `${x} (X)`}
                  </option>
                ))}
              </Select>
            </Flex>
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button
            disabled={!selectedDateValid}
            colorScheme="blue"
            onClick={() => {
              startTransition(() => {
                props.onClose()
                setSelectedWeekStart(getWeekStart(selectedDate))
                setMobileView("timeline")
              })
            }}
          >
            Jump to {selectedDate}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

function range(startInc: number, endInc: number) {
  const result: number[] = []
  for (let i = startInc; i <= endInc; i++) {
    result.push(i)
  }
  return result
}

function getDate(year: number, month: number, day: number) {
  return `${year}-${month.toString().padStart(2, "0")}-${day
    .toString()
    .padStart(2, "0")}`
}

function isValidDay(year: number, month: number, day: number) {
  if (day <= 28) {
    return true
  }
  return moment(getDate(year, month, day)).isValid()
}
