import { Check } from "lucide-react";

interface Step {
  id: number;
  text: string;
}

interface StepsListProps {
  steps: Step[];
}

export function StepsList({ steps }: StepsListProps) {
  return (
    <div className="relative max-w-lg mx-auto px-4 sm:px-0">
      {/* Connecting line - Hidden on mobile for cleaner look */}
      <div className="hidden sm:block absolute left-6 top-12 bottom-12 w-0.5 bg-gradient-to-b from-blue-200 to-blue-400"></div>

      <div className="space-y-4 sm:space-y-6">
        {steps.map((step, index) => (
          <div key={step.id} className="relative flex items-start gap-3 sm:gap-4 group">
            {/* Step number */}
            <div className="flex-shrink-0 relative">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                <span className="text-white font-bold text-base sm:text-lg">{step.id}</span>
              </div>
              {/* Connecting dot - Hidden on mobile */}
              {index < steps.length - 1 && (
                <div className="hidden sm:block absolute top-12 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-300 rounded-full"></div>
              )}
            </div>

            {/* Step content */}
            <div className="flex-1 bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 group-hover:border-blue-200">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                </div>
                <p className="text-gray-700 leading-relaxed font-medium text-sm sm:text-base">{step.text}</p>
              </div>

              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-blue-50 opacity-0 group-hover:opacity-50 transition-opacity duration-300 rounded-xl"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
