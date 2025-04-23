"use client";
import React, { useEffect, useState } from "react";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { updateBlogLikesClient } from "@/services/blogs";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const LOCAL_STORAGE_KEY = "likedBlogs";

interface BlogHeartProps {
  blogId: string;
  no_of_likes: number;
}

const BlogHeart: React.FC<BlogHeartProps> = ({ blogId, no_of_likes = 0 }) => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(no_of_likes);
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: updateBlogLikesClient,
    onSuccess: () => {
      handleLike();
      router.refresh();
    },
    onError: (error: any) => {
      const { message } = error;
      console.log(message);
    },
  });
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    const likedIds = stored ? JSON.parse(stored) : [];
    if (likedIds.includes(blogId)) {
      setLiked(true);
    }
  }, [blogId]);

  const handleLike = () => {
    if (liked) return;

    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    const likedIds: string[] = stored ? JSON.parse(stored) : [];

    if (!likedIds.includes(blogId)) {
      likedIds.push(blogId);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(likedIds));
      setLiked(true);
      setLikes((prev) => prev + 1);
    }
  };

  const handleHeartClick = () => {
    if (liked) return;
    mutate({ no_of_likes: likes + 1, blogId });
  };

  return (
    <button
      onClick={handleHeartClick}
      disabled={liked}
      className="flex items-center gap-1 p-2 hover:bg-white/10 rounded-full transition-colors"
    >
      <FontAwesomeIcon
        icon={solidHeart}
        className={liked ? "text-red-500" : "text-gray-500"}
      />
      {likes > 0 ? <span className="text-sm ">{likes}</span> : null}
    </button>
  );
};

export default BlogHeart;
