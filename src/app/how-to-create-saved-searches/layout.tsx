import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/how-to-create-saved-searches" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
