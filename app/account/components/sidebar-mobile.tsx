import { Button } from '@/components/ui/button';

interface SidebarMobileProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export default function SidebarMobile({ activeTab, setActiveTab }: SidebarMobileProps) {
    const tabs = [
        { label: 'Thông tin tài khoản', value: 'account' },
        { label: 'Đổi mật khẩu', value: 'password' }
    ];

    return (
        <div className="block lg:hidden mb-4">
            <div className="flex justify-between space-x-2 gap-x-2">
                {tabs.map(({ label, value }) => (
                    <Button key={value}
                        className={`w-full text-center bg-white p-2 border-b-2 rounded-none shadow-none hover:bg-gray-100 ${activeTab === value ? 'text-custom-red font-bold sm:text-base lg:text-sm' : 'border-transparent text-black text-15px font-normal'
                            }`}
                        onClick={() => setActiveTab(value)}
                    >
                        {label}
                    </Button>
                ))}
            </div>
        </div>
    );
}
