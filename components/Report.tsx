import React, { useState, useMemo } from 'react';
import { FeePayment, Expense, Student, ExpenseCategory, FeeStatus } from '../types';
import { Card } from './common/Card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { generateFinancialReportPDF } from '../services/pdfService';


interface ReportProps {
  fees: FeePayment[];
  expenses: Expense[];
  students: Student[];
  onAddExpense: (expense: Omit<Expense, 'id' | 'date'>) => void;
  onRemoveExpense: (expenseId: string) => void;
}

const AddExpenseForm: React.FC<{onAddExpense: ReportProps['onAddExpense']}> = ({ onAddExpense }) => {
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState<ExpenseCategory>(ExpenseCategory.MISC);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!title.trim() || !amount || Number(amount) <= 0) {
            alert("Please provide a valid title and amount.");
            return;
        }
        onAddExpense({ title, amount: Number(amount), category });
        setTitle('');
        setAmount('');
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
            <h3 className="text-lg font-semibold text-dark mb-4">Add New Expense</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <input type="text" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Expense Title" className="input-style" />
                <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Amount (PKR)" className="input-style" />
                <select value={category} onChange={e => setCategory(e.target.value as ExpenseCategory)} className="input-style">
                    {Object.values(ExpenseCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <button type="submit" className="bg-primary text-white py-2 px-4 rounded-md hover:bg-blue-800 transition-colors h-fit">Add Expense</button>
            </form>
        </div>
    );
}

export const Report: React.FC<ReportProps> = ({ fees, expenses, students, onAddExpense, onRemoveExpense }) => {
  const totalRevenue = useMemo(() => fees.filter(f => f.status === FeeStatus.PAID).reduce((sum, f) => sum + f.amount, 0), [fees]);
  const totalExpenses = useMemo(() => expenses.reduce((sum, e) => sum + e.amount, 0), [expenses]);
  const netProfit = totalRevenue - totalExpenses;

  const formatCurrency = (amount: number) => `PKR ${amount.toLocaleString()}`;

  const chartData = useMemo(() => {
    const dataByMonth: {[key: string]: {month: string, revenue: number, expenses: number}} = {};
    const allTransactions = [
        ...fees.filter(f => f.status === FeeStatus.PAID).map(f => ({...f, type: 'revenue'})),
        ...expenses.map(e => ({...e, type: 'expense'}))
    ];

    allTransactions.forEach(item => {
        const month = new Date(item.date).toLocaleString('default', { month: 'short', year: 'numeric' });
        if(!dataByMonth[month]) {
            dataByMonth[month] = { month, revenue: 0, expenses: 0 };
        }
        if(item.type === 'revenue') dataByMonth[month].revenue += item.amount;
        else dataByMonth[month].expenses += item.amount;
    });
    
    return Object.values(dataByMonth).sort((a,b) => new Date(a.month).getTime() - new Date(b.month).getTime());

  }, [fees, expenses]);

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-dark">Financial Overview</h2>
        <button onClick={() => generateFinancialReportPDF(fees, expenses, students)} className="bg-accent text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors font-semibold">
            Download Full Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Total Revenue" value={formatCurrency(totalRevenue)} icon={<div className="text-white text-2xl font-bold">PKR</div>} color="bg-green-500" />
        <Card title="Total Expenses" value={formatCurrency(totalExpenses)} icon={<div className="text-white text-2xl font-bold">PKR</div>} color="bg-red-500" />
        <Card title="Net Profit" value={formatCurrency(netProfit)} icon={<div className="text-white text-2xl font-bold">Σ</div>} color={netProfit > 0 ? "bg-blue-500" : "bg-gray-500"} />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-dark mb-4">Monthly Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' }).format(value as number)}/>
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
              <Legend />
              <Bar dataKey="revenue" fill="#10B981" />
              <Bar dataKey="expenses" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
      </div>

      <div>
        <AddExpenseForm onAddExpense={onAddExpense} />
        <div className="bg-white rounded-xl shadow-md overflow-x-auto">
             <h3 className="text-lg font-semibold text-dark p-4">Recent Expenses</h3>
            <table className="min-w-full leading-normal">
                <thead>
                    <tr className="border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        <th className="px-5 py-3">Title</th>
                        <th className="px-5 py-3">Category</th>
                        <th className="px-5 py-3">Date</th>
                        <th className="px-5 py-3">Amount</th>
                        <th className="px-5 py-3">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {expenses.map(exp => (
                        <tr key={exp.id} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="px-5 py-4 text-sm">{exp.title}</td>
                            <td className="px-5 py-4 text-sm">{exp.category}</td>
                            <td className="px-5 py-4 text-sm">{exp.date}</td>
                            <td className="px-5 py-4 text-sm font-semibold">{formatCurrency(exp.amount)}</td>
                            <td className="px-5 py-4 text-sm">
                                <button onClick={() => onRemoveExpense(exp.id)} className="text-danger hover:text-red-700">Remove</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};