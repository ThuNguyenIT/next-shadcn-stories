import MainLayout from '@/components/layout/main-layout';

export default function ListLayout({
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
