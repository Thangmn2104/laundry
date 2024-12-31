import Sidebar from '../components/common/SideBar';
import React from 'react';
import { Header } from '@/components/common/Header';

const DefaultLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex h-screen relative">
            <Sidebar />
            <div className="flex-grow pl-64 h-screen relative pt-20 scrollbar scroll-smooth">
                <Header />
                <main className="p-4 max-w-[1200px] mx-auto pt-10 ">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DefaultLayout;
