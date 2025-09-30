import React, { useState, useEffect } from "react";
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, collection, query, where, onSnapshot, updateDoc } from 'firebase/firestore';

// --- Icon Components ---
const SvgIcon = ({ d, ...props }) => (
  <svg {...props} stroke="currentColor" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={d} />
  </svg>
);
const LayoutDashboard = (props) => <SvgIcon {...props} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />;
const Users = (props) => <SvgIcon {...props} d="M17 20h-4v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2H1m18 0h4v-2a4 4 0 00-4-4h-3M10 9a4 4 0 11-8 0 4 4 0 018 0zM17 11a4 4 0 11-8 0 4 4 0 018 0z" />;
const XCircle = (props) => <SvgIcon {...props} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />;
const Loader = (props) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={`${props.className} animate-spin`}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const FileText = (props) => <SvgIcon {...props} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />;
const CheckSquare = (props) => <SvgIcon {...props} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />;
const GraduationCap = (props) => <SvgIcon {...props} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-4.998 12.078 12.078 0 01.665-6.479L12 14z" />;
const DollarSign = (props) => <SvgIcon {...props} d="M11 11h-1a2 2 0 00-2 2v1a2 2 0 002 2h1v1a2 2 0 002 2h1a2 2 0 002-2v-1a2 2 0 00-2-2h-1v-1a2 2 0 00-2-2zM12 18.213a8.001 8.001 0 01-4.243-1.183M12 5.787a8.001 8.001 0 014.243 1.183" />;
const Settings = (props) => <SvgIcon {...props} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z" />;
const Megaphone = (props) => <SvgIcon {...props} d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-1-5h2v2h-2zm0-8h2v6h-2z" />;

// --- Global Variable Access & Firebase Initialization ---
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : null;
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// --- MOCK DATA FOR PROTOTYPE ---
const mockDashboardStats = [
  { title: "Total Students", value: "2,450", trend: "+4.5%", color: "text-blue-600", bg: "bg-blue-100", icon: Users },
  { title: "Fee Collections", value: "$1.2M", trend: "+8.2%", color: "text-green-600", bg: "bg-green-100", icon: DollarSign },
  { title: "Pending Admissions", value: "48", trend: "Critical", color: "text-red-600", bg: "bg-red-100", icon: CheckSquare },
  { title: "Active Courses", value: "35", trend: "Stable", color: "text-yellow-600", bg: "bg-yellow-100", icon: GraduationCap },
];
const mockFinancialData = [
    {id: 1, studentName: 'Rohan Sharma', invoiceId: 'INV-2025-001', amount: '$1,500', status: 'Paid', dueDate: '2025-09-15'},
    {id: 2, studentName: 'Priya Patel', invoiceId: 'INV-2025-002', amount: '$1,500', status: 'Overdue', dueDate: '2025-09-25'},
    {id: 3, studentName: 'Amit Singh', invoiceId: 'INV-2025-003', amount: '$1,250', status: 'Paid', dueDate: '2025-09-18'},
    {id: 4, studentName: 'Sunita Gupta', invoiceId: 'INV-2025-004', amount: '$1,500', status: 'Pending', dueDate: '2025-10-10'},
];
const mockUsers = [
    {id: 1, name: 'Dr. Anjali Verma', email: 'anjali.v@gniot.ac.in', role: 'Admin', lastLogin: '2025-09-30 10:00 AM'},
    {id: 2, name: 'Prof. Rajesh Kumar', email: 'rajesh.k@gniot.ac.in', role: 'Faculty', lastLogin: '2025-09-30 09:30 AM'},
    {id: 3, name: 'Suresh Mehta', email: 'suresh.m@gniot.ac.in', role: 'Accountant', lastLogin: '2025-09-29 02:15 PM'},
];
const mockCourses = [
    {id: 1, courseName: 'Computer Science & Engineering', courseCode: 'CSE', department: 'Engineering'},
    {id: 2, courseName: 'Information Technology', courseCode: 'IT', department: 'Engineering'},
    {id: 3, courseName: 'Business Administration', courseCode: 'BBA', department: 'Management'},
];
const mockAnnouncements = [
    {id: 1, title: 'Mid-Term Examinations Schedule', date: '2025-09-28', author: 'Admin'},
    {id: 2, title: 'Annual Sports Day "Lakshya 2025"', date: '2025-09-25', author: 'Admin'},
];
const initialVerificationQueue = [
    { id: 'mock1', studentName: 'Aditya Verma', activityName: '12th Marksheet', dateSubmitted: '2025-09-30', status: 'pending' },
    { id: 'mock2', studentName: 'Sneha Reddy', activityName: 'Aadhar Card', dateSubmitted: '2025-09-29', status: 'pending' },
];

