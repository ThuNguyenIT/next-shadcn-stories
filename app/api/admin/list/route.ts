import { PrismaClient } from '@prisma/client'
import { createResponse, getErrorMessage } from '@/lib/utils'
import { pagination } from '@/types/common'

const prisma = new PrismaClient()

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const pageSize = parseInt(searchParams.get('pageSize') || '10', 10)
    const skip = (page - 1) * pageSize

    const [result, totalCount] = await Promise.all([
      prisma.lists.findMany({
        where: {
          status: true,
        },
        skip,
        take: pageSize,
      }),
      prisma.lists.count({
        where: {
          status: true,
        }
      }),
    ])

    const pagination: pagination = {
      total: totalCount,
      page,
      pageSize,
      totalPages: Math.ceil(totalCount / pageSize),
    }

    return createResponse('Thành công', { result, pagination })
  } catch (error) {
    return createResponse(getErrorMessage(error), null, 500)
  }
}

export async function POST(req: Request) {
  try {
    const { name, slug, description, status } = await req.json()
    const result = await prisma.lists.create({
      data: {
        name,
        slug,
        description,
        status,
      }
    })
    
    return createResponse('Thành công', result)
  } catch (error) {
    return createResponse(getErrorMessage(error), null, 500)
  }
}
