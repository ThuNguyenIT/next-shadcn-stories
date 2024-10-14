import { PrismaClient } from "@prisma/client";
import { createResponse, getErrorMessage } from "@/lib/utils";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Lấy query parameters
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');

    const pageSize = 10; // Số lượng chương mỗi trang
    const skip = (page - 1) * pageSize;

    // Tìm truyện theo slug
    const storyData = await prisma.stories.findUnique({
      where: { slug: params.id },
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
          skip,
          take: pageSize,
        },
      },
    });

    if (!storyData) {
      return createResponse('Error', 'Truyện không tồn tại', 404);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { categories, ...rest } = storyData;
    const story = {
      ...rest,
      category_name: storyData.categories.map((cat) => cat.category.name) || [],
    };

    const totalChapters = await prisma.chapters.count({
      where: { story_id: story.id },
    });
    const latestChapter = await prisma.chapters.findFirst({
      where: { story_id: story.id },
      orderBy: {
        created_at: "desc",
      },
    });


    return createResponse('Success', {
      story,
      totalChapters,
      currentPage: page,
      totalPages: Math.ceil(totalChapters / pageSize),
      latestChapter
    });
  } catch (error) {
    return createResponse(getErrorMessage(error), null, 500);
  }
}

