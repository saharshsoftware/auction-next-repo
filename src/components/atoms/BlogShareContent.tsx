"use client";
import React, { useState } from "react";

const BlogShareContent = (props: { closePopover?: () => void }) => {
  const { closePopover = () => {} } = props;
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);

    // Reset the copied state after 2 seconds
    setTimeout(() => {
      setCopied(false);
      closePopover();
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-lg shadow border border-gray-400 min-w-52">
      <ul className="flex flex-col gap-4">
        <li
          className={`text-sm cursor-pointer transition-colors duration-300 ${
            copied ? "text-green-600 font-medium" : "hover:text-blue-500"
          }`}
          onClick={handleCopyLink}
        >
          {copied ? "Copied!" : "Copy Link"}
        </li>
      </ul>
    </div>
  );
};

export default BlogShareContent;
