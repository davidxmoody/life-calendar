import * as React from "react"
import useLayerList from "../hooks/useLayerList"
import {Link} from "wouter"

interface Props {
  activeLayerName: string | undefined
}

export default function LayerList(props: Props) {
  const layerList = useLayerList()

  if (!layerList) {
    return null
  }

  return (
    <div>
      {layerList.map(layerName => (
        <Link key={layerName} href={`/layers/${layerName}`}>
          <a
            style={{
              marginRight: 8,
              fontStyle:
                props.activeLayerName === layerName ? "italic" : "normal",
              textDecoration:
                props.activeLayerName === layerName ? "none" : "underline",
            }}
          >
            {layerName}
          </a>
        </Link>
      ))}
    </div>
  )
}
