import mongoose from 'mongoose';


const mgnregaDataSchema = new mongoose.Schema({
  state_name: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  district_name: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  fin_year: {
    type: String,
    required: true,
    index: true
  },
  // We use our own clear field names, mapping from the (often unclear) API fields
  familiesGivenWork: {
    type: Number,
    default: 0
  },
  totalWorkDays: {
    type: Number,
    default: 0
  },
  totalWagesPaid: {
    type: Number,
    default: 0
  },
  paymentsOnTimePercent: {
    type: Number,
    default: 0
  },
  // We store the original, raw record from the API for auditing/debugging
  rawApiRecord: {
    type: Object
  },
  // This timestamp is automatically managed by mongoose
  lastUpdatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: { updatedAt: 'lastUpdatedAt' } // Automatically update 'lastUpdatedAt'
});

// Create a compound index for efficient lookups and upserts
mgnregaDataSchema.index({ district_name: 1, fin_year: 1, state_name: 1 }, { unique: true });

const MgnregaData = mongoose.model('MgnregaData', mgnregaDataSchema);

export default MgnregaData;
