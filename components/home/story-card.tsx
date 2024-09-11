import { Story } from '@/types';
import Image from 'next/image';
import { CardContent } from '@/components/ui/card';

interface IStoryCard {
  story: Story;
}
export const StoryCard: React.FC<IStoryCard> = ({ story }) => {
  return (
    <div key={story.id} className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex space-x-4">
          <Image
            src={story.coverImage}
            alt={story.title}
            width={80}
            height={100}
            className="object-cover"
          />
          <div className="space-y-1">
            <h3 className="line-clamp-2 font-semibold">{story.title}</h3>
            <p className="text-sm text-muted-foreground">{story.author}</p>
            <p>Chương {story.chapter}</p>
            <span>Cập nhật: {story.updatedAt}</span>
          </div>
        </div>
      </CardContent>
    </div>
  );
};
