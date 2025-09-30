import React from 'react';

// --- Icon Components ---
const SvgIcon = ({ d, ...props }) => (<svg {...props} stroke="currentColor" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={d} /></svg>);
const SparklesIcon = (props) => <SvgIcon {...props} d="M5 3v4M3 5h4M6 17v4m-2-2h4m11-13l-1-1m-2 2l-1-1m5 5l1 1m-2-2l1 1M6 21a9 9 0 019-9" />;
const AcademicCapIcon = (props) => <SvgIcon {...props} d="M9 12l2 14-2-14m0 0l-2 14 2-14zm10-4a9 9 0 11-18 0 9 9 0 0118 0z" />;

const AboutPage = () => {
    return (
        <div className="bg-white font-sans">
            {/* This pt-24 assumes a navbar of h-20 or similar. Adjust if needed. */}
            <main className="pt-24">

                {/* --- 1. Hero Section --- */}
                <section className="py-20 bg-gray-50 text-center">
                    <div className="max-w-4xl mx-auto px-4">
                        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
                            A Legacy of Excellence, <span className="text-blue-600">A Future of Innovation</span>
                        </h1>
                        <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
                            For over two decades, GNIOT has been a beacon of higher education in Noida. Today, we're pioneering the future with ERP-CONNECT, our integrated digital ecosystem designed for student success.
                        </p>
                    </div>
                </section>

                {/* --- 2. Institute Achievements --- */}
                <section className="py-20 px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold text-gray-800">Our Commitment to Quality</h2>
                            <p className="text-gray-500 mt-2">Recognized for our dedication to academic and professional excellence.</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            <AchievementStat value="A+" label="NAAC Grade" />
                            <AchievementStat value="Top 100" label="NIRF Ranking (Engg.)" />
                            <AchievementStat value="95%" label="Placement Rate" />
                            <AchievementStat value="20k+" label="Strong Alumni Network" />
                        </div>
                    </div>
                </section>

                {/* --- 3. About ERP-CONNECT Section --- */}
                <section className="py-20 px-4 bg-gray-50">
                    <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="text-sm font-semibold uppercase text-blue-600 tracking-widest">The Digital Backbone</span>
                            <h2 className="mt-2 text-4xl font-extrabold text-gray-900">Our Solution: ERP-CONNECT</h2>
                            <p className="mt-4 text-gray-600 text-lg">
                                ERP-CONNECT is our custom-built, low-cost integrated system that centralizes all student data. It provides a single source of truth, from admission to graduation and beyond, empowering our students and staff.
                            </p>
                            <ul className="mt-6 space-y-4">
                                <FeatureListItem icon={<AcademicCapIcon className="w-6 h-6 text-green-500" />} title="Verified Digital Portfolio" description="A lifelong, faculty-verified record of every academic and co-curricular achievement." />
                                <FeatureListItem icon={<SparklesIcon className="w-6 h-6 text-green-500" />} title="AI-Powered Career Guidance" description="Personalized career path recommendations based on a student's unique, verified skill set." />
                            </ul>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-lg border">
                           <img src="https://placehold.co/600x400/E0E7FF/4F46E5?text=ERP-CONNECT+Dashboard" alt="ERP-CONNECT Dashboard" className="rounded-lg shadow-md" />
                           <p className="text-center mt-4 text-gray-600 font-medium">Real-time dashboards provide instant insights for faculty and administrators.</p>
                        </div>
                    </div>
                </section>
                
                {/* --- 4. Campus Gallery --- */}
                <section className="py-20 px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold text-gray-800">Explore Our Campus</h2>
                             <p className="text-gray-500 mt-2">State-of-the-art facilities for a world-class learning experience.</p>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <GalleryImage src="https://placehold.co/400x300/DBEAFE/1E3A8A?text=Main+Campus" alt="Main Campus" />
                            <GalleryImage src="https://placehold.co/400x300/D1FAE5/064E3B?text=Modern+Labs" alt="Modern Labs" />
                            <GalleryImage src="https://placehold.co/400x300/FEF3C7/92400E?text=Library" alt="Library" />
                            <GalleryImage src="https://placehold.co/400x300/FCE7F3/86198F?text=Hostel" alt="Hostel" />
                        </div>
                    </div>
                </section>
                
                {/* --- 5. Notable Alumni --- */}
                <section className="py-20 px-4 bg-gray-50">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold text-gray-800">Our Proud Alumni</h2>
                            <p className="text-gray-500 mt-2">Carrying the GNIOT legacy forward in leading global organizations.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <AlumniCard
                                name="Rohan Sharma"
                                role="Software Engineer, Google"
                                testimonial="GNIOT's focus on practical skills was instrumental in my career. The new ERP system will only make that advantage stronger for current students."
                                imgSrc="https://placehold.co/100x100/E0E7FF/4338CA"
                            />
                            <AlumniCard
                                name="Priya Patel"
                                role="Product Manager, Microsoft"
                                testimonial="The foundation I built here prepared me for the challenges of the tech industry. It's exciting to see the institute continue to innovate."
                                imgSrc="https://placehold.co/100x100/D1FAE5/047857"
                            />
                            <AlumniCard
                                name="Amit Singh"
                                role="Founder, TechStartup Inc."
                                testimonial="The entrepreneurial spirit at GNIOT is unmatched. The tools and support available to students are better than ever."
                                imgSrc="https://placehold.co/100x100/FEF3C7/B45309"
                            />
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

// --- Helper Components ---
const AchievementStat = ({ value, label }) => (
    <div className="bg-gray-100 p-6 rounded-xl border border-gray-200">
        <p className="text-4xl font-extrabold text-blue-600">{value}</p>
        <p className="text-sm font-medium text-gray-600 mt-1">{label}</p>
    </div>
);

const FeatureListItem = ({ icon, title, description }) => (
    <div className="flex items-start">
        <div className="flex-shrink-0">{icon}</div>
        <div className="ml-4">
            <h4 className="text-lg font-bold text-gray-800">{title}</h4>
            <p className="text-gray-600">{description}</p>
        </div>
    </div>
);

const GalleryImage = ({ src, alt }) => (
    <div className="overflow-hidden rounded-lg shadow-md">
        <img src={src} alt={alt} className="w-full h-full object-cover transform transition-transform hover:scale-105" />
    </div>
);

const AlumniCard = ({ name, role, testimonial, imgSrc }) => (
    <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center text-center transform transition-transform hover:scale-105">
        <img src={imgSrc} alt={name} className="w-24 h-24 rounded-full mb-4 border-4 border-blue-200" />
        <h4 className="font-bold text-xl text-gray-800">{name}</h4>
        <p className="text-blue-600 font-semibold text-sm">{role}</p>
        <p className="text-gray-500 italic mt-4">"{testimonial}"</p>
    </div>
);

export default AboutPage;