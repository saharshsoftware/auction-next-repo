import ManageAlert from "@/components/templates/ManageAlert";
import { COOKIES } from "@/shared/Constants";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIES.TOKEN_KEY)?.value || null; // Replace with your actual cookie name

  if (!token) {
    return redirect("/login");
  }
  return (
    <>
      <ManageAlert />
    </>
  )
} 