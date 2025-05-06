import React from 'react';
import Container from './Container';
import { BookOpen, Clock, BarChart3, User } from 'lucide-react';

const DashboardLoadingScreen = () => {
  return (
    <Container>
      <div className="flex-grow bg-gray-50 min-h-screen">
        <div className="container mx-auto py-8 px-4">
          {/* แบนเนอร์ส่วนบน (สร้าง skeleton) */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg text-white p-8 mb-8 animate-pulse">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div>
                <div className="h-10 bg-white/30 rounded-lg w-64 mb-2"></div>
                <div className="h-5 bg-white/20 rounded-lg w-48"></div>
              </div>
              <div className="mt-4 md:mt-0 bg-white/20 backdrop-blur-sm p-4 rounded-xl shadow-inner flex items-center">
                <User size={36} className="text-white/70 mr-3" />
                <div>
                  <div className="h-4 bg-white/30 rounded w-16 mb-2"></div>
                  <div className="h-5 bg-white/30 rounded w-32"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* แดชบอร์ดสถิติ (สร้าง skeleton) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* บล็อกสถิติ 1 */}
            <div className="bg-white p-6 rounded-xl shadow animate-pulse">
              <div className="flex items-center">
                <div className="bg-indigo-100 p-3 rounded-lg">
                  <BookOpen size={24} className="text-indigo-300" />
                </div>
                <div className="ml-4">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-8 bg-gray-300 rounded w-10"></div>
                </div>
              </div>
            </div>
            
            {/* บล็อกสถิติ 2 */}
            <div className="bg-white p-6 rounded-xl shadow animate-pulse">
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Clock size={24} className="text-purple-300" />
                </div>
                <div className="ml-4">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-8 bg-gray-300 rounded w-28"></div>
                </div>
              </div>
            </div>
            
            {/* ปุ่มสร้างโพสต์ใหม่ */}
            <div className="bg-white p-6 rounded-xl shadow animate-pulse">
              <div className="bg-gradient-to-r from-green-400 to-emerald-500 opacity-70 h-full rounded-lg"></div>
            </div>
          </div>
          
          {/* กล่องรายการโพสต์ */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center mb-6">
              <BarChart3 className="mr-2 text-indigo-400" />
              <div className="h-8 bg-gray-200 rounded w-36"></div>
            </div>
            
            {/* Animation ตรงกลาง */}
            <div className="flex flex-col items-center justify-center py-16">
              {/* Spinner จากวงกลมซ้อนกัน */}
              <div className="relative h-24 w-24 mb-8">
                <div className="absolute inset-0 border-t-4 border-indigo-600 border-solid rounded-full animate-spin"></div>
                <div className="absolute inset-1 border-r-4 border-purple-500 border-solid rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
                <div className="absolute inset-2 border-b-4 border-indigo-400 border-solid rounded-full animate-spin" style={{animationDuration: '2s'}}></div>
                <div className="absolute inset-3 border-l-4 border-purple-400 border-solid rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '2.5s'}}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <BookOpen size={24} className="text-indigo-600" />
                </div>
              </div>
              
              <h3 className="text-xl font-medium text-gray-700 mb-2">กำลังโหลดข้อมูล</h3>
              <p className="text-gray-500 mb-6">โปรดรอสักครู่ ระบบกำลังดึงข้อมูลโพสต์ของคุณ</p>
              
              {/* Progress bar */}
              <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 animate-pulse-gradient"></div>
              </div>
            </div>
            
            {/* Post skeletons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 opacity-40">
              {[1, 2].map(item => (
                <div key={item} className="bg-white border border-gray-100 rounded-xl shadow-md overflow-hidden">
                  <div className="relative h-48 w-full bg-gray-200 animate-pulse"></div>
                  <div className="p-5">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-100 rounded w-full mb-1"></div>
                    <div className="h-4 bg-gray-100 rounded w-full mb-1"></div>
                    <div className="h-4 bg-gray-100 rounded w-2/3 mb-4"></div>
                    <div className="flex space-x-2">
                      <div className="h-10 bg-indigo-200 rounded w-20"></div>
                      <div className="h-10 bg-red-200 rounded w-20"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* พื้นที่สำหรับ Footer */}
      <div className="bg-gray-800 py-6">
        <div className="container mx-auto px-4">
          <div className="h-5 bg-gray-700 rounded w-full max-w-md mx-auto animate-pulse"></div>
        </div>
      </div>
      
      {/* Custom animation */}
      <style jsx global>{`
        @keyframes pulse-gradient {
          0%, 100% { width: 5%; left: -5%; }
          50% { width: 50%; left: 25%; }
        }
        .animate-pulse-gradient {
          position: relative;
          animation: pulse-gradient 2s ease-in-out infinite;
        }
      `}</style>
    </Container>
  );
};

export default DashboardLoadingScreen;