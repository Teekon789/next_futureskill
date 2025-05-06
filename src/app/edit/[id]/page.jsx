"use client"

import React, { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Link from 'next/link'
import Container from '../../components/Container'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { Edit, ImagePlus, FileText, Save, ArrowLeft, RefreshCw } from 'lucide-react'

function EditPage({ params }) {

    const { data: session } = useSession();
    if (!session) redirect("/login");

    const { id } = params;
    
    const [loading, setLoading] = useState(true); // เพิ่มสถานะการโหลด
    const [postData, setPostData] = useState("");

    // ข้อมูลใหม่ของโพสต์
    const [newTitle, setNewTitle] = useState("");
    const [newImg, setNewImg] = useState("");
    const [newContent, setNewContent] = useState("");

    const router = useRouter();

    // ดึงข้อมูลโพสต์ตาม ID
    const getPostById = async (id) => {
        try {
            setLoading(true); // เริ่มการโหลด
            
            const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/posts/${id}`, {
                method: "GET",
                cache: "no-store"
            })

            if (!res.ok) {
                throw new Error("ไม่สามารถดึงข้อมูลโพสต์ได้");
            }

            const data = await res.json();
            console.log("Edit post: ", data);
            setPostData(data);
            
            // อัพเดทค่าเริ่มต้นให้กับฟอร์ม
            if (data.post) {
                setNewTitle(data.post.title || "");
                setNewImg(data.post.img || "");
                setNewContent(data.post.content || "");
            }
            
        } catch(error) {
            console.log(error);
        } finally {
            setLoading(false); // สิ้นสุดการโหลด
        }
    }

    useEffect(() => {
        getPostById(id)
    }, [id])

    // ฟังก์ชันจัดการการส่งฟอร์ม
    const handleSubmit = async (e) => {
        e.preventDefault();

        // ตรวจสอบข้อมูลที่กรอก
        if (!newTitle || !newImg || !newContent) {
            alert("กรุณากรอกข้อมูลให้ครบทุกช่อง");
            return;
        }

        try {
            // แสดงสถานะกำลังอัพเดท
            setLoading(true);
            
            const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/posts/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json" // แก้ไขให้ถูกต้อง
                },
                body: JSON.stringify({ newTitle, newImg, newContent })
            })

            if (!res.ok) {
                throw new Error("ไม่สามารถอัพเดทโพสต์ได้");
            }

            router.refresh();
            router.push("/welcome");

        } catch(error) {
            console.log(error);
            alert("เกิดข้อผิดพลาดในการอัพเดทโพสต์");
        } finally {
            setLoading(false);
        }
    }

  return (
    <Container>
        <Navbar session={session} />
            <div className='flex-grow bg-gray-50'>
                <div className='container mx-auto max-w-3xl shadow-xl my-10 p-8 rounded-xl bg-white'>
                    {/* ปุ่มย้อนกลับ */}
                    <Link href="/welcome" className='inline-flex items-center gap-2 bg-gray-600 hover:bg-gray-700 transition-colors text-white py-2 px-4 rounded-lg font-medium'>
                        <ArrowLeft size={18} />
                        <span>ย้อนกลับ</span>
                    </Link>
                    
                    <div className='my-6 border-b border-gray-200 pb-2'>
                        <h3 className='text-2xl font-bold text-gray-800 flex items-center gap-2'>
                            <Edit className="text-indigo-500" size={24} />
                            แก้ไขโพสต์
                        </h3>
                        <p className='text-gray-500 mt-1'>แก้ไขข้อมูลโพสต์ของคุณด้านล่าง</p>
                    </div>
                    
                    {loading ? (
                        <div className='flex flex-col items-center justify-center py-12'>
                            <RefreshCw size={40} className='text-blue-500 animate-spin mb-4' />
                            <p className='text-gray-600'>กำลังโหลดข้อมูล...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className='space-y-6'>
                            {/* ช่องกรอกชื่อโพสต์ */}
                            <div className='space-y-2'>
                                <label className='text-gray-700 font-medium flex items-center gap-2'>
                                    <FileText size={18} className="text-indigo-500" />
                                    หัวข้อโพสต์
                                </label>
                                <input 
                                    type="text" 
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)} 
                                    className='w-full bg-gray-50 border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 py-3 px-4 rounded-lg text-gray-700 transition-all outline-none' 
                                    placeholder='ใส่หัวข้อโพสต์ของคุณที่นี่' 
                                />
                            </div>
                            
                            {/* ช่องกรอก URL รูปภาพ */}
                            <div className='space-y-2'>
                                <label className='text-gray-700 font-medium flex items-center gap-2'>
                                    <ImagePlus size={18} className="text-indigo-500" />
                                    URL รูปภาพ
                                </label>
                                <input 
                                    type="text" 
                                    value={newImg}
                                    onChange={(e) => setNewImg(e.target.value)} 
                                    className='w-full bg-gray-50 border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 py-3 px-4 rounded-lg text-gray-700 transition-all outline-none' 
                                    placeholder='ใส่ URL รูปภาพของโพสต์' 
                                />
                            </div>
                            
                            {/* ช่องกรอกเนื้อหา */}
                            <div className='space-y-2'>
                                <label className='text-gray-700 font-medium flex items-center gap-2'>
                                    <FileText size={18} className="text-indigo-500" />
                                    เนื้อหาโพสต์
                                </label>
                                <textarea 
                                    value={newContent}
                                    onChange={(e) => setNewContent(e.target.value)} 
                                    className='w-full bg-gray-50 border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 py-3 px-4 rounded-lg text-gray-700 transition-all outline-none' 
                                    rows="8" 
                                    placeholder='เขียนเนื้อหาโพสต์ของคุณที่นี่'
                                ></textarea>
                            </div>
                            
                            {/* ปุ่มอัพเดทโพสต์ */}
                            <button 
                                type='submit' 
                                name='update' 
                                className='flex items-center justify-center gap-2 w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-colors'
                                disabled={loading}
                            >
                                <Save size={18} />
                                อัพเดทโพสต์
                            </button>
                        </form>
                    )}
                </div>
            </div>
        <Footer />
    </Container>
  )
}

export default EditPage