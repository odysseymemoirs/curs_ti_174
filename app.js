var SocketIOFileUploadServer = require('socketio-file-upload'),
    socketio = require('socket.io'),
    express = require('express');

const os = require('os')
const util = require('util');
const path = require('path');

const exec = require('child_process').exec


// Express server settings:
var app = express()
    .use(SocketIOFileUploadServer.router)
    .use(express.static(__dirname + "/public/"))
    .use('/static', express.static(path.resolve(os.tmpdir(), 'uploads')))


    // Template engine settings

    .listen(3000, () => { console.log('server running') });


// Start up Socket.IO:
var io = socketio.listen(app);
io.sockets.on("connection", function (socket) {

    // Make an instance of SocketIOFileUploadServer and listen on this socket:
    var uploader = new SocketIOFileUploadServer();
    uploader.dir = os.tmpdir() + '/uploads/';
    uploader.listen(socket);

    // Do something when a file is saved:
    uploader.on("saved", function (event) {
        // console.log(event.file)
        exec(`py detect.py --image ${os.tmpdir()}/uploads/${event.file.name}`, () => {
            console.log("callback")

            io.emit('load', `/static/${event.file.name}_result.jpg`);
        })
        // console.log("detected")
    });
});

