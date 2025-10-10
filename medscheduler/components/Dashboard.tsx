
import React, { useState, useEffect, useCallback } from 'react';
import { getDashboardData, getAllMedicines, deleteMedicine, addMedicine } from '../services/api';
import type { DashboardData, MedicineResponse, AddMedicinePayload } from '../types';
import AddMedicineModal from './AddMedicineModal';
import MedicineList from './MedicineList';
import { Pill, Calendar, CheckCircle, Clock } from './icons';

const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string | number; color: string }> = ({ icon, title, value, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4">
    <div className={`rounded-full p-3 ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);


const Dashboard: React.FC<{ token: string }> = ({ token }) => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [allMedicines, setAllMedicines] = useState<MedicineResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [dashData, medData] = await Promise.all([
          getDashboardData(token),
          getAllMedicines(token)
      ]);
      setDashboardData(dashData);
      setAllMedicines(medData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddMedicine = async (medicine: AddMedicinePayload) => {
    try {
      await addMedicine(token, medicine);
      setIsModalOpen(false);
      fetchData(); // Refresh data
    } catch (err: any) {
      alert(`Error adding medicine: ${err.message}`);
    }
  };

  const handleDeleteMedicine = async (medicineId: number) => {
    if (window.confirm('Are you sure you want to delete this medicine?')) {
      try {
        await deleteMedicine(token, medicineId);
        fetchData(); // Refresh data
      } catch (err: any) {
        alert(`Error deleting medicine: ${err.message}`);
      }
    }
  };

  const formatNextDose = (isoString: string | null) => {
    if (!isoString) return 'No upcoming doses';
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="text-center p-10">
        <div className="w-12 h-12 mx-auto border-4 border-blue-500 border-solid rounded-full animate-spin border-t-transparent"></div>
        <p className="mt-4 text-gray-600">Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-center p-10 text-red-500 bg-red-100 rounded-lg">{error}</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-slate-800">Your Dashboard</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Pill className="w-5 h-5 mr-2" />
            Add Medicine
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={<Pill className="w-6 h-6 text-blue-800"/>} title="Total Medicines" value={dashboardData?.totalMedicines ?? 0} color="bg-blue-100" />
            <StatCard icon={<Calendar className="w-6 h-6 text-green-800"/>} title="Active" value={dashboardData?.activeMedicines ?? 0} color="bg-green-100" />
            <StatCard icon={<CheckCircle className="w-6 h-6 text-purple-800"/>} title="Completed" value={dashboardData?.completedMedicines ?? 0} color="bg-purple-100" />
            <div className="bg-white p-6 rounded-xl shadow-md col-span-1 sm:col-span-2 lg:col-span-1 flex items-center space-x-4">
                <div className="rounded-full p-3 bg-yellow-100">
                    <Clock className="w-6 h-6 text-yellow-800"/>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Next Dose</p>
                    <p className="text-lg font-bold text-gray-800">{formatNextDose(dashboardData?.nextDoseTime ?? null)}</p>
                </div>
            </div>
        </div>
      </div>
      
      <MedicineList 
        medicines={allMedicines} 
        onDelete={handleDeleteMedicine}
      />

      <AddMedicineModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddMedicine={handleAddMedicine}
      />
    </div>
  );
};

export default Dashboard;
