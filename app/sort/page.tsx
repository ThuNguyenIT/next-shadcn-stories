"use client";
import BookFilter from "@/components/sort/book-filter";
import Pagination from "@/components/home/pagination";
import { UpdatedStoriesList } from "@/components/home/updated-stories-list";
import PageContainer from "@/components/layout/page-container";
import { Author, Story } from "@/types";
import React, { useCallback, useEffect, useState } from "react";
import { useCategoryStore } from "@/lib";
import { createAxiosInstance } from "@/utils/axiosInstance";
import { StoryCard } from "@/components/story/story-card";

interface IState {
  currentPage: number;
  totalPages: number;
  loading: boolean;
  stories: Story[];
}
export default function Page() {
  const { categories } = useCategoryStore();
  const axiosInstance = createAxiosInstance();

  const [selectedCategories, setSelectedCategories] = useState<number[]>([1]);

  const [state, setState] = useState<IState>({
    currentPage: 1,
    totalPages: 0,
    loading: true,
    stories: [],
  });

  const handleCheckboxChange = (id: number) => {
    if (selectedCategories.includes(id)) {
      setSelectedCategories(
        selectedCategories.filter((categoryId) => categoryId !== id)
      );
    } else {
      setSelectedCategories([...selectedCategories, id]);
    }
    if (state.currentPage !== 1) {
      handleSetStateField("currentPage", 1);
    }
  };

  const getFilterStory = useCallback(
    async (page = 1) => {
      const response = await axiosInstance.post(`/api/sort`, {
        categoryId: selectedCategories,
        page,
      });
      const { data } = response;
      if (data?.message === "Success") {
        setState((prev) => ({
          ...prev,
          stories: data.data.stories,
          currentPage: data.data.currentPage,
          totalPages: data.data.totalPages,
        }));
      }
    },
    [selectedCategories]
  );

  useEffect(() => {
    getFilterStory(state.currentPage);
  }, [getFilterStory, state.currentPage, selectedCategories]);

  const handleSetStateField = useCallback(
    (field: keyof IState, value: string | null | Story | number) => {
      setState((prevState) => ({ ...prevState, [field]: value }));
    },
    []
  );
  const onPageChange = useCallback(
    (page: number) => {
      handleSetStateField("currentPage", page);
    },
    [handleSetStateField]
  );

  return (
    <PageContainer>
      <div className='space-y-2'>
        <BookFilter
          categories={categories}
          handleCheckboxChange={handleCheckboxChange}
          selectedCategories={selectedCategories}
        />
        {/* <UpdatedStoriesList stories={stories} /> */}
        <div className='grid grid-cols-1 gap-y-5 gap-x-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
          {state.stories.map((story) => (
            <React.Fragment key={story.id}>
              <StoryCard story={story} />
            </React.Fragment>
          ))}
        </div>
        <div className='p-4'>
          {state.totalPages > 0 ? (
            <Pagination
              currentPage={state.currentPage}
              totalPages={state.totalPages}
              onPageChange={onPageChange}
            />
          ) : null}
        </div>
      </div>
    </PageContainer>
  );
}
