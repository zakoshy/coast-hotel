'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useUser, useFirestore, useCollection, useDoc, useMemoFirebase, updateDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  DollarSign, 
  Hotel, 
  LogOut, 
  Search,
  Loader2 as Loader2Icon,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  User as UserIcon,
  Filter,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Clock,
  Edit,
  FileText,
  MessageSquare,
  Menu as MenuIcon,
  Tag,
  Hammer,
  ArrowRight,
  UserPen
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  type ChartConfig
} from '@/components/ui/chart';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  AreaChart,
  Area
} from 'recharts';
import { useRouter } from 'next/navigation';
import { getAuth, signOut } from 'firebase/auth';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

type ViewState = 'overview' | 'bookings' | 'rooms' | 'profile';

export default function AdminDashboard() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const [activeView, setActiveView] = useState<ViewState>('overview');
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Handle Redirection
  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/admin/login');
    }
  }, [user, isUserLoading, router]);

  // Fetch Admin User Profile
  const adminProfileRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'admin_users', user.uid);
  }, [db, user]);
  const { data: adminProfile, isLoading: isAdminProfileLoading } = useDoc(adminProfileRef);

  const hotelId = adminProfile?.hotelId;

  // Fetch Hotel Data
  const hotelRef = useMemoFirebase(() => {
    if (!db || !hotelId) return null;
    return doc(db, 'hotels', hotelId);
  }, [db, hotelId]);
  const { data: hotelData } = useDoc(hotelRef);

  // Fetch Bookings
  const bookingsQuery = useMemoFirebase(() => {
    if (!db || !hotelId) return null;
    return collection(db, 'hotels', hotelId, 'bookings');
  }, [db, hotelId]);
  const { data: bookings } = useCollection(bookingsQuery);

  // Fetch Rooms
  const roomsQuery = useMemoFirebase(() => {
    if (!db || !hotelId) return null;
    return collection(db, 'hotels', hotelId, 'rooms');
  }, [db, hotelId]);
  const { data: rooms } = useCollection(roomsQuery);

  // Fetch Revenue
  const revenueQuery = useMemoFirebase(() => {
    if (!db || !hotelId) return null;
    return collection(db, 'hotels', hotelId, 'revenue');
  }, [db, hotelId]);
  const { data: revenueData } = useCollection(revenueQuery);

  const filteredBookings = useMemo(() => {
    if (!bookings) return [];
    return bookings.filter(b => {
      const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
      const matchesSearch = 
        b.guestName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        b.guestEmail.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [bookings, statusFilter, searchQuery]);

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    router.push('/admin/login');
  };

  const handleUpdateBookingStatus = (bookingId: string, newStatus: string) => {
    if (!db || !hotelId) return;
    const bookingRef = doc(db, 'hotels', hotelId, 'bookings', bookingId);
    updateDocumentNonBlocking(bookingRef, { status: newStatus });
    toast({
      title: "Booking Updated",
      description: `Reservation status changed to ${newStatus}.`,
    });
  };

  const handleSaveBookingEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !hotelId || !selectedBooking) return;
    
    const bookingRef = doc(db, 'hotels', hotelId, 'bookings', selectedBooking.id);
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    
    updateDocumentNonBlocking(bookingRef, {
      roomType: formData.get('roomType'),
      checkInDate: formData.get('checkIn'),
      checkOutDate: formData.get('checkOut'),
      internalNotes: formData.get('notes'),
      paymentStatus: formData.get('paymentStatus')
    });
    
    setIsEditModalOpen(false);
    toast({ title: "Update Successful", description: "Booking details have been saved." });
  };

  const handleSaveRoomUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !hotelId || !selectedRoom) return;

    const roomRef = doc(db, 'hotels', hotelId, 'rooms', selectedRoom.id);
    const formData = new FormData(e.currentTarget as HTMLFormElement);

    const updateData: any = {
      price: Number(formData.get('price')),
      status: formData.get('status'),
    };

    const seasonalPrice = formData.get('seasonalPrice');
    const seasonalStart = formData.get('seasonalStart');
    const seasonalEnd = formData.get('seasonalEnd');

    if (seasonalPrice && seasonalStart && seasonalEnd) {
      updateData.seasonalRate = {
        price: Number(seasonalPrice),
        startDate: seasonalStart,
        endDate: seasonalEnd
      };
    }

    updateDocumentNonBlocking(roomRef, updateData);
    setIsRoomModalOpen(false);
    toast({ title: "Inventory Updated", description: "Rates and status successfully applied." });
  };

  const handleSaveProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !user || !adminProfileRef) return;

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const username = formData.get('username') as string;

    updateDocumentNonBlocking(adminProfileRef, { username });
    setIsProfileModalOpen(false);
    toast({ title: "Profile Updated", description: "Your account details have been refreshed." });
  };

  if (isUserLoading || isAdminProfileLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-muted/10">
        <Loader2Icon className="animate-spin h-12 w-12 text-primary mb-4" />
        <p className="text-muted-foreground font-medium">Securing access to management portal...</p>
      </div>
    );
  }
  
  if (!user) {
    return null;
  }

  if (!adminProfile && !isAdminProfileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-muted/20">
        <Card className="max-w-md w-full p-10 text-center rounded-[2.5rem] shadow-2xl border-none">
          <ShieldCheck className="h-16 w-16 text-secondary mx-auto mb-6" />
          <h2 className="text-3xl font-headline font-bold text-primary mb-4">Profile Not Initialized</h2>
          <p className="text-muted-foreground mb-8">
            Your account exists, but your administrator profile has not been set up. Please contact system support.
          </p>
          <Button onClick={handleLogout} variant="outline" className="w-full rounded-xl">
            Sign Out
          </Button>
        </Card>
      </div>
    );
  }

  const totalRevenue = revenueData?.reduce((acc, curr) => acc + curr.amount, 0) || 45230;
  const activeBookingsCount = bookings?.filter(b => b.status === 'confirmed').length || 0;
  const occupancyRate = "78%";

  const chartData = [
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 3000 },
    { name: 'Mar', revenue: 5000 },
    { name: 'Apr', revenue: 4500 },
    { name: 'May', revenue: 6000 },
    { name: 'Jun', revenue: 5500 },
  ];

  const NavContent = () => (
    <nav className="space-y-2 flex-grow">
      <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-4 ml-2">Main Menu</p>
      <Button 
        variant="ghost" 
        onClick={() => { setActiveView('overview'); setIsMobileMenuOpen(false); }}
        className={cn(
          "w-full justify-start text-white hover:bg-white/10 rounded-xl h-12 font-bold transition-all",
          activeView === 'overview' ? "bg-white/10" : "bg-transparent"
        )}
      >
        <LayoutDashboard className="mr-3 h-5 w-5 text-secondary" /> Overview
      </Button>
      <Button 
        variant="ghost" 
        onClick={() => { setActiveView('bookings'); setIsMobileMenuOpen(false); }}
        className={cn(
          "w-full justify-start text-white/60 hover:bg-white/10 hover:text-white rounded-xl h-12 transition-all",
          activeView === 'bookings' ? "bg-white/10 text-white" : ""
        )}
      >
        <Calendar className="mr-3 h-5 w-5" /> Bookings
      </Button>
      <Button 
        variant="ghost" 
        onClick={() => { setActiveView('rooms'); setIsMobileMenuOpen(false); }}
        className={cn(
          "w-full justify-start text-white/60 hover:bg-white/10 hover:text-white rounded-xl h-12 transition-all",
          activeView === 'rooms' ? "bg-white/10 text-white" : ""
        )}
      >
        <Hotel className="mr-3 h-5 w-5" /> Room &amp; Rates
      </Button>
      <Button 
        variant="ghost" 
        onClick={() => { setActiveView('profile'); setIsMobileMenuOpen(false); }}
        className={cn(
          "w-full justify-start text-white/60 hover:bg-white/10 hover:text-white rounded-xl h-12 transition-all",
          activeView === 'profile' ? "bg-white/10 text-white" : ""
        )}
      >
        <UserIcon className="mr-3 h-5 w-5" /> My Profile
      </Button>
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Sidebar - Desktop */}
      <div className="fixed left-0 top-0 bottom-0 w-72 bg-[#0f172a] text-white p-8 hidden lg:flex flex-col">
        <div className="mb-12">
          <h2 className="text-2xl font-headline font-bold tracking-tight">COASTAL SANDS</h2>
          <p className="text-[10px] text-secondary font-bold tracking-[0.3em] uppercase mt-1">Management Suite</p>
        </div>
        
        <NavContent />

        <div className="pt-8 border-t border-white/10 mt-auto">
          <div className="flex items-center gap-4 mb-6 px-2">
            <Avatar className="h-12 w-12 border-2 border-secondary shadow-lg">
              <AvatarImage src={`https://picsum.photos/seed/${user.uid}/100/100`} />
              <AvatarFallback className="bg-primary text-white font-bold">
                {adminProfile?.username?.[0] || 'A'}
              </AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
              <p className="font-bold text-sm truncate">{adminProfile?.username || "Administrator"}</p>
              <p className="text-[10px] text-white/40 truncate">{user.email}</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="w-full border-white/10 bg-white/5 text-white hover:bg-white/10 rounded-xl h-12 font-bold" 
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-4 w-4 text-red-400" /> Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-72 p-6 md:p-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden rounded-xl border-slate-200">
                  <MenuIcon className="h-5 w-5 text-slate-600" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-[#0f172a] border-none text-white p-8 w-72 flex flex-col">
                <SheetHeader className="mb-10 text-left">
                  <SheetTitle className="text-white font-headline text-2xl">COASTAL SANDS</SheetTitle>
                </SheetHeader>
                <NavContent />
                <div className="mt-auto pt-8 border-t border-white/10">
                  <Button 
                    variant="outline" 
                    className="w-full border-white/10 bg-white/5 text-white hover:bg-white/10 rounded-xl h-12 font-bold" 
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-3 h-4 w-4 text-red-400" /> Sign Out
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            <div>
              <h1 className="text-3xl md:text-4xl font-headline font-bold text-[#0f172a]">
                {activeView === 'overview' ? "Operations Overview" : 
                 activeView === 'bookings' ? "Booking Management" : 
                 activeView === 'rooms' ? "Room &amp; Rate Manager" : "Account Profile"}
              </h1>
              <p className="text-muted-foreground mt-1 flex items-center gap-2 text-sm">
                <Hotel className="h-4 w-4" /> {hotelData?.name || "Coastal Sands Retreat"} • {adminProfile?.role || "Manager"}
              </p>
            </div>
          </div>

          {(activeView === 'overview' || activeView === 'bookings') && (
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input 
                placeholder="Search guest logs..." 
                className="pl-12 h-12 w-full md:w-72 rounded-2xl border-none bg-white shadow-sm focus:ring-2 focus:ring-primary/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}
        </header>

        {activeView === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {[
                { label: "Total Revenue", val: `$${totalRevenue.toLocaleString()}`, icon: <DollarSign />, trend: "+12.5%", color: "bg-emerald-500" },
                { label: "Confirmed Stays", val: activeBookingsCount.toString(), icon: <Calendar />, trend: "+5.2%", color: "bg-blue-500" },
                { label: "Occupancy Rate", val: occupancyRate, icon: <Hotel />, trend: "+2.1%", color: "bg-secondary" },
                { label: "Avg. Daily Rate", val: "$310", icon: <TrendingUp />, trend: "+1.4%", color: "bg-amber-500" }
              ].map((kpi, i) => (
                <Card key={i} className="border-none shadow-sm rounded-[2rem] overflow-hidden bg-white">
                  <CardContent className="p-8">
                    <div className="flex justify-between items-start mb-6">
                      <div className={`p-4 rounded-2xl text-white ${kpi.color} shadow-lg shadow-${kpi.color.split('-')[1]}-500/20`}>
                        {React.cloneElement(kpi.icon as React.ReactElement, { className: "h-6 w-6" })}
                      </div>
                      <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold">
                        {kpi.trend}
                      </Badge>
                    </div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{kpi.label}</p>
                    <h3 className="text-3xl font-headline font-bold text-slate-900">{kpi.val}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-10">
              <Card className="lg:col-span-2 border-none shadow-sm rounded-[2.5rem] bg-white p-10">
                <CardHeader className="p-0 mb-10 flex flex-row items-center justify-between">
                  <CardTitle className="text-2xl font-headline font-bold text-slate-900">Revenue Performance</CardTitle>
                </CardHeader>
                <div className="h-[300px] w-full">
                  <ChartContainer config={chartConfig}>
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.15}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                    </AreaChart>
                  </ChartContainer>
                </div>
              </Card>

              <Card className="lg:col-span-1 border-none shadow-sm rounded-[2.5rem] bg-white p-10">
                <CardTitle className="text-2xl font-headline font-bold text-slate-900 mb-8">Recent Activity</CardTitle>
                <div className="space-y-6">
                  {(bookings?.slice(0, 5) || []).map((b, i) => (
                    <div key={i} className="flex items-center justify-between pb-6 border-b border-slate-50 last:border-none">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary/10 text-primary font-bold">{b.guestName[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{b.guestName}</p>
                          <p className="text-xs text-muted-foreground">{b.roomType}</p>
                        </div>
                      </div>
                      <Badge className={cn(
                        "font-bold",
                        b.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600' : 
                        b.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                      )}>
                        {b.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </>
        )}

        {activeView === 'bookings' && (
          <Card className="border-none shadow-sm rounded-[2.5rem] bg-white p-10 overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl">
                {['all', 'confirmed', 'pending', 'cancelled'].map((status) => (
                  <Button
                    key={status}
                    variant={statusFilter === status ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setStatusFilter(status)}
                    className={cn("rounded-lg font-bold capitalize shrink-0", statusFilter === status ? "bg-primary text-white" : "text-muted-foreground")}
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="border-none">
                    <TableHead className="font-bold">Guest Details</TableHead>
                    <TableHead className="font-bold">Stay Period</TableHead>
                    <TableHead className="font-bold">Room</TableHead>
                    <TableHead className="font-bold">Financials</TableHead>
                    <TableHead className="font-bold">Status</TableHead>
                    <TableHead className="font-bold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-20 text-muted-foreground font-medium">
                        No reservations matching criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredBookings.map((b) => (
                      <TableRow key={b.id} className="hover:bg-slate-50/50 transition-colors">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">{b.guestName[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-bold text-slate-900 leading-none mb-1">{b.guestName}</p>
                              <p className="text-[10px] text-muted-foreground">{b.guestEmail}</p>
                              {b.specialRequests && (
                                <div className="mt-1 flex items-center gap-1 text-[9px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100 w-fit">
                                  <MessageSquare className="h-2.5 w-2.5" /> {b.specialRequests}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p className="font-medium text-slate-900">{format(new Date(b.checkInDate), 'MMM dd')} - {format(new Date(b.checkOutDate), 'MMM dd')}</p>
                            <p className="text-[10px] text-muted-foreground">Stay: {Math.ceil((new Date(b.checkOutDate).getTime() - new Date(b.checkInDate).getTime()) / (1000 * 3600 * 24))} nights</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm font-medium text-slate-900">{b.roomType}</p>
                          <p className="text-[10px] text-muted-foreground">{b.numberOfGuests} Guests</p>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm font-bold text-slate-900">${b.totalAmount}</p>
                          <Badge variant="outline" className={cn(
                            "text-[9px] h-4 py-0 font-bold",
                            b.paymentStatus === 'paid' ? "border-emerald-200 text-emerald-600 bg-emerald-50" : "border-amber-200 text-amber-600 bg-amber-50"
                          )}>
                            {b.paymentStatus || 'pending'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={cn(
                            "border-none font-bold text-[10px]",
                            b.status === 'confirmed' ? "bg-emerald-50 text-emerald-600" : 
                            b.status === 'pending' ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600"
                          )}>
                            {b.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4 text-slate-400" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-xl p-2 border-slate-100">
                              <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Manage Booking</DropdownMenuLabel>
                              {b.status !== 'confirmed' && (
                                <DropdownMenuItem onClick={() => handleUpdateBookingStatus(b.id, 'confirmed')} className="rounded-lg text-emerald-600 font-bold">
                                  <CheckCircle2 className="mr-2 h-4 w-4" /> Confirm Reservation
                                </DropdownMenuItem>
                              )}
                              {b.status !== 'cancelled' && (
                                <DropdownMenuItem onClick={() => handleUpdateBookingStatus(b.id, 'cancelled')} className="rounded-lg text-red-600 font-bold">
                                  <XCircle className="mr-2 h-4 w-4" /> Cancel &amp; Void
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => { setSelectedBooking(b); setIsEditModalOpen(true); }} className="rounded-lg font-bold">
                                <Edit className="mr-2 h-4 w-4" /> Edit Details
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        )}

        {activeView === 'rooms' && (
          <div className="space-y-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(rooms || []).map((room) => (
                <Card key={room.id} className="border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden group hover:shadow-xl transition-all duration-300">
                  <div className="relative h-48 bg-slate-100">
                    <img 
                      src={room.imageUrls?.[0] || `https://picsum.photos/seed/${room.id}/600/400`} 
                      className="w-full h-full object-cover" 
                      alt={room.roomType} 
                    />
                    <div className="absolute top-4 right-4 flex gap-2">
                       <Badge className={cn(
                        "font-bold border-none shadow-lg",
                        room.status === 'out_of_order' ? "bg-red-500 text-white" : "bg-emerald-500 text-white"
                      )}>
                        {room.status === 'out_of_order' ? 'Out of Order' : 'Active'}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-8">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-headline font-bold text-slate-900">{room.roomType}</h3>
                        <p className="text-xs text-muted-foreground">Room #{room.roomNumber}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">${room.price}</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Base Rate</p>
                      </div>
                    </div>
                    
                    {room.seasonalRate && (
                      <div className="mb-6 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                         <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest">Seasonal Rate Active</span>
                            <span className="text-sm font-bold text-amber-900">${room.seasonalRate.price}</span>
                         </div>
                         <div className="flex items-center gap-2 text-[10px] text-amber-600 font-medium">
                            <Clock className="h-3 w-3" />
                            {format(new Date(room.seasonalRate.startDate), 'MMM dd')} - {format(new Date(room.seasonalRate.endDate), 'MMM dd, yyyy')}
                         </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3 mt-6">
                       <Button 
                        variant="outline" 
                        className="rounded-xl font-bold gap-2 text-xs"
                        onClick={() => { setSelectedRoom(room); setIsRoomModalOpen(true); }}
                      >
                         <Tag className="h-3 w-3 text-secondary" /> Adjust Rates
                       </Button>
                       <Button 
                        variant="outline" 
                        className={cn(
                          "rounded-xl font-bold gap-2 text-xs",
                          room.status === 'out_of_order' ? "bg-red-50 text-red-600 border-red-100" : ""
                        )}
                        onClick={() => {
                          if (!db || !hotelId) return;
                          const roomRef = doc(db, 'hotels', hotelId, 'rooms', room.id);
                          updateDocumentNonBlocking(roomRef, { status: room.status === 'out_of_order' ? 'active' : 'out_of_order' });
                        }}
                      >
                         <Hammer className="h-3 w-3" /> {room.status === 'out_of_order' ? 'Fix Status' : 'Mark OOO'}
                       </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Card className="border-none shadow-sm rounded-[2.5rem] bg-white p-10">
               <CardTitle className="text-2xl font-headline font-bold mb-8">Quick Availability Preview</CardTitle>
               <div className="grid grid-cols-7 gap-4">
                  {[...Array(7)].map((_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() + i);
                    return (
                      <div key={i} className="text-center p-4 bg-slate-50 rounded-2xl">
                         <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">{format(date, 'EEE')}</p>
                         <p className="text-lg font-bold text-primary">{format(date, 'dd')}</p>
                         <div className="mt-2 h-1.5 w-full bg-emerald-500 rounded-full" title="Fully Available" />
                      </div>
                    );
                  })}
               </div>
               <p className="text-xs text-muted-foreground mt-6 italic flex items-center gap-2">
                 <Clock className="h-3.5 w-3.5" /> Showing next 7 days availability. Real-time sync enabled with OTA channels.
               </p>
            </Card>
          </div>
        )}

        {activeView === 'profile' && (
          <div className="max-w-2xl mx-auto">
            <Card className="border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden">
              <div className="bg-primary p-12 text-center text-white">
                 <Avatar className="h-32 w-32 border-4 border-white mx-auto mb-6 shadow-2xl">
                    <AvatarImage src={`https://picsum.photos/seed/${user.uid}/200/200`} />
                    <AvatarFallback className="bg-secondary text-white text-4xl font-headline font-bold">
                      {adminProfile?.username?.[0] || 'A'}
                    </AvatarFallback>
                 </Avatar>
                 <h2 className="text-3xl font-headline font-bold mb-2">{adminProfile?.username}</h2>
                 <p className="text-white/70 font-medium">{adminProfile?.role} • {hotelData?.name}</p>
              </div>
              <CardContent className="p-10 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-1">
                     <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Full Identity</p>
                     <p className="text-lg font-bold text-slate-900">{adminProfile?.username}</p>
                   </div>
                   <div className="space-y-1">
                     <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">System Email</p>
                     <p className="text-lg font-bold text-slate-900">{user.email}</p>
                   </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <Button 
                    onClick={() => setIsProfileModalOpen(true)}
                    className="flex-1 h-14 rounded-xl font-bold bg-primary hover:bg-primary/90 text-white shadow-lg"
                  >
                    <UserPen className="mr-2 h-5 w-5" /> Edit Profile
                  </Button>
                  <Button 
                    onClick={handleLogout} 
                    variant="outline" 
                    className="flex-1 h-14 rounded-xl font-bold border-red-100 text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="mr-2 h-5 w-5" /> Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Profile Edit Modal */}
        <Dialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
          <DialogContent className="sm:max-w-[450px] rounded-[2.5rem] p-10">
            <DialogHeader>
              <DialogTitle className="text-3xl font-headline font-bold text-primary">Edit Account</DialogTitle>
              <DialogDescription>Update your public identity on the management platform.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSaveProfileUpdate} className="space-y-6 mt-6">
              <div className="space-y-2">
                <Label className="font-bold text-xs uppercase tracking-widest text-slate-500">Public Username</Label>
                <Input name="username" defaultValue={adminProfile?.username} className="rounded-xl h-12" required />
              </div>
              <div className="space-y-2">
                <Label className="font-bold text-xs uppercase tracking-widest text-slate-500">Email (Read Only)</Label>
                <Input defaultValue={user.email || ''} className="rounded-xl h-12 bg-muted/30" disabled />
              </div>
              <DialogFooter className="pt-6">
                <Button type="button" variant="ghost" onClick={() => setIsProfileModalOpen(false)}>Cancel</Button>
                <Button type="submit" className="rounded-xl bg-primary text-white font-bold px-8">Save Changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Room Manager Modal */}
        <Dialog open={isRoomModalOpen} onOpenChange={setIsRoomModalOpen}>
           <DialogContent className="sm:max-w-[550px] rounded-[2.5rem] p-10">
              <DialogHeader>
                 <DialogTitle className="text-3xl font-headline font-bold text-primary">Rate Optimization</DialogTitle>
                 <DialogDescription>Configuring yield and seasonal rates for {selectedRoom?.roomType}</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSaveRoomUpdate} className="space-y-6 mt-6">
                 <div className="space-y-2">
                    <Label className="font-bold text-xs uppercase tracking-widest text-slate-500">Base Nightly Rate ($)</Label>
                    <Input name="price" type="number" defaultValue={selectedRoom?.price} className="rounded-xl h-12" required />
                 </div>
                 
                 <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
                    <p className="text-sm font-bold text-primary flex items-center gap-2">
                       <TrendingUp className="h-4 w-4 text-secondary" /> Seasonal Adjustment
                    </p>
                    <div className="grid grid-cols-1 gap-4">
                       <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase text-slate-400">Seasonal Rate ($)</Label>
                          <Input name="seasonalPrice" type="number" placeholder="e.g., 450" className="rounded-xl bg-white" />
                       </div>
                       <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                             <Label className="text-[9px] font-bold text-slate-400 uppercase">Starts</Label>
                             <Input name="seasonalStart" type="date" className="rounded-xl bg-white" />
                          </div>
                          <div className="space-y-1">
                             <Label className="text-[9px] font-bold text-slate-400 uppercase">Ends</Label>
                             <Input name="seasonalEnd" type="date" className="rounded-xl bg-white" />
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <Label className="font-bold text-xs uppercase tracking-widest text-slate-500">Inventory Status</Label>
                    <Select name="status" defaultValue={selectedRoom?.status || 'active'}>
                       <SelectTrigger className="rounded-xl h-12">
                          <SelectValue placeholder="Select Status" />
                       </SelectTrigger>
                       <SelectContent>
                          <SelectItem value="active">Active &amp; Bookable</SelectItem>
                          <SelectItem value="out_of_order">Out of Order / Maintenance</SelectItem>
                          <SelectItem value="hidden">Hidden from Public</SelectItem>
                       </SelectContent>
                    </Select>
                 </div>

                 <DialogFooter className="pt-6">
                    <Button type="button" variant="ghost" onClick={() => setIsRoomModalOpen(false)}>Discard</Button>
                    <Button type="submit" className="rounded-xl bg-primary text-white font-bold px-8">Save Inventory Logic</Button>
                 </DialogFooter>
              </form>
           </DialogContent>
        </Dialog>

        {/* Edit Booking Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="sm:max-w-[500px] rounded-[2.5rem] p-10">
            <DialogHeader>
              <DialogTitle className="text-3xl font-headline font-bold text-primary">Modify Reservation</DialogTitle>
              <DialogDescription>Adjust details for {selectedBooking?.guestName}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSaveBookingEdit} className="space-y-6 mt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-bold text-xs uppercase tracking-widest text-slate-500">Check In</Label>
                  <Input name="checkIn" type="date" defaultValue={selectedBooking?.checkInDate?.split('T')[0]} className="rounded-xl h-12" />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold text-xs uppercase tracking-widest text-slate-500">Check Out</Label>
                  <Input name="checkOut" type="date" defaultValue={selectedBooking?.checkOutDate?.split('T')[0]} className="rounded-xl h-12" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="font-bold text-xs uppercase tracking-widest text-slate-500">Room Category</Label>
                <Select name="roomType" defaultValue={selectedBooking?.roomType}>
                  <SelectTrigger className="rounded-xl h-12">
                    <SelectValue placeholder="Select Room" />
                  </SelectTrigger>
                  <SelectContent>
                    {(rooms || []).map(r => (
                      <SelectItem key={r.id} value={r.roomType}>{r.roomType}</SelectItem>
                    ))}
                    {!rooms?.length && (
                      <>
                        <SelectItem value="Ocean Deluxe Room">Ocean Deluxe Room</SelectItem>
                        <SelectItem value="Junior Garden Suite">Junior Garden Suite</SelectItem>
                        <SelectItem value="Swahili Garden Villa">Swahili Garden Villa</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="font-bold text-xs uppercase tracking-widest text-slate-500">Payment Status</Label>
                <Select name="paymentStatus" defaultValue={selectedBooking?.paymentStatus || 'pending'}>
                  <SelectTrigger className="rounded-xl h-12">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paid">Paid (Settled)</SelectItem>
                    <SelectItem value="pending">Pending Payment</SelectItem>
                    <SelectItem value="refunded">Refunded / Reversal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="font-bold text-xs uppercase tracking-widest text-slate-500">Management Notes</Label>
                <Textarea name="notes" placeholder="e.g., Anniversary guest, late arrival..." defaultValue={selectedBooking?.internalNotes} className="rounded-xl min-h-[100px]" />
              </div>
              <DialogFooter className="pt-6">
                <Button type="button" variant="ghost" onClick={() => setIsEditModalOpen(false)}>Discard</Button>
                <Button type="submit" className="rounded-xl bg-primary text-white font-bold px-8">Update Records</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
