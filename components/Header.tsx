import React from 'react';
import { View, User, UserRole } from '../types';

interface HeaderProps {
  currentView: View;
  currentUser: User;
  onLogout: () => void;
  onToggleSidebar: () => void;
}

const viewTitles: Record<View, string> = {
  dashboard: 'Dashboard Overview',
  rooms: 'Room Management',
  students: 'Student Management',
  billing: 'Fee & Billing Records',
  notices: 'Hostel Notice Board',
  assistant: 'AI Smart Assistant',
  team: 'Our Team',
  report: 'Financial Reports',
  profile: 'Edit Profile'
};

const residentViewTitles: Record<View, string> = {
  dashboard: 'My Dashboard',
  billing: 'My Billing History',
  notices: 'Hostel Notice Board',
  assistant: 'AI Smart Assistant',
  team: 'Our Team',
  profile: 'My Profile',
  rooms: '', // Not accessible
  students: '', // Not accessible
  report: '' // Not accessible
};


export const Header: React.FC<HeaderProps> = ({ currentView, currentUser, onLogout, onToggleSidebar }) => {
  const title = currentUser.role === UserRole.ADMIN ? viewTitles[currentView] : residentViewTitles[currentView];
  
  return (
    <header className="bg-white shadow-sm p-4 sticky top-0 z-10 flex justify-between items-center">
      <div className="flex items-center">
        <button onClick={onToggleSidebar} className="text-gray-600 focus:outline-none md:hidden mr-4">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">{title}</h1>
      </div>
      <div className="flex items-center space-x-2 md:space-x-4">
        <div className="hidden md:block text-right">
            <span className="text-gray-600 text-sm">Welcome,</span>
            <p className="font-semibold text-primary -mt-1">{currentUser.name}</p>
        </div>
        <button 
          onClick={onLogout}
          className="bg-danger text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-semibold flex items-center space-x-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};