"use client";
import { AlertsSection } from "../atoms/AlertsSection";
import { SavedSearchesSection } from "../atoms/SavedSearchesSection";
import { WishlistSection } from "../atoms/WishlistSection";
import { HelpCircle } from "lucide-react";

interface IHelpPageTemplateProps {
  isAuthenticated: boolean;
}

export default function HelpPageTemplate(props: IHelpPageTemplateProps) {
  const { isAuthenticated } = props;

  return (
    <div className="min-h-screen ">


      {/* Main Content */}
      <div className="pb-8 sm:pb-12">
        {/* Quick Access Searches Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-50"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
            <SavedSearchesSection savedSearches={[]} hideSignupButton={!isAuthenticated} />
          </div>
        </section>

        {/* Smart Property Alerts Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-teal-50 opacity-50"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
            <AlertsSection
              alerts={[]}
              isAuthenticated={isAuthenticated}
              hideSignupButton={!isAuthenticated}
            />
          </div>
        </section>

        {/* Your Wishlist Collections Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-pink-50 opacity-50"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
            <WishlistSection
              favoriteLists={[]}
              isAuthenticated={isAuthenticated}
            />
          </div>
        </section>
      </div>

    </div>
  );
}
