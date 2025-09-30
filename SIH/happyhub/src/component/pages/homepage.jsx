// src/pages/StudentDashboard.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// --- Mock Data (can later come from Firestore/ERP) ---
const mockStudentData = {
  verificationStatus: "Verified by Faculty",
  skillScores: {
    academic: 90,
    social: 75,
    entrepreneurship: 45,
    technical: 85,
    communication: 70,
  },
  academicRecords: [
    { id: 1, course: "Data Structures", grade: "A", semester: 3, source: "ERP System" },
    { id: 2, course: "Calculus II", grade: "B+", semester: 3, source: "ERP System" },
  ],
  activityLog: [
    { id: 1, type: "Hackathon", name: "InnovateX 2025", date: "2025-05-15", status: "Verified" },
    { id: 2, type: "Volunteering", name: "Cleanup Drive", date: "2025-08-01", status: "Verified" },
    { id: 3, type: "Club Event", name: "Tech Talk Planning", date: "2025-09-20", status: "Pending" },
  ],
  projects: [
    { id: 1, name: "Smart Attendance System", role: "Team Lead", status: "Verified" },
  ],
};

// --- Tailwind Color Map ---
const colorMap = {
  "bg-blue-500": { bg: "bg-blue-500", text: "text-blue-700", border: "border-l-blue-500", fill: "bg-blue-500" },
  "bg-green-500": { bg: "bg-green-500", text: "text-green-700", border: "border-l-green-500", fill: "bg-green-500" },
  "bg-orange-500": { bg: "bg-orange-500", text: "text-orange-700", border: "border-l-orange-500", fill: "bg-orange-500" },
};

