import { PrismaClient } from "@prisma/client";
import { createResponse, getErrorMessage } from "@/lib/utils";
import { authenticateToken } from "../../users/login/route";
import { NextRequest } from "next/server";
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const user_id = await authenticateToken(req);
    if (user_id) {
      const { story_id } = await req.json();
      const existingFavorite = await prisma.favorites.findUnique({
        where: {
          user_id_story_id: {
            user_id,
            story_id,
          },
        },
      });
      if (existingFavorite) {
        await prisma.favorites.delete({
          where: {
            id: existingFavorite.id,
          },
        });
        return createResponse("Success", null, 200);
      } else {
        await prisma.favorites.create({
          data: {
            user_id,
            story_id,
          },
        });
        return createResponse("Success", null, 200);
      }
    } else {
      return;
    }
  } catch (error) {
    return createResponse(getErrorMessage(error), null, 400);
  }
}
