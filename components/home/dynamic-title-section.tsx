
import Link from 'next/link';
import React from 'react';

interface IDynamicTitleSection {
    title: string;
    href: string;
    linkText?: string
}
export const DynamicTitleSection: React.FC<IDynamicTitleSection> = ({ title, href, linkText }) => {
    return (
        <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold">{title}</h2>
            {linkText && (<Link href={href} className="text-blue-500 hover:underline">
                {linkText}
            </Link>)}

        </div>
    );
};
