import { Button } from '@/components/ui/button';
import { UserIcon, KeyIcon } from 'lucide-react';

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
    const tabs = [
        { label: 'Thông tin tài khoản', value: 'account', Icon: UserIcon },
        { label: 'Đổi mật khẩu', value: 'password', Icon: KeyIcon }
    ];

    return (
        <aside className="w-64 bg-white p-6 border-r h-full">
            <nav className="space-y-2">
                {tabs.map(({ label, value, Icon }) => (
                    <Button
                        key={value}
                        className={`w-full justify-start bg-white border-b rounded-none shadow-none hover:bg-gray-100 ${activeTab === value
                            ? 'text-custom-red font-bold text-base'
                            : 'text-black text-15px font-normal'
                            }`}
                        onClick={() => setActiveTab(value)}
                    >
                        <Icon className="mr-2 h-4 w-4" />
                        {label}
                    </Button>
                ))}
            </nav>
        </aside>
    );
}
