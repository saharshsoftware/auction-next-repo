import type { Metadata } from "next";

export const metadata: Metadata = { alternates: { canonical: "/profile" } };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
