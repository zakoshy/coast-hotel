
'use client';

import React, { useState, useMemo } from 'react';
import { useUser, useFirestore, useCollection, useDoc, useMemoFirebase, updateDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  DollarSign, 
  Hotel, 
  LogOut, 
  Bell,
  Search,
  ChevronDown,
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
  FileText
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

type ViewState = 'overview' | 'bookings' | 'rooms' | 'guests';

export default function AdminDashboard() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();

  const [activeView, setActiveView] = useState<ViewState>('overview');
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Fetch Admin User Profile to get hotelId
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
      const matchesSearch = b.guestName.toLowerCase().includes(searchQuery.toLowerCase()) || 
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
    if (typeof window !== 'undefined') router.push('/admin/login');
    return null;
  }

  if (!adminProfile && !isAdminProfileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-muted/20">
        <Card className="max-w-md w-full p-10 text-center rounded-[2.5rem] shadow-2xl border-none">
          <ShieldCheck className="h-16 w-16 text-secondary mx-auto mb-6" />
          <h2 className="text-3xl font-headline font-bold text-primary mb-4">Profile Not Initialized</h2>
          <p className="text-muted-foreground mb-8">
            Your account exists, but your administrator profile has not been set up in the database. Please contact the system administrator.
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

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Sidebar Navigation */}
      <div className="fixed left-0 top-0 bottom-0 w-72 bg-[#0f172a] text-white p-8 hidden lg:flex flex-col">
        <div className="mb-12">
          <h2 className="text-2xl font-headline font-bold tracking-tight">COASTAL SANDS</h2>
          <p className="text-[10px] text-secondary font-bold tracking-[0.3em] uppercase mt-1">Management Suite</p>
        </div>
        
        <nav className="space-y-2 flex-grow">
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-4 ml-2">Main Menu</p>
          <Button 
            variant="ghost" 
            onClick={() => setActiveView('overview')}
            className={cn(
              "w-full justify-start text-white hover:bg-white/10 rounded-xl h-12 font-bold",
              activeView === 'overview' ? "bg-white/10" : "bg-transparent"
            )}
          >
            <LayoutDashboard className="mr-3 h-5 w-5 text-secondary" /> Overview
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => setActiveView('bookings')}
            className={cn(
              "w-full justify-start text-white/60 hover:bg-white/10 hover:text-white rounded-xl h-12",
              activeView === 'bookings' ? "bg-white/10 text-white" : ""
            )}
          >
            <Calendar className="mr-3 h-5 w-5" /> All Bookings
          </Button>
          <Button variant="ghost" className="w-full justify-start text-white/60 hover:bg-white/10 hover:text-white rounded-xl h-12">
            <Hotel className="mr-3 h-5 w-5" /> Room Inventory
          </Button>
          <Button variant="ghost" className="w-full justify-start text-white/60 hover:bg-white/10 hover:text-white rounded-xl h-12">
            <Users className="mr-3 h-5 w-5" /> Guest Relations
          </Button>
          
          <div className="pt-8">
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-4 ml-2">System</p>
            <Button variant="ghost" className="w-full justify-start text-white/60 hover:bg-white/10 hover:text-white rounded-xl h-12">
              <Settings className="mr-3 h-5 w-5" /> Settings
            </Button>
          </div>
        </nav>

        {/* Profile Section */}
        <div className="pt-8 border-t border-white/10">
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
            className="w-full border-white/10 bg-white/5 text-white hover:bg-white/10 rounded-xl h-12" 
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-4 w-4" /> Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-72 p-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-headline font-bold text-[#0f172a]">
              {activeView === 'overview' ? "Operations Overview" : "Booking Management"}
            </h1>
            <p className="text-muted-foreground mt-1 flex items-center gap-2">
              <Hotel className="h-4 w-4" /> {hotelData?.name || "Coastal Sands Retreat"} • {adminProfile?.role || "Manager"}
            </p>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input 
                placeholder="Search guests or dates..." 
                className="pl-12 h-12 w-full md:w-72 rounded-2xl border-none bg-white shadow-sm focus:ring-2 focus:ring-primary/20 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </header>

        {activeView === 'overview' && (
          <>
            {/* KPI Tiles */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {[
                { label: "Total Revenue", val: `$${totalRevenue.toLocaleString()}`, icon: <DollarSign />, trend: "+12.5%", color: "bg-emerald-500" },
                { label: "Confirmed Stays", val: activeBookingsCount.toString(), icon: <Calendar />, trend: "+5.2%", color: "bg-blue-500" },
                { label: "Occupancy Rate", val: occupancyRate, icon: <Hotel />, trend: "+2.1%", color: "bg-secondary" },
                { label: "Avg. Guest Rating", val: "4.9/5", icon: <UserIcon />, trend: "+0.3", color: "bg-amber-500" }
              ].map((kpi, i) => (
                <Card key={i} className="border-none shadow-sm rounded-[2rem] overflow-hidden bg-white hover:shadow-md transition-all duration-300">
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
                      <Badge className={b.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}>
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
          <div className="space-y-6">
            <Card className="border-none shadow-sm rounded-[2.5rem] bg-white p-10 overflow-hidden">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl">
                    {['all', 'confirmed', 'pending', 'cancelled'].map((status) => (
                      <Button
                        key={status}
                        variant={statusFilter === status ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setStatusFilter(status)}
                        className={cn("rounded-lg font-bold capitalize", statusFilter === status ? "bg-primary text-white" : "text-muted-foreground")}
                      >
                        {status}
                      </Button>
                    ))}
                  </div>
                </div>
                <Button variant="outline" className="rounded-xl gap-2 font-bold">
                  <Filter className="h-4 w-4" /> Advanced Filters
                </Button>
              </div>

              <div className="rounded-2xl border border-slate-100">
                <Table>
                  <TableHeader className="bg-slate-50/50">
                    <TableRow className="border-none">
                      <TableHead className="font-bold">Guest Details</TableHead>
                      <TableHead className="font-bold">Stay Dates</TableHead>
                      <TableHead className="font-bold">Room & Guests</TableHead>
                      <TableHead className="font-bold">Payment</TableHead>
                      <TableHead className="font-bold">Status</TableHead>
                      <TableHead className="font-bold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-20 text-muted-foreground">
                          No bookings found matching your criteria.
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
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <p className="font-medium text-slate-900">{format(new Date(b.checkInDate), 'MMM dd')} - {format(new Date(b.checkOutDate), 'MMM dd, yyyy')}</p>
                              <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" /> Booked {format(new Date(b.bookingDate), 'MMM dd')}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <p className="font-medium text-slate-900">{b.roomType}</p>
                              <p className="text-xs text-muted-foreground">{b.numberOfGuests} Guest(s)</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <p className="font-bold text-slate-900">${b.totalAmount}</p>
                              <Badge variant="outline" className={cn(
                                "text-[10px] py-0 px-2 font-bold",
                                b.paymentStatus === 'paid' ? "border-emerald-200 text-emerald-600 bg-emerald-50" : "border-amber-200 text-amber-600 bg-amber-50"
                              )}>
                                {b.paymentStatus || 'pending'}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={cn(
                              "border-none font-bold",
                              b.status === 'confirmed' ? "bg-emerald-50 text-emerald-600" : 
                              b.status === 'pending' ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600"
                            )}>
                              {b.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-slate-100">
                                  <MoreVertical className="h-4 w-4 text-slate-500" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-56 rounded-xl border-slate-100 shadow-xl p-2">
                                <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Actions</DropdownMenuLabel>
                                {b.status !== 'confirmed' && (
                                  <DropdownMenuItem 
                                    onClick={() => handleUpdateBookingStatus(b.id, 'confirmed')}
                                    className="rounded-lg text-emerald-600 font-bold focus:bg-emerald-50 focus:text-emerald-700"
                                  >
                                    <CheckCircle2 className="mr-2 h-4 w-4" /> Confirm Booking
                                  </DropdownMenuItem>
                                )}
                                {b.status !== 'cancelled' && (
                                  <DropdownMenuItem 
                                    onClick={() => handleUpdateBookingStatus(b.id, 'cancelled')}
                                    className="rounded-lg text-red-600 font-bold focus:bg-red-50 focus:text-red-700"
                                  >
                                    <XCircle className="mr-2 h-4 w-4" /> Cancel Booking
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => {
                                    setSelectedBooking(b);
                                    setIsEditModalOpen(true);
                                  }}
                                  className="rounded-lg font-bold"
                                >
                                  <Edit className="mr-2 h-4 w-4" /> Edit Details
                                </DropdownMenuItem>
                                <DropdownMenuItem className="rounded-lg font-bold">
                                  <FileText className="mr-2 h-4 w-4" /> Internal Notes
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
          </div>
        )}

        {/* Edit Booking Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="sm:max-w-[500px] rounded-[2.5rem] border-none shadow-2xl p-10">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-3xl font-headline font-bold text-primary">Edit Booking</DialogTitle>
              <DialogDescription className="text-muted-foreground">Modify details for {selectedBooking?.guestName}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSaveBookingEdit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="checkIn" className="font-bold text-xs uppercase tracking-widest text-slate-500">Check In</Label>
                  <Input id="checkIn" name="checkIn" type="date" defaultValue={selectedBooking?.checkInDate?.split('T')[0]} className="rounded-xl h-12" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="checkOut" className="font-bold text-xs uppercase tracking-widest text-slate-500">Check Out</Label>
                  <Input id="checkOut" name="checkOut" type="date" defaultValue={selectedBooking?.checkOutDate?.split('T')[0]} className="rounded-xl h-12" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="roomType" className="font-bold text-xs uppercase tracking-widest text-slate-500">Room Type</Label>
                <Select name="roomType" defaultValue={selectedBooking?.roomType}>
                  <SelectTrigger className="rounded-xl h-12">
                    <SelectValue placeholder="Select Room" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="Ocean Deluxe">Ocean Deluxe</SelectItem>
                    <SelectItem value="Garden Villa">Garden Villa</SelectItem>
                    <SelectItem value="Grand Suite">Grand Suite</SelectItem>
                    <SelectItem value="Junior Suite">Junior Suite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentStatus" className="font-bold text-xs uppercase tracking-widest text-slate-500">Payment Status</Label>
                <Select name="paymentStatus" defaultValue={selectedBooking?.paymentStatus || 'pending'}>
                  <SelectTrigger className="rounded-xl h-12">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes" className="font-bold text-xs uppercase tracking-widest text-slate-500">Internal Notes</Label>
                <Textarea id="notes" name="notes" placeholder="Add internal hotel notes here..." defaultValue={selectedBooking?.internalNotes} className="rounded-xl min-h-[100px]" />
              </div>
              <DialogFooter className="pt-6">
                <Button type="button" variant="ghost" onClick={() => setIsEditModalOpen(false)} className="rounded-xl">Cancel</Button>
                <Button type="submit" className="rounded-xl bg-primary text-white font-bold px-8">Save Changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
