import React from 'react'
import {Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import StartModel from './pages/SSModel'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import History from './pages/History'
import UploadVideo from './pages/UploadVideo'
import UploadPhoto from './pages/UploadPhoto'
import Roboflow from './components/Roboflow'
import StreamModel from './pages/StreamModel'
// import ExternalHTMLViewer from './ExternalHTMLViewer'
import OneClassHistory from './pages/OneClassHistory'
const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/startmodel/:className' element={<StartModel />} />
      <Route path='/signup' element={<SignUp />} />
      <Route path='/login' element={<Login />} />
      <Route path='/history/:className' element={<History />} />
      <Route path='/uploadphoto' element={<UploadPhoto />} />
      <Route path='/roboflowstream' element={<Roboflow />} />
      <Route path='/streammodel/:className' element={<StreamModel />} />
      <Route path='/oneclasshistory/:className/:folderName' element={<OneClassHistory />} />
    </Routes>
  )
}

export default App