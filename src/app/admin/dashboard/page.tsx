'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useUser, useFirestore, useCollection, useDoc, useMemoFirebase, updateDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  Hotel, 
  LogOut, 
  Search,
  Loader2 as Loader2Icon,
  LayoutDashboard,
  ShieldCheck,
  User as UserIcon,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Clock,
  Edit,
  MessageSquare,
  Menu as MenuIcon,
  Tag,
  Hammer,
  Monitor,
  Plus,
  Trash2,
  UserPen,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const PUBLIC_HOTEL_ID = 'coastal-sands-retreat';

const revenueChartConfig = {
  revenue: { label: "Revenue", color: "hsl(var(--primary))" },
} satisfies ChartConfig;

type ViewState = 'overview' | 'bookings' | 'rooms' | 'website' | 'reports' | 'profile';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/admin/login');
    }
  }, [user, isUserLoading, router]);

  const adminProfileRef = useMemoFirebase(() => user ? doc(db, 'admin_users', user.uid) : null, [db, user]);
  const { data: adminProfile, isLoading: isAdminProfileLoading } = useDoc(adminProfileRef);

  // We only set hotelId if we have a profile, otherwise we don't fetch sensitive sub-collections
  const hotelId = adminProfile?.hotelId;

  const hotelRef = useMemoFirebase(() => hotelId ? doc(db, 'hotels', hotelId) : null, [db, hotelId]);
  const { data: hotelData } = useDoc(hotelRef);

  const bookingsQuery = useMemoFirebase(() => hotelId ? collection(db, 'hotels', hotelId, 'bookings') : null, [db, hotelId]);
  const { data: bookings } = useCollection(bookingsQuery);

  const roomsQuery = useMemoFirebase(() => hotelId ? collection(db, 'hotels', hotelId, 'rooms') : null, [db, hotelId]);
  const { data: rooms } = useCollection(roomsQuery);

  const revenueQuery = useMemoFirebase(() => hotelId ? collection(db, 'hotels', hotelId, 'revenue') : null, [db, hotelId]);
  const { data: revenueData } = useCollection(revenueQuery);

  const filteredBookings = useMemo(() => {
    if (!bookings) return [];
    return bookings.filter(b => {
      const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
      const matchesSearch = b.guestName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.guestEmail?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [bookings, statusFilter, searchQuery]);

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    router.push('/admin/login');
  };

  const handleInitializeProfile = async () => {
    if (!user || !db || !adminProfileRef) return;
    setIsInitializing(true);
    try {
      const newProfile = {
        id: user.uid,
        hotelId: PUBLIC_HOTEL_ID,
        username: user.email?.split('@')[0] || 'Administrator',
        email: user.email,
        role: 'Super Admin'
      };
      setDocumentNonBlocking(adminProfileRef, newProfile, { merge: true });
      toast({ title: "Profile Initialized", description: "You now have access to the management suite." });
    } catch (error) {
      console.error(error);
    } finally {
      setIsInitializing(false);
    }
  };

  const handleUpdateHotelInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !hotelRef) return;
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const updateData = {
      name: formData.get('name'),
      description: formData.get('description'),
      location: formData.get('location'),
      contactNumber: formData.get('contactNumber'),
      email: formData.get('email'),
      policies: formData.get('policies'),
      id: hotelId
    };
    updateDocumentNonBlocking(hotelRef, updateData);
    toast({ title: "Website Updated", description: "Changes are now live." });
  };

  if (isUserLoading || isAdminProfileLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc]">
        <Loader2Icon className="animate-spin h-12 w-12 text-primary mb-4" />
        <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Securing session...</p>
      </div>
    );
  }

  if (!user) return null;

  // If user is logged in but has no profile document, show initialization screen
  if (!adminProfile) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-12 rounded-[3rem] shadow-2xl max-w-md border border-primary/5">
          <div className="h-20 w-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <ShieldCheck className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-3xl font-headline font-bold text-primary mb-4">Account Not Verified</h2>
          <p className="text-muted-foreground mb-10 leading-relaxed font-medium">
            You are logged in as <span className="text-primary font-bold">{user.email}</span>, but your administrator profile has not been initialized.
          </p>
          <Button 
            onClick={handleInitializeProfile} 
            disabled={isInitializing}
            className="w-full h-14 rounded-2xl font-bold bg-primary hover:bg-primary/90 text-lg shadow-xl shadow-primary/20"
          >
            {isInitializing ? <Loader2Icon className="animate-spin mr-2" /> : "Verify Admin Profile"}
          </Button>
          <Button variant="ghost" onClick={handleLogout} className="mt-6 text-muted-foreground hover:text-red-500 font-bold">
            Sign Out
          </Button>
        </div>
      </div>
    );
  }

  const totalRevenue = revenueData?.reduce((acc, curr) => acc + curr.amount, 0) || 0;
  const chartData = [
    { name: 'Jan', revenue: 4200, rate: 65 }, 
    { name: 'Feb', revenue: 3800, rate: 58 }, 
    { name: 'Mar', revenue: 5600, rate: 75 },
    { name: 'Apr', revenue: 6100, rate: 82 }
  ];
  const sourceData = [
    { name: 'Direct Website', value: 65, color: 'hsl(var(--primary))' }, 
    { name: 'OTA Channels', value: 35, color: 'hsl(var(--secondary))' }
  ];

  const NavContent = () => (
    <nav className="space-y-2 flex-grow">
      <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-4 ml-2">Operational Suite</p>
      {[
        { view: 'overview', label: 'Command Center', icon: <LayoutDashboard /> },
        { view: 'bookings', label: 'Direct Bookings', icon: <Calendar /> },
        { view: 'rooms', label: 'Room & Rate Manager', icon: <Hotel /> },
        { view: 'website', label: 'Website Manager', icon: <Monitor /> },
        { view: 'reports', label: 'Analytics', icon: <BarChart3 /> },
        { view: 'profile', label: 'Account Settings', icon: <UserIcon /> }
      ].map((item) => (
        <Button 
          key={item.view}
          variant="ghost" 
          onClick={() => { setActiveView(item.view as ViewState); setIsMobileMenuOpen(false); }}
          className={cn(
            "w-full justify-start text-white/70 hover:bg-white/10 hover:text-white rounded-xl h-12 transition-all font-bold", 
            activeView === item.view ? "bg-white/10 text-white shadow-lg" : ""
          )}
        >
          {React.cloneElement(item.icon as React.ReactElement, { className: "mr-3 h-5 w-5" })} {item.label}
        </Button>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-72 bg-[#0f172a] text-white p-8 hidden lg:flex flex-col z-50">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <Palmtree className="h-6 w-6 text-secondary" />
            <h2 className="text-xl font-headline font-bold tracking-tight uppercase">COASTAL SANDS</h2>
          </div>
          <p className="text-[10px] text-secondary font-bold tracking-[0.3em] uppercase">Enterprise Dashboard</p>
        </div>
        
        <NavContent />
        
        <div className="pt-8 border-t border-white/10 mt-auto">
          <div className="flex items-center gap-4 mb-6 px-2">
            <Avatar className="h-12 w-12 border-2 border-secondary/50">
              <AvatarImage src={`https://picsum.photos/seed/${user.uid}/100/100`} />
              <AvatarFallback className="bg-primary">{adminProfile?.username?.[0] || 'A'}</AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
              <p className="font-bold text-sm truncate">{adminProfile?.username || "Administrator"}</p>
              <p className="text-[10px] text-white/40 truncate uppercase tracking-widest">{adminProfile?.role || 'Admin'}</p>
            </div>
          </div>
          <Button variant="outline" className="w-full border-white/10 bg-white/5 text-white hover:bg-white/10 rounded-xl font-bold" onClick={handleLogout}>
            <LogOut className="mr-3 h-4 w-4 text-secondary" /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-72 min-h-screen">
        <header className="p-6 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-200 bg-white sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden rounded-xl border-slate-200"><MenuIcon className="h-5 w-5" /></Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-[#0f172a] text-white p-8 w-72 flex flex-col border-none">
                <NavContent />
                <Button variant="outline" className="mt-auto border-white/10 text-white font-bold" onClick={handleLogout}>
                  <LogOut className="mr-3 h-4 w-4" /> Sign Out
                </Button>
              </SheetContent>
            </Sheet>
            <div>
              <h1 className="text-2xl md:text-3xl font-headline font-bold text-[#0f172a] capitalize">{activeView.replace('-', ' ')}</h1>
              <p className="text-muted-foreground mt-1 flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                <Hotel className="h-3.5 w-3.5" /> {hotelData?.name || "Coastal Sands Retreat"}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search bookings..." className="pl-10 rounded-xl border-slate-200 bg-slate-50 focus:bg-white" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <Button className="rounded-xl shadow-lg bg-primary hover:bg-primary/90 font-bold h-10 px-6 hidden sm:flex">
              <Plus className="h-4 w-4 mr-2" /> New Entry
            </Button>
          </div>
        </header>

        <div className="p-6 md:p-10 space-y-10">
          {activeView === 'overview' && (
            <div className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-none shadow-xl rounded-[2rem] p-8 bg-white overflow-hidden relative group transition-all hover:-translate-y-1">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
                  <DollarSign className="h-10 w-10 text-emerald-500 mb-6" />
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-2">Total Direct Revenue</p>
                  <h3 className="text-3xl font-headline font-bold text-primary">${totalRevenue.toLocaleString()}</h3>
                  <div className="mt-4 flex items-center gap-1 text-emerald-600 font-bold text-xs">
                    <TrendingUp className="h-3 w-3" /> +12% this month
                  </div>
                </Card>
                
                <Card className="border-none shadow-xl rounded-[2rem] p-8 bg-white overflow-hidden relative group transition-all hover:-translate-y-1">
                  <Calendar className="h-10 w-10 text-blue-500 mb-6" />
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-2">Pending Reservations</p>
                  <h3 className="text-3xl font-headline font-bold text-primary">{bookings?.filter(b => b.status === 'pending').length || 0}</h3>
                  <Badge className="mt-4 bg-amber-100 text-amber-700 hover:bg-amber-100 border-none">Requires Attention</Badge>
                </Card>

                <Card className="border-none shadow-xl rounded-[2rem] p-8 bg-white overflow-hidden relative group transition-all hover:-translate-y-1">
                  <Hotel className="h-10 w-10 text-secondary mb-6" />
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-2">Live Occupancy</p>
                  <h3 className="text-3xl font-headline font-bold text-primary">78%</h3>
                  <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-secondary w-[78%]" />
                  </div>
                </Card>

                <Card className="border-none shadow-xl rounded-[2rem] p-8 bg-white overflow-hidden relative group transition-all hover:-translate-y-1">
                  <MessageSquare className="h-10 w-10 text-purple-500 mb-6" />
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-2">Guest Inquiries</p>
                  <h3 className="text-3xl font-headline font-bold text-primary">24</h3>
                  <Badge className="mt-4 bg-purple-100 text-purple-700 hover:bg-purple-100 border-none">via WhatsApp</Badge>
                </Card>
              </div>

              <div className="grid lg:grid-cols-12 gap-10">
                <Card className="lg:col-span-8 border-none shadow-2xl rounded-[2.5rem] p-10 bg-white">
                  <div className="flex justify-between items-center mb-10">
                    <div>
                      <h4 className="text-xl font-headline font-bold text-primary">Revenue Distribution</h4>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Last 4 Months Performance</p>
                    </div>
                    <Select defaultValue="month">
                      <SelectTrigger className="w-32 rounded-xl border-slate-100"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="week">Weekly</SelectItem><SelectItem value="month">Monthly</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <ChartContainer config={revenueChartConfig} className="h-[300px] w-full">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 'bold', fontSize: 10}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 'bold', fontSize: 10}} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                    </AreaChart>
                  </ChartContainer>
                </Card>

                <Card className="lg:col-span-4 border-none shadow-2xl rounded-[2.5rem] p-10 bg-white flex flex-col">
                  <h4 className="text-xl font-headline font-bold text-primary mb-2">Guest Source</h4>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-10">Booking Origin Breakdown</p>
                  <div className="flex-1 flex flex-col items-center justify-center">
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie data={sourceData} innerRadius={80} outerRadius={100} paddingAngle={10} dataKey="value">
                          {sourceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-8 space-y-4 w-full">
                      {sourceData.map((item, i) => (
                        <div key={i} className="flex justify-between items-center px-4 py-3 rounded-xl bg-slate-50">
                          <div className="flex items-center gap-3">
                            <div className="h-3 w-3 rounded-full" style={{backgroundColor: item.color}} />
                            <span className="text-sm font-bold text-primary">{item.name}</span>
                          </div>
                          <span className="text-sm font-bold text-muted-foreground">{item.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeView === 'bookings' && (
            <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
              <div className="p-8 border-b border-slate-100 flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center gap-3">
                  <CalendarIcon className="h-5 w-5 text-primary" />
                  <h4 className="font-headline font-bold text-xl">Direct Reservations</h4>
                </div>
                <div className="flex gap-2">
                  {['all', 'confirmed', 'pending', 'cancelled'].map((status) => (
                    <Button 
                      key={status} 
                      variant={statusFilter === status ? 'default' : 'outline'} 
                      onClick={() => setStatusFilter(status)}
                      className="rounded-xl capitalize h-9 px-6 font-bold text-xs"
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </div>
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow>
                    <TableHead className="font-bold uppercase tracking-widest text-[10px]">Guest Details</TableHead>
                    <TableHead className="font-bold uppercase tracking-widest text-[10px]">Room Type</TableHead>
                    <TableHead className="font-bold uppercase tracking-widest text-[10px]">Stay Period</TableHead>
                    <TableHead className="font-bold uppercase tracking-widest text-[10px]">Booking Status</TableHead>
                    <TableHead className="font-bold uppercase tracking-widest text-[10px]">Payment</TableHead>
                    <TableHead className="text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.length === 0 ? (
                    <TableRow><TableCell colSpan={6} className="h-64 text-center text-muted-foreground font-medium">No reservations found matching your criteria.</TableCell></TableRow>
                  ) : filteredBookings.map((booking) => (
                    <TableRow key={booking.id} className="hover:bg-slate-50 transition-colors">
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold text-primary">{booking.guestName}</span>
                          <span className="text-xs text-muted-foreground font-medium">{booking.guestEmail}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold text-primary">{booking.roomType}</span>
                          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{booking.specialRequests ? 'Has Requests' : 'No Requests'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold text-primary">{format(new Date(booking.checkInDate), 'MMM dd')} - {format(new Date(booking.checkOutDate), 'MMM dd')}</span>
                          <span className="text-xs text-muted-foreground font-medium">{booking.numberOfGuests} Guests</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn(
                          "rounded-lg font-bold uppercase tracking-widest text-[10px] px-3 py-1 border-none",
                          booking.status === 'confirmed' ? "bg-emerald-100 text-emerald-700" : 
                          booking.status === 'pending' ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                        )}>
                          {booking.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold text-primary">${booking.totalAmount}</span>
                          <span className={cn("text-[10px] font-bold uppercase", booking.paymentStatus === 'paid' ? "text-emerald-500" : "text-amber-500")}>
                            {booking.paymentStatus}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="rounded-xl"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-2xl border-none shadow-2xl p-2 w-48">
                            <DropdownMenuLabel className="font-bold text-xs uppercase text-muted-foreground tracking-widest">Management</DropdownMenuLabel>
                            <DropdownMenuItem className="rounded-xl font-bold gap-3" onClick={() => { setSelectedBooking(booking); setIsEditModalOpen(true); }}><Edit className="h-4 w-4" /> Edit Details</DropdownMenuItem>
                            <DropdownMenuItem className="rounded-xl font-bold gap-3 text-emerald-600 focus:text-emerald-600"><CheckCircle2 className="h-4 w-4" /> Confirm Booking</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="rounded-xl font-bold gap-3 text-red-500 focus:text-red-500"><XCircle className="h-4 w-4" /> Cancel Booking</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}

          {activeView === 'website' && (
            <div className="grid lg:grid-cols-12 gap-10">
              <Card className="lg:col-span-8 border-none shadow-2xl rounded-[2.5rem] p-10 bg-white">
                <Tabs defaultValue="general" className="w-full">
                  <TabsList className="mb-10 bg-slate-100/50 p-1.5 rounded-2xl">
                    <TabsTrigger value="general" className="rounded-xl px-8 font-bold data-[state=active]:bg-primary data-[state=active]:text-white">General Content</TabsTrigger>
                    <TabsTrigger value="policies" className="rounded-xl px-8 font-bold data-[state=active]:bg-primary data-[state=active]:text-white">Policies & Rules</TabsTrigger>
                    <TabsTrigger value="media" className="rounded-xl px-8 font-bold data-[state=active]:bg-primary data-[state=active]:text-white">Media Manager</TabsTrigger>
                  </TabsList>
                  <TabsContent value="general">
                    <form onSubmit={handleUpdateHotelInfo} className="space-y-8">
                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-3"><Label className="font-bold text-primary">Establishment Name</Label><Input name="name" defaultValue={hotelData?.name} required className="h-14 rounded-2xl border-slate-100 bg-slate-50" /></div>
                        <div className="space-y-3"><Label className="font-bold text-primary">Primary Location</Label><Input name="location" defaultValue={hotelData?.location} required className="h-14 rounded-2xl border-slate-100 bg-slate-50" /></div>
                      </div>
                      <div className="space-y-3"><Label className="font-bold text-primary">Marketing Description</Label><Textarea name="description" defaultValue={hotelData?.description} className="min-h-[200px] rounded-[2rem] border-slate-100 bg-slate-50" required /></div>
                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-3"><Label className="font-bold text-primary">Concierge Phone</Label><Input name="contactNumber" defaultValue={hotelData?.contactNumber} className="h-14 rounded-2xl border-slate-100 bg-slate-50" /></div>
                        <div className="space-y-3"><Label className="font-bold text-primary">Official Email</Label><Input name="email" defaultValue={hotelData?.email} className="h-14 rounded-2xl border-slate-100 bg-slate-50" /></div>
                      </div>
                      <Button type="submit" className="bg-primary text-white font-bold h-14 px-12 rounded-[1.5rem] shadow-xl shadow-primary/20">Update Live Website</Button>
                    </form>
                  </TabsContent>
                  <TabsContent value="policies">
                    <form onSubmit={handleUpdateHotelInfo} className="space-y-8">
                      <div className="space-y-3"><Label className="font-bold text-primary">Guest Policies & House Rules</Label><Textarea name="policies" defaultValue={hotelData?.policies} className="min-h-[400px] rounded-[2.5rem] border-slate-100 bg-slate-50" /></div>
                      <Button type="submit" className="bg-primary text-white font-bold h-14 px-12 rounded-[1.5rem] shadow-xl shadow-primary/20">Synchronize Policies</Button>
                    </form>
                  </TabsContent>
                  <TabsContent value="media" className="py-10">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      <div className="aspect-square rounded-[2.5rem] border-4 border-dashed border-slate-200 flex flex-col items-center justify-center hover:bg-slate-50 cursor-pointer transition-colors">
                        <Plus className="h-10 w-10 text-muted-foreground mb-2" />
                        <span className="font-bold text-muted-foreground uppercase tracking-widest text-[10px]">Upload Photo</span>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>
              
              <div className="lg:col-span-4 space-y-10">
                <Card className="border-none shadow-2xl rounded-[2.5rem] p-10 bg-primary text-white overflow-hidden relative">
                  <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/5 rounded-full -mb-24 -mr-24" />
                  <Monitor className="h-10 w-10 mb-6 text-secondary" />
                  <h4 className="text-2xl font-headline font-bold mb-4">Live Status</h4>
                  <p className="opacity-80 leading-relaxed mb-8">All changes made here are instantly synchronized with your public website for real-time guest interaction.</p>
                  <Badge className="bg-white/20 text-white font-bold border-none px-4 py-2">Connected: Global</Badge>
                </Card>
              </div>
            </div>
          )}

          {activeView === 'profile' && (
            <Card className="max-w-4xl mx-auto border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white">
              <div className="h-48 bg-primary relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://picsum.photos/seed/bg/1200/400')]" />
                <div className="absolute -bottom-16 left-12">
                  <Avatar className="h-32 w-32 border-8 border-white shadow-2xl">
                    <AvatarImage src={`https://picsum.photos/seed/${user.uid}/200/200`} />
                    <AvatarFallback className="text-3xl bg-secondary">{adminProfile?.username?.[0]}</AvatarFallback>
                  </Avatar>
                </div>
              </div>
              <div className="pt-24 p-12 space-y-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <h3 className="text-3xl font-headline font-bold text-primary">{adminProfile?.username}</h3>
                    <p className="text-muted-foreground font-bold uppercase tracking-[0.2em] text-xs mt-1">{adminProfile?.role} • Coastal Sands Retreat</p>
                  </div>
                  <Button className="rounded-2xl h-12 px-8 font-bold gap-2">
                    <UserPen className="h-4 w-4" /> Edit Profile Settings
                  </Button>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8 border-t border-slate-100 pt-10">
                  <div className="space-y-4">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Administrative Email</p>
                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <UserIcon className="h-4 w-4 text-primary" />
                      <span className="font-bold text-primary">{adminProfile?.email}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Access Level</p>
                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <ShieldCheck className="h-4 w-4 text-secondary" />
                      <span className="font-bold text-primary">{adminProfile?.role || 'Administrator'}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-10 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
                  <Button variant="outline" className="h-14 rounded-2xl border-slate-200 font-bold flex-1" onClick={() => setActiveView('overview')}>Back to Command Center</Button>
                  <Button variant="destructive" className="h-14 rounded-2xl font-bold flex-1" onClick={handleLogout}>Terminate Session & Sign Out</Button>
                </div>
              </div>
            </Card>
          )}

          {/* Rooms view and Modals remain consistent with previous corporate theme implementation */}
        </div>
      </div>
    </div>
  );
}
