import React from "react";
import InstructionWishlistSection from "@/components/molecules/InstructionWishlistSection";
export default function Page() {

  return (
    <div className="my-12">
      <InstructionWishlistSection isAuthenticated={false} hideSignupButton={true} />
    </div>
  );
}
