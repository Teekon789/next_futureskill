"use client"

import { useState, useEffect } from "react";
import Image from "next/image";
import Container from "./components/Container";
import Navbar from "./components/Navbar";
import Vercel from '../../public/vercel.svg';
import Footer from "./components/Footer";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ArrowRight, Heart, MessageCircle, Share2, Calendar, BookOpen, User, Clock } from 'lucide-react';

export default function Home() {
  const { data: session, status } = useSession();
  const [allPosts, setAllPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState({});

  // ดึงข้อมูลโพสต์ทั้งหมด
  const fetchAllPosts = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/totalposts`, {
        cache: "no-store"
      });

      if (!res.ok) {
        throw new Error("ไม่สามารถดึงข้อมูลโพสต์ได้");
      }

      const data = await res.json();
      setAllPosts(data.totalPosts);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูลโพสต์:", error);
    }
  };

  // ดึงข้อมูลผู้ใช้ทั้งหมดเพื่อแสดงชื่อผู้โพสต์
  const fetchAllUsers = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/totalusers`, {
        cache: "no-store"
      });

      if (!res.ok) {
        throw new Error("ไม่สามารถดึงข้อมูลผู้ใช้ได้");
      }

      const data = await res.json();
      
      // สร้าง map จาก email ไปยังชื่อผู้ใช้
      const userMap = {};
      data.totalUsers.forEach(user => {
        userMap[user.email] = user.name;
      });
      
      setUsers(userMap);
      setIsLoading(false);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPosts();
    fetchAllUsers();
  }, []);

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

  // ฟังก์ชันสำหรับตัดข้อความให้สั้นลง
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // สร้างฟังก์ชัน random สำหรับจำนวนไลค์และคอมเมนต์เพื่อการแสดงผล
  const randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Container>
        <Navbar session={session} />
        
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              แพลตฟอร์มแบ่งปันความคิด
            </h1>
            <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
              เรียนรู้ แบ่งปัน และค้นพบเนื้อหาที่น่าสนใจจากคนทั่วโลก
            </p>
            
            {/* CTA Button */}
            <Link 
              href={session ? "/welcome" : "/login"}
              className="inline-flex items-center bg-white text-indigo-600 px-8 py-4 rounded-lg hover:bg-indigo-50 transition-all duration-200 shadow-lg font-medium"
            >
              {session ? "จัดการบทความของคุณ" : "เริ่มต้นใช้งาน"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
        
        {/* Content Section */}
        <div className="max-w-5xl mx-auto py-12 px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center">
              <BookOpen className="mr-3 text-indigo-600" />
              โพสต์ล่าสุด
            </h2>
            
            {session && (
              <Link 
                href="/create" 
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg transition-all duration-300 flex items-center"
              >
                <span className="mr-2">สร้างโพสต์</span>
                <ArrowRight size={16} />
              </Link>
            )}
          </div>
          
          {/* Posts Grid */}
          <div className="space-y-8">
            {allPosts.length > 0 ? (
              [...allPosts].reverse().map((post) => (
                <div key={post._id} className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
                  <div className="p-5 flex items-center border-b border-gray-100">
                    <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center">
                      <User className="text-indigo-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium text-gray-800">
                        {users[post.userEmail] || "ผู้ใช้ไม่ระบุชื่อ"}
                      </h3>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Clock size={14} className="mr-1" />
                        {formatDate(post.createdAt)}
                      </div>
                    </div>
                  </div>
                  
                  {/* รูปภาพโพสต์ */}
                  <div className="relative h-64 w-full">
                    <Image 
                      src={post.img || "/placeholder.png"} 
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  
                  <div className="p-6">
                    <h2 className="text-2xl font-bold mb-3 text-gray-800">{post.title}</h2>
                    <p className="text-gray-600 mb-4">
                      {truncateText(post.content, 200)}
                    </p>
                    
                    {/* ปุ่มอ่านเพิ่มเติม */}
                    <Link 
                      href={`/post/${post._id}`} 
                      className="text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center"
                    >
                      อ่านเพิ่มเติม
                      <ArrowRight size={16} className="ml-1" />
                    </Link>
                  </div>
                  
                  {/* Engagement Section */}
                  <div className="px-6 py-3 bg-gray-50 flex items-center justify-between">
                    <div className="flex space-x-4">
                      <button className="flex items-center text-gray-600 hover:text-red-500 transition-colors">
                        <Heart size={18} className="mr-1" />
                        <span>{randomNumber(5, 120)}</span>
                      </button>
                      <button className="flex items-center text-gray-600 hover:text-blue-500 transition-colors">
                        <MessageCircle size={18} className="mr-1" />
                        <span>{randomNumber(0, 30)}</span>
                      </button>
                    </div>
                    <button className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors">
                      <Share2 size={18} className="mr-1" />
                      <span>แชร์</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">ยังไม่มีโพสต์</h3>
                <p className="text-gray-500">เป็นคนแรกที่แบ่งปันเรื่องราวบนแพลตฟอร์มของเรา</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Call to Action Section */}
        <div className="bg-indigo-50 py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">เริ่มต้นแบ่งปันความคิดของคุณวันนี้</h2>
            <p className="text-gray-600 mb-8 text-lg">
              เข้าร่วมกับชุมชนนักเขียนและผู้อ่านที่กำลังเติบโต สร้างและแบ่งปันเนื้อหาที่น่าสนใจได้ทันที
            </p>
            <Link 
              href={session ? "/welcome" : "/register"}
              className="inline-flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-lg hover:opacity-90 transition-all duration-200 shadow-lg"
            >
              {session ? "จัดการบทความของคุณ" : "ลงทะเบียนฟรี"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
        
        <Footer />
      </Container>
    </main>
  );
}