import { Button } from '@/components/ui/button';
import { UserIcon, KeyIcon } from 'lucide-react';

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
    return (
        <aside className="w-64 bg-white p-6 border-r">
            <nav className="space-y-2">
                <Button
                    className={`w-full justify-start bg-white border-b rounded-none shadow-none hover:bg-gray-100 ${activeTab === 'account' ? 'text-custom-red font-bold text-base' : 'text-black text-15px font-normal'}`}
                    onClick={() => setActiveTab('account')}
                >
                    <UserIcon className="mr-2 h-4 w-4" />
                    Thông tin tài khoản
                </Button>
                <Button
                    className={`w-full justify-start bg-white border-b rounded-none shadow-none hover:bg-gray-100 ${activeTab === 'password' ? 'text-custom-red font-bold text-base' : 'text-black text-15px font-normal'}`}
                    onClick={() => setActiveTab('password')}
                >
                    <KeyIcon className="mr-2 h-4 w-4" />
                    Đổi mật khẩu
                </Button>
            </nav>
        </aside>
    );
}
