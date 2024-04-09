import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface IBoxCollection {
  heading: string;
  fetchData?: any;
  hasChildren?: boolean;
  children?: React.ReactNode;
}

interface ICommonChildContainer {
  name?: string;
  icon?: string;
  total?: number;
}

export const CommonChildContainer = (props: ICommonChildContainer) => {
  const { icon, total, name } = props;
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4 border rounded shadow w-full transform transition-transform duration-300 scale-95 hover:scale-100 cursor-pointer">
      <em className="h-1/2 w-full collection-icon text-center">
        <div dangerouslySetInnerHTML={{ __html: icon ?? "-" }} />
      </em>
      <div className="text-xs">{total ?? "-"}</div>
      <div className="text-xs font-semibold">{name ?? ""}</div>
    </div>
  );
};

const BoxCollection = (props: IBoxCollection) => {
  const { heading, hasChildren, children, fetchData } = props;

  const renderChild = () => {
    if (hasChildren) {
      return (
        <div className="grid lg:grid-cols-6 gap-4 mx-auto">{children}</div>
      );
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="text-center text-2xl font-semibold">{heading}</div>
        {renderChild()}
      </div>
    </>
  );
};

export default BoxCollection;
