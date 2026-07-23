import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/manage-list" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
