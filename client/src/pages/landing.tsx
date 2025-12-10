import { Link } from 'wouter';
import { ArrowRight, CheckCircle2, Wallet, PieChart, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-xl">
              <Wallet className="w-6 h-6 text-primary" />
            </div>
            <span className="font-bold text-xl tracking-tight">M-Tracker</span>
          </div>
          <div className="flex gap-4">
            <Link href="/auth">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/auth">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Master Your Money with AI Intelligence
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Track expenses, get smart insights, and save more with M-Tracker. 
                The personal finance app that thinks like a financial advisor.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth">
                  <Button size="lg" className="h-12 px-8 text-lg gap-2">
                    Start Tracking Free <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="h-12 px-8 text-lg">
                  View Demo
                </Button>
              </div>
              
              <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>Secure & Private</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-purple-500/20 rounded-3xl blur-3xl" />
              <div className="relative bg-card border shadow-2xl rounded-3xl p-6 md:p-8">
                {/* Mock UI Preview */}
                <div className="space-y-6">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Balance</p>
                      <h3 className="text-3xl font-bold">₹24,500.00</h3>
                    </div>
                    <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                      +12.5%
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${i === 1 ? 'bg-orange-100 text-orange-600' : i === 2 ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                          {i === 1 ? <Wallet className="w-5 h-5" /> : i === 2 ? <PieChart className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">Transaction #{i}</p>
                          <p className="text-xs text-muted-foreground">Today, 12:30 PM</p>
                        </div>
                        <p className="font-semibold">-₹{i * 450}.00</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything you need to grow</h2>
            <p className="text-muted-foreground">Powerful features to help you take control of your financial future.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: <PieChart className="w-10 h-10 text-primary" />,
                title: "Smart Analytics",
                desc: "Visualize your spending patterns with interactive charts and breakdowns."
              },
              {
                icon: <Shield className="w-10 h-10 text-primary" />,
                title: "Bank-Grade Security",
                desc: "Your financial data is encrypted and secure. We prioritize your privacy."
              },
              {
                icon: <Wallet className="w-10 h-10 text-primary" />,
                title: "Budget Management",
                desc: "Set monthly budgets and get alerts before you overspend."
              }
            ].map((feature, i) => (
              <Card key={i} className="border-none shadow-lg bg-background/50 backdrop-blur-sm hover:translate-y-[-5px] transition-transform duration-300">
                <CardContent className="p-8">
                  <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// Helper component for the feature cards to avoid circular deps if Card is imported from ui
function Card({ children, className }: { children: React.ReactNode, className?: string }) {
  return <div className={`rounded-3xl border bg-card text-card-foreground ${className}`}>{children}</div>;
}

function CardContent({ children, className }: { children: React.ReactNode, className?: string }) {
  return <div className={className}>{children}</div>;
}
