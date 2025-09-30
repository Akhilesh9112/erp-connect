import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faTrophy, faLaptopCode, faCodeBranch, faShieldHalved, 
    faMicrochip, faChartLine, faRobot, faUserShield, 
    faProjectDiagram, faEnvelope, faGraduationCap, faBookReader, faCheckCircle 
} from '@fortawesome/free-solid-svg-icons';
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

// ⬅️ FIX: Changed path from '/src/firebase' to the correct relative path '../firebase'
import { auth, db } from '../firebase'; 
import '../../index.css'; 


// ==========================================================
// 1. PLACEHOLDER DATA STRUCTURE (Used as initial state and default)
// ==========================================================
// This structure defines what we expect the Firestore document to look like.

const DEFAULT_PROFILE = {
    name: "Loading...",
    major: "N/A",
    motto: "Connecting to the database...",
    userName: "N/A", 
    gpa: "0.0 / 10.0",
    gpaDetails: "No data available.",
    strongestField: "Unknown",
    skillsSummary: "Please log in to load your personalized AI skill summary.",
    mentorTag: "Student",
};

const DEFAULT_DATA = {
    profile: DEFAULT_PROFILE,
    projects: [],
    skills: [],
    tips: [],
};

const FILTER_FIELDS = [
    { key: 'all', label: 'Show All Fields' },
    { key: 'iot', label: 'IoT & Environmental Tech' },
    { key: 'cyber', label: 'Cyber Security' },
    { key: 'data', label: 'Data Science' },
];


// ==========================================================
// 2. PRESENTATIONAL COMPONENTS
// ==========================================================

// --- AI Summary Card (Includes Mentorship Tag) ---
const AiSummaryCard = ({ profile }) => (
    <div className="bg-gradient-to-r from-slate-800 to-blue-900 p-6 rounded-xl shadow-2xl text-white mb-12">
        <div className="flex items-center justify-between mb-4 border-b border-cyan-500 pb-3">
            <h3 className="text-xl font-bold flex items-center">
                <FontAwesomeIcon icon={faRobot} className="mr-3 text-cyan-400" />
                AI Skill Synthesis
            </h3>
            <span className="bg-cyan-400 text-slate-900 px-3 py-1 rounded-full text-sm font-extrabold shadow-lg">
                {profile.mentorTag}
            </span>
        </div>
        
        <p className="text-lg font-semibold mb-2 text-cyan-200">
            Strongest Field: **{profile.strongestField}**
        </p>
        <p className="text-sm italic mb-4 opacity-80">
            {profile.skillsSummary}
        </p>

        {/* Mentorship CTA */}
        <div className="text-center pt-4 border-t border-cyan-500">
            <p className="text-sm font-medium mb-3">
                Weak in this area? Connect with {profile.name} for guidance!
            </p>
            {profile.userName !== 'N/A' && (
                <a 
                    href={`mailto:${profile.userName}`} 
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300 shadow-md inline-flex items-center text-sm uppercase tracking-wider"
                >
                    <FontAwesomeIcon icon={faEnvelope} className="mr-2" /> Request Mentorship
                </a>
            )}
        </div>
    </div>
);

// Filter Menu Component
const FilterMenu = ({ currentFilter, onFilterChange }) => (
    // ... (Filter Menu JSX using FILTER_FIELDS)
    <div className="flex flex-wrap justify-center my-6 md:my-8 border-b pb-4 border-gray-200">
      {FILTER_FIELDS.map((field) => (
        <button
          key={field.key}
          className={`
            px-5 py-2 m-1 rounded-full text-sm font-medium transition-all duration-300 shadow-sm
            ${currentFilter === field.key 
              ? 'bg-indigo-600 text-white shadow-lg transform scale-105' 
              : 'bg-white text-gray-700 hover:bg-gray-200 border border-gray-300'
            }
          `}
          onClick={() => onFilterChange(field.key)}
        >
          {field.label}
        </button>
      ))}
    </div>
);

// Project Item Component
const ProjectItem = ({ project }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1 mb-6 border-l-4 border-indigo-500">
    <div className="flex items-center space-x-3 mb-2">
      <FontAwesomeIcon icon={project.icon || faProjectDiagram} className="text-indigo-600 text-xl" />
      <h4 className="text-xl font-bold text-gray-800">{project.title}</h4>
    </div>
    <p className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full mb-3 shadow-inner">
      Field: {project.fieldTag || 'Unspecified'}
    </p>
    <p className="text-gray-600">
      <strong className="text-gray-800 font-semibold">Impact:</strong> {project.impact || 'No impact summary provided.'}
    </p>
  </div>
);


