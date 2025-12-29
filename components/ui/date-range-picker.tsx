"use client"

import { format } from "date-fns"
import { ChevronDownIcon } from "lucide-react"
import * as React from "react"
import { DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface DatePickerWithRangeProps extends React.HTMLAttributes<HTMLDivElement> {
  date: DateRange | undefined
  setDate: (date: DateRange | undefined) => void
}

export function DatePickerWithRange({
  className,
  date,
  setDate,
}: DatePickerWithRangeProps) {
  const [numberOfMonths, setNumberOfMonths] = React.useState(2);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setNumberOfMonths(1);
      } else {
        setNumberOfMonths(2);
      }
    };

    handleResize(); // Check on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "justify-between text-left font-normal border-border bg-card h-9 text-xs w-full sm:w-[240px]",
              !date && "text-muted-foreground"
            )}
          >
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
            <ChevronDownIcon className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 overflow-hidden" align="end" side="bottom">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={numberOfMonths}
            className="rounded-lg border shadow-sm"
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
