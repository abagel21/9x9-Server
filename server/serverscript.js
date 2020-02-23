const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();

const clientPath = `${__dirname}/../client`;
console.log(`Serving static from ${clientPath}`)

app.use(express.static(clientPath));

const server = http.createServer(app);

const io = socketio(server);
let counter = 1;
let color = 'red';

let waitingPlayer = null;
let currPlayers = [null, null]

io.on('connection', (sock) => {
    console.log('someone connected')
    if (counter % 2 == 0) {
        color = 'red';
    } else {
        color = 'blue';
    }
    sock.id = color;
    counter++;

    sock.emit('announcement', 'You have connected to the server. You are ' + sock.id + '.')

    sock.on('announcement', (text) => {
        io.emit('announcement', `[Server]${text}`)
    })


    if (waitingPlayer) {
        currPlayers[0] = waitingPlayer;
        currPlayers[1] = sock;
        sock.emit('start')
        console.log('if function ran')
        waitingPlayer = null;
    } else {
        counter = 0;
        sock.emit('message', 'Please wait for another player.')
        waitingPlayer = sock;
    }


    sock.on('start', () => {
        currPlayers.forEach((player) => {
            player.emit('turn', sock.id)
        })
    })

    sock.on('selected', () => {
        sock.emit('color', sock.id)
    })

    sock.on('message', (text) => {
        io.emit('message', `[${sock.id}]${text}`)
    })
})

server.on('error', (err) => {
    console.error('Server error: ', err)
})

server.listen(8080, () => {
    console.log('Server has started on 8080')
})