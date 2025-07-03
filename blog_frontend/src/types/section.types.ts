// Section types for Home page components
export interface HeroSectionProps {
  onExploreClick?: () => void;
}

export interface FeaturedSectionProps {
  className?: string;
  onPostClick?: (postId: string) => void;
}

export interface LatestPostsSectionProps {
  className?: string;
  onPostClick?: (postId: string) => void;
}

// Common section configurations
export interface SectionConfig {
  title: string;
  description?: string;
  showViewAll?: boolean;
  viewAllText?: string;
  limit?: number;
}

// Featured post configuration
export interface FeaturedPostConfig extends SectionConfig {
  featuredPostIds?: string[];
  autoRotate?: boolean;
  rotationInterval?: number;
}

// Basic Post interface for sections
export interface Post {
  id: number;
  title: string;
  description: string;
  image: string;
  createdDay: string;
}

// Featured Post interface (extends Post with additional fields)
export interface FeaturedPost extends Post {
  category?: string;
  readTime?: string;
}

// Blog stats interface
export interface BlogStats {
  totalPosts: number;
  totalReaders: string;
  categories: number;
}

// Post click handler type
export type PostClickHandler = (postId: number) => void;
