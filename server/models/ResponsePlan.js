import mongoose from 'mongoose';

const AllocationSchema = new mongoose.Schema({
  resourceType: String,
  quantity: Number,
  unit: String,
  sourceFacility: String,
  lat: Number,
  lng: Number
});

const ShortageSchema = new mongoose.Schema({
  resourceType: String,
  required: Number,
  availableAllocated: Number,
  shortage: Number,
  severity: String,
  unit: String,
  note: String
});

const ResponsePlanSchema = new mongoose.Schema({
  disasterId: { type: String, required: true },
  zoneCode: String,
  disasterName: String,
  disasterType: String,
  priorityScore: { type: Number, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Deploying', 'In Progress', 'Completed'],
    default: 'Pending'
  },
  coverage: { type: Number, default: 0 },
  resourceUtilization: { type: Number, default: 0 },
  estimatedResponseTimeMinutes: { type: Number, default: 0 },
  allocations: [AllocationSchema],
  shortages: [ShortageSchema],
  explanation: {
    summary: String,
    factors: [{ title: String, score: String, detail: String }]
  },
  createdAt: { type: Date, default: Date.now }
});

export const ResponsePlan = mongoose.models.ResponsePlan || mongoose.model('ResponsePlan', ResponsePlanSchema);
