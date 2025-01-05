import { useState, useCallback, useEffect } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { debounce } from "lodash"
import { Filter, Import, MoreHorizontal, Plus, Search, Trash2, LayoutGrid, Table as TableIcon, Pencil } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import CustomTable from "@/components/common/CustomTable"
import CustomPagination from "@/components/common/CustomPagination"
import { cn } from "@/lib/utils"
import { ProductService } from "@/services/product.service"
import DialogCreateProduct from "@/components/applications/Product/DialogCreateProduct"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui"
import DialogEditProduct from "@/components/applications/Product/DialogEditProduct"
import DialogImportProduct from "@/components/applications/Product/DialogImportProduct"

interface Product {
    _id: string;
    productId: string;
    name: string;
    price: number;
    category: string;
    description?: string;
    status: 'active' | 'inactive';
    createdAt: string;
    updatedAt: string;
}

const ProductsView = () => {
    const [search, setSearch] = useState("")
    const [isLoading] = useState(false)
    const [selectedProducts, setSelectedProducts] = useState<string[]>([])
    const [total, setTotal] = useState(0)
    const [selectedSort, setSelectedSort] = useState<string>("newest")
    const [products, setProducts] = useState<Product[]>([])
    const productService = new ProductService()
    const [query, setQuery] = useState({
        page: 1,
        limit: 5,
        query: {
            sort: '{"createdAt":-1}',
        }
    })
    const [openDialogCreateProduct, setOpenDialogCreateProduct] = useState(false)
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [deletingId, setDeletingId] = useState<string | string[]>("")
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
    const [editingId, setEditingId] = useState<string>("")
    const [openImportDialog, setOpenImportDialog] = useState(false)

    // Giả lập dữ liệu - thay thế bằng API call thực tế

    const debouncedSearch = useCallback(
        debounce((searchValue: string) => {
            setQuery(prev => ({
                ...prev,
                page: 1,
                query: {
                    ...prev.query,
                    name: {
                        $regex: searchValue,
                        $options: 'i'
                    }
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
            limit: 5,
            query: {
                sort: '{"createdAt":-1}',
            }
        });
        setSearch("");
        setSelectedSort("newest");
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
                        : value === 'price_asc'
                            ? JSON.stringify({ price: 1 })
                            : JSON.stringify({ price: -1 })
            }
        }));
    }

    const handleGetProducts = async () => {
        const response: any = await productService.loadAllWithPaging(query);
        if (response.records) {
            setProducts(response.records.rows);
            setTotal(response.records.total)
        }
    }

    useEffect(() => {
        handleGetProducts();
    }, [query])

    const sortOptions = [
        { value: "newest", label: "Mới nhất" },
        { value: "oldest", label: "Cũ hơn" },
        { value: "price_asc", label: "Giá tăng dần" },
        { value: "price_desc", label: "Giá giảm dần" },
    ]

    const handleSelectProduct = (productId: string) => {
        setSelectedProducts(prev => {
            if (prev.includes(productId)) {
                return prev.filter(id => id !== productId);
            } else {
                return [...prev, productId];
            }
        });
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            const allProductIds = products.map(product => product._id);
            setSelectedProducts(allProductIds);
        } else {
            setSelectedProducts([]);
        }
    };

    const handleDelete = async () => {
        try {
            if (Array.isArray(deletingId)) {
                await productService.removeMany({ ids: selectedProducts });
                setSelectedProducts([]);
                const table = (window as any)._tableInstance;
                if (table) {
                    table.toggleAllRowsSelected(false);
                }
            } else {
                await productService.remove({ _id: deletingId });
            }

            handleGetProducts();
        } catch (error) {
            console.log(error)
        } finally {
            setOpenDeleteDialog(false);
            setDeletingId("");
        }
    }

    const categories = [
        { id: "laundry", name: "Dịch vụ giặt ủi", key: "laundry" },
        { id: "steam", name: "Dịch vụ hấp", key: "steam" },
        { id: "special", name: "Dịch vụ giặt đặc biệt", key: "special" },
        { id: "bulky", name: "Dịch vụ giặt đồ cồng kềnh", key: "bulky" },
        { id: "personal", name: "Dịch vụ đồ dùng cá nhân", key: "personal" },
        { id: "plush", name: "Dịch vụ đồ gấu bông", key: "plush" },
        { id: "formal", name: "Dịch vụ đồ vest và áo dài", key: "formal" }
    ]

    const handleDeleteSelected = () => {
        setDeletingId(selectedProducts);
        setOpenDeleteDialog(true);
    }

    const categoryColors: { [key: string]: string } = {
        "laundry": "bg-blue-100 text-blue-800",
        "steam": "bg-purple-100 text-purple-800",
        "special": "bg-pink-100 text-pink-800",
        "bulky": "bg-orange-100 text-orange-800",
        "personal": "bg-green-100 text-green-800",
        "plush": "bg-gray-100 text-gray-800",
        "formal": "bg-gray-100 text-gray-800",
    }

    const columns: ColumnDef<Product>[] = [
        {
            id: "select",
            header: ({ table }: any) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected()}
                    onCheckedChange={(value) => {
                        table.toggleAllPageRowsSelected(!!value);
                        handleSelectAll(!!value);
                    }}
                    aria-label="Select all"
                    className="translate-y-[2px] mr-2"
                />
            ),
            cell: ({ row }: any) => (
                <Checkbox
                    checked={selectedProducts.includes(row.original._id)}
                    onCheckedChange={(value) => {
                        row.toggleSelected(!!value);
                        handleSelectProduct(row.original._id);
                    }}
                    aria-label="Select row"
                    className="translate-y-[2px]"
                />
            ),
        },
        {
            id: "stt",
            header: 'STT',
            accessorKey: 'stt',
            cell: ({ row }) => (
                <div className="cursor-pointer flex justify-start items-center h-[40px]">
                    {(query.page - 1) * query.limit + row.index + 1}
                </div>
            ),
        },
        {
            id: "image",
            header: 'Ảnh',
            accessorKey: 'image',
            cell: ({ row }) => (
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                    <p className="font-semibold text-primary uppercase">
                        {row.original.name.charAt(0)}
                    </p>
                </div>
            ),
        },
        {
            id: "productId",
            accessorKey: "productId",
            header: "Mã SP"
        },
        {
            id: "name",
            accessorKey: "name",
            header: "Tên sản phẩm",
            cell: ({ row }) => (
                <div className="w-full text-nowrap">
                    {row.original.name}
                </div>
            )
        },
        {
            id: "category",
            accessorKey: "category",
            header: "Danh mục",
            cell: ({ row }) => (
                <div className={cn(
                    "px-2 py-1 rounded-full text-xs w-fit text-nowrap",
                    categoryColors[row.original.category] || "bg-gray-100 text-gray-800"
                )}>
                    {categories.find(category => category.id === row.original.category)?.name}
                </div>
            )
        },
        {
            id: "price",
            accessorKey: "price",
            header: "Giá bán",
            cell: ({ row }) => `${row.original.price.toLocaleString()}đ`
        },
        {
            id: "status",
            accessorKey: "status",
            header: "Trạng thái",
            cell: ({ row }) => (
                <div className={cn(
                    "px-2 py-1 rounded-full text-xs w-fit text-nowrap",
                    row.original.status === 'active'
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                )}>
                    {row.original.status === 'active' ? 'Đang bán' : 'Ngừng bán'}
                </div>
            )
        },
        {
            id: "actions",
            size: 200,
            header: () => {
                return (
                    <div className="text-left">Thao tác</div>
                )
            },
            cell: ({ row }) => {
                return (
                    <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="whitespace-nowrap"
                            onClick={() => setEditingId(row.original._id)}
                        >
                            <Pencil className="h-4 w-4 mr-2" />
                            Sửa
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            className="whitespace-nowrap"
                            onClick={() => {
                                setDeletingId(row.original._id);
                                setOpenDeleteDialog(true);
                            }}
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Xóa
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

    const handleChangeCategory = (value: string) => {
        setQuery(prev => ({
            ...prev,
            page: 1,
            query: {
                ...prev.query,
                category: value
            }
        }));
    }

    const ProductCard = ({ product }: { product: Product }) => {
        return (
            <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
                <div className="relative aspect-square mb-4 rounded-md overflow-hidden bg-secondary">
                    <div className="w-full h-full flex items-center justify-center select-none">
                        <p className="text-4xl font-semibold text-primary">{product.name.charAt(0)}</p>
                    </div>
                </div>
                <h3 className="font-semibold mb-2">{product.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">Mã SP: {product.productId}</p>
                <p className="text-primary font-medium mb-2">{product.price.toLocaleString()}đ</p>
                <div className="flex justify-between items-center">
                    <div className={cn(
                        "px-2 py-1 rounded-full text-xs w-fit",
                        categoryColors[product.category] || "bg-gray-100 text-gray-800"
                    )}>
                        {product.category}
                    </div>
                    <div className={cn(
                        "px-2 py-1 rounded-full text-xs w-fit",
                        product.status === 'active'
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                    )}>
                        {product.status === 'active' ? 'Đang bán' : 'Ngừng bán'}
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="w-8 h-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                            <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => setEditingId(product._id)}
                            >
                                Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    setDeletingId(product._id);
                                    setOpenDeleteDialog(true);
                                }}
                                className="text-red-600 cursor-pointer"
                            >
                                Xóa
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-1 sm:p-2">
            {/* Header Section - Make it stack on mobile */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                <h1 className="text-xl sm:text-2xl font-bold">Quản lý hàng hóa</h1>
                <div className="flex gap-1 sm:gap-2 w-full sm:w-auto">
                    <Button
                        onClick={() => setOpenDialogCreateProduct(true)}
                        variant="default"
                        className="h-10 flex-1 sm:flex-none"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        <span className="hidden sm:inline">Tạo mới</span>
                        <span className="sm:hidden">Thêm</span>
                    </Button>
                    <Button
                        variant="outline"
                        className="h-10 flex-1 sm:flex-none"
                        onClick={() => setOpenImportDialog(true)}
                    >
                        <Import className="mr-2 h-4 w-4" />
                        <span className="hidden sm:inline">Nhập dữ liệu</span>
                        <span className="sm:hidden">Nhập</span>
                    </Button>
                </div>
            </div>

            {/* Filter Section - Stack filters on mobile */}
            <div className="bg-white pt-1 sm:pt-2 rounded-lg shadow-sm mb-1 sm:mb-2">
                <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 p-1 sm:p-2">
                    <div className="flex-1 w-full sm:max-w-md">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                value={search}
                                onChange={handleSearch}
                                className="pl-10 h-10 w-full"
                                placeholder="Tìm kiếm hàng hóa"
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-1 sm:gap-2">
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
                            value={(query.query as any).category || ''}
                            onValueChange={handleChangeCategory}
                        >
                            <SelectTrigger className="w-full sm:w-[180px] h-10">
                                <SelectValue placeholder="Danh mục" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((option) => (
                                    <SelectItem
                                        className="cursor-pointer h-[48px]"
                                        key={option.id}
                                        value={option.id}
                                    >
                                        {option.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <div className="flex gap-2 w-full sm:w-auto">
                            <Button
                                variant="outline"
                                className="h-10 flex-1 sm:flex-none"
                                onClick={handleClearFilter}
                            >
                                <Filter className="mr-2 h-4 w-4" />
                                Xóa bộ lọc
                            </Button>

                            {selectedProducts.length > 0 && (
                                <Button
                                    onClick={handleDeleteSelected}
                                    variant="destructive"
                                    className="h-10 flex-1 sm:flex-none"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    <span className="hidden sm:inline">Xóa đã chọn ({selectedProducts.length})</span>
                                    <span className="sm:hidden">Xóa ({selectedProducts.length})</span>
                                </Button>
                            )}
                        </div>

                        <div className="border rounded-md p-1 ml-auto">
                            <Button
                                variant={viewMode === 'table' ? 'secondary' : 'ghost'}
                                size="sm"
                                className="px-2"
                                onClick={() => setViewMode('table')}
                            >
                                <TableIcon className="h-4 w-4" />
                            </Button>
                            <Button
                                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                                size="sm"
                                className="px-2"
                                onClick={() => {
                                    setViewMode('grid')
                                    setSelectedProducts([])
                                    const table = (window as any)._tableInstance;
                                    if (table) {
                                        table.toggleAllRowsSelected(false);
                                    }
                                }}
                            >
                                <LayoutGrid className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section - Adjust grid columns for different screen sizes */}
            <div className="bg-white">
                {viewMode === 'table' ? (
                    <div className="overflow-x-auto">
                        <CustomTable
                            columns={columns}
                            data={products}
                            loading={isLoading}
                            isBorderInner
                            tableRef={(table) => {
                                (window as any)._tableInstance = table;
                            }}
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
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1 sm:gap-2 p-1 sm:p-2">
                            {products.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                        <div className="p-0.5 sm:p-1">
                            <CustomPagination
                                onChange={handleChangePage}
                                total={total}
                                currentPage={query.page}
                                pageSize={query.limit}
                                className="justify-center"
                            />
                        </div>
                    </>
                )}
            </div>

            {/* Dialogs remain the same */}
            {
                openDialogCreateProduct && (
                    <DialogCreateProduct
                        reload={handleGetProducts}
                        close={() => setOpenDialogCreateProduct(false)}
                    />
                )
            }

            <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                        <AlertDialogDescription>
                            {Array.isArray(deletingId)
                                ? `Bạn có chắc chắn muốn xóa ${deletingId.length} sản phẩm đã chọn?`
                                : "Bạn có chắc chắn muốn xóa sản phẩm này?"
                            }
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setOpenDeleteDialog(false)}>
                            Hủy
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>
                            Xác nhận
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {
                editingId && (
                    <DialogEditProduct
                        productId={editingId}
                        reload={handleGetProducts}
                        close={() => setEditingId("")}
                    />
                )
            }

            {
                openImportDialog && (
                    <DialogImportProduct
                        reload={handleGetProducts}
                        close={() => setOpenImportDialog(false)}
                    />
                )
            }
        </div >
    )
}

export default ProductsView