const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema(
  {
    career: { type: mongoose.Schema.Types.ObjectId, ref: 'Career' },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    resumeUrl: { type: String, default: '' },
    coverLetter: { type: String, default: '' },
    status: { type: String, enum: ['new', 'reviewed', 'shortlisted', 'rejected'], default: 'new' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('JobApplication', jobApplicationSchema);
