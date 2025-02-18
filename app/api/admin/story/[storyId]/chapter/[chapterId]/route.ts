import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createResponse, getErrorMessage } from "@/lib/utils";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { storyId: string; chapterId: string } }
) {
  try {
    const chapter = await prisma.chapters.findUnique({
      where: {
        id: parseInt(params.chapterId),
        story_id: parseInt(params.storyId),
      },
    });

    if (!chapter) {
      return createResponse("Không tìm thấy", null, 404);
    }

    return createResponse("Thành công", chapter);
  } catch (error) {
    return createResponse(getErrorMessage(error), null, 500);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { storyId: string; chapterId: string } }
) {
  try {
    const { title, content, chapter_number } = await req.json();
    const updatedChapter = await prisma.chapters.update({
      where: {
        id: parseInt(params.chapterId),
        story_id: parseInt(params.storyId),
      },
      data: {
        title,
        content,
        chapter_number,
      },
    });

    return createResponse("Thành công", updatedChapter);
  } catch (error) {
    return createResponse(getErrorMessage(error), null, 500);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { storyId: string; chapterId: string } }
) {
  try {
    await prisma.chapters.delete({
      where: {
        id: parseInt(params.chapterId),
        story_id: parseInt(params.storyId),
      },
    });

    return createResponse("Thành công");
  } catch (error) {
    return createResponse(getErrorMessage(error), null, 500);
  }
}
