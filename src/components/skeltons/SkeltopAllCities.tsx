import React from "react";

const SkeltonCard = () => {
  return (
    <>
      <div className="flex flex-col gap-4 w-full justify-center min-h-40 p-4 border border-blue-400 rounded shadow">
        <div className="skeleton h-4 w-[15%] "></div>
        <div className="grid grid-cols-12 gap-4">
          {Array.from({ length: 5 }, (_, index) => (
            <div
              className="skeleton h-4 w-fulllg:col-span-3 md:col-span-4 col-span-6"
              key={index}
            ></div>
          ))}
        </div>
      </div>
    </>
  );
};

const SkeltopAllCities = () => {
  const skeletons = Array.from({ length: 5 }, (_, index) => (
    <SkeltonCard key={index} />
  ));
  return (
    <>
      <div className="flex flex-col gap-12 w-full"> {skeletons}</div>
    </>
  );
};

export default SkeltopAllCities;
