import { useState, useCallback, useEffect } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { debounce } from "lodash"
import { Filter, Search, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import CustomTable from "@/components/common/CustomTable"
import CustomPagination from "@/components/common/CustomPagination"
import { cn } from "@/lib/utils"
import { OrderService } from "@/services/order.service"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import moment from 'moment';
import 'moment/locale/vi';  // Import locale tiếng Việt
import { DateRange } from "react-day-picker"
import Bill from "@/components/Bill"
import { DateRangePicker } from "@/components/ui"
import DialogViewListOrder from "@/components/applications/Order/DialogViewListOrder"
import { DialogCreateOrder } from "@/components/applications/Order/DialogCreateOrder"
import DialogNoteOrderItem from "@/components/applications/Order/DialogNoteOrderItem"
import { toast } from "@/hooks/use-toast"
import { useAuth, User } from "@/store/useAuthStore"
// Thiết lập locale mặc định
moment.locale('vi');

interface OrderItem {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
}

interface Order {
    _id: string;
    orderId: string;
    customerName: string;
    phone: string;
    total: number;
    status: 'pending' | 'completed' | 'cancelled';
    completedDate: string;
    cancelledDate: string;
    orderItems: OrderItem[];
    createdAt: string;
    updatedAt: string;
    note: string;
}

const formatDateTime = (dateString: string | null | undefined) => {
    if (!dateString) return null;
    try {
        const date = moment(dateString);
        return date.isValid() ? date.format('DD/MM/YYYY HH:mm:ss') : null;
    } catch (error) {
        console.log(error)
        console.error('Invalid date:', dateString);
        return null;
    }
};

const OrdersView = () => {
    const [search, setSearch] = useState("")
    const [isLoading] = useState(false)
    const [total, setTotal] = useState(0)
    const [selectedSort, setSelectedSort] = useState<string>("newest")
    const [orders, setOrders] = useState<Order[]>([])
    const orderService = new OrderService()
    const [query, setQuery] = useState({
        page: 1,
        limit: 5,
        query: {
            sort: '{"createdAt":-1}',
        }
    })
    const [openNoteDialog, setOpenNoteDialog] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
    const [openDialog, setOpenDialog] = useState(false)
    const [selectedStatus, setSelectedStatus] = useState<string>("all")
    const [dateRange, setDateRange] = useState<DateRange | undefined>()
    const [openCreateDialog, setOpenCreateDialog] = useState(false)
    const { user } = useAuth()
    const debouncedSearch = useCallback(
        debounce((searchValue: string) => {
            setQuery(prev => ({
                ...prev,
                page: 1,
                query: {
                    ...prev.query,
                    $or: [
                        { customerName: { $regex: searchValue, $options: 'i' } },
                        { orderId: { $regex: searchValue, $options: 'i' } },
                        { phone: { $regex: searchValue, $options: 'i' } }
                    ]
                }
            }));
        }, 500),
        []
    );

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearch(value);
        debouncedSearch(value);
    };

    const handleClearFilter = () => {
        setQuery({
            page: 1,
            limit: 10,
            query: {
                sort: '{"createdAt":-1}',
            }
        });
        setSearch("");
        setSelectedSort("newest");
        setSelectedStatus("all");
        setDateRange(undefined);
    }

    const handleChangeSort = (value: string) => {
        setSelectedSort(value);
        setQuery(prev => ({
            ...prev,
            query: {
                ...prev.query,
                sort: value === 'newest'
                    ? JSON.stringify({ createdAt: -1 })
                    : value === 'oldest'
                        ? JSON.stringify({ createdAt: 1 })
                        : value === 'total_asc'
                            ? JSON.stringify({ total: 1 })
                            : JSON.stringify({ total: -1 })
            }
        }));
    }

    const handleGetOrders = async () => {
        const response: any = await orderService.loadAllWithPaging(query);
        if (response.records) {
            setOrders(response.records.rows);
            setTotal(response.records.total)
        }
    }

    const handleCompleteOrder = async (id: string) => {
        const response: any = await orderService.updateStatus({ id, status: 'completed' });
        if (response) {
            handleGetOrders();
        }
    }

    const handleCancelOrder = async (id: string) => {
        const response: any = await orderService.updateStatus({ id, status: 'cancelled' });
        if (response) {
            handleGetOrders();
        }
    }

    const handleChangeStatus = (value: string) => {
        setSelectedStatus(value);
        setQuery(prev => {
            const prevQuery: any = { ...prev.query };

            if (value === 'all') {
                // Xóa trường status khỏi query nếu chọn "all"
                delete prevQuery.status;
            } else {
                // Thêm status vào query nếu chọn giá trị khác
                prevQuery.status = value;
            }

            return {
                ...prev,
                query: prevQuery
            };
        });
    }

    const handleDateRangeChange = (range: DateRange | undefined) => {
        setDateRange(range);
        if (range?.from && range?.to) {
            setQuery(prev => ({
                ...prev,
                query: {
                    ...prev.query,
                    createdAt: {
                        $gte: moment(range.from).startOf('day').toDate(),
                        $lte: moment(range.to).endOf('day').toDate()
                    }
                }
            }));
        } else {
            setQuery(prev => {
                const { ...restQuery } = prev.query as any;
                return {
                    ...prev,
                    query: restQuery
                };
            });
        }
    }

    useEffect(() => {
        handleGetOrders();
    }, [query])

    const sortOptions = [
        { value: "newest", label: "Mới nhất" },
        { value: "oldest", label: "Cũ nhất" },
        { value: "total_asc", label: "Tổng tiền tăng dần" },
        { value: "total_desc", label: "Tổng tiền giảm dần" },
    ]

    const statusColors: { [key: string]: string } = {
        "pending": "bg-yellow-100 text-yellow-800",
        "processing": "bg-blue-100 text-blue-800",
        "completed": "bg-green-100 text-green-800",
        "cancelled": "bg-red-100 text-red-800"
    }

    const statusLabels: { [key: string]: string } = {
        "pending": "Chờ xử lý",
        "processing": "Đang xử lý",
        "completed": "Hoàn thành",
        "cancelled": "Đã hủy"
    }

    const statusOptions = [
        { value: "all", label: "Tất cả" },
        { value: "pending", label: "Chờ xử lý" },
        { value: "completed", label: "Hoàn thành" },
        { value: "cancelled", label: "Đã hủy" }
    ]

    const columns: ColumnDef<Order>[] = [
        // {
        //     header: 'STT',
        //     cell: ({ row }) => (
        //         <div className="cursor-pointer flex justify-start items-center h-[40px]">
        //             {(query.page - 1) * query.limit + row.index + 1}
        //         </div>
        //     ),
        // },
        // {
        //     accessorKey: "orderId",
        //     header: "Mã đơn"
        // },
        {
            accessorKey: "customerName",
            header: "Khách hàng",
            cell: ({ row }) => <span className="text-nowrap">{row.original.customerName}</span>
        },
        {
            accessorKey: "phone",
            header: "Số điện thoại"
        },
        {
            accessorKey: "total",
            header: "Tổng tiền",
            cell: ({ row }) => `${row.original.total.toLocaleString()}đ`
        },
        {
            accessorKey: "status",
            header: "Trạng thái",
            cell: ({ row }) => (
                <div className={cn(
                    "px-2 py-1 rounded-full text-xs w-fit text-nowrap",
                    statusColors[row.original.status]
                )}>
                    {statusLabels[row.original.status]}
                </div>
            )
        },
        {
            accessorKey: "createdAt",
            header: "Ngày tạo",
            cell: ({ row }) => {
                const formattedDate = formatDateTime(row.original.createdAt);
                return formattedDate ? (
                    <div className="flex items-center gap-2 text-center">
                        <span>{formattedDate}</span>
                    </div>
                ) : (
                    <span className="text-gray-400">-</span>
                );
            }
        },
        {
            accessorKey: "completedDate",
            header: () => <div className="flex items-center gap-2 text-center text-nowrap">
                <span>Ngày hoàn thành</span>
            </div>,
            cell: ({ row }) => {
                const formattedDate = formatDateTime(row.original.completedDate);
                return formattedDate ? (
                    <div className="flex items-center gap-2 text-center">
                        <span>{formattedDate}</span>
                    </div>
                ) : (
                    <span className="text-gray-400">-</span>
                );
            }
        },
        {
            accessorKey: "cancelledDate",
            header: "Ngày hủy",
            cell: ({ row }) => {
                const formattedDate = formatDateTime(row.original.cancelledDate);
                return formattedDate ? (
                    <div className="flex items-center gap-2 text-center">
                        <span>{formattedDate}</span>
                    </div>
                ) : (
                    <span className="text-gray-400">-</span>
                );
            }
        },
        {
            accessorKey: "note",
            header: "Ghi chú",
            cell: ({ row }) => {
                const note = row.original.note;
                return note ? (
                    <Button
                        variant="ghost"
                        className="h-8 text-blue-500 hover:text-blue-700"
                        onClick={() => {
                            setSelectedOrder(row.original);
                            setOpenNoteDialog(true);
                        }}
                    >
                        Xem
                    </Button>
                ) : (
                    null
                );
            },
        },
        {
            id: "products",
            header: "Sản phẩm",
            cell: ({ row }) => {
                const items = row.original.orderItems;
                return (
                    <>
                        <Button
                            variant="outline"
                            className="h-8"
                            onClick={() => {
                                setSelectedOrder(row.original)
                                setOpenDialog(true)
                            }}
                        >
                            Xem ({items.length})
                        </Button>
                    </>
                );
            },
        },
        {
            id: "actions",
            header: "Thao tác",
            size: 120,
            cell: ({ row }) => {
                const isCompleted = row.original.status === 'completed';
                const isCancelled = row.original.status === 'cancelled';
                const bill = Bill({ order: row.original, user: user as User });

                return (
                    <div className="flex flex-col gap-1 w-full min-w-[100px]">
                        <Button
                            disabled={!isCompleted}
                            variant="default"
                            size="sm"
                            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:text-gray-700"
                            onClick={bill.printBill}
                        >
                            Xuất bill
                        </Button>
                        <Button
                            disabled={isCancelled || isCompleted}
                            variant="default"
                            size="sm"
                            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:text-gray-700"
                            onClick={() => handleCompleteOrder(row.original._id)}
                        >
                            Hoàn thành
                        </Button>
                        <Button
                            className="w-full disabled:bg-gray-400 disabled:text-gray-700"
                            disabled={isCompleted || isCancelled}
                            variant="destructive"
                            size="sm"
                            onClick={() => handleCancelOrder(row.original._id)}
                        >
                            Hủy
                        </Button>
                    </div>
                );
            },
        },

    ];

    const handleChangePage = (offset: number) => {
        setQuery(prev => ({
            ...prev,
            page: prev.page + offset
        }));
    }

    const handleCreateOrder = async (orderData: any) => {
        try {
            const response = await orderService.save(orderData)
            if (response) {
                toast({
                    variant: "default",
                    title: "Thành công",
                    description: "Tạo đơn hàng mới thành công",
                })
                handleGetOrders()
            }
        } catch (error) {
            console.log(error)
            toast({
                variant: "destructive",
                title: "Lỗi",
                description: "Có lỗi xảy ra khi tạo đơn hàng",
            })
        }
    }

    return (
        <div className="container mx-auto p-1 sm:p-2">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                <h1 className="text-xl sm:text-2xl font-bold">Quản lý đơn hàng</h1>
                <Button
                    className="w-full sm:w-auto h-10"
                    onClick={() => {
                        setOpenCreateDialog(true)
                    }}>
                    <Plus className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Tạo đơn hàng</span>
                    <span className="sm:hidden">Tạo mới</span>
                </Button>
            </div>

            {/* Filter Section */}
            <div className="bg-white pt-1 sm:pt-2 rounded-lg shadow-sm mb-1 sm:mb-2">
                <div className="flex flex-col gap-1 sm:gap-2 p-1 sm:p-2">
                    {/* Search bar */}
                    <div className="w-full">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                value={search}
                                onChange={handleSearch}
                                className="pl-10 h-10 w-full"
                                placeholder="Tìm kiếm đơn hàng"
                            />
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                        <DateRangePicker
                            value={dateRange}
                            onChange={handleDateRangeChange}
                            placeholder="Chọn thời gian"
                            className="w-full sm:w-[250px]"
                        />

                        <Select
                            value={selectedSort}
                            onValueChange={handleChangeSort}
                        >
                            <SelectTrigger className="w-full sm:w-[180px] h-10">
                                <SelectValue placeholder="Sắp xếp" />
                            </SelectTrigger>
                            <SelectContent>
                                {sortOptions.map((option) => (
                                    <SelectItem
                                        className="cursor-pointer h-[48px]"
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            value={selectedStatus}
                            onValueChange={handleChangeStatus}
                        >
                            <SelectTrigger className="w-full sm:w-[180px] h-10">
                                <SelectValue placeholder="Trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                                {statusOptions.map((option) => (
                                    <SelectItem
                                        className="cursor-pointer h-[48px]"
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Button
                            variant="outline"
                            className="w-full sm:w-auto h-10"
                            onClick={handleClearFilter}
                        >
                            <Filter className="mr-2 h-4 w-4" />
                            <span className="hidden sm:inline">Xóa bộ lọc</span>
                            <span className="sm:hidden">Xóa</span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="bg-white">
                <div className="overflow-x-auto">
                    <CustomTable
                        columns={columns}
                        data={orders}
                        loading={isLoading}
                        isBorderInner
                    />
                    <div className="p-0.5 sm:p-1">
                        <CustomPagination
                            onChange={handleChangePage}
                            total={total}
                            currentPage={query.page}
                            pageSize={query.limit}
                            className="justify-center"
                        />
                    </div>
                </div>
            </div>

            {/* Dialogs */}
            {openDialog && (
                <DialogViewListOrder
                    openDialog={openDialog}
                    setOpenDialog={setOpenDialog}
                    selectedOrder={selectedOrder}
                />
            )}
            {openNoteDialog && (
                <DialogNoteOrderItem
                    open={openNoteDialog}
                    onClose={() => setOpenNoteDialog(false)}
                    order={selectedOrder}
                />
            )}
            {openCreateDialog && (
                <DialogCreateOrder
                    open={openCreateDialog}
                    onClose={() => setOpenCreateDialog(false)}
                    onCreateOrder={handleCreateOrder}
                />
            )}
        </div>
    )
}

export default OrdersView 