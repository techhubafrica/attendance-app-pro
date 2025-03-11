import React, { useEffect, useState } from "react";
import {
  fetchRoboticsLabs,
  deleteRoboticsLab,
} from "@/redux/actions/roboticsLabActions";
import { fetchRegions } from "@/redux/actions/regionActions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
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
import RoboticsLabModal from "@/components/roboticsLab/RoboticsLabModal";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";

const RoboticsLabs = () => {
  const dispatch = useAppDispatch();
  const { labs, isLoading } = useAppSelector((state) => state.roboticsLabs);

  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [labToDelete, setLabToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchRoboticsLabs());
    dispatch(fetchRegions());
  }, [dispatch]);

  const handleAddNew = () => {
    setEditData(null);
    setShowModal(true);
  };

  const handleEdit = (lab) => {
    setEditData(lab);
    setShowModal(true);
  };

  const handleDelete = (lab) => {
    setLabToDelete(lab);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteRoboticsLab(labToDelete._id));
      setShowDeleteDialog(false);
      setLabToDelete(null);
    } catch (error) {
      console.error("Error deleting lab:", error);
    }
  };

  const filteredLabs = labs.filter(
    (lab) =>
      lab.labName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lab.region?.regionName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-8 mt-30">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Robotics Labs</h1>
        <p className="text-muted-foreground">
          Manage all robotics labs in the system
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Robotics Labs List</CardTitle>
            <Button onClick={handleAddNew} className={"text-sm font-medium text-white bg-green-700 hover:bg-green-800 border border-transparent rounded-md group cursor-pointer"}>
              <Plus className="mr-2 h-4 w-4" />
              Add New Lab
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 relative">
            <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search labs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredLabs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No robotics labs found</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lab Name</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>Appointments</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLabs.map((lab) => (
                    <TableRow key={lab._id}>
                      <TableCell>{lab.labName}</TableCell>
                      <TableCell>
                        {lab.region.length > 0
                          ? lab.region[0].regionName
                          : "Unknown"}
                        {lab.region.length > 0
                          ? `, ${lab.region[0].capital}`
                          : ""}
                      </TableCell>

                      <TableCell>{lab.appointments?.length || 0}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(lab)}
                          className={"cursor-pointer"}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white cursor-pointer bg-red-500 hover:bg-red-600"
                          onClick={() => handleDelete(lab)}
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

      <RoboticsLabModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        editData={editData}
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Robotics Lab</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{labToDelete?.labName}"? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
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

export default RoboticsLabs;
