import app from './app';
import http from 'http';

const port = normalizePort(process.env.PORT || '4000');
const server = http.createServer(app);

app.set('port', port);
server.listen(port, () => {
  console.log(`server listening on port ${port}..`);
});

function normalizePort(val: string) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
}