// ==========================================================
// 3. MAIN COMPONENT (StudentPortfolio)
// ==========================================================

function StudentPortfolio() {
  const [studentData, setStudentData] = useState(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentFilter, setCurrentFilter] = useState('all');


  // --- Step 1: Listen for Auth State Change ---
  useEffect(() => {
    // This listener runs once on mount and every time auth status changes (login/logout)
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      
      // ✅ FIX: Immediately set a personalized name from the auth object
      if (user) {
        const tempName = user.displayName || user.email.split('@')[0] || "Student User";
        setStudentData(prev => ({ 
            ...prev, 
            profile: { 
                ...prev.profile,
                name: tempName,
                userName: user.email,
                motto: "Fetching personalized data...",
            }
        }));
        // Note: loading remains TRUE, triggering Step 2.
      } else {
        // Logged out: Set a clear guest state
        setLoading(false);
        setStudentData({ 
            ...DEFAULT_DATA, 
            profile: { 
                ...DEFAULT_PROFILE,
                name: "Guest Student", // Set a clear Guest name
                motto: "Please log in to view portfolio.",
                skillsSummary: "Authentication required to fetch personalized data."
            }
        });
      }
    });

    return () => unsubscribe();
  }, []);


  // --- Step 2: Fetch Data when a User is Authenticated ---
  useEffect(() => {
    if (currentUser) {
      setLoading(true);
      const userUid = currentUser.uid;
      
      // 🚨 Data is fetched using the user's UID (the most reliable key)
      const fetchStudentPortfolio = async () => {
        try {
          // Document path: 'portfolios' collection, document ID is the user's UID
          const docRef = doc(db, "portfolios", userUid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            // Found data! Update state with fetched fields
            setStudentData(docSnap.data());
          } else {
            console.log("No portfolio found for user:", userUid);
            // Fallback: Use the profile name already set in Step 1, just update the motto/status
            setStudentData(prev => ({
                ...prev,
                profile: { 
                    ...prev.profile,
                    motto: "No data found. Upload your details to Firestore!",
                }
            }));
          }
        } catch (error) {
          console.error("Error fetching Firestore document:", error);
          setStudentData(prev => ({
              ...prev,
              profile: {
                  ...prev.profile,
                  motto: "Error connecting to database.",
              }
          }));
        } finally {
          setLoading(false);
        }
      };

      fetchStudentPortfolio();
    }
  }, [currentUser]);


  // Filter projects based on current filter state
  const filteredProjects = studentData.projects.filter(project => 
    currentFilter === 'all' || project.field === currentFilter
  );

  if (loading) {
      return <div className="text-center p-20 text-xl font-semibold text-blue-700">Loading Portfolio... Please Log In...</div>;
  }
  
  const { profile, projects, skills, tips } = studentData;
  
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-slate-900 text-white py-24 px-10 shadow-xl">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 border-4 border-blue-400 shadow-inner">
            {/* [Placeholder for Profile Image] */}
          </div>
          <h1 className="text-4xl font-extrabold mb-1 tracking-tight">{profile.name}</h1>
          <p className="text-lg font-medium opacity-80">{profile.major}</p>
          <p className="italic text-sm mt-2 opacity-60">"{profile.motto}"</p>
          
          <p className="text-xs mt-3 bg-blue-600 inline-block px-3 py-1 rounded-full font-semibold tracking-wide">
             Contact (Firebase Key): <strong>{profile.userName}</strong>
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* AI SUMMARY SECTION */}
        <AiSummaryCard profile={profile} />

        {/* --- SECTION 1: CORE SKILL METRICS & ACADEMIC PERFORMANCE --- */}
        <section className="mb-12 bg-white p-6 rounded-xl shadow-lg" id="skill-metrics">
          <h2 className="text-2xl font-bold text-indigo-700 border-b-2 border-indigo-200 pb-3 mb-6">
            <FontAwesomeIcon icon={faTrophy} className="mr-3 text-indigo-500" /> Core Skill Metrics & Performance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg text-center border border-gray-200">
              <h3 className="text-md font-semibold text-gray-600 uppercase tracking-wider">Overall GPA</h3>
              <p className="text-4xl font-extrabold text-green-600 mt-2">{profile.gpa}</p>
              <p className="text-sm text-gray-500 mt-1">{profile.gpaDetails}</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg text-center border border-gray-200">
                <h3 className="text-md font-semibold text-gray-600 uppercase tracking-wider">Certifications Earned</h3>
                <p className="text-4xl font-extrabold text-red-600 mt-2">{profile.certCount || '0'}</p>
                <p className="text-sm text-gray-500 mt-1">AWS/Azure/Security.</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg text-center border border-gray-200">
                <h3 className="text-md font-semibold text-gray-600 uppercase tracking-wider">Project Success Rate</h3>
                <p className="text-4xl font-extrabold text-indigo-600 mt-2">95%</p>
                <p className="text-sm text-gray-500 mt-1">Completed projects vs. initiated.</p>
            </div>
          </div>
        </section>

        <hr className="my-10 border-gray-300" />
        
        {/* --- SECTION 2: TECHNICAL SKILL BADGES --- */}
        <section className="mb-12" id="skill-badges">
            <h2 className="text-2xl font-bold text-indigo-700 border-b-2 border-indigo-200 pb-3 mb-6">
                <FontAwesomeIcon icon={faLaptopCode} className="mr-3 text-indigo-500" /> Technical Competencies
            </h2>
            <div className="flex flex-wrap gap-3">
                {skills.length > 0 ? (
                    skills.map(skill => (
                        <div 
                            key={skill.name}
                            className="bg-white px-4 py-2 rounded-full shadow-md border border-teal-300 flex items-center space-x-2 transition hover:bg-teal-50"
                        >
                            <FontAwesomeIcon icon={skill.icon || faLaptopCode} className="text-teal-600 text-sm" />
                            <div>
                                <p className="font-semibold text-gray-800 text-sm">{skill.name}</p>
                                <p className="text-xs text-gray-500">{skill.proficiency}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 italic">No skills defined in the database yet.</p>
                )}
            </div>
        </section>

        <hr className="my-10 border-gray-300" />

        {/* --- SECTION 3: PROFESSIONAL PROJECTS (SHOWCASE) --- */}
        <section className="mb-12" id="projects">
          <h2 className="text-2xl font-bold text-indigo-700 border-b-2 border-indigo-200 pb-3 mb-6">
            <FontAwesomeIcon icon={faProjectDiagram} className="mr-3 text-indigo-500" /> Professional Project Showcase
          </h2>
          
          <FilterMenu currentFilter={currentFilter} onFilterChange={setCurrentFilter} />
          
          <div className="transition-all duration-500">
            {filteredProjects.length > 0 ? (
                filteredProjects.map(project => (
                    <ProjectItem key={project.id} project={project} />
                ))
            ) : (
                <p className="text-center text-gray-500 italic mt-8">No projects found for the selected field or filter.</p>
            )}
          </div>
        </section>
        
        <hr className="my-10 border-gray-300" />
        
        {/* --- SECTION 4: PEER LEARNING BLUEPRINT --- */}
        <section className="mb-12" id="learning-methods">
          <h2 className="text-2xl font-bold text-indigo-700 border-b-2 border-indigo-200 pb-3 mb-6">
            <FontAwesomeIcon icon={faBookReader} className="mr-3 text-indigo-500" /> Peer Learning Blueprint (How I Did It)
          </h2>
          <p className="bg-blue-50 p-4 rounded-lg text-blue-800 mb-6 font-medium border border-blue-200">
            Use these specific techniques to improve in your studies!
          </p>

          {tips.length > 0 ? (
            tips.map(tip => (
                <div key={tip.id} className="bg-white p-6 rounded-xl shadow-md mb-6 border-l-4 border-teal-400">
                <h4 className="text-xl font-semibold text-teal-600 mb-2">
                    <FontAwesomeIcon icon={faCheckCircle} className="mr-2" /> {tip.title}
                </h4>
                <p className="text-gray-600" dangerouslySetInnerHTML={{ __html: tip.content }} />
                </div>
            ))
          ) : (
            <p className="text-gray-500 italic">No learning tips have been added to this profile yet.</p>
          )}
          
        </section>
      </main>

      <footer className="bg-slate-900 text-white p-6 text-center text-sm">
        <p>&copy; 2025 [Institute Name] | Designed for Peer Learning and Professional Development</p>
      </footer>
    </div>
  );
}

export default StudentPortfolio;
