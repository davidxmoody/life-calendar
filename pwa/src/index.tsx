import React, {StrictMode} from "react"
import {createRoot} from "react-dom/client"
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

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ColorModeScript initialColorMode={initialColorMode} />
    <ChakraProvider theme={theme}>
      <JotaiProvider>
        <App />
      </JotaiProvider>
    </ChakraProvider>
  </StrictMode>,
)

serviceWorkerRegistration.register()
