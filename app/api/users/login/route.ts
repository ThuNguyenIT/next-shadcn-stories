import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createResponse } from "@/lib/utils";
import jwt, { JwtPayload } from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.NEXTAUTH_SECRET || "default_secret";

export async function authenticateToken(req: NextRequest) {
    const authHeader = req.headers.get("Authorization");
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return null;
    }
    try {
        // Giải mã token và lấy thông tin user
        const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;
        return decoded.userId; // Trả về user_id từ token

    } catch (error) {
        return null;
    }
}
export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        const user = await prisma.users.findUnique({
            where: { email },
        });

        if (!user) {
            return createResponse(
                "Error",
                "Email hoặc mật khẩu không chính xác",
                401
            );
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return createResponse(
                "Error",
                "Email hoặc mật khẩu không chính xác",
                401
            );
        }

        const token = jwt.sign({ userId: user.id }, SECRET_KEY);
        return createResponse("Success", { access_token: token, user, SECRET_KEY }, 200);
    } catch (error) {
        console.error("Error registering user:", error);
        return NextResponse.json(
            { message: "Error registering user" },
            { status: 500 }
        );
    }
}
