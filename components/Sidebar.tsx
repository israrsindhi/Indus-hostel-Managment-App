import React from 'react';
import { View, User, UserRole } from '../types';
import { DashboardIcon } from './icons/DashboardIcon';
import { RoomIcon } from './icons/RoomIcon';
import { StudentIcon } from './icons/StudentIcon';
import { BillingIcon } from './icons/BillingIcon';
import { NoticeIcon } from './icons/NoticeIcon';
import { AssistantIcon } from './icons/AssistantIcon';
import { TeamIcon } from './icons/TeamIcon';
import { ReportIcon } from './icons/ReportIcon';
import { ProfileIcon } from './icons/ProfileIcon';


interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
  currentUser: User;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <li
    onClick={onClick}
    className={`flex items-center p-3 my-1 rounded-lg cursor-pointer transition-all ${
      isActive
        ? 'bg-secondary text-primary font-bold shadow-inner'
        : 'text-gray-300 hover:bg-blue-900 hover:text-white'
    }`}
  >
    {icon}
    <span className="ml-4">{label}</span>
  </li>
);

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, currentUser, isOpen, setIsOpen }) => {
  
  const handleSetView = (view: View) => {
    setView(view);
    setIsOpen(false); // Close sidebar on mobile after navigation
  }

  const adminNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon className="w-5 h-5" /> },
    { id: 'rooms', label: 'Room Management', icon: <RoomIcon className="w-5 h-5" /> },
    { id: 'students', label: 'Student Management', icon: <StudentIcon className="w-5 h-5" /> },
    { id: 'billing', label: 'Billing', icon: <BillingIcon className="w-5 h-5" /> },
    { id: 'report', label: 'Reports', icon: <ReportIcon className="w-5 h-5" /> },
    { id: 'notices', label: 'Notice Board', icon: <NoticeIcon className="w-5 h-5" /> },
    { id: 'assistant', label: 'Smart Assistant', icon: <AssistantIcon className="w-5 h-5" /> },
    { id: 'team', label: 'Our Team', icon: <TeamIcon className="w-5 h-5" /> },
  ];

  const residentNavItems = [
      { id: 'dashboard', label: 'My Dashboard', icon: <DashboardIcon className="w-5 h-5" /> },
      { id: 'profile', label: 'My Profile', icon: <ProfileIcon className="w-5 h-5" />},
      { id: 'billing', label: 'My Billing', icon: <BillingIcon className="w-5 h-5" /> },
      { id: 'notices', label: 'Notice Board', icon: <NoticeIcon className="w-5 h-5" /> },
      { id: 'assistant', label: 'Smart Assistant', icon: <AssistantIcon className="w-5 h-5" /> },
      { id: 'team', label: 'Our Team', icon: <TeamIcon className="w-5 h-5" /> },
  ];
  
  const navItems = currentUser.role === UserRole.ADMIN ? adminNavItems : residentNavItems;


  return (
    <>
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden ${isOpen ? 'block' : 'hidden'}`} onClick={() => setIsOpen(false)}></div>
      <aside className={`w-64 bg-primary text-white flex flex-col p-4 fixed h-full shadow-2xl z-30 transform md:transform-none transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="text-xl font-bold mb-10 text-center flex items-center justify-center space-x-2">
          <img src="https://i.postimg.cc/RFFccnLV/2-removebg-preview.png" alt="Hostel Logo" className="h-12 w-12"/>
          <div className="flex flex-col items-start">
            <span className="font-bold">Indus Boys Hostel</span>
            <span className="text-xs text-gray-300 -mt-1">Sukkur</span>
          </div>
        </div>
        <nav>
          <ul>
            {navItems.map(item => (
              <NavItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                isActive={currentView === item.id}
                onClick={() => handleSetView(item.id as View)}
              />
            ))}
          </ul>
        </nav>
        <div className="mt-auto text-center text-xs text-gray-400">
          <p>&copy; 2024 Indus Boys Hostel</p>
          <p>Your Home Away From Home</p>
        </div>
      </aside>
    </>
  );
};