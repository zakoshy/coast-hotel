
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
  ShieldCheck,
  Palmtree,
  PlaneLanding,
  PlaneTakeoff
} from 'lucide-react';
import { format, startOfToday, isBefore, addDays, isAfter } from 'date-fns';
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
import { useToast } from '@/hooks/use-toast';

interface BookingFormProps {
  layout?: 'horizontal' | 'vertical';
}

type BookingStep = 'selection' | 'checking' | 'payment' | 'success';
type PaymentMethod = 'card' | 'mpesa' | 'paypal';

const BookingForm = ({ layout = 'vertical' }: BookingFormProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState<BookingStep>('selection');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [progress, setProgress] = useState(0);
  
  const [arrivalDate, setArrivalDate] = useState<Date | undefined>(undefined);
  const [departureDate, setDepartureDate] = useState<Date | undefined>(undefined);

  const isHorizontal = layout === 'horizontal';

  const handleStartBooking = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!arrivalDate || !departureDate) {
      toast({
        variant: "destructive",
        title: "Incomplete Dates",
        description: "Please select both your arrival and departure dates to proceed.",
      });
      return;
    }

    if (isAfter(arrivalDate, departureDate) || arrivalDate.getTime() === departureDate.getTime()) {
      toast({
        variant: "destructive",
        title: "Invalid Stay Duration",
        description: "Departure date must be at least one day after the arrival date.",
      });
      return;
    }

    setStep('checking');
    setProgress(33);
    
    setTimeout(() => {
      setStep('payment');
      setProgress(66);
    }, 2000);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('checking');
    setProgress(85);
    
    setTimeout(() => {
      setStep('success');
      setProgress(100);
    }, 2500);
  };

  const resetBooking = () => {
    setStep('selection');
    setProgress(0);
    setPaymentMethod('card');
    setArrivalDate(undefined);
    setDepartureDate(undefined);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {step !== 'selection' && step !== 'success' && (
        <div className="mb-8 space-y-2">
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60">
            <span>1. Selection</span>
            <span>2. Secure Payment</span>
            <span>3. Confirmation</span>
          </div>
          <Progress value={progress} className="h-1.5 rounded-full" />
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
              "flex gap-4",
              isHorizontal ? "flex-col lg:flex-row items-end" : "flex-col"
            )}
          >
            {/* Arrival Date */}
            <div className={cn("flex-1 space-y-2", isHorizontal ? "w-full lg:w-auto" : "w-full")}>
              <Label className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary/60 ml-1 flex items-center gap-2">
                <PlaneLanding className="h-3 w-3" />
                Arrival Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-bold h-14 border-primary/20 bg-white hover:bg-primary/5 rounded-2xl transition-all shadow-sm",
                      !arrivalDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-3 h-5 w-5 text-primary" />
                    {arrivalDate ? format(arrivalDate, "EEE, MMM dd, yyyy") : "Select Arrival"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-[2rem] shadow-2xl border-none" align="start">
                  <Calendar
                    mode="single"
                    selected={arrivalDate}
                    onSelect={(d) => {
                      setArrivalDate(d);
                      if (departureDate && d && isAfter(d, departureDate)) {
                        setDepartureDate(undefined);
                      }
                    }}
                    disabled={(date) => isBefore(date, startOfToday())}
                    initialFocus
                    className="rounded-[2rem] border shadow-xl bg-white"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Departure Date */}
            <div className={cn("flex-1 space-y-2", isHorizontal ? "w-full lg:w-auto" : "w-full")}>
              <Label className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary/60 ml-1 flex items-center gap-2">
                <PlaneTakeoff className="h-3 w-3" />
                Departure Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-bold h-14 border-primary/20 bg-white hover:bg-primary/5 rounded-2xl transition-all shadow-sm",
                      !departureDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-3 h-5 w-5 text-primary" />
                    {departureDate ? format(departureDate, "EEE, MMM dd, yyyy") : "Select Departure"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-[2rem] shadow-2xl border-none" align="start">
                  <Calendar
                    mode="single"
                    selected={departureDate}
                    onSelect={setDepartureDate}
                    disabled={(date) => 
                      isBefore(date, arrivalDate ? addDays(arrivalDate, 1) : startOfToday())
                    }
                    initialFocus
                    className="rounded-[2rem] border shadow-xl bg-white"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className={cn("flex-1 space-y-2", isHorizontal ? "w-full lg:w-40" : "w-full")}>
              <Label className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary/60 ml-1 flex items-center gap-2">
                <Users className="h-3 w-3" />
                Guests
              </Label>
              <Select defaultValue="2" required>
                <SelectTrigger className="h-14 border-primary/20 bg-white hover:bg-primary/5 rounded-2xl font-bold shadow-sm">
                  <SelectValue placeholder="Guests" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-none shadow-2xl">
                  <SelectItem value="1">1 Adult</SelectItem>
                  <SelectItem value="2">2 Adults</SelectItem>
                  <SelectItem value="3">3 Adults</SelectItem>
                  <SelectItem value="4">Family (2+2)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" size="lg" className={cn(
              "h-14 px-10 bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl shadow-xl hover:shadow-primary/20 transition-all",
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
            className="flex flex-col items-center justify-center py-16 space-y-6"
          >
            <Loader2 className="h-14 w-14 text-secondary animate-spin" />
            <div className="text-center">
              <h3 className="text-3xl font-headline font-bold text-primary mb-3">
                {progress < 80 ? "Verifying Availability..." : "Finalizing Secure Transaction..."}
              </h3>
              <p className="text-muted-foreground max-w-xs mx-auto leading-relaxed">
                {paymentMethod === 'mpesa' && progress >= 80 
                  ? "Check your phone for the M-Pesa STK Prompt to authorize payment..." 
                  : "Syncing with our global reservation system. Please do not refresh."}
              </p>
            </div>
          </motion.div>
        )}

        {step === 'payment' && (
          <motion.div 
            key="payment"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between mb-8 border-b border-primary/10 pb-6">
              <div className="flex items-center gap-6">
                <Button variant="ghost" size="icon" onClick={() => setStep('selection')} className="rounded-full bg-primary/5 text-primary hover:bg-primary/10">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                  <h3 className="text-3xl font-headline font-bold text-primary">Secure Reservation</h3>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Encrypted Checkout</p>
                </div>
              </div>
              <div className="hidden lg:flex items-center gap-3 text-[10px] text-primary/60 font-bold uppercase tracking-[0.2em] bg-primary/5 px-4 py-2 rounded-full">
                <ShieldCheck className="h-4 w-4 text-green-600" />
                <span>PCI-DSS Level 1 Security</span>
              </div>
            </div>

            <form onSubmit={handlePaymentSubmit} className="grid lg:grid-cols-5 gap-12">
              <div className="lg:col-span-2 space-y-8">
                <div className="space-y-6">
                  <Label className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary block">1. Guest Information</Label>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-bold text-primary/80">Full Legal Name *</Label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/30" />
                        <Input placeholder="As per passport" className="pl-12 h-14 rounded-2xl border-primary/10 bg-white" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-bold text-primary/80">Email Address *</Label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/30" />
                        <Input type="email" placeholder="for e-ticket delivery" className="pl-12 h-14 rounded-2xl border-primary/10 bg-white" required />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-primary/[0.03] rounded-[2.5rem] border border-primary/10 shadow-inner">
                  <h4 className="font-bold text-primary mb-6 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary" />
                    Stay Overview
                  </h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b border-primary/5">
                      <span className="text-xs font-bold text-muted-foreground uppercase">Period:</span>
                      <span className="font-bold text-primary">
                        {arrivalDate && departureDate 
                          ? `${format(arrivalDate, "MMM dd")} — ${format(departureDate, "MMM dd, yyyy")}` 
                          : "---"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-muted-foreground uppercase">Selection:</span>
                      <span className="font-bold text-primary">Ocean Deluxe Sanctuary</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-3 bg-white p-8 lg:p-12 rounded-[3rem] shadow-2xl border border-primary/5 space-y-8">
                <Label className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary block">2. Payment Method</Label>
                
                <Tabs defaultValue="card" onValueChange={(val) => setPaymentMethod(val as PaymentMethod)}>
                  <TabsList className="grid grid-cols-3 h-16 mb-8 rounded-2xl bg-primary/5 p-1.5">
                    <TabsTrigger value="card" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-xl transition-all font-bold">
                      <CardIcon className="h-4 w-4 mr-2" />
                      Card
                    </TabsTrigger>
                    <TabsTrigger value="mpesa" className="rounded-xl data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:shadow-xl transition-all font-bold">
                      <Smartphone className="h-4 w-4 mr-2" />
                      M-Pesa
                    </TabsTrigger>
                    <TabsTrigger value="paypal" className="rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-xl transition-all font-bold">
                      <Globe className="h-4 w-4 mr-2" />
                      PayPal
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="card" className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-bold text-primary/80">Card Number *</Label>
                      <div className="relative">
                        <CardIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/30" />
                        <Input placeholder="0000 0000 0000 0000" className="pl-12 h-14 rounded-2xl border-primary/10 bg-white" required={paymentMethod === 'card'} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-sm font-bold text-primary/80">Expiry *</Label>
                        <Input placeholder="MM / YY" className="h-14 rounded-2xl border-primary/10 bg-white" required={paymentMethod === 'card'} />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-bold text-primary/80">CVC *</Label>
                        <Input placeholder="123" className="h-14 rounded-2xl border-primary/10 bg-white" required={paymentMethod === 'card'} />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="mpesa" className="space-y-6">
                    <div className="p-5 bg-green-50 rounded-2xl border border-green-100">
                      <p className="text-xs text-green-800 leading-relaxed font-medium">
                        Enter your M-Pesa registered number. You will receive an <strong>STK Push</strong> notification on your mobile device immediately.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-bold text-green-800">M-Pesa Number *</Label>
                      <div className="relative">
                        <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-green-600" />
                        <Input placeholder="+254 7XX XXX XXX" className="pl-12 h-14 rounded-2xl border-green-200 bg-white" required={paymentMethod === 'mpesa'} />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="paypal" className="space-y-8 text-center py-10">
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-6 bg-blue-50 rounded-full">
                        <Globe className="h-10 w-10 text-blue-600" />
                      </div>
                      <p className="text-sm text-muted-foreground max-w-[250px] leading-relaxed mx-auto">
                        Redirecting to the secure PayPal portal to authorize your reservation...
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>

                <Button type="submit" className={cn(
                  "w-full h-16 font-bold rounded-2xl text-lg mt-4 shadow-2xl transition-all hover:scale-[1.01] active:scale-[0.99]",
                  paymentMethod === 'mpesa' ? "bg-green-600 hover:bg-green-700 text-white shadow-green-200" : 
                  paymentMethod === 'paypal' ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200" :
                  "bg-secondary hover:bg-secondary/90 text-white shadow-secondary/20"
                )}>
                  {paymentMethod === 'card' ? 'Authorize & Confirm Booking' : 
                   paymentMethod === 'mpesa' ? 'Initiate M-Pesa Payment' : 
                   'Proceed to PayPal Authorization'}
                </Button>
                
                <p className="text-[10px] text-center text-muted-foreground uppercase tracking-[0.3em] font-bold flex items-center justify-center gap-2">
                  <ShieldCheck className="h-3 w-3" />
                  256-Bit SSL Encrypted
                </p>
              </div>
            </form>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div 
            key="success"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center py-10"
          >
            <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-10 shadow-xl shadow-primary/5">
              <CheckCircle2 className="h-14 w-14" />
            </div>
            
            <h3 className="text-4xl md:text-5xl font-headline font-bold text-primary text-center mb-3">Reservation Confirmed</h3>
            <p className="text-muted-foreground text-center mb-12 max-w-sm mx-auto leading-relaxed">
              Welcome to the family. Your sanctuary at Diani Beach is officially secured.
            </p>

            <div className="w-full max-w-md bg-white border-2 border-dashed border-primary/20 rounded-[3rem] overflow-hidden shadow-2xl hover:shadow-primary/5 transition-all">
              <div className="bg-primary p-10 text-white text-center relative overflow-hidden">
                <div className="absolute top-4 left-4 opacity-10">
                  <Palmtree className="h-16 w-16" />
                </div>
                <Ticket className="h-12 w-12 mx-auto mb-4 opacity-90" />
                <p className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-70">Official E-Reservation</p>
                <h4 className="text-3xl font-headline font-bold mt-2 tracking-widest">CS-99284-DX</h4>
              </div>
              <div className="p-12 space-y-10">
                <div className="flex justify-between border-b border-muted pb-8">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1 tracking-widest">Guest</p>
                    <p className="font-bold text-xl text-primary">Valued Traveler</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1 tracking-widest">Method</p>
                    <p className="font-bold uppercase text-sm text-secondary bg-secondary/5 px-3 py-1 rounded-full">{paymentMethod}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-10">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1 tracking-widest">Check In</p>
                    <p className="font-bold text-primary">{arrivalDate ? format(arrivalDate, "MMM dd, yyyy") : "---"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1 tracking-widest">Check Out</p>
                    <p className="font-bold text-primary">{departureDate ? format(departureDate, "MMM dd, yyyy") : "---"}</p>
                  </div>
                </div>
                <div className="pt-10 flex flex-col items-center gap-4">
                  <div className="h-24 w-full bg-[repeating-linear-gradient(90deg,hsl(var(--primary)),hsl(var(--primary))_3px,transparent_3px,transparent_10px)] opacity-10 rounded-xl" />
                  <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-muted-foreground">Digital Signature Required</p>
                </div>
              </div>
              <div className="bg-muted/30 p-6 text-center text-[10px] text-muted-foreground uppercase tracking-[0.4em] font-bold">
                Coastal Sands Retreat • Diani Beach, Kenya
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 mt-16">
              <Button onClick={() => window.print()} variant="outline" className="rounded-full px-10 h-14 border-primary/20 text-primary font-bold hover:bg-primary/5">
                Print Confirmation
              </Button>
              <Button onClick={resetBooking} variant="link" className="text-primary font-bold hover:text-secondary transition-colors">
                Book Another Sanctuary
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookingForm;
