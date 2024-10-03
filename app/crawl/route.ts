import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'

// Hàm handler cho phương thức GET
export async function GET(req: NextRequest) {
  return new Promise((resolve, reject) => {
    exec('python crawl_truyenfull.py', (error, stdout, stderr) => {
      if (error) {
        return reject(
          new NextResponse(
            JSON.stringify({ error: 'Có lỗi xảy ra khi chạy script Python' }),
            { status: 500 }
          )
        )
      }

      if (stderr) {
        return reject(
          new NextResponse(JSON.stringify({ error: stderr }), { status: 500 })
        )
      }

      // Trả về kết quả từ stdout
      return resolve(
        new NextResponse(JSON.stringify({ output: stdout }), { status: 200 })
      )
    })
  })
}
