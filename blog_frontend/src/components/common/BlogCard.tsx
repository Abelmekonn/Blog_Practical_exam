import React from 'react';
import { useNavigate } from 'react-router-dom';

interface BlogCardProps {
    image: string;
    title: string;
    description: string;
    createdDay: string;
    id: string;
    flex?: boolean;
}

const BlogCard: React.FC<BlogCardProps> = ({
    image,
    title,
    description,
    createdDay,
    id,
    flex = false
}) => {
    const navigate = useNavigate();

    const handleClick = () => {
        console.log(id)
        navigate(`/blog/${id}`);
    };

    return (
        <div
            className={`rounded-lg shadow-sm hover:shadow-md border border-gray-500 dark:border-gray-500 bg-white dark:bg-gray-800 overflow-hidden cursor-pointer hover:border-gray-700 dark:hover:border-gray-200 transition-all duration-300 ${flex ? 'flex gap-2 h-full' : 'flex flex-col'}`}
            onClick={handleClick}
        >
            {/* Image */}
            <div className={`overflow-hidden flex-shrink-0 ${flex ? 'w-[50%] h-full' : 'aspect-video w-full'}`}>
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
            </div>

            {/* Content */}
            <div className={` flex-1 flex flex-col justify-between ${flex ? 'w-[50%] p-2' : 'p-6'}`}>
                {/* Title */}
                <h3 className="text-2xl font-[400] font-inter text-gray-900 dark:text-gray-100 mb-3 line-clamp-2 transition-colors duration-200">
                    {title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 text-sm leading-relaxed">
                    {description}
                </p>

                {/* Created Date */}
                <div className="flex items-center justify-between">
                    <time
                        className="text-xs text-gray-500 dark:text-gray-500 font-medium"
                        dateTime={createdDay}
                    >
                        {new Date(createdDay).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </time>

                    {/* Read More Indicator */}
                    <span className=" text-sm font-medium hover:underline">
                        Read more →
                    </span>
                </div>
            </div>
        </div>
    );
};

export default BlogCard; 