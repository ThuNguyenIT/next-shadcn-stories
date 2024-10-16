import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ReadingCustomization from "../detail/reading-customization";
import { useStoryStore } from "@/lib";
import { IIdChapter } from "@/types";
import { useParams, useRouter } from "next/navigation";

export default function NavigationBarFooter() {
  const { listChapter } = useStoryStore();
  const router = useRouter();
  const params = useParams();
  const slug = params.slug;
  const [currentChapterId, setCurrentChapterId] = useState<string | null>(null);

  const initialValue = Array.isArray(slug) && slug[1] ? slug[1] : "";
  useEffect(() => {
    if (Array.isArray(slug) && slug[1]) {
      setCurrentChapterId(slug[1]);
    }
  }, [slug]);
  const handleChange = useCallback(
    (newChapterId: string) => {
      if (Array.isArray(slug)) {
        const updatedSlug = [slug[0], newChapterId];
        router.push(`/${updatedSlug.join("/")}`);
      }
    },
    [router, slug]
  );
  const currentIndex = listChapter.findIndex(
    (chapter) => chapter.id.toString() === currentChapterId
  );

  // Handle next and previous navigation
  const handleNext = useCallback(() => {
    if (currentIndex < listChapter.length - 1) {
      const nextChapterId = listChapter[currentIndex + 1].id.toString();
      const updatedSlug = [slug[0], nextChapterId];
      router.push(`/${updatedSlug.join("/")}`);
    }
  }, [currentIndex, listChapter, router, slug]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      const prevChapterId = listChapter[currentIndex - 1].id.toString();
      const updatedSlug = [slug[0], prevChapterId];
      router.push(`/${updatedSlug.join("/")}`);
    }
  }, [currentIndex, listChapter, router, slug]);
  const handleHome = useCallback(() => {
    router.push(`/`);
  }, [router]);

  return (
    <nav
      className=' flex hidden items-center justify-between bg-light-blue px-4 py-2.5
    lg:block'
    >
      <div className='mx-auto flex w-full max-w-1366 justify-between'>
        <div className='flex items-center space-x-4'>
          <Button
            variant='ghost'
            size='sm'
            className='flex items-center space-x-2 text-gray-600 hover:bg-transparent hover:text-gray-800'
            onClick={handleHome}
          >
            <span className='mr-1 border border-dashed border-gray-400'>
              <Image
                src='/svg/icon-home.svg' // Path to your SVG in the public folder
                alt={""}
                width={32}
                height={32}
              />
            </span>
            <span className='text-sm'>Trang chủ</span>
          </Button>
          <ReadingCustomization />
        </div>

        <div className='flex items-center space-x-2'>
          <Button
            variant='ghost'
            size='icon'
            className='hover:bg-transparent'
            onClick={handlePrev}
            disabled={currentIndex <= 0}
          >
            <span className='mr-1 border border-dashed border-gray-400'>
              <Image
                src='/svg/icon-chevron-left-circle.svg'
                alt={""}
                width={32}
                height={32}
              />
            </span>
          </Button>
          <Select defaultValue={initialValue} onValueChange={handleChange}>
            <SelectTrigger className='w-[250px] rounded-[50px] border-gray-600'>
              <SelectValue placeholder={`Chương ${initialValue}`} />
            </SelectTrigger>
            <SelectContent>
              {listChapter.map((chapter: IIdChapter, index: number) => (
                <SelectItem key={index} value={chapter.id.toString()}>
                  {`Chương ${chapter.chapter_number}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant='ghost'
            size='icon'
            className='hover:bg-transparent'
            onClick={handleNext}
            disabled={currentIndex >= listChapter.length - 1}
          >
            <span className='mr-1 border border-dashed border-gray-400'>
              <Image
                src='/svg/icon-chevron-right-circle.svg'
                alt={""}
                width={32}
                height={32}
              />
            </span>
          </Button>
        </div>

        <div className='flex items-center space-x-4'>
          <Button
            variant='ghost'
            size='sm'
            className='flex items-center space-x-2 text-gray-600 hover:bg-transparent hover:text-gray-800'
          >
            <span className='mr-1 border border-dashed border-gray-400'>
              <Image
                src='/svg/icon-alert-triangle.svg' // Path to your SVG in the public folder
                alt={""}
                width={32}
                height={32}
              />
            </span>
            <span className='text-sm'>Báo lỗi truyện</span>
          </Button>
          <Button
            variant='ghost'
            size='sm'
            className='flex items-center space-x-2 text-gray-600 hover:bg-transparent hover:text-gray-800'
          >
            <span className='mr-1 border border-dashed border-gray-400'>
              <Image
                src='/svg/icon-heart.svg' // Path to your SVG in the public folder
                alt={""}
                width={32}
                height={32}
              />
            </span>
            <span className='text-sm'>Theo dõi</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}
