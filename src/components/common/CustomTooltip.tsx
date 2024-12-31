import { ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { cn } from "@/lib/utils";

type CustomTooltipProps = {
    isHidden: boolean;
    triggerElement: ReactNode;
    message: string | ReactNode;
    className?: string
}

const CustomTooltip = ({
    isHidden,
    triggerElement,
    message,
    className
}: CustomTooltipProps) => {
    return (
        <div hidden={isHidden} className={cn("absolute w-10 h-full bg-transparent top-0 right-0 items-center justify-start ", className,
            isHidden ? 'hidden' : 'flex'
        )}>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger className="bg-transparent" asChild>
                        {triggerElement}
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{message}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    )
};

export default CustomTooltip;
