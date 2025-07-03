import { Helmet } from "react-helmet-async";

interface SEOProps {
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

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  image,
  url,
  type = "website",
  article,
}) => {
  const baseUrl = window.location.origin;
  const fullUrl = url ? `${baseUrl}${url}` : window.location.href;
  const defaultImage = `${baseUrl}/og-default.jpg`; // You can add a default OG image
  
  const seoTitle = title 
    ? `${title} | Blog Platform` 
    : "Blog | Share Your Thoughts & Ideas";
    
  const seoDescription = description || 
    "A modern blog platform where you can share your thoughts, ideas, and connect with a community of writers and readers.";

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content="Blog Platform" />
      <meta property="og:image" content={image || defaultImage} />
      <meta property="og:image:alt" content={title || "Blog Platform"} />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={image || defaultImage} />

      {/* Article specific meta tags */}
      {type === "article" && article && (
        <>
          {article.author && <meta name="article:author" content={article.author} />}
          {article.publishedTime && (
            <meta name="article:published_time" content={article.publishedTime} />
          )}
          {article.modifiedTime && (
            <meta name="article:modified_time" content={article.modifiedTime} />
          )}
          {article.tags && 
            article.tags.map((tag, index) => (
              <meta key={index} name="article:tag" content={tag} />
            ))
          }
        </>
      )}

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": type === "article" ? "BlogPosting" : "WebSite",
          name: seoTitle,
          description: seoDescription,
          url: fullUrl,
          ...(type === "article" && article && {
            author: {
              "@type": "Person",
              name: article.author || "Anonymous",
            },
            datePublished: article.publishedTime,
            dateModified: article.modifiedTime,
            keywords: article.tags?.join(", "),
          }),
          ...(type === "website" && {
            publisher: {
              "@type": "Organization",
              name: "Blog Platform",
            },
          }),
        })}
      </script>
    </Helmet>
  );
};

export default SEO; 