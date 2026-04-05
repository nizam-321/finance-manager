'use client';

import { useState, useEffect } from 'react';
import { useFinance } from '@/lib/context';
import { Category, TransactionType } from '@/lib/types';
import { Plus, Calendar, DollarSign, Tag, FileText } from 'lucide-react';
import { useIsHydrated } from '@/lib/use-is-hydrated';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CATEGORIES: Category[] = [
  'Food & Dining', 'Shopping', 'Entertainment', 'Utilities', 'Transport', 
  'Rent', 'Salary', 'Freelance', 'Investments', 'Other'
];

export default function TransactionForm() {
  const { role, addTransaction, updateTransaction, editingTransaction, setEditingTransaction, isLoading } = useFinance();
  const isHydrated = useIsHydrated();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'Other' as Category,
    type: 'expense' as TransactionType,
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        description: editingTransaction.description,
        amount: editingTransaction.amount.toString(),
        category: editingTransaction.category,
        type: editingTransaction.type,
        date: new Date(editingTransaction.date).toISOString().split('T')[0],
      });
      setIsOpen(true);
    }
  }, [editingTransaction]);

  if (!isHydrated || role !== 'Admin') return null;

  const handleClose = () => {
    if (isLoading) return; // Prevent closing while saving
    setIsOpen(false);
    setEditingTransaction(null);
    setFormData({
      description: '',
      amount: '',
      category: 'Other',
      type: 'expense',
      date: new Date().toISOString().split('T')[0],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.amount || isLoading) return;

    const transactionData = {
      description: formData.description,
      amount: parseFloat(formData.amount),
      category: formData.category,
      type: formData.type,
      date: new Date(formData.date).toISOString(),
    };

    if (editingTransaction) {
      await updateTransaction(editingTransaction.id, transactionData);
    } else {
      await addTransaction(transactionData);
    }

    handleClose();
  };

  return (
    <div className="relative">
      <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
        <DialogTrigger asChild>
          <Button
            onClick={() => setIsOpen(true)}
            className="cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Transaction</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
            </DialogTitle>
            <DialogDescription>
              {editingTransaction ? 'Modify existing record' : 'Create a new financial record'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label>Description</label>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    required
                    placeholder="What was this for?"
                    className="pl-10"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label>Amount</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      required
                      type="number"
                      placeholder="0.00"
                      step="0.01"
                      className="pl-10"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label>Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      required
                      type="date"
                      className="pl-10"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label>Category</label>
                <div className="relative">
                  <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value as Category })}
                  >
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent position="popper" side="bottom" sideOffset={4} >
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label>Type</label>
                <div className="flex p-1 rounded-md border">
                  <Button
                    type="button"
                    variant={formData.type === 'income' ? 'secondary' : 'ghost'}
                    onClick={() => setFormData({ ...formData, type: 'income' })}
                    className={cn(
                         "flex-1",
                           formData.type === 'income' 
                           ? "bg-emerald-500 text-white hover:bg-emerald-600" 
                          : "text-muted-foreground hover:bg-emerald-500/10 hover:text-emerald-600" 
                    )}
                  >
                    Income
                  </Button>
                  <Button
                    type="button"
                    variant={formData.type === 'expense' ? 'secondary' : 'ghost'}
                    onClick={() => setFormData({ ...formData, type: 'expense' })}
                     className={cn(
                          "flex-1",
                          formData.type === 'expense' 
                          ? "bg-rose-500 text-white hover:bg-rose-600" 
                          : "text-muted-foreground hover:bg-rose-500/10 hover:text-rose-600" 
                    )}
                  >
                    Expense
                  </Button>
                </div>
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button
                disabled={isLoading}
                type="submit"
                className="w-full py-6 rounded-xl cursor-pointer"
              >
                {isLoading && (
                  <div className="w-4 h-4 border-2 border-white/30  border-t-white rounded-full animate-spin" />
                )}
                {editingTransaction ? 'Update Transaction' : 'Save Transaction'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
