
"use client";

import React, { useState, useEffect } from 'react';
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
  PlaneTakeoff,
  Printer,
  Download
} from 'lucide-react';
import { format, startOfToday, isBefore, addDays } from 'date-fns';
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
import { useFirestore, addDocumentNonBlocking } from '@/firebase';
import { collection } from 'firebase/firestore';

const PUBLIC_HOTEL_ID = 'coastal-sands-retreat';

interface BookingFormProps {
  layout?: 'horizontal' | 'vertical';
}

type BookingStep = 'selection' | 'checking' | 'payment' | 'success';
type PaymentMethod = 'card' | 'mpesa' | 'paypal';

const BookingForm = ({ layout = 'vertical' }: BookingFormProps) => {
  const { toast } = useToast();
  const db = useFirestore();
  const [step, setStep] = useState<BookingStep>('selection');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [progress, setProgress] = useState(0);
  
  const [arrivalDate, setArrivalDate] = useState<Date | undefined>(undefined);
  const [departureDate, setDepartureDate] = useState<Date | undefined>(undefined);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestsCount, setGuestsCount] = useState('2');

  const [arrivalOpen, setArrivalOpen] = useState(false);
  const [departureOpen, setDepartureOpen] = useState(false);

  const isHorizontal = layout === 'horizontal';

  // Logic to ensure departure is always after arrival
  useEffect(() => {
    if (arrivalDate && departureDate && (isBefore(departureDate, arrivalDate) || departureDate.getTime() === arrivalDate.getTime())) {
      setDepartureDate(addDays(arrivalDate, 1));
    }
  }, [arrivalDate, departureDate]);

  const handleStartBooking = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!arrivalDate || !departureDate) {
      toast({
        variant: "destructive",
        title: "Missing Dates",
        description: "Please select both arrival and departure dates to proceed.",
      });
      return;
    }

    setStep('checking');
    setProgress(33);
    
    // Simulate availability check
    setTimeout(() => {
      setStep('payment');
      setProgress(66);
    }, 2000);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('checking');
    setProgress(85);
    
    // Save to Firestore
    try {
      const bookingsCol = collection(db, 'hotels', PUBLIC_HOTEL_ID, 'bookings');
      const bookingData = {
        guestName,
        guestEmail,
        checkInDate: arrivalDate?.toISOString(),
        checkOutDate: departureDate?.toISOString(),
        numberOfGuests: Number(guestsCount),
        totalAmount: 250, // Demo value
        status: 'pending',
        paymentStatus: 'paid',
        paymentMethod,
        roomType: 'Luxury Ocean Suite',
        hotelId: PUBLIC_HOTEL_ID,
        bookingDate: new Date().toISOString()
      };
      
      addDocumentNonBlocking(bookingsCol, bookingData);

      // Track as Revenue in a real app, here we just simulate the success
      const revenueCol = collection(db, 'hotels', PUBLIC_HOTEL_ID, 'revenue');
      addDocumentNonBlocking(revenueCol, {
        hotelId: PUBLIC_HOTEL_ID,
        date: new Date().toISOString(),
        amount: 250,
        source: 'Website'
      });

    } catch (err) {
      console.error("Booking save failed:", err);
    }

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
    setArrivalDate(undefined);
    setDepartureDate(undefined);
    setGuestName('');
    setGuestEmail('');
  };

  return (
    <div className="w-full max-w-5xl mx-auto text-foreground">
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
                Check-In
              </Label>
              <Popover open={arrivalOpen} onOpenChange={setArrivalOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    type="button"
                    className={cn(
                      "w-full justify-start text-left font-bold h-16 border-primary/15 bg-white hover:bg-primary/[0.02] rounded-2xl transition-all shadow-sm text-lg px-6",
                      !arrivalDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-4 h-5 w-5 text-primary" />
                    {arrivalDate ? format(arrivalDate, "MMM dd, yyyy") : "Select Arrival"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-none z-[100]" align="start">
                  <div className="p-4 bg-primary text-white text-center rounded-t-[2.5rem] font-headline font-bold">
                    Select Arrival Date
                  </div>
                  <Calendar
                    mode="single"
                    selected={arrivalDate}
                    onSelect={(d) => {
                      setArrivalDate(d);
                      if (d) setArrivalOpen(false);
                    }}
                    disabled={(date) => isBefore(date, startOfToday())}
                    className="rounded-b-[2.5rem] bg-white p-6"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Departure Date Input */}
            <div className={cn("flex-1 space-y-3", isHorizontal ? "w-full lg:w-auto" : "w-full")}>
              <Label className="text-[11px] uppercase tracking-[0.25em] font-bold text-primary/80 ml-1 flex items-center gap-2">
                <PlaneTakeoff className="h-3.5 w-3.5 text-secondary" />
                Check-Out
              </Label>
              <Popover open={departureOpen} onOpenChange={setDepartureOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    type="button"
                    className={cn(
                      "w-full justify-start text-left font-bold h-16 border-primary/15 bg-white hover:bg-primary/[0.02] rounded-2xl transition-all shadow-sm text-lg px-6",
                      !departureDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-4 h-5 w-5 text-primary" />
                    {departureDate ? format(departureDate, "MMM dd, yyyy") : "Select Departure"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-none z-[100]" align="start">
                  <div className="p-4 bg-primary text-white text-center rounded-t-[2.5rem] font-headline font-bold">
                    Select Departure Date
                  </div>
                  <Calendar
                    mode="single"
                    selected={departureDate}
                    onSelect={(d) => {
                      setDepartureDate(d);
                      if (d) setDepartureOpen(false);
                    }}
                    disabled={(date) => 
                      isBefore(date, arrivalDate ? addDays(arrivalDate, 1) : startOfToday())
                    }
                    className="rounded-b-[2.5rem] bg-white p-6"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className={cn("flex-1 space-y-3", isHorizontal ? "w-full lg:w-48" : "w-full")}>
              <Label className="text-[11px] uppercase tracking-[0.25em] font-bold text-primary/80 ml-1 flex items-center gap-2">
                <Users className="h-3.5 w-3.5 text-secondary" />
                Guests
              </Label>
              <Select value={guestsCount} onValueChange={setGuestsCount} required>
                <SelectTrigger className="h-16 border-primary/15 bg-white hover:bg-primary/[0.02] rounded-2xl font-bold shadow-sm text-lg px-6">
                  <SelectValue placeholder="Guests" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-none shadow-2xl">
                  <SelectItem value="1">1 Adult</SelectItem>
                  <SelectItem value="2">2 Adults</SelectItem>
                  <SelectItem value="3">3 Adults</SelectItem>
                  <SelectItem value="4">Family (2+2)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" size="lg" className={cn(
              "h-16 px-12 bg-primary hover:bg-primary/95 text-white font-bold rounded-2xl shadow-xl hover:shadow-primary/25 transition-all text-lg",
              isHorizontal ? "lg:w-auto w-full" : "w-full"
            )}>
              Book Now
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
                {progress < 80 ? "Verifying Availability..." : "Securing Your Oasis..."}
              </h3>
              <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed text-lg">
                We are coordinating with our concierge on-site. Please wait while we finalize your request.
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
                  <h3 className="text-4xl font-headline font-bold text-primary tracking-tight">Secure Checkout</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <ShieldCheck className="h-4 w-4 text-green-600" />
                    <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-bold">256-Bit SSL Secured Sanctuary</p>
                  </div>
                </div>
              </div>
              <div className="hidden lg:flex flex-col items-end">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Total Stay</span>
                <span className="text-3xl font-headline font-bold text-secondary">$250.00</span>
              </div>
            </div>

            <form onSubmit={handlePaymentSubmit} className="grid lg:grid-cols-12 gap-12">
              <div className="lg:col-span-5 space-y-10">
                <div className="space-y-6">
                  <Label className="text-[11px] uppercase tracking-[0.35em] font-bold text-primary block border-l-4 border-secondary pl-4">1. Guest Details</Label>
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label className="text-sm font-bold text-primary/80 ml-1">Full Legal Name</Label>
                      <div className="relative">
                        <User className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/30" />
                        <Input 
                          placeholder="As per ID or Passport" 
                          className="pl-14 h-16 rounded-[1.25rem] border-primary/10 bg-white text-lg" 
                          value={guestName}
                          onChange={e => setGuestName(e.target.value)}
                          required 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-bold text-primary/80 ml-1">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/30" />
                        <Input 
                          type="email" 
                          placeholder="For booking confirmation" 
                          className="pl-14 h-16 rounded-[1.25rem] border-primary/10 bg-white text-lg" 
                          value={guestEmail}
                          onChange={e => setGuestEmail(e.target.value)}
                          required 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-10 bg-primary/[0.02] rounded-[3rem] border border-primary/10 shadow-inner relative overflow-hidden">
                  <h4 className="font-bold text-primary mb-8 flex items-center gap-3">
                    <CheckCircle2 className="h-6 w-6 text-secondary" />
                    Stay Overview
                  </h4>
                  <div className="space-y-5 text-lg">
                    <div className="flex justify-between items-center pb-5 border-b border-primary/5">
                      <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Duration</span>
                      <span className="font-bold text-primary">
                        {arrivalDate && departureDate 
                          ? `${format(arrivalDate, "MMM dd")} — ${format(departureDate, "MMM dd, yyyy")}` 
                          : "Pending Selection"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Category</span>
                      <span className="font-bold text-primary italic">Luxury Ocean Suite</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 bg-white p-10 lg:p-14 rounded-[3.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.08)] border border-primary/5 space-y-10">
                <Label className="text-[11px] uppercase tracking-[0.35em] font-bold text-primary block border-l-4 border-secondary pl-4">2. Payment Method</Label>
                
                <Tabs defaultValue="card" onValueChange={(val) => setPaymentMethod(val as PaymentMethod)} className="w-full">
                  <TabsList className="grid grid-cols-3 h-20 mb-10 rounded-[1.5rem] bg-primary/[0.03] p-2">
                    <TabsTrigger value="card" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white transition-all font-bold">
                      <CardIcon className="h-4 w-4 mr-2" />
                      Card
                    </TabsTrigger>
                    <TabsTrigger value="mpesa" className="rounded-xl data-[state=active]:bg-green-600 data-[state=active]:text-white transition-all font-bold">
                      <Smartphone className="h-4 w-4 mr-2" />
                      M-Pesa
                    </TabsTrigger>
                    <TabsTrigger value="paypal" className="rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all font-bold">
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
                            <Label className="text-sm font-bold text-primary/80 ml-1">CVV</Label>
                            <Input placeholder="XXX" className="h-16 rounded-[1.25rem] border-primary/10 bg-white text-lg font-mono" required={paymentMethod === 'card'} />
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="mpesa" className="space-y-8 mt-0">
                        <div className="p-6 bg-green-50 rounded-2xl border border-green-100 flex items-start gap-4">
                          <Smartphone className="h-6 w-6 text-green-600 shrink-0 mt-1" />
                          <p className="text-sm text-green-900 leading-relaxed">
                            Enter your M-Pesa number. You will receive an <strong>STK Push</strong> prompt on your phone to authorize the transaction.
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-bold text-green-800 ml-1">M-Pesa Number</Label>
                          <div className="relative">
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 font-bold text-green-600">+254</span>
                            <Input placeholder="7XX XXX XXX" className="pl-16 h-16 rounded-[1.25rem] border-green-200 bg-white text-lg font-bold" required={paymentMethod === 'mpesa'} />
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="paypal" className="space-y-10 text-center py-12 mt-0">
                        <div className="flex flex-col items-center gap-6">
                          <Globe className="h-16 w-16 text-blue-600 animate-pulse" />
                          <p className="text-lg font-bold text-blue-900">Redirecting to PayPal Gateway</p>
                          <p className="text-sm text-muted-foreground max-w-[280px] mx-auto">
                            Finish your reservation securely via your international PayPal account.
                          </p>
                        </div>
                      </TabsContent>
                    </motion.div>
                  </AnimatePresence>
                </Tabs>

                <Button type="submit" className={cn(
                  "w-full h-20 font-bold rounded-[1.5rem] text-xl mt-4 shadow-2xl transition-all hover:scale-[1.01] active:scale-[0.99]",
                  paymentMethod === 'mpesa' ? "bg-green-600 hover:bg-green-700 text-white" : 
                  paymentMethod === 'paypal' ? "bg-blue-600 hover:bg-blue-700 text-white" :
                  "bg-secondary hover:bg-secondary/95 text-white"
                )}>
                  Confirm & Finalize
                </Button>
                
                <p className="text-[10px] text-center text-muted-foreground uppercase tracking-[0.4em] font-bold flex items-center justify-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-green-600" />
                  Secure Transaction
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
            <div className="h-28 w-28 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-10 shadow-2xl relative">
              <CheckCircle2 className="h-16 w-16" />
            </div>
            
            <h3 className="text-5xl md:text-6xl font-headline font-bold text-primary text-center mb-4">Welcome Home!</h3>
            <p className="text-muted-foreground text-center mb-16 max-w-sm mx-auto leading-relaxed text-lg">
              Your stay at Diani Beach is officially confirmed. Your digital reservation and receipt are ready below.
            </p>

            <div className="w-full max-w-md bg-white border-[3px] border-dashed border-primary/25 rounded-[3.5rem] overflow-hidden shadow-2xl hover:shadow-primary/10 transition-all group">
              <div className="bg-primary p-12 text-white text-center relative overflow-hidden">
                <Ticket className="h-16 w-16 mx-auto mb-6 opacity-90" />
                <p className="text-[11px] uppercase tracking-[0.5em] font-bold opacity-75 mb-1">Reservation ID</p>
                <h4 className="text-4xl font-headline font-bold mt-2 tracking-[0.1em] text-secondary">CS-PARADISE</h4>
              </div>
              <div className="p-14 space-y-12">
                <div className="flex justify-between border-b border-primary/10 pb-10">
                  <div>
                    <p className="text-[11px] uppercase font-bold text-muted-foreground mb-2">Honored Guest</p>
                    <p className="font-bold text-2xl text-primary font-headline">{guestName || "Valued Traveler"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] uppercase font-bold text-muted-foreground mb-2 tracking-[0.2em]">Settlement</p>
                    <p className="font-bold uppercase text-xs text-secondary bg-secondary/10 px-4 py-2 rounded-full tracking-widest">{paymentMethod}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-12 border-b border-primary/10 pb-10">
                  <div>
                    <p className="text-[11px] uppercase font-bold text-muted-foreground mb-2">Check In</p>
                    <p className="font-bold text-xl text-primary">{arrivalDate ? format(arrivalDate, "MMM dd, yyyy") : "Pending"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] uppercase font-bold text-muted-foreground mb-2">Check Out</p>
                    <p className="font-bold text-xl text-primary">{departureDate ? format(departureDate, "MMM dd, yyyy") : "Pending"}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center bg-muted/20 p-6 rounded-2xl">
                  <span className="text-[11px] font-bold uppercase text-muted-foreground">Total Paid</span>
                  <span className="text-2xl font-bold text-secondary">$250.00</span>
                </div>
              </div>
              <div className="bg-muted/40 p-8 text-center text-[11px] text-muted-foreground uppercase tracking-[0.5em] font-bold border-t-2 border-dashed border-primary/10">
                Coastal Sands • Diani Beach
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 mt-16 w-full max-w-md">
              <Button onClick={() => window.print()} className="flex-1 h-16 rounded-full bg-primary text-white font-bold gap-3 shadow-xl">
                <Printer className="h-5 w-5" />
                Print Receipt
              </Button>
              <Button variant="outline" className="flex-1 h-16 rounded-full border-primary/20 text-primary font-bold gap-3">
                <Download className="h-5 w-5" />
                Download PDF
              </Button>
            </div>
            
            <Button onClick={resetBooking} variant="link" className="mt-10 text-primary font-bold hover:text-secondary transition-colors text-lg underline-offset-8">
              Make Another Reservation
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookingForm;
