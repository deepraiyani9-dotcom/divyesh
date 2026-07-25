const Product = require('../models/Product');
const Category = require('../models/Category');
const Blog = require('../models/Blog');
const ContactMessage = require('../models/ContactMessage');
const QuoteRequest = require('../models/QuoteRequest');
const Career = require('../models/Career');
const JobApplication = require('../models/JobApplication');
const Gallery = require('../models/Gallery');
const Testimonial = require('../models/Testimonial');
const asyncHandler = require('../utils/asyncHandler');

exports.getAnalytics = asyncHandler(async (_req, res) => {
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
    recentContacts,
    recentQuotes,
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
    ContactMessage.find().sort('-createdAt').limit(5),
    QuoteRequest.find().sort('-createdAt').limit(5),
  ]);

  res.json({
    success: true,
    data: {
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
      },
      recentContacts,
      recentQuotes,
    },
  });
});
