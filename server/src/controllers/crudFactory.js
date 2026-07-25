const asyncHandler = require('../utils/asyncHandler');

const createCrudController = (Model, options = {}) => {
  const { searchFields = ['name', 'title'], populate = '' } = options;

  return {
    getAll: asyncHandler(async (req, res) => {
      const page = Math.max(1, Number(req.query.page) || 1);
      const limit = Math.min(100, Number(req.query.limit) || 12);
      const skip = (page - 1) * limit;
      const sort = req.query.sort || '-createdAt';
      const q = req.query.q;

      const filter = {};
      if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true';
      if (req.query.isPublished !== undefined) filter.isPublished = req.query.isPublished === 'true';
      if (req.query.isFeatured !== undefined) filter.isFeatured = req.query.isFeatured === 'true';
      if (req.query.category) filter.category = req.query.category;
      if (q && searchFields.length) {
        filter.$or = searchFields.map((field) => ({ [field]: { $regex: q, $options: 'i' } }));
      }

      let query = Model.find(filter).sort(sort).skip(skip).limit(limit);
      if (populate) query = query.populate(populate);

      const [items, total] = await Promise.all([query, Model.countDocuments(filter)]);
      res.json({
        success: true,
        data: items,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) || 1 },
      });
    }),

    getOne: asyncHandler(async (req, res) => {
      let query = Model.findById(req.params.id);
      if (populate) query = query.populate(populate);
      const item = await query;
      if (!item) return res.status(404).json({ success: false, message: 'Not found' });
      res.json({ success: true, data: item });
    }),

    getBySlug: asyncHandler(async (req, res) => {
      let query = Model.findOne({ slug: req.params.slug });
      if (populate) query = query.populate(populate);
      const item = await query;
      if (!item) return res.status(404).json({ success: false, message: 'Not found' });
      res.json({ success: true, data: item });
    }),

    create: asyncHandler(async (req, res) => {
      const item = await Model.create(req.body);
      res.status(201).json({ success: true, data: item });
    }),

    update: asyncHandler(async (req, res) => {
      const item = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!item) return res.status(404).json({ success: false, message: 'Not found' });
      res.json({ success: true, data: item });
    }),

    remove: asyncHandler(async (req, res) => {
      const item = await Model.findByIdAndDelete(req.params.id);
      if (!item) return res.status(404).json({ success: false, message: 'Not found' });
      res.json({ success: true, message: 'Deleted successfully' });
    }),
  };
};

module.exports = createCrudController;