export default function StudentDashboard() {
  const { currentUser, logout } = useAuth();
  const [student, setStudent] = useState({
    name: "Guest",
    email: "Unauthorized Access",
    photoURL: "https://via.placeholder.com/150/6B7280/FFFFFF?text=G",
    id: "GUEST",
    overallScore: 0,
    ...mockStudentData,
  });
  const [activeTab, setActiveTab] = useState("activities");

  // Fetch Google profile picture if available
  useEffect(() => {
    if (currentUser) {
      const { displayName, email, photoURL, uid } = currentUser;

      const scores = mockStudentData.skillScores;
      const calculatedScore = Math.round(
        (scores.academic + scores.social + scores.entrepreneurship) / 3
      );

      setStudent((prev) => ({
        ...prev,
        name: displayName || email.split("@")[0],
        email,
        photoURL:
          photoURL || // Gmail/Google OAuth photo
          `https://via.placeholder.com/150/1E40AF/FFFFFF?text=${(displayName || email)[0].toUpperCase()}`,
        id: uid.substring(0, 8).toUpperCase(),
        overallScore: calculatedScore,
      }));
    }
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      alert("Failed to log out: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* --- Top Navbar --- */}
        <div className="fixed top-0 left-0 right-0 z-10 bg-white border-b shadow-sm">
          <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-xl font-bold text-blue-600">EduConnect</h1>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg font-semibold text-sm transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* --- Profile & Score --- */}
        <div className="bg-white shadow-xl rounded-lg p-6 mb-8 border-t-4 border-blue-600 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-4">
            <img
              src={student.photoURL}
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover border-4 border-white ring-2 ring-blue-600"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{student.name}</h1>
              <p className="text-sm text-gray-500">
                ID: {student.id} | {student.email}
              </p>
              <span className="text-xs font-medium text-blue-600">
                Status: {student.verificationStatus}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <div className="text-center">
              <div className="text-4xl font-extrabold text-blue-700">
                {student.overallScore}
                <span className="text-lg font-normal">/100</span>
              </div>
              <p className="text-sm text-gray-600">Overall Portfolio Score</p>
            </div>
            <Link to="/integrations">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold shadow transition">
                Sync DigiLocker
              </button>
            </Link>
          </div>
        </div>

        {/* --- Skills + Radar Placeholder --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-bold text-gray-700 mb-4">
              Skill Visualization (Radar Chart)
            </h2>
            <div className="flex justify-center items-center h-80 border border-dashed text-gray-500">
              📊 Radar Chart Placeholder
            </div>
          </div>
          <div className="flex flex-col space-y-4">
            <SkillCard title="Academic" score={student.skillScores.academic} colorKey="bg-blue-500" />
            <SkillCard title="Social" score={student.skillScores.social} colorKey="bg-green-500" />
            <SkillCard title="Entrepreneurship" score={student.skillScores.entrepreneurship} colorKey="bg-orange-500" />
          </div>
        </div>

        {/* --- Tabs Section --- */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="border-b flex space-x-8">
            <TabButton name="activities" label="Activity Log" active={activeTab} setActive={setActiveTab} />
            <TabButton name="academic" label="Academic Records" active={activeTab} setActive={setActiveTab} />
            <TabButton name="projects" label="Projects" active={activeTab} setActive={setActiveTab} />
            <TabButton name="submit" label="Submit Activity" active={activeTab} setActive={setActiveTab} isAccent />
          </div>

          <div className="mt-6">
            {activeTab === "activities" && <ActivityLogTable log={student.activityLog} />}
            {activeTab === "academic" && <AcademicRecordsTable records={student.academicRecords} />}
            {activeTab === "projects" && <ProjectsTable projects={student.projects} />}
            {activeTab === "submit" && <SubmissionForm />}
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- Helper Components --- */
const SkillCard = ({ title, score, colorKey }) => {
  const colors = colorMap[colorKey] || colorMap["bg-blue-500"];
  return (
    <div className={`p-4 rounded-lg shadow-sm ${colors.bg} bg-opacity-10 border-l-4 ${colors.border}`}>
      <p className={`${colors.text} text-sm font-medium`}>{title}</p>
      <div className="text-2xl font-bold text-gray-800">{score}/100</div>
      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
        <div className={`${colors.fill} h-2 rounded-full`} style={{ width: `${score}%` }}></div>
      </div>
    </div>
  );
};

const TabButton = ({ name, label, active, setActive, isAccent }) => (
  <button
    onClick={() => setActive(name)}
    className={`py-2 px-1 border-b-2 text-sm ${
      active === name
        ? isAccent
          ? "border-blue-600 text-blue-600 font-semibold"
          : "border-blue-500 text-blue-600 font-semibold"
        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
    }`}
  >
    {label}
  </button>
);

const StatusBadge = ({ status }) => {
  const base = "px-2 py-0.5 text-xs font-semibold rounded-full";
  if (status === "Verified") return <span className={`${base} bg-green-100 text-green-700`}>Verified</span>;
  if (status === "Pending") return <span className={`${base} bg-yellow-100 text-yellow-700`}>Pending</span>;
  return <span className={`${base} bg-gray-100 text-gray-500`}>Draft</span>;
};

const ActivityLogTable = ({ log }) => (
  <table className="min-w-full divide-y divide-gray-200">
    <thead className="bg-gray-50">
      <tr>
        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      {log.map((a) => (
        <tr key={a.id}>
          <td className="px-4 py-2">{a.type}</td>
          <td className="px-4 py-2">{a.name}</td>
          <td className="px-4 py-2">{a.date}</td>
          <td className="px-4 py-2"><StatusBadge status={a.status} /></td>
        </tr>
      ))}
    </tbody>
  </table>
);

const AcademicRecordsTable = ({ records }) => (
  <table className="min-w-full divide-y divide-gray-200">
    <thead className="bg-gray-50">
      <tr>
        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
        <th className="px-4 py-2">Sem</th>
        <th className="px-4 py-2">Grade</th>
        <th className="px-4 py-2">Source</th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      {records.map((r) => (
        <tr key={r.id}>
          <td className="px-4 py-2">{r.course}</td>
          <td className="px-4 py-2">{r.semester}</td>
          <td className="px-4 py-2 text-blue-600 font-semibold">{r.grade}</td>
          <td className="px-4 py-2 text-xs text-gray-400 italic">{r.source}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

const ProjectsTable = ({ projects }) => (
  <table className="min-w-full divide-y divide-gray-200">
    <thead className="bg-gray-50">
      <tr>
        <th className="px-4 py-2">Project</th>
        <th className="px-4 py-2">Role</th>
        <th className="px-4 py-2">Status</th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      {projects.map((p) => (
        <tr key={p.id}>
          <td className="px-4 py-2">{p.name}</td>
          <td className="px-4 py-2">{p.role}</td>
          <td className="px-4 py-2"><StatusBadge status={p.status} /></td>
        </tr>
      ))}
    </tbody>
  </table>
);

const SubmissionForm = () => (
  <div className="p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
    <h3 className="text-lg font-semibold mb-4">Submit New Activity 📝</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input type="text" placeholder="Activity Name" className="border p-2 rounded" />
      <select className="border p-2 rounded">
        <option>Select Faculty Verifier</option>
        <option>Dr. Ananya Singh</option>
        <option>Prof. Rajesh Kumar</option>
      </select>
      <div className="md:col-span-2">
        <input type="file" className="border p-2 rounded w-full" />
      </div>
    </div>
    <button className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
      Submit for Approval
    </button>
  </div>
);
