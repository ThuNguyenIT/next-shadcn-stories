import React, { useEffect, useState } from "react"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLayoutStore, useStoryStore } from "@/lib"
import { createAxiosInstance } from "@/utils/axiosInstance"
import { Chapter, GetLatestChapterResponse } from "@/types"

export default function StoryChapter() {
    const { textColor } = useLayoutStore()
    const { storyDetail } = useStoryStore()
    const axiosInstance = createAxiosInstance();
    const [chapter, setChapter] = useState<Chapter | null>(null)

    const getLatestChapter = async (story_id: number) => {
        const response = await axiosInstance.get<GetLatestChapterResponse<Chapter>>(`/api/chapters/latest`, { params: { story_id } });
        const { data } = response;
        if (data?.message === "Success") {
            setChapter(data.data)
        }

    };

    useEffect(() => {
        if (storyDetail) {
            getLatestChapter(storyDetail.id);
        }
    }, [storyDetail]);


    return (
        <div className="mx-auto bg-transparent text-gray-300">
            <CardHeader className="space-y-1 p-4">
                <CardTitle className="text-2xl font-medium text-male-blue text-center">
                    {storyDetail?.title}
                </CardTitle>
                <p className="text-sm text-gray-400 text-center">Tác giả: <span className="text-15px text-male-blue">{storyDetail?.author?.name}</span> </p>
            </CardHeader>
            <CardContent className="space-y-4 p-4">
                <h2 className="text-xl font-bold text-custom-gray text-center mb-6">
                    {/* Chương 5: Vạn nhất nếm đi mạng nhỏ làm thế nào */}
                    Chương {chapter?.id}: {chapter?.title}
                </h2>
                <div className={`text-[${textColor}] grid gap-y-4 text-justify`}>

                    {chapter?.content}
                </div>
            </CardContent>
        </div>
    )
}