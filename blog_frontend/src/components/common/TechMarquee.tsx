import React from 'react';

interface TechMarqueeProps {
    items?: string[];
    className?: string;
}

const defaultCategories: string[] = [
    'Web Development',
    'Mobile Apps',
    'AI & ML', 
    'Cloud Computing',
    'DevOps',
    'Data Science',
    'Cybersecurity',
    'UI/UX Design',
    'Backend Dev',
    'Frontend Dev',
    'Databases',
    'Architecture',
    'Open Source',
    'Programming',
    'Frameworks',
    'APIs',
    'Testing',
    'Performance'
];

const TechMarquee: React.FC<TechMarqueeProps> = ({
    items = defaultCategories,
    className = '',
}) => {
    return (
        <div className={`w-full overflow-hidden py-4 mt-8 ${className}`}>
            <div className="flex w-max animate-marquee-left" style={{ animationDuration: '50s' }}>
                {/* First set of items */}
                {items.map((item, index) => (
                    <div
                        key={`first-${index}`}
                        className="flex items-center mr-8 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800"
                    >
                        <span className="text-gray-700 dark:text-gray-300 text-sm font-medium whitespace-nowrap">
                            {item}
                        </span>
                    </div>
                ))}
                {/* Duplicate set for seamless loop */}
                {items.map((item, index) => (
                    <div
                        key={`second-${index}`}
                        className="flex items-center mr-8 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800"
                    >
                        <span className="text-gray-700 dark:text-gray-300 text-sm font-medium whitespace-nowrap">
                            {item}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TechMarquee; 