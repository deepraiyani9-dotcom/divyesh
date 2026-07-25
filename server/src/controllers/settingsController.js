const Settings = require('../models/Settings');
const asyncHandler = require('../utils/asyncHandler');

exports.getSettings = asyncHandler(async (_req, res) => {
  let settings = await Settings.findOne();
  if (!settings) settings = await Settings.create({});
  res.json({ success: true, data: settings });
});

exports.updateSettings = asyncHandler(async (req, res) => {
  let settings = await Settings.findOne();
  if (!settings) settings = await Settings.create(req.body);
  else {
    Object.assign(settings, req.body);
    await settings.save();
  }
  res.json({ success: true, data: settings });
});
