import { useState, useCallback, useEffect } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { debounce } from "lodash"
import { Filter, Import, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Heading from "@/components/common/Heading"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import CustomTable from "@/components/common/CustomTable"
import CustomPagination from "@/components/common/CustomPagination"
import CustomDropDown from "@/components/common/CustomDropDown"
import { cn } from "@/lib/utils"
import { ProductService } from "@/services/product.service"

interface Product {
    _id: string;
    productId: string;
    name: string;
    price: number;
    category: string;
    image: string;
    description?: string;
    status: 'active' | 'inactive';
    createdAt: string;
    updatedAt: string;
}

const ProductsView = () => {
    const [search, setSearch] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [selectedProducts, setSelectedProducts] = useState<string[]>([])
    const [total, setTotal] = useState(0)
    const [selectedSort, setSelectedSort] = useState<{ key: string, name: string }>({
        key: "newest",
        name: "Mới nhất"
    })
    const [products, setProducts] = useState<Product[]>([])
    const productService = new ProductService()
    const [query, setQuery] = useState({
        page: 1,
        limit: 5,
        query: {
            sort: '{"createdAt":-1}',
        }
    })

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
        setSelectedSort({
            key: "newest",
            name: "Mới nhất"
        });
    }

    const handleChangeSort = (data: { key: string, name: string }) => {
        setSelectedSort(data);
        setQuery(prev => ({
            ...prev,
            query: {
                ...prev.query,
                sort: data.key === 'newest'
                    ? JSON.stringify({ createdAt: -1 })
                    : data.key === 'oldest'
                        ? JSON.stringify({ createdAt: 1 })
                        : data.key === 'price_asc'
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

    const mockCategories = [
        { label: 'Mới nhất', key: "newest" },
        { label: 'Cũ hơn', key: "oldest" },
        { label: 'Giá tăng dần', key: "price_asc" },
        { label: 'Giá giảm dần', key: "price_desc" },
    ];

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
                    className="translate-y-[2px]"
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
            header: 'STT',
            accessorKey: 'stt',
            cell: ({ row }) => (
                <div className="cursor-pointer flex justify-start items-center h-[40px]">
                    {(query.page - 1) * query.limit + row.index + 1}
                </div>
            ),
        },
        {
            header: 'Ảnh',
            accessorKey: 'image',
            cell: ({ row }) => (
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                    {row.original.image && row.original.image !== "" ? (
                        <img
                            src={row.original.image}
                            alt={row.original.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                target.parentElement!.innerHTML = `<p class="font-semibold text-primary uppercase">${row.original.name.charAt(0)}</p>`;
                            }}
                        />
                    ) : (
                        <p className="font-semibold text-primary uppercase">
                            {row.original.name.charAt(0)}
                        </p>
                    )}
                </div>
            ),
        },
        {
            accessorKey: "productId",
            header: "Mã SP"
        },
        {
            accessorKey: "name",
            header: "Tên sản phẩm"
        },
        {
            accessorKey: "category",
            header: "Danh mục"
        },
        {
            accessorKey: "price",
            header: "Giá bán",
            cell: ({ row }) => `${row.original.price.toLocaleString()}đ`
        },
        {
            accessorKey: "status",
            header: "Trạng thái",
            cell: ({ row }) => (
                <div className={cn(
                    "px-2 py-1 rounded-full text-xs w-fit",
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
            cell: ({ row }) => {
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="w-8 h-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => console.log('Edit', row.original._id)}>
                                <div className="w-full h-[48px] cursor-pointer hover:bg-secondary flex items-center justify-center">
                                    <span>Chỉnh sửa</span>
                                </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => console.log('Delete', row.original._id)}>
                                <div className="w-full h-[48px] cursor-pointer hover:bg-secondary flex items-center justify-center">
                                    <span>Xóa</span>
                                </div>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
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

    return (
        <div className="space-y-4">
            <Heading title="Quản lý hàng hóa" />
            <div className="flex h-[48px] w-full justify-between mt-10">
                <div className="flex items-center gap-3 w-2/3">
                    {selectedProducts.length > 0 && (
                        <Button
                            onClick={() => console.log('Delete selected', selectedProducts)}
                            variant="outline"
                            className="h-[48px]">
                            <Trash2 />
                        </Button>
                    )}
                    <div
                        onClick={handleClearFilter}
                        className="relative p-2 border rounded-sm border-red-500 cursor-pointer h-[48px] aspect-square flex items-center justify-center">
                        <div className="absolute top-0 left-0 w-[2px] h-2/3 translate-y-2 rotate-[90deg] translate-x-5 bg-red-500 z-10" />
                        <Filter />
                    </div>
                    <div className="w-1/3 border border-border rounded-lg truncate flex h-[48px] items-center">
                        <Input
                            id="search"
                            name="search"
                            type="text"
                            autoComplete="search"
                            value={search}
                            onChange={handleSearch}
                            className={cn('border-none rounded-none h-[48px]')}
                            placeholder="Tìm kiếm hàng hóa"
                        />
                        <div className='border-l border-slate-200 aspect-square h-[56px] flex items-center justify-center text-slate-500'>
                            <Search size={20} />
                        </div>
                    </div>
                    <CustomDropDown
                        isHiddenSearch
                        onChange={handleChangeSort}
                        className='w-fit'
                        dropDownList={mockCategories}
                        placeholder="Sắp xếp"
                        data={selectedSort}
                    />
                </div>
                <div className="flex items-center gap-3 mb-2">
                    <Button className="h-[48px]" onClick={() => console.log('Create new')}>
                        <Plus />
                        <span>Tạo mới</span>
                    </Button>
                    <Button className="h-[48px]" onClick={() => console.log('Import')}>
                        <Import />
                        <span>Nhập dữ liệu</span>
                    </Button>
                </div>
            </div>

            <CustomTable
                columns={columns}
                data={products}
                loading={isLoading}
                isBorderInner
            />

            <CustomPagination
                onChange={handleChangePage}
                total={total}
                currentPage={query.page}
                pageSize={query.limit}
                className="justify-center my-6"
            />

            {/* Thêm các dialog/modal ở đây */}
        </div>
    )
}

export default ProductsView