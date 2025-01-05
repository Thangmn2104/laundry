import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui"
import { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

interface DateRangePickerProps {
    value?: DateRange
    onChange?: (value: DateRange | undefined) => void
    placeholder?: string
    className?: string
}

export function DateRangePicker({
    value,
    onChange,
    placeholder = "Pick a date range",
    className,
}: DateRangePickerProps) {
    return (
        <div className={"grid gap-2 " + className}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        id="date"
                        className={cn(
                            "w-full justify-start text-left font-normal h-10",
                            !value && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {value?.from ? (
                            value.to ? (
                                <>
                                    {format(value.from, "dd/MM/yyyy")} -{" "}
                                    {format(value.to, "dd/MM/yyyy")}
                                </>
                            ) : (
                                format(value.from, "dd/MM/yyyy")
                            )
                        ) : (
                            <span>{placeholder}</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={value?.from}
                        selected={value}
                        onSelect={onChange}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
} 