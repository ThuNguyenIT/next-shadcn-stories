import { PrismaClient } from "@prisma/client";
import { createResponse, getErrorMessage } from "@/lib/utils";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!prisma) throw new Error("Prisma is not initialized.");

    // Tìm category dựa trên ID được truyền vào từ URL
    const category = await prisma.categories.findUnique({
      where: {
        slug: (id)
      },
      include: {
        stories: {
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

    if (!category) {
      return createResponse("Error", "Danh sách không tồn tại", 404);
    }
    const result = category.stories.map((storyList) => storyList.story);
    return createResponse("Success", {
      categoryName: category.name,
      stories: result,
    });
  } catch (error) {
    return createResponse(getErrorMessage(error), null, 500);
  }
}
