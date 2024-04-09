"use client"
import React from "react";
import { STRING_DATA } from "@/shared/Constants";
import ActionButton from "../atoms/ActionButton";
import { useRouter } from "next/navigation";

const BackButton = () => {
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };
  return (
    <>
      <ActionButton
        text={STRING_DATA.BACK.toUpperCase()}
        onclick={handleBack}
      />
    </>
  );
};

export default BackButton;
