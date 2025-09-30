import React, { useState, useEffect, useMemo } from "react";
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, collection, query, where, onSnapshot, updateDoc } from 'firebase/firestore';
// Removed: import { CheckSquare, Users, Calendar, BarChart2, LayoutDashboard, XCircle, Loader, FileText, Send } from 'lucide-react';

// --- Replacement Icon Components (to fix "lucide-react" import error) ---
const SvgIcon = ({ d, ...props }) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={d} />
  </svg>
);

const CheckSquare = (props) => (
  <SvgIcon {...props} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.952 11.952 0 014.28 1.04l.154.062a12.001 12.001 0 00-11.411 9.876 12.001 12.001 0 004.28 1.04zM17.882 17.882A3 3 0 0115 21H9a3 3 0 01-2.882-3.882" />
);
const Users = (props) => (
  <SvgIcon {...props} d="M17 20h-4v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2H1m18 0h4v-2a4 4 0 00-4-4h-3M10 9a4 4 0 11-8 0 4 4 0 018 0zM17 11a4 4 0 11-8 0 4 4 0 018 0z" />
);
const Calendar = (props) => (
  <SvgIcon {...props} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
);
const BarChart2 = (props) => (
  <SvgIcon {...props} d="M12 20V10m6 10V4m-12 16v-4" />
); 
const LayoutDashboard = (props) => (
  <SvgIcon {...props} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
);
const XCircle = (props) => (
  <SvgIcon {...props} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
);
const Loader = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={`${props.className} animate-spin`}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 0020 12h-2m-2 0h-2m-2 0h-2m-2 0h-2m-2 0H4m0 0a8.001 8.001 0 0015.356 2M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
); 
const FileText = (props) => (
  <SvgIcon {...props} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
);
const Send = (props) => (
  <SvgIcon {...props} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
);

// --- End Replacement Icon Components ---

// --- Global Variable Access & Firebase Initialization ---
// MANDATORY: Access global variables provided by the Canvas environment
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : null;
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// Mock Stats (used for Overview only, real data will be fetched for queue)
const mockStats = [
  { title: "Total Students", value: "2,450", trend: "+4.5%", color: "text-blue-600", bg: "bg-blue-100", icon: Users },
  { title: "Active Projects", value: "520", trend: "+12%", color: "text-green-600", bg: "bg-green-100", icon: BarChart2 },
  { title: "Pending Verifications", value: "48", trend: "Critical", color: "text-red-600", bg: "bg-red-100", icon: CheckSquare },
  { title: "Avg. Portfolio Score", value: "78.2", trend: "Stable", color: "text-yellow-600", bg: "bg-yellow-100", icon: LayoutDashboard },
];

