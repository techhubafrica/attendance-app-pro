import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addRegion, updateRegion } from "@/redux/actions/regionActions";
import { Loader2 } from "lucide-react";
import { fetchRoboticsLabs } from "@/redux/actions/roboticsLabActions";

const RegionModal = ({ isOpen, onClose, region = null, isEditing = false }) => {
  const dispatch = useDispatch();
  const { labs, isLoading: labsLoading } = useSelector((state) => state.roboticsLabs);
  const [formData, setFormData] = useState({
    regionName: "",
    capital: "",
    roboticsLabs: [], // Array to store selected lab IDs
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchRoboticsLabs()); // Fetch robotics labs when the modal opens
  }, [dispatch]);

  useEffect(() => {
    if (region && isEditing) {
      setFormData({
        regionName: region.regionName || "",
        capital: region.capital || "",
        roboticsLabs: region.roboticsLabs || [], // Set existing labs
      });
    } else {
      setFormData({
        regionName: "",
        capital: "",
        roboticsLabs: [], // Reset labs
      });
    }
  }, [region, isEditing, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLabSelection = (labId) => {
    setFormData((prev) => {
      const updatedLabs = prev.roboticsLabs.includes(labId)
        ? prev.roboticsLabs.filter((id) => id !== labId) // Remove lab if already selected
        : [...prev.roboticsLabs, labId]; // Add lab if not selected
      return {
        ...prev,
        roboticsLabs: updatedLabs,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        ...formData,
        roboticsLabs: formData.roboticsLabs, // Include selected labs
      };

      if (isEditing && region) {
        await dispatch(updateRegion(region._id, data));
      } else {
        await dispatch(addRegion(data));
      }
      onClose();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Region" : "Add New Region"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update region details below"
              : "Enter region details below"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="regionName" className="text-sm font-medium">
                Region Name
              </label>
              <Input
                id="regionName"
                name="regionName"
                value={formData.regionName}
                onChange={handleChange}
                placeholder="Enter region name"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="capital" className="text-sm font-medium">
                Capital
              </label>
              <Input
                id="capital"
                name="capital"
                value={formData.capital}
                onChange={handleChange}
                placeholder="Enter capital city"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Robotics Labs</label>
              {labsLoading ? (
                <div>Loading labs...</div>
              ) : (
                <div className="max-h-60 overflow-y-auto border p-2 rounded-md">
                  {labs.map((lab) => (
                    <div key={lab._id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={lab._id}
                        checked={formData.roboticsLabs.includes(lab._id)}
                        onChange={() => handleLabSelection(lab._id)}
                      />
                      <label htmlFor={lab._id}>{lab.labName}</label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className={"cursor-pointer"}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className={"text-sm font-medium text-white bg-green-700 hover:bg-green-800 border border-transparent rounded-md group cursor-pointer"}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : isEditing ? (
                "Update"
              ) : (
                "Create"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RegionModal;