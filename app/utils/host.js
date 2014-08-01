// servidor utilizado para aplicação web

var protocol = 'http',
    host = 'localhost',
    port = 3000,
    version = 'v1';

var host = {
  protocol: protocol,
  host: host,
  port: port,
  version: version,
  url: protocol + '://' + host + ':' + port + '/' + version + '/',
};

export default host;
