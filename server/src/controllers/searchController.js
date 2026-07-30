const Product = require('../models/Product');
const Category = require('../models/Category');
const Blog = require('../models/Blog');
const Gallery = require('../models/Gallery');
const Testimonial = require('../models/Testimonial');
const Certificate = require('../models/Certificate');
const ContactMessage = require('../models/ContactMessage');
const QuoteRequest = require('../models/QuoteRequest');
const asyncHandler = require('../utils/asyncHandler');

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const mapResults = (type, path, items, pick) =>
  items.map((item) => ({
    id: item._id,
    type,
    path,
    title: pick.title(item),
    subtitle: pick.subtitle(item),
  }));

exports.globalSearch = asyncHandler(async (req, res) => {
  const q = String(req.query.q || '').trim();
  if (q.length < 2) {
    return res.json({ success: true, data: [] });
  }

  const regex = new RegExp(escapeRegex(q), 'i');
  const limit = 5;

  const [products, categories, blogs, gallery, testimonials, certificates, contacts, quotes] =
    await Promise.all([
      Product.find({
        $or: [{ name: regex }, { description: regex }, { shortDescription: regex }, { slug: regex }],
      })
        .select('name shortDescription slug')
        .limit(limit)
        .lean(),
      Category.find({ $or: [{ name: regex }, { description: regex }, { slug: regex }] })
        .select('name description')
        .limit(limit)
        .lean(),
      Blog.find({
        $or: [{ title: regex }, { excerpt: regex }, { content: regex }, { tags: regex }],
      })
        .select('title excerpt')
        .limit(limit)
        .lean(),
      Gallery.find({ $or: [{ title: regex }, { description: regex }, { category: regex }] })
        .select('title category description')
        .limit(limit)
        .lean(),
      Testimonial.find({
        $or: [{ name: regex }, { company: regex }, { message: regex }, { role: regex }],
      })
        .select('name company message')
        .limit(limit)
        .lean(),
      Certificate.find({
        $or: [{ title: regex }, { issuer: regex }, { description: regex }],
      })
        .select('title issuer')
        .limit(limit)
        .lean(),
      ContactMessage.find({
        $or: [
          { name: regex },
          { email: regex },
          { phone: regex },
          { companyName: regex },
          { message: regex },
          { productInterested: regex },
          { city: regex },
        ],
      })
        .select('name email phone companyName productInterested')
        .limit(limit)
        .lean(),
      QuoteRequest.find({
        $or: [
          { name: regex },
          { email: regex },
          { phone: regex },
          { companyName: regex },
          { message: regex },
          { city: regex },
          { 'products.productName': regex },
        ],
      })
        .select('name email phone companyName')
        .limit(limit)
        .lean(),
    ]);

  const data = [
    ...mapResults('Product', '/admin/products', products, {
      title: (i) => i.name,
      subtitle: (i) => i.shortDescription || i.slug || 'Product',
    }),
    ...mapResults('Category', '/admin/categories', categories, {
      title: (i) => i.name,
      subtitle: (i) => i.description || 'Category',
    }),
    ...mapResults('Blog', '/admin/blogs', blogs, {
      title: (i) => i.title,
      subtitle: (i) => i.excerpt || 'Blog post',
    }),
    ...mapResults('Gallery', '/admin/gallery', gallery, {
      title: (i) => i.title,
      subtitle: (i) => i.category || i.description || 'Gallery item',
    }),
    ...mapResults('Testimonial', '/admin/testimonials', testimonials, {
      title: (i) => i.name,
      subtitle: (i) => i.company || i.message?.slice(0, 80) || 'Testimonial',
    }),
    ...mapResults('Certificate', '/admin/certificates', certificates, {
      title: (i) => i.title,
      subtitle: (i) => i.issuer || 'Certificate',
    }),
    ...mapResults('Contact', '/admin/contacts', contacts, {
      title: (i) => i.name,
      subtitle: (i) =>
        [i.email, i.phone, i.productInterested].filter(Boolean).join(' · ') || 'Contact enquiry',
    }),
    ...mapResults('Quote', '/admin/quotes', quotes, {
      title: (i) => i.name,
      subtitle: (i) => [i.email, i.phone, i.companyName].filter(Boolean).join(' · ') || 'Quote request',
    }),
  ];

  res.json({ success: true, data, query: q });
});
