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
import { ChapterRow } from '@/components/story/chapter-row';
import { CommentStory } from '@/components/story/comment-story';
import Pagination from '@/components/home/pagination';
import CommentForm from '@/components/story/comment-form';
import { SameGenreStories } from '@/components/story/same-genre-stories';
import { sameGenreStories } from '@/constants/data';
import { useRouter } from 'next/navigation';
interface IState {
  activeButton: string;
}

interface ButtonOption {
  label: string;
  value: string;
  link?: string;
}

const buttonOptions: ButtonOption[] = [
  { label: 'Đọc truyện', value: 'doc-truyen', link: '/detail/abc' },
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
  const router = useRouter();
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
          <div className="p-4 sm:p-6">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:gap-8">
              <div className="flex-shrink-0">
                <Image
                  src="/images/placeholder3.png"
                  alt={'story.title'}
                  width={170}
                  height={220}
                  className="mx-auto object-cover sm:mx-0"
                />
              </div>
              <div className="flex-grow space-y-3 text-center sm:text-left">
                <h1 className="text-xl font-bold text-black sm:text-2xl">
                  Ngã Hữu Chư Thiên Vạn
                </h1>
                <h1 className="text-sm text-male-blue sm:text-15px">
                  Kỳ Huyễn, Đô thị, Ảo tưởng
                </h1>
                <p className="text-sm sm:text-15px">
                  <span className="text-gray-400">Tác giả:</span>{' '}
                  <span className="text-male-blue"> Bạch Phật Lăng</span>
                </p>
                <p className="text-sm text-gray-400 sm:text-15px">
                  Tình trạng: Đang tiến hành
                </p>
                <div className="flex justify-center space-x-4 text-xs sm:justify-start sm:space-x-6 sm:text-sm">
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
                <div className="flex flex-wrap justify-center space-x-2 pt-2 sm:justify-start">
                  {buttonOptions.map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center space-x-2"
                    >
                      <Button
                        onClick={() => {
                          handleSetStateField('activeButton', option.value);
                          if (option?.link) {
                            router.push(option.link);
                          }
                        }}
                        variant="default"
                        className={classNames(
                          'rounded-none border-gray-300 bg-transparent px-3 py-1 sm:px-4 sm:py-2',
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
              <p className="text-xs leading-relaxed text-custom-gray sm:text-sm">
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
            <h2 className="mb-2 text-xl font-semibold text-male-blue">
              Chương mới nhất
            </h2>
            <div>
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
            <h2 className="mb-2 text-xl font-semibold text-[#3498db]">
              Danh sách chương
            </h2>
            <div>
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
        <div className="p-4">
          <SameGenreStories stories={sameGenreStories} />
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
