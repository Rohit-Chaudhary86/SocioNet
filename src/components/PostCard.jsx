import React, { useState } from "react";
import appwriteService from "../appwrite/conf.js";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

function PostCard({ $id, title, featuredimage, userId }) {
  const [imageError, setImageError] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const userData = useSelector((state) => state.auth.userData);
  
  // Check if current user is the author of this post
  const isAuthor = userData && userData.$id === userId;

  const imageUrl = appwriteService.getFileView(featuredimage);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    try {
      // Delete the post
      await appwriteService.deletePost($id);
      
      // Optional: Delete the associated image file
      try {
        await appwriteService.deleteFile(featuredimage);
      } catch (fileError) {
        console.warn("Could not delete image file:", fileError);
        // Continue even if file deletion fails
      }
      
      toast.success("Post deleted successfully!");
      
      // Refresh the page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post: " + error.message);
      setIsDeleting(false);
    }
  };

  return (
    <div 
      className="w-full bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-800"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/post/${$id}`}>
        <div className="w-full h-48 relative overflow-hidden">
          {imageUrl && !imageError ? (
            <img
              src={imageUrl}
              alt={title}
              className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
              onError={() => {
                console.error("Failed to load image:", featuredimage);
                setImageError(true);
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <span className="text-gray-600">
                <i className="fas fa-image text-3xl"></i>
              </span>
            </div>
          )}
          
          {/* Hover overlay effect */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition-opacity duration-300 flex items-end justify-start p-4 ${isHovered ? 'opacity-100' : ''}`}>
            <span className="text-white text-lg font-medium">View Post →</span>
          </div>

          {/* Premium badge effect */}
          <div className="absolute top-3 right-3">
            <span className="bg-gradient-to-r from-purple-600 to-blue-500 text-white text-xs px-2 py-1 rounded-full font-semibold shadow-lg">
              #badge
            </span>
          </div>
        </div>
        
        <div className="p-5">
          <h2 className="text-xl font-bold text-white mb-2 line-clamp-2">{title}</h2>
          <div className="flex items-center text-gray-400 text-sm mt-3">
            <i className="fas fa-clock mr-1"></i>
            <span>5 min read</span>
          </div>
        </div>
      </Link>
      
      {/* Action buttons at the bottom - Enhanced design */}
      {isAuthor && (
        <div className="px-5 pb-4 pt-3 border-t border-gray-800 flex justify-between">
          <Link
            to={`/edit-post/${$id}`}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white px-4 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/20 transform hover:-translate-y-0.5 text-sm font-medium"
          >
            <i className="fas fa-edit text-xs"></i>
            Edit
          </Link>
          
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-2 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 disabled:from-gray-700 disabled:to-gray-600 text-white px-4 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-red-500/20 transform hover:-translate-y-0.5 disabled:transform-none text-sm font-medium"
          >
            {isDeleting ? (
              <>
                <i className="fas fa-spinner fa-spin text-xs"></i>
                Deleting...
              </>
            ) : (
              <>
                <i className="fas fa-trash text-xs"></i>
                Delete
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default PostCard;