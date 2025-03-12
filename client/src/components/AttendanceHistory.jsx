import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format as formatDate } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getUserAttendanceHistory } from '@/redux/slices/attendanceSlice';

const AttendanceHistory = () => {
  const dispatch = useDispatch();
  const { attendanceHistory, loading, totalPages, currentPage } = useSelector((state) => state.attendance);

  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });

  // Handle date range selection
  const handleDateSelect = (date, type) => {
    const formattedDate = formatDate(date, 'yyyy-MM-dd');
    setDateRange(prev => ({
      ...prev,
      [type]: formattedDate
    }));
  };

  // Apply date filter
  const applyFilter = () => {
    dispatch(getUserAttendanceHistory(dateRange));
  };

  // Reset date filter
  const resetFilter = () => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    setDateRange({
      startDate: formatDate(firstDayOfMonth, 'yyyy-MM-dd'),
      endDate: formatDate(today, 'yyyy-MM-dd')
    });
    
    dispatch(getUserAttendanceHistory({
      startDate: formatDate(firstDayOfMonth, 'yyyy-MM-dd'),
      endDate: formatDate(today, 'yyyy-MM-dd')
    }));
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      dispatch(getUserAttendanceHistory({
        ...dateRange,
        page: newPage
      }));
    }
  };

  // Calculate working hours between check-in and check-out
  const calculateWorkHours = (record) => {
    if (!record.checkIn || !record.checkOut) return 'N/A';
    
    const checkInTime = new Date(record.checkIn);
    const checkOutTime = new Date(record.checkOut);
    
    let totalWorkTime = checkOutTime - checkInTime;
    let breakTime = 0;
    
    // Calculate total break time
    if (record.breaks && record.breaks.length > 0) {
      record.breaks.forEach(breakItem => {
        if (breakItem.start && breakItem.end) {
          const breakStart = new Date(breakItem.start);
          const breakEnd = new Date(breakItem.end);
          breakTime += breakEnd - breakStart;
        }
      });
    }
    
    // Subtract break time from work time
    totalWorkTime -= breakTime;
    
    // Convert to hours and minutes
    const hours = Math.floor(totalWorkTime / (1000 * 60 * 60));
    const minutes = Math.floor((totalWorkTime % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="space-y-4">
      {/* Date filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end mb-6">
        <div className="space-y-2 space-x-1">
          <span className="text-sm font-medium">Start Date</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[200px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.startDate ? formatDate(new Date(dateRange.startDate), 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateRange.startDate ? new Date(dateRange.startDate) : undefined}
                onSelect={(date) => handleDateSelect(date, 'startDate')}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2 space-x-1">
          <span className="text-sm font-medium">End Date</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[200px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.endDate ? formatDate(new Date(dateRange.endDate), 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateRange.endDate ? new Date(dateRange.endDate) : undefined}
                onSelect={(date) => handleDateSelect(date, 'endDate')}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={applyFilter} disabled={!dateRange.startDate || !dateRange.endDate}>
            Apply Filter
          </Button>
          <Button variant="outline" onClick={resetFilter}>
            Reset
          </Button>
        </div>
      </div>

      {/* Attendance records table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Check In</TableHead>
              <TableHead>Check Out</TableHead>
              <TableHead>Working Hours</TableHead>
              <TableHead>Breaks</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">Loading attendance records...</div>
                </TableCell>
              </TableRow>
            ) : attendanceHistory && attendanceHistory.length > 0 ? (
              attendanceHistory.map((record, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {format(new Date(record.date || record.createdAt), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>
                    {record.checkIn ? format(new Date(record.checkIn), 'hh:mm a') : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {record.checkOut ? format(new Date(record.checkOut), 'hh:mm a') : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {calculateWorkHours(record)}
                  </TableCell>
                  <TableCell>
                    {record.breaks && record.breaks.length > 0 ? (
                      <Badge variant="outline">{record.breaks.length} break(s)</Badge>
                    ) : (
                      'None'
                    )}
                  </TableCell>
                  <TableCell>
                    {!record.checkIn ? (
                      <Badge variant="outline" className="bg-gray-100 text-gray-800">Not Started</Badge>
                    ) : !record.checkOut ? (
                      <Badge variant="outline" className="bg-blue-100 text-blue-800">In Progress</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-green-100 text-green-800">Completed</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  <div className="text-muted-foreground">No attendance records found</div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <Button 
            variant="outline" 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
          >
            Previous
          </Button>
          
          <div className="flex items-center gap-1">
            {[...Array(totalPages).keys()].map((page) => (
              <Button
                key={page + 1}
                variant={currentPage === page + 1 ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page + 1)}
                disabled={loading}
              >
                {page + 1}
              </Button>
            ))}
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default AttendanceHistory;