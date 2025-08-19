"use client";
import Link from "next/link";
import React from "react";
import { Url } from "url";

interface BubbleButtonProps {
  label: string;
  path?: string;
}

const BubbleButton: React.FC<BubbleButtonProps> = ({ label, path }) => {
  return (
    <Link
      href={path || "#"}
      className=" md:border border-gray-300 md:rounded-full px-4 py-2 text-brand-color font-bold flex md:items-center justify-between space-x-2 w-full md:w-auto"
    >
      <span className="text-left text-sm-xs">{label}</span>
      <span className="text-md text-sm-xs">›</span>
    </Link>
  );
};

export default BubbleButton;
