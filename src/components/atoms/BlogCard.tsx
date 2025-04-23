import { BlogPost } from "@/types";
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/images/logo.png";
import { formattedDate, renderMarkdown } from "@/shared/Utilies";
import MarkdownIt from "markdown-it";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faClock } from "@fortawesome/free-solid-svg-icons";

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  const categories =
    post?.blog_categories?.data?.length > 0
      ? post?.blog_categories?.data.map((cat: any) => cat.attributes.label)
      : [];

  const renderMarkdown = (markdown: any) => {
    const md = new MarkdownIt({
      html: true,
      linkify: true,
    });
    return md.render(markdown);
  };
  return (
    <Link href={`/blogs/${post.slug}`}>
      <article className="bg-white rounded-lg overflow-hidden shadow-md transition-shadow">
        <div className="relative aspect-video w-full border border-b-gray-200 rounded-t-lg overflow-hidden">
          <Image
            src={post.image ?? logo.src}
            alt={post.title}
            fill={true}
            className={"object-contain"}
          />
        </div>
        <div className="p-6">
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
          <h2 className="text-xl font-semibold mb-2 text-gray-900 line-clamp-2">
            {post.title}
          </h2>
          {/* <p className="text-gray-600 line-clamp-3">{post.description}</p> */}
          <div
            className="text-left text-base leading-[30px]  line-clamp-3 font-normal relative self-stretch danger-blog-class mb-4"
            dangerouslySetInnerHTML={{
              __html: renderMarkdown(post?.description ?? ""),
            }}
          ></div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <FontAwesomeIcon icon={faCalendar} />
              <span>{formattedDate(post.publishedAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <FontAwesomeIcon icon={faClock} />
              <span>{post?.readingTime ?? "5 min read"}</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
