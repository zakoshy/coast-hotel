
'use client';

import React from 'react';
import { useUser, useFirestore, useCollection, useDoc, useMemoFirebase } from '@/firebase';
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
  User as UserIcon
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

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export default function AdminDashboard() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();

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

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    router.push('/admin/login');
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

  // Handle case where document doesn't exist yet
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

  // Calculate KPIs
  const totalRevenue = revenueData?.reduce((acc, curr) => acc + curr.amount, 0) || 45230;
  const activeBookings = bookings?.filter(b => b.status === 'confirmed').length || 12;
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
          <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10 bg-white/5 rounded-xl h-12 font-bold">
            <LayoutDashboard className="mr-3 h-5 w-5 text-secondary" /> Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-start text-white/60 hover:bg-white/10 hover:text-white rounded-xl h-12">
            <Calendar className="mr-3 h-5 w-5" /> Bookings
          </Button>
          <Button variant="ghost" className="w-full justify-start text-white/60 hover:bg-white/10 hover:text-white rounded-xl h-12">
            <Hotel className="mr-3 h-5 w-5" /> Room Inventory
          </Button>
          <Button variant="ghost" className="w-full justify-start text-white/60 hover:bg-white/10 hover:text-white rounded-xl h-12">
            <Users className="mr-3 h-5 w-5" /> Guest Relations
          </Button>
          <Button variant="ghost" className="w-full justify-start text-white/60 hover:bg-white/10 hover:text-white rounded-xl h-12">
            <TrendingUp className="mr-3 h-5 w-5" /> Analytics
          </Button>
          
          <div className="pt-8">
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-4 ml-2">System</p>
            <Button variant="ghost" className="w-full justify-start text-white/60 hover:bg-white/10 hover:text-white rounded-xl h-12">
              <Settings className="mr-3 h-5 w-5" /> Settings
            </Button>
          </div>
        </nav>

        {/* Profile Section in Sidebar */}
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
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-headline font-bold text-[#0f172a]">
              Operations <span className="text-primary italic">Overview</span>
            </h1>
            <p className="text-muted-foreground mt-1 flex items-center gap-2">
              <Hotel className="h-4 w-4" /> {hotelData?.name || "Coastal Sands Retreat"} • {adminProfile?.role || "Manager"}
            </p>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input 
                placeholder="Search global records..." 
                className="pl-12 h-12 w-full md:w-72 rounded-2xl border-none bg-white shadow-sm focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl bg-white shadow-sm relative">
              <Bell className="h-5 w-5 text-slate-600" />
              <span className="absolute top-3 right-3 h-2.5 w-2.5 bg-secondary rounded-full border-2 border-white"></span>
            </Button>
          </div>
        </header>

        {/* KPI Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Total Revenue", val: `$${totalRevenue.toLocaleString()}`, icon: <DollarSign />, trend: "+12.5%", color: "bg-emerald-500" },
            { label: "Confirmed Stays", val: activeBookings.toString(), icon: <Calendar />, trend: "+5.2%", color: "bg-blue-500" },
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

        {/* Charts & Table */}
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Revenue Chart */}
          <Card className="lg:col-span-2 border-none shadow-sm rounded-[2.5rem] bg-white p-10">
            <CardHeader className="p-0 mb-10 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-headline font-bold text-slate-900">Revenue Performance</CardTitle>
                <p className="text-sm text-muted-foreground">Comparative monthly analysis</p>
              </div>
              <Button variant="outline" size="sm" className="rounded-xl border-slate-200">
                FY 2024 <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </CardHeader>
            <div className="h-[400px] w-full">
              <ChartContainer config={chartConfig}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 12}} 
                    dy={10} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 12}} 
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorRev)" 
                  />
                </AreaChart>
              </ChartContainer>
            </div>
          </Card>

          {/* Recent Bookings List */}
          <Card className="lg:col-span-1 border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden flex flex-col">
            <CardHeader className="p-10 pb-0">
              <CardTitle className="text-2xl font-headline font-bold text-slate-900">Recent Inquiries</CardTitle>
              <p className="text-sm text-muted-foreground">Action required notifications</p>
            </CardHeader>
            <CardContent className="p-0 flex-grow">
              <div className="mt-8">
                {(bookings?.length ? bookings : [
                  { guestName: "Sarah Jenkins", roomType: "Ocean Deluxe", status: "confirmed", amount: 250 },
                  { guestName: "Omari Mwangi", roomType: "Garden Villa", status: "pending", amount: 450 },
                  { guestName: "Elena Rodriguez", roomType: "Grand Suite", status: "confirmed", amount: 850 },
                  { guestName: "John Doe", roomType: "Junior Suite", status: "pending", amount: 350 }
                ]).map((booking, i) => (
                  <div key={i} className="flex items-center justify-between p-8 border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center gap-5">
                      <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center font-bold text-primary text-lg">
                        {booking.guestName[0]}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 leading-none mb-1">{booking.guestName}</p>
                        <p className="text-xs text-muted-foreground font-medium">{booking.roomType}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900 mb-1">${booking.amount}</p>
                      <Badge className={booking.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600 border-none' : 'bg-amber-50 text-amber-600 border-none'}>
                        {booking.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <div className="p-10 border-t border-slate-50">
              <Button variant="ghost" className="w-full font-bold text-primary hover:bg-primary/5 rounded-xl h-12">
                Manage All Bookings
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
