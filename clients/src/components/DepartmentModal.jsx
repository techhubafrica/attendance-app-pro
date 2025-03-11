import React, { useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addDepartment, updateDepartment } from "@/redux/actions/departmentActions";
import { fetchCompanies } from "@/redux/actions/companyActions";
import { fetchEmployees } from "@/redux/actions/employeeActions";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";

const departmentSchema = z.object({
  departmentName: z.string().min(1, "Department name is required"),
  manager: z.string().nonempty("Manager is required for this department"),
  company: z.string().nonempty("Company is required"),
});

const DepartmentModal = ({ isOpen, onClose, department = null, isEditing = false }) => {
  const dispatch = useAppDispatch();
  const { employees } = useAppSelector((state) => state.employees);
  const { companies } = useAppSelector((state) => state.companies);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      departmentName: "",
      manager: "",
      company: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchCompanies());
      dispatch(fetchEmployees());
    }
  }, [dispatch, isOpen]);

  useEffect(() => {
    if (department && isEditing) {
      reset({
        departmentName: department.departmentName || "",
        manager: department.manager?._id || "",
        company: department.company?._id || "",
      });
    } else {
      reset({
        departmentName: "",
        manager: "",
        company: "",
      });
    }
  }, [department, isEditing, isOpen, reset]);

  const onSubmit = async (data) => {
    try {
      if (isEditing && department) {
        await dispatch(updateDepartment(department._id, data));
      } else {
        await dispatch(addDepartment(data));
      }
      onClose();
    } catch (error) {
      // toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Department" : "Add New Department"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update department details below" : "Enter department details below"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="departmentName" className="text-sm font-medium">
                Department Name
              </label>
              <Input
                id="departmentName"
                {...register("departmentName")}
                placeholder="Enter department name"
              />
              {errors.departmentName && (
                <p className="text-red-500 text-sm">{errors.departmentName.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <label htmlFor="company" className="text-sm font-medium">
                Company
              </label>
              <Select
                value={watch("company")}
                onValueChange={(value) => setValue("company", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a company" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto">
                  {companies.map((company) => (
                    <SelectItem key={company._id} value={company._id}>
                      {company.companyName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.company && (
                <p className="text-red-500 text-sm">{errors.company.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <label htmlFor="manager" className="text-sm font-medium">
                Manager To Be Assigned to Department
              </label>
              <Select
                value={watch("manager")}
                onValueChange={(value) => setValue("manager", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a manager" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto">
                  {employees.map((employee) => (
                    <SelectItem key={employee._id} value={employee._id}>
                      {employee.user?.name || "Unknown"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.manager && (
                <p className="text-red-500 text-sm">{errors.manager.message}</p>
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
              disabled={isSubmitting}
              className={"text-sm font-medium text-white bg-green-700 hover:bg-green-800 border border-transparent rounded-md group cursor-pointer"}
            >
              {isSubmitting ? (
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

export default DepartmentModal;