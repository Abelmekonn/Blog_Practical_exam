/**
 * Text utility functions for string manipulation and formatting
 */

export interface TruncateOptions {
  maxLength: number;
  ellipsis?: string;
  preserveWords?: boolean;
}

export interface ConcatenateOptions {
  separator?: string;
  maxLength?: number;
  ellipsis?: string;
}

/**
 * Truncates text to a specified length while preserving word boundaries
 * @param text - The text to truncate
 * @param options - Truncation options
 * @returns Truncated text
 */
export const truncateText = (
  text: string,
  options: TruncateOptions
): string => {
  const { maxLength, ellipsis = "...", preserveWords = true } = options;

  if (text.length <= maxLength) {
    return text;
  }

  let truncated = text.slice(0, maxLength).trim();

  if (preserveWords) {
    const lastSpaceIndex = truncated.lastIndexOf(" ");
    if (lastSpaceIndex > 0) {
      truncated = truncated.slice(0, lastSpaceIndex);
    }
  }

  return `${truncated}${ellipsis}`;
};

/**
 * Concatenates multiple text strings with options for length control
 * @param texts - Array of texts to concatenate
 * @param options - Concatenation options
 * @returns Concatenated text
 */
export const concatenateTexts = (
  texts: string[],
  options: ConcatenateOptions = {}
): string => {
  const { separator = " ", maxLength, ellipsis = "..." } = options;

  const concatenated = texts
    .filter((text) => text && text.trim().length > 0)
    .join(separator);

  if (maxLength && concatenated.length > maxLength) {
    return truncateText(concatenated, {
      maxLength,
      ellipsis,
      preserveWords: true,
    });
  }

  return concatenated;
};

/**
 * Extracts a preview from text content
 * @param text - The full text content
 * @param maxWords - Maximum number of words in preview
 * @returns Preview text
 */
export const createTextPreview = (
  text: string,
  maxWords: number = 30
): string => {
  const words = text.trim().split(/\s+/);

  if (words.length <= maxWords) {
    return text;
  }

  return words.slice(0, maxWords).join(" ") + "...";
};

/**
 * Formats text for display with proper capitalization
 * @param text - Text to format
 * @param type - Type of formatting to apply
 * @returns Formatted text
 */
export const formatText = (
  text: string,
  type: "title" | "sentence" | "uppercase" | "lowercase" = "sentence"
): string => {
  if (!text) return "";

  switch (type) {
    case "title":
      return text
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

    case "sentence":
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

    case "uppercase":
      return text.toUpperCase();

    case "lowercase":
      return text.toLowerCase();

    default:
      return text;
  }
};

/**
 * Safely joins text segments, filtering out empty values
 * @param segments - Text segments to join
 * @param separator - Separator to use between segments
 * @returns Joined text
 */
export const safeJoinText = (
  segments: (string | null | undefined)[],
  separator: string = " "
): string => {
  return segments
    .filter((segment): segment is string => Boolean(segment?.trim()))
    .join(separator);
};

/**
 * Counts words in text
 * @param text - Text to count words in
 * @returns Number of words
 */
export const countWords = (text: string): number => {
  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
};

/**
 * Estimates reading time for text
 * @param text - Text to estimate reading time for
 * @param wordsPerMinute - Average reading speed (default: 200 wpm)
 * @returns Reading time in minutes
 */
export const estimateReadingTime = (
  text: string,
  wordsPerMinute: number = 200
): number => {
  const wordCount = countWords(text);
  return Math.ceil(wordCount / wordsPerMinute);
};

/**
 * Formats reading time for display
 * @param minutes - Reading time in minutes
 * @returns Formatted reading time string
 */
export const formatReadingTime = (minutes: number): string => {
  if (minutes < 1) return "Less than 1 min";
  if (minutes === 1) return "1 min";
  return `${minutes} min`;
};
