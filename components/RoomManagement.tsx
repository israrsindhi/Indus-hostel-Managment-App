import React, { useState } from 'react';
import { Room, Student, RoomStatus, RoomType, User, UserRole } from '../types';

interface RoomManagementProps {
  rooms: Room[];
  students: Student[];
  currentUser: User;
  onAddRoom: (room: Omit<Room, 'id' | 'status' | 'studentIds'>) => void;
  onRemoveRoom: (roomId: string) => void;
}

const AddRoomForm: React.FC<{ onAddRoom: (room: Omit<Room, 'id'| 'status' | 'studentIds'>) => void }> = ({ onAddRoom }) => {
    const [roomNumber, setRoomNumber] = useState('');
    const [type, setType] = useState<RoomType>(RoomType.QUAD);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!roomNumber.trim()) {
            alert('Please enter a room number.');
            return;
        }
        onAddRoom({ roomNumber, type });
        setRoomNumber('');
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
            <h3 className="text-lg font-semibold text-dark mb-4">Add New Room</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                    <label htmlFor="roomNumber" className="block text-sm font-medium text-gray-700">Room Number</label>
                    <input type="text" id="roomNumber" value={roomNumber} onChange={e => setRoomNumber(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                </div>
                 <div>
                    <label htmlFor="roomType" className="block text-sm font-medium text-gray-700">Room Type</label>
                    <select id="roomType" value={type} onChange={e => setType(e.target.value as RoomType)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                        {Object.values(RoomType).map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
                <button type="submit" className="bg-primary text-white py-2 px-4 rounded-md hover:bg-blue-800 transition-colors h-fit">Add Room</button>
            </form>
        </div>
    )
}


export const RoomManagement: React.FC<RoomManagementProps> = ({ rooms, students, currentUser, onAddRoom, onRemoveRoom }) => {
  const getStudentsInRoom = (studentIds: string[]) => {
    return students.filter(s => studentIds.includes(s.id));
  };

  return (
    <div className="p-6">
      {currentUser.role === UserRole.ADMIN && <AddRoomForm onAddRoom={onAddRoom} />}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {rooms.map(room => (
          <div key={room.id} className={`p-5 rounded-lg shadow-lg transform transition hover:-translate-y-1 relative ${room.status === RoomStatus.AVAILABLE ? 'bg-green-100' : 'bg-red-100'}`}>
            {currentUser.role === UserRole.ADMIN && room.studentIds.length === 0 && (
                <button onClick={() => onRemoveRoom(room.id)} className="absolute top-2 right-2 bg-danger text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors">&times;</button>
            )}
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xl font-bold text-dark">{`Room ${room.roomNumber}`}</h3>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${room.status === RoomStatus.AVAILABLE ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                {room.status}
              </span>
            </div>
            <p className="text-gray-600 mb-4">{room.type} Room</p>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Occupants:</h4>
              {room.studentIds.length > 0 ? (
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  {getStudentsInRoom(room.studentIds).map(student => (
                    <li key={student.id}>{student.name}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No occupants</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};