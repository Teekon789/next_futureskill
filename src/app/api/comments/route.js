import { connectMongoDB } from "../../../../lib/mongodb";
import Comment from "../../../../models/comment";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// สร้างคอมเมนต์ใหม่
export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        
        // ตรวจสอบว่ามีการล็อกอินหรือไม่
        if (!session) {
            return NextResponse.json(
                { message: "คุณต้องเข้าสู่ระบบก่อน" }, 
                { status: 401 }
            );
        }

        const { postId, text } = await req.json();
        
        // ตรวจสอบข้อมูลที่จำเป็น
        if (!postId || !text) {
            return NextResponse.json(
                { message: "กรุณาระบุข้อมูลให้ครบถ้วน" }, 
                { status: 400 }
            );
        }

        await connectMongoDB();
        
        // สร้างคอมเมนต์ใหม่
        const comment = await Comment.create({
            postId,
            userId: session.user.id,
            userName: session.user.name,
            text,
            likes: 0
        });

        return NextResponse.json(
            { message: "สร้างคอมเมนต์สำเร็จ", comment }, 
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating comment:", error);
        return NextResponse.json(
            { message: "เกิดข้อผิดพลาดในการสร้างคอมเมนต์" }, 
            { status: 500 }
        );
    }
}

// ดึงคอมเมนต์ทั้งหมดของโพสต์
export async function GET(req) {
    try {
        const postId = req.nextUrl.searchParams.get("postId");
        
        if (!postId) {
            return NextResponse.json(
                { message: "กรุณาระบุ ID ของโพสต์" }, 
                { status: 400 }
            );
        }

        await connectMongoDB();
        
        // ดึงคอมเมนต์และเรียงจากใหม่ไปเก่า
        const comments = await Comment.find({ postId }).sort({ createdAt: -1 });
        
        return NextResponse.json({ comments });
    } catch (error) {
        console.error("Error fetching comments:", error);
        return NextResponse.json(
            { message: "เกิดข้อผิดพลาดในการดึงข้อมูลคอมเมนต์" }, 
            { status: 500 }
        );
    }
}