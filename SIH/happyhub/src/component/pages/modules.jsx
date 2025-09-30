import React from "react";
import { useNavigate } from "react-router-dom";

// Example modules with links
const mentalHealthModules = [
  { id: 1, title: "Understanding Mental Health", contentLink: "/modules/understanding-mental-health", preview: "Learn the basics of mental health..." },
  { id: 2, title: "Self-Assessment / Awareness", contentLink: "/modules/self-assessment-awareness", preview: "Assess your mental well-being..." },
  { id: 3, title: "Coping Strategies & Skills", contentLink: "/modules/coping-strategies-skills", preview: "Learn coping mechanisms..." },
  { id: 4, title: "Lifestyle & Wellness", contentLink: "/modules/lifestyle-wellness", preview: "Improve your daily wellness..." },
  { id: 5, title: "Communication & Relationships", contentLink: "/modules/communication-relationships", preview: "Enhance your communication..." },
  { id: 6, title: "Seeking Help & Resources", contentLink: "/modules/seeking-help-resources", preview: "Know where to get help..." },
  { id: 7, title: "Case Studies / Examples", contentLink: "/modules/case-studies-examples", preview: "Explore real-life examples..." },
  { id: 8, title: "Activities / Interactive Exercises", contentLink: "/modules/activities-interactive", preview: "Try interactive exercises..." },
];

const ModuleAccordion = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-12 drop-shadow-md">
          
        </h1>
        <div className="space-y-6">
          {mentalHealthModules.map((module) => (
            <div
              key={module.id}
              onClick={() => navigate(module.contentLink)}
              className="cursor-pointer bg-white rounded-3xl shadow-xl overflow-hidden transition-transform transform hover:scale-105 hover:shadow-2xl"
            >
              {/* Header */}
              <div className="w-full text-left px-8 py-5 bg-gradient-to-r from-purple-400 to-purple-600 text-white font-semibold text-lg flex justify-between items-center hover:from-purple-500 hover:to-purple-700">
                {module.title}
                <span className="text-2xl font-bold">→</span>
              </div>

              {/* Small content preview (10%) */}
              <div className="px-8 py-3 bg-gray-50 dark:bg-gray-50 border-t border-gray-200 text-gray-700 text-sm line-clamp-2">
                {module.preview}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModuleAccordion;
