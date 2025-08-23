import React, { useEffect, useState } from "react";
import appwriteService from "../appwrite/conf";
import { Container, PostCard } from "../components";
import { toast } from "react-toastify";
import { FiSearch, FiGrid, FiList, FiClock, FiTrendingUp, FiStar } from "react-icons/fi";

export default function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState("newest"); // 'newest', 'oldest', 'popular'

  useEffect(() => {
    console.log("AllPosts mounted");
    const controller = new AbortController();
    setLoading(true);
    appwriteService
      .getPosts([], { signal: controller.signal })
      .then((response) => {
        if (response) {
          console.log("Posts retrieved (AllPosts):", response);
          setPosts(response.documents);
        } else {
          setError("No posts found");
          toast.error("No posts found");
        }
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        console.error("Error fetching posts:", err);
        setError("Failed to load posts: " + err.message);
        toast.error("Failed to load posts");
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      console.log("AllPosts unmounted");
      controller.abort();
    };
  }, []);

  // Filter posts based on search query
  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (post.metaDescription && post.metaDescription.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  // Sort posts based on selected option
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.$createdAt) - new Date(a.$createdAt);
    } else if (sortBy === "oldest") {
      return new Date(a.$createdAt) - new Date(b.$createdAt);
    } else if (sortBy === "popular") {
      // For demonstration, we'll use a random value as popularity
      return Math.random() - 0.5;
    }
    return 0;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 py-8">
        <Container>
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold text-white mb-6">All Blog Posts</h1>
            <div className="animate-pulse">
              <div className="h-12 bg-gray-800 rounded w-1/3 mx-auto mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div key={item} className="bg-gray-800 rounded-xl p-4 h-80">
                    <div className="h-40 bg-gray-700 rounded-lg mb-4"></div>
                    <div className="h-6 bg-gray-700 rounded mb-3"></div>
                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 py-8">
        <Container>
          <div className="text-center py-12 text-red-400">
            <h1 className="text-3xl font-bold text-white mb-6">All Blog Posts</h1>
            <div className="bg-gray-800 rounded-xl p-8">
              <p className="text-xl mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <Container>
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-white mb-4">All Blog Posts</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Discover all our latest articles, news, and insights on various topics
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-grow max-w-2xl">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search posts by title, description, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 w-full bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}
                >
                  <FiGrid size={18} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg ${viewMode === "list" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}
                >
                  <FiList size={18} />
                </button>
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>
        </div>

        {!sortedPosts.length ? (
          <div className="text-center py-12">
            <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-4">No posts found</h2>
              <p className="text-gray-400 mb-6">
                {searchQuery ? `No results for "${searchQuery}". Try a different search term.` : "No posts available yet."}
              </p>
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")} 
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Clear Search
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-400">
                Showing {sortedPosts.length} of {posts.length} posts
                {searchQuery && ` for "${searchQuery}"`}
              </p>
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")} 
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Clear search
                </button>
              )}
            </div>

            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedPosts.map((post) => (
                  <PostCard
                    key={post.$id}
                    $id={post.$id}
                    title={post.title}
                    featuredimage={post.featuredimage}
                    $createdAt={post.$createdAt}
                    author={post.author}
                    metaDescription={post.metaDescription}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {sortedPosts.map((post) => (
                  <div key={post.$id} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-colors">
                    <div className="flex flex-col md:flex-row gap-6">
                      {post.featuredimage && (
                        <div className="md:w-1/3">
                          <img
                            src={appwriteService.getFileView(post.featuredimage)}
                            alt={post.title}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        </div>
                      )}
                      <div className={post.featuredimage ? "md:w-2/3" : "w-full"}>
                        <h2 className="text-2xl font-bold text-white mb-2 hover:text-blue-400 transition-colors">
                          <a href={`/post/${post.$id}`}>{post.title}</a>
                        </h2>
                        {post.metaDescription && (
                          <p className="text-gray-400 mb-4">{post.metaDescription}</p>
                        )}
                        <div className="flex flex-wrap items-center text-sm text-gray-500 gap-4 mb-4">
                          {post.author && (
                            <span className="flex items-center">
                              <FiUser className="mr-1" /> {post.author}
                            </span>
                          )}
                          {post.$createdAt && (
                            <span className="flex items-center">
                              <FiClock className="mr-1" /> {new Date(post.$createdAt).toLocaleDateString()}
                            </span>
                          )}
                          <span className="flex items-center">
                            <FiTrendingUp className="mr-1" /> {Math.floor(Math.random() * 1000)} views
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <a 
                            href={`/post/${post.$id}`} 
                            className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                          >
                            Read more →
                          </a>
                          <div className="flex items-center text-yellow-400">
                            <FiStar className="fill-current" />
                            <span className="ml-1">{Math.floor(Math.random() * 5) + 1}.0</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Load More Button (for future pagination) */}
            {sortedPosts.length > 9 && (
              <div className="text-center mt-12">
                <button className="px-6 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
                  Load More Posts
                </button>
              </div>
            )}
          </>
        )}
      </Container>

      {/* Newsletter Subscription */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 py-12 mt-16 border-t border-gray-700">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-2xl font-bold mb-4 text-white">Never miss a post</h2>
          <p className="mb-6 max-w-2xl mx-auto text-gray-400">Subscribe to our newsletter and get the latest updates delivered straight to your inbox</p>
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