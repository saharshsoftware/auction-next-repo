"use client";

import { Plan } from "@/types";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface PlanCardProps {
  plan: Plan;
  isSelected: boolean;
  onSelect: () => void;
}

export default function PlanCard({ plan, isSelected, onSelect }: PlanCardProps) {

  // we can keep the plan name as it is and use it in the UI

  const gradientClasses = {
    mobile: "from-blue-700 to-blue-500",
    basic: "from-blue-700 via-purple-600 to-purple-500",
    standard: "from-blue-700 via-purple-600 to-blue-500",
    premium: "from-purple-700 via-purple-600 to-red-500"
  };


  return (
    <div
      className={`
        rounded-lg p-6 cursor-pointer transition-all duration-200 relative border-2 ${isSelected ? "border-primary" : "border-border hover:border-primary/50"}
      `}
      onClick={onSelect}
    >
      <div
        className={`
          absolute inset-0 rounded-lg bg-gradient-to-br opacity-10 ${gradientClasses['premium' as keyof typeof gradientClasses]}
        `}
      />

      {isSelected && (
        <div className="absolute -top-3 -right-3 bg-primary rounded-full py-1 px-2">
          <FontAwesomeIcon icon={faCheck} className="w-4 h-4 text-white" />
        </div>
      )}

      <div className="relative">
        <h3 className={`text-xl font-bold mb-2 ${isSelected ? "text-primary" : "text-foreground"}`}>
          {plan.name}
        </h3>
        <div className="text-2xl font-bold mb-4">₹{plan.price}</div>

        <div className="space-y-3 text-sm">
          <div>
            <div className="font-medium">No. of alerts</div>
            <div className="text-muted">{"5 (static)"}</div>
          </div>
          <div>
            <div className="font-medium">No. of saved searches</div>
            <div className="text-muted">{"15 (static)"}</div>
          </div>
          <div>
            <div className="font-medium">Wishlists</div>
            <div className="text-muted">{"25 (static)"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}