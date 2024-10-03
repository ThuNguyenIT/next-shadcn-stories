import { NextRequest } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { createResponse, getErrorMessage } from '@/lib/utils'

const prisma = new PrismaClient()

export async function GET() {
  try {
    if (!prisma) throw new Error('Prisma is not initialized.');


    const result = await prisma.categories.findMany();
    return createResponse('Success', result)
  } catch (error) {
    return createResponse(getErrorMessage(error), null, 500)
  }
}
