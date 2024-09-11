import { Story } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { CardContent } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface IStoryColumn {
  stories: Story[];
}
export const StoryColumn: React.FC<IStoryColumn> = ({ stories }) => {
  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-bold">Tiên hiệp</h3>
        <Link
          href="/tien-hiep"
          className="flex items-center text-red-500 hover:underline"
          aria-label="Xem thêm truyện Tiên hiệp"
        >
          Xem thêm
          <ChevronRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
      <div className="mb-4">
        <CardContent className="p-4">
          <div className="flex space-x-4">
            <Image
              src={stories[0].coverImage || ''}
              alt={stories[0].title}
              width={80}
              height={120}
              className="rounded-md object-cover"
            />
            <div>
              <h4 className="font-semibold">{stories[0].title}</h4>
              <p className="line-clamp-2 text-sm text-muted-foreground">
                {stories[0].description}
              </p>
            </div>
          </div>
        </CardContent>
      </div>
      <ul className="space-y-2">
        {stories.slice(1).map((story) => (
          <li key={story.id}>
            <div className="flex items-center justify-between">
              <span className="truncate text-sm">{story.title}</span>
              <span className="text-sm text-muted-foreground">
                Chương {story.chapter}
              </span>
            </div>
            <Separator className="my-2" />
          </li>
        ))}
      </ul>
    </div>
  );
};
