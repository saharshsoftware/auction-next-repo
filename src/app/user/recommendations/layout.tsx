import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/user/recommendations" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
