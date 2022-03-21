const { connect, connection } = require('mongoose');

connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

module.exports = connection;