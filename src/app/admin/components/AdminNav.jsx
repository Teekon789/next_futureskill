"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { signOut } from 'next-auth/react'
import { 
  Menu, 
  X, 
  ChevronDown, 
  User, 
  LogOut, 
  Settings, 
  Layers, 
  Users, 
  FileText, 
  Home,
  Shield 
} from 'lucide-react'

function AdminNav({ session }) {
  // สร้าง state สำหรับเปิด/ปิดเมนูในโหมดมือถือ
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  // สร้าง state สำหรับเปิด/ปิดเมนูผู้ใช้
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  // ฟังก์ชันสลับการแสดงเมนูในโหมดมือถือ
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  // ฟังก์ชันสลับการแสดงเมนูผู้ใช้
  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen)
  }

  // ฟังก์ชันออกจากระบบ
  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <nav className="bg-indigo-600 shadow-md text-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* โลโก้ */}
          <Link href="/admin" className="flex items-center">
            <span className="text-2xl font-bold">BlogApp Admin</span>
          </Link>

          {/* เมนูสำหรับหน้าจอขนาดใหญ่ */}
          <div className="hidden md:flex items-center space-x-4">
            {/* ลิงก์การนำทางหลัก */}        
            <Link href="/" className="text-white hover:text-indigo-200 px-3 py-2 rounded-md font-medium flex items-center">
                <Home size={18} className="mr-1" />
              หน้าแรก
            </Link>

            {/* เมนูผู้ใช้ที่ล็อกอินแล้ว */}
            {session ? (
              <div className="relative">
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center text-white hover:text-indigo-200 px-3 py-2 rounded-md font-medium"
                >
                  <div className="bg-indigo-300 bg-opacity-30 w-8 h-8 rounded-full flex items-center justify-center mr-2">
                    <User size={16} className="text-white" />
                  </div>
                  {session.user.name}
                  <ChevronDown size={16} className="ml-1" />
                </button>
                
                {/* เมนูดรอปดาวน์สำหรับผู้ใช้ */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <button 
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 items-center"
                    >
                      <LogOut size={16} className="mr-2" />
                      ออกจากระบบ
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // ลิงก์เข้าสู่ระบบสำหรับผู้ที่ยังไม่ได้ล็อกอิน
              <Link 
                href="/login" 
                className="bg-white text-indigo-700 px-4 py-2 rounded-md hover:bg-indigo-100 transition-colors duration-300 flex items-center"
              >
                <User size={16} className="mr-2" />
                เข้าสู่ระบบ
              </Link>
            )}
          </div>

          {/* ปุ่มเมนูสำหรับโหมดมือถือ */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-white">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* เมนูโหมดมือถือ */}
      {isMenuOpen && (
        <div className="md:hidden bg-indigo-800 px-4 py-2 shadow-md">
          <Link 
            href="/admin" 
            className="block py-2 text-white border-b border-indigo-700 items-center"
            onClick={() => setIsMenuOpen(false)}
          >
            <Home size={18} className="mr-2" />
            แดชบอร์ด
          </Link>
          
          <Link 
            href="/admin/posts" 
            className="block py-2 text-white border-b border-indigo-700 items-center"
            onClick={() => setIsMenuOpen(false)}
          >
            <FileText size={18} className="mr-2" />
            จัดการบทความ
          </Link>
          
          <Link 
            href="/admin/users" 
            className="block py-2 text-white border-b border-indigo-700 items-center"
            onClick={() => setIsMenuOpen(false)}
          >
            <Users size={18} className="mr-2" />
            จัดการผู้ใช้
          </Link>
          
          <Link 
            href="/admin/categories" 
            className="block py-2 text-white border-b border-indigo-700 items-center"
            onClick={() => setIsMenuOpen(false)}
          >
            <Layers size={18} className="mr-2" />
            หมวดหมู่
          </Link>

          {session ? (
            <>
              <button 
                onClick={handleSignOut}
                className="block w-full text-left py-2 text-white items-center"
              >
                <LogOut size={18} className="mr-2" />
                ออกจากระบบ
              </button>
            </>
          ) : (
            <Link 
              href="/login" 
              className="block py-2 text-white items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <User size={18} className="mr-2" />
              เข้าสู่ระบบ
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}

export default AdminNav