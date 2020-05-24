
const socket = socketConnection.instance
const ioInstance = new SocketIOFileUpload(socket);

socket.on('detected', (data) => {


    console.log($(`#sss${data.id}`))

    $(`#sss${data.id}`)
        .returnChild(0)
        .attr([['src', data.path]])
        .style([['opacity', "100%"]])
        .returnParent()
        .returnChild(1)
        .delete()

})

socket.on('uploaded', (data) => {

    $('#videos').style([['width','400px'],['heigth','400px'],['margin','0 auto']])
        .append({
            type: 'div',
            attr: [],
            class: ['eleven', 'columns'],
            id: `sss${data.id}`,
            style: [['position', 'relative']]
        })
        .appendNext({
            type: 'video',
            attr: [['src', data.path], ['autoplay', true], ['loop', true]],
            class: ['u-max-full-width'],
            style: [['opacity', '20%']],
        })

        .appendNext({
            type: 'div',
            attr: [],
            class: ['eleven', 'columns']
        })

        .appendNext({
            type: 'div',
            attr: [],
            class: ['loader']
        }, 1)
        .appendNext({
            type: 'div',
            attr: [],
            class: ['square']
        }, 2)
        .appendNext({
            type: 'div',
            attr: [],
            class: ['lines']
        }, 2)
        .appendNext({
            type: 'span',
            attr: [],
            class: []
        }, 3, 4)


})



const socket2 = socketConnection.instance
// console.log(socket2 === socket) // true 

// const socket3 = io.connect();
// const socket4 = io.connect();
// console.log(socket3 === socket4) // false
