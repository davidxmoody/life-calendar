import * as React from "react"
import useLayerList from "../hooks/useLayerList"

interface Props {
  activeLayerName: string
  setLayerName: (layerName: string) => void
}

export default function LayerList(props: Props) {
  const layerList = useLayerList()

  if (!layerList) {
    return null
  }

  return (
    <div>
      {layerList.map(layerName => (
        <a
          key={layerName}
          onClick={() => props.setLayerName(layerName)}
          style={{
            marginRight: 8,
            fontStyle:
              props.activeLayerName === layerName ? "italic" : "normal",
            textDecoration:
              props.activeLayerName === layerName ? "none" : "underline",
            color: "blue",
            cursor: "pointer",
          }}
        >
          {layerName}
        </a>
      ))}
    </div>
  )
}
