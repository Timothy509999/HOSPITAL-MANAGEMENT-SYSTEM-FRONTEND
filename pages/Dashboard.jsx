import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({ name: '', age: '', ailment: '', password: '', email: '' });
  const [editId, setEditId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);

  // Use consistent API base URL
  const API_BASE = 'http://localhost:5000/patients';

  const fetchPatients = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get(API_BASE);
      setPatients(res.data);
      console.log("Patients API Response:", res.data);
    } catch (err) {
      let errorMsg = 'Operation failed';
      if (err.response?.data?.error) {
        errorMsg = err.response.data.error.includes('validation failed') 
          ? 'Please check all required fields'
          : err.response.data.error;
      }
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const patientData = {
        name: form.name,
        age: Number(form.age),
        ailment: form.ailment,
        email: form.email,
        password: form.password
      };
  
      if (editId) {
        if (!patientData.password) {
          delete patientData.password;
        }
        await axios.put(`${API_BASE}/${editId}`, patientData);
        toast.success('Patient updated successfully!');
      } else {
        await axios.post(API_BASE, patientData);
        toast.success('Patient added successfully!');
      }
  
      setForm({ name: '', age: '', ailment: '', email: '', password: '' });
      setEditId(null);
      await fetchPatients();
      
    } catch (err) {
      let errorMsg = 'Operation failed';
      if (err.response?.data?.error) {
        errorMsg = err.response.data.error
          .replace('Patient validation failed:', '')
          .replace(/Path\s`[a-z]+`\sis\srequired\./g, 'Missing required fields');
      }
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setPatientToDelete(id);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/patients/${patientToDelete}`);
      setPatients(patients.filter(patient => patient._id !== patientToDelete));
      toast.success('Patient deleted successfully!');
    } catch (err) {
      setError('Failed to delete patient');
      toast.error(err.response?.data?.error || 'Failed to delete patient');
      console.error(err);
      fetchPatients();
    } finally {
      setShowConfirmModal(false);
      setPatientToDelete(null);
    }
  };

  const handleEdit = (patient) => {
    setForm({ name: patient.name, age: patient.age, ailment: patient.ailment, email: patient.email, password: '' });
    setEditId(patient._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-200 via-pink-300 to-pink-400 py-8 px-4">
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-pink-300 py-4 px-6">
          <h1 className="text-2xl font-bold text-white">Hospital Management System</h1>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
            <p>{error}</p>
          </div>
        )}

        <div className="p-6 border-b border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <input 
                  type="text" 
                  placeholder="Name" 
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })} 
                  required 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>
              <div>
                <input
                  type="email" 
                  placeholder="Email" 
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })} 
                  required 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <input
                  type="password" 
                  placeholder="Password" 
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })} 
                  required 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <input 
                  type="number" 
                  placeholder="Age" 
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })} 
                  required 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>
              <div>
                <input 
                  type="text" 
                  placeholder="Ailment" 
                  value={form.ailment}
                  onChange={(e) => setForm({ ...form, ailment: e.target.value })} 
                  required 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>
            </div>
            <button 
              type="submit" 
              disabled={isLoading}
              className={`bg-pink-300 hover:bg-pink-600 text-white font-medium py-2 px-4 rounded-md transition duration-200 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Processing...' : editId ? 'Update Patient' : 'Add Patient'}
            </button>
          </form>
        </div>

        <div className="overflow-x-auto">
          {isLoading && !patients.length ? (
            <div className="p-6 text-center">Loading patients...</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ailment</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {patients.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.age}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.ailment}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button 
                        onClick={() => handleEdit(p)} 
                        disabled={isLoading}
                        className="text-yellow-600 hover:text-yellow-900 disabled:opacity-50"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(p._id)} 
                        disabled={isLoading}
                        className="text-pink-600 hover:text-red-900 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full">
            <h3 className="text-lg font-medium mb-4">Confirm Deletion</h3>
            <p className="mb-4">Are you sure you want to delete this patient?</p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-pink-600 transparent text-white rounded-md hover:bg-pink-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
