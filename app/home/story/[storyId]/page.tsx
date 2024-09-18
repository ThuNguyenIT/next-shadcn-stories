"use client"
import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Eye, Heart, ThumbsUp } from 'lucide-react';
import { useParams } from 'next/navigation';


const breadcrumbItems = [
    { title: 'Trang chủ', link: '/home' },
    { title: 'User', link: '/dashboard/user' },
    { title: 'Create', link: '/dashboard/user/create' }
];
export default function StoryDetailPage() {
    const params = useParams();
    const { storyId } = params
    const breadcrumbItems = [
        { title: 'Trang chủ', link: '/home' },
        { title: `${storyId}`, link: '#' },
    ];
    return (
        <PageContainer >
            <div className="space-y-4">

                <Breadcrumbs items={breadcrumbItems} />
                <div className=" mx-auto text-white">
                    <div className="p-6">
                        <div className="flex gap-6 mb-4">
                            <div className="w-1/4">
                                <img
                                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%2094-b0R4jx8Y8UyDxi9mpp0cgDVtCjYVgq.png"
                                    alt="Story cover"
                                    className="w-full h-auto object-cover rounded-lg"
                                />
                            </div>
                            <div className="w-3/4 space-y-2">
                                <h1 className="text-2xl font-bold">Kỳ Huyễn, Đô thị, Ảo tưởng</h1>
                                <p className="text-blue-400">Tác giả: Bạch Phật Lăng</p>
                                <p className="text-gray-400">Tình trạng: Đang tiến hành</p>
                                <div className="flex space-x-4 text-sm">
                                    <span className="flex items-center">
                                        <ThumbsUp className="w-4 h-4 mr-1" />
                                        248.000 lượt thích
                                    </span>
                                    <span className="flex items-center">
                                        <Heart className="w-4 h-4 mr-1" />
                                        248.000 Theo dõi
                                    </span>
                                    <span className="flex items-center">
                                        <Eye className="w-4 h-4 mr-1" />
                                        248.000 lượt xem
                                    </span>
                                </div>
                                <div className="flex space-x-2 pt-2">
                                    <Button className="bg-red-500 hover:bg-red-600">Đọc truyện</Button>
                                    <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                                        Yêu thích
                                    </Button>
                                    <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                                        Theo dõi
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="w-full pt-4">
                            <p className="text-sm text-gray-300">
                                Một vị thần trong mắt bạn là như thế nào ? Có một ngôi đền lớn, đền chúng thờ phụng, sùng bái. Vị thần cao to, mặc áo tơ lụa, vương miện lấp lánh?! Không! Hãy cùng Samurai khám phá, Yato, một vị thần vừa nghèo vừa nhỏ. Đến mỗi cái đền thờ...
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}
