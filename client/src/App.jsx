import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserLayout from './Components/Layouts/UserLayout';
import AdminLayout from './Components/Layouts/AdminLayout'

//imports for user
import Home from './Pages/Users/Home';
import Login from './Pages/Users/Login';
import Register from './Pages/Users/Register'
import Otp from './Pages/Users/Otp';

//imports for admin
import AdminLogin from './Pages/Admins/Login'
import Dashboard from './Pages/Admins/Dashboard';
import Requests from './Pages/Admins/Requests';

//imports for vendor
import VendorLayout from './Components/Layouts/VendorLayout'
import VendorLogin from './Pages/Seller/Login'
import AddItem from './Pages/Seller/AddItem'
function App() {

  return (
    <Router>
      <Routes>

        {/* User Routes*/}
        <Route path='/' element={<UserLayout />}>
          <Route index element={<Home />} />
        </Route>

        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/otp' element={<Otp />} />

        {/* Admin Routes*/}
        <Route path='/admin' element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path='requests' element={<Requests/>}/>
        </Route>

        <Route path='/admin/login' element={<AdminLogin />} />

        {/* Vendor Routes*/}
        <Route path='/vendor' element={<VendorLayout />}>
          <Route path='additem' element={<AddItem/>} />
        </Route>

        <Route path='/vendor/login' element={<VendorLogin/>} />
      </Routes>
    </Router>
  )
}

export default App
