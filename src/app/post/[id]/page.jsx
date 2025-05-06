"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Container from "@/app/components/Container";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { 
  MessageCircle, ArrowLeft, 
  ThumbsUp, Send, User, Clock
} from 'lucide-react';

export default function PostDetail() {
  const { id } = useParams();
  const { data: session, status } = useSession();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [author, setAuthor] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  // ฟังก์ชันดึงข้อมูลโพสต์
  const fetchPost = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/totalposts/${id}`);
      if (!res.ok) throw new Error("ไม่สามารถดึงข้อมูลโพสต์ได้");
      const data = await res.json();
      setPost(data.post);
      
      if (data.post) {
        fetchAuthor(data.post.userEmail);
        fetchComments();
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูลโพสต์:", error);
      setIsLoading(false);
    }
  };

  // ดึงข้อมูลผู้โพสต์
  const fetchAuthor = async (email) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/totalusers`, {
        cache: "no-store"
      });
      if (!res.ok) throw new Error("ไม่สามารถดึงข้อมูลผู้ใช้ได้");
      const data = await res.json();
      const authorInfo = data.totalUsers.find(user => user.email === email);
      setAuthor(authorInfo);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูลผู้โพสต์:", error);
    }
  };

  // ดึงความคิดเห็น
  const fetchComments = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/comments?postId=${id}`);
      if (!res.ok) throw new Error("ไม่สามารถดึงข้อมูลความคิดเห็น");
      const data = await res.json();
      setComments(data.comments);
      setIsLoading(false);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูลความคิดเห็น:", error);
      setIsLoading(false);
    }
  };

  // ส่งความคิดเห็นใหม่
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    const newComment = { 
      postId: id, 
      name: session?.user?.name || "ผู้ใช้นิรนาม", 
      text: comment 
    };
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newComment)
      });

      if (!res.ok) throw new Error("ไม่สามารถเพิ่มความคิดเห็น");
      
      const data = await res.json();
      setComments([data.comment, ...comments]);
      setComment("");
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการเพิ่มความคิดเห็น:", error);
    }
  };

  useEffect(() => {
    if (id) fetchPost();
  }, [id]);

  // ฟังก์ชันจัดรูปแบบวันที่
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('th-TH', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <Container>
        <Navbar session={session} />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold mb-4">ไม่พบโพสต์ที่คุณกำลังค้นหา</h1>
            <Link href="/" className="text-indigo-600 flex items-center justify-center">
              <ArrowLeft className="mr-2" /> กลับไปยังหน้าหลัก
            </Link>
          </div>
        </div>
        <Footer />
      </Container>
    );
  }

  return (
    <Container>
      <Navbar session={session} />
      
      <div className="flex-grow bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6">
            <ArrowLeft size={20} className="mr-2" />
            กลับไปยังหน้าหลัก
          </Link>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">{post.title}</h1>
          
          <div className="flex items-center mb-6">
            <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center">
              <User className="text-indigo-600" />
            </div>
            <div className="ml-4">
              <h3 className="font-medium text-gray-800">
                {author?.name || "ผู้ใช้ไม่ระบุชื่อ"}
              </h3>
              <div className="text-sm text-gray-500 flex items-center">
                <Clock size={14} className="mr-1" />
                {formatDate(post.createdAt)}
              </div>
            </div>
          </div>
          
          {post.img && (
            <div className="relative w-full h-80 md:h-96 mb-8 rounded-xl overflow-hidden">
              <Image 
                src={post.img} 
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
          
          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-gray-700 whitespace-pre-line">
              {post.content}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md mb-8">
            <h3 className="text-xl font-bold mb-6 flex items-center">
              <MessageCircle className="mr-2 text-indigo-600" /> 
              ความคิดเห็น ({comments.length})
            </h3>
            
            {session ? (
              <form onSubmit={handleSubmitComment} className="mb-8">
                <div className="flex items-start space-x-4">
                  <div className="bg-indigo-100 w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                    <User size={20} className="text-indigo-600" />
                  </div>
                  <div className="flex-grow">
                    <textarea
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
                      rows="3"
                      placeholder="เพิ่มความคิดเห็นของคุณ..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      required
                    />
                    <div className="mt-2 flex justify-end">
                      <button 
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                      >
                        <Send size={16} className="mr-2" />
                        ส่งความคิดเห็น
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg mb-8 text-center">
                <p className="text-gray-600">
                  โปรด <Link href="/login" className="text-indigo-600 font-medium">เข้าสู่ระบบ</Link> เพื่อแสดงความคิดเห็น
                </p>
              </div>
            )}
            
            <div className="space-y-6">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment._id} className="flex space-x-4">
                    <div className="bg-indigo-100 w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                      <User size={20} className="text-indigo-600" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <div className="text-sm font-semibold">{comment.name}</div>
                        <div className="text-xs text-gray-500 flex items-center">
                          <Clock size={12} className="mr-1" />
                          {formatDate(comment.createdAt)}
                        </div>
                      </div>
                      <div className="text-gray-600 mt-1">{comment.text}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-4">
                  ยังไม่มีความคิดเห็น
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </Container>
  );
}