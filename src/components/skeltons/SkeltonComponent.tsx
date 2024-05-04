import React from "react";

export const Skelton = () => {
  return (
    <>
      <div className="flex flex-col gap-4 w-full justify-center">
        <div className="flex gap-4 items-center justify-center">
          <div className="skeleton w-16 h-16 rounded-full shrink-0"></div>
        </div>
        <div className="flex flex-col gap-4 items-center justify-center">
          <div className="skeleton h-4 w-full "></div>
          <div className="skeleton h-4 w-full"></div>
        </div>
      </div>
    </>
  );
};

const BankSkelton = () => {
  return (
    <>
      <div className="flex flex-col gap-4 w-full justify-center">
        <div className="skeleton h-4 w-full"></div>
      </div>
    </>
  );
};

const SkeltonComponent = () => {
  const skeletonsCategory = Array.from({ length: 5 }, (_, index) => (
    <Skelton key={index} />
  ));

  const skeletonsBank = Array.from({ length: 5 }, (_, index) => (
    <BankSkelton key={index} />
  ));

  return (
    <>
      <div className="flex flex-col gap-8">
        {" "}
        <div className="flex flex-col gap-4">
          <div className="text-center">
            <div className="skeleton h-4 w-28 "></div>
          </div>
          <div className="grid lg:grid-cols-5 md:grid-cols-3 gap-5">
            {skeletonsCategory}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="text-center">
            <div className="skeleton h-4 w-28 "></div>
          </div>
          <div className="grid lg:grid-cols-5 md:grid-cols-3 gap-5">
            {skeletonsBank}
          </div>
        </div>
      </div>
    </>
  );
};

export default SkeltonComponent;
