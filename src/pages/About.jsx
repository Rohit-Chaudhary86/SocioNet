import React, { useState, useEffect } from 'react';
import { Container } from '../components/index.js';

export default function About() {
  const [resumeExists, setResumeExists] = useState(false);
  const resumeFileName = 'Rohit-Resume-new.pdf'; // Your actual file name

  useEffect(() => {
    // Check if resume file exists
    fetch(`/${resumeFileName}`)
      .then(response => {
        setResumeExists(response.status === 200);
      })
      .catch(() => {
        setResumeExists(false);
      });
  }, []);

  const handleDownloadResume = () => {
    if (!resumeExists) {
      alert('Resume file not found. Please make sure the resume file is in the public folder.');
      return;
    }

    const resumeUrl = `${window.location.origin}/${resumeFileName}`;
    const link = document.createElement('a');
    link.href = resumeUrl;
    link.download = 'Rohit_Chaudhary_Resume.pdf'; // This will be the downloaded file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <Container>
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-serif font-bold text-gray-800 mb-4">
            About the Developer
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto"></div>
          <p className="text-gray-600 mt-6 max-w-2xl mx-auto text-lg">
            Crafting digital experiences with passion and precision
          </p>
        </div>

        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden transform hover:shadow-2xl transition-all duration-300">
          <div className="flex flex-col lg:flex-row">
            {/* Image Section */}
            <div className="lg:w-2/5 p-8 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
              <div className="relative">
                <div className="w-64 h-64 mx-auto">
                  <img
                    src="/developer.png"
                    alt="Rohit Chaudhary - Developer"
                    className="w-full h-full object-cover rounded-2xl shadow-2xl border-4 border-white transform hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      document.getElementById('fallback-avatar').style.display = 'flex';
                    }}
                  />
                  <div 
                    id="fallback-avatar"
                    className="w-64 h-64 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl hidden items-center justify-center text-white text-6xl font-bold shadow-2xl"
                  >
                    RC
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-blue-400 rounded-full opacity-20 animate-pulse"></div>
              </div>
            </div>

            {/* Content Section */}
            <div className="lg:w-3/5 p-12">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-3xl font-serif font-bold text-gray-800">
                  Rohit Chaudhary
                  <span className="block text-lg text-blue-600 font-sans font-normal mt-2">
                    Full Stack Developer
                  </span>
                </h2>
                
                {/* Resume Download Button */}
                <button
                  onClick={handleDownloadResume}
                  disabled={!resumeExists}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 flex items-center space-x-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="text-lg">📄</span>
                  <span>
                    {resumeExists ? 'Download Resume' : 'Loading...'}
                  </span>
                  {resumeExists && <span className="group-hover:animate-bounce">⬇️</span>}
                </button>
              </div>

              {!resumeExists && (
                <p className="text-red-500 text-sm mb-4">
                  Resume file not found. Make sure 'Rohit-Resume-new.pdf' is in the public folder.
                </p>
              )}

              <p className="text-gray-700 text-lg leading-relaxed mb-8 italic border-l-4 border-blue-500 pl-6">
                "Passionate about creating innovative web applications that blend 
                cutting-edge technology with elegant design solutions."
              </p>

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📧</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Contact</h3>
                    <p className="text-blue-600">rohitskills86@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📍</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Location</h3>
                    <p className="text-gray-700">India</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🛠️</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Technologies</h3>
                    <p className="text-gray-700">React, Node.js, MongoDB, Appwrite</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Expertise</h3>
                    <p className="text-gray-700">Frontend Development, API Integration</p>
                  </div>
                </div>
              </div>

              {/* Resume Highlights */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200 mb-8">
                <h3 className="text-xl font-serif font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mr-3 flex items-center justify-center text-white text-sm">📋</span>
                  Resume Highlights
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span className="text-gray-700">1.5+ years of learning experience in web development</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span className="text-gray-700">Expertise in React, Node.js, and modern JavaScript</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span className="text-gray-700">Proven track record of successful project devlopment</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span className="text-gray-700">Strong problem-solving and communication skills</span>
                  </div>
                </div>
              </div>

              {/* Project Description */}
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-xl border border-gray-200 mb-8">
                <h3 className="text-xl font-serif font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mr-3 flex items-center justify-center text-white text-sm">🌟</span>
                  About This Project
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  This sophisticated blog platform showcases modern web development excellence, 
                  built with React and powered by Appwrite backend. It features seamless user authentication, 
                  real-time content management, image processing, and a responsive design that delivers 
                  an exceptional user experience across all devices.
                </p>
              </div>

              {/* Social Links */}
              <div className="flex space-x-6">
                {[
                  { icon: '🐱', label: 'GitHub', href: 'https://github.com/Rohit-Chaudhary86', color: 'hover:text-gray-900' },
                  { icon: '💼', label: 'LinkedIn', href: 'https://www.linkedin.com/in/rohit-chaudhary-b95272257/', color: 'hover:text-blue-600' },
                  { icon: '🐦', label: 'Twitter', href:'https://twitter.com/@Rohit8770', color: 'hover:text-blue-400' },
                  { icon: '📝', label: 'Portfolio', href: '#', color: 'hover:text-purple-600' }
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center group transition-all duration-300 transform hover:scale-110"
                  >
                    <span className="text-2xl mb-1 group-hover:animate-bounce">{social.icon}</span>
                    <span className={`text-sm font-medium text-gray-600 ${social.color} transition-colors`}>
                      {social.label}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
          {[
            { number: '20+', label: 'Projects Completed' },
            { number: '1.5+', label: 'Years Of Learning Experience' },
            { number: '100%', label: 'Learning Commitment' },
            { number: '24/7', label: 'Code Enthusiasm' }
          ].map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-md text-center transform hover:scale-105 transition-transform duration-300">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}