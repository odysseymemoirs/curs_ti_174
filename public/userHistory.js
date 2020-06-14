const storage = JSON.parse(localStorage.getItem("history"))
if (storage) {

    // create image and video grid 
    const imageVideoComposition = new DynamicGallery('videos', 'history');
    // append it to DOM node
    let a = document.getElementsByClassName('gridContainer')
    a[0].appendChild(imageVideoComposition.element)

    storage.links.map((e, index) => {

        const imageVideoBuilder = new ImageVideoBuilder()
            .elem(e.fileType)
            .src(e.path)
            .attrs({ "autoplay": false, "loop": false, 'controls': true })
            .classList('u-max-full-width')
            .id(index)
            .build();

        currentDetectingItem = new GalleryImage(index, imageVideoBuilder)
        imageVideoComposition.add(currentDetectingItem)

    })
}
