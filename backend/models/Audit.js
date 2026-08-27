const mongoose = require('mongoose');

const auditSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  action: {
    type: String,
    required: true,
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
  }
}, { timestamps: true });

module.exports = mongoose.model('Audit', auditSchema);
