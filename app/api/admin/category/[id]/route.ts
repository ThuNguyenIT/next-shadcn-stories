import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";
import { createResponse, getErrorMessage } from "@/lib/utils";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const category = await prisma.categories.findUnique({
      where: { id: parseInt(params.id) },
    });
    if (!category) {
      return createResponse("Không tìm thấy", null, 404);
    }

    return createResponse("Thành công", category);
  } catch (error) {
    return createResponse(getErrorMessage(error), null, 500);
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { name, slug, description, status } = await req.json();
    const updatedCategory = await prisma.categories.update({
      where: { id: parseInt(params.id) },
      data: {
        name,
        slug,
        description,
        status,
      },
    });
    return createResponse("Thành công", updatedCategory);
  } catch (error) {
    return createResponse(getErrorMessage(error), null, 500);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.categories.delete({
      where: { id: parseInt(params.id) },
    });
    return createResponse("Thành công");
  } catch (error) {
    return createResponse(getErrorMessage(error), null, 500);
  }
}
