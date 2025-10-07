import React from 'react';
import { Room, Student, FeePayment, RoomStatus, User, UserRole, View } from '../types';
import { Card } from './common/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface DashboardProps {
  rooms: Room[];
  students: Student[];
  fees: FeePayment[];
  currentUser: User;
  setView: (view: View) => void;
}

const AdminDashboard: React.FC<Pick<DashboardProps, 'rooms'| 'students'|'fees'>> = ({rooms, students, fees}) => {
    const totalRooms = rooms.length;
    const occupiedRooms = rooms.filter(r => r.status === RoomStatus.OCCUPIED).length;
    const availableRooms = totalRooms - occupiedRooms;
    const totalStudents = students.length;
    const pendingFeesCount = fees.filter(f => f.status === 'Pending').length;

    const occupancyData = [
        { name: 'Occupied', value: occupiedRooms },
        { name: 'Available', value: availableRooms },
    ];
    const COLORS = ['#1E40AF', '#10B981'];
    
    const roomTypeData = rooms.reduce((acc, room) => {
        const type = room.type;
        const existing = acc.find(item => item.name === type);
        if(existing) {
            existing.value += 1;
        } else {
            acc.push({name: type, value: 1});
        }
        return acc;
    }, [] as {name: string, value: number}[]);
    const ROOM_COLORS = ['#3B82F6', '#F59E0B', '#8B5CF6'];

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card title="Total Students" value={totalStudents} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.125-1.274-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.125-1.274.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} color="bg-blue-500" />
                <Card title="Total Rooms" value={totalRooms} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>} color="bg-yellow-500" />
                <Card title="Available Rooms" value={availableRooms} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>} color="bg-green-500" />
                <Card title="Pending Fees" value={pendingFeesCount} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} color="bg-red-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-lg font-semibold text-dark mb-4">Room Occupancy</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={occupancyData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                                {occupancyData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-lg font-semibold text-dark mb-4">Room Types</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={roomTypeData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} fill="#82ca9d" paddingAngle={5} label>
                                {roomTypeData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={ROOM_COLORS[index % ROOM_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </>
    );
};

const ResidentDashboard: React.FC<Pick<DashboardProps, 'rooms' | 'students' | 'fees' | 'currentUser' | 'setView'>> = ({ rooms, students, fees, currentUser, setView }) => {
    const studentProfile = students.find(s => s.id === currentUser.studentId);
    const roomInfo = rooms.find(r => r.id === studentProfile?.roomId);
    const feeInfo = fees.find(f => f.studentId === currentUser.studentId && f.status === 'Pending');
    const defaultPhoto = `https://avatar.iran.liara.run/public/boy?username=${currentUser.name.split(' ')[0]}`;

    return (
        <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 mb-6">
                <img src={studentProfile?.photoUrl || defaultPhoto} alt="Student Photo" className="w-24 h-24 rounded-full border-4 border-primary object-cover" />
                <div className="flex-1">
                    <h2 className="text-3xl font-bold text-primary">Welcome back, {currentUser.name}!</h2>
                    <p className="text-gray-600">Here's a quick look at your current status.</p>
                </div>
                 <button onClick={() => setView('profile')} className="bg-secondary text-primary font-semibold px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors">
                    Edit Profile
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-secondary p-6 rounded-lg">
                    <h3 className="font-semibold text-lg text-primary mb-2">Your Room Details</h3>
                    {studentProfile && roomInfo ? (
                        <div className="space-y-1 text-gray-700">
                            <p><strong>Room Number:</strong> {roomInfo.roomNumber}</p>
                            <p><strong>Room Type:</strong> {roomInfo.type}</p>
                            <p><strong>Check-in Date:</strong> {studentProfile.checkInDate}</p>
                        </div>
                    ) : (
                         <p className="text-gray-500">No room assigned.</p>
                    )}
                </div>
                <div className={`p-6 rounded-lg ${feeInfo ? 'bg-red-100' : 'bg-green-100'}`}>
                    <h3 className={`font-semibold text-lg ${feeInfo ? 'text-danger' : 'text-accent'} mb-2`}>Billing Status</h3>
                    {feeInfo ? (
                         <div className="space-y-1 text-red-800">
                             <p>You have a pending payment of <strong>PKR {feeInfo.amount.toFixed(2)}</strong> for {feeInfo.month}.</p>
                             <p>Please clear your dues soon.</p>
                         </div>
                    ) : (
                        <p className="text-green-800">Your account is all clear. No pending fees!</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export const Dashboard: React.FC<DashboardProps> = ({ rooms, students, fees, currentUser, setView }) => {
  return (
    <div className="p-4 md:p-6 space-y-6">
      {currentUser.role === UserRole.ADMIN 
        ? <AdminDashboard rooms={rooms} students={students} fees={fees} /> 
        : <ResidentDashboard rooms={rooms} students={students} fees={fees} currentUser={currentUser} setView={setView} />
      }
    </div>
  );
};