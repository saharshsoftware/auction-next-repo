import React from "react";
import {AboutPage} from "@/components/templates/AboutPage";

export const dynamic = 'force-static';

export default async function Page() {
  return <AboutPage />
}
