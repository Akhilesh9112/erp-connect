import React from 'react';
// Only import Link, assuming BrowserRouter is set up in index.js/App.jsx
import { Link } from 'react-router-dom';

// Icon placeholders using inline SVG for quick, clean design
const CheckCircleIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
  </svg>
);
const LightningBoltIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
  </svg>
);
const AcademicCapIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 00-9-9V3a11.952 11.952 0 016.824 2.998 12.078 12.078 0 01.665 6.479L21 12z"></path>
  </svg>
);


export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* 1. HERO SECTION: Value Proposition - Lighter Feel */}
        <header className="py-20 text-center mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight px-4">
            Verify Your Potential. <span className="text-[#2563EB]">Define Your Future.</span>
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            EduConnect is the verified digital portfolio platform that tracks and scores your complete student journey—from classroom excellence to real-world skills.
          </p>
          <div className="mt-10 space-x-4">
            <Link to="/portfolio"> {/* Link to login/signup */}
              <button className="bg-[#1E40AF] hover:bg-[#102C79] text-white px-10 py-3 rounded-xl 
                text-lg font-bold shadow-xl transition-all transform hover:scale-105 ring-4 ring-blue-200 ring-opacity-50">
                Start Your Verified Portfolio
              </button>
            </Link>
            <Link to="/dashboard"> 
              <button className="bg-transparent border-2 border-gray-400 text-gray-700 px-8 py-3 rounded-xl 
                text-lg font-bold shadow-md transition-all transform hover:bg-gray-100 hover:text-gray-900">
                Explore Dashboards
              </button>
            </Link>
          </div>
        </header>

        {/* 2. FEATURES SECTION: Three Pillars - Refined Cards */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">Why EduConnect?</h2>
            <p className="text-gray-500 mt-2">More than just a transcript, it's a dynamic skill sphere.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1: Verified Activities */}
            <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-200 transition-all hover:shadow-xl transform hover:scale-[1.02]">
              <CheckCircleIcon className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Verified E-Portfolio</h3>
              <p className="text-gray-600">
                Instantly sync academic records and get faculty verification for clubs, projects, and hackathons. Every achievement is officially certified.
              </p>
            </div>

            {/* Pillar 2: Skill Scoring */}
            <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-200 transition-all hover:shadow-xl transform hover:scale-[1.02]">
              <LightningBoltIcon className="w-10 h-10 text-green-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Dynamic Skill Scoring</h3>
              <p className="text-gray-600">
                View your performance across key competencies like Academic, Technical, and Entrepreneurship with our clear, actionable Skill-Sphere radar chart.
              </p>
            </div>

            {/* Pillar 3: Career Readiness */}
            <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-200 transition-all hover:shadow-xl transform hover:scale-[1.02]">
              <AcademicCapIcon className="w-10 h-10 text-orange-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Career & Institute Connect</h3>
              <p className="text-gray-600">
                Share a comprehensive, objective view of your profile with top institutes and employers, accelerating placement and higher education opportunities.
              </p>
            </div>
          </div>
        </section>

        {/* 3. MOCK DASHBOARD VISUALIZATION - Premium Showcase */}
        <section className="py-16 bg-white rounded-3xl shadow-2xl my-16 border border-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-8 sm:px-12">
                
                {/* Text Content */}
                <div>
                    <span className="text-sm font-semibold uppercase text-blue-600 tracking-widest">Your True Profile</span>
                    <h2 className="mt-2 text-4xl font-extrabold text-gray-900">
                        The Portfolio Score That Matters
                    </h2>
                    <p className="mt-4 text-gray-600 text-lg">
                        Traditional transcripts only tell part of the story. EduConnect combines your grades, extracurricular roles, projects, and certifications into one unified, credible score. Stop translating your resume—start presenting verified data.
                    </p>
                    <ul className="mt-6 space-y-3 text-gray-700">
                        <li className="flex items-start">
                            <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-1" />
                            <span>Transparent grading based on weighted activities.</span>
                        </li>
                        <li className="flex items-start">
                            <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-1" />
                            <span>Instant updates via our intuitive student dashboard.</span>
                        </li>
                        <li className="flex items-start">
                            <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-1" />
                            <span>Secure access for faculty and verified employers.</span>
                        </li>
                    </ul>
                </div>

                {/* Mock Visualization Card - Cleaner presentation */}
                <div className="relative p-8 bg-gray-100 rounded-xl shadow-inner border border-gray-300">
                    <div className="text-center p-8 bg-white rounded-lg shadow-xl border-b-4 border-blue-600">
                        <p className="text-sm uppercase text-gray-500 font-medium tracking-wide">Verified Overall Score</p>
                        <div className="text-8xl font-black text-[#1E40AF] my-4">88</div>
                        <p className="text-lg text-gray-700 font-semibold">Ready for Advanced Placement</p>
                    </div>

                    <div className="mt-6 flex justify-between space-x-4 text-sm font-medium">
                        <div className="p-3 bg-blue-100 text-blue-800 rounded-lg w-1/3 text-center border border-blue-200 shadow-sm">Academic: 92</div>
                        <div className="p-3 bg-green-100 text-green-800 rounded-lg w-1/3 text-center border border-green-200 shadow-sm">Technical: 85</div>
                        <div className="p-3 bg-orange-100 text-orange-800 rounded-lg w-1/3 text-center border border-orange-200 shadow-sm">Social: 78</div>
                    </div>
                    
                </div>
            </div>
        </section>


        {/* 4. FINAL CTA - Stronger background pull */}
        <section className="text-center py-20 bg-gray-100 rounded-2xl shadow-inner mb-8">
             <h2 className="text-4xl font-bold text-gray-800">Ready to build your verifiable future?</h2>
             <p className="text-xl text-gray-600 mt-4">
                Join thousands of students defining their complete educational narrative.
             </p>
             <Link to="/"> 
                <button className="mt-8 bg-[#1E40AF] hover:bg-[#102C79] text-white px-10 py-4 rounded-xl 
                    text-xl font-bold shadow-2xl transition-all transform hover:scale-105 ring-4 ring-blue-300 ring-opacity-50">
                    Sign Up Now
                </button>
            </Link>
        </section>

      </div>
    </div>
  );
}
