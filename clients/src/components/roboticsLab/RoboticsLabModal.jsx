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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  addRoboticsLab,
  updateRoboticsLab,
} from "@/redux/actions/roboticsLabActions";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { Loader2 } from "lucide-react";

const RoboticsLabModal = ({ isOpen, onClose, editData = null }) => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.roboticsLabs);
  const { regions } = useAppSelector((state) => state.regions);

  const [formData, setFormData] = useState({
    labName: "",
    region: "",
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        labName: editData.labName || "",
        region: editData.region?._id || "",
      });
    } else {
      setFormData({
        labName: "",
        region: "",
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

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.labName || !formData.region) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      if (editData) {
        await dispatch(updateRoboticsLab(editData._id, formData));
      } else {
        await dispatch(addRoboticsLab(formData));
      }
      onClose();
    } catch (error) {
      console.error("Error saving robotics lab:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editData ? "Edit Robotics Lab" : "Add New Robotics Lab"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="labName">Lab Name</Label>
            <Input
              id="labName"
              name="labName"
              value={formData.labName}
              onChange={handleChange}
              placeholder="Enter lab name"
             
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="region">Region</Label>
            <Select
              value={formData.region}
              onValueChange={(value) => handleSelectChange("region", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a region" />
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto">
                {regions &&
                  regions.map((region) => (
                    <SelectItem key={region._id} value={region._id}>
                      {region.regionName}, {region.capital}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
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

export default RoboticsLabModal;
