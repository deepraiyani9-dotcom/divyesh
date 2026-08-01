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
    // Admin quotation reply
    quotedPrice: { type: Number, default: null },
    currency: { type: String, default: 'INR' },
    priceNote: { type: String, default: '' },
    quoteDetails: { type: String, default: '' },
    deliveryDays: { type: String, default: '' },
    paymentTerms: { type: String, default: '' },
    validUntil: { type: Date, default: null },
    adminNotes: { type: String, default: '' },
    quotedAt: { type: Date, default: null },
    emailSentAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('QuoteRequest', quoteRequestSchema);
