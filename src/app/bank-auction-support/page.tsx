import React from "react";
import { OurServices } from "@/components/templates/OurServices";

export const dynamic = 'force-static';

export default async function Page() {
  return (
    <>
      <OurServices />
    </>
  );
}
