import { Route, Routes } from 'react-router-dom'
import RightPanel from './components/common/RightPanel'
import Sidebar from './components/common/Sidebar'
import LoginPage from './pages/auth/login/LoginPage'
import SignupPage from './pages/auth/signup/SignupPage'
import Homepage from './pages/home/Homepage'
import NotificationPage from './pages/notification/NotificationPage'
import ProfilePage from './pages/profile/ProfilePage'

function App() {

  return (
    <div className='flex max-w-6xl mx-auto'>
      <Sidebar/>
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/notifications' element={<NotificationPage />} />
        <Route path='/profile/:username' element={<ProfilePage />} />
      </Routes>
      <RightPanel/>
    </div>
  )
}

export default App
