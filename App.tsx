import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { RoomManagement } from './components/RoomManagement';
import { StudentManagement } from './components/StudentManagement';
import { Billing } from './components/Billing';
import { NoticeBoard } from './components/NoticeBoard';
import { SmartAssistant } from './components/SmartAssistant';
import { Team } from './components/Team';
import { Report } from './components/Report';
import { Profile } from './components/Profile';
import { Auth } from './components/Auth';
import { useHostelData } from './hooks/useHostelData';
import { useNotifications } from './hooks/useNotifications';
import { View, User, UserRole, Student } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  
  const { 
    rooms, students, fees, notices, users, teamMembers, expenses,
    addStudent, removeStudent, updateStudent, addRoom, removeRoom,
    addNotice, removeNotice, toggleFeeStatus, generateMonthlyFees,
    addExpense, removeExpense, updateFee
  } = useHostelData();

  useNotifications();

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };
  
  const residentStudentProfile = students.find(s => s.id === currentUser?.studentId);

  const renderView = () => {
    if (!currentUser) return null;

    switch (currentView) {
      case 'dashboard':
        return <Dashboard rooms={rooms} students={students} fees={fees} currentUser={currentUser} setView={setCurrentView} />;
      case 'rooms':
        return currentUser.role === UserRole.ADMIN ? <RoomManagement rooms={rooms} students={students} currentUser={currentUser} onAddRoom={addRoom} onRemoveRoom={removeRoom} /> : null;
      case 'students':
        return currentUser.role === UserRole.ADMIN ? <StudentManagement students={students} rooms={rooms} fees={fees} currentUser={currentUser} onAddStudent={addStudent} onRemoveStudent={removeStudent} onUpdateStudent={updateStudent} onUpdateFee={updateFee} /> : null;
      case 'billing':
        return <Billing fees={fees} students={students} rooms={rooms} onToggleFeeStatus={toggleFeeStatus} onGenerateFees={generateMonthlyFees} currentUser={currentUser} />;
      case 'notices':
        return <NoticeBoard notices={notices} currentUser={currentUser} onAddNotice={addNotice} onRemoveNotice={removeNotice} />;
      case 'assistant':
        return <SmartAssistant rooms={rooms} students={students} fees={fees} currentUser={currentUser}/>;
      case 'team':
        return <Team teamMembers={teamMembers} />;
      case 'report':
        return currentUser.role === UserRole.ADMIN ? <Report fees={fees} expenses={expenses} students={students} onAddExpense={addExpense} onRemoveExpense={removeExpense} /> : null;
      case 'profile':
         return currentUser.role === UserRole.RESIDENT && residentStudentProfile 
                ? <Profile student={residentStudentProfile} onUpdateStudent={updateStudent} /> 
                : null;
      default:
        return <Dashboard rooms={rooms} students={students} fees={fees} currentUser={currentUser} setView={setCurrentView} />;
    }
  };

  if (!currentUser) {
    return <Auth users={users} onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-light">
      <Sidebar currentView={currentView} setView={setCurrentView} currentUser={currentUser} isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />
      <main className="flex-1 md:ml-64 flex flex-col">
        <Header currentView={currentView} currentUser={currentUser} onLogout={handleLogout} onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
        <div className="flex-1 overflow-y-auto">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;