import { useStore } from '@/lib/store';
import Layout from '@/components/layout';
import ExpenseForm from '@/components/expense-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, isSameMonth, parseISO } from 'date-fns';
import { DollarSign, TrendingUp, TrendingDown, Calendar, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Overview of your financial activity.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleDownload('csv')}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" onClick={() => handleDownload('pdf')}>
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalExpenses.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Lifetime spend</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Spend</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{monthlyExpenses.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">For {format(today, 'MMMM')}</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Daily Spend</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{dailyExpenses.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Today's activity</p>
            </CardContent>
          </Card>

          <Card className={`shadow-sm hover:shadow-md transition-shadow ${remainingBudget < 0 ? 'border-destructive/50 bg-destructive/5' : ''}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Remaining Budget</CardTitle>
              <TrendingDown className={`h-4 w-4 ${remainingBudget < 0 ? 'text-destructive' : 'text-muted-foreground'}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${remainingBudget < 0 ? 'text-destructive' : 'text-green-600'}`}>
                ₹{remainingBudget.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">From ₹{user?.budget} limit</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 md:grid-cols-7">
          {/* Main List */}
          <Card className="md:col-span-4 lg:col-span-5 shadow-sm">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.slice().reverse().slice(0, 5).map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell className="font-medium">
                        {format(parseISO(expense.date), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>{expense.description}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                          {expense.category}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        ₹{expense.amount.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                  {expenses.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        No expenses yet. Add one to get started!
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Quick Add Form */}
          <Card className="md:col-span-3 lg:col-span-2 shadow-sm border-primary/10">
            <CardHeader className="bg-primary/5 pb-4">
              <CardTitle className="text-lg text-primary">Add Expense</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ExpenseForm onSubmit={addExpense} />
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
