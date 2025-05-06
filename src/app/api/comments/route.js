import { connectMongoDB } from "../../../../lib/mongodb";
import Comment from "../../../../models/comment";
import { NextResponse } from "next/server";

// ดึง comment ทั้งหมดของโพสต์ (GET /api/comments?postId=xxxx)
export async function GET(req) {
  try {
    await connectMongoDB();

    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId");

    if (!postId) {
      return NextResponse.json({ error: "ต้องระบุ postId" }, { status: 400 });
    }

    const comments = await Comment.find({ postId }).sort({ createdAt: -1 });

    return NextResponse.json({ comments });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// สร้าง comment ใหม่ (POST /api/comments)
export async function POST(req) {
  try {
    await connectMongoDB();

    const { postId, name, text } = await req.json();

    if (!postId || !name || !text) {
      return NextResponse.json({ error: "ข้อมูลไม่ครบ" }, { status: 400 });
    }

    const newComment = await Comment.create({ postId, name, text });

    return NextResponse.json({ 
      message: "เพิ่มความคิดเห็นสำเร็จ", 
      comment: {
        ...newComment._doc,
        // ใส่ createdAt ใน response ด้วย
        createdAt: newComment.createdAt
      }
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}