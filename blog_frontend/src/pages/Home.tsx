import Layout from "../components/layout/Layout"
import HeroSection from "@/components/sections/HeroSection";
import FeaturedSection from "@/components/sections/FeaturedSection";
import LatestPostsSection from "@/components/sections/LatestPostsSection";
import { usePosts } from "../features/posts/hooks/usePosts";
import { useEffect, useMemo } from "react";
import type { Post, FeaturedPost, BlogStats } from "../types/section.types";
import type { Post as ApiPost } from "../features/posts/types";

// Helper function to transform API post to section post format
const transformApiPostToSectionPost = (apiPost: ApiPost): Post => ({
    id: parseInt(apiPost.id) || 0, // Convert string to number, fallback to 0
    title: apiPost.title || "Untitled",
    description: (apiPost.content || "").substring(0, 200) + "...", // Create description from content
    image: apiPost.featuredImage || "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop", // Fallback image
    createdAt: apiPost.createdAt ? new Date(apiPost.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0] // Convert to YYYY-MM-DD format
});

// Helper function to transform API post to featured post format
const transformApiPostToFeaturedPost = (apiPost: ApiPost): FeaturedPost => ({
    ...transformApiPostToSectionPost(apiPost),
    category: "Featured", // Default category for now
    readTime: Math.ceil((apiPost.content || "").length / 200) + " min" // Estimate read time based on content length
});

const Home = () => {
    const { posts, loading, error, loadPosts, pagination } = usePosts();

    // Load posts on component mount
    useEffect(() => {
        loadPosts({ page: 1, limit: 10 });
    }, [loadPosts]);

    // Transform API posts to section format
    const transformedPosts = useMemo(() => {
        return posts.map(transformApiPostToSectionPost);
    }, [posts]);

    // Get featured posts (first 3 posts for now)
    const featuredPosts = useMemo(() => {
        return posts.slice(0, 3).map(transformApiPostToFeaturedPost);
    }, [posts]);

    const handleCardClick = (postId: number) => {
        console.log(`Clicked on post ${postId}`);
        // TODO: Navigate to post detail page
    };

    const handleSearch = (query: string) => {
        console.log('Searching for:', query);
        // TODO: Implement search functionality with API
        loadPosts({ page: 1, limit: 10, search: query });
    };

    const blogStats: BlogStats = {
        totalPosts: pagination?.total || 0,
        totalReaders: "15K+", // This should come from analytics API
        categories: 8 // This should come from categories API
    };

    // Show loading state
    if (loading && posts.length === 0) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-lg">Loading posts...</div>
                </div>
            </Layout>
        );
    }

    // Show error state
    if (error) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-lg text-red-600">Error loading posts: {error}</div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="">
                {/* Hero Section */}
                <HeroSection
                    subtitle="Welcome to TechBlog"
                    title="Discover the Latest in Web Development"
                    description="Stay ahead of the curve with cutting-edge tutorials, insights, and best practices from industry experts. Join our community of developers building the future of the web."
                    showSearch={true}
                    onSearch={handleSearch}
                    blogStats={blogStats}
                />

                {/* Featured Posts Section */}
                {featuredPosts.length > 0 && (
                    <FeaturedSection
                        featuredPosts={featuredPosts}
                        onPostClick={handleCardClick}
                    />
                )}

                {/* Latest Posts Section */}
                {transformedPosts.length > 0 && (
                    <LatestPostsSection
                        posts={transformedPosts}
                        onPostClick={handleCardClick}
                    />
                )}

                {/* Show message if no posts */}
                {transformedPosts.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <p className="text-lg text-gray-600">No posts available at the moment.</p>
                    </div>
                )}
            </div>
        </Layout>
    )
}

export default Home