const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, default: 70 },
  gender: { type: String, default: 'Senior' },
  phoneNumber: { type: String, required: true },
  pin: { type: String }, // Hashed with bcrypt (e.g. for "1234")
  tier: { type: Number, enum: [1, 2, 3], default: 1 },
  language: { type: String, default: 'Assamese' },
  location: { type: String, default: 'Guwahati, Assam' },
  cognitiveStage: { type: String, default: 'Early Memory Support' },
  primaryCaregiver: { type: String, default: 'Dr. Ananya Sharma' },
  emergencyContact: { type: String },
  notes: { type: String },
  medicalNotes: { type: String },
  avatar: { type: String, default: null },
  caregiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Caregiver' },
  notificationPreference: { type: String, enum: ['whatsapp', 'sms', 'ivr'], default: 'whatsapp' },
  lastGameLinkSentDate: { type: Date },
  // Flag distinguishing seeded demo accounts from newly registered live patients
  isDemoSeed: { type: Boolean, default: false },
  // Biometric WebAuthn support
  webAuthnCredentialId: { type: String },
  webAuthnPublicKey: { type: String },
  hasBiometric: { type: Boolean, default: false },
  // ML Engine Evaluation Fields
  cognitiveHealthScore: { type: Number, default: 85 },
  clinicalStatus: { type: String, default: 'Stable' },
  recommendedDifficulty: { type: Number, default: 2 },
  aiReasoning: { type: String },
  lastMLEvaluationDate: { type: Date },

  // GPS Geofence & Safe Zone Tracking Fields
  homeLocation: {
    address: { type: String, default: 'Guwahati, Assam' },
    latitude: { type: Number, default: 26.1445 },
    longitude: { type: Number, default: 91.7362 },
    safeRadiusKm: { type: Number, default: 1.0 } // 1 km safe zone threshold
  },
  currentLocation: {
    latitude: { type: Number, default: 26.1445 },
    longitude: { type: Number, default: 91.7362 },
    address: { type: String, default: 'Guwahati, Assam' },
    distanceFromHomeKm: { type: Number, default: 0 },
    isBeyondSafeZone: { type: Boolean, default: false },
    lastUpdated: { type: Date, default: Date.now }
  },
  geofenceAlerts: [
    {
      timestamp: { type: Date, default: Date.now },
      distanceKm: { type: Number, required: true },
      latitude: { type: Number },
      longitude: { type: Number },
      address: { type: String },
      acknowledged: { type: Boolean, default: false },
      notifiedCaregiver: { type: Boolean, default: true },
      message: { type: String }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Patient', patientSchema);