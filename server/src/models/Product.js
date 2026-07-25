const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    description: { type: String, default: '' },
    shortDescription: { type: String, default: '' },
    images: [{ type: String }],
    brochurePdf: { type: String, default: '' },
    features: [{ type: String }],
    applications: [{ type: String }],
    specifications: {
      diameter: { type: String, default: '' },
      pressureRating: { type: String, default: '' },
      length: { type: String, default: '' },
      material: { type: String, default: 'PVC' },
      color: { type: String, default: 'White' },
    },
    technicalData: { type: Map, of: String, default: {} },
    price: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    relatedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
