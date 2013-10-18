Beard.prototype = {
    // Set the template
    set: function (tpl) {
        this.tpl = tpl || '';

        return this;
    },

    // Get the template
    get: function () {
        return this.tpl;
    },

    // Render the template
    render: function (data) {
        if (data) {
            this.data = data;
        }

        var template = Beard.compile(this.tpl);

        return template(this.data, this.elements);
    },

    // Returns an object containing an array of variables, and an array of elements:
    getRequired: function (tpl) {
        tpl = tpl || this.tpl;
        return Beard.getRequired(tpl);
    },

    // Add many template elements
    addElements: function (elements) {
        var k;

        for (k in elements) {
            if (elements.hasOwnProperty(k)) {
                this.elements[k] = elements[k];
            }
        }

        return this;
    },

    // Add a template element
    addElement: function (id, element) {
        this.elements[id] = element;

        return this;
    },

    // Remove a template element
    remElement: function (id) {
        delete this.elements[id];

        return this;
    },

    // Remove all elements
    remElements: function () {
        this.elements = {};

        return this;
    },

    // Add some data in the data object (may be a variable, a function)
    addVariable: function (key, value) {
        this.data[key] = value;

        return this;
    },

    // Remove some data in the data object
    remVariable: function (key) {
        delete this.data[key];

        return this;
    },

    // Remove everything in the data object
    // FIXME: Change name?
    resetDataObject: function () {
        this.data = {};

        return this;
    }
};
