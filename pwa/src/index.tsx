import React, {StrictMode} from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./components/App"
import * as serviceWorkerRegistration from "./serviceWorkerRegistration"
import {ChakraProvider, ColorMode, ColorModeScript} from "@chakra-ui/react"
import {extendTheme} from "@chakra-ui/react"
import {Provider as JotaiProvider} from "jotai"

const initialColorMode: ColorMode = "dark"

const theme = extendTheme({
  shadows: {
    outline: "none",
  },
  config: {
    initialColorMode,
  },
})

ReactDOM.render(
  <StrictMode>
    <ColorModeScript initialColorMode={initialColorMode} />
    <ChakraProvider theme={theme}>
      <JotaiProvider>
        <App />
      </JotaiProvider>
    </ChakraProvider>
  </StrictMode>,
  document.getElementById("root"),
)

serviceWorkerRegistration.register()
