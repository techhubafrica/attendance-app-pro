import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, Building2, Clock, BookOpen, CalendarClock, 
  BarChart3, PieChart as PieChartIcon, TrendingUp, Activity
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState('week');

  // Sample data for charts
  const attendanceData = [
    { day: 'Mon', present: 120, absent: 10, late: 5 },
    { day: 'Tue', present: 115, absent: 15, late: 3 },
    { day: 'Wed', present: 110, absent: 12, late: 8 },
    { day: 'Thu', present: 118, absent: 8, late: 4 },
    { day: 'Fri', present: 125, absent: 5, late: 2 },
  ];

  const departmentData = [
    { name: 'Engineering', employees: 35, color: '#8884d8' },
    { name: 'Marketing', employees: 20, color: '#82ca9d' },
    { name: 'Design', employees: 15, color: '#ffc658' },
    { name: 'HR', employees: 10, color: '#ff8042' },
    { name: 'Finance', employees: 12, color: '#0088fe' },
  ];

  const bookLoanData = [
    { month: 'Jan', loans: 20, returns: 15 },
    { month: 'Feb', loans: 25, returns: 23 },
    { month: 'Mar', loans: 30, returns: 28 },
    { month: 'Apr', loans: 22, returns: 20 },
    { month: 'May', loans: 28, returns: 25 },
    { month: 'Jun', loans: 32, returns: 30 },
  ];

  const appointmentData = [
    { month: 'Jan', count: 45 },
    { month: 'Feb', count: 52 },
    { month: 'Mar', count: 48 },
    { month: 'Apr', count: 61 },
    { month: 'May', count: 55 },
    { month: 'Jun', count: 67 },
  ];

  const recentEmployees = [
    { id: 1, name: 'John Doe', department: 'Engineering', role: 'Software Developer', joinDate: '2023-06-15' },
    { id: 2, name: 'Jane Smith', department: 'Marketing', role: 'Marketing Specialist', joinDate: '2023-06-20' },
    { id: 3, name: 'Robert Johnson', department: 'Design', role: 'UI/UX Designer', joinDate: '2023-07-01' },
    { id: 4, name: 'Sarah Williams', department: 'HR', role: 'HR Manager', joinDate: '2023-07-10' },
  ];

  return (
    <div className="container px-4 mx-auto max-w-7xl py-8 mt-20">
      <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-muted-foreground mb-6">Welcome to your administrative dashboard. Monitor key metrics and manage resources.</p>
      
      <div className="mb-8 flex justify-between items-center">
        <Tabs defaultValue={timeRange} onValueChange={setTimeRange} className="w-[400px]">
          <TabsList>
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="month">This Month</TabsTrigger>
            <TabsTrigger value="quarter">This Quarter</TabsTrigger>
            <TabsTrigger value="year">This Year</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Stats Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92</div>
            <p className="text-xs text-muted-foreground">
              +5.2% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              +1 new department
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Book Inventory</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">523</div>
            <p className="text-xs text-muted-foreground">
              +12 new additions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Appointments</CardTitle>
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">67</div>
            <p className="text-xs text-muted-foreground">
              +15.3% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <CardTitle>Attendance Overview</CardTitle>
              </div>
            </div>
            <CardDescription>Daily attendance statistics</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={attendanceData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="present" fill="#8884d8" />
                  <Bar dataKey="absent" fill="#ff8042" />
                  <Bar dataKey="late" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PieChartIcon className="h-5 w-5 text-primary" />
                <CardTitle>Department Distribution</CardTitle>
              </div>
            </div>
            <CardDescription>Employee count by department</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="employees"
                  >
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <CardTitle>Book Loans</CardTitle>
              </div>
            </div>
            <CardDescription>Monthly book loan trends</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={bookLoanData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="loans" stroke="#8884d8" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="returns" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                <CardTitle>Appointment Trends</CardTitle>
              </div>
            </div>
            <CardDescription>Monthly appointment statistics</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={appointmentData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="count" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Employees Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <CardTitle>Recently Added Employees</CardTitle>
          </div>
          <CardDescription>New employees who joined recently</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Join Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.name}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{employee.role}</TableCell>
                  <TableCell>{new Date(employee.joinDate).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Employees</h2>
          <p className="text-gray-600 mb-4">Manage your organization's employees</p>
          <a href="/admin/employees" className="text-primary hover:underline">View Employees →</a>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Departments</h2>
          <p className="text-gray-600 mb-4">Manage departments and teams</p>
          <a href="/admin/departments" className="text-primary hover:underline">View Departments →</a>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Attendance</h2>
          <p className="text-gray-600 mb-4">Track employee attendance records</p>
          <a href="/admin/attendance" className="text-primary hover:underline">View Attendance →</a>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Companies</h2>
          <p className="text-gray-600 mb-4">Manage company information</p>
          <a href="/admin/companies" className="text-primary hover:underline">View Companies →</a>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Books</h2>
          <p className="text-gray-600 mb-4">Manage book inventory and loans</p>
          <a href="/admin/books" className="text-primary hover:underline">View Books →</a>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Appointments</h2>
          <p className="text-gray-600 mb-4">Manage scheduled appointments</p>
          <a href="/admin/appointments" className="text-primary hover:underline">View Appointments →</a>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;