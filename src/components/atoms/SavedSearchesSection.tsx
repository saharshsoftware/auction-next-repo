"use client";
import { SavedSearchCard } from "./SavedSearchCard";
import { SectionHeader } from "./SectionHeader";
import InstructionSavedSearchesSection from "../molecules/InstructionSavedSearchesSection";

export interface SavedSearchSectionData {
  id: number;
  name: string;
  filters: string;
  lastUpdated: string;
  matchCount: number;
}

interface SavedSearchesSectionProps {
  savedSearches: SavedSearchSectionData[];
}

export function SavedSearchesSection({
  savedSearches,
}: SavedSearchesSectionProps) {


  if (savedSearches.length === 0) {
    return (
      <>
        <InstructionSavedSearchesSection />
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
