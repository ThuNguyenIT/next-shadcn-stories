"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AuthModal() {
    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Đăng nhập / Đăng ký</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <Tabs defaultValue="login" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="login">Đăng nhập</TabsTrigger>
                        <TabsTrigger value="register">Đăng ký</TabsTrigger>
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