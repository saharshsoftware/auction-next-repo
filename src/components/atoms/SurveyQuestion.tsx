import { ISurveyOptions } from "@/types";
import React from "react";

interface SurveyQuestionProps {
  questionKey: string;
  question: string;
  optionsData: ISurveyOptions[];
  options?: string[];
  type: "single-choice" | "multiple-choice" | "open-ended";
  response: any;
  onChange: (value: any) => void;
}

const SurveyQuestion: React.FC<SurveyQuestionProps> = ({
  question,
  questionKey,
  optionsData,
  options,
  type,
  response,
  onChange,
}) => {
  console.log("response", { response, optionsData });
  return (
    <div className="text-left min-h-[345px]">
      <p className="text-lg font-bold">{question}</p>

      <div className="mt-4 min-h-[200px]">
        {type === "single-choice" && optionsData && (
          <>
            <p className="text-sm text-gray-400 mb-2">Pick one: </p>

            <div className="grid grid-cols-2 gap-2">
              {optionsData.map((option) => (
                <label
                  key={option.label}
                  className={`flex justify-center items-center border border-blue-500 text-blue-500 font-medium px-4 py-2 rounded-lg cursor-pointer transition-all md:hover:bg-blue-100 peer-checked:bg-blue-500 peer-checked:text-white  ${
                    response === option.label ? "bg-blue-400 text-white" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name={question}
                    value={option.label}
                    checked={response === option.label}
                    onChange={() => onChange(option.label)}
                    className="peer hidden"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </>
        )}

        {type === "multiple-choice" && optionsData && (
          <>
            <p className="text-sm text-gray-400 mb-2">Pick one or more: </p>
            <div className="grid grid-cols-2 gap-2">
              {optionsData.map((option) => (
                <label
                  key={option.label}
                  className={`flex justify-center items-center border border-blue-500 text-blue-500 font-medium px-4 py-2 rounded-lg cursor-pointer transition-all md:hover:bg-blue-100 ${
                    response?.includes(option.label)
                      ? "bg-blue-400 text-white"
                      : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    value={option.label}
                    checked={response?.includes(option.label)}
                    onChange={(e) => {
                      const valueArray = Array.isArray(response)
                        ? [...response]
                        : [];
                      console.log("valueArray before change", valueArray);

                      if (e.target.checked) {
                        onChange([...valueArray, option.label]); // Store only the label, not the full object
                      } else {
                        onChange(
                          valueArray.filter((val) => val !== option.label)
                        );
                      }
                    }}
                    className="peer hidden"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </>
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
