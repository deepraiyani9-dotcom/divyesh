const createCrudController = require('./crudFactory');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Blog = require('../models/Blog');
const Gallery = require('../models/Gallery');
const Testimonial = require('../models/Testimonial');
const Certificate = require('../models/Certificate');
const Career = require('../models/Career');
const ContactMessage = require('../models/ContactMessage');
const QuoteRequest = require('../models/QuoteRequest');
const JobApplication = require('../models/JobApplication');
const Subscriber = require('../models/Subscriber');
const slugify = require('../utils/slugify');
const asyncHandler = require('../utils/asyncHandler');

const withSlug = (Model, nameField = 'name') => {
  const base = createCrudController(Model, {
    searchFields: [nameField, 'title', 'description', 'slug'].filter(Boolean),
    populate: Model.modelName === 'Product' ? 'category relatedProducts' : '',
  });

  return {
    ...base,
    create: asyncHandler(async (req, res) => {
      if (!req.body.slug && (req.body.name || req.body.title)) {
        req.body.slug = slugify(req.body.name || req.body.title);
      }
      const item = await Model.create(req.body);
      res.status(201).json({ success: true, data: item });
    }),
  };
};

exports.productController = withSlug(Product);
exports.categoryController = withSlug(Category);
exports.blogController = withSlug(Blog, 'title');
exports.galleryController = createCrudController(Gallery, { searchFields: ['title', 'category'] });
exports.testimonialController = createCrudController(Testimonial, { searchFields: ['name', 'company', 'message'] });
exports.certificateController = createCrudController(Certificate, { searchFields: ['title', 'issuer'] });
exports.careerController = createCrudController(Career, { searchFields: ['title', 'department', 'location'] });
exports.contactController = createCrudController(ContactMessage, { searchFields: ['name', 'email', 'phone', 'message'] });
exports.quoteController = createCrudController(QuoteRequest, { searchFields: ['name', 'email', 'phone', 'companyName'] });
exports.jobApplicationController = createCrudController(JobApplication, { searchFields: ['name', 'email', 'phone'] });
exports.subscriberController = createCrudController(Subscriber, { searchFields: ['email'] });
