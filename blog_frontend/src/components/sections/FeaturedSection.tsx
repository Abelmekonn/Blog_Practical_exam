import type { FeaturedPost, PostClickHandler } from "../../types/section.types";
import { BlogCard } from "../common";

interface FeaturedSectionProps {
    featuredPosts: FeaturedPost[];
    onPostClick: PostClickHandler;
}

const FeaturedSection = ({ featuredPosts, onPostClick: _onPostClick }: FeaturedSectionProps) => {
    if (!featuredPosts.length) return null;

    const mainFeatured = featuredPosts[0]!;
    const sideFeatured = featuredPosts.slice(1, 3);

    return (
        <section className="py-12 bg-gray-50/50 dark:bg-gray-900/50 ">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-t-gray-700 dark:border-t-gray-400 py-4">
                <div className=" mb-16">
                    <h2 className="text-3xl md:text-5xl font-[400] font-instrument leading-tight">
                        Recent Articles Posts
                    </h2>

                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Main Featured Post */}
                    <BlogCard
                        title={mainFeatured.title}
                        image={mainFeatured.image}
                        description={mainFeatured.description}
                        createdDay={mainFeatured.createdDay}
                        id={mainFeatured.id.toString()}
                        />

                    {/* Side Featured Posts */}
                    <div className="flex flex-col justify-between gap-2 ">
                        {sideFeatured.map((post) => (
                            <BlogCard
                                key={post.id}
                                image={post.image}
                                title={post.title}
                                description={post.description}
                                createdDay={post.createdDay}
                                id={post.id.toString()}
                                flex={true}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturedSection; 