import { Heart, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { CardContent } from "../ui/card";
import { IComment } from "@/types";



export const CommentStory: React.FC<IComment> = ({
    author,
    content,
    timestamp,
    likes,
    avatarSrc,
    replies,
    parentAuthor
}) => {
    return (
        <div className=" mb-4 border-gray-800 text-white">
            <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                    <div className={`border border-dashed border-male-blue`}>
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={avatarSrc} alt={author} />
                            <AvatarFallback className="bg-gray-300">{author[0]}</AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <div className="flex justify-center">
                                <h3 className="text-15px font-semibold text-black">
                                    {author} &nbsp;{' '}
                                </h3>
                                {parentAuthor && (
                                    <>
                                        <span className="text-15px text-gray-400">Đã phản hồi</span>{' '}
                                        &nbsp;
                                        <span className="text-15px font-semibold text-black">
                                            {parentAuthor}
                                        </span>
                                    </>
                                )}
                            </div>
                            <span className="text-13px text-gray-400">{timestamp}</span>
                        </div>
                        <p className="mt-1 text-15px text-gray-500">{content}</p>
                        <div className="mt-2 flex items-center space-x-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="p-0 text-custom-red hover:text-red-400 hover:bg-transparent"
                            >
                                <span className="text-sm">{likes} &nbsp;</span>
                                <span className="mr-1 border border-dashed border-gray-400 p-1">
                                    <Heart className="h-4 w-4 " />
                                </span>
                                <span className="text-sm"> Yêu thích</span>
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="p-0 text-custom-red hover:text-red-400 hover:bg-transparent"
                            >
                                <span className="mr-1 border border-dashed border-gray-400 p-1">
                                    <MessageCircle className="h-4 w-4" />
                                </span>
                                <span className="text-sm">Trả lời</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
            {replies && replies.length > 0 && (
                <div className="ml-14 bg-gray-100">
                    {replies.map((reply, index) => (
                        <CommentStory key={index} {...reply} parentAuthor={author} />
                    ))}
                </div>
            )}
        </div>
    );
};
