import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCompanies } from '@/redux/actions/companyActions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Loader2, Building2, MapPin, Users, UserCog, ExternalLink } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { Badge } from '@/components/ui/badge';
import { fetchUsers } from '@/redux/actions/employeeActions';

const CompaniesPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { companies, isLoading, error } = useAppSelector((state) => state.companies);

  const { user } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    dispatch(fetchCompanies());
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleViewCompany = (Id) => {
    navigate(`/companies/${Id}`);
  };

  if (error) {
    return (
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 mt-8">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-red-600 font-medium text-center">
              <p className="text-lg mb-2">Error loading companies</p>
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6 py-8  min-h-screen mt-16">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-blue-800">Companies</h1>
          <p className="text-green-700 mt-1">Manage and view all registered companies</p>
        </div>
        {user?.role === 'admin' && (
    <Button 
      onClick={() => navigate('/companies/new')}
      className="bg-green-600 hover:bg-green-700 text-white shadow-md"
    >
      Add New Company
    </Button>
  )}
      </div>
      
      <Card className="border-blue-200 shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-100 to-green-100 border-b border-blue-200">
          <div className="flex items-center">
            <Building2 className="h-6 w-6 text-blue-600 mr-2" />
            <div>
              <CardTitle className="text-2xl text-blue-800">Company Directory</CardTitle>
              <CardDescription className="text-green-700">
                View all companies, their departments, and managers
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center h-64 bg-white">
              <div className="text-center">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-blue-600">Loading companies data...</p>
              </div>
            </div>
          ) : companies.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-64 bg-white">
              <Building2 className="w-12 h-12 text-blue-300 mb-4" />
              <p className="text-lg text-gray-500 mb-4">No companies found</p>
              <Button 
                onClick={() => navigate('/companies/new')}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Add Your First Company
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-blue-50">
                  <TableRow>
                    <TableHead className="text-blue-700 font-medium">
                      <div className="flex items-center">
                        <Building2 className="w-4 h-4 mr-2" />
                        Company Name
                      </div>
                    </TableHead>
                    <TableHead className="text-blue-700 font-medium">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        Address
                      </div>
                    </TableHead>
                    <TableHead className="text-blue-700 font-medium">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2" />
                        Departments
                      </div>
                    </TableHead>
                    <TableHead className="text-blue-700 font-medium">
                      <div className="flex items-center">
                        <UserCog className="w-4 h-4 mr-2" />
                        Managers
                      </div>
                    </TableHead>
                    <TableHead className="text-blue-700 font-medium text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {companies.map((company, index) => (
                    <TableRow 
                      key={company._id} 
                      className={index % 2 === 0 ? "bg-white" : "bg-blue-50/30"}
                    >
                      <TableCell className="font-medium text-blue-800 capitalize">
                        {company.companyName}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {company.companyAddress || "No address provided"}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {company.departments.length > 0 ? 
                            company.departments.map((department) => (
                              <Badge 
                                key={department._id} 
                                className="bg-green-100 text-green-800 hover:bg-green-200 border border-green-200"
                              >
                                {department.departmentName}
                              </Badge>
                            )) : 
                            <span className="text-gray-500 italic">No departments</span>
                          }
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {company.departments.filter(dept => dept.manager).length > 0 ? 
                            company.departments.map((department) => (
                              department.manager && (
                                <div key={`${department._id}-${department.manager._id}`} className="text-gray-700">
                                  <span className="text-sm font-medium capitalize">{department.manager.user.name}</span>
                                  <span className="text-xs text-gray-500 ml-2">({department.departmentName})</span>
                                </div>
                              )
                            )) : 
                            <span className="text-gray-500 italic">No managers assigned</span>
                          }
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          onClick={() => handleViewCompany(company._id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm cursor-pointer"
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter className="bg-gradient-to-r from-green-50 to-blue-50 border-t border-blue-200 py-3 px-6">
          <div className="text-sm text-gray-600">
            Total Companies: {companies.length}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CompaniesPage;