import React, {Fragment, Suspense} from 'react'
import Home from './pages/Home'

function App() {
  return (
    <Suspense fallback={<Fragment />}>
      <Home />
    </Suspense>
  )
}

export default App
