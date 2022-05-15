import http from 'http';

const port: string = process.env.PORT;

const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('My first server!');
});

server.listen(port, () => {
  console.log(`Server is running on ${port}`);
});

const a: string = 123;

const func = (value: number) => console.log(value);
func(a);
