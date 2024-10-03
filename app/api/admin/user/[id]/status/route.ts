import { NextRequest } from 'next/server'
import { getCookie } from 'cookies-next'
import bcrypt from 'bcryptjs'

import { prisma } from '@/lib/prisma'
import { createResponse, getErrorMessage, getRequestInfo } from '@/lib/utils'

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await req.json()

    const userId = parseInt(params.id)
    const sessionId = req.cookies.get('sessionId')?.value

    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!existingUser) {
      return createResponse('Tài khoản không tồn tại', null, 404)
    }

    const { userAgent, ipAddress } = getRequestInfo(req)

    await prisma.user.update({
      where: { id: userId },
      data: {
        status: status,
        user_activity: {
          create: {
            action: 'USER_UPDATE_STATUS',
            description: 'Cập nhật trạng thái',
            ip_address: ipAddress,
            user_agent: userAgent,
            session_id: getCookie('session_id') ?? sessionId
          }
        }
      }
    })

    return createResponse('Thành công')
  } catch (error) {
    return createResponse(getErrorMessage(error), null, 500)
  }
}
