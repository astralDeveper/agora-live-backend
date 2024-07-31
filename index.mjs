import express from 'express';
import http from 'http';
import { Server as SocketIO } from 'socket.io';
import cors from 'cors';

const app = express();
const server = http.createServer(app);

const io = new SocketIO(server, {
  cors: {
    origin: 'http://localhost:3000/livesession', // Replace with your frontend domain
    methods: ['GET', 'POST'],
  },
});

app.use(cors()); // Apply CORS middleware
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('Live chat server is running');
});

app.post('/messages', (req, res) => {
  const { message, sender } = req.body;
  if (message) {
    console.log(`Message received from ${sender}: ${message}`);
    io.emit('message', { message, sender });
    res.status(200).json({ success: true, message: 'Message sent' });
  } else {
    res.status(400).json({ success: false, message: 'Message content is required' });
  }
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('message', ({ message, sender }) => {
    console.log(`Message received from ${sender}: ${message}`);
    io.emit('message', { message, sender });
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});