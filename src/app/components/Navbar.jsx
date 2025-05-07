"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react"; //  ดึง useSession
import {
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  Home,
  BookOpen,
  PenSquare,
} from "lucide-react";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
 const { data: session, status } = useSession(); //  ใช้ useSession

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

 if (status === "loading") return null; //  ป้องกัน Hydration mismatch

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-indigo-600">BlogApp</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/"
              className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md font-medium flex items-center"
            >
              <Home size={18} className="mr-1" />
              หน้าแรก
            </Link>

            <Link
              href="welcome"
              className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md font-medium flex items-center"
            >
              <BookOpen size={18} className="mr-1" />
              แดชบอร์ด
            </Link>

            {session ? (
              <div className="relative">
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md font-medium"
                >
                  <div className="bg-indigo-100 w-8 h-8 rounded-full flex items-center justify-center mr-2">
                    <User size={16} className="text-indigo-600" />
                  </div>
                  {session.user.name}
                  <ChevronDown size={16} className="ml-1" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <Link
                      href="/"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100  items-center"
                    >
                      <Home size={16} className="mr-2" />
                      หน้าแรก
                    </Link>

                    <Link
                      href="/welcome"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100  items-center"
                    >
                      <BookOpen size={16} className="mr-2" />
                      แดชบอร์ด
                    </Link>
                    <Link
                      href="/create"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100  items-center"
                    >
                      <PenSquare size={16} className="mr-2" />
                      เขียนบทความ
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100  items-center"
                    >
                      <LogOut size={16} className="mr-2" />
                      ออกจากระบบ
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="text-indigo-600 border border-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-50 transition-colors duration-300"
                >
                  เข้าสู่ระบบ
                </Link>
                <Link
                  href="/register"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-300"
                >
                  สมัครสมาชิก
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-gray-700">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white px-4 py-2 shadow-md">
          <Link
            href="/"
            className="block py-2 text-gray-700 border-b border-gray-200  items-center"
            onClick={() => setIsMenuOpen(false)}
          ></Link>

          {session ? (
            <>
              <Link
                href="/welcome"
                className="block py-2 text-gray-700 border-b border-gray-200  items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <BookOpen size={18} className="mr-2" />
                แดชบอร์ด
              </Link>
              <Link
                href="/create"
                className="block py-2 text-gray-700 border-b border-gray-200  items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <PenSquare size={18} className="mr-2" />
                เขียนบทความ
              </Link>
              <button
                onClick={handleSignOut}
                className="block w-full text-left py-2 text-gray-700  items-center"
              >
                <LogOut size={18} className="mr-2" />
                ออกจากระบบ
              </button>
            </>
          ) : (
            <div className="flex flex-col space-y-2 py-2">
              <Link
                href="/login"
                className="text-center text-indigo-600 border border-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-50 transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                เข้าสู่ระบบ
              </Link>
              <Link
                href="/register"
                className="text-center bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                สมัครสมาชิก
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
