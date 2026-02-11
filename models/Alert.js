const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  valueId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Value',
    required: true
  },
  thresholdId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Threshold',
    required: true
  },
  alertType: {
    type: String,
    enum: ['MIN_BREACH', 'MAX_BREACH'],
    required: true
  },
  alertMessage: {
    type: String,
    required: true
  },
  generatedAt: {
    type: Date,
    default: Date.now
  },
  isResolved: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Alert', alertSchema);
