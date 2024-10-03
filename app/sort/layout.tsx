import MainLayout from '@/components/layout/main-layout';

export default function SortLayout({
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
