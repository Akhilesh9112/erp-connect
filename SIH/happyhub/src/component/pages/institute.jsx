import React, { useState, useEffect } from "react";
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// --- Icon Components ---
const SvgIcon = ({ d, ...props }) => (<svg {...props} stroke="currentColor" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={d} /></svg>);
const LayoutDashboard = (props) => <SvgIcon {...props} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />;
const UserCircle = (props) => <SvgIcon {...props} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />;
const ClipboardList = (props) => <SvgIcon {...props} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />;
const CheckSquare = (props) => <SvgIcon {...props} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />;
const BarChart = (props) => <SvgIcon {...props} d="M12 20V10m6 10V4m-12 16v-4" />;
const DollarSign = (props) => <SvgIcon {...props} d="M11 11h-1a2 2 0 00-2 2v1a2 2 0 002 2h1v1a2 2 0 002 2h1a2 2 0 002-2v-1a2 2 0 00-2-2h-1v-1a2 2 0 00-2-2zM12 18.213a8.001 8.001 0 01-4.243-1.183M12 5.787a8.001 8.001 0 014.243 1.183" />;
const Library = (props) => <SvgIcon {...props} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11m16-11v11" />;
const Home = (props) => <SvgIcon {...props} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3l1-4a1 1 0 011-1h2a1 1 0 011 1l1 4h3a1 1 0 001-1V10" />;
const Briefcase = (props) => <SvgIcon {...props} d="M10 2a2 2 0 00-2 2v1H6a2 2 0 00-2 2v11a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-2V4a2 2 0 00-2-2h-4zM8 7h8v1H8V7z" />;
const Loader = (props) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={`${props.className} animate-spin`}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const LogoutIcon = (props) => <SvgIcon {...props} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />;
const FileText = (props) => <SvgIcon {...props} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />;
const XCircle = (props) => <SvgIcon {...props} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />;

// --- Global Variable Access & Firebase Initialization ---
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : null;

// --- Mock Data for Prototype ---
const mockFacultyStats = [{ title: "My Classes", value: "4", icon: ClipboardList }, { title: "Total Students", value: "120", icon: UserCircle }, { title: "Pending Verifications", value: "8", icon: CheckSquare }, { title: "Avg. Attendance", value: "85%", icon: BarChart }];
const mockStaffStats = [{ title: "Total Staff", value: "75", icon: UserCircle }, { title: "Fees Collected (Today)", value: "$15,200", icon: DollarSign }, { title: "Library Books Issued", value: "64", icon: Library }, { title: "Hostel Occupancy", value: "92%", icon: Home }];
const mockFacultyProfile = { name: 'Dr. Ramesh Kumar', id: 'F0C5E123', department: 'Computer Science', email: 'faculty@gniot.ac.in', phone: '+91 98765 43210' };
const mockClasses = [{ id: 1, name: 'Data Structures', code: 'CS-301', students: 45 }, { id: 2, name: 'Algorithms', code: 'CS-302', students: 40 }, { id: 3, name: 'Web Development', code: 'IT-401', students: 35 }];
const initialVerificationQueue = [
    { id: 1, student: 'Amit Sharma', document: '12th Marksheet', type: 'Academic Certificate', date: '2025-09-30', documentUrl: '#' },
    { id: 2, student: 'Priya Singh', document: 'NSS Camp Participation', type: 'Co-curricular Activity', date: '2025-09-29', documentUrl: '#' },
    { id: 3, student: 'Rohan Verma', document: 'Hackathon Winner Certificate', type: 'Achievement Certificate', date: '2025-09-28', documentUrl: '#' }
];
const mockFeeTransactions = [{ id: 1, student: 'Rohan Verma', amount: '$1,200', status: 'Paid', date: '2025-09-30' }, { id: 2, student: 'Sunita Patil', amount: '$1,200', status: 'Paid', date: '2025-09-30' }];
const mockHostelRooms = [{ id: 1, room: 'A-101', student: 'Rajesh Kumar', status: 'Occupied' }, { id: 2, room: 'A-102', student: 'N/A', status: 'Vacant' }];

