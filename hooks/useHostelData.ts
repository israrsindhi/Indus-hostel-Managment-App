import { useState, useCallback } from 'react';
import { Room, Student, FeePayment, Notice, RoomType, RoomStatus, FeeStatus, User, UserRole, TeamMember, Expense, ExpenseCategory } from '../types';

// --- NEW DATA SETUP ---

// Rooms
const initialRooms: Room[] = [
  { id: 'r-ff1', roomNumber: 'Room 1 FF', type: RoomType.PENTA, status: RoomStatus.OCCUPIED, studentIds: ['s-sajid', 's-dummy1', 's-dummy2', 's-dummy3', 's-dummy4'] },
  { id: 'r-ff2', roomNumber: 'Room 2 FF', type: RoomType.PENTA, status: RoomStatus.OCCUPIED, studentIds: ['s-dummy5', 's-dummy6', 's-dummy7', 's-dummy8', 's-dummy9'] },
  { id: 'r-ff3', roomNumber: 'Room 3 FF', type: RoomType.PENTA, status: RoomStatus.OCCUPIED, studentIds: ['s-furqan', 's-new', 's-jawadali', 's-dummy10', 's-dummy11'] },
  { id: 'r-ff4', roomNumber: 'Room 4 FF', type: RoomType.PENTA, status: RoomStatus.OCCUPIED, studentIds: ['s-qadir', 's-basheer', 's-zulfiqar'] },
  { id: 'r-sf1', roomNumber: 'Room 1 SF', type: RoomType.PENTA, status: RoomStatus.OCCUPIED, studentIds: ['s-awais', 's-alizaib', 's-nawaz'] },
  { id: 'r-sf2', roomNumber: 'Room 2 SF', type: RoomType.PENTA, status: RoomStatus.OCCUPIED, studentIds: ['s-farooque', 's-jaleel', 's-mubeen', 's-farooqueb'] },
  { id: 'r-sf3', roomNumber: 'Room 3 SF', type: RoomType.PENTA, status: RoomStatus.OCCUPIED, studentIds: ['s-jawadjaved', 's-abbas', 's-zain'] },
  { id: 'r-sf4', roomNumber: 'Room 4 SF', type: RoomType.PENTA, status: RoomStatus.OCCUPIED, studentIds: ['s-shan', 's-sain'] },
];

// Students
const initialStudents: Student[] = [
  // Named Students
  { id: 's-sajid', name: 'Sajid Ali', contact: '111-000-0001', emergencyContact: '111-999-0001', checkInDate: '2024-01-10', roomId: 'r-ff1' },
  { id: 's-furqan', name: 'Dr. Furqan', contact: '111-000-0002', emergencyContact: '111-999-0002', checkInDate: '2024-01-10', roomId: 'r-ff3' },
  { id: 's-new', name: 'Dr. New', contact: '111-000-0003', emergencyContact: '111-999-0003', checkInDate: '2024-01-10', roomId: 'r-ff3' },
  { id: 's-jawadali', name: 'Jawad Ali', contact: '111-000-0004', emergencyContact: '111-999-0004', checkInDate: '2024-01-10', roomId: 'r-ff3' },
  { id: 's-qadir', name: 'Ab Qadir', contact: '111-000-0005', emergencyContact: '111-999-0005', checkInDate: '2024-01-10', roomId: 'r-ff4' },
  { id: 's-basheer', name: 'Basheer Ahmed', contact: '111-000-0006', emergencyContact: '111-999-0006', checkInDate: '2024-01-10', roomId: 'r-ff4' },
  { id: 's-zulfiqar', name: 'Zulfiqar Ali', contact: '111-000-0007', emergencyContact: '111-999-0007', checkInDate: '2024-01-10', roomId: 'r-ff4' },
  { id: 's-awais', name: 'Awais Mahar', contact: '111-000-0008', emergencyContact: '111-999-0008', checkInDate: '2024-01-10', roomId: 'r-sf1' },
  { id: 's-alizaib', name: 'Ali Zaib', contact: '111-000-0009', emergencyContact: '111-999-0009', checkInDate: '2024-01-10', roomId: 'r-sf1' },
  { id: 's-nawaz', name: 'M Nawaz Awan', contact: '111-000-0010', emergencyContact: '111-999-0010', checkInDate: '2024-01-10', roomId: 'r-sf1' },
  { id: 's-farooque', name: 'Farooque Rauf', contact: '111-000-0011', emergencyContact: '111-999-0011', checkInDate: '2024-01-10', roomId: 'r-sf2' },
  { id: 's-jaleel', name: 'Jaleel Ahmed', contact: '111-000-0012', emergencyContact: '111-999-0012', checkInDate: '2024-01-10', roomId: 'r-sf2' },
  { id: 's-mubeen', name: 'M Mubeen', contact: '111-000-0013', emergencyContact: '111-999-0013', checkInDate: '2024-01-10', roomId: 'r-sf2' },
  { id: 's-farooqueb', name: 'Farooque Brother', contact: '111-000-0014', emergencyContact: '111-999-0014', checkInDate: '2024-01-10', roomId: 'r-sf2' },
  { id: 's-jawadjaved', name: 'Jawad Javed', contact: '111-000-0015', emergencyContact: '111-999-0015', checkInDate: '2024-01-10', roomId: 'r-sf3' },
  { id: 's-abbas', name: 'M Abbas', contact: '111-000-0016', emergencyContact: '111-999-0016', checkInDate: '2024-01-10', roomId: 'r-sf3' },
  { id: 's-zain', name: 'Zain Ali', contact: '111-000-0017', emergencyContact: '111-999-0017', checkInDate: '2024-01-10', roomId: 'r-sf3' },
  { id: 's-shan', name: 'Shan', contact: '111-000-0018', emergencyContact: '111-999-0018', checkInDate: '2024-01-10', roomId: 'r-sf4' },
  { id: 's-sain', name: 'Sain x Shan', contact: '111-000-0019', emergencyContact: '111-999-0019', checkInDate: '2024-01-10', roomId: 'r-sf4' },
  // Dummy Students
  ...Array.from({ length: 11 }, (_, i) => ({
    id: `s-dummy${i + 1}`,
    name: `Resident ${i + 1}`,
    contact: `222-000-00${i < 10 ? '0' : ''}${i+1}`,
    emergencyContact: `222-999-00${i < 10 ? '0' : ''}${i+1}`,
    checkInDate: '2024-02-01',
    roomId: i < 4 ? 'r-ff1' : i < 9 ? 'r-ff2' : 'r-ff3',
  }))
];

