export enum FrequencyType {
  HOURLY = 'HOURLY',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
}

// FIX: Added missing type definitions for login and signup payloads.
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  userName: string;
  email: string;
  password: string;
}

export interface User {
  userName: string;
}

export interface AuthResponse extends User {
  jwtToken: string;
}

export interface MedicineBase {
  medicineName: string;
  dosage: string;
  description: string;
  frequencyType: FrequencyType;
  frequencyInterval: number;
}

export interface AddMedicinePayload extends MedicineBase {
  startTime: string; // ISO format
  endTime: string; // ISO format
}

export interface MedicineResponse extends MedicineBase {
  medicineId: number;
  nextDoseTime: string; // ISO format
  endTime: string; // ISO format
}

export interface DashboardData {
  userName: string;
  userEmail: string;
  totalMedicines: number;
  activeMedicines: number;
  completedMedicines: number;
  nextDoseTime: string | null; // ISO format
  upcomingMedicines: MedicineResponse[];
}

export interface ApiError {
  message: string;
}
