import React from "react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLayoutStore, useStoryStore } from "@/lib";

export default function StoryChapter() {
  const { textColor } = useLayoutStore();
  const { storyDetail, chapter } = useStoryStore();
  return (
    <div className='mx-auto bg-transparent text-gray-300'>
      <CardHeader className='space-y-1 p-4'>
        <CardTitle className='text-2xl font-medium text-male-blue text-center'>
          {storyDetail?.title}
        </CardTitle>
        <p className='text-sm text-gray-400 text-center'>
          Tác giả:{" "}
          <span className='text-15px text-male-blue'>
            {storyDetail?.author?.name}
          </span>{" "}
        </p>
      </CardHeader>
      <CardContent className='space-y-4 p-4'>
        <h2 className='text-xl font-bold text-custom-gray text-center mb-6'>
          Chương {chapter?.chapter_number}: {chapter?.title}
        </h2>
        <div
          className={`text-${textColor} grid gap-y-4 text-justify leading-10`}
        >
          {chapter?.content}
        </div>
      </CardContent>
    </div>
  );
}
