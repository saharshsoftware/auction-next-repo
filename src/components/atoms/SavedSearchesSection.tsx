import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faBookmark } from "@fortawesome/free-solid-svg-icons";
import { SavedSearchCard } from "./SavedSearchCard";
import { SectionHeader } from "./SectionHeader";
import ActionButton from "./ActionButton";

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

export function SavedSearchesSection({
  savedSearches,
}: SavedSearchesSectionProps) {
  if (savedSearches.length === 0) {
    return (
      <>
        <SectionHeader
          title="Your Saved"
          highlightedText="Searches"
          description="Access your customized property searches instantly! We'll keep track of your preferred filters and show you new matches as they become available."
        />

        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <FontAwesomeIcon
              icon={faBookmark}
              className="h-8 w-8 text-gray-400"
            />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Saved Searches
          </h3>
          <p className="text-gray-500 mb-6">
            Save your search preferences to quickly find properties that match
            your criteria.
          </p>
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
          <SavedSearchCard
            key={search.id}
            name={search.name}
            filter={search.filters}
            data={search}
          />
        ))}
      </div>
    </>
  );
}
