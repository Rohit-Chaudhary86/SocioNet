import React, { useEffect, useState } from 'react';
import appwriteService from "../appwrite/conf";
import { Container, PostCard } from '../components/index.js';
import { useSelector } from 'react-redux';
import { Query } from 'appwrite';

function Home() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [currentPage, setCurrentPage] = useState(1);
    const authStatus = useSelector((state) => state.auth.status);
    const postsPerPage = 9;

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = () => {
        setLoading(true);
        appwriteService.getPosts([Query.equal("status", "active")])
            .then((postsResponse) => {
                if (postsResponse && postsResponse.documents) {
                    setPosts(postsResponse.documents);
                }
            })
            .catch((error) => {
                console.error("Error fetching posts:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    // Filter posts based on search term
    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.content && post.content.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Sort posts based on selected option
    const sortedPosts = [...filteredPosts].sort((a, b) => {
        switch(sortBy) {
            case 'newest':
                return new Date(b.$createdAt) - new Date(a.$createdAt);
            case 'oldest':
                return new Date(a.$createdAt) - new Date(b.$createdAt);
            case 'title':
                return a.title.localeCompare(b.title);
            default:
                return 0;
        }
    });

    // Pagination logic
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = sortedPosts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(sortedPosts.length / postsPerPage);

    // Reset to first page when search term changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, sortBy]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <h2 className="text-xl font-semibold text-gray-700">Loading Inspiration...</h2>
                    <p className="text-gray-500">Curating the best content for you</p>
                </div>
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
                <Container>
                    <div className="text-center max-w-2xl mx-auto">
                        <div className="mb-8">
                            <div className="w-24 h-24 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-4xl">📝</span>
                            </div>
                            <h1 className="text-4xl font-serif font-bold text-gray-800 mb-4">
                                {authStatus ? "Your Story Begins Here" : "Welcome to BlogSpace"}
                            </h1>
                            <p className="text-gray-600 text-lg mb-8">
                                {authStatus 
                                    ? "Be the first to share your thoughts and start the conversation."
                                    : "Join our community to discover amazing stories and share your own."
                                }
                            </p>
                            {!authStatus && (
                                <button 
                                    onClick={() => window.location.href = '/signup'}
                                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
                                >
                                    Start Your Journey
                                </button>
                            )}
                        </div>
                    </div>
                </Container>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
            {/* Hero Section - Improved with better contrast */}
            <div className="bg-gradient-to-r from-blue-700 via-purple-700 to-indigo-800 text-white py-20">
                <Container>
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-5xl font-serif font-bold mb-6">
                            Discover Amazing Stories
                        </h1>
                        <p className="text-xl opacity-95 mb-8">
                            Explore a world of ideas, experiences, and inspiration from our creative community
                        </p>
                        
                        {/* Search Bar - Improved contrast */}
                        <div className="relative max-w-2xl mx-auto">
                            <input
                                type="text"
                                placeholder="Search for inspiration..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-6 py-4 rounded-full text-gray-800 focus:outline-none focus:ring-4 focus:ring-white/30 shadow-2xl bg-white/95 border border-gray-200"
                            />
                            <span className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-500">
                                <i className="fas fa-search"></i>
                            </span>
                        </div>
                    </div>
                </Container>
            </div>

            <Container>
                {/* Controls Section */}
                <div className="flex flex-col lg:flex-row justify-between items-center gap-4 my-12">
                    <div className="flex items-center gap-4">
                        <span className="text-gray-700 font-semibold">Sort by:</span>
                        <select 
                            value={sortBy} 
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="title">Title A-Z</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-gray-700">
                            Showing {currentPosts.length} of {filteredPosts.length} posts
                        </span>
                        <button
                            onClick={fetchPosts}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            <i className="fas fa-sync-alt"></i>
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Results Count */}
                {searchTerm && (
                    <div className="text-center mb-8">
                        <p className="text-gray-700 text-lg">
                            Found {filteredPosts.length} result{filteredPosts.length !== 1 ? 's' : ''} for "{searchTerm}"
                        </p>
                    </div>
                )}

                {/* Posts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {currentPosts.map((post) => (
                        <div key={post.$id} className="transform hover:scale-102 transition-transform duration-300">
                            <PostCard {...post} />
                        </div>
                    ))}
                </div>

                {/* No results message */}
                {filteredPosts.length === 0 && searchTerm && (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <i className="fas fa-search text-3xl text-gray-400"></i>
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-700 mb-4">No results found</h3>
                        <p className="text-gray-600">Try different keywords or browse all posts</p>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center gap-2 mb-16">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            Previous
                        </button>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-4 py-2 rounded-lg transition-colors shadow-sm ${
                                    currentPage === page
                                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                                        : 'bg-white border border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                        
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            Next
                        </button>
                    </div>
                )}

                {/* Featured Categories - Removed gray block */}
                <div className="mb-16">
                    <h2 className="text-3xl font-serif font-bold text-center text-gray-800 mb-8">
                        Explore Categories <br />  //This feature will be live in future
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { name: 'Technology', icon: '💻', color: 'from-blue-500 to-blue-600' },
                            { name: 'Design', icon: '🎨', color: 'from-purple-500 to-purple-600' },
                            { name: 'Travel', icon: '✈️', color: 'from-green-500 to-green-600' },
                            { name: 'Food', icon: '🍕', color: 'from-red-500 to-red-600' }
                        ].map((category, index) => (
                            <div
                                key={index}
                                className={`bg-gradient-to-r ${category.color} text-white p-6 rounded-2xl text-center transform hover:scale-105 transition-transform duration-300 cursor-pointer shadow-md`}
                            >
                                <div className="text-3xl mb-3">{category.icon}</div>
                                <h3 className="font-semibold">{category.name}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </div>
    );
}

export default Home;