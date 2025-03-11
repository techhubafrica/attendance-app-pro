import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { addFaculty, updateFaculty } from "@/redux/actions/facultyActions";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { Loader2 } from "lucide-react";

const FacultyModal = ({ isOpen, onClose, editData = null }) => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.faculties);
  const { employees } = useAppSelector((state) => state.employees);

  const [formData, setFormData] = useState({
    facultyName: "",
    employee: "",
    isAdmin: false,
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        facultyName: editData.facultyName || "",
        employee: editData.employee?._id || "",
        isAdmin: editData.isAdmin || false,
      });
    } else {
      setFormData({
        facultyName: "",
        employee: "",
        isAdmin: false,
      });
    }
  }, [editData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (checked) => {
    setFormData((prev) => ({
      ...prev,
      isAdmin: checked,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.facultyName || !formData.employee) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      if (editData) {
        await dispatch(updateFaculty(editData._id, formData));
      } else {
        await dispatch(addFaculty(formData));
      }
      onClose();
    } catch (error) {
      console.error("Error saving faculty:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editData ? "Edit Faculty" : "Add New Faculty"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="facultyName">Faculty Name</Label>
            <Input
              id="facultyName"
              name="facultyName"
              value={formData.facultyName}
              onChange={handleChange}
              placeholder="Enter faculty name"
             
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="employee">Select A Faculty Head</Label>
            <Select
              value={formData.employee}
              onValueChange={(value) => handleSelectChange("employee", value)}
              className={"cursor-pointer"}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an employee" />
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto">
                {employees &&
                  employees.map((employee) => (
                    <SelectItem key={employee._id} value={employee._id} className={"cursor-pointer"}>
                      {employee.user.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isAdmin"
              checked={formData.isAdmin}
              onCheckedChange={handleCheckboxChange}
              className={"cursor-pointer"}
            />
            <Label htmlFor="isAdmin" className={"cursor-pointer"}>Lab Administrator Access</Label>
          </div>

          <DialogFooter className="sm:justify-end">
            <DialogClose asChild>
              <Button type="button" variant="outline" className={"cursor-pointer"}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading} className={"text-sm font-medium text-white bg-green-700 hover:bg-green-800 border border-transparent rounded-md group cursor-pointer"}>
              {isLoading ?  <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </> : editData ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FacultyModal;
