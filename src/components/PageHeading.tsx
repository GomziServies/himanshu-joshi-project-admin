import React from 'react';

export interface PageHeadingProps {
  hindi: string;
  title: string;
  action?: React.ReactNode;
}

export const PageHeading: React.FC<PageHeadingProps> = ({ hindi, title, action }) => (
  <div className="flex flex-wrap items-end justify-between gap-4">
    <div>
      <p lang="hi" className="font-deva text-lg leading-snug text-marigold-600">{hindi}</p>
      <h1 className="font-title text-3xl text-ink sm:text-4xl">{title}</h1>
    </div>
    {action}
  </div>
);

export default PageHeading;
