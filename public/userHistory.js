const storage = JSON.parse(localStorage.getItem("history"))
if (storage) {

    // create image and video grid 
    const imageVideoComposition = new DynamicGallery('videos', 'history');
    // append it to DOM node
    let a = document.getElementsByClassName('gridContainer')
    a[0].appendChild(imageVideoComposition.element)

    storage.links.map((urlPath, index) => {

        const imageVideoBuilder = new ImageVideoBuilder()
            .elem('video')
            .src(urlPath)
            .attrs({ "autoplay": false, "loop": false })
            .classList('u-max-full-width')
            .id(index)
            .build();

        currentDetectingItem = new GalleryImage(index, imageVideoBuilder)
        imageVideoComposition.add(currentDetectingItem)

    })
}
