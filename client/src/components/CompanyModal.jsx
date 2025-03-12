import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDepartments } from "@/redux/actions/departmentActions";
import { addCompany, updateCompany } from "@/redux/actions/companyActions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
// import { toast } from "sonner";

const CompanyModal = ({
  isOpen,
  onClose,
  company = null,
  isEditing = false,
}) => {
  const dispatch = useDispatch();
  const { departments } = useSelector((state) => state.departments);

  const [formData, setFormData] = useState({
    companyName: "",
    companyAddress: "",
    departmentIds: [],
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  useEffect(() => {
    if (company && isEditing) {
      setFormData({
        companyName: company.companyName || "",
        companyAddress: company.companyAddress || "",
        departmentIds: company.departments?.map((dept) => dept._id) || [],
      });
    } else {
      setFormData({
        companyName: "",
        companyAddress: "",
        departmentIds: [],
      });
    }
  }, [company, isEditing, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDepartmentToggle = (deptId) => {
    setFormData((prev) => {
      const updatedDepartments = prev.departmentIds.includes(deptId)
        ? prev.departmentIds.filter((id) => id !== deptId) // Remove if already selected
        : [...prev.departmentIds, deptId]; // Add if not selected

      return { ...prev, departmentIds: updatedDepartments };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      if (isEditing && company) {
        await dispatch(updateCompany(company._id, formData));
      } else {
        await dispatch(addCompany(formData));
      }
      onClose();
    } catch (error) {
      console.error("Update failed:", error.response?.data?.message || error);
      alert(error.response?.data?.message || "Failed to update company");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Company" : "Add New Company"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update company details below"
              : "Enter company details below"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="companyName" className="text-sm font-medium">
                Company Name*
              </label>
              <Input
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Enter company name"
             
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="companyAddress" className="text-sm font-medium">
                Company Address*
              </label>
              <Textarea
                id="companyAddress"
                name="companyAddress"
                value={formData.companyAddress}
                onChange={handleChange}
                placeholder="Enter company address"
          
               
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="departments" className="text-sm font-medium">
                Departments
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full cursor-pointer">
                    {formData.departmentIds.length > 0
                      ? `${formData.departmentIds.length} selected`
                      : "Select departments"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full">
                  <div className="grid gap-2 overflow-y-auto">
                    {departments.map((department) => (
                      <label
                        key={department._id}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Checkbox
                          checked={formData.departmentIds.includes(
                            department._id
                          )}
                          onCheckedChange={() =>
                            handleDepartmentToggle(department._id)
                          }
                        />
                        {department.departmentName}
                      </label>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
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
              className={
                "flex items-center gap-2 text-sm font-medium text-white bg-green-700 hover:bg-green-800 border border-transparent rounded-md group cursor-pointer"
              }
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating...
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

export default CompanyModal;
