import { PrismaClient } from "@prisma/client";
import { createResponse, getErrorMessage } from "@/lib/utils";
import { NextRequest } from "next/server";
import { authenticateToken } from "../users/login/route";

const prisma = new PrismaClient();
export async function GET(req: NextRequest) {
  try {
    const user_id = await authenticateToken(req);

    const slugs = req.nextUrl.searchParams.getAll("slug[]");
    if (!Array.isArray(slugs) || slugs.length < 2) {
      return createResponse(
        "Invalid parameters. Expected slug and chapter ID.",
        400
      );
    }
    const [storySlug, chapterId] = slugs;

    const story = await prisma.stories.findUnique({
      where: { slug: storySlug },
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
      },
    });

    if (!story) {
      return createResponse("Story not found", 404);
    }
    const latestChapter = await prisma.chapters.findFirst({
      where: {
        id: parseInt(chapterId, 10),
        story_id: story.id,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    if (!latestChapter) {
      return createResponse("Error", `Chương không không có`, 404);
    }
    const chapters = await prisma.chapters.findMany({
      where: { story_id: story.id },
      select: { id: true, chapter_number: true },
    });

    const sortedChapters = chapters.sort(
      (a: { chapter_number: any }, b: { chapter_number: any }) =>
        Number(a.chapter_number) - Number(b.chapter_number)
    );


    if (user_id) {
      const updatedProgress = await prisma.reading_progress.upsert({
        where: {
          user_id_story_id: {
            user_id: user_id,
            story_id: story.id,
          },
        },
        update: {
          chapter_id: Number(chapterId),
          last_read_at: new Date(),
        },
        create: {
          user_id: user_id,
          story_id: story.id,
          chapter_id: Number(chapterId),
        },
      });
    }

    return createResponse("Success", {
      story,
      latestChapter,
      chapterIds: sortedChapters,
    });
  } catch (error) {
    return createResponse(getErrorMessage(error), null, 500);
  }
}
