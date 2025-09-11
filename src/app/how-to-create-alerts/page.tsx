/* eslint-disable @next/next/no-async-client-component */
"use client"
import React from "react";
import InstructionAlertSection from "@/components/molecules/InstructionAlertSection";

export default function Page() {

  return (
    <section className="section-class py-12 bg-even-color">
      <InstructionAlertSection hideSignupButton={true} isAuthenticated={false} />
    </section>
  );
}
