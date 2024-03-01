import { ROUTE_CONSTANTS } from "@/shared/Routes";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex justify-center items-center flex-col min-h-screen">
      <h2 className="text-lg">Not Found</h2>
      <p className="font-bold">Could not find requested resource</p>
      <Link href={ROUTE_CONSTANTS.DASHBOARD}>Return Home</Link>
    </div>
  );
}
