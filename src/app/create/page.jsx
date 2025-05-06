"use client"

import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Link from 'next/link'
import Container from '../components/Container'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { PenLine, ImagePlus, FileText, Send, ArrowLeft } from 'lucide-react'

function CreatePage() {
  
    const { data: session } = useSession();
    if (!session) redirect("/login");

    const userEmail = session?.user?.email;

    const [title, setTitle] = useState("");
    const [img, setImg] = useState("");
    const [content, setContent] = useState("");

    const router = useRouter();

    // ฟังก์ชันจัดการการส่งฟอร์ม
    const handleSubmit = async (e) => {
        e.preventDefault();

        // ตรวจสอบข้อมูลที่กรอก
        if (!title || !img || !content) {
            alert("กรุณากรอกข้อมูลให้ครบทุกช่อง");
            return;
        }

        try {
            // ส่งข้อมูลไปยัง API
            const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/posts`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ title, img, content, userEmail })
            })

            if (res.ok) {
                router.push("/welcome");
            } else {
                throw new Error("ไม่สามารถสร้างโพสต์ได้");
            }

        } catch(error) {
            console.log(error)
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
                            <PenLine className="text-green-500" size={24} />
                            สร้างโพสต์ใหม่
                        </h3>
                        <p className='text-gray-500 mt-1'>กรอกข้อมูลด้านล่างเพื่อสร้างโพสต์ของคุณ</p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className='space-y-6'>
                        {/* ช่องกรอกชื่อโพสต์ */}
                        <div className='space-y-2'>
                            <label className='text-gray-700 font-medium flex items-center gap-2'>
                                <FileText size={18} className="text-green-500" />
                                หัวข้อโพสต์
                            </label>
                            <input 
                                type="text" 
                                onChange={(e) => setTitle(e.target.value)} 
                                className='w-full bg-gray-50 border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 py-3 px-4 rounded-lg text-gray-700 transition-all outline-none' 
                                placeholder='ใส่หัวข้อโพสต์ของคุณที่นี่' 
                            />
                        </div>
                        
                        {/* ช่องกรอก URL รูปภาพ */}
                        <div className='space-y-2'>
                            <label className='text-gray-700 font-medium flex items-center gap-2'>
                                <ImagePlus size={18} className="text-green-500" />
                                URL รูปภาพ
                            </label>
                            <input 
                                type="text" 
                                onChange={(e) => setImg(e.target.value)} 
                                className='w-full bg-gray-50 border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 py-3 px-4 rounded-lg text-gray-700 transition-all outline-none' 
                                placeholder='ใส่ URL รูปภาพของโพสต์' 
                            />
                        </div>
                        
                        {/* ช่องกรอกเนื้อหา */}
                        <div className='space-y-2'>
                            <label className='text-gray-700 font-medium flex items-center gap-2'>
                                <FileText size={18} className="text-green-500" />
                                เนื้อหาโพสต์
                            </label>
                            <textarea 
                                onChange={(e) => setContent(e.target.value)} 
                                className='w-full bg-gray-50 border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 py-3 px-4 rounded-lg text-gray-700 transition-all outline-none' 
                                rows="8" 
                                placeholder='เขียนเนื้อหาโพสต์ของคุณที่นี่'
                            ></textarea>
                        </div>
                        
                        {/* ปุ่มสร้างโพสต์ */}
                        <button 
                            type='submit' 
                            name='create' 
                            className='flex items-center justify-center gap-2 w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors'
                        >
                            <Send size={18} />
                            สร้างโพสต์
                        </button>
                    </form>
                </div>
            </div>
        <Footer />
    </Container>
  )
}

export default CreatePage