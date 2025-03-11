import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { addEmployee, updateEmployee } from "@/redux/actions/employeeActions";
import { resetSuccess } from "@/redux/slices/employeeSlice";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  user: z.string().min(1, { message: "User is required" }),
  department: z.string().min(1, { message: "Department is required" }),
  company: z.string().min(1, { message: "Company is required" }),
  salary: z.coerce.number().min(0, { message: "Salary cannot be negative" }),
  bonus: z.coerce.number().min(0, { message: "Bonus cannot be negative" }),
});

const EmployeeModal = ({
  employee,
  onClose,
  success,
  error,
  isEditing = false,
  users,
  departments,
  companies,
}) => {
  const dispatch = useAppDispatch();
  const [, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(false); // Local loading state for form submission

  const handleEmployeeSelect = (userId) => {
    setSelectedEmployee(userId);
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user: "",
      department: "",
      company: "",
      salary: 0,
      bonus: 0,
    },
  });

  useEffect(() => {
    if (employee) {
      form.reset({
        user: employee?.user?._id || "",
        department: employee?.department?._id || "",
        company: employee?.company?._id || "",
        salary: employee?.salary || 0,
        bonus: employee?.bonus || 0,
      });
    }
  }, [employee, form]);

  useEffect(() => {
    if (success) {
      toast.success(
        isEditing
          ? "Employee updated successfully"
          : "Employee added successfully"
      );
      dispatch(resetSuccess());
      onClose(); // Close the modal after successful submission
    }
  }, [success, dispatch, onClose, isEditing]);

  const onSubmit = async (data) => {
    setLoading(true); // Set loading to true when form is submitted
    try {
      if (isEditing) {
        await dispatch(updateEmployee(employee._id, data));
      } else {
        await dispatch(addEmployee(data));
      }
    } catch (err) {
      console.error("Error submitting form:", err);
    } finally {
      setLoading(false); // Reset loading state after submission
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
        <FormField
          control={form.control}
          name="user"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  handleEmployeeSelect(value);
                }}
                defaultValue={field.value}
                disabled={isEditing || loading} // Disable if editing or loading
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={loading ? "Loading..." : "Select a user"}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-60 overflow-y-auto">
                  {loading ? (
                    <SelectItem value="loading" disabled>
                      Loading...
                    </SelectItem>
                  ) : users && users.length > 0 ? (
                    users.map((user) => (
                      <SelectItem key={user._id} value={user._id}>
                        {user.name || `User #${user._id}`}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-users" disabled>
                      No users available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a department" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-60 overflow-y-auto">
                  {departments && departments.length > 0 ? (
                    departments.map((dept) => (
                      <SelectItem key={dept._id} value={dept._id}>
                        {dept.departmentName}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-departments" disabled>
                      No departments available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a company" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-60 overflow-y-auto">
                  {companies && companies.length > 0 ? (
                    companies.map((company) => (
                      <SelectItem key={company._id} value={company._id}>
                        {company.companyName}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-companies" disabled>
                      No companies available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="salary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Salary</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bonus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bonus</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="text-sm font-medium text-white bg-green-700 hover:bg-green-800 border border-transparent rounded-md group cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : isEditing ? (
              "Update"
            ) : (
              "Add Employee"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EmployeeModal;
