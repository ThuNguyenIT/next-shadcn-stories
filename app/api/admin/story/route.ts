import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createResponse, getErrorMessage } from "@/lib/utils";
import { PAGE_SIZE } from "@/constants/common";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || PAGE_SIZE);
    const skip = (page - 1) * pageSize;

    const title = searchParams.get("title") || "";
    const description = searchParams.get("description") || "";
    const status = searchParams.get("status") || "";
    const author =
      searchParams.get("author") && parseInt(searchParams.get("author")!, 10);
    const list =
      searchParams.get("list") && parseInt(searchParams.get("list")!, 10);
    const category =
      searchParams.get("category") &&
      parseInt(searchParams.get("category")!, 10);

    const where = {
      isActive: true,
      ...(title && { title: { contains: title.toLowerCase() } }),
      ...(description && {
        description: { contains: description.toLowerCase() },
      }),
      ...(status && { status }),
      ...(author && { author_id: author }),
      ...(list && {
        lists: {
          some: { list_id: list },
        },
      }),
      ...(category && {
        categories: {
          some: { category_id: category },
        },
      }),
    };

    const [result, totalCount] = await Promise.all([
      prisma.stories.findMany({
        skip,
        take: pageSize,
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
            },
          },
          lists: {
            select: {
              list: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          categories: {
            select: {
              category: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      }),
      prisma.stories.count({ where }),
    ]);

    const pagination = {
      total: totalCount,
      page,
      pageSize,
      totalPages: Math.ceil(totalCount / pageSize),
    };

    return createResponse("Thành công", { result, pagination });
  } catch (error) {
    return createResponse(getErrorMessage(error), null, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const {
      title,
      slug,
      description,
      avatar_image,
      cover_image,
      author_id,
      isActive,
      status,
      labels,
      tag,
      total_chapter,
      listIds,
      categoryIds,
    } = await req.json();

    const result = await prisma.stories.create({
      data: {
        title,
        slug,
        description,
        avatar_image,
        cover_image,
        author_id,
        isActive,
        status,
        labels,
        tag,
        total_chapter,
        lists: {
          create: listIds?.map((listId: number) => ({
            list: { connect: { id: listId } },
          })),
        },
        categories: {
          create: categoryIds?.map((categoryId: number) => ({
            category: { connect: { id: categoryId } },
          })),
        },
      },
    });

    return createResponse("Thành công", result);
  } catch (error) {
    return createResponse(getErrorMessage(error), null, 500);
  }
}
