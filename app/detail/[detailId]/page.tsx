'use client';
import SimpleLayout from '@/components/layout/simple-layout';
import StoryChapter from '@/components/detail/story-chapter';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function DetailPage() {

    return (
        <SimpleLayout>
            <ScrollArea className="h-[calc(100dvh-140px)]">
                <div className="max-w-1366 mx-auto h-full">
                    <StoryChapter />
                </div>
            </ScrollArea>
        </SimpleLayout>
    );
}
