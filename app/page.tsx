"use client"
import { DynamicTitleSection } from "@/components/home/dynamic-title-section";
import { FavoriteStories } from "@/components/home/favorite-stories";
import { PopularStories } from "@/components/home/popular-stories";
import { StoryColumn } from "@/components/home/story-column";
import { UpdatedStoriesList } from "@/components/home/updated-stories-list";
import MainLayout from "@/components/layout/main-layout";
import PageContainer from "@/components/layout/page-container";
import { Author, CategoryData, GetStoryByCategoryIdResponse, GetStoryByListResponse, IList, ListData, Story } from "@/types";
import { createAxiosInstance } from "@/utils/axiosInstance";
import { Separator } from "@radix-ui/react-separator";
import { useCallback, useEffect, useState } from "react";

const author: Author = {
  id: 1,
  user_id: 1,
  name: "Kỳ Huyễn",
  slug: "ky-huyen",
  pseudonym: null,
  alias: null,
  bio: null,
  avatar: null,
  email: null,
  nationality: null,
  birthday: null,
  social_media: null,
  created_at: "",
  updated_at: ""
}
const stories: Story[] = [
  {
    id: 1,
    title: "Ngã Hữu Chư Thiên Vạn",
    slug: "nga-huu-chu-thien-van",
    author: author,
    chapter: 4095,
    updated_at: "2024-09-26T09:16:01.000Z",
    cover_image: "/images/placeholder1.png",
    author_id: 1,
    view_count: 1,
    status: "",
    total_chapter: 19,
  },
  {
    id: 2,
    title: "Tây Dư Tôi Cường Tô Sư",
    slug: "tay-du-toi-cuong-to-su",
    author: author,
    chapter: 4095,
    updated_at: "2024-09-26T09:16:01.000Z",
    cover_image: "/images/placeholder2.png",
    author_id: 0,
    view_count: 0
  },
  {
    id: 3,
    title: "Linh Khí Phục Tô: Úc Vạn",
    slug: "linh-khi-phuc-to-uc-van",
    author: author,
    chapter: 4095,
    updated_at: "2024-09-26T09:16:01.000Z",
    cover_image: "/images/placeholder3.png",
    author_id: 0,
    view_count: 0
  },
  {
    id: 4,
    title: "Linh Khí Phục Tô: Úc Vạn",
    slug: "linh-khi-phuc-to-uc-van",
    author: author,
    chapter: 4095,
    updated_at: "2024-09-26T09:16:01.000Z",
    cover_image: "/images/placeholder4.png",
    author_id: 0,
    view_count: 0
  },
  {
    id: 5,
    title: "Ngã Hữu Chư Thiên Vạn",
    slug: "nga-huu-chu-thien-van",
    author: author,
    chapter: 4095,
    updated_at: "2024-09-26T09:16:01.000Z",
    cover_image: "/images/placeholder4.png",
    author_id: 0,
    view_count: 0
  },
  {
    id: 6,
    title: "Tây Dư Tôi Cường Tô Sư",
    slug: "tay-du-toi-cuong-to-su",
    author: author,
    chapter: 4095,
    updated_at: "2024-09-26T09:16:01.000Z",
    cover_image: "/images/placeholder2.png",
    author_id: 0,
    view_count: 0
  },
  {
    id: 7,
    title: "Linh Khí Phục Tô: Úc Vạn",
    slug: "linh-khi-phuc-to-uc-van",
    author: author,
    chapter: 4095,
    updated_at: "2024-09-26T09:16:01.000Z",
    cover_image: "/images/placeholder1.png",
    author_id: 0,
    view_count: 0
  },
  {
    id: 8,
    title: "Linh Khí Phục Tô: Úc Vạn",
    slug: "linh-khi-phuc-to-uc-van",
    author: author,
    chapter: 4095,
    updated_at: "2024-09-26T09:16:01.000Z",
    cover_image: "/images/placeholder3.png",
    author_id: 0,
    view_count: 0
  },
];

