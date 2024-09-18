"use client"
import PageContainer from '@/components/layout/page-container';
import React from 'react';
import { useParams } from 'next/navigation';

export default function Page() {
    const params = useParams();
    const slug = params.categoryId;
    console.log('params', params.categoryId);
    
    return (
        <PageContainer >
            <div className="space-y-4">
                Thể loại: {slug}
            </div>
        </PageContainer>
    );
}
