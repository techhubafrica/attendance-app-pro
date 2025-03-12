import React, { useEffect, useState } from "react";
import { fetchCompanies, deleteCompany } from "@/redux/actions/companyActions";
import { fetchDepartments } from "@/redux/actions/departmentActions";
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
import { Building, Plus, Pencil, Trash2, Search } from "lucide-react";
import CompanyModal from "@/components/CompanyModal";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";

const Companies = () => {
  const dispatch = useAppDispatch();
  const { companies, isLoading } = useAppSelector((state) => state.companies);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchCompanies());
    dispatch(fetchDepartments());
  }, [dispatch]);

  const handleAddCompany = () => {
    setIsEditing(false);
    setSelectedCompany(null);
    setIsModalOpen(true);
  };

  const handleEditCompany = (company) => {
    setIsEditing(true);
    setSelectedCompany(company);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (company) => {
    setCompanyToDelete(company);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (companyToDelete) {
      await dispatch(deleteCompany(companyToDelete._id));
      setDeleteDialogOpen(false);
      setCompanyToDelete(null);
    }
  };

  const filteredCompanies = companies.filter(
    (company) =>
      company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (company.companyAddress &&
        company.companyAddress.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 py-8 min-h-screen mt-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-blue-800 mb-1">Company Management</h1>
          <p className="text-green-700">Manage your organization's companies</p>
        </div>
        <Button onClick={handleAddCompany} className="flex items-center gap-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 shadow-md mt-4 md:mt-0">
          <Plus size={16} />
          Add Company
        </Button>
      </div>

      <Card className="border-blue-200 shadow-md mb-6">
        <CardContent className="p-4">
          <div className="relative mb-4">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search companies..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <div className="w-8 h-8 border-4 rounded-full border-primary border-t-transparent animate-spin"></div>
            </div>
          ) : filteredCompanies.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground">
              {searchTerm
                ? "No companies match your search"
                : "No companies found. Add one to get started!"}
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-gradient-to-r from-blue-100 to-green-100">
                <TableRow>
                  <TableHead className="text-blue-800 font-semibold">Company Name</TableHead>
                  <TableHead className="text-blue-800 font-semibold">Address</TableHead>
                  <TableHead className="text-blue-800 font-semibold">Departments</TableHead>
                  <TableHead className="text-right text-blue-800 font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCompanies.map((company) => (
                  <TableRow key={company._id} className="hover:bg-blue-50 transition-colors">
                    <TableCell className="font-medium capitalize">
                      {company.companyName}
                    </TableCell>
                    <TableCell>{company.companyAddress || "N/A"}</TableCell>
                    <TableCell className="grid gap-1">
                      {company.departments && company.departments.length > 0
                        ? company.departments.map((dept, index) => (
                            <span key={dept._id}>
                              {dept.departmentName}
                              {index < company.departments.length - 1 && ", "}
                            </span>
                          ))
                        : "No departments"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditCompany(company)}
                          className="border-blue-300 text-blue-600 hover:bg-blue-50"
                        >
                          <Pencil size={14} className="mr-1" />
                          Edit
                        </Button>
                        <AlertDialog>
                          {/* <AlertDialogTrigger asChild> */}
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteClick(company)}
                              className="bg-red-500 hover:bg-red-600 text-white"
                            >
                              <Trash2 size={14} className="mr-1" />
                              Delete
                            </Button>
                          {/* </AlertDialogTrigger> */}
                          <AlertDialogContent className="border-red-200">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the company
                                {company.companyName && ` "${company.companyName}"`}.
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
          )}
        </CardContent>
      </Card>

      <CompanyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        company={selectedCompany}
        isEditing={isEditing}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the company
              {companyToDelete?.companyName &&
                ` "${companyToDelete.companyName}"`}.
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

export default Companies;