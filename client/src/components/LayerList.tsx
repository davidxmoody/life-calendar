import * as React from "react"
import {useQuery} from "react-query"
import fetchLayerList from "../api/fetchLayerList"

interface Props {
  activeLayerName: string
  setLayerName: (layerName: string) => void
}

export default function LayerList(props: Props) {
  const {data} = useQuery("layer-list", fetchLayerList)

  if (!data) {
    return null
  }

  return (
    <div style={{textOverflow: "wrap"}}>
      {data.map((layerName) => (
        <span
          key={layerName}
          onClick={() => props.setLayerName(layerName)}
          style={{
            display: "inline-block",
            marginRight: 8,
            marginBottom: 4,
            fontStyle:
              props.activeLayerName === layerName ? "italic" : "normal",
            textDecoration:
              props.activeLayerName === layerName ? "none" : "underline",
            color: "blue",
            cursor: "pointer",
          }}
        >
          {layerName}
        </span>
      ))}
    </div>
  )
}
