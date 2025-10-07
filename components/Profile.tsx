import React, { useState } from 'react';
import { Student } from '../types';

interface ProfileProps {
  student: Student;
  onUpdateStudent: (studentId: string, updatedData: Partial<Omit<Student, 'id'>>) => void;
}

export const Profile: React.FC<ProfileProps> = ({ student, onUpdateStudent }) => {
  const [formData, setFormData] = useState({
    name: student.name,
    contact: student.contact,
    emergencyContact: student.emergencyContact,
    photoUrl: student.photoUrl || '',
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStudent(student.id, formData);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  return (
    <div className="p-4 md:p-6 flex justify-center">
      <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-md mt-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
            <img src={formData.photoUrl || `https://avatar.iran.liara.run/public/boy?username=${formData.name.split(' ')[0]}`} alt="Profile" className="w-32 h-32 rounded-full border-4 border-primary object-cover" />
            <div className="flex-1 text-center sm:text-left">
                <h2 className="text-3xl font-bold text-primary">{formData.name}</h2>
                <p className="text-gray-600">Student ID: {student.id}</p>
                <p className="text-gray-600">Check-in Date: {student.checkInDate}</p>
            </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full input-style" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                    <input type="text" name="contact" value={formData.contact} onChange={handleChange} className="mt-1 block w-full input-style" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Emergency Contact</label>
                    <input type="text" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} className="mt-1 block w-full input-style" />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Photo URL</label>
                <input type="text" name="photoUrl" value={formData.photoUrl} onChange={handleChange} className="mt-1 block w-full input-style" />
            </div>

            <div className="pt-4 flex justify-end">
                <button type="submit" className="bg-primary text-white py-2 px-6 rounded-md hover:bg-blue-800 transition-colors font-semibold">
                    Save Changes
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};