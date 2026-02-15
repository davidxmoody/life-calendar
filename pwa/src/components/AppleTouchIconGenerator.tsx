const startR = 137
const startG = 180
const startB = 250

const endR = 203
const endG = 166
const endB = 247

function scale(amount: number, start: number, end: number) {
  return amount * end + (1 - amount) * start
}

export default function AppleTouchIconGenerator() {
  return (
    <div className="flex w-[192px] h-[192px] box-content border-8 border-white m-4 ml-32 items-center justify-center">
      <div className="flex flex-col p-4">
        {[0, 1, 2, 3].map((y) => (
          <div key={y} className="flex">
            {[0, 1, 2, 3].map((x) => (
              <Square key={x} x={x} y={y} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function Square(props: {x: number; y: number}) {
  const amount = (props.x * 1.2 + props.y * 0.9) / 5.5

  const r = scale(amount, startR, endR)
  const g = scale(amount, startG, endG)
  const b = scale(amount, startB, endB)

  return (
    <div
      className="m-[3px] size-[26px]"
      style={{background: `rgb(${r}, ${g}, ${b})`}}
    />
  )
}
