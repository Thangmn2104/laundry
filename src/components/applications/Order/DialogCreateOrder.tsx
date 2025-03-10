import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { ProductService } from "@/services/product.service"
import { Search, X } from "lucide-react"

interface DialogCreateOrderProps {
    open: boolean
    onClose: () => void
    onCreateOrder: (order: any) => Promise<void>
}

interface Product {
    productId: string
    productName: string
    price: number
    quantity: string
    selected?: boolean
    isPinned?: boolean
}

export function DialogCreateOrder({ open, onClose, onCreateOrder }: DialogCreateOrderProps) {
    const [step, setStep] = useState(1)
    const productService = new ProductService()
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()
    const [products, setProducts] = useState<Product[]>([])
    const [formData, setFormData] = useState({
        customerName: '',
        phone: '',
        note: '',
        orderItems: [] as Product[]
    })
    const [searchTerm, setSearchTerm] = useState("")

    const handleLoadProducts = async () => {
        const query = {
            page: 1,
            limit: 100,
            query: {
                status: 'active'
            }
        }
        const res: any = await productService.loadAllWithPaging(query)
        if (res.records) {
            const { rows } = res.records
            const products: Product[] = []
            rows.forEach((row: any) => {
                products.push({
                    productId: row.productId,
                    productName: row.name,
                    price: row.price,
                    quantity: "",
                    isPinned: row.isPinned || false
                })
            })
            setProducts(products)
        }
    }

    useEffect(() => {
        handleLoadProducts()
    }, [])

    const handleNext = () => {
        if (!formData.customerName.trim()) {
            toast({
                variant: "destructive",
                title: "Lỗi",
                description: "Vui lòng nhập tên khách hàng",
            })
            return
        }

        if (!formData.phone.trim()) {
            toast({
                variant: "destructive",
                title: "Lỗi",
                description: "Vui lòng nhập số điện thoại",
            })
            return
        }

        setStep(2)
    }

    const handleBack = () => {
        setStep(1)
    }

    const handleSubmit = async () => {
        if (formData.orderItems.length === 0) {
            toast({
                variant: "destructive",
                title: "Lỗi",
                description: "Vui lòng chọn ít nhất một sản phẩm",
            })
            return
        }

        setLoading(true)
        try {
            const formattedFormData = {
                ...formData,
                orderItems: formData.orderItems.map((item: any) => ({
                    ...item,
                    quantity: Number(item.quantity)
                }))
            }

            await onCreateOrder(formattedFormData)
            toast({
                title: "Thành công",
                description: "Đã tạo đơn hàng thành công",
            })
            onClose()
        } catch (error) {
            console.log(error)
            toast({
                variant: "destructive",
                title: "Lỗi",
                description: "Có lỗi xảy ra khi tạo đơn hàng",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleQuantityChange = (productId: string, value: string) => {
        console.log(value)
        if (!/^\d*\.?\d*$/.test(value) && value !== '') return

        if ((value.match(/\./g) || []).length > 1) return

        if (value.includes('.')) {
            const decimals = value.split('.')[1]
            if (decimals?.length > 3) return
        }

        const newQuantity = value === "." || value === "" ? "" : value

        setProducts(products.map(product =>
            product.productId === productId
                ? {
                    ...product,
                    quantity: value === "" ? "" : newQuantity,
                    selected: true
                }
                : product
        ))

        setFormData(prev => ({
            ...prev,
            orderItems: prev.orderItems.map(item =>
                item.productId === productId
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        }))
    }

    const handleRemoveProduct = (productId: string) => {
        setProducts(products.map(product =>
            product.productId === productId
                ? { ...product, selected: false, quantity: "" }
                : product
        ))

        setFormData(prev => ({
            ...prev,
            orderItems: prev.orderItems.filter(p => p.productId !== productId)
        }))
    }

    const handleProductSelect = (productId: string) => {
        const product = products.find(p => p.productId === productId)
        if (!product) return

        // Toggle selected state
        const newSelected = !product.selected

        setProducts(products.map(product =>
            product.productId === productId
                ? {
                    ...product,
                    selected: newSelected,
                    quantity: newSelected ? "1" : ""
                }
                : product
        ))

        if (newSelected) {
            setFormData(prev => ({
                ...prev,
                orderItems: [...prev.orderItems, { ...product, quantity: "1" }]
            }))
        } else {
            setFormData(prev => ({
                ...prev,
                orderItems: prev.orderItems.filter(p => p.productId !== productId)
            }))
        }
    }

    const handleTogglePin = async (productId: string, currentPinStatus: boolean) => {
        try {
            await productService.updatePinned(productId, !currentPinStatus)
            setProducts(products.map(product =>
                product.productId === productId
                    ? { ...product, isPinned: !currentPinStatus }
                    : product
            ))
            toast({
                title: "Thành công",
                description: `Đã ${!currentPinStatus ? 'ghim' : 'bỏ ghim'} sản phẩm`,
            })
        } catch (error) {
            console.error(error)
            toast({
                variant: "destructive",
                title: "Lỗi",
                description: "Không thể cập nhật trạng thái ghim",
            })
        }
    }

    const filteredProducts = products
        .filter(product =>
            product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.productId.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            // Sort by isPinned first (pinned items go to top)
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            return 0;
        });

    const pinnedProducts = filteredProducts.filter(product => product.isPinned);
    const unpinnedProducts = filteredProducts.filter(product => !product.isPinned);

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[900px]">
                <DialogHeader>
                    <DialogTitle>
                        {step === 1 ? "Thông tin khách hàng" : "Chọn sản phẩm"}
                    </DialogTitle>
                </DialogHeader>

                {step === 1 ? (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label>Tên khách hàng</label>
                            <Input
                                value={formData.customerName}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    customerName: e.target.value
                                }))}
                                placeholder="Nhập tên khách hàng"
                            />
                        </div>

                        <div className="space-y-2">
                            <label>Số điện thoại</label>
                            <Input
                                value={formData.phone}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    phone: e.target.value
                                }))}
                                placeholder="Nhập số điện thoại"
                            />
                        </div>

                        <div className="space-y-2">
                            <label>Ghi chú</label>
                            <Textarea
                                value={formData.note}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    note: e.target.value
                                }))}
                                placeholder="Nhập ghi chú (nếu có)"
                            />
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={onClose}>
                                Hủy
                            </Button>
                            <Button onClick={handleNext}>
                                Tiếp tục
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex gap-4">
                        {/* Left column - Product List */}
                        <div className="w-1/2 space-y-4">
                            <h3 className="font-medium">Danh sách sản phẩm</h3>

                            {/* Search input */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                                <Input
                                    placeholder="Tìm kiếm sản phẩm..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9"
                                />
                            </div>

                            <div className="min-h-[400px] space-y-4 max-h-[600px] overflow-y-auto pr-4">
                                {/* Pinned products - sticky section */}
                                <div className="sticky top-0 z-10 space-y-4 bg-white pb-4">
                                    {pinnedProducts.map((product) => (
                                        <div
                                            key={product.productId}
                                            className={`p-4 rounded-lg cursor-pointer transition-all
                                                ${product.selected
                                                    ? 'border-2 border-primary bg-primary/5'
                                                    : 'border hover:border-primary/50'
                                                }`}
                                            onClick={() => handleProductSelect(product.productId)}
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-medium">{product.productName}</h4>
                                                        <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded">Ghim</span>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleTogglePin(product.productId, true);
                                                        }}
                                                        className="h-8"
                                                    >
                                                        Bỏ ghim
                                                    </Button>
                                                </div>
                                                <p className="text-xs text-gray-500">ID: {product.productId}</p>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {new Intl.NumberFormat('vi-VN', {
                                                        style: 'currency',
                                                        currency: 'VND'
                                                    }).format(product.price)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Unpinned products */}
                                {unpinnedProducts.length === 0 && pinnedProducts.length === 0 ? (
                                    <div className="text-center text-gray-500 py-8">
                                        Không tìm thấy sản phẩm nào
                                    </div>
                                ) : (
                                    unpinnedProducts.map((product) => (
                                        <div
                                            key={product.productId}
                                            className={`p-4 rounded-lg cursor-pointer transition-all
                                                ${product.selected
                                                    ? 'border-2 border-primary bg-primary/5'
                                                    : 'border hover:border-primary/50'
                                                }`}
                                            onClick={() => handleProductSelect(product.productId)}
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-medium">{product.productName}</h4>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleTogglePin(product.productId, false);
                                                        }}
                                                        className="h-8"
                                                    >
                                                        Ghim
                                                    </Button>
                                                </div>
                                                <p className="text-xs text-gray-500">ID: {product.productId}</p>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {new Intl.NumberFormat('vi-VN', {
                                                        style: 'currency',
                                                        currency: 'VND'
                                                    }).format(product.price)}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Right column - Selected Products */}
                        <div className="w-1/2 space-y-4">
                            <h3 className="font-medium">Sản phẩm đã chọn</h3>
                            <div className="min-h-[400px] space-y-4 max-h-[600px] overflow-y-auto pr-4">
                                {formData.orderItems.map((product) => (
                                    <div
                                        key={product.productId}
                                        className="flex items-center justify-between p-4 border rounded-lg"
                                    >
                                        <div>
                                            <h4 className="font-medium">{product.productName}</h4>
                                            <p className="text-xs text-gray-500">ID: {product.productId}</p>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {new Intl.NumberFormat('vi-VN', {
                                                    style: 'currency',
                                                    currency: 'VND'
                                                }).format(product.price)}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="text"
                                                value={product.quantity === "" ? "" : product.quantity}
                                                onChange={(e) => handleQuantityChange(product.productId, e.target.value)}
                                                className="w-24"
                                                placeholder="0"
                                            />
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRemoveProduct(product.productId);
                                                }}
                                                className="h-8 w-8"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Total amount */}
                            <div className="py-2 border-t">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">Tổng tiền:</span>
                                    <span className="font-medium">
                                        {new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND'
                                        }).format(
                                            formData.orderItems.reduce((total, product) =>
                                                total + (Number(product.quantity) * product.price), 0
                                            )
                                        )}
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={handleBack}>
                                    Quay lại
                                </Button>
                                <Button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                >
                                    {loading ? "Đang xử lý..." : "Tạo đơn hàng"}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}