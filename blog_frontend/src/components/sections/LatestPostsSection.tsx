import { useState } from "react";
import { BlogCard } from "../common";
import type { Post, PostClickHandler } from "../../types/section.types";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

interface LatestPostsSectionProps {
    posts: Post[];
    onPostClick: PostClickHandler;
    postsPerPage?: number;
    isDetail?: boolean; 
}

const LatestPostsSection = ({ posts, onPostClick: _onPostClick, postsPerPage = 6, isDetail = false }: LatestPostsSectionProps) => {
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate pagination values
    const totalPages = Math.ceil(posts.length / postsPerPage);
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const currentPosts = posts.slice(startIndex, endIndex);

    // Pagination handlers
    const handlePreviousPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

    const handlePageClick = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Show first page
            pages.push(1);

            // Show ellipsis if needed
            if (currentPage > 3) {
                pages.push('...');
            }

            // Show pages around current page
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                if (!pages.includes(i)) {
                    pages.push(i);
                }
            }

            // Show ellipsis if needed
            if (currentPage < totalPages - 2) {
                pages.push('...');
            }

            // Show last page
            if (!pages.includes(totalPages)) {
                pages.push(totalPages);
            }
        }

        return pages;
    };

    return (
        <section id="latest-posts" className={` bg-gray-50/50 dark:bg-gray-900/50 ${isDetail ? "" : "py-12"}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-t-gray-700 dark:border-t-gray-400 py-4">
                <div className={`${isDetail ? "mb-3" : "mb-16 "}`}>
                    <h2 className={`text-3xl md:text-5xl font-[400] font-instrument leading-tight ${isDetail ? "text-2xl" : ""}`}>
                        Latest Posts
                    </h2>
                </div>  

                <div className={`grid grid-cols-1 md:grid-cols-3  gap-6 ${isDetail ? "grid-cols-1" : ""}`}>
                    {currentPosts.map((post) => (
                        <BlogCard
                            key={post.id}
                            image={post.image}
                            title={post.title}
                            description={post.description}
                            createdDay={post.createdDay}
                            id={post.id.toString()}
                        />
                    ))}
                </div>

                {totalPages > 1 && !isDetail && (
                    <>
                        <hr className="mt-12 border-t-gray-500 dark:border-t-gray-400" />
                        <div className="flex justify-between items-center mt-8">
                            <button
                                onClick={handlePreviousPage}
                                disabled={currentPage === 1}
                                className="p-2 rounded-md border border-gray-300 dark:border-gray-600 
                                             hover:bg-gray-100 dark:hover:bg-[#FFFFE3]
                                             disabled:opacity-50 disabled:cursor-not-allowed
                                             transition-colors duration-200"
                                aria-label="Previous page"
                            >
                                <FaArrowLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            </button>

                            {/* Page Numbers */}
                            <div className="flex items-center gap-1">
                                {getPageNumbers().map((page, index) => (
                                    <div key={index}>
                                        {page === '...' ? (
                                            <span className="px-3 py-2 text-gray-500 dark:text-gray-400">...</span>
                                        ) : (
                                            <button
                                                onClick={() => handlePageClick(page as number)}
                                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${currentPage === page
                                                    ? 'bg-gray-600/40 text-gray-900 dark:bg-[#FFFFE3] dark:text-gray-900'
                                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Next Button */}
                            <button
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-md border border-gray-300 dark:border-gray-600 
                                             hover:bg-gray-100 dark:hover:bg-[#FFFFE3]
                                             disabled:opacity-50 disabled:cursor-not-allowed
                                             transition-colors duration-200"
                                aria-label="Next page"
                            >
                                <FaArrowRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            </button>

                        </div>
                    </>
                )}
            </div>
        </section>
    );
};

export default LatestPostsSection; 