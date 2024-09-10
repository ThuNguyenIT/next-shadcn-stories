import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { ShieldIcon, UsersIcon, SearchIcon } from "lucide-react"

export default function Header() {
    return (
        <header className="relative h-[300px] w-full overflow-hidden">
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: `url("/images/bg-header.png")`
                }}
            />
            <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
                <div className="mb-8">
                    <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                        Logo
                        {/* <Image
                            className="w-24 h-24 items-center justify-center"
                            src="/images/logo.png" // Relative path from the public folder
                            alt="Mystical landscape with pagodas on misty mountains"
                            layout="fill"
                            objectFit="cover"
                        /> */}
                    </div>
                </div>
                <div className="w-full max-w-md mb-4">
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder="Nhập tên truyện hoặc tác giả"
                            className="pr-10"
                        />
                        <Button
                            size="icon"
                            variant="ghost"
                            className="absolute right-0 top-0 h-full"
                        >
                            <SearchIcon className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <div className="flex space-x-2">
                    <Button variant="secondary" size="icon">
                        <ShieldIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="secondary" size="icon">
                        <UsersIcon className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </header>
    )
}