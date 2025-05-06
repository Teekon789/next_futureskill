import { connectMongoDB } from "../../../../../lib/mongodb";
import Comment from "../../../../../models/comment";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// ดึงคอมเมนต์ตาม ID
export async function GET(req, { params }) {
    try {
        const { id } = params;
        await connectMongoDB();
        const comment = await Comment.findOne({ _id: id });
        
        if (!comment) {
            return NextResponse.json(
                { message: "ไม่พบคอมเมนต์ที่ต้องการ" }, 
                { status: 404 }
            );
        }
        
        return NextResponse.json({ comment }, { status: 200 });
    } catch (error) {
        console.error("Error fetching comment:", error);
        return NextResponse.json(
            { message: "เกิดข้อผิดพลาดในการดึงข้อมูลคอมเมนต์" }, 
            { status: 500 }
        );
    }
}

// อัปเดตคอมเมนต์
export async function PUT(req, { params }) {
    try {
        const session = await getServerSession(authOptions);
        
        // ตรวจสอบว่ามีการล็อกอินหรือไม่
        if (!session) {
            return NextResponse.json(
                { message: "คุณต้องเข้าสู่ระบบก่อน" }, 
                { status: 401 }
            );
        }

        const { id } = params;
        const { text } = await req.json();
        
        await connectMongoDB();
        const comment = await Comment.findById(id);
        
        if (!comment) {
            return NextResponse.json(
                { message: "ไม่พบคอมเมนต์ที่ต้องการ" }, 
                { status: 404 }
            );
        }
        
        // ตรวจสอบว่าเป็นเจ้าของคอมเมนต์หรือไม่
        if (comment.userId !== session.user.id && session.user.role !== "admin") {
            return NextResponse.json(
                { message: "คุณไม่มีสิทธิ์แก้ไขคอมเมนต์นี้" }, 
                { status: 403 }
            );
        }
        
        // อัปเดตคอมเมนต์
        await Comment.findByIdAndUpdate(id, { text });
        
        return NextResponse.json(
            { message: "อัปเดตคอมเมนต์สำเร็จ" }, 
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating comment:", error);
        return NextResponse.json(
            { message: "เกิดข้อผิดพลาดในการอัปเดตคอมเมนต์" }, 
            { status: 500 }
        );
    }
}

// ลบคอมเมนต์
export async function DELETE(req, { params }) {
    try {
        const session = await getServerSession(authOptions);
        
        // ตรวจสอบว่ามีการล็อกอินหรือไม่
        if (!session) {
            return NextResponse.json(
                { message: "คุณต้องเข้าสู่ระบบก่อน" }, 
                { status: 401 }
            );
        }

        const { id } = params;
        
        await connectMongoDB();
        const comment = await Comment.findById(id);
        
        if (!comment) {
            return NextResponse.json(
                { message: "ไม่พบคอมเมนต์ที่ต้องการ" }, 
                { status: 404 }
            );
        }
        
        // ตรวจสอบว่าเป็นเจ้าของคอมเมนต์หรือแอดมินหรือไม่
        if (comment.userId !== session.user.id && session.user.role !== "admin") {
            return NextResponse.json(
                { message: "คุณไม่มีสิทธิ์ลบคอมเมนต์นี้" }, 
                { status: 403 }
            );
        }
        
        // ลบคอมเมนต์
        await Comment.findByIdAndDelete(id);
        
        return NextResponse.json(
            { message: "ลบคอมเมนต์สำเร็จ" }, 
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting comment:", error);
        return NextResponse.json(
            { message: "เกิดข้อผิดพลาดในการลบคอมเมนต์" }, 
            { status: 500 }
        );
    }
}