import React from "react";

interface SurveyQuestionProps {
  question: string;
  options?: string[];
  type: "single-choice" | "multiple-choice" | "open-ended";
  response: any;
  onChange: (value: any) => void;
}

const SurveyQuestion: React.FC<SurveyQuestionProps> = ({
  question,
  options,
  type,
  response,
  onChange,
}) => {
  return (
    <div className="text-left min-h-[250px]">
      <p className="text-lg font-semibold">{question}</p>

      <div className="mt-4 min-h-[200px] ">
        {type === "single-choice" && options && (
          <div className="flex flex-col gap-2">
            {options.map((option) => (
              <label key={option} className="flex items-left gap-2">
                <input
                  type="radio"
                  name={question}
                  value={option}
                  checked={response === option}
                  onChange={() => onChange(option)}
                />
                {option}
              </label>
            ))}
          </div>
        )}

        {type === "multiple-choice" && options && (
          <div className="flex flex-col gap-2">
            {options.map((option) => (
              <label key={option} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={option}
                  checked={response?.includes(option)}
                  onChange={(e) => {
                    const valueArray = response || [];
                    if (e.target.checked) {
                      onChange([...valueArray, option]);
                    } else {
                      onChange(
                        valueArray.filter((val: string) => val !== option)
                      );
                    }
                  }}
                />
                {option}
              </label>
            ))}
          </div>
        )}

        {type === "open-ended" && (
          <textarea
            className="w-full border p-2 rounded mt-2"
            placeholder="Type your answer..."
            value={response || ""}
            onChange={(e) => onChange(e.target.value)}
          />
        )}
      </div>
    </div>
  );
};

export default SurveyQuestion;
