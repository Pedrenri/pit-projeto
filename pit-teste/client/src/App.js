import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Onboarding from './pages/Onboarding'
import UpdateAcc from './pages/UpdateAccount'
import VerificationForm from './pages/Verification'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import { useCookies } from 'react-cookie'

const App = () => {
  const [ cookies, setCookie, removeCookie ] = useCookies(['user'])

  const authToken = cookies.AuthToken;
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>}/>
      {authToken && <Route path='/dashboard' element={<Dashboard/>}/>}
      {authToken && <Route path='/onboarding' element={<Onboarding/>}/>}
      {authToken && <Route path='/updateAccount' element={<UpdateAcc/>}/>}
      {authToken && <Route path='/verification' element={<VerificationForm/>}/>}
    </Routes>
    </BrowserRouter>
  );
}

export default App;
