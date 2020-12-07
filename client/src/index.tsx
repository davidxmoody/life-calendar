import React from "react"
import ReactDOM from "react-dom"
import App from "./components/App"
import {syncDatabase} from "./idb"
import "./index.css"

ReactDOM.render(<App />, document.getElementById("root"))
;(window as any).syncDatabase = syncDatabase
