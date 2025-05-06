"use client"

import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';

function DeleteBtn({ id }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmed = confirm("คุณแน่ใจหรือไม่ว่าต้องการลบโพสต์นี้?");

    if (confirmed) {
      try {
        setIsDeleting(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/posts?id=${id}`, {
          method: "DELETE"
        });

        if (res.ok) {
          window.location.reload();
        } else {
          throw new Error("Failed to delete post");
        }
      } catch (error) {
        console.error("Error deleting post:", error);
        alert("เกิดข้อผิดพลาดในการลบโพสต์");
      } finally {
        setIsDeleting(false);
      }
    }
  }

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className={`flex items-center ${isDeleting ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600'} text-white py-2 px-4 rounded-md transition-colors duration-300`}
    >
      {isDeleting ? (
        <>
          <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent mr-2"></div>
          กำลังลบ...
        </>
      ) : (
        <>
          <Trash2 size={16} className="mr-1" />
          ลบ
        </>
      )}
    </button>
  );
}

export default DeleteBtn;