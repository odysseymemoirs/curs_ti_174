const SocketIOFileUploadServer = require('socketio-file-upload')
const socketio = require('socket.io')
const express = require('express')

const uniqueString = require('unique-string');
const os = require('os')
const path = require('path');
const mkdirp = require('mkdirp')

const DetectionClass = require('./strategy')


// Express server settings:
const app = express()
    .use(SocketIOFileUploadServer.router)
    .use(express.static(__dirname + "/public/"))
    .use('/static', express.static(path.resolve(os.tmpdir(), 'uploads')))
    .get('/history', (req, res) => {
        res.sendFile(__dirname + '/public/userHistory.html')})
            .listen(4000, () => { console.log('server running') });



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
                event.file.meta.hello = "world";
                console.log(event);

                let id = uniqueString()

                io.emit('uploaded', { path: `/static/'${socket.id}'/${event.file.name}`, id })

                io.emit('detection', { message: 'detection in progress' })

                const detect = new DetectionClass('haar')

                detect.run(io, socket, event, id)


            });
        });

