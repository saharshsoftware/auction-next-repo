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
  console.log("response", { response });
  return (
    <div className="text-left min-h-[345px]">
      <p className="text-lg font-bold">{question}</p>

      <div className="mt-4 min-h-[200px]">
        {type === "single-choice" && options && (
          <>
            <p className="text-sm text-gray-400 mb-2">Pick one: </p>

            <div className="grid grid-cols-2 gap-2">
              {options.map((option) => (
                <label
                  key={option}
                  className={`flex justify-center items-center border border-blue-500 text-blue-500 font-medium px-4 py-2 rounded-lg cursor-pointer transition-all hover:bg-blue-100 peer-checked:bg-blue-500 peer-checked:text-white  ${
                    response === option ? "bg-blue-400 text-white" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name={question}
                    value={option}
                    checked={response === option}
                    onChange={() => onChange(option)}
                    className="peer hidden"
                  />
                  {option}
                </label>
              ))}
            </div>
          </>
        )}

        {type === "multiple-choice" && options && (
          <>
            <p className="text-sm text-gray-400 mb-2">Pick one or more: </p>
            <div className="grid grid-cols-2 gap-2">
              {options.map((option) => (
                <label
                  key={option}
                  className={`flex justify-center items-center border border-blue-500 text-blue-500 font-medium px-4 py-2 rounded-lg cursor-pointer transition-all hover:bg-blue-100 peer-checked:bg-blue-500 peer-checked:text-white ${
                    response?.includes(option) ? "bg-blue-400 text-white" : ""
                  }`}
                >
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
                    className="peer hidden"
                  />
                  {option}
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
