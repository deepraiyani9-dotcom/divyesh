const Product = require('../models/Product');
const Category = require('../models/Category');
const Blog = require('../models/Blog');
const ContactMessage = require('../models/ContactMessage');
const QuoteRequest = require('../models/QuoteRequest');
const Career = require('../models/Career');
const JobApplication = require('../models/JobApplication');
const Gallery = require('../models/Gallery');
const Testimonial = require('../models/Testimonial');
const Certificate = require('../models/Certificate');
const asyncHandler = require('../utils/asyncHandler');

const dayKey = (date) => date.toISOString().slice(0, 10);

const buildDayRange = (days) => {
  const labels = [];
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (days - 1));

  for (let i = 0; i < days; i += 1) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    labels.push(dayKey(d));
  }
  return { start, labels };
};

const dailySeries = async (Model, start, labels) => {
  const rows = await Model.aggregate([
    { $match: { createdAt: { $gte: start } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const map = Object.fromEntries(rows.map((r) => [r._id, r.count]));
  return labels.map((label) => map[label] || 0);
};

const statusBreakdown = async (Model, statuses) => {
  const rows = await Model.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
  const map = Object.fromEntries(rows.map((r) => [r._id, r.count]));
  return statuses.map((status) => ({ status, count: map[status] || 0 }));
};

exports.getAnalytics = asyncHandler(async (req, res) => {
  const days = Math.min(Math.max(Number(req.query.days) || 14, 7), 30);
  const { start, labels } = buildDayRange(days);

  const [
    products,
    categories,
    blogs,
    contacts,
    quotes,
    careers,
    applications,
    gallery,
    testimonials,
    certificates,
    recentContacts,
    recentQuotes,
    contactsSeries,
    quotesSeries,
    contactStatuses,
    quoteStatuses,
    todayContacts,
    todayQuotes,
  ] = await Promise.all([
    Product.countDocuments(),
    Category.countDocuments(),
    Blog.countDocuments(),
    ContactMessage.countDocuments(),
    QuoteRequest.countDocuments(),
    Career.countDocuments({ isOpen: true }),
    JobApplication.countDocuments({ status: 'new' }),
    Gallery.countDocuments(),
    Testimonial.countDocuments(),
    Certificate.countDocuments(),
    ContactMessage.find().sort('-createdAt').limit(6).lean(),
    QuoteRequest.find().sort('-createdAt').limit(6).lean(),
    dailySeries(ContactMessage, start, labels),
    dailySeries(QuoteRequest, start, labels),
    statusBreakdown(ContactMessage, ['new', 'in-progress', 'closed']),
    statusBreakdown(QuoteRequest, ['new', 'quoted', 'closed']),
    ContactMessage.countDocuments({
      createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
    }),
    QuoteRequest.countDocuments({
      createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
    }),
  ]);

  const trend = labels.map((date, i) => ({
    date,
    contacts: contactsSeries[i],
    quotes: quotesSeries[i],
    total: contactsSeries[i] + quotesSeries[i],
  }));

  res.json({
    success: true,
    data: {
      generatedAt: new Date().toISOString(),
      rangeDays: days,
      counts: {
        products,
        categories,
        blogs,
        contacts,
        quotes,
        careers,
        applications,
        gallery,
        testimonials,
        certificates,
      },
      live: {
        todayContacts,
        todayQuotes,
        todayTotal: todayContacts + todayQuotes,
        newContacts: contactStatuses.find((s) => s.status === 'new')?.count || 0,
        newQuotes: quoteStatuses.find((s) => s.status === 'new')?.count || 0,
      },
      trend: {
        labels,
        contacts: contactsSeries,
        quotes: quotesSeries,
        total: trend.map((t) => t.total),
      },
      contactStatuses,
      quoteStatuses,
      contentMix: [
        { label: 'Products', value: products },
        { label: 'Blogs', value: blogs },
        { label: 'Gallery', value: gallery },
        { label: 'Testimonials', value: testimonials },
        { label: 'Certificates', value: certificates },
      ],
      recentContacts,
      recentQuotes,
    },
  });
});
