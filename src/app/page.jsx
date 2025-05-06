"use client"

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Container from './components/Container';
import { BookOpen, Clock, ArrowRight, User, MessageCircle, Heart, Eye } from 'lucide-react';

export default function HomePage() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [authors, setAuthors] = useState({});
  const [featuredPost, setFeaturedPost] = useState(null);

  // ดึงข้อมูลโพสต์ทั้งหมด
  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/totalposts`, {
        cache: "no-store"
      });

      if (!res.ok) {
        throw new Error("ไม่สามารถดึงข้อมูลโพสต์ได้");
      }

      const data = await res.json();
      
      // จัดเรียงโพสต์ตามวันที่สร้างล่าสุด
      const sortedPosts = data.totalPosts.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      
      // แยกโพสต์แรกเป็น featured post ถ้ามีข้อมูล
      if (sortedPosts.length > 0) {
        setFeaturedPost(sortedPosts[0]);
        setPosts(sortedPosts.slice(1));
      } else {
        setPosts(sortedPosts);
      }
      
      // ดึงข้อมูลผู้เขียนทั้งหมด
      fetchAuthors();
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูลโพสต์:", error);
      setIsLoading(false);
    }
  };

  // ดึงข้อมูลผู้ใช้ทั้งหมดเพื่อแสดงชื่อผู้เขียน
  const fetchAuthors = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/totalusers`, {
        cache: "no-store"
      });

      if (!res.ok) {
        throw new Error("ไม่สามารถดึงข้อมูลผู้ใช้ได้");
      }

      const data = await res.json();
      
      // สร้าง object ที่มี key เป็น email และ value เป็นข้อมูลผู้ใช้
      const authorsMap = {};
      data.totalUsers.forEach(user => {
        authorsMap[user.email] = user;
      });
      
      setAuthors(authorsMap);
      setIsLoading(false);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // ฟังก์ชันจัดรูปแบบวันที่
  const formatDate = (dateString) => {
    if (!dateString) return "";
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('th-TH', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  // ฟังก์ชันตัดข้อความเนื้อหาให้สั้นลง
  const truncateText = (text, maxLength) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  // สร้างฟังก์ชัน random สำหรับจำนวนไลค์และการดู
  const randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // แสดงหน้าโหลดขณะดึงข้อมูล
  if (isLoading) {
    return (
      <Container>
        <Navbar session={session} />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
        <Footer />
      </Container>
    );
  }

  return (
    <Container>
      <Navbar session={session} />

      <div className="flex-grow bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">แหล่งรวมบทความคุณภาพ</h1>
              <p className="text-xl mb-6">ค้นพบความรู้ใหม่ๆ และแบ่งปันประสบการณ์กับผู้อื่น</p>
              {session ? (
                <Link 
                  href="/create" 
                  className="bg-white text-indigo-600 font-medium py-2 px-6 rounded-lg hover:bg-gray-100 transition duration-300 inline-flex items-center"
                >
                  เริ่มเขียนบทความ <ArrowRight size={16} className="ml-2" />
                </Link>
              ) : (
                <Link 
                  href="/login" 
                  className="bg-white text-indigo-600 font-medium py-2 px-6 rounded-lg hover:bg-gray-100 transition duration-300 inline-flex items-center"
                >
                  เข้าสู่ระบบเพื่อเริ่มต้น <ArrowRight size={16} className="ml-2" />
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          {/* Featured Post */}
          {featuredPost && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                <BookOpen className="mr-2 text-indigo-600" />
                บทความล่าสุด
              </h2>
              
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/2 relative h-60 md:h-auto">
                    <Image 
                      src={featuredPost.img || "/placeholder.png"} 
                      alt={featuredPost.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                  <div className="md:w-1/2 p-6 md:p-8">
                    <div className="flex items-center mb-4">
                      <div className="bg-indigo-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                        <User className="text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">
                          {authors[featuredPost.userEmail]?.name || "ผู้ใช้ไม่ระบุชื่อ"}
                        </h3>
                        <p className="text-sm text-gray-500 flex items-center">
                          <Clock size={14} className="mr-1" />
                          {formatDate(featuredPost.createdAt)}
                        </p>
                      </div>
                    </div>
                    
                    <h2 className="text-2xl font-bold mb-3 text-gray-800">{featuredPost.title}</h2>
                    <p className="text-gray-600 mb-6">
                      {truncateText(featuredPost.content, 200)}
                    </p>
                    
                    {/* สถิติการมีส่วนร่วม */}
                    <div className="flex items-center space-x-4 text-gray-500 mb-6">
                      <span className="flex items-center">
                        <Heart size={16} className="mr-1 text-red-500" />
                        {randomNumber(50, 500)}
                      </span>
                      <span className="flex items-center">
                        <MessageCircle size={16} className="mr-1 text-blue-500" />
                        {randomNumber(5, 50)}
                      </span>
                      <span className="flex items-center">
                        <Eye size={16} className="mr-1" />
                        {randomNumber(200, 2000)}
                      </span>
                    </div>
                    
                    <Link 
                      href={`/post/${featuredPost._id}`}
                      className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition-colors duration-300"
                    >
                      อ่านเพิ่มเติม <ArrowRight size={16} className="ml-2" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* All Posts */}
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
              <BookOpen className="mr-2 text-indigo-600" />
              บทความทั้งหมด
            </h2>

            {posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <div 
                    key={post._id} 
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="relative h-48 w-full">
                      <Image 
                        src={post.img || "/placeholder.png"} 
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center mb-3">
                        <div className="bg-indigo-100 w-8 h-8 rounded-full flex items-center justify-center mr-2">
                          <User size={14} className="text-indigo-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {authors[post.userEmail]?.name || "ผู้ใช้ไม่ระบุชื่อ"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(post.createdAt)}
                          </p>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-2 text-gray-800">{post.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {truncateText(post.content, 120)}
                      </p>
                      
                      {/* สถิติการมีส่วนร่วม */}
                      <div className="flex items-center justify-between text-gray-500 mb-4">
                        <div className="flex items-center space-x-3">
                          <span className="flex items-center">
                            <Heart size={14} className="mr-1 text-red-500" />
                            {randomNumber(10, 200)}
                          </span>
                          <span className="flex items-center">
                            <MessageCircle size={14} className="mr-1 text-blue-500" />
                            {randomNumber(0, 30)}
                          </span>
                        </div>
                        <span className="flex items-center text-sm">
                          <Eye size={14} className="mr-1" />
                          {randomNumber(50, 1000)}
                        </span>
                      </div>
                      
                      <Link 
                        href={`/post/${post._id}`}
                        className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        อ่านเพิ่มเติม <ArrowRight size={14} className="ml-1" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                <div className="flex justify-center mb-4">
                  <BookOpen size={48} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-700 mb-2">ยังไม่มีบทความ</h3>
                <p className="text-gray-500 mb-4">ขออภัย ยังไม่มีบทความในระบบ</p>
                {session && (
                  <Link 
                    href="/create" 
                    className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition-colors duration-300"
                  >
                    เขียนบทความแรก <ArrowRight size={16} className="ml-2" />
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </Container>
  );
}