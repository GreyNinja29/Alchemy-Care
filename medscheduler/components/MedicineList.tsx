
import React from 'react';
import type { MedicineResponse } from '../types';
import { Trash } from './icons';

interface MedicineListProps {
  medicines: MedicineResponse[];
  onDelete: (medicineId: number) => void;
}

const MedicineList: React.FC<MedicineListProps> = ({ medicines, onDelete }) => {
    
    const formatDate = (isoString: string) => new Date(isoString).toLocaleDateString();

    const formatFrequency = (type: string, interval: number) => {
        switch (type) {
            case 'HOURLY':
                return `Every ${interval} hour(s)`;
            case 'DAILY':
                return `Every ${interval} day(s)`;
            case 'WEEKLY':
                return `Every ${interval} week(s)`;
            default:
                return 'N/A';
        }
    }
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">All Medications</h2>
        {medicines.length === 0 ? (
            <p className="text-gray-500 text-center py-8">You haven't added any medicines yet.</p>
        ) : (
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dosage</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Delete</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {medicines.map((med) => (
                            <tr key={med.medicineId} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{med.medicineName}</div>
                                    <div className="text-sm text-gray-500">{med.description}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{med.dosage}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatFrequency(med.frequencyType, med.frequencyInterval)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(med.endTime)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => onDelete(med.medicineId)} className="text-red-600 hover:text-red-900">
                                        <Trash className="w-5 h-5"/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
    </div>
  );
};

export default MedicineList;
