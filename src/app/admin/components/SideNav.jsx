import React from 'react'
import Link from 'next/link'
import { 
  LayoutDashboard, 
  Users, 
  FileText,
  Home,
  Settings
} from 'lucide-react'
import { usePathname } from 'next/navigation'

function SideNav() {
  const pathname = usePathname()

  // ตรวจสอบว่า path ปัจจุบันตรงกับลิงก์หรือไม่
  const isActive = (path) => {
    return pathname === path ? 'bg-blue-50 text-blue-600 border-blue-500' : 'text-gray-700 hover:bg-gray-50'
  }

  return (
    <nav className='bg-white shadow-sm rounded-lg p-4 h-full'>
      <div className="mb-6 p-2">
        <h2 className="text-lg font-semibold text-gray-800">Admin Panel</h2>
        <p className="text-xs text-gray-500">Management Dashboard</p>
      </div>
      
      <ul className="space-y-1">
        <li>
          <Link 
            className={`flex items-center p-3 rounded-lg transition-all border-l-4 ${isActive('/admin')}`}
            href="/admin"
          >
            <LayoutDashboard size={18} className="mr-3" />
            Dashboard
          </Link>
        </li>
        <li>
          <Link 
            className={`flex items-center p-3 rounded-lg transition-all border-l-4 ${isActive('/admin/users')}`}
            href="/admin/users"
          >
            <Users size={18} className="mr-3" />
            Users
          </Link>
        </li>
        <li>
          <Link 
            className={`flex items-center p-3 rounded-lg transition-all border-l-4 ${isActive('/admin/posts')}`}
            href="/admin/posts"
          >
            <FileText size={18} className="mr-3" />
            Posts
          </Link>
        </li>
        <li>
          <Link 
            className={`flex items-center p-3 rounded-lg transition-all border-l-4 ${isActive('/')}`}
            href="/"
          >
            <Home size={18} className="mr-3" />
            Home Page
          </Link>
        </li>
        <li>
        </li>
      </ul>
    </nav>
  )
}

export default SideNav