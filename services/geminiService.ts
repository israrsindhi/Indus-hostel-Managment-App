
import { GoogleGenAI, GenerateContentResponse, FunctionDeclaration, Type } from "@google/genai";
import { Room, Student, FeePayment } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const getStudentDetails: FunctionDeclaration = {
    name: "getStudentDetails",
    description: "Get details for a specific student by name or room number.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            name: { type: Type.STRING, description: "The name of the student." },
            roomNumber: { type: Type.STRING, description: "The room number of the student." }
        }
    }
};

const findAvailableRooms: FunctionDeclaration = {
    name: "findAvailableRooms",
    description: "Find available rooms, optionally filtered by room type.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            roomType: {
                type: Type.STRING,
                description: "The type of room to find (e.g., 'Single', 'Double')."
            }
        }
    }
};

const getStudentsWithPendingFees: FunctionDeclaration = {
    name: "getStudentsWithPendingFees",
    description: "Get a list of students who have pending fee payments.",
    parameters: { type: Type.OBJECT, properties: {} }
};

const getOccupancySummary: FunctionDeclaration = {
    name: "getOccupancySummary",
    description: "Get a summary of hostel occupancy statistics.",
    parameters: { type: Type.OBJECT, properties: {} }
};

const getMealTimings: FunctionDeclaration = {
    name: "getMealTimings",
    description: "Get the meal timings for the hostel mess.",
    parameters: { type: Type.OBJECT, properties: {} }
};


const tools = [{
    functionDeclarations: [getStudentDetails, findAvailableRooms, getStudentsWithPendingFees, getOccupancySummary, getMealTimings]
}];

export const getAssistantResponse = async (
  prompt: string,
  context: { rooms: Room[], students: Student[], fees: FeePayment[] }
): Promise<GenerateContentResponse> => {
  const fullPrompt = `
    Context:
    Hostel Data: ${JSON.stringify(context)}
    
    User Query:
    ${prompt}
    
    Based on the provided hostel data and the user query, please either answer directly or use the available tools to find the information.
    If a user (resident) asks about student details, only provide information about themself based on their studentId in the context. Do not reveal information about other students to a resident. Admins can see all information.
    `;
    
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: fullPrompt,
    config: {
        tools,
    }
  });

  return response;
};