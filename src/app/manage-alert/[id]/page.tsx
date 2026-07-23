import { COOKIES } from "@/shared/Constants";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ManageAlertDetail from "@/components/templates/ManageAlertDetail";
import type { Metadata } from "next";

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  return { alternates: { canonical: `/manage-alert/${params.id}` } };
}

export default async function Page({
  params,
}: {
  params: { id: string };
}) {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIES.TOKEN_KEY)?.value || null;

  if (!token) {
    return redirect("/login");
  }

  return <ManageAlertDetail id={params?.id} />;
}
