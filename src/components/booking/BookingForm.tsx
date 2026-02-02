
"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Calendar as CalendarIcon, Users, CreditCard, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface BookingFormProps {
  layout?: 'horizontal' | 'vertical';
}

const BookingForm = ({ layout = 'vertical' }: BookingFormProps) => {
  const [date, setDate] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const { toast } = useToast();

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Booking Initiated!",
      description: "Redirecting you to our secure payment gateway...",
    });
  };

  const isHorizontal = layout === 'horizontal';

  return (
    <form onSubmit={handleBookingSubmit} className={cn(
      "flex gap-6",
      isHorizontal ? "flex-col lg:flex-row items-end" : "flex-col"
    )}>
      <div className={cn("flex-1 space-y-2", isHorizontal ? "w-full lg:w-auto" : "w-full")}>
        <Label className="text-xs uppercase tracking-widest font-bold opacity-70">Arrival & Departure</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal h-12 border-primary/20 bg-white hover:bg-primary/5",
                !date.from && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
              {date.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd")} - {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick your dates</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              selected={{ from: date.from, to: date.to }}
              onSelect={(range: any) => setDate(range || { from: undefined, to: undefined })}
              numberOfMonths={2}
              disabled={(date) => date < new Date()}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className={cn("flex-1 space-y-2", isHorizontal ? "w-full lg:w-48" : "w-full")}>
        <Label className="text-xs uppercase tracking-widest font-bold opacity-70">Guests</Label>
        <Select defaultValue="2">
          <SelectTrigger className="h-12 border-primary/20 bg-white hover:bg-primary/5">
            <Users className="mr-2 h-4 w-4 text-primary" />
            <SelectValue placeholder="Guests" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 Adult</SelectItem>
            <SelectItem value="2">2 Adults</SelectItem>
            <SelectItem value="3">3 Adults</SelectItem>
            <SelectItem value="4">Family (2+2)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className={cn("flex-1 space-y-2", isHorizontal ? "w-full lg:w-56" : "w-full")}>
        <Label className="text-xs uppercase tracking-widest font-bold opacity-70">Rate Type</Label>
        <Select defaultValue="intl">
          <SelectTrigger className="h-12 border-primary/20 bg-white hover:bg-primary/5">
            <CreditCard className="mr-2 h-4 w-4 text-primary" />
            <SelectValue placeholder="Resident?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="intl">International Guest (USD)</SelectItem>
            <SelectItem value="local">East African Resident (KES)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" size="lg" className={cn(
        "h-12 px-8 bg-primary hover:bg-primary/90 text-white font-bold",
        isHorizontal ? "lg:w-auto w-full" : "w-full"
      )}>
        Check Availability
        <ChevronRight className="ml-2 h-5 w-5" />
      </Button>
    </form>
  );
};

export default BookingForm;
