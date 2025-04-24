"use client";
import { faShare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/popover";
import React, { useState } from "react";
import BlogShareContent from "./BlogShareContent";

const BlogShare = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative">
      <Popover
        placement="bottom"
        isOpen={isOpen}
        onOpenChange={(open) => setIsOpen(open)}
      >
        <PopoverTrigger>
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <FontAwesomeIcon icon={faShare} />
          </button>
        </PopoverTrigger>
        <PopoverContent>
          <BlogShareContent closePopover={() => setIsOpen(false)} />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default BlogShare;
