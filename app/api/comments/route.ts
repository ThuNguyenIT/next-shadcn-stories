import { PrismaClient } from "@prisma/client";
import { createResponse, getErrorMessage } from "@/lib/utils";
import { NextRequest } from "next/server";
import { authenticateToken } from "../users/login/route";
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const user_id = await authenticateToken(req);
    if (user_id) {
      const { story_id, content, parent_comment_id } = await req.json();
      if (!content) {
        return createResponse("Content are required", null, 400);
      }
      const newComment = await prisma.comments.create({
        data: {
          story_id,
          user_id,
          content,
          parent_comment_id: parent_comment_id || null,
        },
      });
      return createResponse("Success", newComment, 200);
    } else {
      return;
    }
  } catch (error) {
    return createResponse(getErrorMessage(error), null, 400);
  }
}
export async function GET(req: NextRequest) {
  try {
    const user_id = await authenticateToken(req);
    if (user_id) {
      const searchParams = req.nextUrl.searchParams;
      const page = parseInt(searchParams.get("page") || "1");
      const story_id = searchParams.get("story_id");

      const pageSize = 10; // Số lượng chương mỗi trang
      const skip = (page - 1) * pageSize;

      const comments = await prisma.comments.findMany({
        where: {
          story_id: Number(story_id),
        },
        include: {
          user: true,
          replies: {
            include: {
              user: true,
            },
          },
        },
        skip,
        take: pageSize,
        orderBy: {
          created_at: "asc", // sắp xếp theo thời gian tạo
        },
      });

      const totalComments = await prisma.comments.count({
        where: { story_id: Number(story_id) },
      });

      return createResponse("Success", {
        comments,
        currentPage: page,
        totalPages: Math.ceil(totalComments / pageSize),
      });
    }
  } catch (error) {
    return createResponse(getErrorMessage(error), null, 500);
  }
}