// --- Login Page ---
const LoginPage = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('faculty');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        await new Promise(resolve => setTimeout(resolve, 1000));
        if ((role === 'faculty' && email === 'faculty@gniot.ac.in' && password === 'password') || (role === 'staff' && email === 'staff@gniot.ac.in' && password === 'password')) {
            onLogin(role);
        } else {
            setError('Invalid credentials for selected role.');
        }
        setIsLoading(false);
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl border-t-8 border-blue-600">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900">GNIOT Institute Portal</h1>
                    <p className="text-gray-500 text-sm mt-2">Welcome! Please sign in to your respective portal.</p>
                </div>
                <div className="flex justify-center mb-6 border border-gray-200 rounded-xl p-1 bg-gray-50">
                    <button onClick={() => setRole('faculty')} className={`w-1/2 py-2 rounded-lg text-sm font-semibold transition-colors ${role === 'faculty' ? 'bg-blue-600 text-white shadow' : 'text-gray-600'}`}>Faculty</button>
                    <button onClick={() => setRole('staff')} className={`w-1/2 py-2 rounded-lg text-sm font-semibold transition-colors ${role === 'staff' ? 'bg-blue-600 text-white shadow' : 'text-gray-600'}`}>Staff</button>
                </div>
                <form onSubmit={handleLogin} className="space-y-6">
                    <input type="email" placeholder="Email (e.g., faculty@gniot.ac.in)" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 border rounded-xl focus:ring-blue-500" required />
                    <input type="password" placeholder="Password (e.g., password)" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 border rounded-xl focus:ring-blue-500" required />
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <button type="submit" disabled={isLoading} className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:bg-gray-400 flex justify-center items-center">{isLoading ? <Loader className="w-5 h-5" /> : 'Sign In'}</button>
                </form>
            </div>
        </div>
    );
};

// --- Reusable Layout Components ---
const SidebarItem = ({ icon: Icon, label, active, onClick }) => ( <button onClick={onClick} className={`flex items-center space-x-3 p-3 rounded-xl w-full text-left transition-colors ${active ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg" : "text-gray-600 hover:bg-gray-100"}`}><Icon className="w-5 h-5 flex-shrink-0" /><span className="hidden lg:inline text-sm font-semibold">{label}</span></button> );
const StatCard = ({ title, value, icon: Icon }) => ( <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500"><div className="flex justify-between items-center"><p className="text-sm text-gray-500 uppercase font-medium">{title}</p><Icon className="w-6 h-6 text-blue-500" /></div><p className="text-3xl font-extrabold text-gray-900 mt-2">{value}</p></div> );
const PortalLayout = ({ title, navItems, activeView, setActiveView, onLogout, children }) => {
    const activeNavItem = navItems.find(item => item.id === activeView);
    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <header className="w-full fixed top-0 left-0 h-16 flex items-center justify-between px-8 bg-white shadow-md z-50"><h1 className="text-xl font-extrabold text-blue-700">{title}</h1><button onClick={onLogout} className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-500 transition-colors"><LogoutIcon className="w-5 h-5" /> <span className="hidden sm:inline">Log Out</span></button></header>
            <div className="flex pt-16">
                <nav className="w-20 lg:w-64 bg-white p-4 shadow-r-lg flex-shrink-0 min-h-screen border-r"><div className="space-y-3 mt-4">{navItems.map(item => <SidebarItem key={item.id} {...item} active={activeView === item.id} onClick={() => setActiveView(item.id)} />)}</div></nav>
                <main className="flex-grow p-8">
                    <header className="mb-8 p-4 bg-white rounded-xl shadow-sm border-l-4 border-blue-600"><h2 className="text-3xl font-extrabold text-gray-900">{activeNavItem?.label}</h2></header>
                    {children}
                </main>
            </div>
        </div>
    );
};

