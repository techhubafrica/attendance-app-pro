import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSelector } from 'react-redux';

const EmployeeDashboard = () => {
  const { employees } = useSelector((state) => state.employees);

  // Calculate statistics
  const totalEmployees = employees.length;
  const totalSalary = employees.reduce((sum, emp) => sum + (emp.salary || 0), 0);
  const totalBonus = employees.reduce((sum, emp) => sum + (emp.bonus || 0), 0);
  const avgSalary = totalEmployees ? (totalSalary / totalEmployees).toFixed(2) : 0;

  // Prepare data for department chart
  const departmentData = employees.reduce((acc, emp) => {
    const deptName = emp.department?.name || 'Unknown';
    if (!acc[deptName]) {
      acc[deptName] = { name: deptName, count: 0, totalSalary: 0 };
    }
    acc[deptName].count += 1;
    acc[deptName].totalSalary += (emp.salary || 0);
    return acc;
  }, {});

  const departmentChartData = Object.values(departmentData);

  // Prepare data for company chart
  const companyData = employees.reduce((acc, emp) => {
    const companyName = emp.company?.name || 'Unknown';
    if (!acc[companyName]) {
      acc[companyName] = { name: companyName, count: 0 };
    }
    acc[companyName].count += 1;
    return acc;
  }, {});

  const companyChartData = Object.values(companyData);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Employee Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Employees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmployees}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Salary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSalary.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Bonus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBonus.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Salary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${avgSalary}</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="departments" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="departments">By Department</TabsTrigger>
          <TabsTrigger value="companies">By Company</TabsTrigger>
        </TabsList>
        
        <TabsContent value="departments">
          <Card>
            <CardHeader>
              <CardTitle>Employee Distribution by Department</CardTitle>
              <CardDescription>
                Number of employees and total salary by department
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {departmentChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={departmentChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--chart-1))" />
                      <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--chart-2))" />
                      <Tooltip />
                      <Bar yAxisId="left" dataKey="count" name="Employees" fill="hsl(var(--chart-1))" />
                      <Bar yAxisId="right" dataKey="totalSalary" name="Total Salary" fill="hsl(var(--chart-2))" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No department data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="companies">
          <Card>
            <CardHeader>
              <CardTitle>Employee Distribution by Company</CardTitle>
              <CardDescription>
                Number of employees in each company
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {companyChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={companyChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" name="Employees" fill="hsl(var(--chart-3))" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No company data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeeDashboard;