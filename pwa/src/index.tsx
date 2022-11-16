import {StrictMode} from "react"
import {createRoot} from "react-dom/client"
import "./index.css"
import App from "./components/App"
import * as serviceWorkerRegistration from "./serviceWorkerRegistration"
import {ChakraProvider} from "@chakra-ui/react"
import {extendTheme} from "@chakra-ui/react"
import {Provider as JotaiProvider} from "jotai"

const theme = extendTheme({
  shadows: {outline: "none"},
  config: {initialColorMode: "dark"},
})

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <JotaiProvider>
        <App />
      </JotaiProvider>
    </ChakraProvider>
  </StrictMode>,
)

serviceWorkerRegistration.register()
