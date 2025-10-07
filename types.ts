export enum RoomType {
  QUAD = 'Four Person',
  PENTA = 'Five Person',
}

export enum RoomStatus {
  AVAILABLE = 'Available',
  OCCUPIED = 'Occupied',
}

export enum FeeStatus {
  PAID = 'Paid',
  PENDING = 'Pending',
}

export enum UserRole {
  ADMIN = 'Admin',
  RESIDENT = 'Resident',
}

export enum ExpenseCategory {
    UTILITIES = 'Utilities',
    MAINTENANCE = 'Maintenance',
    SALARIES = 'Salaries',
    SUPPLIES = 'Supplies',
    MISC = 'Miscellaneous'
}


export interface Room {
  id: string;
  roomNumber: string;
  type: RoomType;
  status: RoomStatus;
  studentIds: string[];
}

export interface Student {
  id: string;
  name: string;
  contact: string;
  emergencyContact: string;
  checkInDate: string;
  roomId: string | null;
  photoUrl?: string;
}

export interface FeePayment {
  id:string;
  studentId: string;
  amount: number;
  date: string;
  status: FeeStatus;
  month: string;
  year: number;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
}

export interface Expense {
    id: string;
    title: string;
    amount: number;
    date: string;
    category: ExpenseCategory;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  studentId?: string; // Links resident user to their student profile
}

export interface TeamMember {
    id: string;
    name: string;
    role: string;
    imageUrl: string;
}

export type View = 'dashboard' | 'rooms' | 'students' | 'billing' | 'notices' | 'assistant' | 'team' | 'report' | 'profile';