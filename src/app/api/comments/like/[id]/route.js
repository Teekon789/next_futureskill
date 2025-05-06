import { connectMongoDB } from "../../../../../../lib/mongodb";
import Comment from "../../../../../../models/comment";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

// เพิ่มจำนวนไลค์ของคอมเมนต์
export async function POST(req, { params }) {
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
        
        // เพิ่มจำนวนไลค์
        const updatedComment = await Comment.findByIdAndUpdate(
            id,
            { $inc: { likes: 1 } }, // เพิ่มค่า likes ขึ้น 1
            { new: true } // ส่งค่า document ที่อัปเดตแล้วกลับมา
        );
        
        return NextResponse.json({ 
            message: "เพิ่มไลค์สำเร็จ",
            likes: updatedComment.likes
        }, { status: 200 });
    } catch (error) {
        console.error("Error liking comment:", error);
        return NextResponse.json(
            { message: "เกิดข้อผิดพลาดในการเพิ่มไลค์" }, 
            { status: 500 }
        );
    }
}