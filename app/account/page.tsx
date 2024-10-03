"use client"
import React, { useState } from "react"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import PageContainer from '@/components/layout/page-container';
import Sidebar from "./components/sidebar"
import AccountForm from "./components/account-form"
import PasswordForm from "./components/password-form"
import { Button } from "@/components/ui/button";
import SidebarMobile from "./components/sidebar-mobile";



export default function page() {
    const [activeTab, setActiveTab] = useState('account')
    return (
        <PageContainer>
            <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
                <div className="hidden lg:block lg:w-64 ">
                    <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>

                <main className="flex-1 bg-white">
                    <div className="max-w-4xl mx-auto gap-6">
                        <SidebarMobile activeTab={activeTab} setActiveTab={setActiveTab} />
                        <CardHeader>
                            <CardTitle className="text-xl font-bold text-custom-gray text-center sm:text-center md:text-left">
                                {activeTab === 'account' ? 'Thông tin tài khoản' : 'Đổi mật khẩu'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {activeTab === 'account' ? (
                                <AccountForm />
                            ) : (
                                <PasswordForm />
                            )}
                        </CardContent>

                    </div>
                </main>
            </div >
        </PageContainer >
    );
}