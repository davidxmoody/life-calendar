import React from "react"
import {Route, Link} from "wouter"
import Calendar from "./Calendar"

const App: React.FC = () => {
  return (
    <div>
      <Route path="/" component={Calendar} />
      <Route path="/test">this is test</Route>
      <Link href="/">goto home</Link>
      <Link href="/test">goto test</Link>
    </div>
  )
}

export default App
