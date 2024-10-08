import { PrismaClient } from "@prisma/client";
import { createResponse, getErrorMessage } from "@/lib/utils";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    // Lấy query parameters
    const searchParams = req.nextUrl.searchParams;
    const slugParams = searchParams.getAll("slug");
    const page = parseInt(searchParams.get("page") || "1");

    const pageSize = 10; // Số lượng chương mỗi trang
    const skip = (page - 1) * pageSize;

    // const storyData = await prisma.stories.findMany({
    //   where: { slug: { in: slugParams } },
    // });
    const storyData = await prisma.categories.findMany({
      where: { slug: { in: slugParams } },
    });


    if (!storyData) {
      return createResponse("Error", "Truyện không tồn tại", 404);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // const { categories, ...rest } = storyData;
    // const story = {
    //   ...rest,
    //   category_name: storyData.categories.map((cat) => cat.category.name) || [],
    // };

    // const totalChapters = await prisma.chapters.count({
    //   where: { story_id: story.id },
    // });

    return createResponse("Success", {
      story: storyData,
      // totalChapters,
      currentPage: page,
      // totalPages: Math.ceil(totalChapters / pageSize),
    });
  } catch (error) {
    return createResponse(getErrorMessage(error), null, 500);
  }
}
