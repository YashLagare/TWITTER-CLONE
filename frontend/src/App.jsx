import { useQuery } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { Navigate, Route, Routes } from 'react-router-dom'
import LoadingSpinner from './components/common/LoadingSpinner'
import RightPanel from './components/common/RightPanel'
import Sidebar from './components/common/Sidebar'
import LoginPage from './pages/auth/login/LoginPage'
import SignupPage from './pages/auth/signup/SignupPage'
import Homepage from './pages/home/Homepage'
import NotificationPage from './pages/notification/NotificationPage'
import ProfilePage from './pages/profile/ProfilePage'

function App() {

  //calling our /me  api to check authinticate user or not here
  const {data: authUser, isLoading} = useQuery({
    queryKey:['authUser'], //this lines help us in other pages when we want to get auth data we have to just pass this querykey that sit
  });

  if (isLoading) {
    return(
      <div className='h-screen flex justify-center items-center'>
        <LoadingSpinner size='lg'/>
      </div>
    );
  }

  return (
    <div className='flex max-w-6xl mx-auto'>
      {authUser && <Sidebar/>}
      <Routes>
        <Route path='/' element={authUser ? <Homepage /> : <Navigate to="/login" />} />
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path='/signup' element={!authUser ? <SignupPage /> : <Navigate to="/" />} />
        <Route path='/notifications' element={authUser ? <NotificationPage /> : <Navigate to="/login" />} />
        <Route path='/profile/:username' element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>
      {authUser && <RightPanel/>}
      <Toaster/>
    </div>
  )
}

export default App
