const app = require('express')()
const server = require('http').createServer(app)
const cors = require('cors')
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ["GET", 'POST']
  }
})

app.use(cors())

const PORT = process.env.PORT || 5000


app.get('/', (req, res) => {
  res.send('server is running')
});

server.listen(PORT, () => console.log('Server listining on port ', PORT))