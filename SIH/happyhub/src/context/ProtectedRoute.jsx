import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function ProtectedRoute() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    // Show a basic loading indicator while checking auth state
    return <div className="flex justify-center items-center h-screen text-xl text-gray-700">Checking Authentication...</div>;
  }

  // If user is logged in, render the child component (Dashboard)
  // Otherwise, redirect them to the login page (root path)
  return currentUser ? <Outlet /> : <Navigate to="/" replace />;
}