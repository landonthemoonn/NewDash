import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { DollarSign, Plus, TrendingUp, TrendingDown, Receipt } from 'lucide-react';
import { format } from 'date-fns';
import { projectId, publicAnonKey } from '../utils/supabase/info.tsx';
import { motion } from 'motion/react';
import { toast } from 'sonner';

interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  category: string;
  date: string;
  splitBetween: string[];
}

interface FinancialsProps {
  session: any;
  supabase: any;
  devMode?: boolean;
}

export function Financials({ session, supabase, devMode }: FinancialsProps) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const [newDescription, setNewDescription] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newPaidBy, setNewPaidBy] = useState('');
  const [newCategory, setNewCategory] = useState('utilities');

  const fetchExpenses = async () => {
    if (devMode) {
      setExpenses([]);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-90e9fafd/expenses`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setExpenses(data.expenses || []);
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const addExpense = async () => {
    if (!newDescription.trim() || !newAmount || !newPaidBy.trim()) return;

    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (!currentSession) {
        console.error('No active session');
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-90e9fafd/expenses`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentSession.access_token}`,
          },
          body: JSON.stringify({ 
            description: newDescription.trim(),
            amount: parseFloat(newAmount),
            paidBy: newPaidBy.trim(),
            category: newCategory,
          }),
        }
      );

      if (response.ok) {
        setNewDescription('');
        setNewAmount('');
        setNewPaidBy('');
        setNewCategory('utilities');
        setDialogOpen(false);
        await fetchExpenses();
        toast.success('Expense added successfully!');
      }
    } catch (error) {
      console.error('Error adding expense:', error);
      toast.error('Failed to add expense.');
    }
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const categoryIcons: Record<string, any> = {
    utilities: '💡',
    groceries: '🛒',
    rent: '🏠',
    subscriptions: '📱',
    household: '🧹',
    other: '📝',
  };

  return (
    <Card className="glass-strong border border-white/10 shadow-2xl hover:shadow-accent/20 transition-all duration-500">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-accent/10 border border-accent/20">
              <DollarSign className="h-5 w-5 text-accent" />
            </div>
            <div>
              <CardTitle className="text-lg">Shared Expenses</CardTitle>
              <CardDescription>Track bills, groceries, and reimbursements</CardDescription>
            </div>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                size="sm"
                disabled={devMode}
                className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
              >
                <Plus className="h-4 w-4" />
                Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-strong border-white/20">
              <DialogHeader>
                <DialogTitle>Add Shared Expense</DialogTitle>
                <DialogDescription>Log a payment or shared cost</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="e.g. Electric bill - November"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="glass border-white/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount ($)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    className="glass border-white/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paidBy">Paid By</Label>
                  <Input
                    id="paidBy"
                    placeholder="Your name"
                    value={newPaidBy}
                    onChange={(e) => setNewPaidBy(e.target.value)}
                    className="glass border-white/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={newCategory} onValueChange={setNewCategory}>
                    <SelectTrigger className="glass border-white/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rent">🏠 Rent</SelectItem>
                      <SelectItem value="utilities">💡 Utilities</SelectItem>
                      <SelectItem value="groceries">🛒 Groceries</SelectItem>
                      <SelectItem value="subscriptions">📱 Subscriptions</SelectItem>
                      <SelectItem value="household">🧹 Household Items</SelectItem>
                      <SelectItem value="other">📝 Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  className="flex-1 glass border-white/20"
                >
                  Cancel
                </Button>
                <Button
                  onClick={addExpense}
                  disabled={!newDescription.trim() || !newAmount || !newPaidBy.trim()}
                  className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  Add Expense
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary */}
        {expenses.length > 0 && (
          <div className="p-4 glass rounded-xl border border-white/10">
            <p className="text-sm text-muted-foreground mb-1">Total This Month</p>
            <p className="text-2xl font-medium text-accent">${totalExpenses.toFixed(2)}</p>
          </div>
        )}

        {/* Expense List */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : expenses.length > 0 ? (
          <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
            {expenses.map((expense, index) => (
              <div
                key={expense.id}
                className="p-4 glass rounded-xl border border-white/10 hover:border-accent/20 transition-all duration-300"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{categoryIcons[expense.category]}</span>
                    <div>
                      <p className="text-sm font-medium">{expense.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Paid by {expense.paidBy} • {format(new Date(expense.date), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-accent">${expense.amount.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <div className="inline-block p-4 rounded-2xl glass border border-white/10 mb-3">
              <Receipt className="h-10 w-10 text-muted" />
            </div>
            <p className="text-sm">No expenses logged yet</p>
            <p className="text-xs mt-1">Start tracking shared costs</p>
          </div>
        )}

        {devMode && (
          <div className="text-xs text-muted-foreground pt-4 border-t border-white/10">
            <p>Expense tracking will work when you enable authentication</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}