// --- Login Page Component ---
const AdminLogin = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('admin@gniot.ac.in');
    const [password, setPassword] = useState('password');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Simulate API call for prototype
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (email === 'admin@gniot.ac.in' && password === 'password') {
            onLoginSuccess();
        } else {
            setError('Invalid credentials. Please try again.');
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl border-t-8 border-blue-600">
                <div className="text-center mb-8">
                    <LayoutDashboard className="w-12 h-12 mx-auto text-blue-600" />
                    <h1 className="text-3xl font-extrabold text-gray-900 mt-4">Institute Admin Portal</h1>
                    <p className="text-gray-500 text-sm">Sign in to continue</p>
                </div>
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500" required />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500" required />
                    </div>
                    {error && (<div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm text-center font-medium">{error}</div>)}
                    <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
                        {isLoading ? <><Loader className="w-5 h-5 mr-3" /> Signing In...</> : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
};


// --- Helper & Reusable Components ---
const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button onClick={onClick} className={`flex items-center space-x-3 p-3 rounded-xl w-full text-left transition-colors duration-200 ${active ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg font-semibold transform scale-[1.01]" : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"}`}>
    <Icon className="w-5 h-5 flex-shrink-0" />
    <span className="hidden lg:inline text-sm">{label}</span>
  </button>
);
const StatCard = ({ title, value, trend, color, bg, icon: Icon }) => (
  <div className="bg-white p-6 rounded-xl shadow-xl border-l-4 border-blue-500 hover:shadow-2xl transition-all duration-300">
    <div className="flex items-center justify-between"><p className="text-sm font-medium text-gray-500 uppercase">{title}</p><Icon className={`w-5 h-5 ${color}`} /></div>
    <div className="flex items-end justify-between mt-2"><h3 className="text-4xl font-extrabold text-gray-900">{value}</h3><span className={`text-xs font-bold ${color} bg-opacity-10 rounded-full px-2 py-0.5 ${bg}`}>{trend}</span></div>
  </div>
);
const StatusPill = ({ status }) => {
    const base = "px-3 py-1 text-xs font-bold rounded-full capitalize";
    if (status === "pending" || status === "New") return <span className={`${base} bg-yellow-100 text-yellow-700`}>{status}</span>;
    if (status === "approved" || status === "Verified" || status === "Paid") return <span className={`${base} bg-green-100 text-green-700`}>{status}</span>;
    if (status === "rejected" || status === "Overdue") return <span className={`${base} bg-red-100 text-red-700`}>{status}</span>;
    return <span className={`${base} bg-gray-100 text-gray-500`}>{status || 'Unknown'}</span>;
};
const DetailRow = ({ label, value }) => (<div className="flex justify-between items-start border-b border-gray-100 py-2"><span className="text-sm font-semibold text-gray-600">{label}</span><span className="text-sm text-gray-800 font-medium text-right">{value}</span></div>);


// --- Prototype Views (Populated with Mock Data) ---
const FinancialManagementView = () => (
    <div className="bg-white p-6 rounded-xl shadow-xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Overall Finance Reports</h2>
        <div className="overflow-x-auto"><table className="min-w-full divide-y divide-gray-200"><thead className="bg-blue-50/50"><tr><th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Student</th><th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Invoice ID</th><th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Amount</th><th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Due Date</th><th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th></tr></thead><tbody className="bg-white divide-y divide-gray-100">{mockFinancialData.map(item=><tr key={item.id}><td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.studentName}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.invoiceId}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.amount}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.dueDate}</td><td className="px-6 py-4 whitespace-nowrap"><StatusPill status={item.status}/></td></tr>)}</tbody></table></div>
    </div>
);
const UserManagementView = () => (
    <div className="bg-white p-6 rounded-xl shadow-xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Manage Users and Roles</h2>
        <div className="overflow-x-auto"><table className="min-w-full divide-y divide-gray-200"><thead className="bg-blue-50/50"><tr><th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">User Name</th><th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Email</th><th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Role</th><th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Last Login</th></tr></thead><tbody className="bg-white divide-y divide-gray-100">{mockUsers.map(user=><tr key={user.id}><td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td><td className="px-6 py-4 whitespace-nowrap"><StatusPill status={user.role}/></td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.lastLogin}</td></tr>)}</tbody></table></div>
    </div>
);
const SystemSettingsView = () => (
    <div className="bg-white p-6 rounded-xl shadow-xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Manage Academic Year and Courses</h2>
        <div className="mb-8"><h3 className="text-lg font-bold text-gray-700">Current Academic Year: 2025-2026</h3></div>
        <div className="overflow-x-auto"><table className="min-w-full divide-y divide-gray-200"><thead className="bg-blue-50/50"><tr><th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Course Name</th><th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Course Code</th><th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Department</th></tr></thead><tbody className="bg-white divide-y divide-gray-100">{mockCourses.map(course=><tr key={course.id}><td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{course.courseName}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{course.courseCode}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.department}</td></tr>)}</tbody></table></div>
    </div>
);
const AnnouncementsView = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-xl">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Published Notices</h2>
            <div className="space-y-4">{mockAnnouncements.map(item=><div key={item.id} className="p-4 border rounded-lg hover:bg-gray-50"><h3 className="font-bold text-gray-800">{item.title}</h3><p className="text-xs text-gray-500">By {item.author} on {item.date}</p></div>)}</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-xl">
             <h2 className="text-2xl font-bold text-gray-800 mb-4">Create New Notice</h2>
             <div className="space-y-4"><input type="text" placeholder="Announcement Title" value={title} onChange={e=>setTitle(e.target.value)} className="w-full p-2 border rounded-lg" /><textarea placeholder="Announcement Content..." value={content} onChange={e=>setContent(e.target.value)} rows="5" className="w-full p-2 border rounded-lg"></textarea><button className="w-full py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">Publish</button></div>
        </div>
    </div>
)};


