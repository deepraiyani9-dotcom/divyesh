const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    issuer: { type: String, default: '' },
    image: { type: String, default: '' },
    fileUrl: { type: String, default: '' },
    issuedAt: { type: Date },
    description: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Certificate', certificateSchema);
