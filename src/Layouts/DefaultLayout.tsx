import Sidebar from '../components/common/SideBar';
import React from 'react';
import { Header } from '@/components/common/Header';
import BottomNavigation from '@/components/common/BottomNavigation';

const DefaultLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex h-screen relative ">
            <Sidebar />
            <div className="flex-grow md:pl-64 h-screen pt-20 scrollbar scroll-smooth pl-0 md:pb-0 pb-16">
                <Header />
                <main className="p-4 max-w-[1200px] mx-auto pt-10 ">
                    {children}
                </main>
            </div>
            <BottomNavigation />
        </div>
    );
};

export default DefaultLayout;
