import { Heart, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { CardContent } from "../ui/card";
import { CommentResponse, IComment } from "@/types";
import { useCallback, useEffect, useState } from "react";
import { createAxiosInstance } from "@/utils/axiosInstance";
import { useAuthStore, useStoryStore } from "@/lib";
import { CommentStory } from "./comment-story";

interface IState {
  currentPage: number;
  totalPages: number;
}
export const Comment = () => {
  const axiosInstance = createAxiosInstance();
  const { listComment, storyDetail, setListComment } = useStoryStore();
  const { user } = useAuthStore();

  const [state, setState] = useState<IState>({
    currentPage: 1,
    totalPages: 0,
  });

  const handleSetStateField = useCallback(
    (field: keyof IState, value: string | null | number | boolean) => {
      setState((prevState) => ({ ...prevState, [field]: value }));
    },
    []
  );
  const getListComment = useCallback(async (page = 1, story_id: number) => {
    const response = await axiosInstance.get<CommentResponse>(`/api/comments`, {
      params: {
        page,
        story_id,
      },
    });
    const { data } = response;
    if (data?.message === "Success") {
      setListComment(data.data.comments);
    }
  }, []);

  useEffect(() => {
    if (storyDetail) {
      getListComment(state.currentPage, storyDetail.id);
    } else {
      console.log("no call");
    }
  }, [getListComment, state.currentPage, storyDetail]);

  return listComment.map((comment, index) => {
     <CommentStory key={index} {...comment} />;
  });
};
