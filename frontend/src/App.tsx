import { Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import Claim from "./pages/Claim";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import CouponDetails from "./pages/CouponDetails";

function App() {
  // Get the token directly from localStorage
  

  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/claim" element={<Claim />} />
        
        {/* Redirect to /admin if logged in, else show the login page */}
        <Route path="/login" element={ <Login />} />
        
        {/* Protected Admin Route */}
        <Route path="/admin" element={ <Admin /> } />
        <Route path="/admin/coupon/:id" element={<CouponDetails />} />
      </Routes>
    </div>
  );
}

export default App;
