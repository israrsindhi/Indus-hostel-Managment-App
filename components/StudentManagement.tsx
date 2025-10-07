import React, { useState, useEffect } from 'react';
import { Student, Room, User, UserRole, RoomStatus, RoomType, FeePayment } from '../types';
import { Modal } from './common/Modal';
import { StudentProfileModal } from './common/StudentProfileModal';
import { ManageFeesModal } from './common/ManageFeesModal';

interface StudentManagementProps {
  students: Student[];
  rooms: Room[];
  fees: FeePayment[];
  currentUser: User;
  onAddStudent: (studentData: Omit<Student, 'id' | 'checkInDate' | 'roomId'>, roomId: string, initialFee: number) => {newUser: User};
  onRemoveStudent: (studentId: string) => void;
  onUpdateStudent: (studentId: string, updatedData: Partial<Omit<Student, 'id'>>) => void;
  onUpdateFee: (feeId: string, updatedData: Partial<Omit<FeePayment, 'id'>>) => void;
}

const AddStudentForm: React.FC<{
    rooms: Room[];
    onAddStudent: (studentData: Omit<Student, 'id' | 'checkInDate' | 'roomId'>, roomId: string, initialFee: number) => {newUser: User};
}> = ({ rooms, onAddStudent }) => {
    const [name, setName] = useState('');
    const [contact, setContact] = useState('');
    const [emergencyContact, setEmergencyContact] = useState('');
    const [roomId, setRoomId] = useState('');
    const [photoUrl, setPhotoUrl] = useState('');
    const [initialFee, setInitialFee] = useState(0);
    const [newCredentials, setNewCredentials] = useState<{email: string, password: string} | null>(null);
    
    const availableRooms = rooms.filter(r => r.status !== RoomStatus.OCCUPIED);
    
    useEffect(() => {
        const room = rooms.find(r => r.id === roomId);
        if (room?.type === RoomType.QUAD) setInitialFee(8000);
        else if (room?.type === RoomType.PENTA) setInitialFee(7000);
        else setInitialFee(0);
    }, [roomId, rooms]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !contact.trim() || !emergencyContact.trim() || !roomId || initialFee <= 0) {
            alert('Please fill all required fields, including a valid initial fee.');
            return;
        }
        const { newUser } = onAddStudent({ name, contact, emergencyContact, photoUrl }, roomId, initialFee);
        
        setNewCredentials({ email: newUser.email, password: 'password123' });

        setName('');
        setContact('');
        setEmergencyContact('');
        setRoomId('');
        setPhotoUrl('');
        setInitialFee(0);
    };

    return (
        <>
            <div className="bg-white p-6 rounded-xl shadow-md mb-6">
                <h3 className="text-lg font-semibold text-dark mb-4">Add New Student</h3>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" className="input-style" required/>
                    <input type="text" value={contact} onChange={e => setContact(e.target.value)} placeholder="Contact No." className="input-style" required/>
                    <input type="text" value={emergencyContact} onChange={e => setEmergencyContact(e.target.value)} placeholder="Emergency Contact" className="input-style" required/>
                    <input type="text" value={photoUrl} onChange={e => setPhotoUrl(e.target.value)} placeholder="Photo URL (Optional)" className="input-style" />
                    <select value={roomId} onChange={e => setRoomId(e.target.value)} className="input-style" required>
                        <option value="">Select a room</option>
                        {availableRooms.map(r => <option key={r.id} value={r.id}>{r.roomNumber} ({r.type})</option>)}
                    </select>
                    <input type="number" value={initialFee} onChange={e => setInitialFee(Number(e.target.value))} placeholder="Initial Fee (PKR)" className="input-style" required/>
                    <button type="submit" className="bg-primary text-white py-2 px-4 rounded-md hover:bg-blue-800 transition-colors h-fit col-span-full lg:col-span-1">Add Student</button>
                </form>
            </div>
            {newCredentials && (
                <Modal title="Student Account Created" onClose={() => setNewCredentials(null)}>
                    <p className="text-sm text-gray-600 mb-4">The student can now log in with the following credentials:</p>
                    <div className="bg-secondary p-4 rounded-lg space-y-2">
                        <p><strong>Email:</strong> {newCredentials.email}</p>
                        <p><strong>Password:</strong> {newCredentials.password}</p>
                    </div>
                </Modal>
            )}
        </>
    )
}

