import HomeLayout from '../home/layout';

export default function AccountLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <HomeLayout>
            {children}
        </HomeLayout>
    );
}
