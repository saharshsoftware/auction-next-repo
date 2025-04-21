import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faBookmark } from "@fortawesome/free-solid-svg-icons";
import { SavedSearchCard } from "./SavedSearchCard";
import { SectionHeader } from "./SectionHeader";
import ActionButton from "./ActionButton";
import { StepsList } from "./StepsList";
import Image from "next/image";
import CustomReactCarouselForSection from "./CustomReactCarouselForSection";
import ImageTag from "../ui/ImageTag";

interface SavedSearch {
  id: number;
  name: string;
  filters: string;
  lastUpdated: string;
  matchCount: number;
}

interface SavedSearchesSectionProps {
  savedSearches: SavedSearch[];
}

const instructionsData = [
  {
    id: 1,
    text: "Use filters to search for properties",
  },
  {
    id: 2,
    text: "Click the “Save this Search” button shown in the top",
  },
  {
    id: 3,
    text: "Name your search for easy reference",
  },
  {
    id: 4,
    text: "Access it anytime from “Your Saved Searches”",
  },
];

export function SavedSearchesSection({
  savedSearches,
}: SavedSearchesSectionProps) {
  if (savedSearches.length === 0) {
    return (
      <>
        <SectionHeader
          title="Quick Access"
          highlightedText="Searches"
          description="Save time on your property hunt! Store your search preferences and filters for instant access. Get notified about new properties that match your saved criteria."
        />

        <div className="py-12">
          <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto items-center lg:items-start">
            <div className="flex-1 lg:self-center">
              <div className="text-center lg:text-left mb-6">
                <h3 className="text-2xl font-semibold mb-4">
                  Streamline Your Property Search
                </h3>
                <p className="text-gray-600">
                  Stop repeating your search filters every time. Save your
                  preferences once and access them instantly with these simple
                  steps.
                </p>
              </div>
              <div className="relative w-full max-w-md mx-auto lg:mx-0">
                <CustomReactCarouselForSection>
                  <Image
                    src={require("@/assets/images/1.png")}
                    alt="How to save searches"
                    width={400}
                    height={300}
                    className="rounded-lg shadow-lg w-full"
                  />
                  <Image
                    src={require("@/assets/images/2.png")}
                    alt="How to save searches"
                    width={400}
                    height={300}
                    className="rounded-lg shadow-md w-full"
                  />
                  <Image
                    src={require("@/assets/images/3.png")}
                    alt="How to save searches"
                    width={400}
                    height={300}
                    className="rounded-lg shadow-md w-full"
                  />
                </CustomReactCarouselForSection>
              </div>
            </div>
            <div className="flex-1 w-full lg:self-center">
              <StepsList steps={instructionsData} />
            </div>
          </div>
        </div>
      </>
    );
  }

  const gridCols =
    savedSearches.length === 1
      ? "md:grid-cols-1"
      : "md:grid-cols-2 lg:grid-cols-3";

  return (
    <>
      <SectionHeader
        title="Your Saved"
        highlightedText="Searches"
        description="Access your customized property searches instantly! We'll keep track of your preferred filters and show you new matches as they become available."
      />

      <div
        className={`grid grid-cols-1 ${gridCols} gap-6 mb-8 ${
          savedSearches.length === 1 ? "max-w-md mx-auto" : ""
        }`}
      >
        {savedSearches.map((search) => (
          <SavedSearchCard key={search.id} name={search.name} data={search} />
        ))}
      </div>
    </>
  );
}
