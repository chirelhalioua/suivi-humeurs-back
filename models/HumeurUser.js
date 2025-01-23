const mongoose = require('mongoose');

const humeurUserSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  date: {
    type: Date,
    required: true,
  },
  timeOfDay: {
    type: String,
    enum: ['morning', 'evening'],
    required: true,
  },
  humeurId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Humeur',
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model('HumeurUser', humeurUserSchema);
