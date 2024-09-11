import { Story } from '@/types';
import Link from 'next/link';
import React from 'react';
import { StoryCard } from './story-card';

interface IFavoriteStories {
  stories: Story[];
}
export const FavoriteStories: React.FC<IFavoriteStories> = ({ stories }) => {
  return (
    <div className="container mx-auto px-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Truyện yêu thích</h2>
        <Link href="/more" className="text-blue-500 hover:underline">
          Xem thêm
        </Link>
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
