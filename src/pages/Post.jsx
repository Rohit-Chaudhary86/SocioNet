import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import appwriteService from "../appwrite/conf.js";
import { toast } from "react-toastify";
import { FiArrowLeft, FiCalendar, FiUser, FiClock, FiHeart, FiShare2, FiBookmark, FiMessageSquare } from "react-icons/fi";
import { useSelector } from "react-redux";

export default function Post() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    console.log("Post mounted");
    if (slug) {
      appwriteService.getPost(slug).then((postData) => {
        if (postData) {
          console.log("Post data:", postData);
          setPost(postData);
          
          // Fetch related posts
          appwriteService.getPosts().then((posts) => {
            if (posts && posts.documents) {
              const related = posts.documents
                .filter(p => p.$id !== postData.$id)
                .slice(0, 3);
              setRelatedPosts(related);
            }
          });
        } else {
          toast.error("Post not found");
          navigate("/");
        }
        setLoading(false);
      }).catch((error) => {
        console.error("Error fetching post:", error);
        toast.error("Failed to load post");
        setLoading(false);
      });
    } else {
      navigate("/");
    }
    return () => console.log("Post unmounted");
  }, [slug, navigate]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const calculateReadTime = (content) => {
    if (!content) return 3;
    const wordsPerMinute = 200;
    const text = content.replace(/<[^>]*>/g, '');
    const wordCount = text.split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.metaDescription || "Check out this post on NexusBlog",
        url: window.location.href,
      })
      .catch((error) => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-800 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-800 rounded w-1/4 mb-8"></div>
            <div className="h-64 bg-gray-800 rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-800 rounded w-full"></div>
              <div className="h-4 bg-gray-800 rounded w-full"></div>
              <div className="h-4 bg-gray-800 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="container mx-auto p-8 max-w-4xl text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Post not found</h2>
          <button 
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const previewUrl = post.featuredimage
    ? appwriteService.getFileView(post.featuredimage)
    : null;

  const readTime = calculateReadTime(post.content);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Navigation */}
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-400 hover:text-blue-300 transition-colors mb-6"
        >
          <FiArrowLeft className="mr-2" /> Back to all posts
        </button>
      </div>

      {/* Article Container */}
      <div className="container mx-auto px-4 max-w-4xl mb-16">
        {/* Article Header */}
        <div className="bg-gray-800 rounded-xl p-8 mb-8 border border-gray-700 shadow-xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center text-gray-400 mb-6">
            <div className="flex items-center mr-6 mb-3">
              <FiUser className="mr-2" />
              <span>By {post.author || "Unknown Author"}</span>
            </div>
            <div className="flex items-center mr-6 mb-3">
              <FiCalendar className="mr-2" />
              <span>{formatDate(post.$createdAt)}</span>
            </div>
            <div className="flex items-center mb-3">
              <FiClock className="mr-2" />
              <span>{readTime} min read</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 mb-6">
            <button 
              onClick={() => setIsLiked(!isLiked)}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                isLiked ? 'bg-red-900/30 text-red-400' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <FiHeart className={`mr-2 ${isLiked ? 'fill-current' : ''}`} />
              {isLiked ? 'Liked' : 'Like'}
            </button>
            
            <button 
              onClick={handleShare}
              className="flex items-center px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <FiShare2 className="mr-2" />
              Share
            </button>
            
            <button 
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                isBookmarked ? 'bg-blue-900/30 text-blue-400' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <FiBookmark className={`mr-2 ${isBookmarked ? 'fill-current' : ''}`} />
              {isBookmarked ? 'Saved' : 'Save'}
            </button>
          </div>

          {/* Featured Image */}
          {previewUrl && (
            <div className="rounded-xl overflow-hidden mb-8 border border-gray-700 flex justify-center bg-gray-900 p-4">
              <img
                src={previewUrl}
                alt={post.title}
                className="max-w-full h-auto max-h-96 object-contain"
                onError={(e) => {
                  e.target.style.display = "none";
                  console.error("Failed to load image:", post.featuredimage);
                  toast.error("Failed to load image");
                }}
                onLoad={() => console.log("Image loaded successfully:", post.featuredimage)}
              />
            </div>
          )}

          {/* Summary/Excerpt */}
          {post.metaDescription && (
            <div className="bg-blue-900/20 p-6 rounded-lg mb-8 border-l-4 border-blue-500">
              <p className="text-lg font-medium text-blue-200 italic">"{post.metaDescription}"</p>
            </div>
          )}
        </div>

        {/* Article Content */}
        <div className="bg-gray-800 rounded-xl p-8 mb-12 border border-gray-700 shadow-xl">
          <div 
            className="prose prose-lg max-w-none prose-invert prose-headings:text-white prose-p:text-gray-300 prose-strong:text-white prose-em:text-gray-300 prose-a:text-blue-400 prose-blockquote:text-gray-400 prose-ul:text-gray-300 prose-ol:text-gray-300 prose-li:text-gray-300 prose-hr:border-gray-700 prose-pre:bg-gray-900 prose-code:text-gray-300"
            dangerouslySetInnerHTML={{ 
              __html: post.content.replace(
                /<img([^>]*)style="[^"]*"([^>]*)>/gi, 
                '<img$1style="max-width:100%;height:auto;object-fit:contain;"$2>'
              ).replace(
                /<img((?!style=)[^>]*)>/gi,
                '<img style="max-width:100%;height:auto;object-fit:contain;"$1>'
              )
            }}
          />
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700 shadow-xl">
            <h3 className="text-xl font-semibold mb-4 flex items-center text-white">
              <span className="bg-blue-900/30 text-blue-400 p-2 rounded-lg mr-3">
                📌
              </span>
              Topics
            </h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-4 py-2 bg-gray-700 text-gray-300 rounded-full text-sm hover:bg-gray-600 transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Author Bio */}
        <div className="bg-gray-800 rounded-xl p-8 mb-12 border border-gray-700 shadow-xl">
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4">
              {post.author ? post.author.charAt(0).toUpperCase() : "A"}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">{post.author || "Anonymous Author"}</h3>
              <p className="text-gray-400">Writer at NexusBlog</p>
            </div>
          </div>
          <p className="text-gray-300">
            Passionate about sharing knowledge and experiences through writing. 
            {post.author ? ` ${post.author} believes in the power of storytelling to connect people and ideas.` : ""}
          </p>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center text-white">
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2 rounded-lg mr-3">
                📚
              </span>
              Continue Reading
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => {
                const relatedPreviewUrl = relatedPost.featuredimage
                  ? appwriteService.getFileView(relatedPost.featuredimage)
                  : null;
                
                return (
                  <Link 
                    key={relatedPost.$id}
                    to={`/post/${relatedPost.slug}`}
                    className="bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-700"
                  >
                    {relatedPreviewUrl && (
                      <div className="w-full h-40 flex items-center justify-center bg-gray-900 overflow-hidden">
                        <img 
                          src={relatedPreviewUrl} 
                          alt={relatedPost.title}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-white">
                        {relatedPost.title}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {formatDate(relatedPost.$createdAt)}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Comments Section */}
        <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 shadow-xl">
          <h2 className="text-2xl font-bold mb-6 text-white flex items-center">
            <FiMessageSquare className="mr-2 text-blue-400" />
            Discussion (0)
          </h2>
          {authStatus ? (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">Comments feature coming soon!</p>
              <button className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors">
                Notify me when available
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">Sign in to join the conversation</p>
              <Link 
                to="/login"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Newsletter Subscription */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 py-12 border-t border-gray-700">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-2xl font-bold mb-4 text-white">Stay updated with the latest posts</h2>
          <p className="mb-6 max-w-2xl mx-auto text-gray-400">Subscribe to our newsletter and never miss new content from our blog</p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Your email address"
              className="flex-grow px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
            />
            <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}