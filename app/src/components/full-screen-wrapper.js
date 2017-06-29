import React, {PropTypes} from "react"

const style = {
  position: "fixed",
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  overflow: "hidden",
}

export default function FullScreenWrapper({children}) {
  return (
    <div style={style}>
      {children}
    </div>
  )
}

FullScreenWrapper.propTypes = {
  children: PropTypes.node.isRequired,
}
