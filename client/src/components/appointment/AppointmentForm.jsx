import React, { useEffect, useState } from 'react';
import { createAppointment } from '@/redux/actions/appointmentActions';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRegions } from '@/redux/actions/regionActions';
import { fetchRoboticsLabs } from '@/redux/actions/roboticsLabActions';
import { fetchFaculties } from '@/redux/actions/facultyActions';

const AppointmentForm = () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector(state => state.appointments);
  const { regions } = useSelector(state => state.regions);
  const { labs } = useSelector(state => state.roboticsLabs);
  const { faculties } = useSelector(state => state.faculties);

  useEffect(() => {
    dispatch(fetchRegions());
    dispatch(fetchRoboticsLabs());
    dispatch(fetchFaculties());
  }, [dispatch]);
  
  const [formData, setFormData] = useState({
    faculty: '',
    lab: '',
    region: '',
    appointmentDate: new Date(),
    purpose: '',
    numVisitors: 1,
  });
  
  const [showCalendar, setShowCalendar] = useState(false);
  const [appointmentTime, setAppointmentTime] = useState('09:00');


  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleDateSelect = (date) => {
    if (date) {
      setFormData(prev => ({
        ...prev,
        appointmentDate: date
      }));
      setShowCalendar(false);
    }
  };
  
  const handleTimeChange = (e) => {
    setAppointmentTime(e.target.value);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.faculty || !formData.lab || !formData.region || !formData.purpose) {
      toast.error('Please fill all required fields');
      return;
    }
    
    // Combine date and time
    const dateObj = new Date(formData.appointmentDate);
    const [hours, minutes] = appointmentTime.split(':');
    dateObj.setHours(parseInt(hours, 10), parseInt(minutes, 10));
    
    const appointmentData = {
      ...formData,
      appointmentDate: dateObj.toISOString()
    };
    
    try {
      await dispatch(createAppointment(appointmentData));
      // Reset form on success
      setFormData({
        faculty: '',
        lab: '',
        region: '',
        appointmentDate: new Date(),
        purpose: '',
        numVisitors: 1,
      });
      setAppointmentTime('09:00');
    } catch (error) {
      console.error('Error creating appointment:', error);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-md border p-6">
        <h2 className="text-xl font-bold mb-6">Book a New Appointment</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="faculty">Faculty</Label>
              <Select 
                onValueChange={(value) => handleSelectChange('faculty', value)}
                value={formData.faculty}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Faculty" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto">
                  {faculties?.map((faculty) => (
                    <SelectItem key={faculty._id} value={faculty._id}>
                      {faculty.facultyName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lab">Robotics Lab</Label>
              <Select 
                onValueChange={(value) => handleSelectChange('lab', value)}
                value={formData.lab}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Lab" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto">
                  {labs?.map((lab) => (
                    <SelectItem key={lab._id} value={lab._id}>
                      {lab.labName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="region">Region</Label>
            <Select 
              onValueChange={(value) => handleSelectChange('region', value)}
              value={formData.region}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Region" />
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto">
                {regions?.map((region) => (
                  <SelectItem key={region._id} value={region._id}>
                    {region.regionName},  {region.capital}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="appointmentDate">Appointment Date</Label>
              <div className="relative">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  onClick={() => setShowCalendar(!showCalendar)}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.appointmentDate ? format(formData.appointmentDate, 'PPP') : 'Pick a date'}
                </Button>
                {showCalendar && (
                  <div className="absolute z-10 mt-1 bg-white border rounded-md shadow-lg">
                    <Calendar
                      mode="single"
                      selected={formData.appointmentDate}
                      onSelect={handleDateSelect}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="appointmentTime">Appointment Time</Label>
              <Input
                type="time"
                id="appointmentTime"
                name="appointmentTime"
                value={appointmentTime}
                onChange={handleTimeChange}
                className="w-full"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose of Visit</Label>
            <Textarea
              id="purpose"
              name="purpose"
              placeholder="Please describe the purpose of your visit"
              value={formData.purpose}
              onChange={handleChange}
              className="min-h-[100px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="numVisitors">Number of Visitors</Label>
            <Input
              type="number"
              id="numVisitors"
              name="numVisitors"
              value={formData.numVisitors}
              onChange={handleChange}
              min="1"
              max="10"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full mt-6 text-sm font-medium text-white bg-green-700 hover:bg-green-800 cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? 'Booking...' : 'Book Appointment'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AppointmentForm;