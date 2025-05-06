"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { signOut } from 'next-auth/react';
import { Home, Menu, X, User, LogOut } from 'lucide-react';

function Navbar({ session }) {
  const [isClient, setIsClient] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);  // ทำให้แน่ใจว่าโค้ดนี้ทำงานในฝั่ง Client เท่านั้น
  }, []);

  if (!isClient) {
    return null; // หรือแสดงข้อความว่า "กำลังโหลด..."
  }

  // ฟังก์ชั่นเปิด/ปิดเมนูบนมือถือ
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className='shadow-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white'>
      <div className='container mx-auto'>
        <div className='flex justify-between items-center p-4'>
          <div className='flex items-center space-x-2'>
            <Link href="/" className='flex items-center'>
              {/* โลโก้ใหม่ - ใช้ตัวอักษรแทนในกรณีที่ไม่มีไฟล์รูป */}
              <div className='bg-white rounded-full p-2 shadow-md'>
                <Home className='text-indigo-600' size={24} />
              </div>
              <span className='ml-2 font-bold text-xl'>SmartDash</span>
            </Link>
          </div>
          
          {/* เมนูสำหรับหน้าจอกว้าง */}
          <div className='hidden md:block'>
            <ul className='flex space-x-6 items-center'>
              {!session ? (
                <>
                  <li>
                    <Link href="/login" className='hover:text-indigo-200 transition-colors duration-300'>เข้าสู่ระบบ</Link>
                  </li>
                  <li>
                    <Link href="/register" className='bg-white text-indigo-600 hover:bg-indigo-100 py-2 px-4 rounded-md font-medium transition-colors duration-300'>สมัครสมาชิก</Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link href="/welcome" className='flex items-center hover:text-indigo-200 transition-colors duration-300'>
                      <User size={18} className='mr-1' />
                      <span>โปรไฟล์</span>
                    </Link>
                  </li>
                  <li>
                    <button 
                      onClick={() => signOut()} 
                      className='flex items-center bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition-colors duration-300'
                    >
                      <LogOut size={18} className='mr-1' />
                      <span>ออกจากระบบ</span>
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
          
          {/* ปุ่มแฮมเบอร์เกอร์สำหรับมือถือ */}
          <div className='md:hidden'>
            <button onClick={toggleMenu} className='p-2'>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* เมนูแบบ dropdown สำหรับมือถือ */}
        {isMenuOpen && (
          <div className='md:hidden bg-indigo-700 p-4 rounded-b-lg shadow-inner'>
            {!session ? (
              <ul className='space-y-3'>
                <li>
                  <Link href="/login" className='block py-2 px-4 hover:bg-indigo-600 rounded-md transition-colors duration-300'>
                    เข้าสู่ระบบ
                  </Link>
                </li>
                <li>
                  <Link href="/register" className='block py-2 px-4 bg-white text-indigo-600 rounded-md font-medium'>
                    สมัครสมาชิก
                  </Link>
                </li>
              </ul>
            ) : (
              <ul className='space-y-3'>
                <li>
                  <Link href="/welcome" className='flex items-center py-2 px-4 hover:bg-indigo-600 rounded-md transition-colors duration-300'>
                    <User size={18} className='mr-2' />
                    <span>โปรไฟล์</span>
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={() => signOut()} 
                    className='w-full flex items-center py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors duration-300'
                  >
                    <LogOut size={18} className='mr-2' />
                    <span>ออกจากระบบ</span>
                  </button>
                </li>
              </ul>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;