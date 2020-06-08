const exec = require('child_process').exec
const os = require('os')

function DeepFaceDetection(settings, io, socket, event, id) {
    return exec(settings, () => {
        socket.emit('detected', { path: `/static/'${socket.id}'/${event.file.name}_result.mp4v`, id });
    })
};

function HaarCascadeDetection(settings, io, socket, event, id) {
    console.log('detected')
    return exec('python fd.py baby.mp4', (err, stdout, stderr) => {
        console.log("1",stdout);

        if (err) {
            console.error(err);
            return;
          }
          console.log(stdout);
        socket.emit('detected', { path: `/static/result.mp4v`, id });
    })
};


module.exports = class DetectionClass {
    constructor(algorithm) {
        this.algorithm = algorithm === 'haar' ? HaarCascadeDetection : DeepFaceDetection;
    }

    run(io, socket, event, id) {
        console.log('tmp path',`${os.tmpdir()}/uploads/${socket.id}/${event.file.name}`)
        console.log('os.tmpdir', os.tmpdir())

        const settings = `python detect.py --image ${os.tmpdir()}/uploads/${socket.id}/${event.file.name} --socket_id ${socket.id} --method haar`
        return this.algorithm(settings, io, socket, event, id);
    }
};




