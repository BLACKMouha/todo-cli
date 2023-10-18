import mongoose from 'mongoose'

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  detail: {
    type: String,
    required: false,
    default: '',
    trim: true
  },
  status: {
    type: String,
    required: true,
    enum: ['completed', 'pending'],
    default: 'pending',
    trim: true
  },
  code: {
    type: String,
    required: true,
    default: 'code',
    trim: true
  },
  parentCode: {
    type: String,
    required: false,
    default: undefined,
    trim: true
  }
}, { timestamps: true })

const Tasks = mongoose.model('Tasks', TaskSchema)
export default Tasks
