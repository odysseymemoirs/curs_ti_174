document.addEventListener("DOMContentLoaded", function () {

    // Initialize instances:
    var socket = io.connect();
    socket.on('loader', () => {
        document
    })
    socket.on('load', (data) => {

        console.log(data)
        let a = document.createElement('div')
        let b = document.createElement('img')
        a.classList.add(`one-half`)
        a.classList.add(`column`)
        a.classList.add(`category`)

        b.classList.add('u-max-full-width')
        b.setAttribute('src', data)

        let c = document.getElementById('images');
        a.appendChild(b)
        c.appendChild(a)
    })
    var siofu = new SocketIOFileUpload(socket);

    // Configure the three ways that SocketIOFileUpload can read files:
    document.getElementById("upload_btn").addEventListener("click", siofu.prompt, false);
    // siofu.listenOnInput(document.getElementById("upload_input"));
    siofu.listenOnDrop(document.getElementById("file_drop"));

    // Do something when a file is uploaded:
    siofu.addEventListener("complete", function (event) {
        console.log(event.success);
        console.log(event.file);
    });

}, false);

