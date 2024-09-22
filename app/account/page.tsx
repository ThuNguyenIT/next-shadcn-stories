"use client"
import React, { useState } from "react"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import PageContainer from '@/components/layout/page-container';
import Sidebar from "./components/sidebar"
import AccountForm from "./components/account-form"
import PasswordForm from "./components/password-form"



export default function page() {
    const [activeTab, setActiveTab] = useState('account')
    return (
        <PageContainer>
            <div className="space-y-2">
                <div className="flex min-h-screen bg-gray-100">
                    <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

                    <main className="flex-1 p-6 bg-white">
                        <div className="flex max-w-4xl mx-auto gap-6">
                            <div className="flex-grow">
                                <CardHeader>
                                    <CardTitle className="text-xl font-bold text-custom-gray">
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

                        </div>
                    </main>
                </div >
            </div >
        </PageContainer >
    );
}