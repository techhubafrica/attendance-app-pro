import mongoose from 'mongoose';

const RoboticsLabSchema = new mongoose.Schema({
    labName: { type: String, required: true},
    region: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Region' }],
    appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' }]
  });
  
  export default mongoose.model('RoboticsLab', RoboticsLabSchema);
  