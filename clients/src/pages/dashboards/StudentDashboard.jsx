
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  BookOpen, GraduationCap, Calendar, Clock, 
  CheckCircle2, FileText, Library, Award,
  BellRing, User
} from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const StudentDashboard = () => {
  const [timeRange, setTimeRange] = useState('week');
  
  // Sample data - in a real app, this would come from an API
  const attendanceData = [
    { month: 'Jan', present: 20, absent: 2 },
    { month: 'Feb', present: 18, absent: 4 },
    { month: 'Mar', present: 22, absent: 0 },
    { month: 'Apr', present: 20, absent: 2 },
    { month: 'May', present: 21, absent: 1 },
    { month: 'Jun', present: 19, absent: 3 },
  ];

  const gradeData = [
    { subject: 'Math', grade: 85 },
    { subject: 'Science', grade: 92 },
    { subject: 'History', grade: 78 },
    { subject: 'English', grade: 88 },
    { subject: 'Art', grade: 95 },
  ];

  const assignmentData = [
    { status: 'Completed', value: 18 },
    { status: 'In Progress', value: 5 },
    { status: 'Pending', value: 3 },
  ];

  const upcomingExams = [
    { name: 'Advanced Mathematics', date: '2023-07-15', time: '10:00 AM' },
    { name: 'Computer Science', date: '2023-07-18', time: '2:00 PM' },
    { name: 'Physics', date: '2023-07-22', time: '9:00 AM' },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  return (
    <div className="container px-4 mx-auto max-w-7xl py-8 mt-20">
      <h1 className="text-3xl font-bold mb-2">Student Dashboard</h1>
      <p className="text-muted-foreground mb-6">Welcome to your academic portal. Track your progress, assignments, and upcoming events.</p>
      
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

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <Progress value={92} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              4% higher than class average
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">GPA</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.8</div>
            <Progress value={95} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              Top 10% of your class
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Course Completion</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <Progress value={68} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              On track for graduation
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Books Borrowed</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground mt-1">
              2 due next week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts & Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <CardTitle>Attendance History</CardTitle>
            </div>
            <CardDescription>Monthly attendance record</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={attendanceData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="present" fill="#8884d8" name="Present" />
                  <Bar dataKey="absent" fill="#FF8042" name="Absent" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle>Assignment Status</CardTitle>
            </div>
            <CardDescription>Overview of your assignments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <div className="w-full md:w-3/4 h-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={assignmentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {assignmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subject Performance */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            <CardTitle>Academic Performance</CardTitle>
          </div>
          <CardDescription>Your grades by subject</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={gradeData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="grade"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                  name="Grade"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Upcoming Events */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <CardTitle>Upcoming Exams</CardTitle>
          </div>
          <CardDescription>Prepare for these exams</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingExams.map((exam, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-3">
                <div>
                  <h3 className="font-medium">{exam.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(exam.date).toLocaleDateString()} at {exam.time}
                  </p>
                </div>
                <Badge variant="outline" className="bg-primary/10">
                  {Math.floor((new Date(exam.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">My Books</h2>
          <p className="text-gray-600 mb-4">Manage your borrowed books</p>
          <a href="/my-books" className="text-primary hover:underline">View My Books →</a>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Book Catalog</h2>
          <p className="text-gray-600 mb-4">Browse available books</p>
          <a href="/books" className="text-primary hover:underline">Browse Books →</a>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Appointments</h2>
          <p className="text-gray-600 mb-4">Schedule and manage appointments</p>
          <a href="/appointments" className="text-primary hover:underline">Manage Appointments →</a>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Attendance</h2>
          <p className="text-gray-600 mb-4">View your attendance records</p>
          <a href="/attendance" className="text-primary hover:underline">View Attendance →</a>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Profile</h2>
          <p className="text-gray-600 mb-4">Update your profile information</p>
          <a href="/profile" className="text-primary hover:underline">View Profile →</a>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Notifications</h2>
          <p className="text-gray-600 mb-4">Check your notifications</p>
          <a href="/notifications" className="text-primary hover:underline">View Notifications →</a>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;