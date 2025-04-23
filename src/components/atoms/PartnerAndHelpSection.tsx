"use client";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import {
  faHandshake,
  faQuestionCircle,
  faEnvelope,
  faMessage,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import ActionButton from "./ActionButton";
import { useRouter } from "next/navigation";

const PartnerAndHelpSection = () => {
  const router = useRouter();
  return (
    <>
      <div className="grid md:grid-cols-2 gap-8 1common-section mx-auto">
        {/* Partner With Us */}
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <FontAwesomeIcon
                icon={faHandshake}
                className="h-8 w-8 text-blue-600"
              />
            </div>
            <h3 className="text-2xl font-bold mb-2">Partner With Us</h3>
            <p className="text-gray-600 mb-2">
              Are you a broker or financial institution interested in
              collaborating?
            </p>
            <p className="text-gray-600">
              We&apos;re building India&apos;s most trusted community for bank
              auctions. Let&apos;s work together to simplify the auction journey
              for everyone.
            </p>
          </div>
          <div className="text-center">
            <ActionButton
              text="Become a Partner"
              onclick={() => router.push(ROUTE_CONSTANTS.PARTNER)}
            />
          </div>
        </div>

        {/* Need Help */}
        <div className="bg-white rounded-lg p-8 shadow-sm h-full">
          <div className="text-center mb-6 flex-1">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <FontAwesomeIcon
                icon={faQuestionCircle}
                className="h-8 w-8 text-blue-600"
              />
            </div>
            <h3 className="text-2xl font-bold mb-2">
              Need Help or Have a Query?
            </h3>
            <p className="text-gray-600 mb-2">We&apos;re here to assist you.</p>
            <p className="text-gray-600">
              Whether you&apos;re a customer, broker, or just curious about bank
              auctions — feel free to reach out.
            </p>
          </div>
          <div className="flex justify-center gap-4 ">
            <ActionButton
              text="Contact Support"
              onclick={() => router.push(ROUTE_CONSTANTS.CONTACT)}
              iconLeft={
                <FontAwesomeIcon icon={faEnvelope} className="h-4 w-4" />
              }
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default PartnerAndHelpSection;
