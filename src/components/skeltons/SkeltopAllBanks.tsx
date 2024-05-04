import React from "react";

const SkeltonCard = () => {
  return (
    <>
      <div className="rounded shadow p-2 flex flex-col border border-blue-400 gap-4">
        <div className="skeleton w-12 h-12 rounded-full shrink-0"></div>
        <div className="grid grid-cols-12 gap-4">
          {Array.from({ length: 5 }, (_, index) => (
            <div
              className="skeleton h-4 w-full lg:col-span-3 md:col-span-4 col-span-6"
              key={index}
            ></div>
          ))}
        </div>
      </div>
    </>
  );
};

const SkeltopAllBanks = () => {
  const skeletons = Array.from({ length: 5 }, (_, index) => (
    <SkeltonCard key={index} />
  ));
  return (
    <>
      <div className="flex flex-col gap-8 w-full"> {skeletons}</div>
    </>
  );
};

export default SkeltopAllBanks;
