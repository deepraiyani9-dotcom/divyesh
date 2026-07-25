const mongoose = require('mongoose');

const careerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    department: { type: String, default: '' },
    location: { type: String, default: 'Dwarka, Gujarat' },
    type: { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Internship'], default: 'Full-time' },
    description: { type: String, required: true },
    requirements: [{ type: String }],
    isOpen: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Career', careerSchema);
