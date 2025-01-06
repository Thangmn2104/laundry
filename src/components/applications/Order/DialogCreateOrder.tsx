import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { ProductService } from "@/services/product.service"
import { Search } from "lucide-react"

interface DialogCreateOrderProps {
    open: boolean
    onClose: () => void
    onCreateOrder: (order: any) => Promise<void>
}

interface Product {
    productId: string
    productName: string
    price: number
    quantity: number
    selected?: boolean
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
                    quantity: 0
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
            await onCreateOrder(formData)
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

    const handleIncreaseQuantity = (productId: string, step: number = 1) => {
        setProducts(products.map(product =>
            product.productId === productId
                ? { ...product, quantity: +(product.quantity + step).toFixed(1) }
                : product
        ))

        setFormData(prev => ({
            ...prev,
            orderItems: prev.orderItems.map(item =>
                item.productId === productId
                    ? { ...item, quantity: +(item.quantity + step).toFixed(1) }
                    : item
            )
        }))
    }

    const handleDecreaseQuantity = (productId: string, step: number = 1) => {
        const updatedProducts = products.map(product => {
            if (product.productId === productId && product.quantity >= step) {
                const newQuantity = +(product.quantity - step).toFixed(1)
                return {
                    ...product,
                    quantity: newQuantity,
                    selected: newQuantity > 0
                }
            }
            return product
        })
        setProducts(updatedProducts)

        setFormData(prev => ({
            ...prev,
            orderItems: prev.orderItems.map(item => {
                if (item.productId === productId) {
                    const newQuantity = +(item.quantity - step).toFixed(1)
                    return { ...item, quantity: newQuantity }
                }
                return item
            }).filter(item => item.quantity > 0)
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
                    quantity: newSelected ? 1 : 0  // Set quantity to 1 when selected, 0 when deselected
                }
                : product
        ))

        if (newSelected) {
            setFormData(prev => ({
                ...prev,
                orderItems: [...prev.orderItems, { ...product, quantity: 1 }]  // Add with quantity 1
            }))
        } else {
            setFormData(prev => ({
                ...prev,
                orderItems: prev.orderItems.filter(p => p.productId !== productId)
            }))
        }
    }

    const filteredProducts = products.filter(product =>
        product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.productId.toLowerCase().includes(searchTerm.toLowerCase())
    )

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
                                {filteredProducts.length === 0 ? (
                                    <div className="text-center text-gray-500 py-8">
                                        Không tìm thấy sản phẩm nào
                                    </div>
                                ) : (
                                    filteredProducts.map((product) => (
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
                                                <h4 className="font-medium">{product.productName}</h4>
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
                                        <div className="flex items-center gap-1">

                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => handleDecreaseQuantity(product.productId, 1)}
                                                disabled={product.quantity === 0}
                                            >
                                                - 1
                                            </Button>
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => handleDecreaseQuantity(product.productId, 0.1)}
                                                    disabled={product.quantity < 0.1}
                                                >
                                                    <span className="text-xs">- 0.1</span>
                                                </Button>
                                                <span className="w-12 text-center">{product.quantity.toFixed(1)}</span>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => handleIncreaseQuantity(product.productId, 0.1)}
                                                >
                                                    <span className="text-xs">+ 0.1</span>
                                                </Button>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => handleIncreaseQuantity(product.productId, 1)}
                                            >
                                                + 1
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
                                                total + (product.quantity * product.price), 0
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