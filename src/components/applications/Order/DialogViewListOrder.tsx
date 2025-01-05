import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils";
import moment from 'moment';
import 'moment/locale/vi';


const DialogViewListOrder = ({
    openDialog,
    setOpenDialog,
    selectedOrder
}: {
    openDialog: boolean;
    setOpenDialog: (open: boolean) => void;
    selectedOrder: any;
}) => {

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



    return (
        <Dialog
            open={openDialog}
            onOpenChange={setOpenDialog}
        >
            <DialogOverlay className="bg-black/25" />
            <DialogContent className="max-w-[500px]">
                <DialogHeader>
                    <div className="space-y-2">
                        <DialogTitle className="flex items-center gap-2">
                            <span>Đơn hàng #{selectedOrder?.orderId}</span>
                            <div className={cn(
                                "px-2 py-1 rounded-full text-xs",
                                statusColors[selectedOrder?.status || 'pending']
                            )}>
                                {statusLabels[selectedOrder?.status || 'pending']}
                            </div>
                        </DialogTitle>
                        {selectedOrder?.createdAt && (
                            <div className="text-sm text-muted-foreground">
                                Ngày tạo: {moment(selectedOrder.createdAt).format('DD/MM/YYYY HH:mm:ss')}
                            </div>
                        )}
                    </div>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Thông tin khách hàng */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-medium text-muted-foreground">THÔNG TIN KHÁCH HÀNG</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <div className="text-sm text-muted-foreground">Tên khách hàng</div>
                                <div className="font-medium">{selectedOrder?.customerName}</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-sm text-muted-foreground">Số điện thoại</div>
                                <div className="font-medium">{selectedOrder?.phone}</div>
                            </div>
                        </div>
                    </div>

                    {/* Danh sách sản phẩm */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-medium text-muted-foreground">CHI TIẾT ĐƠN HÀNG</h3>
                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                            {selectedOrder?.orderItems.map((item: any, index: any) => (
                                <div
                                    key={item._id || index}
                                    className="flex items-center justify-between py-3 border-b last:border-0"
                                >
                                    <div className="space-y-1">
                                        <div className="font-medium">{item.productName}</div>
                                        <div className="text-sm text-muted-foreground">
                                            {item.price.toLocaleString()}đ x {item.quantity}
                                        </div>
                                    </div>
                                    <div className="font-medium">
                                        {(item.quantity * item.price).toLocaleString()}đ
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tổng tiền */}
                    <div className="flex items-center justify-between pt-4 border-t">
                        <div>
                            <div className="text-sm text-muted-foreground mb-1">Tổng tiền</div>
                            <div className="text-2xl font-bold text-primary">
                                {selectedOrder?.total.toLocaleString()}đ
                            </div>
                        </div>
                        <Button variant="outline" onClick={() => setOpenDialog(false)}>
                            Đóng
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
};

export default DialogViewListOrder;
