"use client"

import React from 'react';

function DashboardLoadingScreen() {
  return (
    <div className="flex-grow flex flex-col items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
      <p className="text-gray-600 font-medium">กำลังโหลดข้อมูล...</p>
    </div>
  );
}

export default DashboardLoadingScreen;