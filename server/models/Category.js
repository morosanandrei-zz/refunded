const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema({
  name: { type: String, require: true },
  recurrent: { type: Boolean }
});

module.exports = mongoose.model('Categories', CategorySchema);