const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    companyName: { type: String, default: 'Lotus Agritech' },
    tagline: { type: String, default: 'Building trust and steady flows, one pipe at a time.' },
    phone: { type: String, default: '+91 90990 90582' },
    email: { type: String, default: 'sales@lotusagritech.com' },
    address: {
      type: String,
      default:
        'Dwarka - Jamnagar Highway, Opposite Khodiyar Mandir, Juvanpur, Kalyanpur, Dwarka, India - 361315',
    },
    social: {
      instagram: { type: String, default: 'https://www.instagram.com/lotusagritech_dwarka/' },
      facebook: { type: String, default: '' },
      linkedin: { type: String, default: '' },
    },
    brochureUrl: { type: String, default: '' },
    operationalHours: { type: String, default: 'Open 24×7 — Full Time' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Settings', settingsSchema);
