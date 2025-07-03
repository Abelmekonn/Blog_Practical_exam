import React from 'react';
import { useNavigate } from 'react-router-dom';

interface BlogCardProps {
    image: string;
    title: string;
    description: string;
    createdDay: string;
    id: string;
    flex?: boolean;
    onPostClick?: (postId: string) => void;
}

const BlogCard: React.FC<BlogCardProps> = ({
    image,
    title,
    description,
    createdDay,
    id,
    flex = false,
    onPostClick
}) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (onPostClick) {
            onPostClick(id);
        } else {
            navigate(`/blog/${id}`);
        }
    };

    return (
        <div
            className={`rounded-lg h-full shadow-sm hover:shadow-md border border-gray-500 dark:border-gray-500 bg-white dark:bg-gray-800 overflow-hidden cursor-pointer hover:border-gray-700 dark:hover:border-gray-200 transition-all duration-300 ${flex ? 'flex flex-col sm:flex-row gap-3 h-[200px] sm:h-[180px] md:h-[250px]' : 'flex flex-col'}`}
            onClick={handleClick}
        >
            {/* Image */}
            <div className={`overflow-hidden flex-shrink-0 ${flex ? ' sm:h-full sm:w-[45%] md:w-[50%]' : 'aspect-video w-full'}`}>
                <img
                    src={image}
                    alt={title}
                    className={`w-full h-full object-cover hover:scale-105 transition-transform duration-300 ${flex ? 'aspect-video sm:aspect-square md:aspect-square' : 'aspect-video'}`}
                />
            </div>

            {/* Content */}
            <div className={`flex-1 flex flex-col justify-between ${flex ? 'h-[40%] sm:h-full sm:w-[55%] md:w-[50%] p-3 sm:p-4' : 'p-6'}`}>
                {/* Title */}
                <h3 className={`font-[400] font-inter text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 transition-colors duration-200 ${flex ? 'text-lg sm:text-xl md:text-2xl' : 'text-2xl mb-3'}`}>
                    {title}
                </h3>

                {/* Description */}
                <p className={`text-gray-600 dark:text-gray-400 mb-3 line-clamp-2 text-sm leading-relaxed ${flex ? 'hidden sm:block sm:line-clamp-2 md:line-clamp-3' : 'line-clamp-3 mb-4'}`}>
                    {description}
                </p>

                {/* Created Date */}
                <div className="flex items-center justify-between mt-auto">
                    <time
                        className="text-xs text-gray-500 dark:text-gray-500 font-medium"
                        dateTime={createdDay}
                    >
                        {new Date(createdDay).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: flex ? 'short' : 'long',
                            day: 'numeric'
                        })}
                    </time>

                    {/* Read More Indicator */}
                    <span className={`font-medium text-gray-900 dark:text-gray-100 hover:underline transition-colors duration-200 ${flex ? 'text-xs sm:text-sm' : 'text-sm'}`}>
                        Read more →
                    </span>
                </div>
            </div>
        </div>
    );
};

export default BlogCard; 