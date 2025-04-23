"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ForceRefreshOnMount() {
  const router = useRouter();

  useEffect(() => {
    router.refresh(); // forces server component to reload
  }, []);

  return null;
}
