import React, {Fragment, Suspense} from 'react'
import {Route, Switch} from 'react-router-dom'
import Blog from './pages/Blog'
import Home from './pages/Home'

function App() {
  return (
    <Suspense fallback={<Fragment />}>
      <Switch>
        <Route path="/">
          <Home />
        </Route>
        <Route path="/blog">
          <Blog />
        </Route>
      </Switch>
    </Suspense>
  )
}

export default App
