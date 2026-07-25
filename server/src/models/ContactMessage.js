const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    companyName: { type: String, default: '' },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    state: { type: String, default: '' },
    city: { type: String, default: '' },
    productInterested: { type: String, default: '' },
    quantity: { type: String, default: '' },
    message: { type: String, required: true },
    status: { type: String, enum: ['new', 'in-progress', 'closed'], default: 'new' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ContactMessage', contactMessageSchema);
