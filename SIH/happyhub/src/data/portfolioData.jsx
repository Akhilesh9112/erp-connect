// src/data/portfolioData.js
import { faCodeBranch, faShieldHalved, faLightbulb, faCheckCircle, faDumbbell, faBookOpen } from '@fortawesome/free-solid-svg-icons';

// --- Student Profile Info ---
// src/data/portfolioData.js (Updated STUDENT_PROFILE)

export const STUDENT_PROFILE = {
  // ... existing fields ...
  
  // NEW: Login credentials for Firebase fetching
  userName: "priya.sharma@institute.edu", 
  
  // NEW: AI-driven skill analysis
  strongestField: "Cyber Security & Data Analytics",
  skillsSummary: "Priya excels at connecting theoretical concepts to real-world impact, evidenced by deploying an AI project and placing high in a national security competition. Her key strengths lie in Python for Data Manipulation and Vulnerability Assessment.",
  mentorTag: "Top Peer Mentor", // This tag appears on the AI card
};
// --- Project & Achievement Data ---
export const PROJECT_DATA = [
  { 
    id: 1, 
    title: 'AI-Driven Campus Waste Segregator', 
    field: 'iot', 
    fieldTag: 'IoT & Environmental Tech', 
    impact: 'Reduced campus landfill waste by 30% in a 6-month pilot, saving $5k annually.', 
    icon: faCodeBranch 
  },
  { 
    id: 2, 
    title: 'National Hacking Competition', 
    field: 'cyber', 
    fieldTag: 'Cyber Security', 
    impact: '3rd Place nationally among 500+ teams; focused on novel SQL injection prevention.', 
    icon: faShieldHalved 
  },
  { 
    id: 3, 
    title: 'Predicting Semester Dropout Rates', 
    field: 'data', 
    fieldTag: 'Data Science', 
    impact: 'Built an 85% accurate model to identify at-risk students for early intervention.', 
    icon: faLightbulb 
  },
];

// --- Peer Learning Blueprints (Actionable Tips) ---
export const LEARNING_TIPS = [
  {
    id: 101,
    title: "The '3-Pass' Revision Cycle",
    content: "I never reread a chapter more than three times. **Pass 1:** Skim and highlight concepts. **Pass 2:** Create a one-page summary mind-map. **Pass 3:** Solve only previous year's toughest 5 problems related to the topic."
  },
  {
    id: 102,
    title: "Project-First Coding Philosophy",
    content: "For any new language, I skip theory tutorials and start a **small, tangible project** on day one. I learn syntax only as it's needed for the task, which dramatically improves retention and application."
  },
  {
    id: 103,
    title: "The Weekly 'Knowledge Dump'",
    content: "Every Friday, I spend 30 minutes writing down everything I learned that week without notes. If I can't explain it simply, I know I need to review that concept next week."
  }
];

// --- Filter Definitions (Used by FilterMenu Component) ---
export const FILTER_FIELDS = [
  { key: 'all', label: 'Show All Fields' },
  { key: 'iot', label: 'IoT & Environmental Tech' },
  { key: 'cyber', label: 'Cyber Security' },
  { key: 'data', label: 'Data Science' },
];