import React, { useState } from 'react';
import { FeePayment, Student, FeeStatus, User, UserRole, Room } from '../types';
import { generateFeeReceiptPDF } from '../services/pdfService';

interface BillingProps {
  fees: FeePayment[];
  students: Student[];
  rooms: Room[];
  onToggleFeeStatus: (feeId: string) => void;
  onGenerateFees: (month: string, year: number) => void;
  currentUser: User;
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const currentYear = new Date().getFullYear();
const YEARS = [currentYear, currentYear - 1, currentYear - 2];

export const Billing: React.FC<BillingProps> = ({ fees, students, rooms, onToggleFeeStatus, onGenerateFees, currentUser }) => {
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[new Date().getMonth()]);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  
  const getStudentName = (studentId: string) => {
    return students.find(s => s.id === studentId)?.name || 'Unknown Student';
  };

  const displayedFees = currentUser.role === UserRole.ADMIN 
    ? fees 
    : fees.filter(f => f.studentId === currentUser.studentId);
  
  const handleDownloadReceipt = (fee: FeePayment) => {
    const student = students.find(s => s.id === fee.studentId);
    if (!student) {
        alert("Could not find student details for this receipt.");
        return;
    }
    const room = rooms.find(r => r.id === student.roomId);
    generateFeeReceiptPDF(fee, student, room);
  };

  const handleGenerateFees = () => {
      if(window.confirm(`Are you sure you want to generate pending fees for ${selectedMonth}, ${selectedYear}?`)) {
          onGenerateFees(selectedMonth, selectedYear);
      }
  }

  const formatCurrency = (amount: number) => `PKR ${amount.toFixed(2)}`;

  return (
    <div className="p-4 md:p-6">
      {currentUser.role === UserRole.ADMIN && (
        <div className="bg-white p-4 rounded-xl shadow-md mb-6 md:flex justify-between items-center space-y-4 md:space-y-0">
            <h3 className="text-lg font-semibold text-dark">Fee Management</h3>
            <div className="flex items-center gap-2">
                <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} className="input-style">
                    {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                 <select value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))} className="input-style">
                    {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
                <button
                    onClick={handleGenerateFees}
                    className="bg-accent text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors whitespace-nowrap"
                >
                    Generate Fees
                </button>
            </div>
        </div>
      )}
      <div className="bg-white rounded-xl shadow-md overflow-x-auto">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              {currentUser.role === UserRole.ADMIN && <th className="px-5 py-3">Student Name</th>}
              <th className="px-5 py-3">Month</th>
              <th className="px-5 py-3">Amount</th>
              <th className="px-5 py-3">Payment Date</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {displayedFees.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(fee => (
              <tr key={fee.id} className="border-b border-gray-200 hover:bg-gray-50">
                {currentUser.role === UserRole.ADMIN && (
                    <td className="px-5 py-4 text-sm bg-white">
                      <p className="text-gray-900 whitespace-no-wrap font-semibold">{getStudentName(fee.studentId)}</p>
                    </td>
                )}
                <td className="px-5 py-4 text-sm bg-white">
                  <p className="text-gray-900 whitespace-no-wrap">{fee.month}, {fee.year}</p>
                </td>
                <td className="px-5 py-4 text-sm bg-white">
                  <p className="text-gray-900 whitespace-no-wrap">{formatCurrency(fee.amount)}</p>
                </td>
                <td className="px-5 py-4 text-sm bg-white">
                  <p className="text-gray-900 whitespace-no-wrap">{fee.date}</p>
                </td>
                <td className="px-5 py-4 text-sm bg-white">
                  <span className={`relative inline-block px-3 py-1 font-semibold leading-tight rounded-full ${
                    fee.status === FeeStatus.PAID ? 'text-green-900 bg-green-200' : 'text-red-900 bg-red-200'
                  }`}>
                    {fee.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm bg-white">
                    {currentUser.role === UserRole.ADMIN ? (
                        <button
                          onClick={() => onToggleFeeStatus(fee.id)}
                          className="text-sm bg-primary text-white py-1 px-3 rounded-md hover:bg-blue-800 transition-colors"
                        >
                          Toggle Status
                        </button>
                    ) : (
                        fee.status === FeeStatus.PAID ? (
                             <button
                              onClick={() => handleDownloadReceipt(fee)}
                              className="text-sm bg-accent text-white py-1 px-3 rounded-md hover:bg-green-600 transition-colors"
                            >
                              Download Receipt
                            </button>
                        ) : (
                            <span className="text-xs text-gray-500">N/A</span>
                        )
                    )}
                  </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};