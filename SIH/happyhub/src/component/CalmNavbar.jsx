import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// NOTE: Assuming this path is correct relative to the component location
import { auth } from "../component/firebase.js"; 

export default function EduNavbar() { 
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // AUTH STATE LOGIC: This connection remains the same.
  useEffect(() => {
    // This listener ensures the navbar reflects the logged-in user or guest state immediately.
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // LOGOUT HANDLER: This function remains the same, ensuring user sign-out and redirection.
  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      navigate("/"); // redirect to login or home
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="w-full fixed top-0 left-0 h-20 flex items-center justify-between
      px-8 bg-white text-[#1E3A8A] shadow-lg border-b border-gray-200 z-50"> 

      {/* Logo */}
      <div className="text-2xl md:text-3xl font-extrabold tracking-tight">
        <Link to="/" className="text-[#1E3A8A] hover:text-[#2563EB]">GradFolio</Link> 
      </div>

      {/* Navigation Links */}
      <ul className="hidden md:flex space-x-8 text-base font-semibold items-center">
        <li className="hover:text-[#2563EB] transition-colors">
          <Link to="/">Home</Link>
        </li>
        <li className="hover:text-[#2563EB] transition-colors">
          <Link to="/booking">Counseling</Link>
        </li>

        {/* Dashboard with Dropdown */}
        <li
          className="relative cursor-pointer"
          onMouseEnter={() => setDropdownOpen(true)}
          onMouseLeave={() => setDropdownOpen(false)}
        >
          <span className="hover:text-[#2563EB] transition-colors flex items-center">
            Dashboard <svg className={`ml-1 w-3 h-3 transition-transform ${dropdownOpen ? 'rotate-180' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </span>
          {dropdownOpen && (
            <ul className="absolute top-8 right-0 w-52 bg-white text-gray-700 rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50">
              <li className="px-4 py-2 text-sm hover:bg-gray-50 hover:text-[#2563EB]">
                <Link to="/login">Student Dashboard</Link> {/* Linked to /dashboard path */}
              </li>
              {/* === NEW INSTITUTE DASHBOARD LINK === */}
              <li className="px-4 py-2 text-sm hover:bg-gray-50 hover:text-[#2563EB]">
                <Link to="/institute-dashboard">Institute Dashboard</Link>
              </li>
              {/* ================================== */}
              <li className="px-4 py-2 text-sm hover:bg-gray-50 hover:text-[#2563EB]">
                <Link to="/adminlogin">Admin Portal</Link> 
              </li>
            </ul>
          )}
        </li>

        <li className="hover:text-[#2563EB] transition-colors">
          <Link to="/contact">Support/Contact</Link>
        </li>

        {/* User section: Renders profile image/initials and Logout button if 'user' is present. */}
        {user ? (
          <>
            <li className="flex items-center space-x-2">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="profile"
                  className="w-9 h-9 rounded-full object-cover border-2 border-[#2563EB]"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-[#1E3A8A] flex items-center justify-center text-white text-sm font-bold">
                  {user.displayName ? user.displayName[0].toUpperCase() : (user.email ? user.email[0].toUpperCase() : "U")}
                </div>
              )}
              <span className="text-gray-700 text-sm">{user.displayName ? user.displayName.split(' ')[0] : user.email}</span>
            </li>

            <li>
              <button
                onClick={handleLogout}
                className="ml-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm transition-colors shadow-md"
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <li className="hover:text-[#2563EB] transition-colors">
            <Link to="/login">Login</Link> {/* Defaulting to root for login page */}
          </li>
        )}
      </ul>

      {/* Get Started Button */}
      <Link to="/start" className="hidden md:block"> 
        <button className="bg-[#2563EB] hover:bg-[#1E40AF] text-white px-5 py-2 rounded-lg
          transition-all font-bold text-base shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-opacity-50">
          Get Started
        </button>
      </Link>
      
      {/* Mobile Menu Icon */}
      <div className="md:hidden">
        <svg className="w-6 h-6 text-[#1E3A8A] cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
      </div>
    </nav>
  );
}
