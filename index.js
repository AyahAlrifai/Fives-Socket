var express = require('express');
var app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;
app.use(express.static('public'));


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/src/five.html');
});

io.on('connection', (socket) => {
  socket.on('draw-line', msg => {
    io.emit('draw-line', msg);
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
