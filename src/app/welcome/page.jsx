"use client"

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import Container from '../components/Container';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import DeleteBtn from './DeleteBtn';
import { PenSquare, Plus, Clock, BarChart3, BookOpen, User } from 'lucide-react';
import DashboardLoadingScreen from '../components/DashboardLoadingScreen';

function WelcomePage() {
  const { data: session } = useSession();
  const [postData, setPostData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPosts: 0,
    lastActive: '', // ตัวอย่างข้อมูล
  });

  const userEmail = session?.user?.email;

  if (!session) redirect('/login');
  
  if (session?.user?.role === "admin") redirect("/admin");



  const getPosts = async () => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/posts?email=${userEmail}`, {
        cache: "no-store"
      });

      if (!res.ok) {
        throw new Error("Failed to fetch posts");
      }

      

      const data = await res.json();
      setPostData(data.posts);
      
      // ตั้งค่า stats
      setStats({
        totalPosts: data.posts.length,
        lastActive: new Date().toLocaleDateString('th-TH', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      });
      
      setIsLoading(false);
    } catch(error) {
      console.log("Error loading posts: ", error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <Container>
      <Navbar session={session} />
      {isLoading ? (
        <DashboardLoadingScreen />
      ) : (
      <div className='flex-grow bg-gray-50'>
        <div className='container mx-auto py-8 px-4'>
          {/* แบนเนอร์สำหรับผู้ใช้ */}
          <div className='bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg text-white p-8 mb-8'>
            <div className='flex flex-col md:flex-row justify-between items-center'>
              <div>
                <h1 className='text-3xl md:text-4xl font-bold mb-2'>ยินดีต้อนรับ, {session?.user?.name}</h1>
                <p className='text-indigo-100'>จัดการเนื้อหาและโพสต์ของคุณได้ที่นี่</p>
              </div>
              <div className='mt-4 md:mt-0 bg-white/20 backdrop-blur-sm p-4 rounded-xl shadow-inner flex items-center'>
                <User size={36} className='text-white mr-3' />
                <div>
                  <p className='text-sm'>Email</p>
                  <p className='font-medium'>{session?.user?.email}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* แดชบอร์ดสถิติ */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
            {/* บล็อกสถิติ 1 */}
            <div className='bg-white p-6 rounded-xl shadow'>
              <div className='flex items-center'>
                <div className='bg-indigo-100 p-3 rounded-lg'>
                  <BookOpen size={24} className='text-indigo-600' />
                </div>
                <div className='ml-4'>
                  <p className='text-gray-500 text-sm'>โพสต์ทั้งหมด</p>
                  <h3 className='text-2xl font-bold'>{stats.totalPosts}</h3>
                </div>
              </div>
            </div>
            
            {/* บล็อกสถิติ 2 */}
            <div className='bg-white p-6 rounded-xl shadow'>
              <div className='flex items-center'>
                <div className='bg-purple-100 p-3 rounded-lg'>
                  <Clock size={24} className='text-purple-600' />
                </div>
                <div className='ml-4'>
                  <p className='text-gray-500 text-sm'>เข้าใช้งานล่าสุด</p>
                  <h3 className='text-lg font-bold'>{stats.lastActive}</h3>
                </div>
              </div>
            </div>
            
            {/* ปุ่มสร้างโพสต์ใหม่ */}
            <div className='bg-white p-6 rounded-xl shadow'>
              <Link 
                href="/create" 
                className='flex items-center justify-center bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 px-4 rounded-lg transition-all duration-300 h-full'
              >
                <Plus size={20} className='mr-2' />
                <span className='font-medium'>สร้างโพสต์ใหม่</span>
              </Link>
            </div>
          </div>
          
          {/* รายการโพสต์ */}
          <div className='bg-white rounded-2xl shadow-lg p-6'>
            <h2 className='text-2xl font-bold mb-6 text-gray-800 flex items-center'>
              <BarChart3 className='mr-2 text-indigo-600' />
              โพสต์ของคุณ
            </h2>
            
            {isLoading ? (
              <div className='flex justify-center items-center py-20'>
                <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500'></div>
              </div>
            ) : (
              <>
                {postData && postData.length > 0 ? (
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    {postData.map(val => (
                      <div key={val._id} className='bg-white border border-gray-100 rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1'>
                        <div className='relative h-48 w-full overflow-hidden'>
                          <Image 
                            src={val.img}
                            alt={val.title}
                            fill
                            className='object-cover'
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        </div>
                        <div className='p-5'>
                          <h3 className='text-xl font-bold mb-2 text-gray-800'>{val.title}</h3>
                          <p className='text-gray-600 mb-4 line-clamp-3'>
                            {val.content}
                          </p>
                          <div className='flex space-x-2'>
                            <Link 
                              href={`/edit/${val._id}`}
                              className='flex items-center bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition-colors duration-300'
                            >
                              <PenSquare size={16} className='mr-1' />
                              แก้ไข
                            </Link>
                            <DeleteBtn id={val._id} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className='bg-gray-50 border border-gray-200 rounded-lg p-8 text-center'>
                    <div className='flex justify-center mb-4'>
                      <BookOpen size={48} className='text-gray-400' />
                    </div>
                    <h3 className='text-xl font-medium text-gray-700 mb-2'>ยังไม่มีโพสต์</h3>
                    <p className='text-gray-500 mb-4'>คุณยังไม่มีโพสต์ในระบบ เริ่มสร้างโพสต์แรกของคุณเลย</p>
                    <Link 
                      href="/create" 
                      className='inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition-colors duration-300'
                    >
                      <Plus size={16} className='mr-1' />
                      สร้างโพสต์แรก
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      )}
      {/* พื้นที่สำหรับ Footer */}
      <Footer />
    </Container>
  );
}

export default WelcomePage;