// Users
const initialUsers: User[] = [
  { id: 'u1', name: 'Admin User', email: 'admin@hostel.com', role: UserRole.ADMIN },
  // Named Student Users
  { id: 'u-sajid', name: 'Sajid Ali', email: 'sajid@indus.com', role: UserRole.RESIDENT, studentId: 's-sajid' },
  { id: 'u-furqan', name: 'Dr. Furqan', email: 'drfurqan@indus.com', role: UserRole.RESIDENT, studentId: 's-furqan' },
  { id: 'u-new', name: 'Dr. New', email: 'drnew@indus.com', role: UserRole.RESIDENT, studentId: 's-new' },
  { id: 'u-jawadali', name: 'Jawad Ali', email: 'jawad.ali@indus.com', role: UserRole.RESIDENT, studentId: 's-jawadali' },
  { id: 'u-qadir', name: 'Ab Qadir', email: 'abqadir@indus.com', role: UserRole.RESIDENT, studentId: 's-qadir' },
  { id: 'u-basheer', name: 'Basheer Ahmed', email: 'basheer@indus.com', role: UserRole.RESIDENT, studentId: 's-basheer' },
  { id: 'u-zulfiqar', name: 'Zulfiqar Ali', email: 'zulfi@indus.com', role: UserRole.RESIDENT, studentId: 's-zulfiqar' },
  { id: 'u-awais', name: 'Awais Mahar', email: 'awais@indus.com', role: UserRole.RESIDENT, studentId: 's-awais' },
  { id: 'u-alizaib', name: 'Ali Zaib', email: 'alizaib@indus.com', role: UserRole.RESIDENT, studentId: 's-alizaib' },
  { id: 'u-nawaz', name: 'M Nawaz Awan', email: 'mnawaz@indus.com', role: UserRole.RESIDENT, studentId: 's-nawaz' },
  { id: 'u-farooque', name: 'Farooque Rauf', email: 'farooque@indus.com', role: UserRole.RESIDENT, studentId: 's-farooque' },
  { id: 'u-jaleel', name: 'Jaleel Ahmed', email: 'jaleelahmed@indus.com', role: UserRole.RESIDENT, studentId: 's-jaleel' },
  { id: 'u-mubeen', name: 'M Mubeen', email: 'mubeen@indus.com', role: UserRole.RESIDENT, studentId: 's-mubeen' },
  { id: 'u-farooqueb', name: 'Farooque Brother', email: 'farooqueb@indus.com', role: UserRole.RESIDENT, studentId: 's-farooqueb' },
  { id: 'u-jawadjaved', name: 'Jawad Javed', email: 'jawadjaved@indus.com', role: UserRole.RESIDENT, studentId: 's-jawadjaved' },
  { id: 'u-abbas', name: 'M Abbas', email: 'abbas@indus.com', role: UserRole.RESIDENT, studentId: 's-abbas' },
  { id: 'u-zain', name: 'Zain Ali', email: 'zain@indus.com', role: UserRole.RESIDENT, studentId: 's-zain' },
  { id: 'u-shan', name: 'Shan', email: 'shan@indus.com', role: UserRole.RESIDENT, studentId: 's-shan' },
  { id: 'u-sain', name: 'Sain x Shan', email: 'sain@indus.com', role: UserRole.RESIDENT, studentId: 's-sain' },
  // Dummy Student Users
  ...Array.from({ length: 11 }, (_, i) => ({
    id: `u-dummy${i + 1}`,
    name: `Resident ${i + 1}`,
    email: `resident${i+1}@hostel.com`,
    role: UserRole.RESIDENT,
    studentId: `s-dummy${i + 1}`,
  }))
];

