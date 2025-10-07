import React from 'react';
import { Student, Room } from '../../types';
import { Modal } from './Modal';

interface StudentProfileModalProps {
  student: Student;
  room?: Room;
  onClose: () => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({ student, room, onClose }) => {
  const defaultPhoto = `https://avatar.iran.liara.run/public/boy?username=${student.name.split(' ')[0]}`;

  return (
    <Modal title="Student Details" onClose={onClose}>
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <img 
            src={student.photoUrl || defaultPhoto} 
            alt={student.name} 
            className="w-24 h-24 rounded-full object-cover border-4 border-primary"
          />
          <div>
            <h3 className="text-2xl font-bold text-dark">{student.name}</h3>
            <p className="text-gray-500">Student ID: {student.id}</p>
          </div>
        </div>
        <div className="border-t pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold text-gray-700">Contact Number</p>
              <p className="text-gray-600">{student.contact}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Emergency Contact</p>
              <p className="text-gray-600">{student.emergencyContact}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Check-in Date</p>
              <p className="text-gray-600">{student.checkInDate}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Room Information</p>
              <p className="text-gray-600">
                {room ? `Room ${room.roomNumber} (${room.type})` : 'Not Assigned'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};