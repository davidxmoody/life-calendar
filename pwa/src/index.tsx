import React, {StrictMode} from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./components/App"
import * as serviceWorkerRegistration from "./serviceWorkerRegistration"
import {ChakraProvider, ColorModeScript} from "@chakra-ui/react"
import {extendTheme} from "@chakra-ui/react"
import {Provider as JotaiProvider} from "jotai"

const theme = extendTheme({
  shadows: {
    outline: "none",
  },
})

ReactDOM.render(
  <StrictMode>
    <ColorModeScript />
    <ChakraProvider theme={theme}>
      <JotaiProvider>
        <App />
      </JotaiProvider>
    </ChakraProvider>
  </StrictMode>,
  document.getElementById("root"),
)

serviceWorkerRegistration.register()
