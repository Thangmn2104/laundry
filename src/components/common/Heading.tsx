import { cn } from '@/lib/utils';
import { ReactNode, useEffect, useState } from 'react';

type HeadingProps = {
    title?: string;
    className?: string;
    rightIcon?: ReactNode
};

const Heading = ({ title, className, rightIcon }: HeadingProps) => {
    // Retrieve authUser from Redux store

    const [currentPath, setCurrentPath] = useState<string | undefined>("");

    const mockDataHeading = [
        {
            id: 1,
            name: "Tổng quan",
            path: "/"
        },
        {
            id: 2,
            name: "Hàng hóa",
            path: "/products"
        },
        {
            id: 3,
            name: "Đơn hàng",
            path: "/orders"
        }

    ];

    useEffect(() => {
        const currentPath = location.pathname;
        const currentHeading = mockDataHeading.find(item => item.path === currentPath);
        setCurrentPath(currentHeading?.name);
    }, [location.pathname]);


    return (
        <div className={cn('text-[30px] font-bold justify-between flex items-center', className)}>
            <span>
                {currentPath || title}

            </span>
            {rightIcon}
        </div>
    );
};

export default Heading;
