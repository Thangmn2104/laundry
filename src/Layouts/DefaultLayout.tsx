import Sidebar from '../components/common/SideBar';
import React from 'react';
// import { Header } from '@/components/common/Header';
import BottomNavigation from '@/components/common/BottomNavigation';

const DefaultLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex h-screen relative ">
            <Sidebar />
            <div className="flex-grow md:pl-36 h-screen scrollbar scroll-smooth pl-0 md:pb-0 pb-16">
                {/* <Header /> */}
                <main className="p-4 max-w-[1440px] mx-auto pt-10 ">
                    {children}
                </main>
            </div>
            <BottomNavigation />
        </div>
    );
};

export default DefaultLayout;
