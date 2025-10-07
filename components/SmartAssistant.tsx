
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { getAssistantResponse } from '../services/geminiService';
import { Room, Student, FeePayment, RoomStatus, User, UserRole } from '../types';

interface SmartAssistantProps {
  rooms: Room[];
  students: Student[];
  fees: FeePayment[];
  currentUser: User;
}

interface Message {
  sender: 'user' | 'bot';
  text: string | React.ReactNode;
}

export const SmartAssistant: React.FC<SmartAssistantProps> = ({ rooms, students, fees, currentUser }) => {
  const [messages, setMessages] = useState<Message[]>([{
      sender: 'bot',
      text: "Hello! I'm your hostel assistant. How can I help you today? You can ask things like 'Find an available single room', 'Who has pending fees?', or 'What are the meal timings?'"
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages]);
  
  const handleFunctionCall = useCallback((functionCall: { name?: string; args?: any }) => {
    const { name, args } = functionCall;
    if (!name) {
      return "I'm not sure how to handle that function call.";
    }
    switch(name) {
      case 'findAvailableRooms': {
        const roomType = args?.roomType;
        let available = rooms.filter(r => r.status === RoomStatus.AVAILABLE);
        if (roomType) {
          available = available.filter(r => r.type.toLowerCase() === roomType.toLowerCase());
        }
        if (available.length > 0) {
          return `I found the following available ${roomType || ''} rooms: ${available.map(r => r.roomNumber).join(', ')}.`;
        }
        return `Sorry, I couldn't find any available ${roomType || ''} rooms.`;
      }
      case 'getStudentDetails': {
        if (!args) {
          return `I couldn't find a student with that information.`;
        }
        const { name, roomNumber } = args;
        let student;
        if (name) {
          student = students.find(s => s.name.toLowerCase().includes(name.toLowerCase()));
        } else if (roomNumber) {
          const room = rooms.find(r => r.roomNumber === roomNumber);
          if (room && room.studentIds.length > 0) {
            student = students.find(s => s.id === room.studentIds[0]);
          }
        }
        if (student) {
          const room = rooms.find(r => r.id === student.roomId);
          return `Student: ${student.name}, Room: ${room?.roomNumber || 'N/A'}, Contact: ${student.contact}.`;
        }
        return `I couldn't find a student with that information.`;
      }
      case 'getStudentsWithPendingFees': {
        const pendingStudentIds = new Set(fees.filter(f => f.status === 'Pending').map(f => f.studentId));
        const pendingStudents = students.filter(s => pendingStudentIds.has(s.id));
        if (pendingStudents.length > 0) {
          return `Students with pending fees: ${pendingStudents.map(s => s.name).join(', ')}.`;
        }
        return "There are no students with pending fees.";
      }
      case 'getOccupancySummary': {
        const totalRooms = rooms.length;
        const occupied = rooms.filter(r => r.status === 'Occupied').length;
        const occupancyRate = totalRooms > 0 ? ((occupied / totalRooms) * 100).toFixed(1) : 0;
        return `There are ${totalRooms} total rooms. ${occupied} are occupied, making the occupancy rate ${occupancyRate}%.`;
      }
      case 'getMealTimings': {
        return "Meal timings are: Breakfast from 8:00 AM to 9:30 AM, Lunch from 1:00 PM to 3:00 PM, and Dinner from 8:00 PM to 9:30 PM.";
      }
      default:
        return "I'm not sure how to handle that function.";
    }
  }, [rooms, students, fees]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    const userMessage: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    let contextData = { rooms, students, fees };
    // For residents, restrict context to their own data
    if (currentUser.role === UserRole.RESIDENT && currentUser.studentId) {
        const residentStudent = students.find(s => s.id === currentUser.studentId);
        if (residentStudent) {
            const residentRoom = rooms.find(r => r.id === residentStudent.roomId);
            const residentFees = fees.filter(f => f.studentId === currentUser.studentId);
            contextData = {
                rooms: residentRoom ? [residentRoom] : [],
                students: [residentStudent],
                fees: residentFees,
            }
        }
    }


    try {
      const response = await getAssistantResponse(input, contextData);
      let botResponseText = "Sorry, I couldn't process that request.";

      if (response.functionCalls && response.functionCalls.length > 0) {
        botResponseText = handleFunctionCall(response.functionCalls[0]);
      } else {
        botResponseText = response.text;
      }
      
      const botMessage: Message = { sender: 'bot', text: botResponseText };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Gemini API error:", error);
      const errorMessage: Message = { sender: 'bot', text: "There was an error communicating with the AI. Please check the console." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 h-[calc(100vh-80px)] flex flex-col">
      <div className="flex-1 bg-white rounded-xl shadow-md p-4 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender === 'bot' && <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm flex-shrink-0">AI</div>}
            <div className={`max-w-lg p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-gray-200 text-dark rounded-bl-none'}`}>
              {msg.text}
            </div>
            {msg.sender === 'user' && <div className="w-8 h-8 rounded-full bg-blue-200 text-primary flex items-center justify-center font-bold text-sm flex-shrink-0">You</div>}
          </div>
        ))}
         {isLoading && (
            <div className="flex items-end gap-2 justify-start">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm flex-shrink-0">AI</div>
                <div className="max-w-lg p-3 rounded-2xl bg-gray-200 text-dark rounded-bl-none">
                    <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    </div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="flex items-center bg-white rounded-xl shadow-md p-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask the assistant..."
            className="flex-1 p-2 bg-transparent focus:outline-none"
            disabled={isLoading}
          />
          <button type="submit" className="bg-primary text-white p-2 rounded-lg disabled:bg-gray-400" disabled={isLoading}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};