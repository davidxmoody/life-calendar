import {StrictMode} from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./components/App"
import * as serviceWorkerRegistration from "./serviceWorkerRegistration"
import reportWebVitals from "./reportWebVitals"
import "fontsource-roboto/300.css"
import "fontsource-roboto/400.css"
import "fontsource-roboto/500.css"
import "fontsource-roboto/700.css"

if (!localStorage.REMOTE_URL) {
  localStorage.REMOTE_URL = prompt("Please enter remote URL")
}

ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById("root"),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register()

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
