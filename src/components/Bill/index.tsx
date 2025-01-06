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
                        padding: 16px;
                    }
                    body {
                        font-family: Arial, sans-serif;
                        font-size: 14px;
                        width: 80mm;
                        margin: 0;
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 8px;
                    }
                    .store-name {
                        font-weight: bold;
                        font-size: 16px;
                        text-align: center;
                    }
                    .store-info {
                        font-size: 13px;
                        text-align: center;
                    }
                    .bill-title {
                        text-align: center;
                        margin: 8px 0;
                        font-size: 13px;
                    }
                    .customer-info {
                        margin-bottom: 8px;
                        font-size: 13px;
                        text-align: left;
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
                        font-size: 13px;
                    }
                    .item-name-qty {
                        display: flex;
                        justify-content: space-between;
                        width: 60%;
                    }
                    .total-section {
                        width: 100%;
                        padding-top: 4px;
                        font-size: 13px;
                    }
                    .total-row {
                        display: flex;
                        justify-content: space-between;
                        margin: 4px 0;
                    }
                    .footer {
                        text-align: center;
                        font-style: italic;
                        font-size: 14px;
                        margin-top: 8px;
                    }
                    .items-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 8px;
                        font-size: 14px;
                    }
                    .items-table tr {
                        border: none;
                    }
                    .items-table td {
                        padding: 4px 0;
                        border: none;
                    }
                    .items-table .product-name {
                        width: 100%;
                        text-align: left;
                        margin-bottom: 4px;
                    }
                    .items-table .price-row {
                        display: flex;
                        justify-content: space-between;
                        width: 100%;
                        font-size: 13px;
                    }
                    .items-table .table-header {
                        display: flex;
                        justify-content: space-between;
                        width: 100%;
                        font-size: 13px;
                        padding: 4px 0;
                        font-weight: bold;
                        border-top: 1px solid #000;
                        border-bottom: 1px solid #000;
                        margin-bottom: 4px;
                        padding-bottom: 4px;
                    }
                </style>
            </head>
            <body style="display: flex; flex-direction: column; align-items: center; padding: 8px;">
                <div class="header">
                    <div class="store-name">IMC LAUNDRY</div>
                    <div class="store-info">Đ/C: 46A Nguyễn Hữu Tiến, Quận Tân Phú</div>
                    <div class="store-info">SĐT: 0943.776.988</div>
                </div>
                
                <div class="bill-title">
                    <strong>HÓA ĐƠN ĐẶT HÀNG</strong>
                    <br>
                    ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}<br>
                </div>

                <div class="customer-info">
                    Khách hàng: ${order?.customerName || 'Khách lẻ'}<br>
                    SĐT: ${order?.phone || '---'}<br>
                </div>

                <table class="items-table">
                    <tr>
                        <td>
                            <div class="table-header">
                                <span>Đơn giá</span>
                                <span>SL</span>
                                <span>Thành tiền</span>
                            </div>
                        </td>
                    </tr>
                    ${order?.orderItems?.map((item: any) => `
                        <tr style="border-bottom: 1px dashed #000;">
                            <td>
                                <div class="product-name">${item?.productName}</div>
                                <div class="price-row">
                                    <span>${item?.price?.toLocaleString('vi-VN')}</span>
                                    <span>${item?.quantity}</span>
                                    <span>${(item?.quantity * item?.price).toLocaleString('vi-VN')}</span>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </table>

                <div class="total-section">
                    <div class="total-row">
                        <span>Tổng thanh toán:</span>
                        <span>${order?.total?.toLocaleString('vi-VN') || '0'}</span>
                    </div>
                </div>

                <div class="footer">
                    Cảm ơn và hẹn gặp lại!<br>
                    Powered by Bopbop
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
