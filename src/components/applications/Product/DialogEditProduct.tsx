import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui'
import { Textarea } from '@/components/ui'
import { useState, useEffect } from 'react'
import { ProductService } from '@/services/product.service'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const DialogEditProduct = ({
    productId,
    reload,
    close
}: {
    productId: string
    reload: () => void
    close: () => void
}) => {
    const productService = new ProductService()
    const [open, setOpen] = useState(true)
    const [product, setProduct] = useState<any>({
        name: '',
        price: 0,
        category: '',
        description: '',
        status: 'active'
    })

    const [error, setError] = useState<any>({
        name: false,
        price: false,
        category: false
    })

    useEffect(() => {
        const loadProduct = async () => {
            const response = await productService.getById(productId);
            if (response) {
                setProduct(response);
            }
        };

        if (productId) {
            loadProduct();
        }
    }, [productId]);

    const handleChangeOpen = () => {
        setOpen(false)
        close()
    }

    const requiredFields = ['name', 'price', 'category']

    const categories = [
        { id: "laundry", name: "Dịch vụ giặt ủi" },
        { id: "steam", name: "Dịch vụ hấp" },
        { id: "special", name: "Dịch vụ giặt đặc biệt" },
        { id: "bulky", name: "Dịch vụ giặt đồ cồng kềnh" },
        { id: "personal", name: "Dịch vụ đồ dùng cá nhân" },
        { id: "plush", name: "Dịch vụ đồ gấu bông" },
        { id: "formal", name: "Dịch vụ đồ vest và áo dài" }
    ]

    const handleSubmit = async (e: any) => {
        e.preventDefault()

        let flag = false

        for (const field of requiredFields) {
            if (!product[field]) {
                setError((prev: any) => ({ ...prev, [field]: true }))
                flag = true
            }
        }

        if (flag) return

        const res = await productService.update(product)

        if (res) {
            reload()
            handleChangeOpen()
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleChangeOpen}>
            <DialogContent className="max-w-full md:max-w-[800px] flex flex-col gap-6 rounded-xl px-6 py-8 z-[9999] max-h-[100vh] md:max-h-[85vh] overflow-y-auto">
                <DialogHeader className="w-full mx-auto space-y-3">
                    <DialogTitle className="text-2xl font-semibold text-center">
                        Chỉnh Sửa Sản Phẩm
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground text-center">
                        Chỉnh sửa thông tin sản phẩm bên dưới
                    </p>
                </DialogHeader>

                <div className='w-full'>
                    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5" action="#" method="POST">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2 col-span-2">
                                <label className="font-medium">
                                    Tên sản phẩm <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    value={product.name}
                                    placeholder="VD: Áo thun nam"
                                    className="h-11"
                                    onChange={(e) => setProduct((prev: any) => ({
                                        ...prev,
                                        name: e.target.value
                                    }))}
                                />
                                {error.name &&
                                    <span className="text-sm text-red-500">
                                        Vui lòng nhập tên sản phẩm
                                    </span>
                                }
                            </div>

                            <div className="flex flex-col gap-2 col-span-1">
                                <label className="font-medium">
                                    Giá bán <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    value={product.price}
                                    type="number"
                                    min={0}
                                    placeholder="VD: 199000"
                                    className="h-11"
                                    onChange={(e) => setProduct((prev: any) => ({
                                        ...prev,
                                        price: Number(e.target.value)
                                    }))}
                                />
                                {error.price &&
                                    <span className="text-sm text-red-500">
                                        Vui lòng nhập giá sản phẩm
                                    </span>
                                }
                            </div>

                            <div className="flex flex-col gap-2 col-span-1">
                                <label className="font-medium">
                                    Danh mục <span className="text-red-500">*</span>
                                </label>
                                <Select
                                    value={product.category}
                                    onValueChange={(value) => setProduct((prev: any) => ({
                                        ...prev,
                                        category: value
                                    }))}
                                >
                                    <SelectTrigger className="h-11">
                                        <SelectValue placeholder="Chọn danh mục" />
                                    </SelectTrigger>
                                    <SelectContent className="z-[9999]">
                                        {categories.map((category) => (
                                            <SelectItem className='h-[48px] cursor-pointer' key={category.id} value={category.id}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {error.category && (
                                    <span className="text-sm text-red-500">
                                        Vui lòng chọn danh mục
                                    </span>
                                )}
                            </div>

                            <div className="col-span-2">
                                <div className="flex flex-col gap-2">
                                    <label className="font-medium">
                                        Mô tả sản phẩm
                                    </label>
                                    <Textarea
                                        value={product.description}
                                        placeholder="Nhập mô tả chi tiết về sản phẩm"
                                        className="h-[150px] resize-none"
                                        onChange={(e) => setProduct((prev: any) => ({
                                            ...prev,
                                            description: e.target.value
                                        }))}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='flex justify-end gap-3 mt-2'>
                            <Button
                                type='button'
                                variant='outline'
                                className='min-w-[120px] font-medium'
                                onClick={handleChangeOpen}
                            >
                                Hủy
                            </Button>
                            <Button
                                type='submit'
                                variant='default'
                                className='min-w-[120px] font-medium'
                            >
                                Cập nhật
                            </Button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default DialogEditProduct 