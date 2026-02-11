const mongoose = require('mongoose');

const thresholdSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Threshold name is required'],
    trim: true
  },
  minValue: {
    type: Number,
    default: null
  },
  maxValue: {
    type: Number,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Threshold', thresholdSchema);
