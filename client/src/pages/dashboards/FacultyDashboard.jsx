
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  BookOpen, Users, Clock, CalendarClock, 
  BarChart3, TrendingUp, GraduationCap, BookCheck, 
  Activity, FileCheck
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const FacultyDashboard = () => {
  const [timeRange, setTimeRange] = useState('week');

  // Sample data for faculty dashboard
  const attendanceData = [
    { day: 'Mon', present: 45, absent: 5, late: 2 },
    { day: 'Tue', present: 42, absent: 8, late: 2 },
    { day: 'Wed', present: 38, absent: 10, late: 4 },
    { day: 'Thu', present: 44, absent: 6, late: 2 },
    { day: 'Fri', present: 40, absent: 9, late: 3 },
  ];

  const bookLoanData = [
    { month: 'Jan', count: 12 },
    { month: 'Feb', count: 15 },
    { month: 'Mar', count: 18 },
    { month: 'Apr', count: 14 },
    { month: 'May', count: 21 },
    { month: 'Jun', count: 19 },
  ];

  const gradeDistributionData = [
    { grade: 'A', count: 15 },
    { grade: 'B', count: 22 },
    { grade: 'C', count: 18 },
    { grade: 'D', count: 8 },
    { grade: 'F', count: 3 },
  ];

  const appointmentData = [
    { week: 'Week 1', count: 12 },
    { week: 'Week 2', count: 15 },
    { week: 'Week 3', count: 10 },
    { week: 'Week 4', count: 18 },
    { week: 'Week 5', count: 14 },
    { week: 'Week 6', count: 16 },
  ];

  const recentStudents = [
    { id: 1, name: 'Emma Johnson', course: 'Computer Science', grade: 'A', submissionDate: '2023-06-15' },
    { id: 2, name: 'Liam Smith', course: 'Data Structures', grade: 'B+', submissionDate: '2023-06-18' },
    { id: 3, name: 'Olivia Brown', course: 'Algorithms', grade: 'A-', submissionDate: '2023-06-20' },
    { id: 4, name: 'Noah Davis', course: 'Database Systems', grade: 'B', submissionDate: '2023-06-22' },
  ];

  return (
    <div className="container px-4 mx-auto max-w-7xl py-8 mt-20">
      <h1 className="text-3xl font-bold mb-2">Faculty Dashboard</h1>
      <p className="text-muted-foreground mb-6">Welcome to your faculty portal. Monitor student performance and manage educational resources.</p>
      
      <div className="mb-8 flex justify-between items-center">
        <Tabs defaultValue={timeRange} onValueChange={setTimeRange} className="w-[400px]">
          <TabsList>
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="month">This Month</TabsTrigger>
            <TabsTrigger value="semester">This Semester</TabsTrigger>
            <TabsTrigger value="year">This Year</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Stats Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">132</div>
            <p className="text-xs text-muted-foreground">
              +3.2% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Course Completion</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">
              +5% from last semester
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Book Loans</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78</div>
            <p className="text-xs text-muted-foreground">
              +12 new this week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Appointments</CardTitle>
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              8 scheduled today
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
                <CardTitle>Class Attendance</CardTitle>
              </div>
            </div>
            <CardDescription>Daily student attendance statistics</CardDescription>
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
                <GraduationCap className="h-5 w-5 text-primary" />
                <CardTitle>Grade Distribution</CardTitle>
              </div>
            </div>
            <CardDescription>Student performance overview</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={gradeDistributionData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="grade" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookCheck className="h-5 w-5 text-primary" />
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
                  <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
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
                <CardTitle>Student Appointments</CardTitle>
              </div>
            </div>
            <CardDescription>Weekly appointment statistics</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={appointmentData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="count" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Submissions Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-primary" />
            <CardTitle>Recent Assignment Submissions</CardTitle>
          </div>
          <CardDescription>Latest student submissions and grades</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Submission Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.course}</TableCell>
                  <TableCell>{student.grade}</TableCell>
                  <TableCell>{new Date(student.submissionDate).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Book Loans</h2>
          <p className="text-gray-600 mb-4">Manage student book loans and returns</p>
          <a href="/admin/book-loans" className="text-primary hover:underline">View Book Loans →</a>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Appointments</h2>
          <p className="text-gray-600 mb-4">Manage student appointments and meetings</p>
          <a href="/admin/appointments" className="text-primary hover:underline">View Appointments →</a>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Attendance</h2>
          <p className="text-gray-600 mb-4">Monitor student attendance records</p>
          <a href="/attendance" className="text-primary hover:underline">View Attendance →</a>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Grading</h2>
          <p className="text-gray-600 mb-4">Manage student grades and assessments</p>
          <a href="/grading" className="text-primary hover:underline">View Grading →</a>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Course Materials</h2>
          <p className="text-gray-600 mb-4">Upload and organize course materials</p>
          <a href="/course-materials" className="text-primary hover:underline">View Materials →</a>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Profile</h2>
          <p className="text-gray-600 mb-4">Manage your faculty profile</p>
          <a href="/profile" className="text-primary hover:underline">View Profile →</a>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;