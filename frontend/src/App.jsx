import React from 'react'
import {Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import StartModel from './pages/StartModel'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import History from './pages/History'
const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/startmodel/:className' element={<StartModel />} />
      <Route path='/signup' element={<SignUp />} />
      <Route path='/login' element={<Login />} />
      <Route path='/history/:className' element={<History />} />
    </Routes>
  )
}

export default App