
const mime = require('mime-types')


module.exports = function fileExt(file, socket) {

    let fileType = ''
    try {

        fileType = mime.lookup(file).split('/')[0]
    } catch (error) {
        return
    }

    if (fileType == 'image' || fileType == 'video') {
        return fileType
    }

    return 0
}