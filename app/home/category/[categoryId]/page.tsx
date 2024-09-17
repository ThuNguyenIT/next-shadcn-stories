"use client"
import PageContainer from '@/components/layout/page-container';
import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Page() {
    const router = useRouter();
    const searchParams = useSearchParams();
    console.log('router', searchParams)
    const slug = searchParams.get('slug');
    return (
        <PageContainer >
            <div className="space-y-4">
                Thể loại: {slug}
            </div>
        </PageContainer>
    );
}
