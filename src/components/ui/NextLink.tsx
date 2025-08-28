"use client"
import Link from 'next/link';
import React from 'react'

const NextLink = (props: {
  href: string;
  onClick?: () => void;
  linkLabel?: string;
  customClass?: string;
  hasChildren?: boolean;
  children?: React.ReactNode;
}) => {
  const { href, onClick = () => {}, linkLabel, customClass, hasChildren, children } = props;

  const renderer = () => {
    if (hasChildren) {
      return (
        <Link
          href={href}
          className={`${customClass} cursor-pointer text-sm-xs`}
          onClick={onClick}
          prefetch={false}
        >
          {children}{" "}
        </Link>
      );
    }
    return (
      <>
        <Link
          href={href}
          className={`${customClass} cursor-pointer text-sm-xs`}
          onClick={onClick}
          prefetch={false}
        >
          {linkLabel}{" "}
        </Link>
      </>
    );
  }
  return <>{renderer()}</>;
};

export default NextLink