import { PrismaClient } from "@prisma/client";
import { createResponse, getErrorMessage } from "@/lib/utils";
import { NextRequest } from "next/server";
import { authenticateToken } from "../../users/login/route";

const prisma = new PrismaClient();
interface Chapter {
  id: number;
  story_id: number;
  chapter_number: string;
  // Add other fields as necessary
}
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user_id = await authenticateToken(req);
    // Lấy query parameters
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");

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
            },
          },
        },
        author: true,
        chapters: {
          skip,
          take: pageSize,
        },
        favorites: {
          where: { user_id: user_id ? user_id : 0 },
          select: {
            id: true, // Lấy ID hoặc bất kỳ trường nào khác cần thiết
          },
        },
      },
    });

    if (!storyData) {
      return createResponse("Error", "Truyện không tồn tại", 404);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { categories, ...rest } = storyData;
    const isFavorite = storyData.favorites.length > 0;
    const story = {
      ...rest,
      category_name:
        storyData.categories.map(
          (cat: { category: { name: any } }) => cat.category.name
        ) || [],
      isFavorite: isFavorite,
    };

    const totalChapters = await prisma.chapters.count({
      where: { story_id: story.id },
    });
    const [latestChapter] = await prisma.$queryRaw<Chapter[]>`
  SELECT *
  FROM chapters
  WHERE story_id = ${story.id}
  ORDER BY CAST(chapter_number AS UNSIGNED) DESC
  LIMIT 1
`;

    return createResponse("Success", {
      story,
      totalChapters,
      currentPage: page,
      totalPages: Math.ceil(totalChapters / pageSize),
      latestChapter,
    });
  } catch (error) {
    return createResponse(getErrorMessage(error), null, 500);
  }
}
