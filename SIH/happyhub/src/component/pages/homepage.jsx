import React, { useState, useEffect } from 'react';

// You can replace this with an actual API call
const fetchStudentData = async (userId) => {
  // --- MOCK API ---
  console.log(`Fetching data for user: ${userId}`);
  return {
    name: 'Priya Sharma',
    studentId: 'CS2025-087',
    isHostelApplied: false,
    hostelDetails: {
      isAllocated: false,
      roomNumber: null,
      dues: 45000,
    },
    collegeFees: [
      { item: 'Tuition Fee', amount: 75000, status: 'Paid' },
      { item: 'Library Fee', amount: 2500, status: 'Due' },
      { item: 'Lab & Development Fee', amount: 5000, status: 'Due' },
      { item: 'Examination Fee', amount: 1500, status: 'Paid' },
    ],
    downloadableDocs: [
      { name: 'Admission Letter', url: '/docs/admission_letter.pdf' },
      { name: 'Fee Structure 2024', url: '/docs/fee_structure_2024.pdf' },
      { name: 'Hostel Rules & Regulations', url: '/docs/hostel_rules.pdf' },
    ],
    academicPerformance: {
      cgpa: '8.75',
      semester: '4th',
      results: [
        { subject: 'Data Structures & Algorithms', grade: 'A+', credits: 4 },
        { subject: 'Operating Systems', grade: 'A', credits: 3 },
        { subject: 'Database Management Systems', grade: 'B+', credits: 3 },
        { subject: 'Software Engineering', grade: 'A', credits: 3 },
      ],
    },
    upcomingEvents: [
      { type: 'Exam', name: 'Mid-Term Examinations', date: 'Oct 15, 2025', time: '09:00 AM' },
      { type: 'Event', name: 'Annual Tech Fest "Innovate"', date: 'Oct 28, 2025', time: '10:00 AM' },
      { type: 'Exam', name: 'Practical Lab Submissions', date: 'Nov 05, 2025', time: 'All Day' },
      { type: 'Event', name: 'Guest Lecture on AI', date: 'Nov 12, 2025', time: '02:00 PM' },
    ],
    libraryInfo: {
      issuedBooks: [
        { bookName: 'Clean Code', author: 'Robert C. Martin', issueDate: 'Sep 10, 2025', returnDate: 'Sep 24, 2025', status: 'Returned' },
        { bookName: 'Introduction to Algorithms', author: 'Thomas H. Cormen', issueDate: 'Sep 25, 2025', returnDate: 'Oct 09, 2025', status: 'Issued' },
        { bookName: 'Operating System Concepts', author: 'A. Silberschatz', issueDate: 'Sep 28, 2025', returnDate: 'Oct 12, 2025', status: 'Issued' }
      ]
    },
    attendance: [
      { subjectName: 'Data Structures & Algorithms', attendedClasses: 38, totalClasses: 40 },
      { subjectName: 'Operating Systems', attendedClasses: 28, totalClasses: 35 },
      { subjectName: 'Database Management Systems', attendedClasses: 22, totalClasses: 30 },
      { subjectName: 'Software Engineering', attendedClasses: 32, totalClasses: 32 },
    ]
  };
};

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isHostelApplied, setIsHostelApplied] = useState(false);

  useEffect(() => {
    const loggedInUserName = 'Priya Sharma';
    const loadData = async () => {
      try {
        const data = await fetchStudentData(loggedInUserName);
        setStudent(data);
        setIsHostelApplied(data.isHostelApplied);
      } catch (error) {
        console.error("Failed to fetch student data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleHostelApply = () => {
    setIsHostelApplied(true);
    setStudent(prevStudent => ({
      ...prevStudent,
      hostelDetails: { ...prevStudent.hostelDetails, isAllocated: true, roomNumber: 'B-104 (Pending Admin Approval)' }
    }));
  };
  
  const handlePayNow = (type) => alert(`Redirecting to payment gateway for ${type} fees... (This is a mock action)`);
  
  const handleDownload = (docName, docUrl) => {
    alert(`Downloading ${docName}... (This is a mock action)`);
    window.open(docUrl, '_blank');
  };

  const handleGeneratePortfolio = () => {
    alert(`Generating your professional portfolio... This may take a moment. (This is a mock action)`);
    // In a real app, this would trigger an API call to a backend service.
    // The backend would gather the student's data (results, attendance, etc.)
    // and generate a PDF or a unique webpage link.
  };

  const totalCollegeDue = student?.collegeFees
    .filter(fee => fee.status === 'Due')
    .reduce((sum, fee) => sum + fee.amount, 0);

  if (isLoading) return <div className="flex items-center justify-center h-screen bg-gray-100">Loading...</div>;
  if (!student) return <div className="text-center text-red-500 mt-10">Failed to load student details.</div>;

  const EventIcon = ({ type }) => { /* ... icon logic from previous step ... */ 
    if (type === 'Exam') {
        return (
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v1.5M12 13.5v5.25M12 21.75a9.75 9.75 0 01-9.75-9.75A9.75 9.75 0 0112 2.25a9.75 9.75 0 019.75 9.75A9.75 9.75 0 0112 21.75z" /></svg>
          </div>
        );
      }
      return (
        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
           <svg className="h-6 w-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M-4.5 12h22.5" /></svg>
        </div>
      );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto mt-20"> 
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Welcome, {student.name}! 👋</h1>
          <p className="text-md text-gray-500">Here's your complete financial, residential, and academic dashboard.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left Column */}
          <div className="md:col-span-1 space-y-8">
            {/* Student Profile Card */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Student Profile</h2>
              <div className="space-y-2 text-gray-600">
                <p><strong>Name:</strong> {student.name}</p>
                <p><strong>Student ID:</strong> {student.studentId}</p>
              </div>
            </div>

            {/* Hostel Allocation Card */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
               {/* ... hostel JSX from previous step ... */}
               <h2 className="text-xl font-semibold text-gray-700 mb-4">Hostel Allocation</h2>
              {isHostelApplied ? (
                <div className="space-y-4">
                  <div><p className="text-sm text-gray-500">Application Status</p><p className="font-semibold text-green-600">Applied Successfully</p></div>
                  <div><p className="text-sm text-gray-500">Allocated Room</p><p className="font-semibold text-gray-800">{student.hostelDetails.roomNumber}</p></div>
                  <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                    <h3 className="font-bold text-blue-800">Hostel Dues</h3>
                    <p className="text-2xl font-bold text-blue-900">₹{student.hostelDetails.dues.toLocaleString('en-IN')}</p>
                    <button onClick={() => handlePayNow('Hostel')} className="mt-3 w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300">Pay Hostel Fees</button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-gray-600 mb-4">You have not applied for a hostel yet.</p>
                  <button onClick={handleHostelApply} className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-300">Apply for Hostel Now</button>
                </div>
              )}
            </div>
            
            {/* Library Issued Books Card */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              {/* ... library JSX from previous step ... */}
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Library Issued Books 📚</h2>
              <div className="space-y-4">
                {student.libraryInfo.issuedBooks.map((book, index) => (
                   <div key={index} className="border-b border-gray-200 pb-3 last:border-b-0">
                      <div className="flex justify-between items-start">
                        <div><p className="font-semibold text-gray-800">{book.bookName}</p><p className="text-sm text-gray-500">by {book.author}</p></div>
                        <span className={`text-xs font-bold uppercase px-2 py-1 rounded-full ${book.status === 'Issued' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'}`}>{book.status}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-2 flex justify-between">
                         <span>Issued: {book.issueDate}</span>
                         {book.status === 'Issued' && <span className="font-medium text-red-600">Due: {book.returnDate}</span>}
                      </div>
                   </div>
                ))}
              </div>
            </div>

            {/* Portfolio Generator Card */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 text-center">
                <h2 className="text-xl font-semibold text-gray-700 mb-2">Create Your Portfolio ✨</h2>
                <p className="text-sm text-gray-500 mb-4">Showcase your academic achievements and skills in a professional, shareable portfolio.</p>
                <button 
                  onClick={handleGeneratePortfolio}
                  className="w-full bg-gray-800 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-300"
                >
                  Generate Portfolio
                </button>
            </div>

          </div>

          {/* Right Column */}
          <div className="md:col-span-2 space-y-8">

             {/* Attendance Overview Card */}
             <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
               {/* ... attendance JSX from previous step ... */}
               <h2 className="text-xl font-semibold text-gray-700 mb-4">Attendance Overview 📊</h2>
              <div className="space-y-4">
                {student.attendance.map((att, index) => {
                  const percentage = Math.round((att.attendedClasses / att.totalClasses) * 100);
                  const isLow = percentage < 75;
                  return (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-1"><span className="text-sm font-medium text-gray-700">{att.subjectName}</span><span className={`text-sm font-bold ${isLow ? 'text-red-600' : 'text-gray-600'}`}>{percentage}% ({att.attendedClasses}/{att.totalClasses})</span></div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5"><div className={`h-2.5 rounded-full ${isLow ? 'bg-red-500' : 'bg-blue-600'}`} style={{ width: `${percentage}%` }}></div></div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Academic Performance Card */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              {/* ... academic JSX from previous step ... */}
              <div className="flex justify-between items-start mb-4">
                <div><h2 className="text-xl font-semibold text-gray-700">Academic Performance</h2><p className="text-sm text-gray-500">Latest Results for {student.academicPerformance.semester} Semester</p></div>
                <div className="text-right"><p className="text-sm text-gray-500">Overall CGPA</p><p className="text-3xl font-bold text-green-600">{student.academicPerformance.cgpa}</p></div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50"><tr><th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Subject</th><th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Grade</th></tr></thead>
                  <tbody className="bg-white divide-y divide-gray-200">{student.academicPerformance.results.map((res, index) => (<tr key={index}><td className="px-4 py-3 text-sm font-medium text-gray-800">{res.subject}</td><td className="px-4 py-3 text-sm text-center font-semibold text-gray-600">{res.grade}</td></tr>))}</tbody>
                </table>
              </div>
            </div>
            
            {/* Upcoming Exams & Events Card */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              {/* ... events JSX from previous step ... */}
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Upcoming Exams & Events</h2>
              <div className="space-y-4">
                {student.upcomingEvents.map((event, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <EventIcon type={event.type} />
                    <div className="flex-grow"><p className="font-semibold text-gray-800">{event.name}</p><p className="text-sm text-gray-500">{event.date} at {event.time}</p></div>
                    <span className={`text-xs font-bold uppercase px-2 py-1 rounded-full ${event.type === 'Exam' ? 'bg-red-50 text-red-700' : 'bg-purple-50 text-purple-700'}`}>{event.type}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* College Fees Card */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              {/* ... fees JSX from previous step ... */}
              <h2 className="text-xl font-semibold text-gray-700 mb-4">College Fee Payments</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fee Item</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th></tr></thead>
                  <tbody className="bg-white divide-y divide-gray-200">{student.collegeFees.map((fee, index) => (<tr key={index}><td className="px-6 py-4 text-sm font-medium text-gray-900">{fee.item}</td><td className="px-6 py-4 text-sm text-gray-500">₹{fee.amount.toLocaleString('en-IN')}</td><td className="px-6 py-4 text-sm"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${fee.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{fee.status}</span></td></tr>))}</tbody>
                </table>
              </div>
              <div className="mt-6 pt-4 border-t-2 border-dashed flex flex-col sm:flex-row justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 sm:mb-0">Total College Fees Due:</h3>
                <div className="text-right"><p className="text-2xl font-bold text-red-600">₹{totalCollegeDue.toLocaleString('en-IN')}</p><button onClick={() => handlePayNow('College')} className="mt-2 bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 transition-colors duration-300">Pay College Fees Now</button></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;