import { Heart, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { CardContent } from "../ui/card";


interface CommentProps {
    author: string;
    content: string;
    timestamp: string;
    likes: number;
    avatarSrc: string;
    replies?: CommentProps[];
    parentAuthor?: string;
}
export const CommentStory: React.FC<CommentProps> = ({ author, content, timestamp, likes, avatarSrc, replies, parentAuthor }) => {
    return (
        <div className=" text-white border-gray-800 mb-4">
            <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                    <div className={`border-male-blue border border-dashed`}>

                        <Avatar className="w-10 h-10">
                            <AvatarImage src={avatarSrc} alt={author} />
                            <AvatarFallback>{author[0]}</AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <div className="flex justify-center">
                                <h3 className="font-semibold text-black text-15px">{author} &nbsp; </h3>
                                {parentAuthor && (<><span className="text-gray-400 text-15px">Đã phản hồi</span> &nbsp;<span className="font-semibold text-black text-15px">{parentAuthor}</span></>)}
                            </div>
                            <span className="text-gray-400 text-13px">{timestamp}</span>
                        </div>
                        <p className="mt-1 text-gray-500 text-15px">{content}</p>
                        <div className="flex items-center space-x-4 mt-2">
                            <Button variant="ghost" size="sm" className="text-custom-red hover:text-red-400 p-0">
                                <span className="text-sm">{likes} &nbsp;</span>
                                <span className="border-gray-400 border border-dashed mr-1 p-1">

                                    <Heart className="w-4 h-4 " />
                                </span>
                                <span className="text-sm"> Yêu thích</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="text-custom-red hover:text-red-400 p-0">
                                <span className="border-gray-400 border border-dashed mr-1 p-1"><MessageCircle className="w-4 h-4" /></span>
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
