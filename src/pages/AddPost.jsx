import React from "react";
import { Container, PostForm } from "../components";

function AddPost() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black py-12 px-4">
      <Container>
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full shadow-lg mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Create a New Post
            </h1>
            <p className="text-gray-300 text-xl max-w-2xl mx-auto">
              Share your thoughts, stories, and experiences with the world. Your voice matters.
            </p>
          </div>

          {/* The actual form */}
          <div className="bg-white/10 backdrop-blur-xl shadow-2xl rounded-2xl p-8 border border-white/20">
            <PostForm />
            
            {/* Help Text */}
            <div className="mt-8 p-4 bg-indigo-900/30 rounded-lg border border-indigo-500/30">
              <h3 className="text-white font-semibold mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Pro Tips
              </h3>
              <ul className="text-gray-300 text-sm list-disc pl-5 space-y-1">
                <li>Use a catchy title to attract readers</li>
                <li>Add relevant images to make your post engaging</li>
                <li>Proofread before publishing</li>
                <li>Use tags to help readers find your content</li>
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default AddPost;