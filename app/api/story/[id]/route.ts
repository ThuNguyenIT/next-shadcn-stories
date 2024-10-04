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

    const story = await prisma.stories.findUnique({
      where: {
        slug: id,
      },
    });

    if (!story) {
      return createResponse("Error", "Truyện không tồn tại", 404);
    }
    return createResponse("Success", story);
  } catch (error) {
    return createResponse(getErrorMessage(error), null, 500);
  }
}
