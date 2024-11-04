//imports for helpers
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserLayout from './Components/Layouts/UserLayout';
import AdminLayout from './Components/Layouts/AdminLayout'

//route imports
import AuthRoute from './Routers/AuthRoute'
import ProtectedRoute from './Routers/ProtectedRoute'

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
import AddItem from './Pages/Seller/AddItem'
import AuthChecker from './Components/AuthChecker';
function App() {
  return (
    <Router>
      <AuthChecker/>
      <Routes>
        {/* Public Routes (only accessible if NOT authenticated) */}
        <Route element={<AuthRoute forAdmin={false}/>}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/otp" element={<Otp />} />
          
        </Route>

        <Route element={<AuthRoute forAdmin={true}/>}>
          <Route path="/admin/login" element={<AdminLogin />} />
        </Route>

        {/* User Routes*/}
        <Route element={<ProtectedRoute forAdmin={false}/>}>
          <Route path="/" element={<UserLayout />}>
            <Route index element={<Home />} />
          </Route>
        </Route>


        {/* Admin Routes*/}
        <Route element={<ProtectedRoute forAdmin={true}/>}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="requests" element={<Requests />} />
          </Route>
        </Route>

        {/* Vendor Routes*/}
        <Route element={<ProtectedRoute forAdmin={false}/>}>
          <Route path="/vendor" element={<VendorLayout />}>
            <Route path="additem" element={<AddItem />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  )
}

export default App