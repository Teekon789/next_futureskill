"use client"

import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Container from '../components/Container'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

function LoginPage() {
    // สร้าง state เพื่อเก็บข้อมูลจากฟอร์ม
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);  // ใช้เพื่อควบคุมการแสดงผลในช่วงที่ยังโหลดข้อมูล

    const router = useRouter();
    const { data: session, status } = useSession();

    // ตรวจสอบสถานะการเข้าสู่ระบบเมื่อโหลดหน้า
    useEffect(() => {
        if (status === 'loading') {
            setLoading(true)
            return
        }
        if (session) {
            router.replace('/welcome')
        }
        setLoading(false)
    }, [session, status, router])
    
    // แสดงหน้า loading ระหว่างตรวจสอบสถานะ
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
                <div className="text-center">
                    <div className="h-16 w-16 mx-auto mb-4 rounded-full border-4 border-t-indigo-600 animate-spin"></div>
                    <p className="text-gray-500 font-medium">กำลังโหลด...</p>
                </div>
            </div>
        )
    }

    // จัดการการส่งฟอร์ม login
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await signIn("credentials", {
                email, password, redirect: false
            })

            if (res.error) {
                setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
                return;
            }

            router.replace("welcome");
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Container>
            <Navbar />
            <div className='flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-gray-100'>
                <div className='w-full max-w-md'>
                    <div className='bg-white rounded-2xl shadow-xl overflow-hidden'>
                        {/* ส่วนหัวของฟอร์ม */}
                        <div className='bg-indigo-600 py-6'>
                            <h2 className='text-center text-3xl font-extrabold text-white'>เข้าสู่ระบบ</h2>
                            <p className='text-center text-indigo-200 text-sm mt-2'>ยินดีต้อนรับกลับ</p>
                        </div>
                        
                        {/* ส่วนของฟอร์ม */}
                        <div className='p-8'>
                            <form onSubmit={handleSubmit} className='space-y-6'>
                                {error && (
                                    <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative' role="alert">
                                        <span className='block sm:inline'>{error}</span>
                                    </div>
                                )}
                                
                                <div>
                                    <label htmlFor="email" className='block text-sm font-medium text-gray-700'>อีเมล</label>
                                    <div className='mt-1'>
                                        <input
                                            id="email"
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className='appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                                            placeholder='กรอกอีเมลของคุณ'
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label htmlFor="password" className='block text-sm font-medium text-gray-700'>รหัสผ่าน</label>
                                    <div className='mt-1'>
                                        <input
                                            id="password"
                                            type="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className='appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                                            placeholder='กรอกรหัสผ่านของคุณ'
                                        />
                                    </div>
                                </div>
                                
                                <div className='flex items-center justify-between'>
                                    <div className='flex items-center'>
                                        <input
                                            id="remember-me"
                                            name="remember-me"
                                            type="checkbox"
                                            className='h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'
                                        />
                                        <label htmlFor="remember-me" className='ml-2 block text-sm text-gray-700'>
                                            จดจำฉัน
                                        </label>
                                    </div>
                                
                                </div>
                                
                                <div>
                                    <button
                                        type="submit"
                                        className='w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out'
                                    >
                                        เข้าสู่ระบบ
                                    </button>
                                </div>
                            </form>
                            
                            
                            <div className='mt-6 text-center'>
                                <p className='text-sm text-gray-600'>
                                    ยังไม่มีบัญชี? 
                                    <Link href="/register" className='ml-1 font-medium text-indigo-600 hover:text-indigo-500'>
                                        สมัครสมาชิก
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </Container>
    )
}

export default LoginPage