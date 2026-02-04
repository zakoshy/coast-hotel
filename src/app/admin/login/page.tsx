
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useFirestore } from '@/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Lock, Mail, Palmtree, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Login Successful",
        description: "Welcome back to the management portal.",
      });
      router.push('/admin/dashboard');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: error.message || "Invalid credentials. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Initialize the AdminUser profile in Firestore
      await setDoc(doc(db, 'admin_users', userCredential.user.uid), {
        id: userCredential.user.uid,
        username: username || email.split('@')[0],
        email: email,
        hotelId: 'coastal-sands-1', // Linking to a default demo hotel
        role: 'manager'
      });

      // Ensure a demo hotel document exists
      await setDoc(doc(db, 'hotels', 'coastal-sands-1'), {
        id: 'coastal-sands-1',
        name: 'Coastal Sands Retreat',
        description: 'A luxury sanctuary on Diani Beach.',
        location: 'Diani Beach Road, Prime Beach Plot 1024, Kenya',
        contactNumber: '+254 712 345 678',
        email: 'info@coastalsandsretreat.com'
      }, { merge: true });

      toast({
        title: "Account Created",
        description: "Your administrator profile has been initialized.",
      });
      router.push('/admin/dashboard');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.message || "Could not create account.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-6">
      <Card className="w-full max-w-md border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
        <div className="bg-primary p-8 text-white text-center">
          <div className="inline-flex p-3 bg-white/10 rounded-2xl mb-4">
            <Palmtree className="h-8 w-8 text-secondary" />
          </div>
          <CardTitle className="text-3xl font-headline font-bold text-white">Management Portal</CardTitle>
          <CardDescription className="text-white/70 mt-2 font-medium">Coastal Sands Retreat • Diani</CardDescription>
        </div>
        <CardContent className="p-8 bg-white">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-muted/50 rounded-xl h-12">
              <TabsTrigger value="login" className="rounded-lg font-bold">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="rounded-lg font-bold">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Administrator Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="admin@coastalsands.com"
                      className="pl-12 h-14 rounded-xl border-primary/10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Security Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-12 pr-12 h-14 rounded-xl border-primary/10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-14 rounded-xl font-bold text-lg bg-primary hover:bg-primary/90" 
                  disabled={loading}
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : "Access Dashboard"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    placeholder="John Doe"
                    className="h-14 rounded-xl border-primary/10"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Administrator Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="admin@coastalsands.com"
                    className="h-14 rounded-xl border-primary/10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Create Password</Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pr-12 h-14 rounded-xl border-primary/10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-14 rounded-xl font-bold text-lg bg-secondary hover:bg-secondary/90 shadow-lg" 
                  disabled={loading}
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : "Register Account"}
                </Button>
                <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest font-bold mt-4">
                  Authorized Personnel Only
                </p>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
