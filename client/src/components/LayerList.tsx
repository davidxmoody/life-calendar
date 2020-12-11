/* eslint-disable no-useless-escape */

import useLayerIds from "../hooks/useLayerIds"

interface Props {
  activeLayerId: string
  setLayerId: (layerId: string) => void
}

export default function LayerList(props: Props) {
  const layerIds = useLayerIds()

  if (!layerIds) {
    return null
  }

  const groups: Record<string, string[] | undefined> = {}
  layerIds.forEach((layerId) => {
    const groupName = layerId.includes("/") ? layerId.replace(/\/.*/, "") : ""
    const name = layerId.replace(/[^\/]*\//, "")
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
                props.setLayerId(groupName ? `${groupName}/${name}` : name)
              }
              style={{
                display: "inline-block",
                marginRight: 8,
                fontStyle:
                  props.activeLayerId === `${groupName}/${name}`
                    ? "italic"
                    : "normal",
                textDecoration:
                  props.activeLayerId === `${groupName}/${name}`
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
