import React from "react";

const SkeltonCard = () => {
  return (
    <>
      <div className=" p-2 flex flex-col  gap-4">
        <div className="grid grid-cols-12 gap-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div
              className="lg:col-span-3 md:col-span-4 col-span-6 border rounded shadow flex flex-col items-center justify-center gap-4 p-4"
              key={index}
            >
              <div className="skeleton w-12 h-12 rounded-full shrink-0"></div>
              <div className="skeleton h-4 w-[40%] " key={index}></div>
              <div className="skeleton h-4 w-[60%] " key={index}></div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

const SkeltopAllCategories = () => {
  const skeletons = Array.from({ length: 2 }, (_, index) => (
    <SkeltonCard key={index} />
  ));
  return (
    <>
      <div className="flex flex-col gap-8 w-full"> {skeletons}</div>
    </>
  );
};

export default SkeltopAllCategories;
