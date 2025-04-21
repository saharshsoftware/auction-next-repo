"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faInbox } from "@fortawesome/free-solid-svg-icons";
import { AlertCard } from "./AlertCard";

import { SectionHeader } from "./SectionHeader";
import ActionButton from "./ActionButton";
import { StepsList } from "./StepsList";
import Image from "next/image";
import useModal from "@/hooks/useModal";
import CreateAlert from "../ modals/CreateAlert";
import LoginComp from "../templates/LoginComp";
import { useRouter } from "next/navigation";
import LoginModal from "../ modals/LoginModal";
import saveAlertGif from "@/assets/gifs/save-alert.gif";

interface Alert {
  id: string;
  name: string;
  assetCategory: string;
  bankName: string;
  location: string;
  maxPrice: number;
  minPrice: number;
  type: string;
  assetType: string;
  matchCount?: number;
}

interface AlertsSectionProps {
  alerts: Alert[];
  isAuthenticated?: boolean;
}

const instructionsData = [
  {
    id: 1,
    text: "Open the “Your Alerts” page",
  },
  {
    id: 2,
    text: "Click the “Add Alert” button",
  },
  {
    id: 3,
    text: "Hit “Create Alert” and stay notified",
  },
];

export function AlertsSection({
  alerts,
  isAuthenticated = false,
}: AlertsSectionProps) {
  const { showModal, openModal, hideModal } = useModal();
  const router = useRouter();

  const handleCloseCreateAlert = () => {
    hideModal();
    router.refresh();
  };

  const renderModalContainer = () => {
    if (isAuthenticated) {
      return (
        <CreateAlert openModal={openModal} hideModal={handleCloseCreateAlert} />
      );
    }
    return (
      <LoginModal openModal={openModal} hideModal={handleCloseCreateAlert} />
    );
  };

  if (alerts.length === 0) {
    return (
      <>
        <SectionHeader
          title="Smart Property"
          highlightedText="Alerts"
          description="Never miss your dream property! Get instant notifications when properties matching your criteria hit the market. Set up personalized alerts and stay ahead of other buyers."
        />

        <div className="py-12">
          <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto items-center lg:items-start">
            <div className="flex-1 w-full lg:self-center">
              <StepsList steps={instructionsData} />
              <div className="text-center mt-8">
                <ActionButton
                  text="Login To Create Alert"
                  onclick={showModal}
                  iconLeft={
                    <FontAwesomeIcon icon={faBell} className="h-4 w-4 " />
                  }
                />
              </div>
            </div>
            <div className="flex-1 lg:self-center">
              <div className="text-center lg:text-left mb-6">
                <h3 className="text-2xl font-semibold mb-4">
                  Stay Ahead with Property Alerts
                </h3>
                <p className="text-gray-600">
                  Be the first to know when your perfect property becomes
                  available. Follow these steps to set up your personalized
                  alerts.
                </p>
              </div>
              <div className="relative w-full max-w-md mx-auto lg:mx-0">
                <Image
                  src={saveAlertGif.src}
                  alt="How to set up alerts"
                  width={400}
                  height={300}
                  className="rounded-lg shadow-md w-full"
                />
              </div>
            </div>
          </div>
        </div>
        {openModal ? renderModalContainer() : null}
      </>
    );
  }

  const gridCols =
    alerts.length === 1 ? "md:grid-cols-1" : "md:grid-cols-2 lg:grid-cols-3";

  return (
    <>
      <SectionHeader
        title="Your Property"
        highlightedText="Alerts"
        description="Stay ahead of the market with personalized property alerts! Set up alerts for your preferred locations and property types, and never miss out on the perfect investment opportunity."
      />

      <div
        className={`grid grid-cols-1 ${gridCols} gap-6 mb-8 ${
          alerts.length === 1 ? "max-w-md mx-auto" : ""
        }`}
      >
        {alerts.map((alert) => (
          <AlertCard key={alert.id} data={alert} />
        ))}
      </div>
    </>
  );
}