const completedStories: Story[] = [
  {
    id: 1,
    title: "Tu Chân Gia Tộc Bình",
    author: author,
    chapter: 4095,
    updated_at: "2024-09-11",
    cover_image: "/images/placeholder3.png",
    description: "Sơn không tại cao, có gia thì sao. Suối không tại uyên...",
    author_id: 0,
    view_count: 0
  },
  {
    id: 2,
    title: "Phàm Nhân Tu Tiên Chi",
    author: author,
    chapter: 1536,
    updated_at: "2024-09-11",
    cover_image: "/images/placeholder3.png",
    author_id: 0,
    view_count: 0
  },
  {
    id: 3,
    title: "Tạo Hóa Chi Vương",
    author: author,
    chapter: 1536,
    updated_at: "2024-09-11",
    cover_image: "/images/placeholder3.png",
    author_id: 0,
    view_count: 0
  },
  {
    id: 4,
    title: "Lâm Uyên Hành",
    author: author,
    chapter: 1536,
    updated_at: "2024-09-11",
    cover_image: "/images/placeholder3.png",
    author_id: 0,
    view_count: 0
  },
  {
    id: 5,
    title: "Nhất Niệm Vĩnh Hằng",
    author: author,
    chapter: 1536,
    updated_at: "2024-09-11",
    cover_image: "/images/placeholder3.png",
    author_id: 0,
    view_count: 0
  },
  {
    id: 6,
    title: "Đế Bá",
    author: author,
    chapter: 1536,
    updated_at: "2024-09-11",
    cover_image: "/images/placeholder3.png",
    author_id: 0,
    view_count: 0
  },
  {
    id: 7,
    title: "Thần Đạo Đan Tôn",
    author: author,
    chapter: 1536,
    updated_at: "2024-09-11",
    cover_image: "/images/placeholder3.png",
    author_id: 0,
    view_count: 0
  },
];
export default function page() {
  const axiosInstance = createAxiosInstance();

  const [storiesNewUpdate, setStoriesNewUpdate] = useState<IList>();
  const [storiesHot, setStoriesHot] = useState<IList>();
  const [storiesFull, setStoriesFull] = useState<IList>();
  const getStoryByCategoryId = useCallback(async (slug: string) => {
    const response = await axiosInstance.get<
      GetStoryByListResponse<ListData>
    >(`/api/home/${slug}`);
    const { data } = response;
    if (data?.message === "Success") {
      if (slug === "truyen-moi") {

        setStoriesNewUpdate(data.data.list[0]);
      }
      else if (slug === "truyen-hot") {
        setStoriesHot(data.data.list[0]);

      }
      else if (slug === "truyen-full") {
        setStoriesFull(data.data.list[0]);

      }

    }
  }, []);

  useEffect(() => {
    getStoryByCategoryId('truyen-moi');
    getStoryByCategoryId('truyen-hot');
    getStoryByCategoryId('truyen-full');
  }, []);
  return (
    <MainLayout>
      <PageContainer>
        {storiesNewUpdate && (<UpdatedStoriesList stories={storiesNewUpdate?.stories} />)}

        <Separator className='border-1 bg-secondary mb-10 mt-6 border-dashed border-indigo-600' />
        <div className='container mx-auto flex flex-col gap-x-10 space-y-8 px-4 sm:flex-row sm:space-x-4 sm:space-y-0'>
          {storiesHot && <FavoriteStories stories={storiesHot?.stories} />}
          {storiesFull && <PopularStories stories={storiesFull?.stories} />}
        </div>
        <Separator className='border-1 bg-secondary mb-10 mt-6 border-dashed border-indigo-600' />
        <div className='container mx-auto px-4'>
          <DynamicTitleSection title={"Truyện đã hoàn thành"} href={"/more"} />
          <div className='mt-5 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
            <StoryColumn stories={completedStories} />
            <StoryColumn stories={completedStories} />
            <StoryColumn stories={completedStories} />
            <StoryColumn stories={completedStories} />
          </div>
        </div>
      </PageContainer>
    </MainLayout>
  );
}
