import React, { useState } from 'react';
import { FrequencyType } from '../types';
import type { AddMedicinePayload } from '../types';

interface AddMedicineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMedicine: (medicine: AddMedicinePayload) => Promise<void>;
}

const AddMedicineModal: React.FC<AddMedicineModalProps> = ({ isOpen, onClose, onAddMedicine }) => {
  const [formData, setFormData] = useState<Omit<AddMedicinePayload, 'startTime' | 'endTime'> & { startTime: string, endTime: string, startTimeOfDay: string }>({
    medicineName: '',
    dosage: '',
    description: '',
    frequencyType: FrequencyType.DAILY,
    frequencyInterval: 1,
    startTime: new Date().toISOString().split('T')[0],
    endTime: '',
    startTimeOfDay: '08:00',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'frequencyInterval' ? parseInt(value, 10) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
        if (!formData.endTime) {
            throw new Error('End date is required.');
        }

        // By appending 'Z', we specify that the time is in UTC,
        // preventing the browser from converting it from the local timezone.
        const startDateTimeUTC = new Date(`${formData.startTime}T${formData.startTimeOfDay}:00.000Z`);
        const endDateTimeUTC = new Date(`${formData.endTime}T23:59:59.999Z`);

        if (startDateTimeUTC >= endDateTimeUTC) {
            throw new Error('Start date must be before end date.');
        }

        const { startTime, endTime, startTimeOfDay, ...restOfFormData } = formData;

        const payload: AddMedicinePayload = {
            ...restOfFormData,
            startTime: startDateTimeUTC.toISOString(),
            endTime: endDateTimeUTC.toISOString(),
        };
        await onAddMedicine(payload);
    } catch (err: any) {
        setError(err.message);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-8 m-4 max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Add New Medicine</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label htmlFor="medicineName" className="block text-sm font-medium text-gray-700">Medicine Name</label>
            <input type="text" name="medicineName" id="medicineName" required value={formData.medicineName} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>

          <div>
            <label htmlFor="dosage" className="block text-sm font-medium text-gray-700">Dosage (e.g., 1 pill, 10mg)</label>
            <input type="text" name="dosage" id="dosage" required value={formData.dosage} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea name="description" id="description" rows={2} value={formData.description} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="frequencyType" className="block text-sm font-medium text-gray-700">Frequency Type</label>
              <select name="frequencyType" id="frequencyType" value={formData.frequencyType} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                {Object.values(FrequencyType).map(type => <option key={type} value={type}>{type.charAt(0) + type.slice(1).toLowerCase()}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="frequencyInterval" className="block text-sm font-medium text-gray-700">Interval</label>
              <input type="number" name="frequencyInterval" id="frequencyInterval" min="1" required value={formData.frequencyInterval} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Date</label>
              <input type="date" name="startTime" id="startTime" required value={formData.startTime} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
             <div>
              <label htmlFor="startTimeOfDay" className="block text-sm font-medium text-gray-700">Time</label>
              <input type="time" name="startTimeOfDay" id="startTimeOfDay" required value={formData.startTimeOfDay} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
             <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">End Date</label>
              <input type="date" name="endTime" id="endTime" required value={formData.endTime} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>
          
          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200">Cancel</button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300">
                {isLoading ? 'Adding...' : 'Add Medicine'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMedicineModal;