const express = require('express');
const Value = require('../models/Value');
const Threshold = require('../models/Threshold');
const Alert = require('../models/Alert');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require OPERATOR role
router.use(protect, authorize('OPERATOR'));

// POST /api/operator/values - Submit a numeric value
router.post('/values', async (req, res) => {
  try {
    const { value } = req.body;

    if (value == null || typeof value !== 'number') {
      return res.status(400).json({ message: 'A numeric value is required' });
    }

    // Store the submitted value
    const newValue = await Value.create({
      value,
      operatorId: req.user._id
    });

    // Evaluate against all active thresholds and auto-generate alerts
    const activeThresholds = await Threshold.find({ isActive: true });
    const generatedAlerts = [];

    for (const threshold of activeThresholds) {
      // Check MIN_BREACH
      if (threshold.minValue != null && value < threshold.minValue) {
        const alert = await Alert.create({
          valueId: newValue._id,
          thresholdId: threshold._id,
          alertType: 'MIN_BREACH',
          alertMessage: `Value ${value} is below minimum threshold "${threshold.name}" (min: ${threshold.minValue})`
        });
        generatedAlerts.push(alert);
      }

      // Check MAX_BREACH
      if (threshold.maxValue != null && value > threshold.maxValue) {
        const alert = await Alert.create({
          valueId: newValue._id,
          thresholdId: threshold._id,
          alertType: 'MAX_BREACH',
          alertMessage: `Value ${value} exceeds maximum threshold "${threshold.name}" (max: ${threshold.maxValue})`
        });
        generatedAlerts.push(alert);
      }
    }

    res.status(201).json({
      value: newValue,
      alertsGenerated: generatedAlerts.length,
      alerts: generatedAlerts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/operator/values - Get all values submitted by the logged-in operator
router.get('/values', async (req, res) => {
  try {
    const values = await Value.find({ operatorId: req.user._id }).sort({ submittedAt: -1 });
    res.json(values);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/operator/alerts - Get alerts related to the logged-in operator
router.get('/alerts', async (req, res) => {
  try {
    // Find all values submitted by this operator
    const operatorValues = await Value.find({ operatorId: req.user._id }).select('_id');
    const valueIds = operatorValues.map(v => v._id);

    // Find alerts associated with those values
    const alerts = await Alert.find({ valueId: { $in: valueIds } })
      .populate('valueId')
      .populate('thresholdId')
      .sort({ generatedAt: -1 });

    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
