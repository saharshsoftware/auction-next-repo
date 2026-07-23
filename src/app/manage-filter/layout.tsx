import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/manage-filter" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
