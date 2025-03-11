import mongoose from 'mongoose';

const departmentSchema = mongoose.Schema({
  departmentName: {
    type: String,
    required: [true, 'Department name is required'],
    trim: true,
    maxlength: [50, 'Department name cannot exceed 50 characters']
  },
  manager: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Employee',
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: [true, 'Company is required']
  }
}, {
  timestamps: true
});

export default mongoose.model('Department', departmentSchema);