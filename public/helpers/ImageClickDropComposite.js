
document.addEventListener("DOMContentLoaded", function () {

    class DomElement {
        constructor(id, type) {
            this.id = id;
            this.type = type;
        }
    }

    class ImageClickDropListeners {
        constructor() {
            this.composite = new Array;
            this.instance = ioInstance
        }
        print() {
            console.log(this.composite)
        }

        add(input) {
            input.map(e => {
                if (e.type === 'click') {
                    document.getElementById(e.id).addEventListener("click", this.instance.prompt, false);
                    this.composite.push(e.id)
                }
                if (e.type === 'drop') {
                    this.instance.listenOnDrop(document.getElementById(e.id));
                    this.composite.push(e.id)
                }
            })
        }
        remove(DomElementId) {
            document.getElementById(e.id).removeEventListener("click", false)
            this.composite = this.composite.filter(element => element.id !== DomElementId)
        }
    }


    let listenerInstance = new ImageClickDropListeners();
    listenerInstance.add([
        new DomElement("upload_btn", "click"),
        new DomElement("file_drop", "drop"),
    ])

})

