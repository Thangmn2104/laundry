'use client'

import { useEffect, useState } from 'react'
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from '@/components/ui/pagination'
import { cn } from '@/lib/utils'

type CustomPaginationProps = {
    total?: number,
    currentPage?: number,
    className?: string,
    pageSize?: number,
    onChange?: any
}

function CustomPagination({ total = 0, currentPage = 1, className = '', pageSize = 10, onChange }: CustomPaginationProps) {
    const [totalPages, setTotalPages] = useState(0)

    useEffect(() => {
        setTotalPages(Math.ceil(total / pageSize))
    }, [total])

    // Hàm tạo mảng số trang cần hiển thị
    const getPageNumbers = () => {
        const pageNumbers = []
        const maxVisiblePages = 5 // Số trang tối đa hiển thị

        if (totalPages <= maxVisiblePages) {
            // Hiển thị tất cả các trang nếu tổng số trang ít hơn maxVisiblePages
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i)
            }
        } else {
            // Luôn hiển thị trang đầu
            pageNumbers.push(1)

            // Tính toán vị trí bắt đầu và kết thúc của dải số trang
            let start = Math.max(currentPage - 1, 2)
            let end = Math.min(currentPage + 1, totalPages - 1)

            // Thêm dấu ... đầu tiên nếu cần
            if (start > 2) {
                pageNumbers.push('...')
            }

            // Thêm các số trang ở giữa
            for (let i = start; i <= end; i++) {
                pageNumbers.push(i)
            }

            // Thêm dấu ... cuối cùng nếu cần
            if (end < totalPages - 1) {
                pageNumbers.push('...')
            }

            // Luôn hiển thị trang cuối
            pageNumbers.push(totalPages)
        }

        return pageNumbers
    }

    return (
        <Pagination className={cn(className, 'select-none')}>
            <PaginationContent>
                {/* Nút Previous */}
                <PaginationItem>
                    <PaginationPrevious
                        onClick={currentPage > 1 ? () => onChange(-1) : undefined}
                        className={`${currentPage === 1
                            ? 'cursor-not-allowed text-gray-300 hover:bg-transparent hover:text-gray-300'
                            : 'cursor-pointer'
                            }`}
                    />
                </PaginationItem>

                {/* Hiển thị các số trang */}
                {getPageNumbers().map((pageNumber, index) => (
                    <PaginationItem key={index}>
                        {pageNumber === '...' ? (
                            <span className="px-4">...</span>
                        ) : (
                            <PaginationLink
                                className={cn('cursor-pointer', currentPage === pageNumber && 'bg-primary text-white')}
                                isActive={currentPage === pageNumber}
                                onClick={() => typeof pageNumber === 'number' && onChange(pageNumber - currentPage)}
                            >
                                {pageNumber}
                            </PaginationLink>
                        )}
                    </PaginationItem>
                ))}

                {/* Nút Next */}
                <PaginationItem>
                    <PaginationNext
                        onClick={currentPage < totalPages ? () => onChange(1) : undefined}
                        className={`${currentPage >= totalPages
                            ? 'cursor-not-allowed text-gray-300 hover:bg-transparent hover:text-gray-300'
                            : 'cursor-pointer'
                            }`}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}

export default CustomPagination
