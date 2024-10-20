import { Heart, MessageCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { CardContent } from '../ui/card';
import { IComment } from '@/types';
import { convertToTimeAgo } from '@/utils/convert';
import { useState } from 'react';
import { Input } from '../ui/input';
interface CommentStoryProps extends IComment {
  onSubmit?: (content: string, parent_comment_id: number) => void;
  parentAuthor?: string; // Optional in case you want to display parent comment's author
}
export const CommentStory: React.FC<CommentStoryProps> = (props) => {
  const { id, content, user, updated_at, replies, parentAuthor, onSubmit } = props;
  const [showReplyInput, setShowReplyInput] = useState(false)
  const [replyContent, setReplyContent] = useState("")
  const handleReplyClick = () => {
    setShowReplyInput(true)
  }

  const handleCancelReply = () => {
    setShowReplyInput(false)
    setReplyContent("")
  }

  const handleSubmitReply = () => {

    onSubmit && onSubmit(replyContent, id);
    setShowReplyInput(false)
    setReplyContent("")
  }
  return (
    <div className="mb-4 border-gray-800 text-white">
      <CardContent className="p-0">
        <div
          className="flex flex-col items-start space-y-4 sm:flex-row sm:space-x-4
            sm:space-y-0"
        >
          <div className="flex items-center gap-x-3">

            <div
              className={`flex-shrink-0 border border-dashed border-male-blue`}
            >
              <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                {/* <AvatarImage src={avatarSrc} alt={author} /> */}
                <AvatarFallback className="bg-gray-300">
                  {user.full_name[0]}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex items-center justify-between sm:flex-row block sm:hidden">
              <div className="lex justify-center">
                <h3 className="text-sm font-semibold text-black sm:text-15px">
                  {user.full_name} &nbsp;{' '}
                </h3>
              </div>
              <span className="text-xs text-gray-400 sm:text-13px">
                {convertToTimeAgo(updated_at)}
              </span>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex flex-col items-center justify-between sm:flex-row hidden sm:flex">
              <div className="flex justify-center">
                <h3 className="text-sm font-semibold text-black sm:text-15px">
                  {user.full_name} &nbsp;{' '}
                </h3>
                {parentAuthor && (
                  <>
                    <span className="text-sm text-gray-400 sm:text-15px">
                      Đã phản hồi
                    </span>{' '}
                    &nbsp;
                    <span className="text-15px font-semibold text-black">
                      {parentAuthor}
                    </span>
                  </>
                )}
              </div>
              <span className="text-xs text-gray-400 sm:text-13px">
                {convertToTimeAgo(updated_at)}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-500 sm:text-15px">{content}</p>
            <div className="mt-2 flex items-center gap-x-5 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Button
                variant="ghost"
                size="sm"
                className="p-0 text-custom-red hover:bg-transparent hover:text-red-400"
              >
                <span className="text-sm">{'24'} &nbsp;</span>
                <span className="mr-1 border border-dashed border-gray-400 p-1">
                  <Heart className="h-4 w-4 " />
                </span>
                <span className="text-sm"> Yêu thích</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="p-0 text-custom-red hover:bg-transparent hover:text-red-400"
                onClick={handleReplyClick}
              >
                <span className="mr-1 border border-dashed border-gray-400 p-1">
                  <MessageCircle className="h-4 w-4" />
                </span>
                <span className="text-sm">Trả lời</span>
              </Button>
            </div>
            {showReplyInput && (
              <div className="mt-4">
                <Input
                  placeholder="Thêm phản hồi..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="mb-2 bg-white text-black"
                />
                <div className="flex justify-end space-x-2">
                  <Button className='text-black' variant="outline" onClick={handleCancelReply}>
                    Hủy
                  </Button>
                  <Button disabled={!replyContent.trim()} className='bg-red-500 hover:bg-red-600' onClick={handleSubmitReply}>Trả lời</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      {/* {replies && replies.length > 0 && (
        <div className="ml-4 bg-gray-100 p-2 sm:ml-14">
          {replies.map((reply, index) => (
            <CommentStory key={index} {...reply} parentAuthor={user.full_name} />
          ))}
        </div>
      )} */}
    </div>
  );
};
