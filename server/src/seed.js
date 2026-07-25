require('dotenv').config();

const connectDB = require('./config/db');
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');
const Blog = require('./models/Blog');
const Testimonial = require('./models/Testimonial');
const Certificate = require('./models/Certificate');
const Career = require('./models/Career');
const Gallery = require('./models/Gallery');
const Settings = require('./models/Settings');
const slugify = require('./utils/slugify');

const run = async () => {
  await connectDB();

  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Product.deleteMany({}),
    Blog.deleteMany({}),
    Testimonial.deleteMany({}),
    Certificate.deleteMany({}),
    Career.deleteMany({}),
    Gallery.deleteMany({}),
    Settings.deleteMany({}),
  ]);

  const admin = await User.create({
    name: 'Lotus Admin',
    email: process.env.ADMIN_EMAIL || 'admin@lotusagritech.com',
    password: process.env.ADMIN_PASSWORD || 'Admin@12345',
    role: 'admin',
  });

  const categories = await Category.insertMany([
    { name: 'PVC Pipes', slug: 'pvc-pipes', description: 'Durable PVC pipes for plumbing and irrigation.', order: 1 },
    { name: 'PVC Fittings', slug: 'pvc-fittings', description: 'Compatible fittings for PVC pipe networks.', order: 2 },
    { name: 'UPVC Pipes', slug: 'upvc-pipes', description: 'Rigid UPVC pipes for high-pressure applications.', order: 3 },
    { name: 'CPVC Pipes', slug: 'cpvc-pipes', description: 'Hot and cold water CPVC piping systems.', order: 4 },
    { name: 'Agricultural Pipes', slug: 'agricultural-pipes', description: 'Pipes designed for farm irrigation networks.', order: 5 },
    { name: 'Industrial Pipes', slug: 'industrial-pipes', description: 'Heavy-duty pipes for industrial use.', order: 6 },
    { name: 'Electrical Conduits', slug: 'electrical-conduits', description: 'Safe conduits for electrical wiring.', order: 7 },
    { name: 'Water Supply Pipes', slug: 'water-supply-pipes', description: 'Potable water supply piping solutions.', order: 8 },
    { name: 'Drainage Pipes', slug: 'drainage-pipes', description: 'Efficient drainage and sewage solutions.', order: 9 },
  ]);

  const products = await Product.insertMany([
    {
      name: 'UPVC Agricultural Pipe PN10 (63mm)',
      slug: slugify('UPVC Agricultural Pipe PN10 63mm'),
      category: categories[2]._id,
      shortDescription: 'High durability UPVC pipe for irrigation.',
      description: 'Engineered for agricultural water distribution with excellent pressure resistance.',
      features: ['Lead-free', 'Corrosion resistant', 'Long service life'],
      applications: ['Irrigation', 'Agriculture', 'Water supply'],
      specifications: { diameter: '63mm', pressureRating: 'PN10', length: '6m', material: 'UPVC' },
      price: 1450,
      isFeatured: true,
      images: [],
    },
    {
      name: 'PVC Slim-Fit Plumbing Pipe (25mm)',
      slug: slugify('PVC Slim-Fit Plumbing Pipe 25mm'),
      category: categories[0]._id,
      shortDescription: 'Ideal for domestic plumbing lines.',
      description: 'Compact PVC pipe for residential water networks.',
      features: ['Lightweight', 'Easy installation', 'Cost effective'],
      applications: ['Bathrooms', 'Kitchen plumbing', 'Domestic supply'],
      specifications: { diameter: '25mm', pressureRating: 'PN6', length: '6m', material: 'PVC' },
      price: 520,
      isFeatured: true,
      images: [],
    },
    {
      name: 'UPVC Underground Sewage Pipe (160mm)',
      slug: slugify('UPVC Underground Sewage Pipe 160mm'),
      category: categories[8]._id,
      shortDescription: 'Reliable underground sewage pipe.',
      description: 'Designed for underground drainage and sewage systems.',
      features: ['High strength', 'Smooth bore', 'Chemical resistant'],
      applications: ['Sewage', 'Drainage', 'Municipal projects'],
      specifications: { diameter: '160mm', pressureRating: 'SN8', length: '6m', material: 'UPVC' },
      price: 3200,
      isFeatured: true,
      images: [],
    },
  ]);

  await Blog.insertMany([
    {
      title: 'How to Choose the Right PVC Pipe Size',
      slug: 'how-to-choose-pvc-pipe-size',
      excerpt: 'A practical guide to selecting pipe diameter for residential and farm projects.',
      content: 'Choosing the right PVC pipe size depends on flow requirement, pressure rating, and application type...',
      tags: ['PVC', 'Guide'],
      isPublished: true,
    },
    {
      title: 'Why UPVC is Ideal for Irrigation',
      slug: 'why-upvc-ideal-for-irrigation',
      excerpt: 'UPVC delivers strength, chemical resistance and longevity for agricultural networks.',
      content: 'UPVC pipes remain a preferred choice for irrigation due to durability and low maintenance...',
      tags: ['UPVC', 'Agriculture'],
      isPublished: true,
    },
  ]);

  await Testimonial.insertMany([
    {
      name: 'Ramesh Patel',
      company: 'Patel Farms',
      role: 'Owner',
      message: 'Lotus Agritech pipes have improved our irrigation reliability for three seasons.',
      rating: 5,
    },
    {
      name: 'Sneha Mehta',
      company: 'Mehta Builders',
      role: 'Project Manager',
      message: 'Consistent quality and timely delivery for our housing projects.',
      rating: 5,
    },
  ]);

  await Certificate.insertMany([
    { title: 'ISO 9001:2015', issuer: 'ISO', description: 'Quality Management Certification', isActive: true },
    { title: 'Lead-Free Compliance', issuer: 'Internal QA', description: 'Safe for potable water networks', isActive: true },
  ]);

  await Career.create({
    title: 'Production Supervisor',
    department: 'Manufacturing',
    location: 'Dwarka, Gujarat',
    type: 'Full-time',
    description: 'Supervise extrusion lines and ensure production quality targets.',
    requirements: ['3+ years manufacturing experience', 'Team leadership', 'Quality focus'],
    isOpen: true,
  });

  await Gallery.insertMany([
    { title: 'Extrusion Line', image: '/uploads/placeholder-factory.jpg', category: 'Infrastructure' },
    { title: 'Quality Lab', image: '/uploads/placeholder-lab.jpg', category: 'Quality' },
  ]);

  await Settings.create({});

  console.log('Seed completed');
  console.log(`Admin login: ${admin.email} / ${process.env.ADMIN_PASSWORD || 'Admin@12345'}`);
  console.log(`Products seeded: ${products.length}`);
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
