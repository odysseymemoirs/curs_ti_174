const SocketIOFileUploadServer = require('socketio-file-upload')
const socketio = require('socket.io')
const express = require('express')
const uniqueString = require('unique-string');
const os = require('os')
const path = require('path');
const mkdirp = require('mkdirp')

const fileExt = require('./services/fileExtension')
const DetectionClass = require('./services/strategy')


const port = process.env.PORT || 4000;
// Express server settings:
const app = express()
    .use(SocketIOFileUploadServer.router)
    .use(express.static(__dirname + "/public/"))
    .use('/static', express.static(path.resolve(os.tmpdir(), 'uploads')))
    .get('/history', (req, res) => {
        res.sendFile(__dirname + '/public/userHistory.html')
    })
    .listen(port, () => { console.log('server running') });



// Start up Socket.IO:
const io = socketio.listen(app);
io.sockets.on("connection", function (socket) {


    // create dir if not exists
    mkdirp(os.tmpdir() + `/uploads/${socket.id}/`).then(made =>
        console.log(`made directories, starting with ${made}`))


    // Make an instance of SocketIOFileUploadServer and listen on this socket:
    var uploader = new SocketIOFileUploadServer();
    uploader.dir = os.tmpdir() + `/uploads/${socket.id}/`;
    uploader.listen(socket);


    // Do something when a file is saved:
    uploader.on("saved", function (event) {

        let id = uniqueString()

        const fileType = fileExt(event.file.name, socket)
        if (!fileType) {
            socket.emit('type', 'only image or video accepted')
            return
        }

        socket.emit('uploaded', { path: `/static/${socket.id}/${event.file.name}`, id, fileType })

        socket.emit('detection', { message: 'detection in progress' })

        const detect = new DetectionClass('haar')

        detect.run(io, socket, event, id)

    });
});

