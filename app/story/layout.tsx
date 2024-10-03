import HomeLayout from '../home/layout';

export default function StoryLayout({
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
