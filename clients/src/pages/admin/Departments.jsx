import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDepartments,
  deleteDepartment,
} from "@/redux/actions/departmentActions";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { List, Plus, Pencil, Trash2, Search } from "lucide-react";
import DepartmentModal from "@/components/DepartmentModal";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const Departments = () => {
  const dispatch = useDispatch();
  const { departments, isLoading } = useSelector((state) => state.departments);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  const handleAddDepartment = () => {
    setIsEditing(false);
    setSelectedDepartment(null);
    setIsModalOpen(true);
  };

  const handleEditDepartment = (department) => {
    setIsEditing(true);
    setSelectedDepartment(department);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (department) => {
    setDepartmentToDelete(department);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (departmentToDelete) {
      await dispatch(deleteDepartment(departmentToDelete._id));
      setDeleteDialogOpen(false);
      setDepartmentToDelete(null);
      toast.success("Department deleted successfully");
    } else {
      toast.error("Failed to delete department");
    }
  };

  const filteredDepartments = departments.filter(
    (department) =>
      department.departmentName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (department.company?.companyName &&
        department.company.companyName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 py-8 min-h-screen mt-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-blue-800 mb-1">Department Management</h1>
          <p className="text-green-700">Manage your organization's departments</p>
        </div>
        <Button
          onClick={handleAddDepartment}
          className="flex items-center gap-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 shadow-md mt-4 md:mt-0"
        >
          <Plus size={16} />
          Add Department
        </Button>
      </div>

      <Card className="border-blue-200 shadow-md mb-6">
        <CardContent className="p-4">
          <div className="relative mb-4">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search departments..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-4 rounded-full border-primary border-t-transparent animate-spin"></div>
        </div>
      ) : filteredDepartments.length === 0 ? (
        <div className="py-10 text-center text-muted-foreground">
          {searchTerm
            ? "No departments match your search"
            : "No departments found. Add one to get started!"}
        </div>
      ) : (
        <Card className="border-blue-200 shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gradient-to-r from-blue-100 to-green-100">
                <TableRow>
                  <TableHead className="text-blue-800 font-semibold">Department Name</TableHead>
                  <TableHead className="text-blue-800 font-semibold">Company</TableHead>
                  <TableHead className="text-blue-800 font-semibold">Manager</TableHead>
                  <TableHead className="text-right text-blue-800 font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDepartments.map((department) => (
                  <TableRow
                    key={department._id}
                    className="hover:bg-blue-50 transition-colors"
                  >
                    <TableCell className="font-medium capitalize">
                      {department.departmentName}
                    </TableCell>
                    <TableCell className="capitalize">
                      {department.company?.companyName || "N/A"}
                    </TableCell>
                    <TableCell className="capitalize">
                      {department.manager?.user?.name || "Not Assigned"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditDepartment(department)}
                          className="border-blue-300 text-blue-600 hover:bg-blue-50"
                        >
                          <Pencil size={14} className="mr-1" />
                          Edit
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="bg-red-500 hover:bg-red-600 text-white"
                              onClick={() => handleDeleteClick(department)}
                            >
                              <Trash2 size={14} className="mr-1" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="border-red-200">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the department
                                {department.departmentName && ` "${department.departmentName}"`}.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="cursor-pointer">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={confirmDelete}
                                className="bg-red-500 hover:bg-red-600 text-white cursor-pointer"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      <DepartmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        department={selectedDepartment}
        isEditing={isEditing}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the department
              {departmentToDelete?.departmentName &&
                ` "${departmentToDelete.departmentName}"`}.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive text-white cursor-pointer"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Departments;