// --- Views/Pages for each Module ---
const DashboardContent = ({ stats, onNavigate, verificationQueue, onReview }) => (
    <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => <StatCard key={stat.title} {...stat} />)}
        </div>
        <div className="mt-10 bg-white p-6 rounded-xl shadow-xl border-t-4 border-blue-500">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex justify-between items-center">
                Pending Admission Verifications
                <button onClick={() => onNavigate("studentManagement")} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    View All ({verificationQueue.length}) &rarr;
                </button>
            </h2>
            <VerificationTable data={verificationQueue.slice(0, 3)} onReview={onReview} />
        </div>
    </>
);
const StudentManagementView = ({ verificationQueue, onReview }) => (
    <div className="bg-white p-6 rounded-xl shadow-xl">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Manage Admissions & Students</h2>
      <div className="flex justify-between items-center mb-6 p-3 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
        <p className="text-sm font-medium text-gray-700">Total Pending Verifications: <span className="text-xl font-extrabold text-blue-800">{verificationQueue.length}</span></p>
      </div>
      <VerificationTable data={verificationQueue} onReview={onReview} />
    </div>
);

// --- Shared Components for Views ---
const VerificationTable = ({ data, onReview }) => (
    <div className="overflow-x-auto bg-white rounded-xl shadow-inner border border-gray-100">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-blue-50/50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Student</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Document Type</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase hidden md:table-cell">Submitted</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {data.length === 0 ? (
            <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-500 italic">No pending requests found.</td></tr>
          ) : (
            data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => onReview(item)}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.studentName || "N/A"}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.activityName || "Activity N/A"}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">{item.dateSubmitted}</td>
                <td className="px-6 py-4 whitespace-nowrap"><StatusPill status={item.status} /></td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={(e) => { e.stopPropagation(); onReview(item); }} className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"><FileText className="w-4 h-4" /> Review</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
);
const ReviewModal = ({ request, onClose, onAction }) => {
    const [comment, setComment] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const handleAction = async (status) => {
        setIsSaving(true);
        const success = await onAction(request.id, status, comment);
        setIsSaving(false);
        if (success) onClose();
    };
    if (!request) return null;
    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all duration-300">
                <div className="sticky top-0 p-6 border-b bg-white/95 backdrop-blur-sm z-10 flex justify-between items-center"><h3 className="text-2xl font-extrabold text-blue-700 flex items-center gap-2"><FileText className="w-6 h-6" /> Review Submission</h3><button onClick={onClose} className="p-2 rounded-full text-gray-500 hover:bg-gray-100"><XCircle className="w-6 h-6" /></button></div>
                <div className="p-6 grid lg:grid-cols-2 gap-8">
                    <div className="space-y-4"><h4 className="text-xl font-bold text-gray-800 border-b pb-2">Document Information</h4><DetailRow label="Student Name" value={request.studentName || 'N/A'} /><DetailRow label="Document Type" value={request.activityName || 'N/A'} /><DetailRow label="Submission Date" value={request.dateSubmitted || 'N/A'} /><DetailRow label="Student ID" value={request.studentId || 'N/A'} /></div>
                    <div className="space-y-6"><h4 className="text-xl font-bold text-gray-800 border-b pb-2">Submitted Proof</h4><div className="aspect-video w-full border border-dashed border-gray-300 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden">{request.proofUrl?<a href={request.proofUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-2 p-4"><FileText className="w-5 h-5"/> View Document</a>:<span className="text-gray-500">No Document Link</span>}</div><div className="space-y-3"><label htmlFor="adminComment" className="text-sm font-semibold text-gray-600">Admin Comment</label><textarea id="adminComment" value={comment} onChange={(e)=>setComment(e.target.value)} placeholder="Enter feedback or confirmation..." rows="4" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"></textarea></div><div className="flex gap-4 pt-4"><button onClick={()=>handleAction('rejected')} disabled={isSaving || comment.length < 5} className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 disabled:bg-gray-400 flex items-center justify-center gap-2">{isSaving?<Loader className="w-5 h-5"/>:<XCircle className="w-5 h-5"/>} Reject</button><button onClick={()=>handleAction('approved')} disabled={isSaving} className="flex-1 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 disabled:bg-gray-400 flex items-center justify-center gap-2">{isSaving?<Loader className="w-5 h-5"/>:<CheckSquare className="w-5 h-5"/>} Approve</button></div></div>
                </div>
            </div>
        </div>
    );
};


// --- Main Application Component ---
const App = () => {
  const [activeView, setActiveView] = useState("dashboard");
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);
  const [verificationQueue, setVerificationQueue] = useState(initialVerificationQueue);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Firebase Initialization
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

      onAuthStateChanged(authInstance, async (user) => {
        setIsLoading(false);
        if (user) {
          setUserId(user.uid);
        } else {
            // If no user, we might need to sign in for protected data access later
            if (initialAuthToken) {
                signInWithCustomToken(authInstance, initialAuthToken).catch(err => console.error("Token Auth Failed", err));
            } else {
                signInAnonymously(authInstance).catch(err => console.error("Anon Auth Failed", err));
            }
        }
      });
    } catch (error) {
      console.error("Firebase init failed:", error);
      setIsLoading(false);
    }
  }, []);

  // Real-time Data Fetching
  useEffect(() => {
    if (db && userId) {
      const requestsRef = collection(db, `artifacts/${appId}/public/data/verification_requests`);
      const q = query(requestsRef, where("status", "==", "pending"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const requests = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          dateSubmitted: doc.data().dateSubmitted?.seconds ? new Date(doc.data().dateSubmitted.seconds * 1000).toLocaleDateString() : 'N/A'
        }));
        setVerificationQueue(prev => [...initialVerificationQueue.filter(mock => !requests.find(req => req.id === mock.id)), ...requests]);
      }, (error) => {
          console.error("Error fetching queue:", error);
          if (error.code === 'permission-denied') {
              console.error("Firestore Permission Denied: Check security rules.");
          }
      });
      return () => unsubscribe();
    }
  }, [db, userId, appId]);

  // Handle Verification Actions
  const handleVerificationAction = async (requestId, status, comment) => {
    if (!db || !userId || requestId.startsWith('mock')) {
        console.log(`Prototype action '${status}' on mock request '${requestId}'`);
        setSelectedRequest(null);
        setVerificationQueue(prev => prev.filter(item => item.id !== requestId));
        return true;
    };
    try {
      const docRef = doc(db, `artifacts/${appId}/public/data/verification_requests`, requestId);
      await updateDoc(docRef, { status: status, adminId: userId, adminComment: comment, verificationDate: new Date().toISOString() });
      setSelectedRequest(null);
      return true;
    } catch (error) {
      console.error(`Error updating request ${requestId}:`, error);
      return false;
    }
  };
  
  // Navigation items based on the flowchart
  const navItems = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'studentManagement', label: 'Student Management', icon: GraduationCap },
      { id: 'financialManagement', label: 'Financial Management', icon: DollarSign },
      { id: 'userManagement', label: 'User Management', icon: Users },
      { id: 'systemSettings', label: 'System Settings', icon: Settings },
      { id: 'announcements', label: 'Announcements', icon: Megaphone },
  ];

  const renderContent = () => {
    switch (activeView) {
      case "studentManagement": return <StudentManagementView verificationQueue={verificationQueue} onReview={setSelectedRequest} />;
      case "financialManagement": return <FinancialManagementView />;
      case "userManagement": return <UserManagementView />;
      case "systemSettings": return <SystemSettingsView />;
      case "announcements": return <AnnouncementsView />;
      case "dashboard": default: return <DashboardContent stats={mockDashboardStats} onNavigate={setActiveView} verificationQueue={verificationQueue} onReview={setSelectedRequest} />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-blue-600">
        <Loader className="w-8 h-8 mr-3" /> <p>Initializing Admin Portal...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
      return <AdminLogin onLoginSuccess={() => setIsLoggedIn(true)} />;
  }
  
  const activeNavItem = navItems.find(item => item.id === activeView);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="w-full fixed top-0 left-0 h-16 flex items-center justify-between px-4 lg:px-8 bg-white shadow-xl z-50 border-b">
        <h1 className="text-xl md:text-2xl font-extrabold text-blue-700">Admin Portal</h1>
        <button 
          onClick={() => setIsLoggedIn(false)}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-md"
        >
          Log Out
        </button>
      </header>

      <div className="flex pt-16">
        <nav className="w-20 lg:w-64 bg-white p-4 shadow-2xl flex-shrink-0 min-h-screen border-r">
          <div className="space-y-3 mt-4">
            {navItems.map(item => (
                <SidebarItem key={item.id} icon={item.icon} label={item.label} active={activeView === item.id} onClick={() => setActiveView(item.id)} />
            ))}
          </div>
        </nav>

        <main className="flex-grow p-4 md:p-8">
          <header className="mb-8 p-4 bg-white rounded-xl shadow-md border-l-4 border-blue-600">
            <h1 className="text-3xl font-extrabold text-gray-900">{activeNavItem?.label || 'Dashboard'}</h1>
            <p className="text-gray-500 mt-1">Manage all aspects of the {activeNavItem?.label.toLowerCase()} module.</p>
          </header>
          {renderContent()}
        </main>
      </div>

      {selectedRequest && <ReviewModal request={selectedRequest} onClose={() => setSelectedRequest(null)} onAction={handleVerificationAction} />}
    </div>
  );
};

export default App;