// --- Helper Components ---

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-3 p-3 rounded-xl w-full text-left transition-colors duration-200 ${
      active
        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg font-semibold transform scale-[1.01]"
        : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
    }`}
  >
    <Icon className="w-5 h-5 flex-shrink-0" />
    <span className="hidden lg:inline text-sm">{label}</span>
  </button>
);

const StatCard = ({ title, value, trend, color, bg, icon: Icon }) => (
  <div className="bg-white p-6 rounded-xl shadow-xl border-l-4 border-blue-500 hover:shadow-2xl transition-all duration-300">
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-gray-500 uppercase">{title}</p>
      <Icon className={`w-5 h-5 ${color}`} />
    </div>
    <div className="flex items-end justify-between mt-2">
      <h3 className="text-4xl font-extrabold text-gray-900">{value}</h3>
      <span className={`text-xs font-bold ${color} bg-opacity-10 rounded-full px-2 py-0.5 ${bg}`}>{trend}</span>
    </div>
  </div>
);

const StatusPill = ({ status }) => {
  const base = "px-3 py-1 text-xs font-bold rounded-full transition-colors";
  if (status === "pending" || status === "New") return <span className={`${base} bg-red-100 text-red-700`}>PENDING</span>;
  if (status === "approved" || status === "Verified") return <span className={`${base} bg-green-100 text-green-700`}>APPROVED</span>;
  if (status === "rejected") return <span className={`${base} bg-yellow-100 text-yellow-700`}>REJECTED</span>;
  return <span className={`${base} bg-gray-100 text-gray-500`}>Unknown</span>;
};

// --- Login Screen Component ---
const AdminLoginWithSignup = ({ setLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setIsAuthenticating(true);

    // Simulate login API call delay
    setTimeout(async () => {
      const INSTITUTE_PASSWORD = "GNIOT"; // Replace or fetch from Firestore

      if (password === INSTITUTE_PASSWORD) {
        setLoggedIn(true); // allow login
      } else {
        setError('Incorrect institute password.');
      }
      setIsAuthenticating(false);
    }, 1000);
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl border-t-8 border-blue-600 transition-all duration-500">
        <div className="text-center mb-8">
          <LayoutDashboard className="w-12 h-12 mx-auto text-blue-600" />
          <h1 className="text-3xl font-extrabold text-gray-900 mt-4">
            Institute Admin Sign In
          </h1>
          <p className="text-gray-500 text-sm">
            Access the Verification and Management Portal
          </p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="hod@institution.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            />
          </div>
          
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm text-center font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isAuthenticating}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed transform hover:scale-[1.005]"
          >
            {isAuthenticating ? (
              <>
                <Loader className="w-5 h-5 mr-3" />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          For technical issues, please contact IT support.
        </p>
      </div>
    </div>
  );
};

// --- Main Application Component ---
const App = () => {
  const [activeView, setActiveView] = useState("overview");
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [verificationQueue, setVerificationQueue] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // NEW STATE: Login Gate

  // 1. Firebase Initialization and Authentication
  useEffect(() => {
    if (!firebaseConfig) {
      console.error("Firebase config is missing.");
      setIsLoading(false);
      return;
    }
    try {
      const app = initializeApp(firebaseConfig);
      const firestore = getFirestore(app);
      const authInstance = getAuth(app);

      setDb(firestore);
      setAuth(authInstance);

      // This ensures we have a Firebase user (anonymous or custom token) for DB access
      const unsubscribe = onAuthStateChanged(authInstance, async (user) => {
        if (user) {
          setUserId(user.uid);
        } else {
          try {
            await signInAnonymously(authInstance);
          } catch (error) {
            console.error("Anonymous sign-in failed:", error);
          }
        }
        setIsAuthReady(true);
        setIsLoading(false);
      });

      if (initialAuthToken) {
        signInWithCustomToken(authInstance, initialAuthToken)
          .catch(error => {
            console.error("Custom token sign-in failed. Falling back to anonymous.", error);
            signInAnonymously(authInstance);
          });
      } else {
        signInAnonymously(authInstance);
      }

      return () => unsubscribe();
    } catch (error) {
      console.error("Firebase initialization failed:", error);
      setIsLoading(false);
    }
  }, []);


  // 2. Real-time Verification Queue Fetch
  useEffect(() => {
    if (db && isAuthReady && isLoggedIn) { // Only fetch if Firebase ready AND user logged in via UI
      // Fetch all pending requests from the public collection
      const requestsRef = collection(db, `artifacts/${appId}/public/data/verification_requests`);
      const q = query(requestsRef, where("status", "==", "pending"));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const requests = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          // Firestore Timestamp conversion: convert to milliseconds before creating Date
          dateSubmitted: doc.data().dateSubmitted && doc.data().dateSubmitted.seconds
            ? new Date(doc.data().dateSubmitted.seconds * 1000).toLocaleDateString() 
            : 'N/A'
        }));
        // Sort by submission date (newest first)
        requests.sort((a, b) => {
           // Basic sort check, treating N/A as older
           const dateA = a.dateSubmitted === 'N/A' ? 0 : new Date(a.dateSubmitted);
           const dateB = b.dateSubmitted === 'N/A' ? 0 : new Date(b.dateSubmitted);
           return dateB - dateA;
        });
        setVerificationQueue(requests);
      }, (error) => {
        console.error("Error fetching verification queue:", error);
      });

      return () => unsubscribe();
    }
  }, [db, isAuthReady, isLoggedIn, appId]); // Added isLoggedIn dependency


  // 3. Verification Action Handlers
  const handleVerificationAction = async (requestId, status, comment) => {
    if (!db || !userId) return console.error("Database not ready or user not logged in.");

    try {
      const docRef = doc(db, `artifacts/${appId}/public/data/verification_requests`, requestId);
      
      const payload = {
        status: status,
        adminId: userId,
        adminComment: comment,
        verificationDate: new Date().toISOString(),
      };

      // Exponential backoff logic for retries
      const maxRetries = 3;
      let attempt = 0;
      let delay = 1000;

      while (attempt < maxRetries) {
        try {
          await updateDoc(docRef, payload);
          setSelectedRequest(null);
          return true;
        } catch (error) {
          attempt++;
          if (attempt >= maxRetries) throw error;
          console.warn(`Firestore update failed, retrying in ${delay}ms... (Attempt ${attempt}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2; // Exponential backoff
        }
      }

    } catch (error) {
      console.error(`Error updating request ${requestId} to ${status}:`, error);
      console.error(`Failed to save action: ${error.message}`);
      return false;
    }
  };


  // --- Sub-View Components (VerificationTable, VerificationQueue, ReviewModal, DetailRow, CounselingScheduleView, OverviewContent, StudentOversight, AnalyticsView unchanged) ---

  const VerificationTable = ({ data, onReview }) => (
    <div className="overflow-x-auto bg-white rounded-xl shadow-inner border border-gray-100">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-blue-50/50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Student</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Activity/Event</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden sm:table-cell">Type</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">Submitted</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {data.length === 0 ? (
            <tr>
              <td colSpan="6" className="px-6 py-12 text-center text-gray-500 italic">
                No pending verification requests found. Time for coffee!
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => onReview(item)}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.studentName || "N/A"}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.activityName || "Activity N/A"}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">{item.type || "Other"}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">{item.dateSubmitted}</td>
                <td className="px-6 py-4 whitespace-nowrap"><StatusPill status={item.status} /></td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={(e) => { e.stopPropagation(); onReview(item); }} className="text-blue-600 hover:text-blue-800 font-semibold transition-colors flex items-center gap-1">
                    <FileText className="w-4 h-4" /> Review
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  const VerificationQueue = () => {
    return (
      <div className="bg-white p-6 rounded-xl shadow-xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Activity Verification Queue</h2>
        <div className="flex justify-between items-center mb-6 p-3 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
          <p className="text-sm font-medium text-gray-700">
            Total Pending Requests: <span className="text-xl font-extrabold text-blue-800">{verificationQueue.length}</span>
          </p>
          <button className="text-sm bg-blue-100 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-200 transition-colors">
            Filter Options
          </button>
        </div>
        
        <VerificationTable data={verificationQueue} onReview={setSelectedRequest} />
      </div>
    );
  };

  const ReviewModal = ({ request, onClose }) => {
    const [comment, setComment] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleAction = async (status) => {
      setIsSaving(true);
      const success = await handleVerificationAction(request.id, status, comment);
      setIsSaving(false);
      if (success) onClose();
    };

    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all duration-300">
          
          {/* Header */}
          <div className="sticky top-0 p-6 border-b border-gray-100 bg-white/95 backdrop-blur-sm z-10 flex justify-between items-center">
            <h3 className="text-2xl font-extrabold text-blue-700 flex items-center gap-2">
              <FileText className="w-6 h-6" /> Review Submission
            </h3>
            <button onClick={onClose} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors">
              <XCircle className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 grid lg:grid-cols-2 gap-8">
            {/* Submission Details */}
            <div className="space-y-4">
              <h4 className="text-xl font-bold text-gray-800 border-b pb-2">Activity Information</h4>
              
              <DetailRow label="Student Name" value={request.studentName || 'N/A'} />
              <DetailRow label="Activity Title" value={request.activityName || 'N/A'} />
              <DetailRow label="Activity Type" value={request.type || 'Other'} />
              <DetailRow label="Submission Date" value={request.dateSubmitted || 'N/A'} />
              <DetailRow label="Student ID" value={request.studentId || 'N/A'} />

              <div className="pt-4">
                <p className="text-sm font-semibold text-gray-600 mb-1">Student Description</p>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100 italic">
                  {request.description || 'No description provided by student.'}
                </p>
              </div>
            </div>

            {/* Proof and Action */}
            <div className="space-y-6">
              <h4 className="text-xl font-bold text-gray-800 border-b pb-2">Submitted Proof</h4>
              
              <div className="aspect-video w-full border border-dashed border-gray-300 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden">
                {request.proofUrl ? (
                  <a href={request.proofUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-2 p-4">
                    <FileText className="w-5 h-5" /> Click to view Document Proof
                  </a>
                ) : (
                  <span className="text-gray-500">No Proof Document Link Provided</span>
                )}
              </div>

              <div className="space-y-3">
                <label htmlFor="adminComment" className="text-sm font-semibold text-gray-600">Admin Comment (Required for Rejection)</label>
                <textarea
                  id="adminComment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Enter feedback or confirmation comment..."
                  rows="4"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                ></textarea>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => handleAction('rejected')}
                  disabled={isSaving || (comment.length < 5)} // Require comment for rejection
                  className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition duration-200 shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSaving ? <Loader className="w-5 h-5 animate-spin" /> : <XCircle className="w-5 h-5" />}
                  Reject
                </button>
                <button
                  onClick={() => handleAction('approved')}
                  disabled={isSaving}
                  className="flex-1 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition duration-200 shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSaving ? <Loader className="w-5 h-5 animate-spin" /> : <CheckSquare className="w-5 h-5" />}
                  Approve
                </button>
              </div>
              <p className="text-xs text-gray-500 text-center mt-2">
                *Approval is immediate. Rejection requires an explanatory comment.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const DetailRow = ({ label, value }) => (
    <div className="flex justify-between items-start border-b border-gray-100 py-1.5">
      <span className="text-sm font-semibold text-gray-600">{label}</span>
      <span className="text-sm text-gray-800 font-medium">{value}</span>
    </div>
  );


  // --- Original Views (Adapted to use real state) ---

  const CounselingScheduleView = () => {
    // State needed for the component structure
    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [slotInterval, setSlotInterval] = useState(30); // in minutes
    const [slots, setSlots] = useState([]);
    const [statusMessage, setStatusMessage] = useState({ type: '', text: '' }); // Keep status message for feedback


    // Generate slots from start to end time (Using the new logic provided by the user)
    const generateSlots = () => {
      setStatusMessage({ type: '', text: '' });
      if (!startTime || !endTime) return setStatusMessage({ type: 'error', text: "Please select both start and end time." });

      const slotsArray = [];
      let [startH, startM] = startTime.split(":").map(Number);
      let [endH, endM] = endTime.split(":").map(Number);

      // Create Date objects using a fixed date (Jan 1, 2000) for time comparison only
      const current = new Date(2000, 0, 1, startH, startM, 0);
      const end = new Date(2000, 0, 1, endH, endM, 0);
      
      if (current.getTime() >= end.getTime()) return setStatusMessage({ type: 'error', text: "Start time must be strictly before end time." });

      let tempCurrent = new Date(current.getTime()); // Start time
      
      while (tempCurrent.getTime() < end.getTime()) {
        let nextTime = new Date(tempCurrent.getTime());
        nextTime.setMinutes(nextTime.getMinutes() + slotInterval);
        
        if (nextTime.getTime() <= end.getTime()) {
            let hh = tempCurrent.getHours().toString().padStart(2, "0");
            let mm = tempCurrent.getMinutes().toString().padStart(2, "0");
            slotsArray.push(`${hh}:${mm}`);
        }
        
        tempCurrent.setMinutes(tempCurrent.getMinutes() + slotInterval);
      }
      
      setSlots(slotsArray);
    
      if (slotsArray.length > 0) {
          setStatusMessage({ type: 'success', text: `Successfully generated ${slotsArray.length} slots.` });
      } else {
          setStatusMessage({ type: 'warning', text: "No slots generated. Check your time range and interval." });
      }
    };
    
    // Adapted saveAvailability using Canvas state (db, userId, appId) and statusMessage
    const saveAvailability = async () => {
      if (!db || !userId) return setStatusMessage({ type: 'error', text: "Authentication error. Please refresh." });
      if (!date || slots.length === 0) return setStatusMessage({ type: 'error', text: "Select date and generate slots before saving." });
      
      setStatusMessage({ type: 'info', text: "Saving availability..." });

      try {
        const docId = `${userId}_${date}`;
        // CRITICAL: Use the secure, private collection path
        await setDoc(doc(db, `artifacts/${appId}/users/${userId}/counseling_availability`, docId), {
          counselorId: userId,
          date,
          slots,
          type: "internal",
          createdAt: new Date().toISOString(),
        });

        setStatusMessage({ type: 'success', text: "Availability saved successfully!" });
        // Clear form after successful save
        setDate("");
        setStartTime("");
        setEndTime("");
        setSlots([]);

      } catch (error) {
        console.error("Error saving availability:", error);
        setStatusMessage({ type: 'error', text: `Failed to save availability: ${error.message}` });
      }
    };

    // Return the new JSX from the user's provided code, adapted to remove the wrapper and footer.
    return (
        <div className="w-full bg-white p-6 rounded-xl shadow-xl border-t-4 border-blue-600">
        <h3 className="text-3xl font-bold text-gray-800 mb-6">Set Counseling Slots</h3>
        <p className="text-gray-600 mb-6">
          Define the time range and interval to automatically generate bookable slots for students.
        </p>

        <div className="space-y-4">
          {/* Date Picker */}
          <input
            type="date"
            value={date}
            min={new Date().toISOString().split('T')[0]} // Prevent past dates
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
          />
          
          {/* Time Range */}
          <div className="w-full flex gap-4">
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="flex-1 p-3 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="flex-1 p-3 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Interval */}
          <div className="w-full flex justify-between items-center bg-blue-50 p-4 rounded-lg border border-blue-200">
            <label className="text-gray-700 font-semibold">Slot Interval (minutes)</label>
            <input
              type="number"
              min="5"
              step="5"
              value={slotInterval}
              onChange={(e) => setSlotInterval(Number(e.target.value))}
              className="w-24 p-2 rounded-lg border border-gray-300 text-right font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        {/* Generate Slots */}
        <button
          onClick={generateSlots}
          className="w-full mt-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition duration-200 shadow-md transform hover:scale-[1.005] active:scale-[0.99]"
        >
          Generate Slots ({slotInterval} min)
        </button>

        {/* Display Slots */}
        {slots.length > 0 && (
          <div className="mt-6 border border-gray-200 rounded-lg p-4 bg-gray-50">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">Generated Slots ({slots.length})</h4>
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-2 max-h-48 overflow-y-auto">
              {slots.map((slot, idx) => (
                <div key={idx} className="bg-white p-2 rounded-lg text-center text-xs font-mono shadow-sm border border-gray-100 hover:bg-blue-50">
                  {slot}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Status Message */}
        {statusMessage.text && (
          <div className={`mt-4 p-3 rounded-lg text-sm font-medium ${
            statusMessage.type === 'error' ? 'bg-red-100 text-red-700' :
            statusMessage.type === 'success' ? 'bg-green-100 text-green-700' :
            'bg-blue-100 text-blue-700'
          }`}>
            {statusMessage.text}
          </div>
        )}

        {/* Save Button */}
        <button
          onClick={saveAvailability}
          disabled={slots.length === 0 || !date || !db || !userId}
          className="w-full mt-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition duration-200 shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed transform hover:scale-[1.005] active:scale-[0.99]"
        >
          <Send className="w-5 h-5 inline mr-2" /> Save Availability for {date || "Selected Date"}
        </button>
      </div>
    );
  };

  const OverviewContent = () => (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockStats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="mt-10 bg-white p-6 rounded-xl shadow-xl border-t-4 border-blue-500">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex justify-between items-center">
          Pending Verification Requests
          <button
            onClick={() => setActiveView("verification")}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors flex items-center gap-1"
          >
            View All ({verificationQueue.length}) &rarr;
          </button>
        </h2>
        <VerificationTable data={verificationQueue.slice(0, 3)} onReview={setSelectedRequest} />
      </div>

      <div className="mt-10 bg-white p-6 rounded-xl shadow-xl">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Skill Score Distribution</h2>
        <div className="h-64 flex justify-center items-center border-2 border-dashed border-gray-200 bg-gray-50 rounded-lg text-gray-500">
          📊 Placeholder for Detailed Analytics Charts
        </div>
      </div>
    </>
  );

  const StudentOversight = () => (
    <div className="bg-white p-8 rounded-xl shadow-xl h-[600px] flex items-center justify-center border-t-4 border-blue-500">
      <h2 className="text-3xl font-bold text-gray-800">Student Management View (Coming Soon)</h2>
    </div>
  );

  const AnalyticsView = () => (
    <div className="bg-white p-8 rounded-xl shadow-xl h-[600px] flex items-center justify-center border-t-4 border-blue-500">
      <h2 className="text-3xl font-bold text-gray-800">Advanced Analytics & Reporting (Coming Soon)</h2>
    </div>
  );

  const renderContent = () => {
    
    switch (activeView) {
      case "verification":
        return <VerificationQueue />;
      case "students":
        return <StudentOversight />;
      case "analytics":
        return <AnalyticsView />;
      case "counseling":
        return <CounselingScheduleView />;
      case "overview":
      default:
        return <OverviewContent />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-blue-600">
        <Loader className="w-8 h-8 animate-spin mr-3" />
        <p className="text-lg font-medium">Connecting to Firebase Services...</p>
      </div>
    );
  }

  // RENDER LOGIN SCREEN if not logged in
  if (!isLoggedIn) {
    return <AdminLoginWithSignup setLoggedIn={setIsLoggedIn} />;
  }
  
  // RENDER DASHBOARD if logged in
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Top Bar */}
      <div className="w-full fixed top-0 left-0 h-16 flex items-center justify-between px-4 lg:px-8 bg-white text-blue-800 shadow-xl z-50 border-b border-gray-100">
        <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-blue-700">
          Admin Verification Portal
        </h1>
        <div className="flex items-center space-x-4">
          <div className="text-sm hidden sm:block">
            <p className="font-semibold text-gray-700">Admin User ID:</p>
            <p className="text-xs text-gray-500 truncate max-w-[150px]">{userId || "N/A"}</p>
          </div>
          <button 
            onClick={() => setIsLoggedIn(false)} // LOGOUT action
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-md"
          >
            Log Out
          </button>
        </div>
      </div>

      <div className="flex pt-16">
        {/* Sidebar */}
        <nav className="w-20 lg:w-64 bg-white p-4 shadow-2xl flex-shrink-0 min-h-screen border-r border-gray-100 transition-width duration-300">
          <div className="space-y-3 mt-4">
            <SidebarItem icon={LayoutDashboard} label="Dashboard Overview" active={activeView === 'overview'} onClick={() => setActiveView('overview')} />
            <SidebarItem icon={CheckSquare} label="Verification Queue" active={activeView === 'verification'} onClick={() => setActiveView('verification')} />
            <SidebarItem icon={Calendar} label="Counseling Schedule" active={activeView === 'counseling'} onClick={() => setActiveView('counseling')} />
            <SidebarItem icon={Users} label="Student Oversight" active={activeView === 'students'} onClick={() => setActiveView('students')} />
            <SidebarItem icon={BarChart2} label="Skill Analytics" active={activeView === 'analytics'} onClick={() => setActiveView('analytics')} />
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-grow p-4 md:p-8">
          <header className="mb-8 p-4 bg-white rounded-xl shadow-md border-l-4 border-blue-600">
            <h1 className="text-3xl font-extrabold text-gray-900">
              {activeView === 'overview' && 'Dashboard Overview'}
              {activeView === 'verification' && 'Document Verification Queue'}
              {activeView === 'students' && 'Student Oversight'}
              {activeView === 'analytics' && 'Skill Analytics'}
              {activeView === 'counseling' && 'Counseling Schedule'}
            </h1>
            <p className="text-gray-500 mt-1">
              {activeView === 'overview' && 'A snapshot of key institutional performance indicators.'}
              {activeView === 'verification' && 'Review and manage all student activity submissions.'}
              {activeView === 'counseling' && 'Set and manage your availability for student counseling sessions.'}
              {(activeView === 'students' || activeView === 'analytics') && 'Future administrative features.'}
            </p>
          </header>

          {renderContent()}
        </main>
      </div>

      {/* Review Modal */}
      {selectedRequest && <ReviewModal request={selectedRequest} onClose={() => setSelectedRequest(null)} />}
    </div>
  );
};

export default App;
