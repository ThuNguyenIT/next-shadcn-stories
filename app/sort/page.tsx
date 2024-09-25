"use client"
import BookFilter from '@/components/home/book-filter';
import Pagination from '@/components/home/pagination';
import { UpdatedStoriesList } from '@/components/home/updated-stories-list';
import PageContainer from '@/components/layout/page-container';
import { Story } from '@/types';
import React, { useState } from 'react';

const stories: Story[] = [
  {
    id: '1',
    title: 'Ngã Hữu Chư Thiên Vạn',
    author: 'Kỳ Huyễn',
    chapter: 4095,
    updatedAt: '14/02/2020',
    coverImage: '/images/placeholder1.png'
  },
  {
    id: '2',
    title: 'Tây Dư Tôi Cường Tô Sư',
    author: 'Huyền Huyễn',
    chapter: 4095,
    updatedAt: '14/02/2020',
    coverImage: '/images/placeholder2.png'
  },
  {
    id: '3',
    title: 'Linh Khí Phục Tô: Úc Vạn',
    author: 'Huyền Huyễn',
    chapter: 4095,
    updatedAt: '14/02/2020',
    coverImage: '/images/placeholder3.png'
  },
  {
    id: '4',
    title: 'Linh Khí Phục Tô: Úc Vạn',
    author: 'Huyền Huyễn',
    chapter: 4095,
    updatedAt: '14/02/2020',
    coverImage: '/images/placeholder4.png'
  },
  {
    id: '5',
    title: 'Ngã Hữu Chư Thiên Vạn',
    author: 'Kỳ Huyễn',
    chapter: 4095,
    updatedAt: '14/02/2020',
    coverImage: '/images/placeholder4.png'
  },
  {
    id: '6',
    title: 'Tây Dư Tôi Cường Tô Sư',
    author: 'Huyền Huyễn',
    chapter: 4095,
    updatedAt: '14/02/2020',
    coverImage: '/images/placeholder2.png'
  },
  {
    id: '7',
    title: 'Linh Khí Phục Tô: Úc Vạn',
    author: 'Huyền Huyễn',
    chapter: 4095,
    updatedAt: '14/02/2020',
    coverImage: '/images/placeholder1.png'
  },
  {
    id: '8',
    title: 'Linh Khí Phục Tô: Úc Vạn',
    author: 'Huyền Huyễn',
    chapter: 4095,
    updatedAt: '14/02/2020',
    coverImage: '/images/placeholder3.png'
  }
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
