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
export default function StoryDetailPage() {
  const params = useParams();
  const { storyId } = params;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = 5;

  const [state, setState] = useState<IState>({
    activeButton: 'doc-truyen'
  });
  const handleSetStateField = useCallback(
    (field: keyof IState, value: string) => {
      setState((prevState) => ({ ...prevState, [field]: value }));
    },
    []
  );
  const breadcrumbItems = [
    { title: 'Trang chủ', link: '/home' },
    { title: `${storyId}`, link: '#' }
  ];
  return (
    <PageContainer>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <div className=" mx-auto text-white">
          <div className="p-6">
            <div className="mb-6 flex gap-8">
              <div className="flex-shrink-0">
                <Image
                  src="/images/placeholder3.png"
                  alt={'story.title'}
                  width={170}
                  height={220}
                  className="object-cover"
                />
              </div>
              <div className="flex-grow space-y-3">
                <h1 className="text-2xl font-bold text-black">
                  Ngã Hữu Chư Thiên Vạn
                </h1>
                <h1 className="text-15px text-male-blue">
                  Kỳ Huyễn, Đô thị, Ảo tưởng
                </h1>
                <p className="text-15px">
                  <span className="text-gray-400">Tác giả:</span>{' '}
                  <span className="text-male-blue"> Bạch Phật Lăng</span>
                </p>
                <p className="text-15px text-gray-400">
                  Tình trạng: Đang tiến hành
                </p>
                <div className="flex space-x-6 text-sm">
                  <span className="flex items-center text-15px text-gray-400">
                    <ThumbsUp className="mr-2 h-4 w-4 text-gray-600" />
                    248.000 lượt thích
                  </span>
                  <span className="flex items-center text-15px text-gray-400">
                    <Heart className="mr-2 h-4 w-4 text-gray-600" />
                    248.000 Theo dõi
                  </span>
                  <span className="flex items-center text-15px text-gray-400">
                    <Eye className="mr-2 h-4 w-4 text-gray-600" />
                    248.000 lượt xem
                  </span>
                </div>
                <div className="flex space-x-3 pt-2">
                  {buttonOptions.map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center space-x-2"
                    >
                      <Button
                        onClick={() =>
                          handleSetStateField('activeButton', option.value)
                        }
                        variant="default"
                        className={classNames(
                          'rounded-none border-gray-300 bg-transparent',
                          {
                            'border border-custom-red bg-custom-red text-white hover:bg-custom-red hover:text-white':
                              state.activeButton === option.value, // Trạng thái active
                            'text-gray-500 hover:bg-custom-red hover:text-white':
                              state.activeButton !== option.value // Trạng thái không active
                          }
                        )}
                      >
                        {option.label}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="w-full">
              <p className="text-sm leading-relaxed text-custom-gray">
                Một vị thần trong mắt bạn là như thế nào ? Có một ngôi đền lớn,
                đền chúng thờ phụng, sùng bái. Vị thần cao to, mặc áo tơ lụa,
                vương miện lấp lánh?! Không! Hãy cùng Samurai khám phá, Yato,
                một vị thần vừa nghèo vừa nhỏ. Đến mỗi cái đền thờ...
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6 p-4 text-white">
          <div>
            <h2 className="mb-2 text-lg font-semibold text-male-blue">
              Chương mới nhất
            </h2>
            <div className="border-t border-gray-800">
              {latestChapters.map((chapter, index) => (
                <ChapterRow
                  key={index}
                  chapter={chapter}
                  isEven={index % 2 === 0}
                />
              ))}
            </div>
          </div>
          <div>
            <h2 className="mb-2 text-lg font-semibold text-[#3498db]">
              Danh sách chương
            </h2>
            <div className="border-t border-gray-800">
              {chapterList.map((chapter, index) => (
                <ChapterRow
                  key={index}
                  chapter={chapter}
                  isEven={index % 2 === 0}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="p-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
        <CommentForm />

        <div className="space-y-4 p-4">
          {comments.map((comment, index) => (
            <CommentStory key={index} {...comment} />
          ))}
          <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">
            Xem thêm nhiều bình luận
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
