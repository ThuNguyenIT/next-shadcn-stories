import Link from 'next/link';
import React from 'react';
import Image from 'next/image';

interface IDynamicTitleSection {
  title: string;
  href: string;
  linkText?: string;
}
export const DynamicTitleSection: React.FC<IDynamicTitleSection> = ({
  title,
  href,
  linkText
}) => {
  return (
    <div className="mb-5 flex items-center justify-between">
      <h2 className="text-textPrimary text-size-20 font-normal">{title}</h2>
      {linkText && (
        <Link
          href={href}
          className="align-center flex justify-center gap-2 text-base font-normal text-red-400 no-underline hover:underline"
        >
          <Image
            src="/svg/icon-circle-plus.svg" // Path to your SVG in the public folder
            alt={linkText}
            width={14}
            height={14}
          />
          {linkText}
        </Link>
      )}
    </div>
  );
};
