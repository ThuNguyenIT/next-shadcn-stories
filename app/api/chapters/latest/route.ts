import { PrismaClient } from "@prisma/client";
import { createResponse, getErrorMessage } from "@/lib/utils";
import { NextRequest } from "next/server";
import { authenticateToken } from "../../users/login/route";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    try {

        const user_id = await authenticateToken(req);
        if (!user_id) return createResponse('Error', 'Unauthorized', 401)
        // const storyId = req.nextUrl.searchParams.get("story_id");
        const searchParams = req.nextUrl.searchParams;
        // const slug = req.nextUrl.searchParams.get("slug");
        const slug = (searchParams.get('slug'));

        return createResponse('Success', searchParams.get('slug'));
        if (!storyId) {
            return createResponse("Error", slug, 400);
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

