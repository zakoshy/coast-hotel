
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
  ChevronDown
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from '@/components/ui/chart';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { useRouter } from 'next/navigation';
import { getAuth, signOut } from 'firebase/auth';

export default function AdminDashboard() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();

  // Fetch Admin User Profile to get hotelId
  const adminProfileRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'admin_users', user.uid);
  }, [db, user]);
  const { data: adminProfile } = useDoc(adminProfileRef);

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

  if (isUserLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
  if (!user) {
    if (typeof window !== 'undefined') router.push('/admin/login');
    return null;
  }

  // Calculate Mock KPIs if data is empty for demo
  const totalRevenue = revenueData?.reduce((acc, curr) => acc + curr.amount, 0) || 45230;
  const activeBookings = bookings?.filter(b => b.status === 'confirmed').length || 12;
  const occupancyRate = "78%";

  const chartData = [
    { name: 'Jan', revenue: 4000, bookings: 24 },
    { name: 'Feb', revenue: 3000, bookings: 18 },
    { name: 'Mar', revenue: 5000, bookings: 32 },
    { name: 'Apr', revenue: 4500, bookings: 28 },
    { name: 'May', revenue: 6000, bookings: 40 },
    { name: 'Jun', revenue: 5500, bookings: 35 },
  ];

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Sidebar Navigation */}
      <div className="fixed left-0 top-0 bottom-0 w-64 bg-primary text-white p-6 hidden lg:block">
        <div className="mb-12">
          <h2 className="text-2xl font-headline font-bold">COASTAL SANDS</h2>
          <p className="text-xs text-secondary font-bold tracking-widest uppercase">Admin Panel</p>
        </div>
        
        <nav className="space-y-4">
          <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10 bg-white/10 font-bold">
            <TrendingUp className="mr-3 h-5 w-5" /> Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10">
            <Calendar className="mr-3 h-5 w-5" /> Bookings
          </Button>
          <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10">
            <Hotel className="mr-3 h-5 w-5" /> Room Inventory
          </Button>
          <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10">
            <Users className="mr-3 h-5 w-5" /> Guests
          </Button>
          <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10">
            <DollarSign className="mr-3 h-5 w-5" /> Financials
          </Button>
        </nav>

        <div className="absolute bottom-8 left-6 right-6">
          <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10" onClick={handleLogout}>
            <LogOut className="mr-3 h-5 w-5" /> Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 p-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-headline font-bold text-primary">
              Welcome back, <span className="text-foreground">{adminProfile?.username || "Admin"}</span>
            </h1>
            <p className="text-muted-foreground">{hotelData?.name || "Coastal Sands Retreat"}</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input 
                placeholder="Search bookings..." 
                className="pl-10 h-11 w-64 rounded-full border border-primary/10 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <Button variant="ghost" size="icon" className="relative h-11 w-11 rounded-full bg-white shadow-sm">
              <Bell className="h-5 w-5 text-primary" />
              <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-secondary rounded-full border-2 border-white"></span>
            </Button>
          </div>
        </header>

        {/* KPI Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: "Total Revenue", val: `$${totalRevenue.toLocaleString()}`, icon: <DollarSign />, trend: "+12.5%", color: "bg-emerald-500" },
            { label: "Total Bookings", val: activeBookings.toString(), icon: <Calendar />, trend: "+5.2%", color: "bg-blue-500" },
            { label: "Occupancy Rate", val: occupancyRate, icon: <Hotel />, trend: "+2.1%", color: "bg-secondary" },
            { label: "Avg. Guest Stay", val: "4.2 Days", icon: <Users />, trend: "-1.0%", color: "bg-amber-500" }
          ].map((kpi, i) => (
            <Card key={i} className="border-none shadow-lg rounded-3xl overflow-hidden group hover:scale-[1.02] transition-all">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-2xl text-white ${kpi.color}`}>
                    {React.cloneElement(kpi.icon as React.ReactElement, { className: "h-6 w-6" })}
                  </div>
                  <Badge variant="outline" className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border-emerald-100">
                    {kpi.trend}
                  </Badge>
                </div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">{kpi.label}</p>
                <h3 className="text-3xl font-headline font-bold text-primary">{kpi.val}</h3>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts & Table */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Revenue Chart */}
          <Card className="lg:col-span-2 border-none shadow-xl rounded-[2.5rem] bg-white p-8">
            <CardHeader className="p-0 mb-8 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-headline font-bold">Revenue Performance</CardTitle>
                <p className="text-sm text-muted-foreground">Monthly breakdown of hotel income</p>
              </div>
              <Button variant="outline" size="sm" className="rounded-full">
                This Year <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </CardHeader>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#888'}} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorRev)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Recent Bookings List */}
          <Card className="lg:col-span-1 border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
            <CardHeader className="p-8 pb-0">
              <CardTitle className="text-2xl font-headline font-bold">Recent Inquiries</CardTitle>
              <p className="text-sm text-muted-foreground">Latest guest interactions</p>
            </CardHeader>
            <CardContent className="p-0">
              <div className="mt-6">
                {(bookings?.length ? bookings : [
                  { guestName: "Sarah Jenkins", roomType: "Ocean Deluxe", status: "confirmed", amount: 250 },
                  { guestName: "Omari Mwangi", roomType: "Garden Villa", status: "pending", amount: 450 },
                  { guestName: "Elena Rodriguez", roomType: "Grand Suite", status: "confirmed", amount: 850 }
                ]).map((booking, i) => (
                  <div key={i} className="flex items-center justify-between p-6 border-b border-primary/5 hover:bg-muted/10 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                        {booking.guestName[0]}
                      </div>
                      <div>
                        <p className="font-bold text-primary">{booking.guestName}</p>
                        <p className="text-xs text-muted-foreground">{booking.roomType}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">${booking.amount}</p>
                      <Badge className={booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none' : 'bg-amber-100 text-amber-700 hover:bg-amber-200 border-none'}>
                        {booking.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-6">
                <Button variant="ghost" className="w-full font-bold text-primary hover:text-secondary hover:bg-transparent">
                  View All Activity
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Loader2({ className }: { className?: string }) {
  return <Loader2Icon className={`animate-spin ${className}`} />;
}

import { Loader2 as Loader2Icon } from 'lucide-react';
