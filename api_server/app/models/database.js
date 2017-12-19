const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, function () {
  // TODO: Error handling here, this always shows connected success even not
  console.log('mongodb connected at ' + process.env.MONGODB_URI);
});

module.exports = mongoose;
