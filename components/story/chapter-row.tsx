import { cn } from "@/lib/utils";
import { Chapter, Story } from "@/types";

export const ChapterRow: React.FC<{
  story: Story;
  chapter: Chapter;
  isEven: boolean;
}> = ({ story, chapter, isEven }) => {
  return (
    <div
      className={cn("flex justify-between p-3 border-b border-gray-300 my-4")}
    >
      <a href={`/${story?.slug}/${chapter.id}`} className='text-black text-sm'>
        {chapter.title}
      </a>
      <span className='italic text-gray-600 text-sm'>{chapter.updated_at}</span>
    </div>
  );
};
