import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { fetchBlogBySlug } from "@/server/actions/blogs";
import logo from "@/assets/images/logo.png";
import { renderMarkdown } from "@/shared/Utilies";
import { BlogPost } from "@/types";

// Generate static params for all blog posts at build time
async function fetchBlogBySlugData(slug: string) {
  const res = await fetchBlogBySlug(slug);
  return res;
}

export default async function BlogPostPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { slug } = params;
  const result = (await fetchBlogBySlugData(slug)) as BlogPost[];
  const post = result?.[0];
  const categories =
    post?.blog_categories?.data?.length > 0
      ? post?.blog_categories?.data.map((cat: any) => cat.attributes.label)
      : [];
  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Blog post not found</h1>
          <Link href="/blogs" className="text-blue-600 hover:underline">
            Back to blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 common-section">
      <div className="container mx-auto px-4 py-16">
        <Link
          href="/blogs"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-1" />
          Back to blogs
        </Link>
        <article className="max-w-4xl mx-auto bg-white rounded-lg overflow-hidden shadow-sm">
          <div className="relative h-[400px] w-full">
            <Image
              src={post.image ?? logo.src}
              alt={post.title}
              fill
              className="object-contain"
            />
          </div>
          <div className="p-8">
            <div className="mb-6 flex flex-row items-center gap-2">
              {categories.map((category: string, index: number) => (
                <span
                  key={index}
                  className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                >
                  {category}
                </span>
              ))}
            </div>

            <h1 className="text-3xl font-bold mb-4 text-gray-900">
              {post.title}
            </h1>

            <div className="prose max-w-none">
              <div
                className="text-left text-base leading-[30px]  font-normal relative self-stretch danger-blog-class"
                dangerouslySetInnerHTML={{
                  __html: renderMarkdown(post?.description ?? ""),
                }}
              ></div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
