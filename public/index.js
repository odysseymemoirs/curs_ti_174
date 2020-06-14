
const socket = socketConnection.instance
const ioInstance = new SocketIOFileUpload(socket);
import localStorageProxy from "./helpers/proxy.js"


// create image and video grid
const imageVideoComposition = new DynamicGallery('videos');

// append it to DOM node
let a = document.getElementsByClassName('gridContainer')
a[0].appendChild(imageVideoComposition.element)

// create dom node for current detecting image or video
let currentDetectingItem = null;

// after uploading image or video socket 'uploaded' event fires
// with current image or video url inside data argument
// we have to predisplay it to user
socket.on('uploaded', (data) => {

    const imageVideoBuilder = new ImageVideoBuilder();
    const imageVideoBuilderDirector = new ImageVideoDirector(imageVideoBuilder);

    let element = ''
    if (data.fileType === 'image')
        element = imageVideoBuilderDirector.createDetectingImageNode(data.path, data.id);
    else
        element = imageVideoBuilderDirector.createDetectingVideoNode(data.path, data.id);

    currentDetectingItem = new GalleryImage(data.id, element)

    imageVideoComposition.add(currentDetectingItem);

})

// when face and age recognition algorithm end processing, socket 'detected' event fires
// with current  detected image or video url inside data argument
// we have to display it to user
socket.on('detected', (data) => {

    // remove predisplaying video or image (removing element from composition)
    imageVideoComposition.remove(data.id)

    // and create new element
    const imageVideoBuilder = new ImageVideoBuilder();
    const imageVideoBuilderDirector = new ImageVideoDirector(imageVideoBuilder);

    let domNode = data.domNode;
    let element = ''

    if (domNode === 'img')
        element = imageVideoBuilderDirector.createDetectedImageNode(data.path, data.id, data.ageList);
    else
        element = imageVideoBuilderDirector.createDetectedVideoNode(data.path, data.id);

    // add detected video or image instead (adding new element to composition)
    currentDetectingItem = new GalleryImage(data.id, element)
    imageVideoComposition.add(currentDetectingItem)

    // after page refreshing sockedId is changing
    // so we have to save url to localStorage


   
    const state = localStorageProxy('history', {
        defaults: {
            links: [], 
        }
    })

    let path = data.path;
    let fileType = domNode === 'img' ? 'img' : 'video'

    state.links.push({ path, fileType })    

})

socket.on('type', (data) => {
    let h4 = document.createElement('h4')
    h4.style = 'text-align:center; color: skyblue'
    let text = document.createTextNode((data).toUpperCase())
    h4.append(text)
    $('.gridContainer').elems.insertAdjacentElement('beforebegin', h4)

    let btn = $('#upload_btn')

    btn.elems.style.border = '1px solid red'


    setTimeout(() => {
        h4.remove()
        btn.elems.style.border = '1px solid #bbb'
    }, 3000);
})

// drop area evet listeners
document.getElementById('upload_btn').addEventListener("click", ioInstance.prompt)
ioInstance.listenOnDrop(document.getElementById('upload_btn'));

// drop area styling
let btn = $('#upload_btn')
btn.elems.ondragenter = () => {
    btn.elems.style.border = '1px solid green'
}

btn.elems.ondragleave = () => { btn.elems.style.border = '1px solid #bbb' }
btn.elems.ondrop = () => { btn.elems.style.border = '1px solid #bbb' }

let checkbox = $('#checkbox')
checkbox.elems.checked = false


