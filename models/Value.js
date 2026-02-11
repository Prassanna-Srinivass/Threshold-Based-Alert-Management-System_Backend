const mongoose = require('mongoose');

const valueSchema = new mongoose.Schema({
  value: {
    type: Number,
    required: [true, 'Value is required']
  },
  operatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Value', valueSchema);
