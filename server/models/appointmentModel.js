import mongoose from 'mongoose';

const appointmentSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', required: true },
  lab: { type: mongoose.Schema.Types.ObjectId, ref: 'RoboticsLab', required: true },
  region: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Region',
    required: true
  },
  appointmentDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'checked_in', 'completed', 'cancelled', "approved"],
    default: 'scheduled'
  },
  purpose: {
    type: String,
    required: true
  },
  numVisitors: {
    type: Number,
    default: 1
  },
  checkInTime: Date,
  checkOutTime: Date
}, {
  timestamps: true
});

export default mongoose.model('Appointment', appointmentSchema);