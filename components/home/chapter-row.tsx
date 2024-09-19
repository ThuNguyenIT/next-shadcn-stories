import { cn } from '@/lib/utils';
import { Chapter } from '@/types';

export const ChapterRow: React.FC<{ chapter: Chapter; isEven: boolean }> = ({
  chapter,
  isEven
}) => (
  <div className={cn('flex justify-between px-4 py-2')}>
    <a href="#" className="text-male-blue hover:underline">
      {chapter.title}
    </a>
    <span className="italic text-gray-600 text-sm">{chapter.date}</span>
  </div>
);
