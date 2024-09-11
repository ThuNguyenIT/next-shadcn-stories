import { Story } from '@/types';
import React from 'react';
import { StoryCard } from './story-card';
import { DynamicTitleSection } from './dynamic-title-section';

interface ICompletedStories {
  stories: Story[];
}
export const CompletedStories: React.FC<ICompletedStories> = ({ stories }) => {
  return (

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2">
      {stories.map((story) => (
        <React.Fragment key={story.id}>
          <StoryCard story={story} />
        </React.Fragment>
      ))}
    </div>
  );
};
