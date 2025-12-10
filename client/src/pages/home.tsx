import { useStore } from '@/lib/store';
import Layout from '@/components/layout';
import ExpenseForm from '@/components/expense-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, isSameMonth, parseISO } from 'date-fns';
import { DollarSign, TrendingUp, TrendingDown, Calendar, Download, Wallet, Plus, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function Home() {
  const expenses = useStore(state => state.expenses);
  const addExpense = useStore(state => state.addExpense);
  const user = useStore(state => state.user);

  const today = new Date();
  
  // Calculate totals
  const totalExpenses = expenses.reduce((sum, ex) => sum + ex.amount, 0);
  const monthlyExpenses = expenses
    .filter(ex => isSameMonth(parseISO(ex.date), today))
    .reduce((sum, ex) => sum + ex.amount, 0);
  
  const dailyExpenses = expenses
    .filter(ex => format(parseISO(ex.date), 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd'))
    .reduce((sum, ex) => sum + ex.amount, 0);

  const remainingBudget = (user?.budget || 0) - monthlyExpenses;
  const budgetProgress = user?.budget ? (monthlyExpenses / user.budget) * 100 : 0;

  const handleDownload = (formatType: 'csv' | 'pdf') => {
    // Mock download functionality
    const headers = ['Date', 'Description', 'Category', 'Amount'];
    const rows = expenses.map(ex => [
      format(parseISO(ex.date), 'yyyy-MM-dd'),
      ex.description,
      ex.category,
      ex.amount.toFixed(2)
    ]);
    
    if (formatType === 'csv') {
      const csvContent = "data:text/csv;charset=utf-8," 
        + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "m-tracker-expenses.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert("PDF Download feature would generate a PDF report here.");
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome, {user?.name?.split(' ')[0]}!</h1>
            <p className="text-muted-foreground">Here's your financial overview for today.</p>
          </div>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2 shadow-lg shadow-primary/25">
                  <Plus className="w-4 h-4" /> Add Expense
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Expense</DialogTitle>
                </DialogHeader>
                <ExpenseForm onSubmit={addExpense} />
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={() => handleDownload('csv')}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="shadow-sm hover:shadow-md transition-all duration-300 border-l-4 border-l-primary bg-gradient-to-br from-card to-secondary/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Spend</CardTitle>
              <div className="p-2 bg-primary/10 rounded-full">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">₹{monthlyExpenses.toFixed(2)}</div>
              <div className="mt-2 h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${budgetProgress > 90 ? 'bg-destructive' : 'bg-primary'}`} 
                  style={{ width: `${Math.min(budgetProgress, 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {budgetProgress.toFixed(0)}% of monthly budget used
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-all duration-300 border-l-4 border-l-green-500 bg-gradient-to-br from-card to-green-500/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Remaining Budget</CardTitle>
              <div className="p-2 bg-green-500/10 rounded-full">
                <Wallet className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold tracking-tight ${remainingBudget < 0 ? 'text-destructive' : 'text-foreground'}`}>
                ₹{remainingBudget.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                {remainingBudget > 0 ? (
                  <span className="text-green-600 flex items-center">
                    On track <ArrowUpRight className="w-3 h-3 ml-1" />
                  </span>
                ) : (
                  <span className="text-destructive">Over budget</span>
                )}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-all duration-300 border-l-4 border-l-orange-500 bg-gradient-to-br from-card to-orange-500/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Today's Spend</CardTitle>
              <div className="p-2 bg-orange-500/10 rounded-full">
                <TrendingUp className="h-4 w-4 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">₹{dailyExpenses.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-2">
                Daily activity overview
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Main List */}
          <Card className="md:col-span-2 shadow-sm border-none bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border bg-card overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenses.slice().reverse().slice(0, 5).map((expense) => (
                      <TableRow key={expense.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                              {expense.description[0]}
                            </div>
                            {expense.description}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                            {expense.category}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {format(parseISO(expense.date), 'MMM dd')}
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          ₹{expense.amount.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                    {expenses.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                          <div className="flex flex-col items-center gap-2">
                            <Wallet className="w-8 h-8 text-muted-foreground/50" />
                            <p>No expenses yet. Add one to get started!</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats / Info */}
          <Card className="shadow-sm bg-primary text-primary-foreground border-none">
            <CardHeader>
              <CardTitle className="text-lg opacity-90">Quick Tip</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-primary-foreground/90 leading-relaxed">
                "Tracking small expenses is just as important as the big ones. A daily coffee adds up to ₹1,500 a month!"
              </p>
              <div className="mt-6 pt-6 border-t border-primary-foreground/20">
                 <div className="text-sm font-medium opacity-75 mb-2">Total Lifetime Spend</div>
                 <div className="text-2xl font-bold">₹{totalExpenses.toFixed(2)}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
