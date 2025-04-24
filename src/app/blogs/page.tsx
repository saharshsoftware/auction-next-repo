import { BlogCard } from "@/components/atoms/BlogCard";
import { fetchBlogs } from "@/server/actions/blogs";
import { BlogPost } from "@/types";

export default async function BlogsPage() {
  const blogPosts = (await fetchBlogs()) as BlogPost[];

  return (
    <div className="min-h-screen bg-gray-50 common-section">
      <div className="container mx-auto py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">
            Latest <span className="text-blue-600">Insights</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Stay informed with our latest articles about bank auctions, property
            investments, and market trends. Knowledge is your best tool in the
            auction market.
          </p>
        </div>

        {blogPosts.length === 0 ? (
          <div className="text-center text-2xl text-gray-500">
            No active blog found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
