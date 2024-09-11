import { Story } from '@/types';
import React from 'react';
import { StoryCard } from './story-card';
import { DynamicTitleSection } from './dynamic-title-section';

interface IPopularStories {
  stories: Story[];
}
export const PopularStories: React.FC<IPopularStories> = ({ stories }) => {
  return (
    <div className="container mx-auto px-4">
      <DynamicTitleSection title={'Truyện được xem nhiều'} href={'/more'} linkText='Xem thêm' />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2">
        {stories.map((story) => (
          <React.Fragment key={story.id}>
            <StoryCard story={story} />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
