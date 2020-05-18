    
    const socket = socketConnection.instance

    socket.on('load', (data) => {
        let div = document.createElement('div')
        let img = document.createElement('img')
        div.classList.add(`one-half`)
        div.classList.add(`column`)
        div.classList.add(`category`)

        img.classList.add('u-max-full-width')
        img.setAttribute('src', data)

        let wrapper = document.getElementById('images');
        div.appendChild(img)
        wrapper.appendChild(div)
    })

    const socket2 = socketConnection.instance
    console.log(socket2 === socket) // вернет true так как это один и тот же инстанс

    // const socket3 = io.connect();
    // const socket4 = io.connect();
    // console.log(socket3 === socket4) // false


