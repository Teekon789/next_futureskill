"use client"

import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Container from '../components/Container'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

function RegisterPage() {
    // สร้าง state เพื่อเก็บข้อมูลจากฟอร์ม
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("รหัสผ่านไม่ตรงกัน");
            return;
        }

        if (!name || !email || !password || !confirmPassword) {
            setError("กรุณากรอกข้อมูลให้ครบทุกช่อง");
            return;
        }

        try {
            const resUserExists = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/userExists`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email })
            });

            const { user } = await resUserExists.json();

            if (user) {
                setError("อีเมลนี้มีผู้ใช้งานแล้ว");
                return;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name, email, password
                })
            });

            if (res.ok) {
                const form = e.target;
                setError("");
                setSuccess("ลงทะเบียนสำเร็จ กรุณาเข้าสู่ระบบ");
                form.reset();
                // รอ 2 วินาทีแล้วนำทางไปยังหน้า login
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            } else {
                setError("เกิดข้อผิดพลาดในการลงทะเบียน");
            }
        } catch (error) {
            console.log("Error during registration: ", error);
            setError("เกิดข้อผิดพลาด โปรดลองอีกครั้ง");
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
                            <h2 className='text-center text-3xl font-extrabold text-white'>สมัครสมาชิก</h2>
                            <p className='text-center text-indigo-200 text-sm mt-2'>เริ่มต้นใช้งานกับเรา</p>
                        </div>
                        
                        {/* ส่วนของฟอร์ม */}
                        <div className='p-8'>
                            <form onSubmit={handleSubmit} className='space-y-5'>
                                {/* แสดงข้อความ error */}
                                {error && (
                                    <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative' role="alert">
                                        <span className='block sm:inline'>{error}</span>
                                    </div>
                                )}
                                
                                {/* แสดงข้อความ success */}
                                {success && (
                                    <div className='bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative' role="alert">
                                        <span className='block sm:inline'>{success}</span>
                                    </div>
                                )}
                                
                                {/* ชื่อ */}
                                <div>
                                    <label htmlFor="name" className='block text-sm font-medium text-gray-700'>ชื่อ-นามสกุล</label>
                                    <div className='mt-1'>
                                        <input
                                            id="name"
                                            type="text"
                                            required
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className='appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                                            placeholder='กรอกชื่อ-นามสกุลของคุณ'
                                        />
                                    </div>
                                </div>
                                
                                {/* อีเมล */}
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
                                
                                {/* รหัสผ่าน */}
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
                                
                                {/* ยืนยันรหัสผ่าน */}
                                <div>
                                    <label htmlFor="confirmPassword" className='block text-sm font-medium text-gray-700'>ยืนยันรหัสผ่าน</label>
                                    <div className='mt-1'>
                                        <input
                                            id="confirmPassword"
                                            type="password"
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className='appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                                            placeholder='ยืนยันรหัสผ่านของคุณ'
                                        />
                                    </div>
                                </div>
                                
                                {/* ปุ่มสมัครสมาชิก */}
                                <div>
                                    <button
                                        type="submit"
                                        className='w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out'
                                    >
                                        สมัครสมาชิก
                                    </button>
                                </div>
                            </form>
                            
                            {/* ลิงก์ไปหน้า login */}
                            <div className='mt-6 text-center'>
                                <p className='text-sm text-gray-600'>
                                    มีบัญชีอยู่แล้ว? 
                                    <Link href="/login" className='ml-1 font-medium text-indigo-600 hover:text-indigo-500'>
                                        เข้าสู่ระบบ
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

export default RegisterPage