// --- Faculty Portal Components ---
const FacultyProfileView = ({ profile }) => ( <div className="bg-white p-8 rounded-xl shadow-lg"><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><strong>Name:</strong> {profile.name}</div><div><strong>Faculty ID:</strong> {profile.id}</div><div><strong>Department:</strong> {profile.department}</div><div><strong>Email:</strong> {profile.email}</div><div><strong>Phone:</strong> {profile.phone}</div></div></div> );
const MyClassesView = ({ classes }) => ( <div className="bg-white p-8 rounded-xl shadow-lg"><table className="w-full"><thead><tr className="text-left border-b"><th className="pb-2">Class Name</th><th>Code</th><th>Students</th></tr></thead><tbody>{classes.map(c => <tr key={c.id} className="border-b"><td className="py-2">{c.name}</td><td>{c.code}</td><td>{c.students}</td></tr>)}</tbody></table></div> );
const VerificationQueueView = ({ queue, onReview }) => ( <div className="bg-white p-8 rounded-xl shadow-lg"><table className="w-full"><thead><tr className="text-left border-b"><th className="p-2">Student</th><th className="p-2">Document/Activity</th><th className="p-2 hidden sm:table-cell">Type</th><th className="p-2 hidden md:table-cell">Date</th><th className="p-2">Action</th></tr></thead><tbody>{queue.map(q => <tr key={q.id} className="border-b hover:bg-gray-50"><td className="p-2 font-medium">{q.student}</td><td className="p-2">{q.document}</td><td className="p-2 hidden sm:table-cell"><span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{q.type}</span></td><td className="p-2 hidden md:table-cell">{q.date}</td><td className="p-2"><button onClick={() => onReview(q)} className="bg-blue-100 text-blue-700 font-semibold px-3 py-1 rounded-lg text-sm hover:bg-blue-200">Review</button></td></tr>)}</tbody></table></div> );
const ReportsView = () => ( <div className="bg-white p-8 rounded-xl shadow-lg">Generate Class or Grade Reports</div> );
const ReviewModal = ({ request, onClose, onAction }) => {
    const [comment, setComment] = useState('');
    if (!request) return null;
    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
                <div className="p-6 border-b flex justify-between items-center"><h3 className="text-2xl font-bold text-gray-800">Review Submission</h3><button onClick={onClose} className="text-gray-400 hover:text-gray-600"><XCircle className="w-6 h-6"/></button></div>
                <div className="p-6 space-y-4">
                    <p><strong>Student:</strong> {request.student}</p>
                    <p><strong>Document/Activity:</strong> {request.document}</p>
                    <p><strong>Type:</strong> {request.type}</p>
                    <a href={request.documentUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 font-semibold hover:underline"><FileText className="w-5 h-5"/> View Document</a>
                    <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add comments (required for rejection)" rows="3" className="w-full p-2 border rounded-lg mt-2"></textarea>
                </div>
                <div className="p-6 bg-gray-50 flex justify-end gap-4 rounded-b-2xl">
                    <button onClick={() => onAction(request.id, 'rejected', comment)} disabled={!comment} className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 disabled:bg-gray-400">Reject</button>
                    <button onClick={() => onAction(request.id, 'approved', comment)} className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600">Approve</button>
                </div>
            </div>
        </div>
    );
};
const FinanceOfficeView = ({ transactions }) => ( <div className="bg-white p-8 rounded-xl shadow-lg"><table className="w-full"><thead><tr className="text-left border-b"><th className="pb-2">Student</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead><tbody>{transactions.map(t => <tr key={t.id} className="border-b"><td className="py-2">{t.student}</td><td>{t.amount}</td><td><span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">{t.status}</span></td><td>{t.date}</td></tr>)}</tbody></table></div> );
const LibraryModuleView = () => ( <div className="bg-white p-8 rounded-xl shadow-lg">Book Issue, Return, and Student History</div> );
const HostelModuleView = ({ rooms }) => ( <div className="bg-white p-8 rounded-xl shadow-lg"><table className="w-full"><thead><tr className="text-left border-b"><th className="pb-2">Room No.</th><th>Student</th><th>Status</th></tr></thead><tbody>{rooms.map(r => <tr key={r.id} className="border-b"><td className="py-2">{r.room}</td><td>{r.student}</td><td><span className={`px-2 py-1 rounded-full text-xs ${r.status === 'Occupied' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{r.status}</span></td></tr>)}</tbody></table></div> );
const AdminOfficeView = () => ( <div className="bg-white p-8 rounded-xl shadow-lg">Manage Student Records</div> );

// --- Faculty Portal ---
const FacultyPortal = ({ onLogout }) => {
    const [activeView, setActiveView] = useState('dashboard');
    const [verificationQueue, setVerificationQueue] = useState(initialVerificationQueue);
    const [selectedRequest, setSelectedRequest] = useState(null);

    const handleVerificationAction = (requestId, status, comment) => {
        console.log(`Action: ${status} on request ${requestId} with comment: "${comment}"`);
        setVerificationQueue(prevQueue => prevQueue.filter(item => item.id !== requestId));
        setSelectedRequest(null);
    };
    
    const navItems = [{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }, { id: 'profile', label: 'My Profile', icon: UserCircle }, { id: 'classes', label: 'My Classes', icon: ClipboardList }, { id: 'verification', label: 'Verification Queue', icon: CheckSquare }, { id: 'reports', label: 'Reports', icon: BarChart }];
    const renderContent = () => {
        switch (activeView) {
            case 'dashboard': return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">{mockFacultyStats.map(stat => <StatCard key={stat.title} {...stat} />)}</div>;
            case 'profile': return <FacultyProfileView profile={mockFacultyProfile} />;
            case 'classes': return <MyClassesView classes={mockClasses} />;
            case 'verification': return <VerificationQueueView queue={verificationQueue} onReview={setSelectedRequest} />;
            case 'reports': return <ReportsView />;
            default: return null;
        }
    };
    return (
        <>
            <PortalLayout title="Faculty Portal" navItems={navItems} activeView={activeView} setActiveView={setActiveView} onLogout={onLogout}>{renderContent()}</PortalLayout>
            <ReviewModal request={selectedRequest} onClose={() => setSelectedRequest(null)} onAction={handleVerificationAction} />
        </>
    );
};

// --- Staff Portal ---
const StaffPortal = ({ onLogout }) => {
    const [activeView, setActiveView] = useState('dashboard');
    const navItems = [{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }, { id: 'finance', label: 'Finance Office', icon: DollarSign }, { id: 'library', label: 'Library Module', icon: Library }, { id: 'hostel', label: 'Hostel Module', icon: Home }, { id: 'admin', label: 'Admin Office', icon: Briefcase }];
    const renderContent = () => {
        switch (activeView) {
            case 'dashboard': return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">{mockStaffStats.map(stat => <StatCard key={stat.title} {...stat} />)}</div>;
            case 'finance': return <FinanceOfficeView transactions={mockFeeTransactions} />;
            case 'library': return <LibraryModuleView />;
            case 'hostel': return <HostelModuleView rooms={mockHostelRooms} />;
            case 'admin': return <AdminOfficeView />;
            default: return null;
        }
    };
    return <PortalLayout title="Staff Portal" navItems={navItems} activeView={activeView} setActiveView={setActiveView} onLogout={onLogout}>{renderContent()}</PortalLayout>;
};

// --- Main App Component ---
const institutedashboard = () => {
    const [userRole, setUserRole] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!firebaseConfig) {
            console.error("Firebase config is missing.");
            setIsLoading(false);
            return;
        }
        try {
            initializeApp(firebaseConfig);
            const auth = getAuth();
            onAuthStateChanged(auth, () => { setIsLoading(false); });
        } catch (error) {
            console.error("Firebase init failed:", error);
            setIsLoading(false);
        }
    }, []);

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center"><Loader className="w-10 h-10 text-blue-600" /></div>;
    }

    if (!userRole) {
        return <LoginPage onLogin={(role) => setUserRole(role)} />;
    }

    if (userRole === 'faculty') {
        return <FacultyPortal onLogout={() => setUserRole(null)} />;
    }

    if (userRole === 'staff') {
        return <StaffPortal onLogout={() => setUserRole(null)} />;
    }

    return null;
};

export default institutedashboard;