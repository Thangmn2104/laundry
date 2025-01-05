import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { DashboardService } from "@/services/dashboard.service";
import moment from 'moment';
import 'moment/locale/vi';

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


interface DateRange {
    from: Date;
    to: Date;
}

interface TimeRangeRevenue {
    date: string;
    revenue: number;
}

type DashboardResponse = {
    orderStats: {
        total: number;
        pending: number;
        completed: number;
        cancelled: number;
    };
    revenue: {
        total: number;
        timeRange: string;
    };
    recentOrders: Order[];
    timeRangeRevenue: TimeRangeRevenue[];
    pendingOrders: Order[];
    cancelledOrders: Order[];
}

// Đăng ký các components của Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const HomeView = () => {
    const [stats, setStats] = useState<DashboardResponse>({
        orderStats: {
            pending: 0,
            completed: 0,
            cancelled: 0,
            total: 0
        },
        revenue: {
            total: 0,
            timeRange: 'today'
        },
        recentOrders: [] as Order[],
        timeRangeRevenue: [] as TimeRangeRevenue[],
        pendingOrders: [] as Order[],
        cancelledOrders: [] as Order[]
    });
    const [timeRangeRevenue, setTimeRangeRevenue] = useState<TimeRangeRevenue[]>([]);
    const [dateRange, setDateRange] = useState<DateRange>(() => ({
        from: moment().startOf('day').toDate(),
        to: moment().endOf('day').toDate()
    }));

    const dashboardService = new DashboardService();

    const fetchStats = async () => {
        try {
            const response: any = await dashboardService.getDashboard({
                timeRange: getTimeRange(dateRange),
                from: dateRange.from,
                to: dateRange.to
            });

            if (response.orderStats) {
                setStats({
                    orderStats: {
                        total: response.orderStats.total,
                        pending: response.orderStats.pending,
                        completed: response.orderStats.completed,
                        cancelled: response.orderStats.cancelled
                    },
                    revenue: response.revenue,
                    recentOrders: response.recentOrders,
                    timeRangeRevenue: response.timeRangeRevenue,
                    pendingOrders: response.pendingOrders,
                    cancelledOrders: response.cancelledOrders
                });

                // Cập nhật dữ liệu biểu đồ theo time range
                if (response.timeRangeRevenue) {
                    setTimeRangeRevenue(response.timeRangeRevenue);
                }
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const getTimeRange = (range: DateRange): string => {
        const diffDays = moment(range.to).diff(moment(range.from), 'days');

        if (diffDays <= 1) return 'today';
        if (diffDays <= 7) return 'week';
        if (diffDays <= 30) return 'month';
        return 'year';
    };

    useEffect(() => {
        fetchStats();
    }, [dateRange]);

    // Thêm hàm để format dữ liệu cho Chart.js
    const getChartData = () => {
        // Add check for empty data
        if (!timeRangeRevenue || timeRangeRevenue.length === 0) {
            return {
                labels: [],
                datasets: [{
                    label: 'Doanh thu',
                    data: [],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.5)',
                    tension: 0.4
                }]
            };
        }

        // Make sure to parse the date string properly
        return {
            labels: timeRangeRevenue.map((item: any) => {
                const date = moment(item._id);
                const timeRange = getTimeRange(dateRange);

                switch (timeRange) {
                    case 'today':
                        return date.format('HH:mm');
                    case 'week':
                        return date.format('DD/MM');
                    case 'month':
                        return date.format('DD/MM');
                    case 'year':
                        return date.format('MM/YYYY');
                    default:
                        return date.format('DD/MM/YYYY');
                }
            }),
            datasets: [
                {
                    label: 'Doanh thu',
                    data: timeRangeRevenue.map(item => item.revenue),
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.5)',
                    tension: 0.4
                }
            ]
        };
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => {
                        return `${context.parsed.y.toLocaleString()}đ`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (value: any) => `${value.toLocaleString()}đ`
                }
            }
        }
    };

    return (
        <div className="container mx-auto p-2 sm:p-4 space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6">
                <h1 className="text-xl sm:text-2xl font-bold">Tổng quan</h1>
                <DateRangePicker
                    value={dateRange}
                    onChange={(value) => {
                        if (value?.from && value?.to) {
                            setDateRange({ from: value.from, to: value.to });
                        } else {
                            setDateRange({ from: new Date(), to: new Date() });
                        }
                    }}
                    className="w-full sm:w-[280px]"
                />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
                <Card className="p-3 sm:p-4">
                    <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">Đơn chờ xử lý</h3>
                    <p className="text-lg sm:text-2xl font-bold mt-2 text-yellow-600">
                        {stats.orderStats.pending}
                    </p>
                </Card>

                <Card className="p-3 sm:p-4">
                    <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">Đơn hoàn thành</h3>
                    <p className="text-lg sm:text-2xl font-bold mt-2 text-green-600">
                        {stats.orderStats.completed}
                    </p>
                </Card>

                <Card className="p-3 sm:p-4">
                    <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">Đơn đã hủy</h3>
                    <p className="text-lg sm:text-2xl font-bold mt-2 text-red-600">
                        {stats.orderStats.cancelled}
                    </p>
                </Card>

                <Card className="p-3 sm:p-4">
                    <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">Tổng doanh thu</h3>
                    <p className="text-lg sm:text-2xl font-bold mt-2 text-blue-600">
                        {stats.revenue.total.toLocaleString()}đ
                    </p>
                </Card>
            </div>

            {/* New Time Range Revenue Chart with Chart.js */}
            <Card className="p-3 sm:p-4">
                <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-4">
                    Doanh thu {getChartTitle(getTimeRange(dateRange))}
                </h3>
                <div className="h-[250px] sm:h-[300px]">
                    <Line
                        data={getChartData()}
                        options={chartOptions}
                    />
                </div>
            </Card>

            {/* Orders Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-4">
                {/* Pending Orders */}
                <Card className="p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                        <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">Đơn hàng chờ xử lý</h3>
                        <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full w-fit">
                            {stats.pendingOrders.length} đơn
                        </span>
                    </div>
                    <div className="overflow-x-auto -mx-3 sm:mx-0">
                        <table className="w-full min-w-[500px]">
                            <thead>
                                <tr className="border-b bg-muted/50">
                                    <th className="text-left p-2 text-sm font-medium text-muted-foreground">Mã ĐH</th>
                                    <th className="text-left p-2 text-sm font-medium text-muted-foreground">Khách hàng</th>
                                    <th className="text-left p-2 text-sm font-medium text-muted-foreground">SĐT</th>
                                    <th className="text-right p-2 text-sm font-medium text-muted-foreground">Tổng tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.pendingOrders.length > 0 ? (
                                    stats.pendingOrders.map((order) => (
                                        <tr key={order._id} className="border-b hover:bg-muted/50 transition-colors">
                                            <td className="p-2 text-sm">{order.orderId}</td>
                                            <td className="p-2 text-sm font-medium">{order.customerName}</td>
                                            <td className="p-2 text-sm">{order.phone}</td>
                                            <td className="p-2 text-sm text-right font-medium text-yellow-600">
                                                {order.total.toLocaleString()}đ
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="text-center py-8 text-sm text-muted-foreground">
                                            <div className="flex flex-col items-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                </svg>
                                                <p>Không có đơn hàng nào đang chờ xử lý</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Cancelled Orders */}
                <Card className="p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                        <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">Đơn hàng đã hủy</h3>
                        <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full w-fit">
                            {stats.cancelledOrders.length} đơn
                        </span>
                    </div>
                    <div className="overflow-x-auto -mx-3 sm:mx-0">
                        <table className="w-full min-w-[500px]">
                            <thead>
                                <tr className="border-b bg-muted/50">
                                    <th className="text-left p-2 text-sm font-medium text-muted-foreground">Mã ĐH</th>
                                    <th className="text-left p-2 text-sm font-medium text-muted-foreground">Khách hàng</th>
                                    <th className="text-left p-2 text-sm font-medium text-muted-foreground">SĐT</th>
                                    <th className="text-right p-2 text-sm font-medium text-muted-foreground">Tổng tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.cancelledOrders.length > 0 ? (
                                    stats.cancelledOrders.map((order) => (
                                        <tr key={order._id} className="border-b hover:bg-muted/50 transition-colors">
                                            <td className="p-2 text-sm">{order.orderId}</td>
                                            <td className="p-2 text-sm font-medium">{order.customerName}</td>
                                            <td className="p-2 text-sm">{order.phone}</td>
                                            <td className="p-2 text-sm text-right font-medium text-red-600">
                                                {order.total.toLocaleString()}đ
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="text-center py-8 text-sm text-muted-foreground">
                                            <div className="flex flex-col items-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                                <p>Không có đơn hàng nào bị hủy</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

        </div>
    );
};

const getChartTitle = (timeRange: string): string => {
    switch (timeRange) {
        case 'today':
            return 'hôm nay';
        case 'week':
            return '7 ngày gần nhất';
        case 'month':
            return '30 ngày gần nhất';
        case 'year':
            return 'trong năm';
        default:
            return '';
    }
};

// const formatDateByTimeRange = (date: string, timeRange: string): string => {
//     if (!date) return '';
//     moment.locale('vi'); // Set locale to Vietnamese
//     const momentDate = moment(date);

//     switch (timeRange) {
//         case 'today':
//             return momentDate.format('HH:mm');
//         case 'week':
//             return momentDate.format('DD [th]MM'); // "th" means "tháng" in Vietnamese
//         case 'month':
//             return momentDate.format('DD [th]MM');
//         case 'year':
//             return momentDate.format('MM/YYYY');
//         default:
//             return momentDate.format('DD/MM/YYYY');
//     }
// };

export default HomeView;
