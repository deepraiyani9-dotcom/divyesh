const mongoose = require('mongoose');

const quoteRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    companyName: { type: String, default: '' },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    state: { type: String, default: '' },
    city: { type: String, default: '' },
    products: [
      {
        productName: String,
        quantity: String,
        notes: String,
      },
    ],
    message: { type: String, default: '' },
    status: { type: String, enum: ['new', 'quoted', 'closed'], default: 'new' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('QuoteRequest', quoteRequestSchema);
