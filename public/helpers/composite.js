// Interfaces.

var Composite = new Interface('Composite', ['add', 'remove', 'getChild']);
var GalleryItem = new Interface('GalleryItem', ['hide', 'show']);


// DynamicGallery class.

var DynamicGallery = function (id,page) { // implements Composite, GalleryItem
    this.children = [];
    this.element = document.createElement('div');
    this.element.id = id;
    this.element.classList.add('row')
    this.element.style = "max-width: 400px; margin: 0px auto;"
}

DynamicGallery.prototype = {

    // Implement the Composite interface.

    add: function (child) {
        Interface.ensureImplements(child, Composite, GalleryItem);
        this.children.push(child);
        this.element.prepend(child.getElement());
    },
    remove: function (id) {
        this.children.map(child => {
            if(child.id === id) {

                this.element.removeChild(child.getElement());
            }
        })
    },
    getChild: function (i) {
        return this.children[i];
    },

    // Implement the GalleryItem interface.

    hide: function () {
        for (var node, i = 0; node = this.getChild(i); i++) {
            node.hide();
        }
        this.element.style.display = 'none';
    },
    show: function () {
        this.element.style.display = 'block';
        for (var node, i = 0; node = this.getChild(i); i++) {
            node.show();
        }
    },

    // Helper methods.

    getElement: function () {
        return this.element;
    }
};


// GalleryImage class.
var GalleryImage = function (id,element) { // implements Composite, GalleryItem
    this.id = id
    this.element = element
}

GalleryImage.prototype = {

    // Implement the Composite interface.

    add: function () { },       // This is a leaf node, so we don't
    remove: function () { },    // implement these methods, we just
    getChild: function () { },  // define them.

    // Implement the GalleryItem interface.

    hide: function () {
        this.element.style.display = 'none';
    },
    show: function () {
        this.element.style.display = ''; // Restore the display attribute to its 
        // previous setting.
    },

    // Helper methods.

    getElement: function () {
        return this.element;
    }
};

const ImageVideoNode = (type, process, path, id,page) => {

    const fragment = document.createElement('div');

    if (process === 'rendering') fragment.insertAdjacentHTML('afterbegin', `

        <div id=id${id} class="eleven columns" style="position: relative;">
            <${type} class="u-max-full-width" src=${path} autoplay="true" loop="true" style="opacity: 0.2;"></${type}>
            <div class="eleven columns">
                <div class="loader">
                    <div class="square"></div>
                    <div class="lines">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        </div>
`)
    if (process === 'rendered') fragment.insertAdjacentHTML('afterbegin', `

    <div id=id${id} class="${page === 'history' ? 'two' : 'eleven'} columns" style="position: relative;">
        <${type} class="u-max-full-width" src=${path} autoplay="true" loop="true" style="opacity: 1;"></${type}>
    </div>
    `)

    return fragment
}