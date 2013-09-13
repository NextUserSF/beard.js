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
            this.dat = data;
        }

        return Beard.compile(this.tpl, {elements: this.elements, variables: this.dat});
    },

    // Returns an object containing an array of variables, and an array of elements:
    getRequired: function (tpl) {
        // TODO: Use Parser
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
        this.dat[key] = value;

        return this;
    },

    // Remove some data in the data object
    remVariable: function (key) {
        delete this.dat[key];

        return this;
    },

    // Remove everything in the data object
    // FIXME: Change name?
    resetDataObject: function () {
        this.dat = {};

        return this;
    },
    /*
       Compile a function call

       Function: func

       Parameters:
       data {Object} Data source
       str {String} Function string to compile


       Return:
       {String} Result of compilatio,
       */
    func: function (data, str) {
        var f,
        args,
        p,
        i = 0,
        l,
        clean = [];

        str = str.split('(');
        args = this.trim(this.trim(str[1]), '\\)');

        f = this.trim(str[0]);

        if (f.indexOf('.') > -1) {
            f = this.key(data, f, true);
            p = f.parent;
            f = f.ref;
        } else {
            f = data[f];
            p = data;
        }

        if (!f) {
            return this.UDEF;
        }

        if (args === '') {
            return f.apply(p);
        }


        args = args.split(',');
        l = args.length;

        for (i; i < l; i += 1) {
            clean.push(this.arg(this.trim(args[i])));
        }

        return f.apply(p, clean);
    },

    /*
       Evaluate a function argument

       Function: arg

       Parameters:
       arg {String} Argument to evaluate


       Return:
       {mixed} Evaluation of the argument
       */
    arg: function (arg) {
        if (arg === '') {
            return '';
        }

        if (arg === 'true') {
            return true;
        }

        if (arg === 'false') {
            return false;
        }

        if (arg === 'null') {
            return null;
        }

        if (arg === 'undefined') {
            return this.UDEF;
        }

        if (!isNaN(arg)) {
            return (arg.indexOf('.') > -1 ? parseFloat(arg, 10) : parseInt(arg, 10));
        }

        return arg;
    },

    /*
       Function: key

       Get a nested variable reference

       In case the parent is required, the method will return a such object:

       {
       ref: theReference,
       parent: theParentObject
       }


       Parameters:
       data {Object} Data source
       key {String} Key to retrieve
       [parent=false] {Boolean} Do retrieve parent as well


       Return:
       Variable value if found, with parent if required, undefined otherwise
       */
    key: function (data, key, parent) {

        var a = key.split('.'),
            p,
            o = data,
            l = a.length,
            i = 0;

        for (i; i < l; i += 1) {
            if (a[i] === '$') {
                i += 1;
            }

            if (!isNaN(a[i])) {
                a[i] = parseInt(a[i], 10);
            }

            if (o && null !== o[a[i]]) {
                p = o;
                o = o[a[i]];
            } else {
                if (parent) {
                    return {ref: undefined, parent: undefined};
                }
                return this.UDEF;
            }
        }

        if (parent) {
            return {
                ref: o,
                parent: p
            };
        }

        return o;
    },

    /*
       Function: trim

       Trim a string


       Parameters:
       str {String} String to trim
       token {String} [token=\s] String to trim

       Return:
       {String} Trimed string
       */
    trim: function (str, token) {
        token = token || '[ \\s\xA0]';
        return str.replace(new RegExp('^' + token + '+|' + token + '+$', 'g'), '');
    }

};
