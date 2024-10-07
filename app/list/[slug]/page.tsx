"use client"
import Pagination from '@/components/home/pagination';
import PageContainer from '@/components/layout/page-container';
import { StoryCard } from '@/components/story/story-card';
import { Author, GetStoryByListResponse, IList, ListData, Story } from '@/types';
import { createAxiosInstance } from '@/utils/axiosInstance';
import { useParams, useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';

interface IState {
  currentPage: number
  totalPages: number
  loading: boolean
  list: IList | null
}
export default function Page() {
  const axiosInstance = createAxiosInstance();

  const params = useParams();
  const router = useRouter();
  const { slug } = params;

  const [state, setState] = useState<IState>({
    currentPage: 1,
    totalPages: 0,
    loading: true,
    list: null
  });
  const getStoryList = useCallback(async (page = 1) => {
    setState((prev) => ({ ...prev, loading: true }));
    const response = await axiosInstance.get<
      GetStoryByListResponse<ListData>
    >(`/api/home/${slug}`, {
      params: {
        page,
      },
    });
    const { data } = response;
    if (data?.message === "Success") {
      setState((prev) => ({
        ...prev,
        list: data.data.list[0],
        currentPage: data.data.currentPage,
        totalPages: data.data.totalPages,
        loading: false,
      }));

    }
  }, [slug]);

  useEffect(() => {
    getStoryList(state.currentPage);
  }, []);
  const handleSetStateField = useCallback(
    (field: keyof IState, value: string | null | IList | number) => {
      setState((prevState) => ({ ...prevState, [field]: value }));
    },
    []
  );
  const onPageChange = useCallback((page: number) => {
    handleSetStateField('currentPage', page)
  }, [])

  return (
    <PageContainer>
      <div className="space-y-2">

        <div className='grid grid-cols-1 gap-y-5 gap-x-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
          {state.list?.stories.map((story) => (
            <React.Fragment key={story.id}>
              <StoryCard story={story} />
            </React.Fragment>
          ))}
        </div>
        <div className='p-4'>
          {state.totalPages > 0 ? (<Pagination
            currentPage={state.currentPage}
            totalPages={state.totalPages}
            onPageChange={onPageChange}
          />) : null}

        </div>
      </div>
    </PageContainer>
  );
}
