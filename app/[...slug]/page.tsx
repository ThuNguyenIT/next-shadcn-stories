'use client';
import SimpleLayout from '@/components/layout/simple-layout';
import StoryChapter from '@/components/detail/story-chapter';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useParams } from 'next/navigation';
import { createAxiosInstance } from '@/utils/axiosInstance';
import { useStoryStore } from '@/lib';
import { Chapter, GetLatestChapterResponse } from '@/types';
import { useEffect } from 'react';

export default function Page() {
    const params = useParams();
    const slug = params.slug;
    const { storyDetail, chapter, setChapter } = useStoryStore()
    const axiosInstance = createAxiosInstance();

    const getLatestChapter = async (slug: string | string[]) => {

        const response = await axiosInstance.get<GetLatestChapterResponse<Chapter>>(`/api/chapters/latest`, { params: { slug } });
        const { data } = response;
        if (data?.message === "Success") {
            setChapter(data.data)
        }
    };

    useEffect(() => {
        if (storyDetail) {
            getLatestChapter(slug);
        }
    }, [storyDetail]);
    return (
        <SimpleLayout>
            <ScrollArea className="h-[calc(100dvh-140px)]">
                <div className="max-w-1366 mx-auto h-full">
                    <h1>Path :- {Array.isArray(slug) ? slug.join('/') : slug}</h1>
                    <StoryChapter />
                </div>
            </ScrollArea>
        </SimpleLayout>
    );
}