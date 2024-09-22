import HomeLayout from '../home/layout';

export default function SortLayout({
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
