var server = require('./server').default;

var PORT = process.env.PORT || 8080;
server.listen(PORT, function () {
  console.log('Server listening on: ' + PORT);
});
