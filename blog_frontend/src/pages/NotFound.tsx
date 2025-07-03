import { Link } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { SEO } from "../components/common";

const NotFound = () => {
  return (
    <Layout>
      <SEO
        title="Page Not Found"
        description="The page you're looking for doesn't exist. Return to our homepage to discover great blog posts and articles."
        keywords="404, page not found, error"
        url="/404"
        type="website"
      />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center px-6 py-8">
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">
              404
            </h1>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
              Page Not Found
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
              Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
            </p>
          </div>
          
          <div className="space-y-4">
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Go Home
            </Link>
            
            <div className="mt-4">
              <button
                onClick={() => window.history.back()}
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 font-medium"
              >
                ← Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound; 