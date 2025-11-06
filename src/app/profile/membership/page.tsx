import ProfileMembershipPage from "@/components/templates/ProfileMembershipPage";
import { COOKIES } from "@/shared/Constants";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function Page(): JSX.Element {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIES.TOKEN_KEY)?.value || null;

  if (!token) {
    return redirect("/login");
  }

  return <ProfileMembershipPage />;
}

