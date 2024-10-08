import { ROUTE_CONSTANTS } from "@/shared/Routes";
import nodataimage from "@/assets/images/404-data.jpg";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex justify-center items-center flex-col min-h-[60vh]">
      <Link href={ROUTE_CONSTANTS.DASHBOARD} className="text-brand-color ">
        Return to home
      </Link>
      <div className="relative w-72 aspect-square">
        <Image src={nodataimage} width={400} height={80} alt="no-data" />
      </div>
    </div>
  );
}
