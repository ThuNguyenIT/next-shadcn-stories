import MainLayout from '@/components/layout/main-layout';

export default function StoryLayout({
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
