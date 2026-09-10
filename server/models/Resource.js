import mongoose from 'mongoose';

const ResourceFacilitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ['Resource Warehouse', 'Hospital', 'Rescue Station', 'Ambulance Station', 'Emergency Center'],
    required: true
  },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: String
  },
  inventory: {
    waterKits: { type: Number, default: 0 },
    foodKits: { type: Number, default: 0 },
    ambulances: { type: Number, default: 0 },
    rescueTeams: { type: Number, default: 0 },
    boats: { type: Number, default: 0 },
    medicalKits: { type: Number, default: 0 }
  },
  status: { type: String, default: 'Operational' },
  updatedAt: { type: Date, default: Date.now }
});

export const ResourceFacility = mongoose.models.ResourceFacility || mongoose.model('ResourceFacility', ResourceFacilitySchema);
