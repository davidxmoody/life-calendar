/* eslint-disable no-useless-escape */

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

  const groups: Record<string, string[] | undefined> = {}
  data.forEach((fullName) => {
    const groupName = fullName.includes("/") ? fullName.replace(/\/.*/, "") : ""
    const name = fullName.replace(/[^\/]*\//, "")
    groups[groupName] = [...(groups[groupName] ?? []), name]
  })

  return (
    <div style={{textOverflow: "wrap"}}>
      {Object.keys(groups).map((groupName) => (
        <p key={groupName}>
          {`${groupName}: `}
          {groups[groupName]!.map((name) => (
            <span
              key={name}
              onClick={() =>
                props.setLayerName(groupName ? `${groupName}/${name}` : name)
              }
              style={{
                display: "inline-block",
                marginRight: 8,
                fontStyle:
                  props.activeLayerName === `${groupName}/${name}`
                    ? "italic"
                    : "normal",
                textDecoration:
                  props.activeLayerName === `${groupName}/${name}`
                    ? "none"
                    : "underline",
                color: "blue",
                cursor: "pointer",
              }}
            >
              {name}
            </span>
          ))}
        </p>
      ))}
    </div>
  )
}
