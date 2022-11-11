import {
  Box,
  Button,
  Link,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  useDisclosure,
} from "@chakra-ui/react"
import {Atom, useAtom} from "jotai"
import {startTransition, useState} from "react"
import {createHeadingsForDayAtom, nullAtom, selectedDayAtom} from "../../atoms"
import {prettyFormatDateTime} from "../../helpers/dates"

interface Props {
  date: string
}

export default function DateLink(props: Props) {
  const [, setSelectedDay] = useAtom(selectedDayAtom)
  const {isOpen, onOpen, onClose} = useDisclosure()
  const [headingsAtom, setHeadingsAtom] =
    useState<Atom<Promise<string[]> | null>>(nullAtom)
  const [headings] = useAtom(headingsAtom)

  function openAndLoad() {
    startTransition(() => {
      setHeadingsAtom(createHeadingsForDayAtom(props.date))
      onOpen()
    })
  }

  return (
    <Popover isOpen={isOpen} onOpen={openAndLoad} onClose={onClose}>
      <PopoverTrigger>
        <Link color="teal.500">{props.date}</Link>
      </PopoverTrigger>
      <Portal>
        <Box sx={{".chakra-popover__popper": {zIndex: "popover"}}}>
          <PopoverContent bg="blue.800" borderColor="blue.800">
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader pt={4} fontWeight="bold" border={0}>
              {prettyFormatDateTime({date: props.date})}
            </PopoverHeader>
            <PopoverBody>
              {headings?.length ? (
                headings.map((heading, index) => (
                  <Box key={index}>{heading}</Box>
                ))
              ) : (
                <Box opacity={0.5}>No entries</Box>
              )}
            </PopoverBody>
            <PopoverFooter pb={4} border={0}>
              <Button
                onClick={() => {
                  startTransition(() => {
                    setSelectedDay(props.date)
                  })
                }}
              >
                Go to day
              </Button>
            </PopoverFooter>
          </PopoverContent>
        </Box>
      </Portal>
    </Popover>
  )
}