// Fees
const currentMonth = new Date().toLocaleString('default', { month: 'long' });
const currentYear = new Date().getFullYear();
const initialFees: FeePayment[] = initialStudents.map((student, i) => ({
  id: `f-initial-${i}`,
  studentId: student.id,
  amount: 7000, // All rooms are PENTA, so fee is 7000
  date: new Date().toISOString().split('T')[0],
  status: FeeStatus.PENDING,
  month: currentMonth,
  year: currentYear,
}));


// --- STATIC DATA ---
const initialNotices: Notice[] = [
  { id: 'n1', title: 'Monthly Maintenance', content: 'The monthly maintenance for all rooms will be conducted on the 15th of this month.', date: '2024-07-01' },
  { id: 'n2', title: 'Hostel Rules Update', content: 'Please review the updated hostel rulebook available at the front desk.', date: '2024-06-25' },
];

const teamMembers: TeamMember[] = [
    { id: 'tm1', name: 'Mr. Faiq Ali Abbasi', role: 'Member Management Team', imageUrl: 'https://i.postimg.cc/9FrGkFmn/Gemini-Generated-Image-76whby76whby76wh.png' },
    { id: 'tm2', name: 'Mr. Ali Faheem', role: 'Member Management Team', imageUrl: 'https://i.postimg.cc/5N6wrN4Z/Gemini-Generated-Image-8sktjf8sktjf8skt.png' },
    { id: 'tm3', name: 'Dr. Saeed Ahmed Bapar', role: 'Member Management Team', imageUrl: 'https://i.postimg.cc/ZKKf5STf/Gemini-Generated-Image-mctpyfmctpyfmctp.png' },
];

const initialExpenses: Expense[] = [
    { id: 'e1', title: 'Electricity Bill', amount: 50000, date: '2024-07-05', category: ExpenseCategory.UTILITIES },
    { id: 'e2', title: 'Plumbing Repairs', amount: 10000, date: '2024-07-10', category: ExpenseCategory.MAINTENANCE },
    { id: 'e3', title: 'Staff Salaries', amount: 150000, date: '2024-07-01', category: ExpenseCategory.SALARIES },
];

