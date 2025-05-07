"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  FileText,
  PlusCircle,
  Search,
  Filter,
  Calendar,
  Layout,
  Users,
  Home,
  Edit,
  Trash2,
} from "lucide-react";

import AdminNav from "../components/AdminNav";
import Footer from "../components/Footer";
import Container from "../components/Container";
import DeleteBtn from "./DeleteBtn";
import SideNav from "../components/SideNav";

function AdminPostsManagePage() {
  // ตรวจสอบสถานะการล็อกอิน
  const { data: session } = useSession();
  if (!session) redirect("/login");
  if (session?.user?.role !== "admin") redirect("/welcome");

  // สถานะข้อมูลโพสต์
  const [allPostsData, setAllPostsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  // ดึงข้อมูลโพสต์ทั้งหมด
  const getAllPostsData = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/totalposts`, {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("ไม่สามารถดึงข้อมูลโพสต์ได้");
      }

      const data = await res.json();
      console.log("ข้อมูลโพสต์ที่ได้รับ:", data.totalPosts); // สำหรับ debug
      setAllPostsData(data.totalPosts);
      setIsLoading(false);
    } catch (error) {
      console.log("เกิดข้อผิดพลาดในการโหลดโพสต์", error);
      setIsLoading(false);
    }
  };

  // เรียกใช้ฟังก์ชันเมื่อโหลดหน้า
  useEffect(() => {
    getAllPostsData();
  }, []);

  // ฟังก์ชันจัดรูปแบบวันที่
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("th-TH", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  // ฟังก์ชันตัดข้อความให้สั้นลง
  const truncateText = (text, maxLength) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
  };

  // กรองข้อมูลด้วย search term
  const filteredPosts = allPostsData.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // จัดเรียงข้อมูล
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortOrder === "newest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortOrder === "oldest") {
      return new Date(a.createdAt) - new Date(b.createdAt);
    } else if (sortOrder === "a-z") {
      return a.title.localeCompare(b.title);
    } else if (sortOrder === "z-a") {
      return b.title.localeCompare(a.title);
    }
    return 0;
  });

  // แสดงหน้าโหลดขณะดึงข้อมูล
  if (isLoading) {
    return (
      <Container>
        <AdminNav session={session} />
        <div className="flex-grow flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
        <Footer />
      </Container>
    );
  }

  return (
    <Container>
      <AdminNav session={session} />
      <div className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* เมนูด้านข้าง */}
            <div className="w-full lg:w-64 flex-shrink-0">
              <SideNav />
            </div>

            {/* เนื้อหาหลัก */}
            <div className="flex-1">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-6 px-6">
                  <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    จัดการบทความ
                  </h1>
                  <p className="text-purple-100">
                    จัดการบทความทั้งหมดบนเว็บไซต์ของคุณ
                  </p>
                </div>

                <div className="p-6">
                  {/* แถบค้นหาและตัวกรอง */}
                  <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <div className="relative w-full sm:w-auto">
                      <input
                        type="text"
                        placeholder="ค้นหาบทความ..."
                        className="w-full sm:w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <Search
                        className="absolute left-3 top-2.5 text-gray-400"
                        size={18}
                      />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <div className="relative w-full sm:w-auto">
                        <select
                          className="appearance-none bg-white pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          value={sortOrder}
                          onChange={(e) => setSortOrder(e.target.value)}
                        >
                          <option value="newest">ล่าสุด</option>
                          <option value="oldest">เก่าสุด</option>
                          <option value="a-z">ชื่อ A-Z</option>
                          <option value="z-a">ชื่อ Z-A</option>
                        </select>
                        <Filter
                          className="absolute left-3 top-2.5 text-gray-400"
                          size={18}
                        />
                      </div>

                      <Link
                        href="/create"
                        className="flex items-center bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors"
                      >
                        <PlusCircle size={18} className="mr-2" />
                        เพิ่มบทความ
                      </Link>
                    </div>
                  </div>

                  {/* ตารางบทความ */}
                  {sortedPosts.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white rounded-lg overflow-hidden">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              รูปภาพ
                            </th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              ชื่อบทความ
                            </th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              เนื้อหา
                            </th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              ผู้เขียน
                            </th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              วันที่
                            </th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              การจัดการ
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {sortedPosts.map((post) => (
                            <tr
                              key={post._id}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="py-4 px-4">
                                <div className="relative h-12 w-12 rounded-md overflow-hidden">
                                  {post.img ? (
                                    <Image
                                      src={post.img}
                                      alt={post.title}
                                      fill
                                      className="object-cover"
                                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                  ) : (
                                    <div className="bg-gray-200 h-full w-full flex items-center justify-center">
                                      <FileText
                                        className="text-gray-400"
                                        size={20}
                                      />
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <Link
                                  href={`/post/${post._id}`}
                                  className="font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
                                >
                                  {truncateText(post.title, 30)}
                                </Link>
                              </td>
                              <td className="py-4 px-4 text-gray-600 text-sm">
                                {truncateText(post.content, 50)}
                              </td>

                              <td className="py-4 px-4 text-gray-500 text-sm">
                                {truncateText(post.userEmail, 50)}
                              </td>

                              <td className="py-4 px-4 text-gray-500 text-sm">
                                <div className="flex items-center">
                                  <Calendar
                                    size={14}
                                    className="mr-1 text-gray-400"
                                  />
                                  {formatDate(post.createdAt)}
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex items-center space-x-2">
                                  <Link
                                    href={`/edit/${post.slug}`}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                    title="แก้ไข"
                                  >
                                    <Edit size={16} />
                                  </Link>
                                  <DeleteBtn
                                    id={post._id}
                                    onDelete={getAllPostsData}
                                  />
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <FileText className="text-gray-400" size={32} />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        ไม่พบบทความ
                      </h3>
                      <p className="text-gray-500 mb-4">
                        ไม่มีบทความที่ตรงกับการค้นหาของคุณ
                      </p>
                      <Link
                        href="/create"
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                      >
                        <PlusCircle size={16} className="mr-2" />
                        สร้างบทความใหม่
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </Container>
  );
}

export default AdminPostsManagePage;
