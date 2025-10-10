import type { LoginRequest, SignupRequest, AuthResponse, DashboardData, AddMedicinePayload, MedicineResponse, ApiError } from '../types';

const BASE_URL = 'http://localhost:8080';

// FIX: Corrected the async function to properly return the JSON payload promise, preventing a nested Promise return type.
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData: ApiError = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export const apiLogin = (credentials: LoginRequest): Promise<AuthResponse> => {
  return fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
    // FIX: Used a lambda to help TypeScript infer the generic type for handleResponse.
  }).then(response => handleResponse(response));
};

export const apiSignup = (details: SignupRequest): Promise<AuthResponse> => {
  return fetch(`${BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(details),
    // FIX: Used a lambda to help TypeScript infer the generic type for handleResponse.
  }).then(response => handleResponse(response));
};

export const getDashboardData = (token: string): Promise<DashboardData> => {
  return fetch(`${BASE_URL}/api/user/dashboard`, {
    headers: { 'Authorization': `Bearer ${token}` },
    // FIX: Used a lambda to help TypeScript infer the generic type for handleResponse.
  }).then(response => handleResponse(response));
};

export const getAllMedicines = (token: string): Promise<MedicineResponse[]> => {
    return fetch(`${BASE_URL}/api/medicines/all`, {
      headers: { 'Authorization': `Bearer ${token}` },
      // FIX: Used a lambda to help TypeScript infer the generic type for handleResponse.
    }).then(response => handleResponse(response));
};

export const addMedicine = (token: string, medicine: AddMedicinePayload): Promise<MedicineResponse> => {
  return fetch(`${BASE_URL}/api/medicines`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(medicine),
    // FIX: Used a lambda to help TypeScript infer the generic type for handleResponse.
  }).then(response => handleResponse(response));
};

export const deleteMedicine = (token: string, medicineId: number): Promise<void> => {
    return fetch(`${BASE_URL}/api/medicines/${medicineId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    }).then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete medicine');
        }
        // DELETE might not return a body, so we don't call handleResponse
    });
};
