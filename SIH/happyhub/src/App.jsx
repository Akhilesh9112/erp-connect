
import './App.css';
import { Routes, Route } from "react-router-dom";

import CalmNavbar from "./component/CalmNavbar";
import CalmFooter from "./component/pages/footer";
import MindRefresh from "./component/home";
import EmotionPredictor from "./component/EmotionPredictor";
import About from "./component/pages/about";
import Contact from "./component/pages/contact";
import LoginPage from "./component/pages/loginpage";
import StudentDashboard from "./component/pages/homepage";
import StressAssessmentPage from "./component/pages/form"; 
import StressReliefAudios from "./component/pages/audio";
import MemorySharingPage from "./component/pages/memory";
import CBTSection from "./component/pages/cbt";
import WelcomePage from "./component/pages/welcomepage";
import BookingPage from "./component/pages/booking";
import AdminAvailabilityForm from "./component/pages/admin";
import AdminLoginWithSignup from "./component/pages/adminlogin";
import AdminAvailability from "./component/pages/adminavaibility";
import ModuleAccordion from "./component/pages/modules";
import StudentPortfolio from "./component/pages/portfolio";
import StudentDashboardd from "./component/pages/institute";

import ProtectedRoute from './context/ProtectedRoute';

// Use the correct relative path


function App() {
  return (
    <>
      {/* Navbar always visible */}
      <CalmNavbar />

      {/* Route-based content */}
      <Routes>
        <Route path='/' element={<MindRefresh />} />
        <Route path='/About' element={<About/>} />
        <Route path='/Contact' element={<Contact/>} />
         <Route path='/login' element={<LoginPage />} /> 
         <Route path="/dashboard" element={<StudentDashboard />} />
         <Route path="/start" element={<StressAssessmentPage />} />
         <Route path="/form" element={<StressAssessmentPage />} />
         <Route path="/audio" element={<StressReliefAudios />} />
         <Route path="/memory" element={<MemorySharingPage />} />
          <Route path="/cbt" element={<CBTSection/>} />
          <Route path="/welcome" element={<WelcomePage/>} />
          <Route path="/booking" element={<BookingPage/>} />
          <Route path="/adminlogin" element={<AdminLoginWithSignup/>} />
          <Route path="/modules" element={<ModuleAccordion/>} />
          <Route path="/integrations" element={<div className='p-8 text-center pt-20'>Integrations Page Placeholder</div>} /> 
           
           <Route path="/admin" element={<AdminAvailability />} />
           <Route path="/portfolio" element={<StudentPortfolio/>} />
           <Route path="/institute" element={<StudentDashboardd/>} />

        {/* Add more routes here if needed */}
      </Routes>

      {/* Footer always visible */}
      <CalmFooter />
    </>
  );
}

export default App;
