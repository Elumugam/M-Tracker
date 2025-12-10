import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Layout from '@/components/layout';
import { useStore } from '@/lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { User, Bell, Shield, Wallet } from 'lucide-react';

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  budget: z.coerce.number().min(0, "Budget must be positive"),
});

type ProfileValues = z.infer<typeof profileSchema>;

export default function Settings() {
  const { user, updateProfile } = useStore();
  const { toast } = useToast();

  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      budget: user?.budget || 0,
    },
  });

  const onSubmit = (data: ProfileValues) => {
    updateProfile(data);
    toast({
      title: "Settings Updated",
      description: "Your profile information has been saved successfully.",
    });
  };

  return (
    <Layout>
      <div className="space-y-8 max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences.</p>
        </div>

        <div className="grid gap-8">
          <Card className="shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                <CardTitle>Profile Information</CardTitle>
              </div>
              <CardDescription>Update your personal details and monthly budget goals.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input {...field} disabled className="bg-muted" />
                          </FormControl>
                          <p className="text-[0.8rem] text-muted-foreground">Email cannot be changed.</p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="budget"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Monthly Budget (₹)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Wallet className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input type="number" className="pl-8" {...field} />
                            </div>
                          </FormControl>
                          <p className="text-[0.8rem] text-muted-foreground">
                            This is used to calculate your remaining budget in the dashboard.
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit">Save Changes</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card className="shadow-sm opacity-60">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                <CardTitle>Notifications</CardTitle>
              </div>
              <CardDescription>Configure how you receive alerts (Coming Soon).</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">Budget Alerts</label>
                    <p className="text-xs text-muted-foreground">Get notified when you exceed 80% of budget</p>
                  </div>
                  <Button variant="outline" size="sm" disabled>Enabled</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm opacity-60">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                <CardTitle>Security</CardTitle>
              </div>
              <CardDescription>Manage your password and security settings (Coming Soon).</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" disabled>Change Password</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
