import { NextRequest } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { createResponse, getErrorMessage } from '@/lib/utils'

const prisma = new PrismaClient()

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const story = await prisma.stories.findUnique({
      where: { id: parseInt(params.id) }
    })

    if (!story) {
        return createResponse('Không tìm thấy', null, 404)
    }

    return createResponse("Thành công", story)
  } catch (error) {
    return createResponse(getErrorMessage(error), null, 500)
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const {
      title,
      slug,
      description,
      avatar_image,
      cover_image,
      isActive,
      status,
      labels,
      tag,
      total_chapter,
      listIds,
      categoryIds,
    } = await req.json()

    const updatedStory = await prisma.stories.update({
      where: { id: parseInt(params.id) },
      data: {
        title,
        slug,
        description,
        avatar_image,
        cover_image,
        isActive,
        status,
        labels,
        tag,
        total_chapter,
        lists: {
          set: [],
          create: listIds?.map((listId: number) => ({
            list: { connect: { id: listId } },
          })),
        },
        categories: {
          set: [],
          create: categoryIds?.map((categoryId: number) => ({
            category: { connect: { id: categoryId } },
          })),
        },
      }
    })

    return createResponse("Thành công", updatedStory)
  } catch (error) {
    return createResponse(getErrorMessage(error), null, 500)
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.stories.delete({
      where: { id: parseInt(params.id) }
    })

    return createResponse("Thành công")
  } catch (error) {
    return createResponse(getErrorMessage(error), null, 500)
  }
}
