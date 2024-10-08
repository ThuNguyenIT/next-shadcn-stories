import { PrismaClient } from "@prisma/client";
import { createResponse, getErrorMessage } from "@/lib/utils";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("limit") || "25");
    const skip = (page - 1) * pageSize;
    const listStory = await prisma.lists.findMany({
      where: {
        slug: params.slug,
      },
      include: {
        stories: {
          skip,
          take: pageSize,
          include: {
            story: {
              include: {
                author: true,
              },
            },
          },
        },
      },
    });

    if (!listStory) {
      return createResponse("Error", "Danh sách không tồn tại", 404);
    }
    const totalStoriesInList = await prisma.lists.findUnique({
      where: {
        slug: params.slug,
      },
      include: {
        stories: true, // Lấy tất cả các truyện trong danh sách
      },
    });

    // Lấy số lượng truyện
    const totalStoriesCount = totalStoriesInList?.stories.length || 0;
    const totalPages = Math.ceil(totalStoriesCount / pageSize);
    const structuredStories = listStory.map((list) => {
      return {
        ...list,
        stories: list.stories.map((s) => {
          return s.story;
        }),
      };
    });

    return createResponse("Success", {
      list: structuredStories,
      currentPage: page,
      totalPages,
    });
  } catch (error) {
    return createResponse(getErrorMessage(error), null, 500);
  }
}
