"use client";
import PageContainer from "@/components/layout/page-container";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createAxiosInstance } from "@/utils/axiosInstance";
import { CategoryData, GetStoryByCategoryIdResponse } from "@/types";
import { useStoryStore } from "@/lib";
import { StoryCard } from "@/components/story/story-card";

export default function Page() {
  const axiosInstance = createAxiosInstance();
  const { setStoryByCategory, storiesByCategory } = useStoryStore();
  const params = useParams();
  const slug = params.categoryId;
  const [categoryName, setCategoryName] = useState<string>("");
  const getStoryByCategoryId = useCallback(async () => {
    try {
      const response = await axiosInstance.get<
        GetStoryByCategoryIdResponse<CategoryData>
      >(`/api/category/${slug}`);
      const { data } = response;
      if (data?.message === "Success") {
        console.log("data.data", data.data);
        setStoryByCategory(data.data.stories);
        setCategoryName(data.data.categoryName);
      }
    } catch (err: any) {}
  }, [slug]);

  useEffect(() => {
    getStoryByCategoryId();
  }, [getStoryByCategoryId]);
  return (
    <PageContainer>
      <div className='container mx-auto mt-6 px-4'>
        <div className='space-y-4 py-4'>Thể loại: {categoryName}</div>
        <div className='grid grid-cols-1 gap-y-5 gap-x-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
          {storiesByCategory.map((story) => (
            <React.Fragment key={story.id}>
              <StoryCard story={story} />
            </React.Fragment>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
