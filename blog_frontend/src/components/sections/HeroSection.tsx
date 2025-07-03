import React from 'react';
import TechMarquee from '../common/TechMarquee';
import SearchInput from '../common/SearchInput';


interface BlogStats {
    totalPosts: number;
    totalReaders: string;
    categories: number;
}

interface HeroSectionProps {
    title: string;
    subtitle: string;
    description?: string;


    className?: string;
    showSearch?: boolean;
    onSearch?: (query: string) => void;
    blogStats?: BlogStats;
    featuredCategories?: string[];
}

const HeroSection: React.FC<HeroSectionProps> = ({
    title,
    subtitle,
    description,
    className = "",
    showSearch = true,
    onSearch,
    blogStats,
}) => {

    return (
        <section
            className={`relative min-h-[80vh] flex flex-col items-center justify-center py-16 px-4 overflow-hidden ${className} w-full`}
        >
            {/* Grid Background Pattern */}
            <div className="absolute inset-0 h-full w-full">
                <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff2e_1px,transparent_1px),linear-gradient(to_bottom,#ffffff2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
            </div>

            <div className="relative z-10 w-[90%] md:max-w-4xl mx-auto text-center">
                <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium   dark:text-gray-200 border border-gray-500/70 dark:border-gray-200/70 mb-6 backdrop-blur-sm">
                    ✨ {subtitle}
                </div>

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-[400] text-gray-900 dark:text-[#FFFFE3] mb-6 leading-tight font-instrument">
                    {title}
                </h1>

                {description && (
                    <p className="text-base text-gray-500 mb-4 font-inter md:text-[24px] font-[400] max-w-3xl mx-auto">
                        {description}
                    </p>
                )}

                {blogStats && (
                    <div className="flex flex-wrap justify-center gap-6 mb-8">
                        <div className="text-center p-4 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
                            <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">{blogStats.totalPosts}+</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Articles</div>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
                            <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">{blogStats.totalReaders}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Readers</div>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
                            <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">{blogStats.categories}+</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Categories</div>
                        </div>
                    </div>
                )}

                {showSearch && onSearch && (
                    <div className="max-w-lg mx-auto mb-8">
                        <SearchInput
                            onSearch={onSearch}
                            placeholder="Search articles, news, topics..."
                            variant="hero"
                            debounceDelay={300}
                        />
                    </div>
                )}


            </div>
            <TechMarquee />
        </section>
    );
};

export default HeroSection; 