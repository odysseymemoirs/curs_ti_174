class ImageVideo {

    /* Receives the builder and assigns the values */
    constructor(builder) {
        this.element = document.createElement(builder.element)
        this.element.style = builder.style;
        this.element.classList.add(builder.classList)
        this.element.src = builder.src
        this.setAttributes(builder.attrs)
        this.wrapper(builder.id, builder.loader)
        return this.element
    }

    setAttributes(attrs) {
        for (var key in attrs) {
            this.element.setAttribute(key, attrs[key]);
        }
    }
    addLoader() {

        const wrapper = document.createElement('div')
        const loader = document.createElement('div')
        const square = document.createElement('div')
        const lines = document.createElement('div')

        wrapper.classList.add('eleven', 'columns')
        loader.classList.add('loader')
        square.classList.add('square')
        lines.classList.add('lines')

        lines.insertAdjacentHTML('afterbegin', `<span></span><span></span><span></span><span></span>`)
        loader.append(square)
        loader.append(lines)
        wrapper.append(loader)

        return wrapper
    }
    wrapper(id, loader) {
        const wrapper = document.createElement('div')
        wrapper.id = id
        wrapper.classList.add('eleven', 'columns')
        wrapper.style = 'position: relative'
        wrapper.append(this.element)
        if (loader) wrapper.append(this.addLoader())
        this.element = wrapper

    }
}

class ImageVideoBuilder {
    constructor() { }

    /* Define all the steps needed to create a profile */

    elem(DOMelem) {
        this.element = DOMelem;
        return this;
    }

    src(src) {
        this.src = src;
        return this;
    }

    attrs(attrs) {
        this.attrs = attrs;
        return this;
    }

    style(style) {
        this.style = style;
        return this;
    }

    classList(classList) {
        this.classList = classList;
        return this;
    }
    id(id) {
        this.id = id;
        return this;
    }
    addLoader() {
        this.loader = true
        return this
    }

    build() {
        return new ImageVideo(this);
    }
}


class ImageVideoDirector {
    /* The director receives the builder */
    constructor(builder) {
        this.builder = builder;
    }

    /* Implements a method to automatically generate a popular profile */
    createDetectedVideoNode(src,id) {
        return this.builder
            .elem('video')
            .src(src)
            .attrs({ "autoplay": true, "loop": true })
            .classList('u-max-full-width')
            .id(id)
            .build();
    }
    createDetectedImageNode(src,id) {
        return this.builder
            .elem('img')
            .src(src)
            .attrs({ "autoplay": true, "loop": true })
            .classList('u-max-full-width')
            .id(id)
            .build();
    }
    createDetectingImageNode(src,id) {
        return this.builder
            .elem('img')
            .src(src)
            .attrs({ "autoplay": true, "loop": true })
            .style('opacity: 0.2')
            .classList('u-max-full-width')
            .id(id)
            .addLoader()
            .build();
    }
    createDetectingVideoNode(src,id) {
        return this.builder
            .elem('video')
            .src(src)
            .attrs({ "autoplay": true, "loop": true })
            .style('opacity: 0.2')
            .classList('u-max-full-width')
            .id(id)
            .addLoader()
            .build();
    }
}
