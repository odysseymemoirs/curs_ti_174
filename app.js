const SocketIOFileUploadServer = require('socketio-file-upload')
const socketio = require('socket.io')
const express = require('express')

const uniqueString = require('unique-string');
const os = require('os')
const path = require('path');
const mkdirp = require('mkdirp')
const exec = require('child_process').exec


// Express server settings:
const app = express()
    .use(SocketIOFileUploadServer.router)
    .use(express.static(__dirname + "/public/"))
    .use('/static', express.static(path.resolve(os.tmpdir(), 'uploads')))
    .listen(3000, () => { console.log('server running') });


// Start up Socket.IO:
const io = socketio.listen(app);
io.sockets.on("connection", function (socket) {


    // create dir if not exists
    mkdirp(os.tmpdir() + `/uploads/'${socket.id}'/`).then(made =>
        console.log(`made directories, starting with ${made}`))


    // Make an instance of SocketIOFileUploadServer and listen on this socket:
    var uploader = new SocketIOFileUploadServer();
    uploader.dir = os.tmpdir() + `/uploads/'${socket.id}'/`;
    uploader.listen(socket);


    // Do something when a file is saved:
    uploader.on("saved", function (event) {
        let id = uniqueString()
        io.emit('uploaded', { path: `/static/'${socket.id}'/${event.file.name}`, id })
        io.emit('detection', { message: 'detection in progress' })
        exec(`py detect2.py --image ${os.tmpdir()}/uploads/'${socket.id}'/${event.file.name} --socket_id '${socket.id}'`, () => {
            io.emit('detected', { path: `/static/'${socket.id}'/${event.file.name}_result.mp4v`, id });
        })
    });
});

