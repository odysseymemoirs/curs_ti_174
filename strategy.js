const exec = require('child_process').exec
const os = require('os')

function DeepFaceDetection(settings, io, socket, event, id) {
    return exec(settings, () => {
        io.emit('detected', { path: `/static/'${socket.id}'/${event.file.name}_result.mp4v`, id });
    })
};

function HaarCascadeDetection(settings, io, socket, event, id) {
    console.log('detected')
    return exec(settings, (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return;
          }
          console.log(stdout);
        io.emit('detected', { path: `/static/'${socket.id}'/${event.file.name}_result.mp4v`, id });
    })
};


module.exports = class DetectionClass {
    constructor(algorithm) {
        this.algorithm = algorithm === 'haar' ? HaarCascadeDetection : DeepFaceDetection;
    }

    run(io, socket, event, id) {
        const settings = `py detect2.py --image ${os.tmpdir()}/uploads/'${socket.id}'/${event.file.name} --socket_id '${socket.id} --method haar'`
        return this.algorithm(settings, io, socket, event, id);
    }
};




