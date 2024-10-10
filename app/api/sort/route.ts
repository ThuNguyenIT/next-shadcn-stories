import { PrismaClient } from "@prisma/client";
import { createResponse, getErrorMessage } from "@/lib/utils";
const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { categoryId, page } = await request.json();
    const pageSize = 8;
    const skip = (page - 1) * pageSize;
    const storyData = await prisma.stories.findMany({
      where: {
        categories: {
          some: {
            category_id: {
              in: categoryId,
            },
          },
        },
      },
      include: {
        author: true,
      },
      skip,
      take: pageSize,
    });
    if (!storyData) {
      return createResponse("Error", "Không có dữ liệu", 404);
    }

    const totalChapters = await prisma.stories.count({
      where: {
        categories: {
          some: {
            category_id: {
              in: categoryId,
            },
          },
        },
      },
    });

    return createResponse("Success", {
      stories: storyData,
      currentPage: page,
      totalPages: Math.ceil(totalChapters / pageSize),
    });
  } catch (error) {
    return createResponse(getErrorMessage(error), null, 500);
  }
}