const EditStudentModal: React.FC<{ student: Student; onClose: () => void; onUpdate: (updatedData: Partial<Omit<Student, 'id'>>) => void;}> = ({ student, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({ name: student.name, contact: student.contact, emergencyContact: student.emergencyContact, photoUrl: student.photoUrl || '' });
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdate(formData);
        onClose();
    };

    return (
        <Modal title={`Edit ${student.name}`} onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" className="w-full input-style" required />
                <input type="text" name="contact" value={formData.contact} onChange={handleChange} placeholder="Contact" className="w-full input-style" required />
                <input type="text" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} placeholder="Emergency Contact" className="w-full input-style" required />
                <input type="text" name="photoUrl" value={formData.photoUrl} onChange={handleChange} placeholder="Photo URL" className="w-full input-style" />
                <div className="flex justify-end pt-4">
                    <button type="submit" className="bg-primary text-white py-2 px-6 rounded-md hover:bg-blue-800 transition-colors">Save Changes</button>
                </div>
            </form>
        </Modal>
    );
};


export const StudentManagement: React.FC<StudentManagementProps> = ({ students, rooms, fees, currentUser, onAddStudent, onRemoveStudent, onUpdateStudent, onUpdateFee }) => {
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [managingFeesForStudent, setManagingFeesForStudent] = useState<Student | null>(null);


  const getRoomNumber = (roomId: string | null) => {
    if (!roomId) return 'N/A';
    return rooms.find(r => r.id === roomId)?.roomNumber || 'Unknown';
  };

  return (
    <div className="p-4 md:p-6">
      {currentUser.role === UserRole.ADMIN && <AddStudentForm rooms={rooms} onAddStudent={onAddStudent} />}
      <div className="bg-white rounded-xl shadow-md overflow-x-auto">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Room No.</th>
              <th className="px-5 py-3">Contact</th>
              <th className="px-5 py-3 hidden md:table-cell">Emergency Contact</th>
              <th className="px-5 py-3 hidden lg:table-cell">Check-in Date</th>
              {currentUser.role === UserRole.ADMIN && <th className="px-5 py-3">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-5 py-4 text-sm bg-white">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-10 h-10">
                      <img className="w-full h-full rounded-full object-cover" src={student.photoUrl || `https://avatar.iran.liara.run/public/boy?username=${student.name.split(' ')[0]}`} alt={student.name} />
                    </div>
                    <div className="ml-3">
                      <p className="text-gray-900 whitespace-no-wrap font-semibold">{student.name}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm bg-white">
                  <p className="text-gray-900 whitespace-no-wrap font-semibold">{getRoomNumber(student.roomId)}</p>
                </td>
                <td className="px-5 py-4 text-sm bg-white">
                  <p className="text-gray-900 whitespace-no-wrap">{student.contact}</p>
                </td>
                <td className="px-5 py-4 text-sm bg-white hidden md:table-cell">
                  <p className="text-gray-900 whitespace-no-wrap">{student.emergencyContact}</p>
                </td>
                <td className="px-5 py-4 text-sm bg-white hidden lg:table-cell">
                  <p className="text-gray-900 whitespace-no-wrap">{student.checkInDate}</p>
                </td>
                {currentUser.role === UserRole.ADMIN && (
                  <td className="px-5 py-4 text-sm bg-white space-x-2 whitespace-nowrap">
                    <button onClick={() => setViewingStudent(student)} className="text-accent hover:text-green-700 font-semibold">View</button>
                    <button onClick={() => setManagingFeesForStudent(student)} className="text-green-600 hover:text-green-800 font-semibold">Fees</button>
                    <button onClick={() => setEditingStudent(student)} className="text-primary hover:text-blue-700 font-semibold">Edit</button>
                    <button onClick={() => window.confirm('Are you sure you want to remove this student?') && onRemoveStudent(student.id)} className="text-danger hover:text-red-700 font-semibold">Remove</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
       {editingStudent && (
            <EditStudentModal 
                student={editingStudent} 
                onClose={() => setEditingStudent(null)} 
                onUpdate={(data) => onUpdateStudent(editingStudent.id, data)}
            />
        )}
        {viewingStudent && (
            <StudentProfileModal
                student={viewingStudent}
                room={rooms.find(r => r.id === viewingStudent.roomId)}
                onClose={() => setViewingStudent(null)}
            />
        )}
        {managingFeesForStudent && (
            <ManageFeesModal
                student={managingFeesForStudent}
                fees={fees.filter(f => f.studentId === managingFeesForStudent.id)}
                onClose={() => setManagingFeesForStudent(null)}
                onUpdateFee={onUpdateFee}
            />
        )}
    </div>
  );
};