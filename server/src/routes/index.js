const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { upload } = require('../middleware/upload');
const publicCtrl = require('../controllers/publicController');
const analytics = require('../controllers/analyticsController');
const settings = require('../controllers/settingsController');
const {
  productController,
  categoryController,
  blogController,
  galleryController,
  testimonialController,
  certificateController,
  careerController,
  contactController,
  quoteController,
  jobApplicationController,
  subscriberController,
} = require('../controllers/resourceControllers');

const router = express.Router();

const crudRoutes = (path, controller, { publicRead = true, slug = false } = {}) => {
  if (publicRead) {
    router.get(`/${path}`, controller.getAll);
    if (slug) router.get(`/${path}/slug/:slug`, controller.getBySlug);
    router.get(`/${path}/:id`, controller.getOne);
  } else {
    router.get(`/${path}`, protect, authorize('admin', 'editor', 'viewer'), controller.getAll);
    router.get(`/${path}/:id`, protect, authorize('admin', 'editor', 'viewer'), controller.getOne);
  }

  router.post(`/${path}`, protect, authorize('admin', 'editor'), controller.create);
  router.put(`/${path}/:id`, protect, authorize('admin', 'editor'), controller.update);
  router.delete(`/${path}/:id`, protect, authorize('admin'), controller.remove);
};

crudRoutes('products', productController, { slug: true });
crudRoutes('categories', categoryController, { slug: true });
crudRoutes('blogs', blogController, { slug: true });
crudRoutes('gallery', galleryController);
crudRoutes('testimonials', testimonialController);
crudRoutes('certificates', certificateController);
crudRoutes('careers', careerController);

router.get('/contacts', protect, authorize('admin', 'editor', 'viewer'), contactController.getAll);
router.get('/contacts/:id', protect, authorize('admin', 'editor', 'viewer'), contactController.getOne);
router.put('/contacts/:id', protect, authorize('admin', 'editor'), contactController.update);
router.delete('/contacts/:id', protect, authorize('admin'), contactController.remove);

router.get('/quotes', protect, authorize('admin', 'editor', 'viewer'), quoteController.getAll);
router.get('/quotes/:id', protect, authorize('admin', 'editor', 'viewer'), quoteController.getOne);
router.put('/quotes/:id', protect, authorize('admin', 'editor'), quoteController.update);
router.delete('/quotes/:id', protect, authorize('admin'), quoteController.remove);

router.get('/applications', protect, authorize('admin', 'editor', 'viewer'), jobApplicationController.getAll);
router.put('/applications/:id', protect, authorize('admin', 'editor'), jobApplicationController.update);
router.delete('/applications/:id', protect, authorize('admin'), jobApplicationController.remove);

router.get('/subscribers', protect, authorize('admin', 'editor', 'viewer'), subscriberController.getAll);
router.delete('/subscribers/:id', protect, authorize('admin'), subscriberController.remove);

router.post('/contact', publicCtrl.contactValidators, validate, publicCtrl.submitContact);
router.post('/quote', publicCtrl.quoteValidators, validate, publicCtrl.submitQuote);
router.post('/subscribe', publicCtrl.subscribe);
router.post('/apply', upload.single('resume'), publicCtrl.applyJob);

router.get('/analytics', protect, authorize('admin', 'editor', 'viewer'), analytics.getAnalytics);
router.get('/settings', settings.getSettings);
router.put('/settings', protect, authorize('admin'), settings.updateSettings);

router.post('/upload', protect, authorize('admin', 'editor'), upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
  res.status(201).json({
    success: true,
    data: { filename: req.file.filename, url: `/uploads/${req.file.filename}` },
  });
});

module.exports = router;
