import React from 'react'
import Registration from './pages/Registration/Registration.jsx'
import Login from './pages/Login/Login.jsx'
import { Routes, Route } from 'react-router'
import Home from './pages/Home/Home.jsx'
import Notes from './pages/Notes/Notes.jsx'
import Sidebar from './component/sidebar/Sidebar.jsx'
import ProfilePhoto from './component/imageUplode/ProfilePhoto.jsx'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DashboardStats from './pages/Dashboard/Dashboard.jsx'
import TrashNotes from './pages/Trashnotes/TrashNotes.jsx'





const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/Login' element={<Login />} />
        <Route path='/Register' element={<Registration />} />
        <Route path='/dashboard' element={<Notes />} />
        <Route path='/profilePicture' element={<ProfilePhoto />} />
        <Route path='/dashboardStatus' element={<DashboardStats />} />
        <Route path='/TrashNotes' element={<TrashNotes />} />

      </Routes>
      <ToastContainer
        position='top-center'
      />
    </div>

  )
}

export default App
