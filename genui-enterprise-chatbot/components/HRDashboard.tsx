'use client';

import { useState } from 'react';

interface Employee {
  id: number;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  hireDate: string;
  status: 'Active' | 'On Leave' | 'Inactive';
  salary: string;
}

const mockEmployees: Employee[] = [
  { id: 1, name: 'John Smith', position: 'Software Engineer', department: 'Engineering', email: 'john.smith@company.com', phone: '+1 (555) 0123', hireDate: '2023-01-15', status: 'Active', salary: '$95,000' },
  { id: 2, name: 'Sarah Johnson', position: 'HR Manager', department: 'Human Resources', email: 'sarah.johnson@company.com', phone: '+1 (555) 0124', hireDate: '2022-06-10', status: 'Active', salary: '$85,000' },
  { id: 3, name: 'Mike Chen', position: 'Sales Representative', department: 'Sales', email: 'mike.chen@company.com', phone: '+1 (555) 0125', hireDate: '2023-03-20', status: 'Active', salary: '$75,000' },
  { id: 4, name: 'Emma Davis', position: 'Marketing Specialist', department: 'Marketing', email: 'emma.davis@company.com', phone: '+1 (555) 0126', hireDate: '2023-07-01', status: 'On Leave', salary: '$70,000' },
  { id: 5, name: 'Robert Wilson', position: 'Financial Analyst', department: 'Finance', email: 'robert.wilson@company.com', phone: '+1 (555) 0127', hireDate: '2022-11-05', status: 'Active', salary: '$80,000' },
];

export default function HRDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const departments = ['All', 'Engineering', 'Human Resources', 'Sales', 'Marketing', 'Finance'];

  const filteredEmployees = mockEmployees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'All' || employee.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-green-600 bg-green-100';
      case 'On Leave': return 'text-yellow-600 bg-yellow-100';
      case 'Inactive': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8.5 11C10.7091 11 12.5 9.20914 12.5 7C12.5 4.79086 10.7091 3 8.5 3C6.29086 3 4.5 4.79086 4.5 7C4.5 9.20914 6.29086 11 8.5 11Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17 11L19 13L23 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Human Resources Dashboard</h2>
            <p className="text-slate-400">Manage employee data and HR operations</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-700">
            <div className="text-2xl font-bold text-primary">{mockEmployees.length}</div>
            <div className="text-sm text-slate-400">Total Employees</div>
          </div>
          <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-700">
            <div className="text-2xl font-bold text-green-600">{mockEmployees.filter(e => e.status === 'Active').length}</div>
            <div className="text-sm text-slate-400">Active</div>
          </div>
          <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-700">
            <div className="text-2xl font-bold text-yellow-600">{mockEmployees.filter(e => e.status === 'On Leave').length}</div>
            <div className="text-sm text-slate-400">On Leave</div>
          </div>
          <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-700">
            <div className="text-2xl font-bold text-secondary">{departments.length - 1}</div>
            <div className="text-sm text-slate-400">Departments</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search employees..."
              className="w-full py-3 px-4 rounded-lg bg-slate-950 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="py-3 px-4 rounded-lg bg-slate-950 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary text-white"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Employee Table */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-950/50">
              <tr>
                <th className="text-left py-4 px-6 text-white font-medium">Employee</th>
                <th className="text-left py-4 px-6 text-white font-medium">Position</th>
                <th className="text-left py-4 px-6 text-white font-medium">Department</th>
                <th className="text-left py-4 px-6 text-white font-medium">Status</th>
                <th className="text-left py-4 px-6 text-white font-medium">Hire Date</th>
                <th className="text-left py-4 px-6 text-white font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="border-t border-slate-700 hover:bg-slate-950/30 transition-colors">
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-medium text-white">{employee.name}</div>
                      <div className="text-sm text-slate-400">{employee.email}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-white">{employee.position}</td>
                  <td className="py-4 px-6 text-slate-400">{employee.department}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
                      {employee.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-400">{employee.hireDate}</td>
                  <td className="py-4 px-6">
                    <button 
                      className="text-primary hover:text-secondary text-sm font-medium"
                      onClick={() => setSelectedEmployee(employee)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Employee Detail Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full mx-4 border border-slate-700">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-white">Employee Details</h3>
              <button 
                onClick={() => setSelectedEmployee(null)}
                className="text-slate-400 hover:text-white"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-slate-400">Name</label>
                <p className="text-white">{selectedEmployee.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-400">Position</label>
                <p className="text-white">{selectedEmployee.position}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-400">Email</label>
                <p className="text-white">{selectedEmployee.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-400">Phone</label>
                <p className="text-white">{selectedEmployee.phone}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-400">Salary</label>
                <p className="text-white">{selectedEmployee.salary}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-400">Hire Date</label>
                <p className="text-white">{selectedEmployee.hireDate}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
