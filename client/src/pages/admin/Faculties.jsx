import React, { useEffect, useState } from "react";
import { fetchFaculties, deleteFaculty } from "@/redux/actions/facultyActions";
import { fetchEmployees } from "@/redux/actions/employeeActions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Plus, SearchIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import FacultyModal from "@/components/faculty/FacultyModal";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";

const Faculties = () => {
  const dispatch = useAppDispatch();
  const { faculties, isLoading } = useAppSelector((state) => state.faculties);

  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [facultyToDelete, setFacultyToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchFaculties());
    dispatch(fetchEmployees());
  }, [dispatch]);

  const handleAddNew = () => {
    setEditData(null);
    setShowModal(true);
  };

  const handleEdit = (faculty) => {
    setEditData(faculty);
    setShowModal(true);
  };

  const handleDelete = (faculty) => {
    setFacultyToDelete(faculty);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteFaculty(facultyToDelete._id));
      setShowDeleteDialog(false);
      setFacultyToDelete(null);
    } catch (error) {
      console.error("Error deleting faculty:", error);
    }
  };

  const filteredFaculties = faculties.filter(
    (faculty) =>
      faculty.facultyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faculty.employee?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-8 mt-30">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Faculty Members</h1>
        <p className="text-muted-foreground">
          Manage faculty members who have access to labs
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Faculty List</CardTitle>
            <Button onClick={handleAddNew} className={"text-sm font-medium text-white bg-green-700 hover:bg-green-800 border border-transparent rounded-md group cursor-pointer"}>
              <Plus className="mr-2 h-4 w-4" />
              Add New Faculty
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 relative">
            <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search faculty members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredFaculties.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No faculty members found</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Faculty Name</TableHead>
                    <TableHead>Faculty Head</TableHead>
                    <TableHead>Admin Status</TableHead>
                    <TableHead>Appointments</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFaculties.map((faculty) => (
                    <TableRow key={faculty._id}>
                      <TableCell className="font-medium">{faculty.facultyName}</TableCell>
                      <TableCell>
                        {faculty.employee?.user?.name || "Unknown"}
                      </TableCell>
                      <TableCell>
                        {faculty.isAdmin ? (
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-800"
                          >
                            Admin
                          </Badge>
                        ) : (
                          <Badge variant="outline">Regular</Badge>
                        )}
                      </TableCell>
                      <TableCell>{faculty.appointments?.length || 0}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(faculty)}
                          className={"cursor-pointer"}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white cursor-pointer bg-red-500 hover:bg-red-600"
                          onClick={() => handleDelete(faculty)}
                        >
                          <Trash2 className="h-4 w-4 text-white" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <FacultyModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        editData={editData}
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Faculty Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{facultyToDelete?.facultyName}"?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className={"cursor-pointer"}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="text-white bg-red-500 hover:bg-red-600 cursor-pointer"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Faculties;
