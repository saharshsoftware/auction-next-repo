import ManageSavedList from "@/components/templates/ManageSavedList";
import { COOKIES } from "@/shared/Constants";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function Page() {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIES.TOKEN_KEY)?.value || null; // Replace with your actual cookie name

  if (!token) {
    return redirect("/login");
  }
  return (
    <>
      <ManageSavedList />
    </>
  );
}


export const revalidate = 0;