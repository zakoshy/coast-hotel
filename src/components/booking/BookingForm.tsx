
"use client";

import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Users, 
  CreditCard, 
  ChevronRight, 
  Loader2, 
  CheckCircle2, 
  CreditCard as CardIcon,
  Mail,
  User,
  Ticket,
  ArrowLeft,
  Smartphone,
  Globe,
  ShieldCheck
} from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BookingFormProps {
  layout?: 'horizontal' | 'vertical';
}

type BookingStep = 'selection' | 'checking' | 'payment' | 'success';
type PaymentMethod = 'card' | 'mpesa' | 'paypal';

const BookingForm = ({ layout = 'vertical' }: BookingFormProps) => {
  const [step, setStep] = useState<BookingStep>('selection');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [progress, setProgress] = useState(0);
  const [date, setDate] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });

  const isHorizontal = layout === 'horizontal';

  const handleStartBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('checking');
    setProgress(33);
    
    // Simulate availability check
    setTimeout(() => {
      setStep('payment');
      setProgress(66);
    }, 2000);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('checking'); // Re-use checking for processing payment
    setProgress(85);
    
    // Simulate payment processing
    setTimeout(() => {
      setStep('success');
      setProgress(100);
    }, 2500);
  };

  const resetBooking = () => {
    setStep('selection');
    setProgress(0);
    setPaymentMethod('card');
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Progress Indicator for Multi-step */}
      {step !== 'selection' && step !== 'success' && (
        <div className="mb-8 space-y-2">
          <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-primary/60">
            <span>Details</span>
            <span>Payment</span>
            <span>Confirmation</span>
          </div>
          <Progress value={progress} className="h-1" />
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === 'selection' && (
          <motion.form 
            key="selection"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleStartBooking} 
            className={cn(
              "flex gap-6",
              isHorizontal ? "flex-col lg:flex-row items-end" : "flex-col"
            )}
          >
            <div className={cn("flex-1 space-y-2", isHorizontal ? "w-full lg:w-auto" : "w-full")}>
              <Label className="text-xs uppercase tracking-widest font-bold opacity-70">Arrival & Departure</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-14 border-primary/20 bg-white hover:bg-primary/5 rounded-xl",
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
                <SelectTrigger className="h-14 border-primary/20 bg-white hover:bg-primary/5 rounded-xl">
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
                <SelectTrigger className="h-14 border-primary/20 bg-white hover:bg-primary/5 rounded-xl">
                  <CreditCard className="mr-2 h-4 w-4 text-primary" />
                  <SelectValue placeholder="Resident?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="intl">International (USD)</SelectItem>
                  <SelectItem value="local">Resident (KES)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" size="lg" className={cn(
              "h-14 px-10 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl",
              isHorizontal ? "lg:w-auto w-full" : "w-full"
            )}>
              Secure Room
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.form>
        )}

        {step === 'checking' && (
          <motion.div 
            key="checking"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-12 space-y-6"
          >
            <Loader2 className="h-12 w-12 text-secondary animate-spin" />
            <div className="text-center">
              <h3 className="text-2xl font-headline font-bold text-primary mb-2">
                {progress < 80 ? "Verifying Availability..." : "Finalizing Secure Transaction..."}
              </h3>
              <p className="text-muted-foreground">
                {paymentMethod === 'mpesa' && progress >= 80 ? "Check your phone for the M-Pesa STK Prompt..." : "Please do not refresh your browser."}
              </p>
            </div>
          </motion.div>
        )}

        {step === 'payment' && (
          <motion.div 
            key="payment"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => setStep('selection')} className="rounded-full">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <h3 className="text-2xl font-headline font-bold text-primary">Secure Reservation</h3>
              </div>
              <div className="hidden md:flex items-center gap-2 text-[10px] text-primary/60 font-bold uppercase tracking-widest">
                <ShieldCheck className="h-4 w-4" />
                <span>PCI-DSS Certified</span>
              </div>
            </div>

            <form onSubmit={handlePaymentSubmit} className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-xs uppercase tracking-[0.2em] font-bold text-muted-foreground">Guest Information</Label>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-primary/40" />
                        <Input placeholder="John Doe" className="pl-10 h-12 rounded-xl" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-primary/40" />
                        <Input type="email" placeholder="john@example.com" className="pl-10 h-12 rounded-xl" required />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-muted/30 p-6 rounded-[2rem] border border-primary/5 space-y-6">
                <Label className="text-xs uppercase tracking-[0.2em] font-bold text-muted-foreground block mb-2">Payment Method</Label>
                
                <Tabs defaultValue="card" onValueChange={(val) => setPaymentMethod(val as PaymentMethod)}>
                  <TabsList className="grid grid-cols-3 h-12 mb-6 rounded-xl bg-primary/5">
                    <TabsTrigger value="card" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">
                      <CardIcon className="h-4 w-4 mr-2" />
                      Card
                    </TabsTrigger>
                    <TabsTrigger value="mpesa" className="rounded-lg data-[state=active]:bg-green-600 data-[state=active]:text-white">
                      <Smartphone className="h-4 w-4 mr-2" />
                      M-Pesa
                    </TabsTrigger>
                    <TabsTrigger value="paypal" className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                      <Globe className="h-4 w-4 mr-2" />
                      PayPal
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="card" className="space-y-4">
                    <div className="space-y-2">
                      <Label>Credit Card Number</Label>
                      <div className="relative">
                        <CardIcon className="absolute left-3 top-3 h-4 w-4 text-primary/40" />
                        <Input placeholder="0000 0000 0000 0000" className="pl-10 h-12 rounded-xl" required={paymentMethod === 'card'} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Expiry</Label>
                        <Input placeholder="MM/YY" className="h-12 rounded-xl" required={paymentMethod === 'card'} />
                      </div>
                      <div className="space-y-2">
                        <Label>CVC</Label>
                        <Input placeholder="123" className="h-12 rounded-xl" required={paymentMethod === 'card'} />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="mpesa" className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-xl border border-green-100 mb-4">
                      <p className="text-xs text-green-800 leading-relaxed">
                        Enter your M-Pesa registered number. You will receive an <strong>STK Push</strong> notification on your phone to enter your PIN.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label>M-Pesa Phone Number</Label>
                      <div className="relative">
                        <Smartphone className="absolute left-3 top-3 h-4 w-4 text-green-600" />
                        <Input placeholder="+254 7XX XXX XXX" className="pl-10 h-12 rounded-xl border-green-200" required={paymentMethod === 'mpesa'} />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="paypal" className="space-y-4 text-center py-6">
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-4 bg-blue-50 rounded-full">
                        <Globe className="h-8 w-8 text-blue-600" />
                      </div>
                      <p className="text-sm text-muted-foreground max-w-[200px]">
                        You will be redirected to the secure PayPal gateway to complete your transaction.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>

                <Button className={cn(
                  "w-full h-14 font-bold rounded-xl text-lg mt-4 shadow-lg transition-all",
                  paymentMethod === 'mpesa' ? "bg-green-600 hover:bg-green-700 text-white" : 
                  paymentMethod === 'paypal' ? "bg-blue-600 hover:bg-blue-700 text-white" :
                  "bg-secondary hover:bg-secondary/90 text-white"
                )}>
                  {paymentMethod === 'card' ? 'Pay & Confirm Booking' : 
                   paymentMethod === 'mpesa' ? 'Initiate M-Pesa Payment' : 
                   'Proceed to PayPal'}
                </Button>
                
                <p className="text-[9px] text-center text-muted-foreground uppercase tracking-[0.2em]">
                  Encrypted 256-bit Secure Gateway
                </p>
              </div>
            </form>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div 
            key="success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center py-6"
          >
            <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6 animate-bounce">
              <CheckCircle2 className="h-12 w-12" />
            </div>
            
            <h3 className="text-3xl font-headline font-bold text-primary text-center mb-2">Reservation Confirmed!</h3>
            <p className="text-muted-foreground text-center mb-10">Your sanctuary at Diani Beach awaits.</p>

            {/* Simulated Digital Ticket */}
            <div className="w-full max-w-sm bg-white border-2 border-dashed border-primary/20 rounded-3xl overflow-hidden shadow-2xl">
              <div className="bg-primary p-6 text-white text-center">
                <Ticket className="h-8 w-8 mx-auto mb-2 opacity-80" />
                <p className="text-[10px] uppercase tracking-[0.3em] font-bold">Official Reservation</p>
                <h4 className="text-xl font-headline font-bold mt-1">CS-99284-DX</h4>
              </div>
              <div className="p-8 space-y-6">
                <div className="flex justify-between border-b border-muted pb-4">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Guest</p>
                    <p className="font-bold">Valued Guest</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Method</p>
                    <p className="font-bold uppercase text-xs">{paymentMethod}</p>
                  </div>
                </div>
                <div className="flex justify-between">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Check In</p>
                    <p className="font-bold">{date.from ? format(date.from, "MMM dd, yyyy") : "TBD"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Check Out</p>
                    <p className="font-bold">{date.to ? format(date.to, "MMM dd, yyyy") : "TBD"}</p>
                  </div>
                </div>
                <div className="pt-4 flex justify-center">
                  <div className="h-16 w-full bg-[repeating-linear-gradient(90deg,black,black_2px,transparent_2px,transparent_6px)] opacity-30" />
                </div>
              </div>
              <div className="bg-muted/50 p-4 text-center text-[10px] text-muted-foreground uppercase tracking-widest">
                Coastal Sands Retreat • Diani Beach, Kenya
              </div>
            </div>

            <Button onClick={resetBooking} variant="link" className="mt-8 text-primary font-bold">
              Make another reservation
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookingForm;
