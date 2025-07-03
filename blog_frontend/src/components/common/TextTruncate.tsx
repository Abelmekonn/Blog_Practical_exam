import { useState } from 'react';

interface TextTruncateProps {
    text: string;
    maxLength?: number;
    showMoreText?: string;
    showLessText?: string;
    className?: string;
    expandable?: boolean;
    ellipsis?: string;
}

const TextTruncate = ({
    text,
    maxLength = 150,
    showMoreText = "Read more",
    showLessText = "Show less",
    className = "",
    expandable = true,
    ellipsis = "..."
}: TextTruncateProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // Return full text if it's shorter than maxLength
    if (text.length <= maxLength) {
        return (
            <p className={className}>
                {text}
            </p>
        );
    }

    // Get truncated text
    const truncatedText = text.slice(0, maxLength).trim();

    // Find last complete word to avoid cutting words in half
    const lastSpaceIndex = truncatedText.lastIndexOf(' ');
    const safetruncatedText = lastSpaceIndex > 0
        ? truncatedText.slice(0, lastSpaceIndex)
        : truncatedText;

    const displayText = isExpanded ? text : `${safetruncatedText}${ellipsis}`;

    if (!expandable) {
        return (
            <p className={className}>
                {`${safetruncatedText}${ellipsis}`}
            </p>
        );
    }

    return (
        <div className={className}>
            <p className="inline">
                {displayText}
            </p>
            {expandable && (
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="ml-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 rounded"
                    aria-label={isExpanded ? showLessText : showMoreText}
                >
                    {isExpanded ? showLessText : showMoreText}
                </button>
            )}
        </div>
    );
};

export default TextTruncate; 