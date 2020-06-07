var $ = (function () {

    'use strict';

	/**
	 * Create the constructor
	 * @param {String} selector The selector to use
	 */
    var Constructor = function (selector) {
        if (!selector) return;
        if (selector === 'document') {
            this.elems = [document];
        } else if (selector === 'window') {
            this.elems = [window];
        } else {
            this.elems = document.querySelector(selector);
        }
    };

	/**
	 * Do ajax stuff
	 * @param  {String} url The URL to get
	 */
    Constructor.prototype.ajax = function (url) {
        // Do some XHR/Fetch thing here
        console.log(url);
    };

	/**
	 * Run a callback on each item
	 * @param  {Function} callback The callback function to run
	 */
    Constructor.prototype.each = function (callback) {
        if (!callback || typeof callback !== 'function') return;
        for (var i = 0; i < this.elems.length; i++) {
            callback(this.elems[i], i);
        }
        return this;
    };

	/**
	 * Add a class to elements
	 * @param {String} className The class name
	 */
    Constructor.prototype.addClass = function (className) {
        this.elems.classList.add(className);
        return this;
    };

	/**
	 * Remove a class to elements
	 * @param {String} className The class name
	 */
    Constructor.prototype.removeClass = function (className) {
        this.each(function (item) {
            item.classList.remove(className);
        });
        return this;
    };

    /**
	 * Set new styles to element
	 * @param {String} className The class name
	 */
    Constructor.prototype.style = function (style) {

        style.map(e => {
            this.elems.style[e[0]] = e[1]
        })

        return this;
    };

        /**
	 * Set new styles to element
	 * @param {String} className The class name
	 */
    Constructor.prototype.event = function (event,callback) {

       
            this.elems.style[e[0]] = e[1]
    

        return this;
    };

    /**
    * Set new attributes to element
    * @param {String} className The class name
    */
    Constructor.prototype.attr = function (attr) {

        attr.map(e => {
            this.elems.setAttribute(e[0], e[1])
        })
        return this;
    };

    /**
    * Remove last element of a dom element
    * @param {String} className The class name
    */
    Constructor.prototype.removeLastChild = function () {

        this.elems.removeChild(this.elems.lastChild)

        return this;
    };

    /**
    * Return nth child of a dom element
    * @param {String} className The class name
    */
    Constructor.prototype.returnChild = function (index) {

        let elements = this.elems.children
        this.elems = elements.item(index)

        return this;
    };

    /**
    * Return parent element of a node
    * @param {String} className The class name
    */
    Constructor.prototype.returnParent = function (index) {
        let parent = this.elems.parentNode
        this.elems = parent

        return this;
    };



    /**
    * Remove element from dom
    * @param {String} className The class name
    */
    Constructor.prototype.delete = function () {
        this.elems.remove()
    };


    /**
     * Append child element to 
     * 
     *  -Element 1 =$0
     *       -Element 3 
     *       -Element 2
     *       -will apend as a child to Element 1
     * 
    * @param {String} className The class name
    */
    Constructor.prototype.append = function (elem, position) {

        let child = document.createElement(elem.type)

        if (elem.class)
            elem.class.map(e => {
                child.classList.add(e)
            })

        if (elem.id)
            child.id = elem.id

        if (elem.style)
            elem.style.map(e => {
                child.style[e[0]] = e[1]
            })
        if (elem.attr)
            elem.attr.map(e => {
                child.setAttribute(e[0], e[1])
            })

        this.elems.appendChild(child)

        return this;
    };


    
	/**
	 * Instantiate a new constructor
	 */
    var instantiate = function (selector) {
        return new Constructor(selector);
    };

	/**
	 * Return the constructor instantiation
	 */
    return instantiate;

})();






