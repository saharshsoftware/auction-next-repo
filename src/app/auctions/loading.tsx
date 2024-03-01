import CustomLoading from "@/components/atoms/Loading";
import React from "react";

export default function Loading() {
  return (
    <div className="p-12 min-h-[70vh] flex items-center justify-center w-full">
      <CustomLoading />
    </div>
  );
}
