import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCompanyById } from '@/redux/actions/companyActions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Loader2, Building2, MapPin, Users, UserCog, Calendar, Mail, Phone, ArrowLeft, Edit } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';

const CompanyDetailsPage = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { company, isLoading, error } = useAppSelector((state) => state.companies);

  useEffect(() => {
    if (companyId) {
      dispatch(fetchCompanyById(companyId));
    }
  }, [dispatch, companyId]);

  const handleBackToCompanies = () => {
    navigate('/companies');
  };

  if (error) {
    return (
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 mt-8">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-red-600 font-medium text-center">
              <p className="text-lg mb-2">Error loading company details</p>
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6 py-8 bg-gradient-to-b from-blue-50 to-green-50 min-h-screen mt-16">
      <div className="flex items-center mb-4">
        <Button 
          variant="ghost" 
          className="text-blue-600 hover:bg-blue-100 mr-2 cursor-pointer"
          onClick={handleBackToCompanies}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Companies
        </Button>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-blue-800">Company Details</h1>
          <p className="text-green-700 mt-1">View and manage company information</p>
        </div>
      </div>
      
      {isLoading ? (
        <Card className="border-blue-200 shadow-lg">
          <CardContent className="flex justify-center items-center h-64">
            <div className="text-center">
              <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-blue-600">Loading company data...</p>
            </div>
          </CardContent>
        </Card>
      ) : company ? (
        <div className="space-y-6">
          {/* Company Overview Card */}
          <Card className="border-blue-200 shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-100 to-green-100 border-b border-blue-200">
              <div className="flex items-center">
                <Building2 className="h-6 w-6 text-blue-600 mr-2" />
                <div>
                  <CardTitle className="text-2xl text-blue-800 capitalize">{company.companyName}</CardTitle>
                  <CardDescription className="text-green-700">
                    Company Profile and Information
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 flex items-center">
                    <MapPin className="w-4 h-4 mr-1 text-blue-500" />
                    Address
                  </h3>
                  <p className="mt-1 text-blue-800 font-medium capitalize">
                    {company.companyAddress || "No address provided"}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 flex items-center">
                    <Mail className="w-4 h-4 mr-1 text-blue-500" />
                    Email
                  </h3>
                  <p className="mt-1 text-blue-800 font-medium">
                    {company.email || "No email provided"}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 flex items-center">
                    <Phone className="w-4 h-4 mr-1 text-blue-500" />
                    Phone
                  </h3>
                  <p className="mt-1 text-blue-800 font-medium">
                    {company.phone || "No phone provided"}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 flex items-center">
                    <Calendar className="w-4 h-4 mr-1 text-blue-500" />
                    Founded
                  </h3>
                  <p className="mt-1 text-blue-800 font-medium">
                    {company.founded ? new Date(company.founded).toLocaleDateString() : "No founding date provided"}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-gradient-to-r from-green-50 to-blue-50 border-t border-blue-200 py-3 px-6">
              <div className="text-sm text-gray-600">
                Company ID: {company._id}
              </div>
            </CardFooter>
          </Card>

          {/* Departments Card */}
          <Card className="border-blue-200 shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-100 to-green-100 border-b border-blue-200">
              <div className="flex items-center">
                <Users className="h-6 w-6 text-blue-600 mr-2" />
                <div>
                  <CardTitle className="text-xl text-blue-800">Departments</CardTitle>
                  <CardDescription className="text-green-700">
                    {company.departments.length} {company.departments.length === 1 ? 'department' : 'departments'} found
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {company.departments.length === 0 ? (
                <div className="flex flex-col justify-center items-center h-40 bg-white">
                  <Users className="w-12 h-12 text-blue-300 mb-4" />
                  <p className="text-lg text-gray-500 mb-4">No departments found</p>
                  <Button 
                    onClick={() => navigate(`/companies/${company._id}/departments/new`)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Add First Department
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-blue-50">
                      <TableRow>
                        <TableHead className="text-blue-700 font-medium">Department Name</TableHead>
                        <TableHead className="text-blue-700 font-medium">Manager</TableHead>
                        <TableHead className="text-blue-700 font-medium">Employees</TableHead>
                        <TableHead className="text-blue-700 font-medium">Status</TableHead>
                        <TableHead className="text-blue-700 font-medium text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {company.departments.map((department, index) => (
                        <TableRow
                          key={department._id}
                          className={index % 2 === 0 ? "bg-white" : "bg-blue-50/30"}
                        >
                          <TableCell className="font-medium text-blue-800">
                            {department.departmentName}
                          </TableCell>
                          <TableCell>
                            {department.manager ? (
                              <div className="flex items-center">
                                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-2">
                                  {department.manager.user.name.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-medium">{department.manager.user.name}</p>
                                  <p className="text-xs text-gray-500">{department.manager.title || 'Department Manager'}</p>
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-500 italic">No manager assigned</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border border-blue-200">
                              {department.employeeCount || 0} employees
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={
                              department.active ? 
                                "bg-green-100 text-green-800 hover:bg-green-200 border border-green-200" : 
                                "bg-red-100 text-red-800 hover:bg-red-200 border border-red-200"
                            }>
                              {department.active ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              onClick={() => navigate(`/companies/${company._id}/departments/${department._id}`)}
                              className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm cursor-pointer"
                              size="sm"
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
            <CardFooter className="bg-gradient-to-r from-green-50 to-blue-50 border-t border-blue-200 py-3 px-6 flex justify-between">
              <div className="text-sm text-gray-600">
                Total Departments: {company.departments.length}
              </div>
            </CardFooter>
          </Card>
        </div>
      ) : (
        <Card className="border-blue-200 shadow-lg">
          <CardContent className="flex flex-col justify-center items-center h-64">
            <Building2 className="w-12 h-12 text-blue-300 mb-4" />
            <p className="text-lg text-gray-500 mb-4">Company not found</p>
            <Button 
              onClick={handleBackToCompanies}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Back to Companies
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CompanyDetailsPage;