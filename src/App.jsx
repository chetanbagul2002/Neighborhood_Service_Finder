import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// IMPORTANT: VERIFY THESE FILE PATHS IN YOUR PROJECT STRUCTURE
// Files directly in src/pages/
import LandingPage from "./pages/LandingPage";
// import RoleSelectionPage from "./pages/RoleSelectionPage"; // Original path, but moved to /pages/register/
import ServicePage from "./pages/ServicePage";
import ProvidersListPage from "./pages/ProvidersListPage";
import ProviderProfilePage from "./pages/ProviderProfilePage";

// Files in src/pages/login/
import CustomerLogin from "./pages/login/CustomerLogin";
import ForgotPassword from "./pages/login/ForgotPassword";
import ResetPassword from "./pages/login/ResetPassword";

// Files in src/pages/register/
import CustomerRegister from "./pages/register/CustomerRegister";
import ProviderRegister from "./pages/register/ProviderRegister";
import RoleSelectionPage from "./pages/register/RoleSelectionPage"; // CORRECTED PATH: It's in register/

// Files in src/pages/userdashboard/
import UserDashboard from "./pages/userdashboard/UserDashboard"; // Renamed from Index to UserDashboard

// Files in src/pages/providerdashboard/
import ProviderDashboard from "./pages/providerdashboard/ProviderDashboard";

// CRITICAL: Import AuthProvider
import { AuthProvider } from "./context/AuthContext";


function App() {
  return (
    <Router>
      {/* CRITICAL: Wrap your entire application logic (including Navbar and Routes) with AuthProvider */}
      <AuthProvider>
        {/* Navbar is often outside Routes if it's universal across all pages */}
        {/* If Navbar needs AuthContext, it must be inside AuthProvider */}
        {/* <Navbar /> -- No, Navbar is imported in individual pages so it does not need to be here. */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<CustomerLogin />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/register" element={<RoleSelectionPage />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/provider-dashboard" element={<ProviderDashboard />} />
          <Route path="/profile" element={<UserDashboard />} /> {/* Assuming /profile also leads to user dashboard */}
          <Route path="/register/customer" element={<CustomerRegister />} />
          <Route path="/register/provider" element={<ProviderRegister />} />
          <Route path="/services" element={<ServicePage />} />
          <Route path="/service/:serviceCategory" element={<ProvidersListPage />} />
          <Route path="/provider/:id" element={<ProviderProfilePage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
