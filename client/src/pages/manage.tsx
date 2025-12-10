import { useState } from 'react';
import { useStore, Expense } from '@/lib/store';
import Layout from '@/components/layout';
import ExpenseForm from '@/components/expense-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line 
} from 'recharts';
import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { Pencil, Trash2, Filter, Search } from 'lucide-react';

const COLORS = ['#6366f1', '#10b981', '#f43f5e', '#f59e0b', '#8b5cf6', '#ec4899'];

export default function Manage() {
  const { expenses, editExpense, deleteExpense } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMonth, setFilterMonth] = useState<string>('all');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Filter Logic
  const filteredExpenses = expenses.filter(ex => {
    const matchesSearch = ex.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          ex.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesDate = true;
    if (filterMonth !== 'all') {
      const date = parseISO(ex.date);
      const monthStr = format(date, 'yyyy-MM');
      matchesDate = monthStr === filterMonth;
    }

    return matchesSearch && matchesDate;
  });

  // Chart Data Preparation
  const categoryData = filteredExpenses.reduce((acc, curr) => {
    const existing = acc.find(item => item.name === curr.category);
    if (existing) {
      existing.value += curr.amount;
    } else {
      acc.push({ name: curr.category, value: curr.amount });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  // Sort expenses by date for line chart
  const sortedByDate = [...filteredExpenses].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const trendData = sortedByDate.reduce((acc, curr) => {
    const dateStr = format(parseISO(curr.date), 'MMM dd');
    const existing = acc.find(item => item.date === dateStr);
    if (existing) {
      existing.amount += curr.amount;
    } else {
      acc.push({ date: dateStr, amount: curr.amount });
    }
    return acc;
  }, [] as { date: string; amount: number }[]);

  // Unique months for filter
  const months = Array.from(new Set(expenses.map(ex => format(parseISO(ex.date), 'yyyy-MM')))).sort().reverse();

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Expenses</h1>
          <p className="text-muted-foreground">Analyze your spending patterns and manage records.</p>
        </div>

        {/* Charts Section */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4 shadow-sm">
            <CardHeader>
              <CardTitle>Spending Trend</CardTitle>
              <CardDescription>Daily spending over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#888888" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="#888888" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="amount" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      dot={{ r: 4, fill: "hsl(var(--primary))" }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3 shadow-sm">
            <CardHeader>
              <CardTitle>Category Breakdown</CardTitle>
              <CardDescription>Where your money goes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-2 justify-center mt-4">
                  {categoryData.map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-1 text-xs">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <span>{entry.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Management Table */}
        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div>
                <CardTitle>Expense Records</CardTitle>
                <CardDescription>View, edit, and delete your expenses.</CardDescription>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search expenses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-[200px] lg:w-[300px]"
                  />
                </div>
                <Select value={filterMonth} onValueChange={setFilterMonth}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter Month" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    {months.map(m => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExpenses.map((expense) => (
                  <TableRow key={expense.id} className="group">
                    <TableCell>{format(parseISO(expense.date), 'MMM dd, yyyy')}</TableCell>
                    <TableCell className="font-medium">{expense.description}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-secondary text-secondary-foreground border border-secondary-foreground/10">
                        {expense.category}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-bold">${expense.amount.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Dialog open={editingId === expense.id} onOpenChange={(open) => !open && setEditingId(null)}>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-muted-foreground hover:text-primary"
                              onClick={() => setEditingId(expense.id)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Expense</DialogTitle>
                            </DialogHeader>
                            <ExpenseForm 
                              initialData={expense} 
                              onSubmit={(updates) => {
                                editExpense(expense.id, updates);
                                setEditingId(null);
                              }}
                            />
                          </DialogContent>
                        </Dialog>

                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => deleteExpense(expense.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredExpenses.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                      No expenses found matching your criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
