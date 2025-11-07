import ProfileTemplate from "@/components/templates/ProfileTemplate";
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
    <div className="common-section">
      <div className="md:w-4/5 w-full mx-auto py-4">
        <ProfileTemplate />
      </div>
    </div>
  );
}
