import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createResponse, getErrorMessage } from "@/lib/utils";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { storyId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
    const skip = (page - 1) * pageSize;

    const chapters = await prisma.chapters.findMany({
      skip,
      take: pageSize,
      where: {
        story_id: parseInt(params.storyId),
      },
      orderBy: {
        chapter_number: "desc",
      },
    });

    const totalCount = await prisma.chapters.count({
      where: {
        story_id: parseInt(params.storyId),
      },
    });

    const pagination = {
      total: totalCount,
      page,
      pageSize,
      totalPages: Math.ceil(totalCount / pageSize),
    };

    return createResponse("Thành công", { chapters, pagination });
  } catch (error) {
    return createResponse(getErrorMessage(error), null, 500);
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { storyId: string } }
) {
  try {
    const { chapter_number, title, content } = await req.json();
    const newChapter = await prisma.chapters.create({
      data: {
        story_id: parseInt(params.storyId),
        title,
        content,
        chapter_number,
      },
    });

    return createResponse("Thành công", newChapter);
  } catch (error) {
    return createResponse(getErrorMessage(error), null, 500);
  }
}
