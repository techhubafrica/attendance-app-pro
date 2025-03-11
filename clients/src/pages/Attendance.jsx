import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Play, PauseCircle, LogOut, RefreshCw } from 'lucide-react';
import { checkIn, checkOut, clearAttendanceState, getUserAttendanceHistory, takeBreak } from '@/redux/slices/attendanceSlice';
import AttendanceHistory from '@/components/AttendanceHistory';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';

const Attendance = () => {
  const dispatch = useAppDispatch();
  const { currentAttendance, loading } = useAppSelector((state) => state.attendance);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dateRange,] = useState({
    startDate: format(new Date(new Date().setDate(1)), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd')
  });

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Load attendance history on mount
  useEffect(() => {
    dispatch(getUserAttendanceHistory(dateRange));
  }, [dispatch, dateRange]);

  // Clear attendance status when unmounting
  useEffect(() => {
    return () => {
      dispatch(clearAttendanceState());
    };
  }, [dispatch]);

  const handleCheckIn = () => {
    dispatch(checkIn());
  };

  const handleCheckOut = () => {
    dispatch(checkOut());
  };

  const handleBreak = () => {
    dispatch(takeBreak());
  };

  const refreshAttendance = () => {
    dispatch(getUserAttendanceHistory(dateRange));
  };

  // Check if user is currently checked in
  const isCheckedIn = currentAttendance && currentAttendance.checkIn && !currentAttendance.checkOut;
  
  // Check if user is currently on break
  const isOnBreak = isCheckedIn && 
    currentAttendance.breaks && 
    currentAttendance.breaks.length > 0 && 
    !currentAttendance.breaks[currentAttendance.breaks.length - 1].end;

  // Calculate work duration if checked in
  const calculateWorkDuration = () => {
    if (!isCheckedIn) return '00:00:00';
    
    const checkInTime = new Date(currentAttendance.checkIn);
    const now = new Date();
    let totalBreakTime = 0;
    
    // Calculate total break time
    if (currentAttendance.breaks && currentAttendance.breaks.length > 0) {
      currentAttendance.breaks.forEach(breakItem => {
        if (breakItem.start && breakItem.end) {
          const breakStart = new Date(breakItem.start);
          const breakEnd = new Date(breakItem.end);
          totalBreakTime += breakEnd - breakStart;
        } else if (breakItem.start && !breakItem.end) {
          // Ongoing break
          const breakStart = new Date(breakItem.start);
          totalBreakTime += now - breakStart;
        }
      });
    }
    
    // Calculate total work time minus breaks
    const totalTime = now - checkInTime - totalBreakTime;
    
    // Convert to hours, minutes, seconds
    const hours = Math.floor(totalTime / (1000 * 60 * 60));
    const minutes = Math.floor((totalTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((totalTime % (1000 * 60)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-8 mt-30 ">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Current Time Card */}
        <Card className="w-full md:w-1/3 shadow-lg border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-blue-800">Current Time</CardTitle>
            <CardDescription className="text-blue-600">Today is {format(currentTime, 'EEEE, MMMM do, yyyy')}</CardDescription>
          </CardHeader>
          <CardContent className="text-center pt-2">
            <div className="text-5xl font-bold text-blue-700 mb-3">
              {format(currentTime, 'hh:mm:ss a')}
            </div>
          </CardContent>
        </Card>

        {/* Attendance Controls Card */}
        <Card className="w-full md:w-2/3 shadow-lg border-green-200 bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-green-800">Attendance Controls</CardTitle>
            <CardDescription className="text-green-600">
              {isCheckedIn 
                ? (isOnBreak 
                  ? 'You are currently on break' 
                  : 'You are currently checked in') 
                : 'You are not checked in'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {isCheckedIn && (
                <div className="bg-white/80 p-4 rounded-md shadow-sm border border-green-200">
                  <div className="flex items-center gap-4 mb-3">
                    <Clock className="text-green-600" />
                    <div>
                      <div className="text-sm font-medium text-green-800">Check-in time</div>
                      <div className="text-green-700">{format(new Date(currentAttendance.checkIn), 'hh:mm:ss a')}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Clock className="text-blue-600" />
                    <div>
                      <div className="text-sm font-medium text-blue-800">Working time</div>
                      <div className="text-blue-700 font-semibold">{calculateWorkDuration()}</div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex flex-wrap gap-4 justify-center md:justify-start mt-2">
                <Button 
                  onClick={handleCheckIn} 
                  disabled={isCheckedIn || loading}
                  className="flex-1 md:flex-none cursor-pointer bg-green-600 hover:bg-green-700 text-white">
                  <Play className="mr-2 h-4 w-4" /> Check In
                </Button>
                
                <Button 
                  onClick={handleBreak} 
                  disabled={!isCheckedIn || loading}
                  variant={isOnBreak ? "default" : "outline"}
                  className={`flex-1 md:flex-none cursor-pointer ${
                    isOnBreak 
                      ? "bg-blue-600 hover:bg-blue-700 text-white" 
                      : "border-blue-500 text-blue-600 hover:bg-blue-50"
                  }`}>
                  <PauseCircle className="mr-2 h-4 w-4" /> 
                  {isOnBreak ? 'End Break' : 'Take Break'}
                </Button>
                
                <Button 
                  onClick={handleCheckOut} 
                  disabled={!isCheckedIn || loading}
                  variant="secondary"
                  className="flex-1 md:flex-none cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300">
                  <LogOut className="mr-2 h-4 w-4" /> Check Out
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance History */}
      <Card className="shadow-lg border-t-4 border-t-blue-500 border-x-0 border-b-0">
        <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-blue-50 to-green-50 rounded-t-lg">
          <div>
            <CardTitle className="text-blue-800">Attendance History</CardTitle>
            <CardDescription className="text-green-700">Your recent attendance records</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={refreshAttendance}
            className="border-blue-300 text-blue-600 hover:bg-blue-50 h-9 w-9">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="bg-white">
          <AttendanceHistory />
        </CardContent>
      </Card>
    </div>
  );
};

export default Attendance;