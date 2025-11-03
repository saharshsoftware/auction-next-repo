import { COOKIES } from "@/shared/Constants";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ManageAlertDetail from "@/components/templates/ManageAlertDetail";

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

