import React, { useState } from 'react';
import { FeePayment, Student, FeeStatus } from '../../types';
import { Modal } from './Modal';

interface ManageFeesModalProps {
  student: Student;
  fees: FeePayment[];
  onClose: () => void;
  onUpdateFee: (feeId: string, updatedData: Partial<Omit<FeePayment, 'id'>>) => void;
}

const FeeRow: React.FC<{
    fee: FeePayment;
    onUpdateFee: ManageFeesModalProps['onUpdateFee'];
}> = ({ fee, onUpdateFee }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [amount, setAmount] = useState(fee.amount);
    const [status, setStatus] = useState(fee.status);

    const handleSave = () => {
        onUpdateFee(fee.id, { amount: Number(amount), status });
        setIsEditing(false);
    }
    
    const handleCancel = () => {
        setAmount(fee.amount);
        setStatus(fee.status);
        setIsEditing(false);
    }

    return (
        <tr className="border-b border-gray-200">
            <td className="px-5 py-3 text-sm">{fee.month}, {fee.year}</td>
            <td className="px-5 py-3 text-sm">
                {isEditing ? (
                    <input 
                        type="number"
                        value={amount}
                        onChange={e => setAmount(Number(e.target.value))}
                        className="input-style w-24"
                    />
                ) : `PKR ${fee.amount.toFixed(2)}`}
            </td>
            <td className="px-5 py-3 text-sm">
                 {isEditing ? (
                    <select
                        value={status}
                        onChange={e => setStatus(e.target.value as FeeStatus)}
                        className="input-style"
                    >
                        <option value={FeeStatus.PAID}>Paid</option>
                        <option value={FeeStatus.PENDING}>Pending</option>
                    </select>
                 ) : (
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        fee.status === FeeStatus.PAID ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                    }`}>{fee.status}</span>
                 )}
            </td>
            <td className="px-5 py-3 text-sm">{fee.date}</td>
            <td className="px-5 py-3 text-sm">
                {isEditing ? (
                    <div className="space-x-2">
                        <button onClick={handleSave} className="font-semibold text-primary">Save</button>
                        <button onClick={handleCancel} className="font-semibold text-gray-600">Cancel</button>
                    </div>
                ) : (
                    <button onClick={() => setIsEditing(true)} className="font-semibold text-accent">Edit</button>
                )}
            </td>
        </tr>
    )
}


export const ManageFeesModal: React.FC<ManageFeesModalProps> = ({ student, fees, onClose, onUpdateFee }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl m-4 flex flex-col h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-dark">Manage Fees for {student.name}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
             <table className="min-w-full leading-normal">
                <thead>
                    <tr className="border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        <th className="px-5 py-3">Month</th>
                        <th className="px-5 py-3">Amount</th>
                        <th className="px-5 py-3">Status</th>
                        <th className="px-5 py-3">Last Update</th>
                        <th className="px-5 py-3">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {fees.sort((a,b) => new Date(b.year, new Date(b.month + ' 1, 2000').getMonth()).getTime() - new Date(a.year, new Date(a.month + ' 1, 2000').getMonth()).getTime()).map(fee => (
                        <FeeRow key={fee.id} fee={fee} onUpdateFee={onUpdateFee} />
                    ))}
                </tbody>
             </table>
        </div>
        <div className="mt-6 text-right">
            <button
                onClick={onClose}
                className="bg-primary text-white py-2 px-4 rounded-md hover:bg-blue-800 transition-colors"
            >
                Close
            </button>
        </div>
      </div>
    </div>
  );
};