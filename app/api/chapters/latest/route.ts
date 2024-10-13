import { PrismaClient } from "@prisma/client";
import { createResponse, getErrorMessage } from "@/lib/utils";
import { NextRequest } from "next/server";
import { authenticateToken } from "../../users/login/route";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    try {

        const user_id = await authenticateToken(req);
        if (!user_id) return createResponse('Error', 'Unauthorized', 401)
        const storyId = req.nextUrl.searchParams.get("story_id");

        if (!storyId) {
            return createResponse("Error", "Thiếu story_id trong URL", 400);
        }
        const latestChapter = await prisma.chapters.findFirst({
            where: {
                story_id: Number(storyId),
            },
            orderBy: {
                created_at: "desc",
            },
        });

        if (!latestChapter) {
            return createResponse('Error', 'Chương không không có', 404);
        }




        return createResponse('Success', latestChapter);
    } catch (error) {
        return createResponse(getErrorMessage(error), null, 500);
    }
}

