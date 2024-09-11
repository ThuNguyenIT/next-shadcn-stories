import { Story } from '@/types';
import React from 'react';
import { StoryCard } from './story-card';

interface ICompletedStories {
  stories: Story[];
}
export const CompletedStories: React.FC<ICompletedStories> = ({ stories }) => {
  return (
    <div className="container mx-auto px-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Truyện đã hoàn thành</h2>
      </div>
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
