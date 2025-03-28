import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Pencil,
  Trash2,
  Plus,
  User,
  DollarSign,
  Building2,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import {
  deleteEmployee,
  fetchEmployees,
  fetchUsers,
} from "@/redux/actions/employeeActions";
import EmployeeModal from "@/components/EmployeeModal";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { fetchDepartments } from "@/redux/actions/departmentActions";
import { fetchCompanies } from "@/redux/actions/companyActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Employees = () => {
  const dispatch = useAppDispatch();
  const { employees, users, isLoading, success } = useAppSelector(
    (state) => state.employees
  );
  const navigate = useNavigate();
  const { companies } = useAppSelector((state) => state.companies);
  const { departments } = useAppSelector((state) => state.departments);
  const { user } = useAppSelector((state) => state.auth);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");

  useEffect(() => {
    dispatch(fetchEmployees());
    dispatch(fetchUsers());
    dispatch(fetchDepartments());
    dispatch(fetchCompanies());
  }, [dispatch]);

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteEmployee(id));
      toast.success("Employee deleted successfully");
    } catch (error) {
      toast.error(error.message || "Failed to delete employee");
    }
  };

  const handleCloseAddDialog = () => {
    setIsAddDialogOpen(false);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedEmployee(null);
  };

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment =
      filterDepartment === "" ||
      employee.department?.departmentName?.toLowerCase() ===
        filterDepartment.toLowerCase();

    return matchesSearch && matchesDepartment;
  });

  const getEmployeeStats = () => {
    // Calculate stats from employees data
    const totalEmployees = employees.length;
    const departmentCounts = employees.reduce((acc, emp) => {
      const dept = emp.department?.departmentName || "Unassigned";
      acc[dept] = (acc[dept] || 0) + 1;
      return acc;
    }, {});

    const avgSalary =
      employees.length > 0
        ? employees.reduce((sum, emp) => sum + emp.salary, 0) / employees.length
        : 0;

    return { totalEmployees, departmentCounts, avgSalary };
  };

  const stats = getEmployeeStats();

  return (
    <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 py-8 min-h-screen mt-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-blue-800 mb-1">
            Employee Management
          </h1>
          <p className="text-green-700">Manage your organization's workforce</p>
        </div>
        {user?.role === "admin" && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 shadow-md mt-4 md:mt-0 cursor-pointer">
                <Plus size={16} />
                Add Employee
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Employee</DialogTitle>
              </DialogHeader>
              {isAddDialogOpen && (
                <EmployeeModal
                  onClose={handleCloseAddDialog}
                  users={users}
                  departments={departments}
                  companies={companies}
                />
              )}
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-blue-200 shadow-md bg-gradient-to-r from-blue-50 to-blue-100">
          <CardContent className="flex items-center p-6">
            <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center mr-4">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Employees</p>
              <h3 className="text-2xl font-bold text-blue-800">
                {stats.totalEmployees}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 shadow-md bg-gradient-to-r from-green-50 to-green-100">
          <CardContent className="flex items-center p-6">
            <div className="h-12 w-12 rounded-full bg-green-600 flex items-center justify-center mr-4">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Average Salary</p>
              <h3 className="text-2xl font-bold text-green-800">
                ₵
                {stats.avgSalary.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 shadow-md bg-gradient-to-r from-blue-50 to-green-100">
          <CardContent className="flex items-center p-6">
            <div className="h-12 w-12 rounded-full bg-blue-800 flex items-center justify-center mr-4">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Departments</p>
              <h3 className="text-2xl font-bold text-blue-800">
                {Object.keys(stats.departmentCounts).length}
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="border-blue-200 shadow-md mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Search Employees
              </label>
              <input
                type="text"
                id="search"
                placeholder="Search by name or email..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="md:w-1/4">
              <label
                htmlFor="department"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Filter by Department
              </label>
              <select
                id="department"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept.departmentName}>
                    {dept.departmentName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {filteredEmployees.length === 0 ? (
        <Card className="border-blue-200 shadow-md">
          <CardContent className="flex flex-col items-center justify-center p-12">
            <Users className="w-16 h-16 text-blue-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Employees Found
            </h3>
            <p className="text-gray-500 mb-6 text-center max-w-md">
              {employees.length === 0
                ? "No employees in the system yet. Add your first employee to get started."
                : "No employees match your search criteria. Try adjusting your filters."}
            </p>
            {user?.role === "admin" && employees.length === 0 && (
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus size={16} className="mr-2" />
                Add Your First Employee
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="border-blue-200 shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gradient-to-r from-blue-100 to-green-100">
                <TableRow>
                  <TableHead className="text-blue-800 font-semibold">
                    Employee
                  </TableHead>
                  <TableHead className="text-blue-800 font-semibold">
                    Department
                  </TableHead>
                  <TableHead className="text-blue-800 font-semibold">
                    Company
                  </TableHead>
                  <TableHead className="text-blue-800 font-semibold">
                    Salary
                  </TableHead>
                  <TableHead className="text-blue-800 font-semibold">
                    Bonus
                  </TableHead>
                  <TableHead className="text-right text-blue-800 font-semibold">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow
                    key={employee._id}
                    className="hover:bg-blue-50 transition-colors"
                  >
                    <TableCell>
                      <Link
                        to={`/employee/${employee._id}`}
                        className="flex items-center"
                      >
                        <Avatar className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-green-400 flex items-center justify-center text-white font-bold mr-3">
                          <AvatarImage
                            src={employee.user?.avatar || ""}
                            alt={employee.user?.name?.charAt(0) || ""}
                          />
                          <AvatarFallback className={"text-blue-500"}>
                            {employee.user?.name?.[0]?.toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-blue-800 capitalize hover:text-blue-600">
                            {employee.user?.name || "N/A"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {employee.user?.email}
                          </div>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border border-blue-200 capitalize">
                        <Users size={14} className="mr-1" />
                        {employee.department?.departmentName || "Unassigned"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border border-green-200 capitalize">
                        <Building2 size={14} className="mr-1" />
                        {employee.company?.companyName || "Unassigned"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      ₵{employee.salary.toLocaleString()}
                    </TableCell>
                    <TableCell className="font-medium">
                      ₵{employee.bonus.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/employee/${employee._id}`)}
                          className="border-blue-300 text-blue-600 hover:bg-blue-50 cursor-pointer"
                        >
                          View
                        </Button>
                        {user?.role === "admin" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(employee)}
                              className="border-blue-300 text-blue-600 hover:bg-blue-50 cursor-pointer"
                            >
                              <Pencil size={14} className="mr-1" />
                              Edit
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  className="bg-red-500 hover:bg-red-600 text-white cursor-pointer"
                                >
                                  <Trash2 size={14} className="mr-1" />
                                  Delete
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="border-red-200">
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Are you sure?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will
                                    permanently delete the employee record for{" "}
                                    {employee.user?.name}.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="cursor-pointer">
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(employee._id)}
                                    className="bg-red-500 hover:bg-red-600 text-white cursor-pointer"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      {/* Edit Employee Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
          </DialogHeader>
          {selectedEmployee ? (
            <EmployeeModal
              employee={selectedEmployee}
              onClose={handleCloseEditDialog}
              isEditing={true}
              users={users}
              departments={departments}
              companies={companies}
              isLoading={isLoading}
              success={success}
            />
          ) : (
            <div className="flex justify-center p-6">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Employees;
