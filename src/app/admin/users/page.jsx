"use client";

import React, { useState, useEffect } from "react";
import AdminNav from "../components/AdminNav";
import Footer from "../components/Footer";
import SideNav from "../components/SideNav";
import Container from "../components/Container";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import DeleteBtn from "./DeleteBtn";
import { FiEdit2, FiTrash2, FiUser, FiMail, FiKey } from "react-icons/fi";
import { FaUserShield, FaUser } from "react-icons/fa";

function AdminUserManagePage() {
  const { data: session } = useSession();
  if (!session) redirect("/login");
  if (session?.user?.role !== "admin") redirect("/welcome");

  const [allUsersData, setAllUsersData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const getAllUsersData = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/totalusers`, {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await res.json();
      setAllUsersData(data.totalUsers);
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading users:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllUsersData();
  }, []);

  // กรองข้อมูลผู้ใช้ตาม search term
  const filteredUsers = allUsersData.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ฟังก์ชันแสดงสถานะ role ด้วยสี
  const getRoleBadge = (role) => {
    switch (role) {
      case "admin":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
            <FaUserShield className="mr-1" />
            {role}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            <FaUser className="mr-1" />
            {role}
          </span>
        );
    }
  };

  return (
    <Container>
      <AdminNav session={session} />
      <div className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Side Navigation */}
            <div className="w-full lg:w-64 flex-shrink-0">
              <SideNav />
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
                  <h1 className="text-2xl font-bold text-white">
                    จัดการผู้ใช้
                  </h1>
                  <p className="text-indigo-100">
                    จัดการผู้ใช้ทั้งหมดในระบบของคุณ
                  </p>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Search and Actions */}
                  <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <div className="relative w-full sm:w-80">
                      <input
                        type="text"
                        placeholder="Search users..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <FiUser
                        className="absolute left-3 top-2.5 text-gray-400"
                        size={18}
                      />
                    </div>

                    <Link
                      href="/admin/users/create"
                      className="flex items-center bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors w-full sm:w-auto justify-center"
                    >
                      <FiUser className="mr-2" size={18} />
                        เพิ่มผู้ใช้ใหม่
                    </Link>
                  </div>

                  {/* Users Table */}
                  {isLoading ? (
                    <div className="flex justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                    </div>
                  ) : filteredUsers.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              User
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Role
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredUsers.map((user) => (
                            <tr
                              key={user._id}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10">
                                    {user.image ? (
                                      <Image
                                        className="rounded-full"
                                        src={user.image}
                                        alt={user.name}
                                        width={40}
                                        height={40}
                                      />
                                    ) : (
                                      <div className="bg-gray-200 rounded-full h-10 w-10 flex items-center justify-center">
                                        <FiUser className="text-gray-500" />
                                      </div>
                                    )}
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">
                                      {user.name}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      ID: {user._id}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <FiMail
                                    className="text-gray-400 mr-2"
                                    size={16}
                                  />
                                  <div className="text-sm text-gray-900">
                                    {user.email}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {getRoleBadge(user.role)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                  <Link
                                    href={`/admin/users/edit/${user._id}`}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                    title="Edit"
                                  >
                                    <FiEdit2 size={18} />
                                  </Link>
                                  <DeleteBtn
                                    id={user._id}
                                    onDelete={getAllUsersData}
                                    title="Delete"
                                  />
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <FiUser className="text-gray-400" size={32} />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        No users found
                      </h3>
                      <p className="text-gray-500 mb-4">
                        There are no users matching your search
                      </p>
                      <Link
                        href="/admin/users/create"
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                      >
                        <FiUser className="mr-2" size={16} />
                        Add New User
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </Container>
  );
}

export default AdminUserManagePage;
