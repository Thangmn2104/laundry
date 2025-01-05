import 'moment/locale/vi';

interface BillProps {
    order: any;
}

const Bill = ({ order }: BillProps) => {
    const printBill = () => {
        const billContent = `
            <!DOCTYPE html>
            <html lang="vi">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Hóa đơn</title>
                <style>
                    @page {
                        size: 80mm auto;
                        margin: 0;
                    }
                    body {
                        font-family: Arial, sans-serif;
                        padding: 8px;
                        font-size: 12px;
                        width: 80mm;
                        margin: 0;
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 8px;
                    }
                    .store-name {
                        font-weight: bold;
                        font-size: 14px;
                        text-align: center;
                    }
                    .store-info {
                        font-size: 11px;
                        text-align: center;
                    }
                    .bill-title {
                        text-align: center;
                        margin: 8px 0;
                        font-size: 11px;
                    }
                    .customer-info {
                        margin-bottom: 8px;
                        font-size: 11px;
                        text-align: center;
                        width: 100%;
                    }
                    .items {
                        width: 100%;
                        margin-bottom: 8px;
                    }
                    .item-row {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 4px;
                        font-size: 11px;
                    }
                    .item-name-qty {
                        display: flex;
                        justify-content: space-between;
                        width: 60%;
                    }
                    .total-section {
                        border-top: 1px dashed #000;
                        padding-top: 4px;
                        font-size: 11px;
                    }
                    .total-row {
                        display: flex;
                        justify-content: space-between;
                        margin: 4px 0;
                    }
                    .footer {
                        text-align: center;
                        font-style: italic;
                        font-size: 10px;
                        margin-top: 8px;
                    }
                    .items-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 8px;
                        font-size: 12px;
                    }
                    .items-table tr {
                        border-bottom: 1px dotted #ddd;
                    }
                    .items-table td {
                        padding: 4px 0;
                    }
                    .items-table .product-name {
                        width: 55%;
                        text-align: left;
                    }
                    .items-table .quantity {
                        width: 15%;
                        text-align: center;
                    }
                    .items-table .price {
                        width: 30%;
                        text-align: right;
                    }
                </style>
            </head>
            <body style="display: flex; flex-direction: column; align-items: center;">
                <div class="header">
                    <div class="store-name">IMC LAUNDRY</div>
                    <div class="store-info">Đ/C: 54 Đường 27, Hiệp Bình Chánh, Thủ Đức</div>
                    <div class="store-info">Điện thoại: 0943.776.988</div>
                </div>
                
                <div class="bill-title">
                    HÓA ĐƠN ĐẶT HÀNG<br>
                    Số HĐ: ${order?._id || '---'}<br>
                    ${order?.createdAt ? new Date(order.createdAt).toLocaleString('vi-VN') : '---'}<br>
                </div>

                <div class="customer-info">
                    Khách hàng: ${order?.customerName || 'Khách lẻ'}<br>
                    SĐT: ${order?.phone || '---'}<br>
                </div>

                <table class="items-table">
                    ${order?.orderItems?.map((item: any) => `
                        <tr>
                            <td class="product-name">${item?.productName}</td>
                            <td class="quantity">${item?.quantity}</td>
                            <td class="price">${(item?.quantity * item?.price).toLocaleString('vi-VN')}</td>
                        </tr>
                        <tr>
                            <td colspan="3" style="text-align: right; font-size: 10px; color: #666;">
                                ${item?.price?.toLocaleString('vi-VN')} × ${item?.quantity}
                            </td>
                        </tr>
                    `).join('')}
                </table>

                <div class="total-section">
                    <div class="total-row">
                        <span>Tổng tiền hàng:</span>
                        <span>${order?.total?.toLocaleString('vi-VN') || '0'}</span>
                    </div>
                    <div class="total-row">
                        <span>Chiết khấu:</span>
                        <span>0</span>
                    </div>
                    <div class="total-row">
                        <span>Tổng thanh toán:</span>
                        <span>${order?.total?.toLocaleString('vi-VN') || '0'}</span>
                    </div>
                </div>

                <div class="footer">
                    Cảm ơn và hẹn gặp lại!<br>
                    Powered by KIOTVIET
                </div>
            </body>
            </html>
        `;

        // Tạo một iframe ẩn
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        // Ghi nội dung vào iframe
        const iframeWindow = iframe.contentWindow;
        if (iframeWindow) {
            iframeWindow.document.write(billContent);
            iframeWindow.document.close();

            // In và xóa iframe
            iframeWindow.focus();
            setTimeout(() => {
                iframeWindow.print();
                document.body.removeChild(iframe);
            }, 500);
        }
    };

    return { printBill };
};

export default Bill;
