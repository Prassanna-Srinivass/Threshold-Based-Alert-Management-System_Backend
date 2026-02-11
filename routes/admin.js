const express = require('express');
const Threshold = require('../models/Threshold');
const Alert = require('../models/Alert');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require ADMIN role
router.use(protect, authorize('ADMIN'));

// POST /api/admin/thresholds - Create a new threshold rule
router.post('/thresholds', async (req, res) => {
  try {
    const { name, minValue, maxValue, isActive } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Threshold name is required' });
    }

    if (minValue == null && maxValue == null) {
      return res.status(400).json({ message: 'At least one of minValue or maxValue is required' });
    }

    if (minValue != null && maxValue != null && minValue >= maxValue) {
      return res.status(400).json({ message: 'minValue must be less than maxValue' });
    }

    const threshold = await Threshold.create({
      name,
      minValue: minValue != null ? minValue : null,
      maxValue: maxValue != null ? maxValue : null,
      isActive: isActive !== undefined ? isActive : true
    });

    res.status(201).json(threshold);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/admin/thresholds - Get all threshold rules
router.get('/thresholds', async (req, res) => {
  try {
    const thresholds = await Threshold.find().sort({ createdAt: -1 });
    res.json(thresholds);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/admin/thresholds/:id - Update a threshold rule
router.put('/thresholds/:id', async (req, res) => {
  try {
    const { name, minValue, maxValue, isActive } = req.body;

    const threshold = await Threshold.findById(req.params.id);
    if (!threshold) {
      return res.status(404).json({ message: 'Threshold not found' });
    }

    if (name) threshold.name = name;
    if (minValue !== undefined) threshold.minValue = minValue;
    if (maxValue !== undefined) threshold.maxValue = maxValue;
    if (isActive !== undefined) threshold.isActive = isActive;

    if (threshold.minValue != null && threshold.maxValue != null && threshold.minValue >= threshold.maxValue) {
      return res.status(400).json({ message: 'minValue must be less than maxValue' });
    }

    const updatedThreshold = await threshold.save();
    res.json(updatedThreshold);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/admin/thresholds/:id - Delete a threshold rule
router.delete('/thresholds/:id', async (req, res) => {
  try {
    const threshold = await Threshold.findById(req.params.id);
    if (!threshold) {
      return res.status(404).json({ message: 'Threshold not found' });
    }
    await Threshold.findByIdAndDelete(req.params.id);
    res.json({ message: 'Threshold removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/admin/alerts - Get all system alerts
router.get('/alerts', async (req, res) => {
  try {
    const alerts = await Alert.find()
      .populate('valueId')
      .populate('thresholdId')
      .sort({ generatedAt: -1 });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
