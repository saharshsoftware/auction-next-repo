import React from "react";
import PartnerSignup from "@/components/molecules/PartnerSignup";
import { Metadata } from "next";

export const metadata: Metadata = {
	alternates: { canonical: "/partner-signup" },
	robots: "noindex, follow",
};

export default async function Page() {
	return (
		<section className="common-section">
			<div className="my-4">
				<PartnerSignup />
			</div>
		</section>
	)
}

export const revalidate = 0;
