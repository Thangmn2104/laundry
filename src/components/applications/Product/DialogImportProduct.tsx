'use client'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'
import { useState } from 'react'
import { ProductService } from '@/services/product.service'
import { Upload, FileSpreadsheet } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

const DialogImportProduct = ({
    reload,
    close
}: {
    reload: () => void
    close: () => void
}) => {
    const productService = new ProductService()
    const { toast } = useToast()
    const [open, setOpen] = useState(true)
    const [file, setFile] = useState<File | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleChangeOpen = () => {
        setOpen(false)
        close()
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(false)

        const droppedFile = e.dataTransfer.files[0]
        if (isExcelFile(droppedFile)) {
            setFile(droppedFile)
        } else {
            toast({
                title: 'Lỗi nhập dữ liệu',
                description: 'Vui lòng chọn file Excel (.xlsx, .xls)',
                variant: 'destructive'
            })
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile && isExcelFile(selectedFile)) {
            setFile(selectedFile)
        } else {
            toast({
                title: 'Lỗi nhập dữ liệu',
                description: 'Vui lòng chọn file Excel (.xlsx, .xls)',
                variant: 'destructive'
            })
        }
    }

    const isExcelFile = (file: File) => {
        return file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            file.type === 'application/vnd.ms-excel'
    }

    // const handleDownloadTemplate = () => {
    //     // TODO: Implement template download
    //     console.log('Downloading template...')
    // }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!file) return

        setIsLoading(true)
        try {
            const formData = new FormData()
            formData.append('file', file)

            const response: any = await productService.importProducts(formData)

            if (response.message) {
                toast({
                    title: 'Nhập dữ liệu thành công',
                    description: 'Sản phẩm đã được nhập thành công',
                    variant: 'default'
                })
                reload()
                handleChangeOpen()
            }



        } catch (error) {
            console.log(error)
            toast({
                title: 'Lỗi nhập dữ liệu',
                description: 'Có lỗi xảy ra khi nhập dữ liệu',
                variant: 'destructive'
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleChangeOpen}>
            <DialogContent className="max-w-[480px] flex flex-col gap-6 rounded-xl px-6 py-8">
                <DialogHeader className="w-full mx-auto space-y-3">
                    <DialogTitle className="text-2xl font-semibold text-center">
                        Nhập Dữ Liệu Sản Phẩm
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground text-center">
                        Tải lên file Excel chứa danh sách sản phẩm
                    </p>
                </DialogHeader>

                <div className='w-full'>
                    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
                        <div
                            className={cn(
                                "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
                                isDragging ? "border-primary bg-primary/5" : "border-gray-200",
                                "hover:border-primary hover:bg-primary/5"
                            )}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => document.getElementById('file-upload')?.click()}
                        >
                            <input
                                id="file-upload"
                                type="file"
                                className="hidden"
                                accept=".xlsx,.xls"
                                onChange={handleFileChange}
                            />
                            <div className="flex flex-col items-center gap-2">
                                <Upload className="h-8 w-8 text-gray-400" />
                                <p className="text-sm text-gray-600">
                                    Kéo thả file vào đây hoặc click để chọn file
                                </p>
                                <p className="text-xs text-gray-400">
                                    Chỉ chấp nhận file Excel (.xlsx, .xls)
                                </p>
                            </div>
                        </div>

                        {file && (
                            <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg">
                                <FileSpreadsheet className="h-5 w-5 text-primary" />
                                <span className="text-sm flex-1 truncate">{file.name}</span>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-500 hover:text-red-700"
                                    onClick={() => setFile(null)}
                                >
                                    Xóa
                                </Button>
                            </div>
                        )}

                        {/* <div className="flex flex-col gap-2">
                            <p className="text-sm text-muted-foreground">
                                Chưa có file mẫu?
                                <Button
                                    type="button"
                                    variant="link"
                                    className="px-1.5 h-auto"
                                    onClick={handleDownloadTemplate}
                                >
                                    Tải xuống file mẫu
                                </Button>
                            </p>
                        </div> */}

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
                                disabled={!file || isLoading}
                            >
                                {isLoading ? 'Đang xử lý...' : 'Nhập dữ liệu'}
                            </Button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default DialogImportProduct 