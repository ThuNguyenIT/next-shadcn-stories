import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import TextFormattingPanel from "../detail/text-formatting-panel";
import { useStoryStore } from "@/lib";
import { useParams, useRouter } from "next/navigation";

export default function MobileNavigation() {
  const { listChapter } = useStoryStore();
  const router = useRouter();
  const params = useParams();
  const slug = params.slug;
  const [currentChapterId, setCurrentChapterId] = useState<string | null>(null);

  useEffect(() => {
    if (Array.isArray(slug) && slug[1]) {
      setCurrentChapterId(slug[1]);
    }
  }, [slug]);
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

  return (
    <div className='fixed bottom-0 left-0 right-0 block border-t bg-background lg:hidden'>
      <nav className='flex h-16 items-center justify-around'>
        <Link
          href={"/"}
          className='flex h-full flex-col items-center justify-center hover:bg-transparent'
        >
          <Image src='/svg/icon-home.svg' alt={""} width={32} height={32} />
        </Link>
        <TextFormattingPanel />
        <Button
          variant='ghost'
          size='icon'
          className='flex h-full flex-col items-center justify-center hover:bg-transparent'
          onClick={handlePrev}
          disabled={currentIndex <= 0}
        >
          <Image
            src='/svg/icon-chevron-left-circle.svg'
            alt={""}
            width={32}
            height={32}
          />
        </Button>
        <Button
          variant='ghost'
          size='icon'
          className='flex h-full flex-col items-center justify-center hover:bg-transparent'
          onClick={handleNext}
          disabled={currentIndex >= listChapter.length - 1}
        >
          <Image
            src='/svg/icon-chevron-right-circle.svg'
            alt={""}
            width={32}
            height={32}
          />
        </Button>
        <Button
          variant='ghost'
          size='icon'
          className='flex h-full flex-col items-center justify-center hover:bg-transparent'
        >
          <Image
            src='/svg/icon-alert-triangle.svg'
            alt={""}
            width={32}
            height={32}
          />
        </Button>
        <Button
          variant='ghost'
          size='icon'
          className='flex h-full flex-col items-center justify-center hover:bg-transparent'
        >
          <Image src='/svg/icon-heart.svg' alt={""} width={32} height={32} />
        </Button>
      </nav>
    </div>
  );
}
