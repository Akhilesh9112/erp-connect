import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signOut,
  GoogleAuthProvider, // 1. Import Google Provider
  signInWithPopup    // 2. Import signInWithPopup
} from 'firebase/auth';
import { auth } from '../component/firebase'; // Ensure this path is correct

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to handle Google Sign-In
  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  // Function to handle manual logout
  const logout = () => {
    return signOut(auth);
  };

  // Listener for Firebase Auth State Changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe; 
  }, []);

  const value = {
    currentUser,
    loading,
    logout,
    googleSignIn, // 3. Export the new function
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
