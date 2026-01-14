import mongoose from 'mongoose';

const LandSchema = new mongoose.Schema({
  title: String,
  description: String,
  location: String,
  size: String,
  soilType: String,
  facilities: [String],
  leaseRate: Number,
  badges: [String],
  image: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  waterSource: String,
  electricityAvailable: Boolean,
  soilPH: String,
  availableFrom: Date,
  nearbyMarkets: [String],
  certifications: [String],
  weatherData: {
    temp: Number,
    humidity: Number,
    rainfall: String
  },
  status: {
    type: String,
    enum: ['available', 'agreement_owner_signed', 'agreement_user_signed', 'leased'],
    default: 'available'
  },
  acquiredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  ownerSignedDocumentUrl: String,
  finalDocumentUrl: String,
  listingType: { type: String, enum: ['paid', 'sharing'], default: 'paid' },
  sharingPercentage: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Land || mongoose.model('Land', LandSchema);
