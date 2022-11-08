import {Box, Flex} from "@chakra-ui/react"

const startR = 200
const startG = 82
const startB = 35

const endR = 88
const endG = 49
const endB = 40

function scale(amount: number, start: number, end: number) {
  return amount * end + (1 - amount) * start
}

export default function AppleTouchIconGenerator() {
  return (
    <Flex
      border="8px solid white"
      width="192px"
      height="192px"
      boxSizing="content-box"
      m={4}
      ml={32}
      alignItems="center"
      justifyContent="center"
    >
      <Flex flexDirection="column" p={4}>
        {[0, 1, 2, 3].map((y) => (
          <Flex key={y}>
            {[0, 1, 2, 3].map((x) => (
              <Square key={x} x={x} y={y} />
            ))}
          </Flex>
        ))}
      </Flex>
    </Flex>
  )
}

function Square(props: {x: number; y: number}) {
  const amount = (props.x * 1.2 + props.y * 0.9) / 5.5

  const r = scale(amount, startR, endR)
  const g = scale(amount, startG, endG)
  const b = scale(amount, startB, endB)

  const color = `rgb(${r}, ${g}, ${b})`
  return <Box m="3px" boxSize="26px" background={color} />
}
