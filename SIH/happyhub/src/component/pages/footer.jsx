import React from "react";

export default function CalmFooter() {
  return (
    <footer className="w-full bg-[#374151] text-gray-200 py-10 px-6 md:px-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">

        <div>
          <h2 className="text-2xl font-semibold text-white">GradFolio</h2>
          <p className="mt-2 text-gray-400 max-w-sm">
            Helping you find calmness and mental clarity through mindful practices.
          </p>
        </div>

        <ul className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 text-lg">
          <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
          <li><a href="/about" className="hover:text-white transition-colors">About</a></li>
          <li><a href="#" className="hover:text-white transition-colors">Exercises</a></li>
          <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
        </ul>

        <div className="flex gap-4 mt-4 md:mt-0">
          <a href="#" className="hover:text-white">Facebook</a>
          <a href="#" className="hover:text-white">Instagram</a>
          <a href="#" className="hover:text-white">LinkedIn</a>
        </div>

      </div>

      <div className="border-t border-gray-600 mt-8 pt-4 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} MindEase. All rights reserved.
      </div>
    </footer>
  );
}
