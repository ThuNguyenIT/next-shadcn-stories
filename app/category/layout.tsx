import MainLayout from '@/components/layout/main-layout';

export default function CategoryLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <MainLayout>
            {children}
        </MainLayout>
    );
}
