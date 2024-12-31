import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from '@/components/ui'
import { ChevronDown } from 'lucide-react'
import { ReactNode, useEffect, useState } from 'react'
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { Input } from '../ui/input';

// type DropDownItem = {
//     key: string;
//     label: string;
// };

type CustomDropDownProps = {
    dropDownList: any | null;
    onChange?: any;
    placeholder?: string;
    width?: string;
    className?: string;
    isNotUseAuthInputClass?: boolean;
    isHiddenSearch?: boolean;
    customIcon?: ReactNode;
    mappedKey?: string;
    mappedLabel?: string;
    data?: any;
};

const CustomDropDown = ({
    customIcon, dropDownList, onChange, placeholder, width, className, isNotUseAuthInputClass = false, isHiddenSearch = false
    , mappedKey = 'key', mappedLabel = 'label', data
}: CustomDropDownProps) => {

    const [item, setItem] = useState<any | null>(null);
    const [_, setIsOpen] = useState(false);
    const [searchValue, setSearchValue] = useState<string>('');
    const [dropdownFilterList, setDropdownFilterList] = useState<any[]>(dropDownList || []);
    const handleChangeItem = (data: any) => {
        if (typeof onChange === 'function') {
            onChange(data);
        } else {
            console.warn('onChange is not a function');
        }
        setItem(data);
        setIsOpen(false);  // Đóng Popover sau khi chọn một item
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setSearchValue(value);
    };

    useEffect(() => {
        const filteredItems = dropDownList
            ? dropDownList.filter((item: any) =>
                item[mappedLabel].toLowerCase().startsWith(searchValue.toLowerCase())
            )
            : [];
        setDropdownFilterList(filteredItems.length ? filteredItems : dropDownList || []);
    }, [searchValue, dropDownList]);

    useEffect(() => {
        if (!data) return
        const selectedData = dropDownList?.find((item: any) => item[mappedKey] === data)
        if (!selectedData) return
        setItem(selectedData)
    }, [data, dropDownList])

    const handlePopoverChange = (isOpen: boolean) => {
        setIsOpen(isOpen);
        if (!isOpen && searchValue) {
            setSearchValue('');
            setDropdownFilterList(dropDownList || []);
        }
    };

    return (
        <Popover onOpenChange={handlePopoverChange}>
            <PopoverTrigger className="py-0" asChild>
                {customIcon ? customIcon :
                    <Button className={cn('bg-transparent justify-between items-center hover:bg-transparent text-black h-[48px]', !isNotUseAuthInputClass && 'authInput', className, width)}>
                        <span className="">{item ? item[mappedLabel] : placeholder}</span>
                        <ChevronDown className="" />
                    </Button>
                }
            </PopoverTrigger>
            <PopoverContent align="start" className={cn('max-w-80 p-0 z-[9999] max-h-[262px] overflow-auto', width)}>
                {
                    dropDownList && dropDownList.length > 4 &&
                    <div className={cn("p-2", isHiddenSearch && 'hidden')}>
                        <Input
                            className="w-full h-[48px]"
                            onChange={handleSearch}
                            value={searchValue}
                        />
                    </div>
                }
                <div className="min-h-[48px] max-h-[242px] h-fit p-0 overflow-auto">
                    <ul>
                        {dropdownFilterList && dropdownFilterList.length > 0 && dropdownFilterList.map((dropdownItem) => (
                            <li
                                onClick={() => handleChangeItem(dropdownItem)}
                                key={dropdownItem[mappedKey]}
                                className="h-[48px] text-[#21272A] hover:bg-secondary p-4 flex items-center text-sm cursor-pointer"
                            >
                                <span>{dropdownItem[mappedLabel]}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default CustomDropDown;
