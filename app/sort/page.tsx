"use client"
import BookFilter from '@/components/sort/book-filter';
import Pagination from '@/components/home/pagination';
import { UpdatedStoriesList } from '@/components/home/updated-stories-list';
import PageContainer from '@/components/layout/page-container';
import { Author, Story } from '@/types';
import React, { useState } from 'react';

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
export default function Page() {
  const [currentPage, setCurrentPage] = useState<number>(1)
  const totalPages = 5
  return (
    <PageContainer>
      <div className="space-y-2">
        <BookFilter />
        <UpdatedStoriesList stories={stories} />
        <div className="p-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </PageContainer>
  );
}
