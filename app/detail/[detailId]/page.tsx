'use client';
import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import classNames from 'classnames';
import { Eye, Heart, ThumbsUp } from 'lucide-react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import { Chapter, IComment } from '@/types';
import { ChapterRow } from '@/components/home/chapter-row';
import { CommentStory } from '@/components/home/comment-story';
import Pagination from '@/components/home/pagination';
import CommentForm from '@/components/home/comment-form';
import { SameGenreStories } from '@/components/home/same-genre-stories';
import { sameGenreStories } from '@/constants/data';
import SimpleLayout from '@/components/layout/simple-layout';
import StoryChapter from '@/components/home/story-chapter';
import { ScrollArea } from '@/components/ui/scroll-area';

interface IState {
    activeButton: string;
}

interface ButtonOption {
    label: string;
    value: string;
}

const buttonOptions: ButtonOption[] = [
    { label: 'Đọc truyện', value: 'doc-truyen' },
    { label: 'Yêu thích', value: 'yeu-thich' },
    { label: 'Theo dõi', value: 'theo-doi' }
];

const latestChapters: Chapter[] = [
    { title: 'Chapter 1', date: '14/02/2020' },
    { title: 'Chapter 2', date: '14/02/2020' }
];

const chapterList: Chapter[] = [
    { title: 'Chapter 1', date: '01/02/2020' },
    { title: 'Chapter 2', date: '01/02/2020' },
    { title: 'Chapter 3', date: '01/02/2020' },
    { title: 'Chapter 4', date: '01/02/2020' },
    { title: 'Chapter 5', date: '01/02/2020' },
    { title: 'Chapter 6', date: '01/02/2020' },
    { title: 'Chapter 7', date: '01/02/2020' },
    { title: 'Chapter 8', date: '01/02/2020' }
];

const comments: IComment[] = [
    {
        author: 'Nguyễn Văn A',
        content: 'Truyện đang ngay lúc gây cấn, dù sao cũng thank nhóm dịch',
        timestamp: '26 phút trước',
        likes: 24,
        avatarSrc: '/placeholder.svg?height=40&width=40',
        replies: [
            {
                author: 'Diệp Chân Khang',
                content: 'Truyện đang ngay lúc gây cấn, dù sao cũng thank nhóm dịch',
                timestamp: '26 phút trước',
                likes: 24,
                avatarSrc: '/placeholder.svg?height=40&width=40',
                replies: [
                    {
                        author: 'Tuấn Akira',
                        content:
                            'Truyện đang ngay lúc gây cấn, dù sao cũng thank nhóm dịch',
                        timestamp: '26 phút trước',
                        likes: 24,
                        avatarSrc: '/placeholder.svg?height=40&width=40'
                    }
                ]
            }
        ]
    },
    {
        author: 'Nguyễn Văn A',
        content: 'Truyện đang ngay lúc gây cấn, dù sao cũng thank nhóm dịch',
        timestamp: '26 phút trước',
        likes: 24,
        avatarSrc: '/placeholder.svg?height=40&width=40'
    },
    {
        author: 'Nguyễn Văn A',
        content: 'Truyện đang ngay lúc gây cấn, dù sao cũng thank nhóm dịch',
        timestamp: '26 phút trước',
        likes: 24,
        avatarSrc: '/placeholder.svg?height=40&width=40'
    }
];
export default function DetailPage() {
    const params = useParams();
    const { detailId } = params;



    const breadcrumbItems = [
        { title: 'Trang chủ', link: '/home' },
        { title: `${detailId}`, link: '#' }
    ];
    return (
        <SimpleLayout>
            <ScrollArea className="h-[calc(100dvh-140px)]">
                <div className="max-w-1366 mx-auto h-full">
                    <StoryChapter />
                </div>
            </ScrollArea>
        </SimpleLayout>
    );
}
