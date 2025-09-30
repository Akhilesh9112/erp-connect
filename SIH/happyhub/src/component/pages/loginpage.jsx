import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase.js"; // ⬅️ FIX APPLIED: Explicitly added .js extension to resolve potential import issue
import { useAuth } from "../../context/AuthContext"; // Import useAuth to get googleSignIn

export default function LoginPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { googleSignIn } = useAuth(); // Get the Google sign-in function

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isLogin) {
        // 🔑 Login existing user
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        // 📝 Register new user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
      }
      navigate("/dashboard"); 
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsLoading(true);
    try {
      // ✅ This function retrieves displayName, email, and photoURL from Google
      await googleSignIn(); 
      navigate("/dashboard"); 
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-xl w-96"
      >
        <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">
          EduConnect {isLogin ? "Login" : "Sign Up"}
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 mb-4 rounded-lg text-sm border border-red-200">
            {error}
          </div>
        )}

        {/* Name input only for Sign Up */}
        {!isLogin && (
          <input
            type="text"
            placeholder="Full Name"
            className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 transition duration-150 shadow-md"
        >
          {isLoading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
        </button>

        <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-500 text-sm">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* 🚀 GOOGLE SIGN IN BUTTON */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full flex items-center justify-center bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-50 transition duration-150 shadow-sm"
        >
          {/* Using inline SVG for Google Icon */}
          <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.91 3.51 30.73 1 24 1 14.83 1 6.8 5.44 2.84 12.01l7.85 6.09C13.2 11.23 18.24 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.72 23.59c0-1.77-.15-3.5-.47-5.18H24v10.37h12.44c-.53 2.65-2.09 4.88-4.28 6.38l7.85 6.09c4.56-4.24 7.22-10.45 7.22-17.66z"/>
            <path fill="#FBBC05" d="M10.7 28.5c-.75-2.23-.75-4.57 0-6.8v-6.09L2.84 12.01C1.09 15.53 1 19.46 1 24s.09 8.47 1.84 11.99l7.86-6.09c0-2.23 0-4.57 0-6.8z"/>
            <path fill="#34A853" d="M24 46.5c6.77 0 12.75-2.6 17.38-6.96l-7.86-6.09c-2.48 1.6-5.6 2.55-9.52 2.55-5.76 0-10.8-1.73-14.93-4.7l-7.85 6.09C6.8 42.56 14.83 46.5 24 46.5z"/>
            <path fill="none" d="M0 0h48v48H0z"/>
          </svg>
          Sign in with Google
        </button>
        {/* END GOOGLE SIGN IN BUTTON */}


        <p
          className="mt-6 text-sm text-center text-blue-500 cursor-pointer hover:text-blue-700 transition-colors"
          onClick={() => {
            setIsLogin(!isLogin);
            setError(null); 
          }}
        >
          {isLogin
            ? "Don't have an account? Sign Up"
            : "Already have an account? Login"}
        </p>
      </form>
    </div>
  );
}
