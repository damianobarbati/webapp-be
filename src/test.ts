import http from 'http';
import { ciccio } from './fuck.js';

const port: string = process.env.PORT;

const server = http.createServer(async (req, res) => {
  res.writeHead(200);

  const value = await ciccio({ value: 12 });
  res.end(JSON.stringify(value));

  // res.end('My first server!');
});

server.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
