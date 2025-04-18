interface Step {
  id: number;
  text: string;
}

interface StepsListProps {
  steps: Step[];
}

export function StepsList({ steps }: StepsListProps) {
  return (
    <div className="space-y-4 max-w-md mx-auto">
      {steps.map((step) => (
        <div key={step.id} className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold">{step.id}</span>
            </div>
            <p className="text-gray-700 text-left">{step.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
