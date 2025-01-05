import { Dialog, DialogTitle, DialogHeader, DialogContent, DialogDescription } from "@/components/ui/dialog";

const DialogNoteOrderItem = ({
    open,
    onClose,
    order,
}: {
    open: boolean;
    onClose: () => void;
    order: any;
}) => {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Ghi chú đơn hàng</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    {order.note}
                </DialogDescription>
            </DialogContent>
        </Dialog>
    )
};

export default DialogNoteOrderItem;
