import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCalendar,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { fetchBlogBySlug } from "@/server/actions/blogs";
import logo from "@/assets/images/logo.png";
import { BlogPost } from "@/types";
import MarkdownIt from "markdown-it";
import BlogShare from "@/components/atoms/BlogShare";
import { formattedDate, stripHtmlTags } from "@/shared/Utilies";
import TextToSpeech from "@/components/atoms/TextToSpeech";
import BlogHeart from "@/components/atoms/BlogHeart";

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
  const renderMarkdown = (markdown: any) => {
    const md = new MarkdownIt({
      html: true,
      linkify: true,
    });
    return md.render(markdown);
  };
  const post = result?.[0];
  const rawHtml = renderMarkdown(post?.description ?? "");
  const cleanText = stripHtmlTags(rawHtml);
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
      <div className="container mx-auto py-16">
        <article className="max-w-4xl mx-auto bg-white rounded-lg lg:px-4 px-2 ">
          <Link
            href="/blogs"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-1" />
            Back to blogs
          </Link>
          <h1 className="lg:px-4 px-2  text-3xl font-bold mb-4 text-gray-900">
            {post.title}
          </h1>
          {/* Author Info */}

          <div className="lg:px-4 px-2 flex items-center flex-wrap gap-6 text-sm text-gray-500  mb-8">
            <div className="flex items-center gap-1">
              <FontAwesomeIcon icon={faCalendar} />
              <span>{formattedDate(post.publishedAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <FontAwesomeIcon icon={faClock} />
              <span>{post?.reading_time ?? "5 min read"}</span>
            </div>
            <TextToSpeech text={cleanText} />
            <BlogHeart blogId={post?.id} no_of_likes={post?.no_of_likes} />
            <BlogShare />
          </div>

          <div className="relative lg:min-h-[400px] min-h-[220px] w-full">
            <Image
              src={post.image ?? logo.src}
              alt={post.title}
              fill
              className={"object-contain"}
            />
          </div>
          <div className="lg:px-4 px-2 py-4 mt-8">
            <div className="mb-4 flex flex-row items-center gap-2 flex-wrap">
              {categories.map((category: string, index: number) => (
                <span
                  key={index}
                  className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                >
                  {category}
                </span>
              ))}
            </div>

            <div
              className="text-base leading-[30px]  text-justify  font-normal relative self-stretch danger-blog-class "
              dangerouslySetInnerHTML={{
                __html: renderMarkdown(post?.description ?? ""),
              }}
            ></div>
          </div>
        </article>
      </div>
    </div>
  );
}
