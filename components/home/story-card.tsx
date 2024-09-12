import { Story } from '@/types';
import Image from 'next/image';

interface IStoryCard {
  story: Story;
}
export const StoryCard: React.FC<IStoryCard> = ({ story }) => {
  return (
    <div key={story.id} className="overflow-hidden">
      <div className="">
        <div className="flex space-x-4">
          <Image
            src={story.coverImage}
            alt={story.title}
            width={80}
            height={100}
            className="object-cover"
          />
          <div className="space-y-1">
            <h3 className="line-clamp-2 font-normal text-black">
              {story.title}
            </h3>
            <p className="leading-18px text-sm font-normal text-gray-600 text-muted-foreground">
              {story.author}
            </p>
            <p className="text-sm font-normal text-gray-600">
              Chương {story.chapter}
            </p>
            <span className="text-13px italic text-gray-600">
              Cập nhật: {story.updatedAt}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
