"use client";
import PageContainer from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Eye, Heart, ThumbsUp } from "lucide-react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Chapter, GetStoryBySlugResponse, IComment, Story, StoryData } from "@/types";
import { ChapterRow } from "@/components/story/chapter-row";
import { CommentStory } from "@/components/story/comment-story";
import Pagination from "@/components/home/pagination";
import CommentForm from "@/components/story/comment-form";
import { SameGenreStories } from "@/components/story/same-genre-stories";
import { sameGenreStories } from "@/constants/data";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { createAxiosInstance } from "@/utils/axiosInstance";
import { Skeleton } from "@/components/ui/skeleton";
import { useStoryStore } from "@/lib";
interface IState {
  activeButton: string;
  currentPage: number
  totalPages: number
  loading: boolean
}

interface ButtonOption {
  label: string;
  value: string;
  link?: string;
}

const buttonOptions: ButtonOption[] = [
  { label: "Đọc truyện", value: "doc-truyen", link: "/detail/abc" },
  { label: "Yêu thích", value: "yeu-thich" },
  { label: "Theo dõi", value: "theo-doi" },
];



const comments: IComment[] = [
  {
    author: "Nguyễn Văn A",
    content: "Truyện đang ngay lúc gây cấn, dù sao cũng thank nhóm dịch",
    timestamp: "26 phút trước",
    likes: 24,
    avatarSrc: "/placeholder.svg?height=40&width=40",
    replies: [
      {
        author: "Diệp Chân Khang",
        content: "Truyện đang ngay lúc gây cấn, dù sao cũng thank nhóm dịch",
        timestamp: "26 phút trước",
        likes: 24,
        avatarSrc: "/placeholder.svg?height=40&width=40",
        replies: [
          {
            author: "Tuấn Akira",
            content:
              "Truyện đang ngay lúc gây cấn, dù sao cũng thank nhóm dịch",
            timestamp: "26 phút trước",
            likes: 24,
            avatarSrc: "/placeholder.svg?height=40&width=40",
          },
        ],
      },
    ],
  },
  {
    author: "Nguyễn Văn A",
    content: "Truyện đang ngay lúc gây cấn, dù sao cũng thank nhóm dịch",
    timestamp: "26 phút trước",
    likes: 24,
    avatarSrc: "/placeholder.svg?height=40&width=40",
  },
  {
    author: "Nguyễn Văn A",
    content: "Truyện đang ngay lúc gây cấn, dù sao cũng thank nhóm dịch",
    timestamp: "26 phút trước",
    likes: 24,
    avatarSrc: "/placeholder.svg?height=40&width=40",
  },
];
export default function StoryDetailPage() {
  const axiosInstance = createAxiosInstance();
  const { setStoryDetail, storyDetail } = useStoryStore()
  const params = useParams();
  const router = useRouter();
  const { storyId } = params;
  const totalPages = 50;

  const [state, setState] = useState<IState>({
    activeButton: "doc-truyen",
    currentPage: 1,
    totalPages: 0,
    loading: true
  });

  const getStoryBySlug = useCallback(async (page = 1) => {
    setState((prev) => ({ ...prev, loading: true }));
    const response = await axiosInstance.get<GetStoryBySlugResponse<StoryData>>(
      `/api/story/${storyId}`, {
      params: {
        page,
      },
    }
    );
    const { data } = response;
    if (data?.message === "Success") {
      setStoryDetail(data.data.story)
      setState((prev) => ({
        ...prev,
        currentPage: data.data.currentPage,
        totalPages: data.data.totalPages,
        loading: false,
      }));
    }

  }, [storyId]);

  useEffect(() => {
    getStoryBySlug(state.currentPage);
  }, [getStoryBySlug, state.currentPage]);
  const handleSetStateField = useCallback(
    (field: keyof IState, value: string | null | Story | number) => {
      setState((prevState) => ({ ...prevState, [field]: value }));
    },
    []
  );
  const onPageChange = useCallback((page: number) => {
    handleSetStateField('currentPage', page)
  }, [])
  return (
    <PageContainer>
      <div className='space-y-4'>
        {state.loading ? (
          <Skeleton className='h-64 w-full' /> // Adjust Skeleton size
        ) : (
          <div className=' mx-auto text-white'>
            <div className='p-4 sm:p-6'>
              <div className='mb-6 flex flex-col gap-4 sm:flex-row sm:gap-8'>
                <div className='flex-shrink-0'>
                  <Image
                    src='/images/placeholder3.png'
                    alt={"story.title"}
                    width={170}
                    height={220}
                    className='mx-auto object-cover sm:mx-0'
                  />
                </div>
                <div className='flex-grow space-y-3 text-center sm:text-left'>
                  <h1 className='text-xl font-bold text-black sm:text-2xl'>
                    {storyDetail?.title}
                  </h1>
                  <h1 className='text-sm text-male-blue sm:text-15px'>
                    {storyDetail?.category_name?.join(", ")}
                  </h1>
                  <p className='text-sm sm:text-15px'>
                    <span className='text-gray-400'>Tác giả:</span>{" "}
                    <span className='text-male-blue'> {storyDetail?.author?.name}</span>
                  </p>
                  <p className='text-sm text-gray-400 sm:text-15px'>
                    Tình trạng: Đang tiến hành
                  </p>
                  <div className='flex justify-center space-x-4 text-xs sm:justify-start sm:space-x-6 sm:text-sm'>
                    <span className='flex items-center text-15px text-gray-400'>
                      <ThumbsUp className='mr-2 h-4 w-4 text-gray-600' />
                      248.000 lượt thích
                    </span>
                    <span className='flex items-center text-15px text-gray-400'>
                      <Heart className='mr-2 h-4 w-4 text-gray-600' />
                      248.000 Theo dõi
                    </span>
                    <span className='flex items-center text-15px text-gray-400'>
                      <Eye className='mr-2 h-4 w-4 text-gray-600' />
                      248.000 lượt xem
                    </span>
                  </div>
                  <div className='flex flex-wrap justify-center space-x-2 pt-2 sm:justify-start'>
                    {buttonOptions.map((option) => (
                      <div
                        key={option.value}
                        className='flex items-center space-x-2'
                      >
                        <Button
                          onClick={() => {
                            handleSetStateField("activeButton", option.value);
                            if (option?.link) {
                              router.push(option.link);
                            }
                          }}
                          variant='default'
                          className={cn(
                            "rounded-none border-gray-300 bg-transparent px-3 py-1 sm:px-4 sm:py-2",
                            state.activeButton === option.value
                              ? "border border-custom-red bg-custom-red text-white hover:bg-custom-red hover:text-white"
                              : "text-gray-500 hover:bg-custom-red hover:text-white"
                          )}
                        >
                          {option.label}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className='w-full'>
                <p className='text-xs leading-relaxed text-custom-gray sm:text-sm'>
                  {storyDetail?.description}
                </p>
              </div>
            </div>
          </div>
        )}
        <div className='space-y-6 p-4 text-white'>
          <div>
            <h2 className='mb-2 text-xl font-semibold text-[#3498db]'>
              Danh sách chương
            </h2>
            <div>
              {storyDetail?.chapters?.map((chapter, index) => (
                <ChapterRow
                  key={index}
                  chapter={chapter}
                  isEven={index % 2 === 0}
                />
              ))}
            </div>
          </div>
        </div>
        <div className='p-4'>
          {state.totalPages > 0 ? (<Pagination
            currentPage={state.currentPage}
            totalPages={state.totalPages}
            onPageChange={onPageChange}
          />) : null}

        </div>
        <div className='p-4'>
          <SameGenreStories stories={sameGenreStories} />
        </div>

        <CommentForm />

        <div className='space-y-4 p-4'>
          {comments.map((comment, index) => (
            <CommentStory key={index} {...comment} />
          ))}
          <Button className='w-full bg-blue-600 text-white hover:bg-blue-700'>
            Xem thêm nhiều bình luận
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
