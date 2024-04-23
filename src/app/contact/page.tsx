import React from "react";
import MarkdownIt from "markdown-it";
import { getContactUsData } from "@/server/actions/footer";

export default async function Page() {
  const res = await getContactUsData();
  const renderMarkdown = (markdown: any) => {
    const md = new MarkdownIt({
      html: true,
      linkify: true,
    });
    return md.render(markdown);
  };

  if (res) {
    return (
      <section className="common-section">
        <div className="my-4">
          <div className="flex flex-col gap-4 ">
            <div
              className="text-left text-base leading-[30px] font-normal relative self-stretch danger-blog-class"
              dangerouslySetInnerHTML={{
                __html: renderMarkdown(res?.message),
              }}
            ></div>
          </div>
        </div>
      </section>
    );
  }
}

export const revalidate = 0;
