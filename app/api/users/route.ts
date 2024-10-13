import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PUT(req: NextRequest) {
    try {
        const { id, full_name, mobile, address, birthday } =
            await req.json();

        if (!id) {
            return NextResponse.json(
                { message: "Người dùng không tồn tại" },
                { status: 400 }
            );
        }

        const updatedUser = await prisma.users.update({
            where: { id },
            data: {
                full_name,
                mobile,
                address,
                birthday
            },
        });

        return NextResponse.json(
            { message: "Success", user: updatedUser },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error registering user:", error);
        return NextResponse.json(
            { message: "Error registering user" },
            { status: 500 }
        );
    }
}
