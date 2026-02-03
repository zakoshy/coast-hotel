
"use client";

import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Users, 
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

  const [arrivalOpen, setArrivalOpen] = useState(false);
  const [departureOpen, setDepartureOpen] = useState(false);

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
        <div className="mb-10 space-y-4">
          <div className="flex justify-between text-[11px] font-bold uppercase tracking-[0.3em] text-primary/70 px-1">
            <span className={cn(progress >= 33 ? "text-primary" : "text-muted-foreground")}>1. Selection</span>
            <span className={cn(progress >= 66 ? "text-primary" : "text-muted-foreground")}>2. Secure Payment</span>
            <span className={cn(progress >= 100 ? "text-primary" : "text-muted-foreground")}>3. Confirmation</span>
          </div>
          <Progress value={progress} className="h-2 rounded-full bg-primary/10" />
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === 'selection' && (
          <motion.form 
            key="selection"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            onSubmit={handleStartBooking} 
            className={cn(
              "flex gap-6",
              isHorizontal ? "flex-col lg:flex-row items-end" : "flex-col"
            )}
          >
            {/* Arrival Date Input */}
            <div className={cn("flex-1 space-y-3", isHorizontal ? "w-full lg:w-auto" : "w-full")}>
              <Label className="text-[11px] uppercase tracking-[0.25em] font-bold text-primary/80 ml-1 flex items-center gap-2">
                <PlaneLanding className="h-3.5 w-3.5 text-secondary" />
                Check-In Date
              </Label>
              <Popover open={arrivalOpen} onOpenChange={setArrivalOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-bold h-16 border-primary/15 bg-white hover:bg-primary/[0.02] rounded-2xl transition-all shadow-sm text-lg",
                      !arrivalDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-4 h-5 w-5 text-primary" />
                    {arrivalDate ? format(arrivalDate, "EEEE, MMM dd, yyyy") : "Select Arrival"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-none" align="start">
                  <div className="p-4 bg-primary text-white text-center rounded-t-[2.5rem] font-headline font-bold">
                    Arrival in Paradise
                  </div>
                  <Calendar
                    mode="single"
                    selected={arrivalDate}
                    onSelect={(d) => {
                      setArrivalDate(d);
                      setArrivalOpen(false);
                      if (departureDate && d && isAfter(d, departureDate)) {
                        setDepartureDate(undefined);
                      }
                    }}
                    disabled={(date) => isBefore(date, startOfToday())}
                    initialFocus
                    className="rounded-b-[2.5rem] bg-white"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Departure Date Input */}
            <div className={cn("flex-1 space-y-3", isHorizontal ? "w-full lg:w-auto" : "w-full")}>
              <Label className="text-[11px] uppercase tracking-[0.25em] font-bold text-primary/80 ml-1 flex items-center gap-2">
                <PlaneTakeoff className="h-3.5 w-3.5 text-secondary" />
                Check-Out Date
              </Label>
              <Popover open={departureOpen} onOpenChange={setDepartureOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-bold h-16 border-primary/15 bg-white hover:bg-primary/[0.02] rounded-2xl transition-all shadow-sm text-lg",
                      !departureDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-4 h-5 w-5 text-primary" />
                    {departureDate ? format(departureDate, "EEEE, MMM dd, yyyy") : "Select Departure"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-none" align="start">
                  <div className="p-4 bg-primary text-white text-center rounded-t-[2.5rem] font-headline font-bold">
                    Return to Reality
                  </div>
                  <Calendar
                    mode="single"
                    selected={departureDate}
                    onSelect={(d) => {
                      setDepartureDate(d);
                      setDepartureOpen(false);
                    }}
                    disabled={(date) => 
                      isBefore(date, arrivalDate ? addDays(arrivalDate, 1) : startOfToday())
                    }
                    initialFocus
                    className="rounded-b-[2.5rem] bg-white"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className={cn("flex-1 space-y-3", isHorizontal ? "w-full lg:w-48" : "w-full")}>
              <Label className="text-[11px] uppercase tracking-[0.25em] font-bold text-primary/80 ml-1 flex items-center gap-2">
                <Users className="h-3.5 w-3.5 text-secondary" />
                Guest Count
              </Label>
              <Select defaultValue="2" required>
                <SelectTrigger className="h-16 border-primary/15 bg-white hover:bg-primary/[0.02] rounded-2xl font-bold shadow-sm text-lg">
                  <SelectValue placeholder="Guests" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-none shadow-2xl">
                  <SelectItem value="1">1 Adult (Solo)</SelectItem>
                  <SelectItem value="2">2 Adults (Couple)</SelectItem>
                  <SelectItem value="3">3 Adults (Group)</SelectItem>
                  <SelectItem value="4">Family (2+2 Children)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" size="lg" className={cn(
              "h-16 px-12 bg-primary hover:bg-primary/95 text-white font-bold rounded-2xl shadow-xl hover:shadow-primary/25 transition-all text-lg",
              isHorizontal ? "lg:w-auto w-full" : "w-full"
            )}>
              Explore Availability
              <ChevronRight className="ml-2 h-6 w-6" />
            </Button>
          </motion.form>
        )}

        {step === 'checking' && (
          <motion.div 
            key="checking"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-24 space-y-8"
          >
            <div className="relative">
              <Loader2 className="h-20 w-20 text-secondary animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Palmtree className="h-8 w-8 text-primary/40" />
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-4xl font-headline font-bold text-primary mb-4 tracking-tight">
                {progress < 80 ? "Syncing Availability..." : "Securing Your Reservation..."}
              </h3>
              <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed text-lg">
                {paymentMethod === 'mpesa' && progress >= 80 
                  ? "Awaiting authorization via M-Pesa STK push..." 
                  : "We are coordinating with our concierge on-site. Please wait."}
              </p>
            </div>
          </motion.div>
        )}

        {step === 'payment' && (
          <motion.div 
            key="payment"
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-10"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-primary/10 pb-8">
              <div className="flex items-center gap-6">
                <Button variant="ghost" size="icon" onClick={() => setStep('selection')} className="rounded-2xl h-14 w-14 bg-primary/5 text-primary hover:bg-primary/10">
                  <ArrowLeft className="h-6 w-6" />
                </Button>
                <div>
                  <h3 className="text-4xl font-headline font-bold text-primary tracking-tight">Checkout Securely</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <ShieldCheck className="h-4 w-4 text-green-600" />
                    <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-bold">256-Bit SSL Encrypted Sanctuary</p>
                  </div>
                </div>
              </div>
              <div className="hidden lg:flex flex-col items-end">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Total Guarantee</span>
                <span className="text-3xl font-headline font-bold text-secondary">$250.00</span>
              </div>
            </div>

            <form onSubmit={handlePaymentSubmit} className="grid lg:grid-cols-12 gap-12">
              <div className="lg:col-span-5 space-y-10">
                <div className="space-y-6">
                  <Label className="text-[11px] uppercase tracking-[0.35em] font-bold text-primary block border-l-4 border-secondary pl-4">1. Guest Identification</Label>
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label className="text-sm font-bold text-primary/80 ml-1">Full Legal Name</Label>
                      <div className="relative">
                        <User className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/30" />
                        <Input placeholder="As per Identification Document" className="pl-14 h-16 rounded-[1.25rem] border-primary/10 bg-white focus:border-primary/30 text-lg" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-bold text-primary/80 ml-1">Preferred Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/30" />
                        <Input type="email" placeholder="For instant e-ticket delivery" className="pl-14 h-16 rounded-[1.25rem] border-primary/10 bg-white focus:border-primary/30 text-lg" required />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-10 bg-primary/[0.02] rounded-[3rem] border border-primary/10 shadow-inner relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-5">
                    <Palmtree className="h-24 w-24 text-primary" />
                  </div>
                  <h4 className="font-bold text-primary mb-8 flex items-center gap-3">
                    <CheckCircle2 className="h-6 w-6 text-secondary" />
                    Reservation Summary
                  </h4>
                  <div className="space-y-5 text-lg">
                    <div className="flex justify-between items-center pb-5 border-b border-primary/5">
                      <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Stay Period</span>
                      <span className="font-bold text-primary">
                        {arrivalDate && departureDate 
                          ? `${format(arrivalDate, "MMM dd")} — ${format(departureDate, "MMM dd, yyyy")}` 
                          : "Dates Pending"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Category</span>
                      <span className="font-bold text-primary italic">Ocean Deluxe Sanctuary</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 bg-white p-10 lg:p-14 rounded-[3.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.08)] border border-primary/5 space-y-10">
                <Label className="text-[11px] uppercase tracking-[0.35em] font-bold text-primary block border-l-4 border-secondary pl-4">2. Financial Settlement</Label>
                
                <Tabs defaultValue="card" onValueChange={(val) => setPaymentMethod(val as PaymentMethod)} className="w-full">
                  <TabsList className="grid grid-cols-3 h-20 mb-10 rounded-[1.5rem] bg-primary/[0.03] p-2">
                    <TabsTrigger value="card" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-xl transition-all font-bold text-sm">
                      <CardIcon className="h-4 w-4 mr-2" />
                      Card
                    </TabsTrigger>
                    <TabsTrigger value="mpesa" className="rounded-xl data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:shadow-xl transition-all font-bold text-sm">
                      <Smartphone className="h-4 w-4 mr-2" />
                      M-Pesa
                    </TabsTrigger>
                    <TabsTrigger value="paypal" className="rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-xl transition-all font-bold text-sm">
                      <Globe className="h-4 w-4 mr-2" />
                      PayPal
                    </TabsTrigger>
                  </TabsList>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={paymentMethod}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <TabsContent value="card" className="space-y-6 mt-0">
                        <div className="space-y-2">
                          <Label className="text-sm font-bold text-primary/80 ml-1">Card Number</Label>
                          <div className="relative">
                            <CardIcon className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/30" />
                            <Input placeholder="XXXX XXXX XXXX XXXX" className="pl-14 h-16 rounded-[1.25rem] border-primary/10 bg-white text-lg font-mono" required={paymentMethod === 'card'} />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-8">
                          <div className="space-y-2">
                            <Label className="text-sm font-bold text-primary/80 ml-1">Expiry</Label>
                            <Input placeholder="MM / YY" className="h-16 rounded-[1.25rem] border-primary/10 bg-white text-lg font-mono" required={paymentMethod === 'card'} />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-bold text-primary/80 ml-1">Security Code</Label>
                            <Input placeholder="CVV" className="h-16 rounded-[1.25rem] border-primary/10 bg-white text-lg font-mono" required={paymentMethod === 'card'} />
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="mpesa" className="space-y-8 mt-0">
                        <div className="p-6 bg-green-50 rounded-2xl border border-green-100/50 flex items-start gap-4">
                          <div className="p-3 bg-green-600 rounded-xl text-white">
                            <Smartphone className="h-6 w-6" />
                          </div>
                          <p className="text-sm text-green-900 leading-relaxed font-medium">
                            Enter your registered mobile number. A secure <strong>STK Push</strong> prompt will appear on your device for instant authorization.
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-bold text-green-800 ml-1">M-Pesa Mobile Number</Label>
                          <div className="relative">
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 font-bold text-green-600/60">+254</span>
                            <Input placeholder="7XX XXX XXX" className="pl-16 h-16 rounded-[1.25rem] border-green-200 bg-white text-lg font-bold text-green-800" required={paymentMethod === 'mpesa'} />
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="paypal" className="space-y-10 text-center py-12 mt-0">
                        <div className="flex flex-col items-center gap-6">
                          <div className="h-24 w-24 bg-blue-50 rounded-full flex items-center justify-center animate-pulse">
                            <Globe className="h-12 w-12 text-blue-600" />
                          </div>
                          <div className="space-y-2">
                            <p className="font-bold text-blue-900 text-xl font-headline">Redirecting to PayPal</p>
                            <p className="text-sm text-muted-foreground max-w-[280px] leading-relaxed mx-auto">
                              Confirm your booking via the globally recognized secure PayPal gateway.
                            </p>
                          </div>
                        </div>
                      </TabsContent>
                    </motion.div>
                  </AnimatePresence>
                </Tabs>

                <Button type="submit" className={cn(
                  "w-full h-20 font-bold rounded-[1.5rem] text-xl mt-4 shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98] border-none",
                  paymentMethod === 'mpesa' ? "bg-green-600 hover:bg-green-700 text-white shadow-green-100" : 
                  paymentMethod === 'paypal' ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-100" :
                  "bg-secondary hover:bg-secondary/95 text-white shadow-secondary/20"
                )}>
                  {paymentMethod === 'card' ? 'Authorize & Confirm' : 
                   paymentMethod === 'mpesa' ? 'Trigger M-Pesa Authorization' : 
                   'Sign in to PayPal Account'}
                </Button>
                
                <p className="text-[10px] text-center text-muted-foreground uppercase tracking-[0.4em] font-bold flex items-center justify-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-green-600" />
                  Verified & Secured by Coastal Sands Int.
                </p>
              </div>
            </form>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div 
            key="success"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center py-12"
          >
            <div className="h-28 w-28 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-10 shadow-2xl shadow-primary/10 relative">
              <CheckCircle2 className="h-16 w-16" />
              <div className="absolute -top-2 -right-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-white font-bold text-xs shadow-lg animate-bounce">
                  +1
                </span>
              </div>
            </div>
            
            <h3 className="text-5xl md:text-6xl font-headline font-bold text-primary text-center mb-4 tracking-tight">Karibu Paradise!</h3>
            <p className="text-muted-foreground text-center mb-16 max-w-sm mx-auto leading-relaxed text-lg">
              Your sanctuary at Diani Beach is officially secured. We have sent your concierge welcome pack to your email.
            </p>

            <div className="w-full max-w-md bg-white border-[3px] border-dashed border-primary/25 rounded-[3.5rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.1)] hover:shadow-primary/10 transition-all group">
              <div className="bg-primary p-12 text-white text-center relative overflow-hidden">
                <div className="absolute -top-4 -left-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
                  <Palmtree className="h-32 w-32" />
                </div>
                <Ticket className="h-16 w-16 mx-auto mb-6 opacity-90 drop-shadow-lg" />
                <p className="text-[11px] uppercase tracking-[0.5em] font-bold opacity-75 mb-1">Electronic Boarding Ticket</p>
                <h4 className="text-4xl font-headline font-bold mt-2 tracking-[0.1em] text-secondary">CS-992-PARA</h4>
              </div>
              <div className="p-14 space-y-12">
                <div className="flex justify-between border-b border-primary/10 pb-10">
                  <div>
                    <p className="text-[11px] uppercase font-bold text-muted-foreground mb-2 tracking-[0.2em]">Honored Guest</p>
                    <p className="font-bold text-2xl text-primary font-headline">Valued Traveler</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] uppercase font-bold text-muted-foreground mb-2 tracking-[0.2em]">Settlement</p>
                    <p className="font-bold uppercase text-xs text-secondary bg-secondary/10 px-4 py-2 rounded-full tracking-widest">{paymentMethod}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-12">
                  <div>
                    <p className="text-[11px] uppercase font-bold text-muted-foreground mb-2 tracking-[0.2em]">Check In</p>
                    <p className="font-bold text-xl text-primary">{arrivalDate ? format(arrivalDate, "MMM dd, yyyy") : "Pending"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] uppercase font-bold text-muted-foreground mb-2 tracking-[0.2em]">Check Out</p>
                    <p className="font-bold text-xl text-primary">{departureDate ? format(departureDate, "MMM dd, yyyy") : "Pending"}</p>
                  </div>
                </div>
                <div className="pt-12 flex flex-col items-center gap-6">
                  <div className="h-28 w-full bg-[repeating-linear-gradient(90deg,hsl(var(--primary)),hsl(var(--primary))_4px,transparent_4px,transparent_12px)] opacity-15 rounded-2xl" />
                  <p className="text-[11px] uppercase tracking-[0.5em] font-black text-muted-foreground/60 italic">Authentic Coastal Sands Heritage</p>
                </div>
              </div>
              <div className="bg-muted/40 p-8 text-center text-[11px] text-muted-foreground uppercase tracking-[0.5em] font-bold border-t-2 border-dashed border-primary/10">
                Diani Beach • Kenya
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-8 mt-20">
              <Button onClick={() => window.print()} variant="outline" className="rounded-full px-12 h-16 border-primary/20 text-primary font-bold hover:bg-primary/5 text-lg shadow-sm">
                Print Itinerary
              </Button>
              <Button onClick={resetBooking} variant="link" className="text-primary font-bold hover:text-secondary transition-colors text-lg underline-offset-8">
                Reserve Another Stay
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookingForm;
