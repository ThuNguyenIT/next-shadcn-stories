"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"



interface IAuthModal {
    open: boolean
    handleCloseAuthModal: () => void
    activeTab: string
    setActiveTab: (tab: string) => void;
}
const AuthModal: React.FC<IAuthModal> = ({ open, handleCloseAuthModal, activeTab, setActiveTab }) => {


    return (
        <Dialog open={open} onOpenChange={() => handleCloseAuthModal()}>
            <DialogContent className="sm:max-w-[425px]">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full ">
                    <TabsList className="grid w-full grid-cols-2 bg-transparent relative">
                        {/* <TabsTrigger className="shadow-none" value="login">Đăng nhập</TabsTrigger>
                        <TabsTrigger className="data-[state=active]:bg-transparent data-[state=active]:text-[#EF5350] data-[state=active]:font-bold data-[state=active]:shadow-none" value="register">Đăng ký</TabsTrigger> */}
                        <TabsTrigger
                            value="login"
                            className="data-[state=active]:bg-transparent data-[state=active]:text-[#EF5350] data-[state=active]:font-bold data-[state=active]:shadow-none"
                        >
                            Đăng nhập
                        </TabsTrigger>
                        <TabsTrigger
                            value="register"
                            className="data-[state=active]:bg-transparent data-[state=active]:text-[#EF5350] data-[state=active]:font-bold data-[state=active]:shadow-none"
                        >
                            Đăng ký
                        </TabsTrigger>
                        <div className="absolute left-1/2 top-1/2 -translate-y-1/2 w-px h-5 bg-gray-300"></div>
                    </TabsList>
                    <TabsContent value="login">
                        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                            <Input type="email" placeholder="Nhập Email" />
                            <Input type="password" placeholder="Nhập mật khẩu" />
                            <Button type="submit" className="w-full bg-red-500 hover:bg-red-600 text-white">
                                Đăng nhập
                            </Button>
                        </form>
                    </TabsContent>
                    <TabsContent value="register">
                        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                            <Input type="email" placeholder="Nhập Email" />
                            <Input type="password" placeholder="Nhập mật khẩu" />
                            <Input type="password" placeholder="Nhập lại mật khẩu" />
                            <Button type="submit" className="w-full bg-red-500 hover:bg-red-600 text-white">
                                Đăng ký
                            </Button>
                        </form>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}
export default AuthModal;