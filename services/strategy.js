const exec = require('child_process').exec
const os = require('os')

function DeepFaceDetection(settings, io, socket, event, id) {
    return exec(settings, (err, stdout, stderr) => {
        if (err) {
            console.error("err", err);
            return;
        }
        try {
            let detectedFile = JSON.parse(stdout)
            let domNode = detectedFile.DOM
            let fileType = detectedFile.type
            let ageList = detectedFile.ageList
            console.log(detectedFile)
            socket.emit('detected', { path: `/static/${socket.id}/${event.file.name}_result.${fileType}`, id, domNode, ageList });

        } catch (error) {
            console.log(err)
            return
        }

    })
};

function HaarCascadeDetection(settings, io, socket, event, id) {
    return exec(settings, (err, stdout, stderr) => {
        if (err) {
            console.error("err", err);
            return;
        }
        try {
            let detectedFile = JSON.parse(stdout)
            let domNode = detectedFile.DOM
            let fileType = detectedFile.type
            let ageList = detectedFile.ageList
            console.log(detectedFile)
            socket.emit('detected', { path: `/static/${socket.id}/${event.file.name}_result.${fileType}`, id, domNode, ageList });

        } catch (error) {
            console.log(err)
            return
        }

    })
};


module.exports = class DetectionClass {
    constructor(algorithm) {
        this.algorithm = algorithm === 'haar' ? HaarCascadeDetection : DeepFaceDetection;
    }

    run(io, socket, event, id) {
        const settings = `python ageDetection.py --image ${os.tmpdir()}/uploads/${socket.id}/${event.file.name} --socket_id ${socket.id} --method deep`
        return this.algorithm(settings, io, socket, event, id);
    }
};




