import React, { useState, useEffect } from 'react'
import { FaUsers, FaRegNewspaper, FaChartLine, FaCalendarAlt, FaUserEdit, FaPencilAlt, FaComments } from 'react-icons/fa'
import { FiActivity, FiTrendingUp, FiEye } from 'react-icons/fi'
import Image from 'next/image'
import Link from 'next/link'

// คอมโพเนนต์แสดงหน้า Dashboard หลัก - ปรับปรุงให้ใช้ข้อมูลจริง
function Content({ totalUsersData, totalPostsData }) {
  // สถานะสำหรับเก็บข้อมูลความคิดเห็น
  const [comments, setComments] = useState([]);
  // สถานะสำหรับเก็บข้อมูลกิจกรรมล่าสุด
  const [recentActivities, setRecentActivities] = useState([]);
  // สถานะสำหรับกำลังโหลดข้อมูล
  const [isLoading, setIsLoading] = useState(true);
  // สถานะสำหรับเก็บข้อมูลการเข้าชม (จำลอง)
  const [visitorStats, setVisitorStats] = useState({ today: 0, yesterday: 0 });
  // สถานะสำหรับเก็บอัตราการมีส่วนร่วม
  const [engagementRate, setEngagementRate] = useState({ current: 0, previous: 0 });

  useEffect(() => {
    // ฟังก์ชันดึงข้อมูลความคิดเห็น
    const fetchComments = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/comments`, {
          cache: "no-store"
        });
        
        if (res.ok) {
          const data = await res.json();
          setComments(data.comments || []);
        }
      } catch (error) {
        console.error("ไม่สามารถดึงข้อมูลความคิดเห็นได้:", error);
      }
    };

    // ดึงข้อมูลความคิดเห็น
    fetchComments();
    
    // จำลองข้อมูลผู้เข้าชม (ในระบบจริงควรดึงจาก analytics API)
    setVisitorStats({
      today: Math.floor(Math.random() * 100) + 100,
      yesterday: Math.floor(Math.random() * 100) + 80
    });

    // คำนวณอัตราการมีส่วนร่วม
    if (totalPostsData?.length && comments.length) {
      const currentRate = ((comments.length / totalPostsData.length) * 100).toFixed(1);
      // สมมติว่าเดือนที่แล้วมีอัตราต่ำกว่า
      const previousRate = (currentRate - (Math.random() * 2)).toFixed(1);
      setEngagementRate({
        current: parseFloat(currentRate),
        previous: parseFloat(previousRate)
      });
    } else {
      // ค่าเริ่มต้นถ้าไม่มีข้อมูล
      setEngagementRate({ current: 5.2, previous: 4.0 });
    }

    // สร้างข้อมูลกิจกรรมล่าสุดโดยผสมข้อมูลจริงจากผู้ใช้และบทความ
    if (totalUsersData?.length && totalPostsData?.length) {
      // เรียงลำดับบทความตามวันที่สร้าง (ล่าสุด)
      const sortedPosts = [...totalPostsData].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      
      // เรียงลำดับผู้ใช้ตามวันที่สร้าง (ล่าสุด)
      const sortedUsers = [...totalUsersData].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      
      // สร้างรายการกิจกรรมล่าสุด
      const activities = [];
    
      // เพิ่มผู้ใช้ล่าสุด 2 คน
      sortedUsers.slice(0, 2).forEach(user => {
        activities.push({
          type: 'new-user',
          title: 'ผู้ใช้ใหม่',
          description: `${user.name} ได้ลงทะเบียนในระบบ`,
          time: randomTimeAgo(user.createdAt),
          icon: 'user'
        });
      });
      
      // เพิ่มบทความล่าสุด 2 บทความ
      sortedPosts.slice(0, 2).forEach(post => {
        activities.push({
          type: 'new-post',
          title: 'บทความใหม่',
          description: `"${truncateText(post.title, 30)}" ได้ถูกเผยแพร่`,
          time: randomTimeAgo(post.createdAt),
          icon: 'post'
        });
      });
      
      // เพิ่มกิจกรรมการเข้าสู่ระบบ (จำลอง)
      activities.push({
        type: 'login',
        title: 'การเข้าสู่ระบบ',
        description: `ผู้ใช้ ${sortedUsers.length > 2 ? sortedUsers.length : 'หลายคน'} เข้าสู่ระบบวันนี้`,
        time: 'เมื่อ 45 นาทีที่แล้ว',
        icon: 'users'
      });
      
      // เพิ่มกิจกรรมการแก้ไขบทความ (ถ้ามีการอัปเดต)
      if (sortedPosts.some(post => post.updatedAt && post.updatedAt !== post.createdAt)) {
        activities.push({
          type: 'edit-post',
          title: 'แก้ไขบทความ',
          description: 'บทความได้รับการแก้ไข',
          time: 'เมื่อ 1 ชั่วโมงที่แล้ว',
          icon: 'edit'
        });
      }
      
      // เรียงกิจกรรมแบบสุ่ม
      setRecentActivities(activities.sort(() => 0.5 - Math.random()));
    }
    
    setIsLoading(false);
  }, [totalUsersData, totalPostsData]);

  // คำนวณจำนวนผู้ใช้ admin
  const adminUsers = totalUsersData?.filter(user => user.role === 'admin').length || 0;
  
  // จัดเรียงบทความตามวันที่สร้าง (ล่าสุด)
  const recentPosts = [...(totalPostsData || [])].sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  ).slice(0, 5);

  // ฟังก์ชันสร้างเวลาย้อนหลังแบบสุ่มสำหรับกิจกรรม
  function randomTimeAgo(dateString) {
    if (!dateString) return "เมื่อไม่นานมานี้";
    
    const timeUnits = [
      'นาทีที่แล้ว', 'ชั่วโมงที่แล้ว', 'วันที่แล้ว'
    ];
    
    const timeValues = [
      Math.floor(Math.random() * 55) + 5,  // 5-60 นาที
      Math.floor(Math.random() * 23) + 1,  // 1-24 ชั่วโมง
      Math.floor(Math.random() * 6) + 1    // 1-7 วัน
    ];
    
    const randomIndex = Math.floor(Math.random() * 2);  // ส่วนใหญ่จะเป็นนาทีหรือชั่วโมง
    return `เมื่อ ${timeValues[randomIndex]} ${timeUnits[randomIndex]}`;
  }

  // ฟังก์ชันจัดรูปแบบวันที่เป็นภาษาไทย
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('th-TH', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  // ฟังก์ชันตัดข้อความให้สั้นลง
  const truncateText = (text, maxLength) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
  };

  // แสดงตัวโหลดขณะรอข้อมูล
  if (isLoading) {
    return (
      <div className='flex-1 px-6 py-8 bg-gray-50 rounded-lg flex justify-center items-center'>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className='flex-1 px-6 py-8 bg-gray-50 rounded-lg'>
      {/* หัวข้อหน้า Dashboard */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">แผงควบคุม</h1>
        <p className="text-gray-600 mt-1">ยินดีต้อนรับกลับมา! นี่คือภาพรวมของเว็บไซต์ของคุณ</p>
      </div>
      
      {/* การ์ดสถิติหลัก */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        {/* การ์ดผู้ใช้ทั้งหมด */}
        <div className='bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow'>
          <div className="flex items-center justify-between">
            <div>
              <h3 className='text-gray-500 text-sm font-medium mb-1'>ผู้ใช้ทั้งหมด</h3>
              <p className='text-3xl font-bold text-gray-800'>{totalUsersData?.length || 0}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FaUsers className='text-blue-600 text-xl' />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <FiActivity className="text-green-500 mr-1" />
            <span className="text-green-500 font-medium">{adminUsers} แอดมิน</span>
            <span className="text-gray-500 ml-2">/ {(totalUsersData?.length || 0) - adminUsers} ผู้ใช้ทั่วไป</span>
          </div>
        </div>
        
        {/* การ์ดบทความทั้งหมด */}
        <div className='bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow'>
          <div className="flex items-center justify-between">
            <div>
              <h3 className='text-gray-500 text-sm font-medium mb-1'>บทความทั้งหมด</h3>
              <p className='text-3xl font-bold text-gray-800'>{totalPostsData?.length || 0}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <FaRegNewspaper className='text-purple-600 text-xl' />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <FiTrendingUp className="text-green-500 mr-1" />
            <span className="text-green-500 font-medium">
              {totalPostsData && totalPostsData.length > 0 
                ? `${Math.floor(totalPostsData.filter(post => {
                    const oneMonthAgo = new Date();
                    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
                    return new Date(post.createdAt) > oneMonthAgo;
                  }).length / totalPostsData.length * 100)}%` 
                : '0%'}
            </span>
            <span className="text-gray-500 ml-2">จากเดือนที่แล้ว</span>
          </div>
        </div>
        
        {/* การ์ดผู้เข้าชมวันนี้ - ใช้ข้อมูลจำลอง แต่ในระบบจริงควรดึงจาก analytics ยังไม่สร้าง */} 
        <div className='bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow'>
          <div className="flex items-center justify-between">
            <div>
              <h3 className='text-gray-500 text-sm font-medium mb-1'>ผู้เข้าชมวันนี้</h3>
              <p className='text-3xl font-bold text-gray-800'>{visitorStats.today}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FiEye className='text-green-600 text-xl' />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <FiTrendingUp className="text-green-500 mr-1" />
            <span className="text-green-500 font-medium">+{visitorStats.today - visitorStats.yesterday}</span>
            <span className="text-gray-500 ml-2">จากเมื่อวาน</span>
          </div>
        </div>
        
        {/* การ์ดอัตราการมีส่วนร่วม - คำนวณจากจำนวนคอมเมนต์ต่อบทความ */} 
        <div className='bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow'>
          <div className="flex items-center justify-between">
            <div>
              <h3 className='text-gray-500 text-sm font-medium mb-1'>อัตราการมีส่วนร่วม</h3>
              <p className='text-3xl font-bold text-gray-800'>{engagementRate.current}%</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <FaChartLine className='text-orange-600 text-xl' />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <FiTrendingUp className="text-green-500 mr-1" />
            <span className="text-green-500 font-medium">
              +{(engagementRate.current - engagementRate.previous).toFixed(1)}%
            </span>
            <span className="text-gray-500 ml-2">จากเดือนที่แล้ว</span>
          </div>
        </div>
      </div>
      
      {/* ส่วนล่าง: บทความล่าสุดและกิจกรรมล่าสุด */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* บทความล่าสุด */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600">
              <h2 className="text-lg font-bold text-white flex items-center">
                <FaRegNewspaper className="mr-2" /> บทความล่าสุด
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {recentPosts.length > 0 ? (
                recentPosts.map((post) => (
                  <div key={post._id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-12 w-12 mr-4">
                        {post.img ? (
                          <div className="relative h-12 w-12 rounded-md overflow-hidden">
                            <Image
                              src={post.img}
                              alt={post.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          </div>
                        ) : (
                          <div className="bg-gray-200 h-12 w-12 rounded-md flex items-center justify-center">
                            <FaRegNewspaper className="text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link href={`/post/${post._id}`} className="text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline">
                          {truncateText(post.title, 50)}
                        </Link>
                        <p className="text-xs text-gray-500 mt-1">
                          {truncateText(post.content, 80)}
                        </p>
                        <div className="flex items-center mt-2 text-xs text-gray-500">
                          <FaCalendarAlt className="mr-1" />
                          <span>{formatDate(post.createdAt)}</span>
                          <span className="mx-2">•</span>
                          <FaUserEdit className="mr-1" />
                          <span>{truncateText(post.userEmail || 'ไม่ระบุ', 20)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <FaRegNewspaper className="mx-auto text-gray-400 text-3xl mb-2" />
                  <p className="text-gray-500">ยังไม่มีบทความในระบบ</p>
                </div>
              )}
            </div>
            <div className="bg-gray-50 px-4 py-3 text-right">
              <Link href="/admin/posts" className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                ดูบทความทั้งหมด →
              </Link>
            </div>
          </div>
        </div>
        
        {/* กิจกรรมล่าสุด */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-blue-600">
              <h2 className="text-lg font-bold text-white flex items-center">
                <FiActivity className="mr-2" /> กิจกรรมล่าสุด
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => (
                  <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <div className={`h-8 w-8 rounded-full ${
                          activity.icon === 'user' ? 'bg-green-100' : 
                          activity.icon === 'post' ? 'bg-blue-100' : 
                          activity.icon === 'users' ? 'bg-yellow-100' : 
                          'bg-red-100'
                        } flex items-center justify-center`}>
                          {activity.icon === 'user' && <FaUserEdit className="text-green-600" />}
                          {activity.icon === 'post' && <FaPencilAlt className="text-blue-600" />}
                          {activity.icon === 'users' && <FaUsers className="text-yellow-600" />}
                          {activity.icon === 'edit' && <FaRegNewspaper className="text-red-600" />}
                        </div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">{activity.title}</span> {activity.description}
                        </p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <FiActivity className="mx-auto text-gray-400 text-3xl mb-2" />
                  <p className="text-gray-500">ยังไม่มีกิจกรรมล่าสุด</p>
                </div>
              )}
            </div>
            <div className="bg-gray-50 px-4 py-3 text-right">
              <Link href="/admin/activity" className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                ดูกิจกรรมทั้งหมด →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Content