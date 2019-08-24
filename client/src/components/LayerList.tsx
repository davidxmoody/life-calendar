import * as React from "react"
import useLayerList from "../helpers/useLayerList"
import {Link} from "wouter"

export default function LayerList() {
  const layerList = useLayerList()

  if (!layerList) {
    return null
  }

  return (
    <div>
      {layerList.map(layerName => (
        <div key={layerName} style={{marginBottom: 8}}>
          <Link href={`/layers/${layerName}`}>
            <a>{layerName}</a>
          </Link>
        </div>
      ))}
    </div>
  )
}
