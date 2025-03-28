import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchEmployeeById } from '@/redux/actions/employeeActions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Loader2, 
  ArrowLeft, 
  User, 
  Mail, 
  Building2, 
  Users, 
  DollarSign, 
  Calendar, 
  Phone, 
  MapPin, 
  Briefcase, 
  Award, 
  Edit, 
  ClipboardList,
  FileText
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const EmployeeProfilePage = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { employee, isLoading, error } = useSelector((state) => state.employees);

  useEffect(() => {
    if (employeeId) {
      dispatch(fetchEmployeeById(employeeId));
    }
  }, [dispatch, employeeId]);

  const handleBackToEmployees = () => {
    navigate('/employees');
  };


  const formatDate = (dateString) => {
    if (!dateString) return "Not available"; // Handle null/undefined
  
    // Check if the dateString is in the correct format
    const isValidDate = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}.\d{3}Z)?$/.test(dateString);
    if (!isValidDate) {
      console.error("Invalid date format:", dateString); // Debugging log
      return "Invalid date";
    }
  
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.error("Invalid date:", dateString); // Debugging log
      return "Invalid date";
    }
  
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return 'Not available';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (error) {
    return (
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 mt-8 bg-gradient-to-b from-blue-50 to-green-50 min-h-screen ">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-red-600 font-medium text-center">
              <p className="text-lg mb-2">Error loading employee profile</p>
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6 py-8  min-h-screen">
      <div className="flex items-center mb-4">
        <Button 
          variant="ghost" 
          className="text-blue-600 hover:bg-blue-100 mr-2"
          onClick={handleBackToEmployees}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Employees
        </Button>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-blue-800">Employee Profile</h1>
          <p className="text-green-700 mt-1">View detailed employee information</p>
        </div>
      </div>
      
      {isLoading ? (
        <Card className="border-blue-200 shadow-lg">
          <CardContent className="flex justify-center items-center h-64">
            <div className="text-center">
              <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-blue-600">Loading employee data...</p>
            </div>
          </CardContent>
        </Card>
      ) : employee ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Basic Info Card */}
          <Card className="border-blue-200 shadow-lg md:col-span-1">
            <CardHeader className="bg-gradient-to-r from-blue-100 to-green-100 border-b border-blue-200">
              <div className="flex items-center">
                <User className="h-6 w-6 text-blue-600 mr-2" />
                <div>
                  <CardTitle className="text-xl text-blue-800">Basic Information</CardTitle>
                  <CardDescription className="text-green-700">
                    Personal details
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col items-center mb-6">
                <div className="">
                <Avatar className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-400 to-green-400 flex items-center justify-center text-white text-4xl font-bold mb-4">
                      <AvatarImage
                        src={employee.user?.avatar || ""}
                        alt={employee.user?.name || ""}
                      />
                      <AvatarFallback className={"text-blue-500"}>
                        {employee.user?.name?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                </div>
                <h2 className="text-2xl font-bold text-blue-800 capitalize">{employee.user?.name}</h2>
                <p className="text-green-700 mt-1">{employee.position || 'Employee'}</p>
                
                <div className="mt-3">
                  <Badge className={
                    employee.status === 'active' ? 
                      "bg-green-100 text-green-800 hover:bg-green-200 border border-green-200" : 
                      "bg-red-100 text-red-800 hover:bg-red-200 border border-red-200"
                  }>
                    {employee.status || 'Unknown status'}
                  </Badge>
                </div>
              </div>

              <div className="space-y-4 mt-6">
                <div className="flex items-start">
                  <Mail className="w-5 h-5 text-blue-500 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className="font-medium text-blue-800">{employee.user?.email || 'No email available'}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="w-5 h-5 text-blue-500 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="font-medium text-blue-800">{employee.user?.phone || 'No phone available'}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-blue-500 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium text-blue-800">{employee.user?.address || 'No address available'}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Calendar className="w-5 h-5 text-blue-500 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Date of Birth</p>
                    <p className="font-medium text-blue-800">{employee.user?.dateOfBirth ? formatDate(employee.user.dateOfBirth) : 'Not available'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Work & Company Info */}
          <div className="md:col-span-2 space-y-6">
            <Card className="border-blue-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-100 to-green-100 border-b border-blue-200">
                <div className="flex items-center">
                  <Briefcase className="h-6 w-6 text-blue-600 mr-2" />
                  <div>
                    <CardTitle className="text-xl text-blue-800">Work Information</CardTitle>
                    <CardDescription className="text-green-700">
                      Employment details and company information
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Building2 className="w-5 h-5 text-blue-500 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Company</p>
                      <p className="font-medium text-blue-800 capitalize">{employee.company?.companyName || 'Not assigned'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Users className="w-5 h-5 text-blue-500 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Department</p>
                      <p className="font-medium text-blue-800 capitalize">{employee.department?.departmentName || 'Not assigned'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Award className="w-5 h-5 text-blue-500 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Position</p>
                      <p className="font-medium text-blue-800">{employee.position || 'Not specified'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Calendar className="w-5 h-5 text-blue-500 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Joined Date</p>
                      <p className="font-medium text-blue-800">{employee.createdAt ? formatDate(employee.createdAt) : 'Not available'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <DollarSign className="w-5 h-5 text-blue-500 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Salary</p>
                      <p className="font-medium text-blue-800">{formatCurrency(employee.salary)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <DollarSign className="w-5 h-5 text-blue-500 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Bonus</p>
                      <p className="font-medium text-blue-800">{formatCurrency(employee.bonus)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <User className="w-5 h-5 text-blue-500 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Reports To</p>
                      <p className="font-medium text-blue-800">{employee.reportsTo?.name || 'No manager assigned'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Users className="w-5 h-5 text-blue-500 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Type</p>
                      <p className="font-medium text-blue-800">{employee.employmentType || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

         
          </div>
        </div>
      ) : (
        <Card className="border-blue-200 shadow-lg">
          <CardContent className="flex flex-col justify-center items-center h-64">
            <User className="w-12 h-12 text-blue-300 mb-4" />
            <p className="text-lg text-gray-500 mb-4">Employee not found</p>
            <Button 
              onClick={handleBackToEmployees}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Back to Employees
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EmployeeProfilePage;