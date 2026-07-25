/**
 * Local smoke-test helpers when system MongoDB is unavailable.
 * Usage: node src/devWithMemory.js
 */
require('dotenv').config();

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

async function startMemoryMongo() {
  const mongod = await MongoMemoryServer.create({
    instance: { dbName: 'lotus_agritech' },
    launchTimeout: 120000,
  });
  const uri = mongod.getUri();
  process.env.MONGODB_URI = uri;
  console.log(`In-memory MongoDB: ${uri}`);
  return mongod;
}

async function seedIfEmpty() {
  const User = require('./models/User');
  const count = await User.countDocuments();
  if (count > 0) return;

  console.log('Seeding in-memory database...');
  require('./seed');
}

module.exports = { startMemoryMongo, seedIfEmpty };

if (require.main === module) {
  (async () => {
    const mongod = await startMemoryMongo();
    await mongoose.connect(process.env.MONGODB_URI);

    // Inline minimal seed (seed.js exits process)
    const User = require('./models/User');
    const Category = require('./models/Category');
    const Product = require('./models/Product');
    const Settings = require('./models/Settings');
    const slugify = require('./utils/slugify');

    await User.create({
      name: 'Lotus Admin',
      email: process.env.ADMIN_EMAIL || 'admin@lotusagritech.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@12345',
      role: 'admin',
    });

    const categories = await Category.insertMany([
      { name: 'PVC Pipes', slug: 'pvc-pipes', description: 'PVC pipes', order: 1 },
      { name: 'UPVC Pipes', slug: 'upvc-pipes', description: 'UPVC pipes', order: 2 },
    ]);

    await Product.create({
      name: 'UPVC Agricultural Pipe PN10 (63mm)',
      slug: slugify('UPVC Agricultural Pipe PN10 63mm'),
      category: categories[1]._id,
      shortDescription: 'High durability UPVC pipe for irrigation.',
      description: 'Engineered for agricultural water distribution.',
      features: ['Lead-free', 'Corrosion resistant'],
      applications: ['Irrigation', 'Agriculture'],
      specifications: { diameter: '63mm', pressureRating: 'PN10', length: '6m', material: 'UPVC' },
      price: 1450,
      isFeatured: true,
    });

    await Settings.create({});

    require('./server');
    console.log('Dev API with memory Mongo is up. Admin: admin@lotusagritech.com / Admin@12345');

    process.on('SIGINT', async () => {
      await mongoose.disconnect();
      await mongod.stop();
      process.exit(0);
    });
  })().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
