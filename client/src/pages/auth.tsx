import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocation } from 'wouter';
import { Wallet, ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const authSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().optional(),
});

type AuthValues = z.infer<typeof authSchema>;

export default function Auth() {
  const [, setLocation] = useLocation();
  const login = useStore(state => state.login);
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<AuthValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: '',
      password: '',
      name: '',
    },
  });

  const onSubmit = async (data: AuthValues) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      login(data.name || data.email.split('@')[0], data.email);
      setLocation('/');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-secondary/30 rounded-full blur-3xl opacity-50" />
      
      <div className="w-full max-w-md z-10">
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30 mb-4">
            <Wallet className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome to M-Tracker</h1>
          <p className="text-muted-foreground">Smart financial tracking for everyone</p>
        </div>

        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm dark:bg-card/50">
          <CardHeader>
            <CardTitle className="text-xl">
              {activeTab === 'login' ? 'Sign In' : 'Create Account'}
            </CardTitle>
            <CardDescription>
              {activeTab === 'login' 
                ? 'Enter your credentials to access your account' 
                : 'Enter your details to create a new account'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'login' | 'signup')} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {activeTab === 'signup' && (
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="john@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full font-bold" disabled={isLoading}>
                    {isLoading ? (
                      <span className="flex items-center gap-2">Processing...</span>
                    ) : (
                      <span className="flex items-center gap-2">
                        {activeTab === 'login' ? 'Sign In' : 'Create Account'}
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    )}
                  </Button>
                </form>
              </Form>
            </Tabs>
          </CardContent>
        </Card>
        
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/50 text-accent-foreground text-sm font-medium border border-accent">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Insights Included</span>
          </div>
        </div>
      </div>
    </div>
  );
}
