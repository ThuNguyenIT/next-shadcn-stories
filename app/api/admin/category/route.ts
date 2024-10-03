import { NextRequest } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { createResponse, getErrorMessage } from '@/lib/utils'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const categoriesWithNovels = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        novels: {
            include: {
                novel: true,
            },
        },
      }
    })

    const result = categoriesWithNovels.map(category => ({
        categoryName: category.name,
        totalNovels: category.novels.length,
        novels: category.novels.map(novelCategory => novelCategory.novel),
      }));
      

    return createResponse('Thành công', result)
  } catch (error) {
    return createResponse(getErrorMessage(error), null, 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, slug, description } = body

    const newCategory = await prisma.category.create({
      data: {
        name,
        slug,
        description
      }
    })

    return createResponse('Thành công', newCategory)
  } catch (error) {
    return createResponse(getErrorMessage(error), null, 500)
  }
}