export const useHostelData = () => {
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [fees, setFees] = useState<FeePayment[]>(initialFees);
  const [notices, setNotices] = useState<Notice[]>(initialNotices);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);

  const addStudent = useCallback((studentData: Omit<Student, 'id' | 'checkInDate' | 'roomId'>, roomId: string, initialFee: number): {newStudent: Student, newUser: User} => {
    const today = new Date();
    const newStudent: Student = {
      ...studentData,
      id: `s${Date.now()}`,
      checkInDate: today.toISOString().split('T')[0],
      roomId,
    };
    setStudents(prev => [...prev, newStudent]);
    
    // Create a corresponding user account
    const newUser: User = {
        id: `u${Date.now()}`,
        name: newStudent.name,
        email: `${newStudent.name.split(' ')[0].toLowerCase()}@hostel.com`,
        role: UserRole.RESIDENT,
        studentId: newStudent.id,
    };
    setUsers(prev => [...prev, newUser]);
    
    // Add initial fee payment
    const newFee: FeePayment = {
        id: `f${Date.now()}`,
        studentId: newStudent.id,
        amount: initialFee,
        date: today.toISOString().split('T')[0],
        status: FeeStatus.PAID,
        month: today.toLocaleString('default', { month: 'long' }),
        year: today.getFullYear()
    };
    setFees(prev => [...prev, newFee]);

    if (roomId) {
      setRooms(prevRooms => prevRooms.map(r => {
        if (r.id === roomId) {
          const newStudentIds = [...r.studentIds, newStudent.id];
          const capacity = r.type === RoomType.QUAD ? 4 : 5;
          const newStatus = newStudentIds.length >= capacity ? RoomStatus.OCCUPIED : r.status;
          return { ...r, studentIds: newStudentIds, status: newStatus };
        }
        return r;
      }));
    }
    return { newStudent, newUser };
  }, []);

  const updateStudent = useCallback((studentId: string, updatedData: Partial<Omit<Student, 'id'>>) => {
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, ...updatedData } : s));
    const studentToUpdate = students.find(s => s.id === studentId);
    if(studentToUpdate && studentToUpdate.name !== updatedData.name && updatedData.name){
        setUsers(prevUsers => prevUsers.map(u => u.studentId === studentId ? {...u, name: updatedData.name as string} : u));
    }
  }, [students]);


  const removeStudent = useCallback((studentId: string) => {
    const studentToRemove = students.find(s => s.id === studentId);
    if (!studentToRemove) return;

    setStudents(prev => prev.filter(s => s.id !== studentId));
    setUsers(prev => prev.filter(u => u.studentId !== studentId));

    if (studentToRemove.roomId) {
      setRooms(prevRooms => prevRooms.map(r => {
        if (r.id === studentToRemove.roomId) {
          const newStudentIds = r.studentIds.filter(id => id !== studentId);
          return { ...r, studentIds: newStudentIds, status: RoomStatus.AVAILABLE };
        }
        return r;
      }));
    }

    setFees(prev => prev.filter(f => f.studentId !== studentId));
  }, [students]);

  const addRoom = useCallback((room: Omit<Room, 'id' | 'status' | 'studentIds'>) => {
    const newRoom: Room = {
      ...room,
      id: `r${Date.now()}`,
      status: RoomStatus.AVAILABLE,
      studentIds: [],
    };
    setRooms(prev => [...prev, newRoom].sort((a,b) => a.roomNumber.localeCompare(b.roomNumber)));
  }, []);

  const removeRoom = useCallback((roomId: string) => {
    setRooms(prev => prev.filter(r => r.id !== roomId));
  }, []);

  const addNotice = useCallback((notice: Omit<Notice, 'id' | 'date'>) => {
    const newNotice: Notice = {
      ...notice,
      id: `n${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    setNotices(prev => [newNotice, ...prev]);
  }, []);
  
  const removeNotice = useCallback((noticeId: string) => {
    setNotices(prev => prev.filter(n => n.id !== noticeId));
  }, []);

  const toggleFeeStatus = useCallback((feeId: string) => {
    setFees(prevFees => prevFees.map(f => {
      if (f.id === feeId) {
        return { ...f, status: f.status === FeeStatus.PAID ? FeeStatus.PENDING : FeeStatus.PAID, date: new Date().toISOString().split('T')[0] };
      }
      return f;
    }));
  }, []);
  
  const updateFee = useCallback((feeId: string, updatedData: Partial<Omit<FeePayment, 'id'>>) => {
    setFees(prevFees => prevFees.map(f =>
      f.id === feeId ? { ...f, ...updatedData, date: new Date().toISOString().split('T')[0] } : f
    ));
  }, []);

  const generateMonthlyFees = useCallback((month: string, year: number) => {
    const today = new Date();
    const newFees: FeePayment[] = [];

    students.forEach(student => {
        const hasFeeForSelectedPeriod = fees.some(f => f.studentId === student.id && f.month === month && f.year === year);
        if (!hasFeeForSelectedPeriod) {
            const room = rooms.find(r => r.id === student.roomId);
            let amount = 7000; // default for Penta
            if (room?.type === RoomType.QUAD) amount = 8000;

            newFees.push({
                id: `f${Date.now()}${student.id}`,
                studentId: student.id,
                amount,
                date: today.toISOString().split('T')[0],
                status: FeeStatus.PENDING,
                month: month,
                year: year
            });
        }
    });

    if (newFees.length > 0) {
        setFees(prev => [...prev, ...newFees]);
        alert(`${newFees.length} new fee records have been generated for ${month}, ${year}.`);
    } else {
        alert(`All students already have fee records for ${month}, ${year}.`);
    }
  }, [students, fees, rooms]);

  const addExpense = useCallback((expense: Omit<Expense, 'id' | 'date'>) => {
    const newExpense: Expense = {
      ...expense,
      id: `e${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    setExpenses(prev => [newExpense, ...prev]);
  }, []);

  const removeExpense = useCallback((expenseId: string) => {
    setExpenses(prev => prev.filter(e => e.id !== expenseId));
  }, []);
  
  return {
    rooms,
    students,
    fees,
    notices,
    users,
    teamMembers,
    expenses,
    addStudent,
    removeStudent,
    updateStudent,
    addRoom,
    removeRoom,
    addNotice,
    removeNotice,
    toggleFeeStatus,
    generateMonthlyFees,
    addExpense,
    removeExpense,
    updateFee,
  };
};