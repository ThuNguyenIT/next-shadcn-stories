import { PrismaClient } from "@prisma/client";
import { createResponse, getErrorMessage } from "@/lib/utils";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Lấy query parameters
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1'); // Mặc định là 1 nếu không có

    const pageSize = 10; // Số lượng chương mỗi trang
    const skip = (page - 1) * pageSize;

    // Tìm truyện theo slug
    const storyData = await prisma.stories.findUnique({
      where: { slug: params.id }, // params.id là slug của truyện
      include: {
        categories: {
          include: {
            category: {
              select: {
                name: true,
              },
            }
          },
        },
        author: true,
        chapters: {
          // orderBy: {
          //   created_at: 'desc', // Sắp xếp chương mới nhất
          // },
          skip,
          take: pageSize, // Lấy số chương theo phân trang
        },
      },
    });

    if (!storyData) {
      return createResponse('Error', 'Truyện không tồn tại', 404);
    }
    const { categories, ...rest } = storyData;
    const story = {
      ...rest,
      category_name: storyData.categories.map((cat) => cat.category.name) || [],
    };

    // Kiểm tra tổng số chương
    const totalChapters = await prisma.chapters.count({
      where: { story_id: story.id },
    });


    return createResponse('Success', {
      story,
      totalChapters,
      currentPage: page,
      totalPages: Math.ceil(totalChapters / pageSize),
    });
  } catch (error) {
    return createResponse(getErrorMessage(error), null, 500);
  }
}

