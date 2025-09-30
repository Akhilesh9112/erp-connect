import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase"; 
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";

// Define the backend endpoint URL 
const AI_ASSESSMENT_ENDPOINT = "http://localhost:8000/assess-stress"; 

export default function StressAssessmentPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    previousIncident: "",
    healthIssues: "",
    hobbies: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [severity, setSeverity] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [editForm, setEditForm] = useState(false);
  const [showRecommendationModal, setShowRecommendationModal] = useState(false);

  // ... (useEffect and handleChange functions remain the same)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists() && docSnap.data().formSubmitted) {
          const data = docSnap.data();
          setFormData({
            name: data.name || "",
            age: data.age || "",
            previousIncident: data.previousIncident || "",
            healthIssues: data.healthIssues || "",
            hobbies: data.hobbies || "",
          });
          setSeverity(data.severity || null);
          setRecommendation(data.recommendation || null);
          setSubmitted(true);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  // --- FORM SUBMISSION (Focus on Error Reset) ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) return alert("Please log in first");
    if (!formData.name || !formData.age) return alert("Name and Age are required fields.");

    // Add a check to prevent double-submission if 'loading' is true
    if (loading) return; 

    console.log("Attempting form submission to backend..."); // Debugging log

    try {
      setLoading(true);

      // 1. Send form data to the AI backend
      const response = await fetch(AI_ASSESSMENT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      // 2. Receive the AI's calculated result and recommendation
      const aiResult = await response.json();
      const calculatedSeverity = aiResult.severity;
      const rec = aiResult.recommendation;
      
      // Update local state and Firebase
      setSeverity(calculatedSeverity);
      setRecommendation(rec);

      await setDoc(doc(db, "users", user.uid), {
        ...formData,
        formSubmitted: true,
        severity: calculatedSeverity,
        recommendation: rec,
      }, { merge: true });

      setSubmitted(true);
      setEditForm(false);
      setShowRecommendationModal(true);
      alert("Form submitted successfully. AI assessment received! ✅");

    } catch (error) {
      console.error("AI assessment failed (Client Error):", error);
      
      // *** CRITICAL CHANGE: Ensure loading state is reset immediately on ANY failure ***
      setLoading(false); 
      
      alert(`Failed to get AI assessment. Check network/backend. Error: ${error.message}`);
    } finally {
      // Secondary reset, mostly redundant but safe
      setLoading(false); 
    }
  };
  
  // ... (Rendering logic and components remain the same)
  // Ensure the button uses the updated 'loading' state correctly
  /*
    <button
      type="submit"
      disabled={loading} 
      className="..."
    >
      {loading ? 'Analyzing...' : 'Submit Assessment'}
    </button>
  */

  // ... (Return statement and render details remain the same)
  // Copy the rest of the file contents from your last working version here
  // ... (Return statement and render details remain the same)
  return (
    <div className="min-h-screen pt-24 px-4 pb-28 bg-gradient-to-b from-purple-50 via-pink-50 to-yellow-50">
      {user ? (
        <>
          {/* Show the modal if required */}
          {showRecommendationModal && recommendation && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
              <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl text-center">
                <h3 className="text-2xl font-bold mb-4 text-purple-800">
                  Stress Assessment Result ({severity})
                </h3>
                <p className="text-gray-700 mb-6 font-medium leading-relaxed">{recommendation}</p>
                <button
                  onClick={() => setShowRecommendationModal(false)}
                  className="bg-purple-700 text-white px-8 py-2 rounded-xl hover:bg-purple-800 transition font-medium"
                >
                  Proceed to Dashboard
                </button>
              </div>
            </div>
          )}

          {/* Form Display */}
          {(!submitted || editForm) && (
            <div className="bg-white p-6 mt-24 max-w-2xl mx-auto rounded-3xl shadow-xl hover:shadow-2xl transition">
              <h2 className="text-2xl font-semibold mb-6 text-center text-purple-800">
                Stress Assessment Form
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
                <input
                  type="number"
                  name="age"
                  placeholder="Your Age (required)"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
                <textarea
                  name="previousIncident"
                  placeholder="Previous Stressful Incidents (comma separated)"
                  value={formData.previousIncident}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
                <textarea
                  name="healthIssues"
                  placeholder="Health Issues (if any)"
                  value={formData.healthIssues}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
                <input
                  type="text"
                  name="hobbies"
                  placeholder="Your Hobbies / Interests"
                  value={formData.hobbies}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
                <button
                  type="submit"
                  disabled={loading} // Disable button when loading
                  className="w-full bg-purple-700 text-white py-3 rounded-2xl shadow-md hover:bg-purple-800 transition-all font-medium disabled:opacity-50"
                >
                  {loading ? 'Analyzing...' : 'Submit Assessment'}
                </button>
              </form>
            </div>
          )}

          {/* Dashboard after submission */}
          {submitted && !editForm && (
            <div className="p-6 mt-24 max-w-4xl mx-auto space-y-6">
              <h2 className="text-3xl font-bold text-center text-purple-800 mb-8">
                Personalized Dashboard
              </h2>

              <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-md">
                <p className="text-xl font-medium text-gray-700">
                  Current Stress Level: <span className={`font-extrabold text-${severity === 'High' ? 'red-600' : severity === 'Medium' ? 'orange-500' : 'green-600'}`}>{severity || 'N/A'}</span>
                </p>
                <button
                  onClick={() => setEditForm(true)}
                  className="bg-purple-700 text-white py-2 px-6 rounded-xl shadow-md hover:bg-purple-800 transition font-medium text-sm"
                >
                  Re-assess Stress
                </button>
              </div>

              {/* Dashboard Cards with Navigation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                
                {/* CBT Therapy */}
                <div
                  onClick={() => navigate("/cbt-therapy")}
                  className="bg-gradient-to-r from-purple-400 to-purple-600 text-white p-6 rounded-3xl shadow-lg hover:shadow-2xl flex flex-col items-center justify-center h-40 cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
                >
                  <h3 className="text-xl font-semibold mb-2">CBT Therapy</h3>
                  <p className="text-sm text-white/90 text-center">
                    Personalized Cognitive Behavioral Therapy videos.
                  </p>
                </div>

                {/* Psychology Modules */}
                <div
                  onClick={() => navigate("/modules")}
                  className="bg-gradient-to-r from-green-400 to-green-600 text-white p-6 rounded-3xl shadow-lg hover:shadow-2xl flex flex-col items-center justify-center h-40 cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
                >
                  <h3 className="text-xl font-semibold mb-2">Psychology Modules</h3>
                  <p className="text-sm text-white/90 text-center">
                    Explore mental health exercises and modules.
                  </p>
                </div>

                {/* Expert Charts */}
                <div
                  onClick={() => navigate("/expert-charts")}
                  className="bg-gradient-to-r from-blue-400 to-blue-600 text-white p-6 rounded-3xl shadow-lg hover:shadow-2xl flex flex-col items-center justify-center h-40 cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
                >
                  <h3 className="text-xl font-semibold mb-2">Expert Charts</h3>
                  <p className="text-sm text-white/90 text-center">
                    Track your stress and mood patterns with charts.
                  </p>
                </div>

                {/* Games & Videos */}
                <div
                  onClick={() => navigate("/games-videos")}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white p-6 rounded-3xl shadow-lg hover:shadow-2xl flex flex-col items-center justify-center h-40 cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
                >
                  <h3 className="text-xl font-semibold mb-2">Games & Videos</h3>
                  <p className="text-sm text-white/90 text-center">
                    Relax and relieve stress with interactive content.
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        // Not Logged In View
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="bg-white shadow-xl rounded-3xl p-8 max-w-md w-full text-center">
            <h2 className="text-3xl font-bold text-purple-800">Access Restricted</h2>
            <p className="text-purple-600 mt-2">
              Please login to access the Stress Assessment Form
            </p>
            <Link to="/login">
              <button className="mt-6 bg-purple-700 hover:bg-purple-800 text-white px-6 py-2 rounded-lg transition w-full">
                Login / Sign Up
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}