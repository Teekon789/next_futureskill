"use client"

import Image from "next/image";
import Container from "./components/Container";
import Navbar from "./components/Navbar";
import Vercel from '../../public/vercel.svg'
import Footer from "./components/Footer";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ArrowRight, PenSquare, BookOpen, Users } from 'lucide-react';

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Container>
        <Navbar session={session} />
        
        {/* Hero Section */}
        <div className="flex-grow text-center px-4 py-20">
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-4">
            จัดการบทความของคุณ
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            ระบบจัดการบทความที่ใช้งานง่าย พร้อมฟีเจอร์ที่ครบครัน สำหรับนักเขียนและผู้จัดการเนื้อหา
          </p>
          
          {/* CTA Button */}
          <Link 
            href={session ? "/welcome" : "/login"}
            className="inline-flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-lg hover:opacity-90 transition-all duration-200 shadow-lg"
          >
            {session ? "เข้าสู่แดชบอร์ด" : "เริ่มต้นใช้งาน"}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
              <div className="bg-indigo-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6 mx-auto">
                <PenSquare className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">จัดการบทความ</h3>
              <p className="text-gray-600">
                สร้าง แก้ไข และจัดการบทความของคุณได้อย่างง่ายดาย
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
              <div className="bg-purple-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6 mx-auto">
                <BookOpen className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">คลังบทความ</h3>
              <p className="text-gray-600">
                จัดระเบียบและค้นหาบทความได้อย่างรวดเร็ว
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
              <div className="bg-emerald-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6 mx-auto">
                <Users className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">ระบบสมาชิก</h3>
              <p className="text-gray-600">
                จัดการสิทธิ์และการเข้าถึงเนื้อหาอย่างปลอดภัย
              </p>
            </div>
          </div>

          {/* Brand Section */}
          <div className="mt-20 mb-10">
            <p className="text-gray-500 mb-6">Powered by</p>
            <div className="flex items-center justify-center space-x-6">
              <Image 
                src={Vercel} 
                width={120} 
                height={0} 
                alt="vercel logo"
                className="opacity-50 hover:opacity-100 transition-opacity duration-200" 
              />
            </div>
          </div>
        </div>
        
        <Footer />
      </Container>
    </main>
  );
}