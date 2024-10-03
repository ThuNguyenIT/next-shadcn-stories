import HomeLayout from '../home/layout';

export default function CategoryLayout({
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
