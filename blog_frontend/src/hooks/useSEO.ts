import { useEffect } from "react";

interface SEOConfig {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  article?: {
    author?: string;
    publishedTime?: string;
    modifiedTime?: string;
    tags?: string[];
  };
}

const defaultSEO: SEOConfig = {
  title: "Blog | Share Your Thoughts & Ideas",
  description:
    "A modern blog platform where you can share your thoughts, ideas, and connect with a community of writers and readers.",
  keywords: "blog, writing, thoughts, ideas, community, articles, posts",
  type: "website",
};

export const useSEO = (config: SEOConfig = {}) => {
  const seoConfig = { ...defaultSEO, ...config };

  useEffect(() => {
    // Update document title
    if (seoConfig.title) {
      document.title = seoConfig.title.includes("|")
        ? seoConfig.title
        : `${seoConfig.title} | Blog Platform`;
    }

    // Update meta description
    if (seoConfig.description) {
      const metaDescription = document.querySelector(
        'meta[name="description"]'
      );
      if (metaDescription) {
        metaDescription.setAttribute("content", seoConfig.description);
      }
    }

    // Update canonical URL
    if (seoConfig.url) {
      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) {
        canonical.setAttribute(
          "href",
          `${window.location.origin}${seoConfig.url}`
        );
      }
    }
  }, [seoConfig]);

  return seoConfig;
};

// Helper function to generate article SEO data
export const createArticleSEO = (
  title: string,
  content: string,
  author?: string,
  createdAt?: string,
  updatedAt?: string,
  imageUrl?: string,
  id?: string
): SEOConfig => {
  const description =
    content.length > 160 ? content.substring(0, 160) + "..." : content;

  const keywords = `blog, article, ${title.split(" ").slice(0, 5).join(", ")}`;

  return {
    title,
    description,
    keywords,
    image: imageUrl,
    url: id ? `/blog/${id}` : undefined,
    type: "article",
    article: {
      author: author || "Blog Author",
      publishedTime: createdAt,
      modifiedTime: updatedAt,
      tags: title.split(" ").slice(0, 3),
    },
  };
};

// Helper function to generate page SEO data
export const createPageSEO = (
  title: string,
  description: string,
  keywords?: string,
  url?: string
): SEOConfig => ({
  title,
  description,
  keywords: keywords || `${title.toLowerCase()}, blog, ${defaultSEO.keywords}`,
  url,
  type: "website",
});
