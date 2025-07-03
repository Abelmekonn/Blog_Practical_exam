import Layout from "../components/layout/Layout"
import HeroSection from "@/components/sections/HeroSection";
import FeaturedSection from "@/components/sections/FeaturedSection";
import LatestPostsSection from "@/components/sections/LatestPostsSection";
import { usePosts } from "../features/posts/hooks/usePosts";
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { Post, FeaturedPost, BlogStats } from "../types/section.types";
import type { Post as ApiPost } from "../features/posts/types";

// Helper function to transform API post to section post format
const transformApiPostToSectionPost = (apiPost: ApiPost): Post | null => {
    // Guard clause - skip posts without valid IDs
    if (!apiPost.id) {
        console.warn("Skipping post without ID:", apiPost);
        return null;
    }
    
    // Ensure all required fields are strings
    const title = (apiPost.title || "Untitled") as string;
    const description = (apiPost.content ? 
        (apiPost.content.length > 150 ? apiPost.content.substring(0, 150) + "..." : apiPost.content) 
        : "No description available") as string;
    const image = (apiPost.imageUrl || "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop") as string;
    const createdDay = (apiPost.createdAt ? 
        new Date(apiPost.createdAt).toISOString().split('T')[0] 
        : new Date().toISOString().split('T')[0]) as string;
    
    return {
        id: apiPost.id!, // Now TypeScript knows this is definitely a string
        title: title,
        description: description,
        image: image,
        createdDay: createdDay
    };
};

// Helper function to transform API post to featured post format
const transformApiPostToFeaturedPost = (apiPost: ApiPost): FeaturedPost | null => {
    const basePost = transformApiPostToSectionPost(apiPost);
    if (!basePost) return null;
    
    const readTime = Math.ceil((apiPost.content || "").length / 200) + " min";
    
    return {
        ...basePost,
        category: "Featured",
        readTime: readTime
    };
};

const Home = () => {
    const { posts, loading, error, loadPosts, pagination } = usePosts();
    const navigate = useNavigate();
    
    // Load posts on component mount
    useEffect(() => {
        loadPosts({ page: 1, limit: 10 });
    }, [loadPosts]);

    // Transform API posts to section format
    const transformedPosts = useMemo(() => {
        const transformed = (posts || [])
            .map(transformApiPostToSectionPost)
            .filter((post): post is Post => post !== null);
        return transformed;
    }, [posts]);

    const featuredPosts = useMemo(() => {
        const featured = (posts || [])
            .slice(0, 3)
            .map(transformApiPostToFeaturedPost)
            .filter((post): post is FeaturedPost => post !== null);
        return featured;
    }, [posts]);

    // Fixed to use string UUID instead of number
    const handleCardClick = (postId: string) => {
        navigate(`/blog/${postId}`);
    };

    const handleSearch = (query: string) => {
        loadPosts({ page: 1, limit: 10, search: query });
    };

    const blogStats: BlogStats = {
        totalPosts: pagination?.total || 0,
        totalReaders: "15K+", 
        categories: 8 
    };

    // Show loading state
    if (loading) {
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