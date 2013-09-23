/*jslint browser: true*/
/*
    Package: Beard.js
 */
(function (global) {

    "use strict";

    var Beard;

    /*
       Constructor: Beard

        Parameters:
            tpl {String} [] Template
            data {Object} [] Data
            elements {Object} [] Elements
    */
    (Beard = function (tpl, data, elements) {
        this.tpl = tpl || '';
        this.dat = data || {};
        this.UDEF = undefined;
        this.elements = elements || {};
        this.debugMode = true;
    }).prototype = {

        /*
            Function: set

            Set the template

            Parameters:
                tpl {String} The template as a string


            Return:
            {Beard} Current instance for chained command on this element
        */
        set: function (tpl) {
            this.tpl = tpl || '';

            return this;
        },

        /*
            Function: get

            Get the template



            Return:
            {String} The template as string
        */
        get: function () {
            return this.tpl;
        },

        /*
            Function: render

            Render the template


            Parameters:
                data {Object} [Optional] Data source


            Return:
            {String} Compilated template
        */
        render: function (data) {
            if (data) {
                this.dat = data;
            }

            return this.compile(this.tpl, this.dat);
        },
        /*
            Function: getRequired

            Compile the template, and returns a list of required elements and variables

            Returns an object containing an array of variables, and an array of elements:

                {
                    'elements': [
                        'first_element',
                        'second_element'
                    ],
                    'variables': [
                        'variable_name',
                        'other_variable'
                    ]
                }

            Parameters:
                tpl {String} Template to precompile. Optional, default: template set


            Return:
            {Object} On object containing arrays of required elements and variables
        */
        getRequired: function (tpl) {
            tpl = tpl || this.tpl;
            var i = 0,
                j = -1,
                res = {
                    elements: [],
                    variables: []
                },
                t,
                o,
                s2,
                key,
                sub,
                l = tpl.length;

            while (i < l) {
                j = tpl.indexOf('<%', i);

                if (j === -1) {
                    break;
                } else if (tpl[j + 2] === '+') {
                    t = tpl.indexOf('%>', i);
                    key = this.trim(tpl.substring(j + 3, t));
                    j = tpl.indexOf('<%- ' + key + ' %>', t);

                    if (j === -1) {
                        throw new Error('Missing "<%- identifier %>" at end of template / ' + tpl.substring(i));
                    }

                    res.variables.push(key);
                    i = j + String('<%- ' + key + ' %>').length;
                } else {

                    i = j;
                    j = tpl.indexOf('%>', i);

                    if (j === -1) {
                        throw new Error('Missing "%>" at end of template / ' + tpl.substring(i));
                    }

                    sub = this.trim(tpl.substring(i + 2, j));

                    o = sub.substring(0, 1);
                    s2 = this.trim(sub.substring(1));

                    if (s2.indexOf(' ') > -1) {
                        s2 = s2.split(' ')[0];
                    }

                    switch (o) {
                    case '=':
                        res.variables.push(s2);
                        break;
                    case '@':
                        res.elements.push(s2);
                        break;
                    }

                    i = j + 2;
                }
            }

            return res;
        },

        /*
            Function: compile

            Compile the template with data


            Parameters:
                tpl {String} Template
                data {Object} Data source


            Return:
            {String} Result of template compilation
        */
        compile: function (tpl, data) {
            var i = 0,
                j = -1,
                res = [],
                t,
                key,
                sub,
                l = tpl.length;

            while (i < l) {
                j = tpl.indexOf('<%', i);

                // Nothing else
                if (j === -1) {
                    res.push(tpl.substr(i));

                    break;

                // Go through
                } else if (tpl[j + 2] === '+') {
                    res.push(tpl.substring(i, j));

                    t = tpl.indexOf('%>', i);

                    key = this.trim(tpl.substring(j + 3, t));

                    j = tpl.indexOf('<%- ' + key + ' %>', t);

                    if (j === -1) {
                        throw new Error('Missing "<%- identifier %>" at end of template / ' + tpl.substring(i));
                    }

                    sub = tpl.substring(t + 2, j);

                    res.push(this.list(sub, this.key(data, key)));

                    i = j + String('<%- ' + key + ' %>').length;

                // Basic
                } else {

                    res.push(tpl.substring(i, j));

                    i = j;


                    j = tpl.indexOf('%>', i);

                    if (j === -1) {
                        throw new Error('Missing "%>" at end of template / ' + tpl.substring(i));
                    }

                    res.push(this.evaluate(this.trim(tpl.substring(i + 2, j)), data));

                    i = j + 2;

                }
            }

            return res.join('');
        },

        /*
            Function: list

            Go through an array



            Parameters:
                tpl {String} Template to apply to each element of the list
                data {Object} Data source


            Return:
            {String} Result of template list compilation
        */
        list: function (tpl, data) {
            var i = 0,
                str = '',
                l = data && data.length > 0 ? data.length : 0;

            for (i; i < l; i += 1) {
                str += this.compile(tpl, data[i]);
            }

            return str;
        },

        /*
            Function: evaluate a tag

            Evaluation of a tag (<% ... %>)


            Parameters:
                element {String} Element to evaluate, without
                data {Object|String} Data source


            Return:
            {String} Result of evaluation
        */
        evaluate: function (element, data) {
            if (!data) {
                data = this.dat;
            }

            var o = element.substring(0, 1),
                s2 = this.trim(element.substring(1));

            switch (o) {
            case '#':
                return '';
            // Sorry for this line
            case '=':
                return String(s2.indexOf('(') > -1 ? this.func(data, s2)
                        : (s2.indexOf('.') > -1 ? this.key(data, s2)
                            : s2 === '$' ? data : this.evaluateVariable(s2, data)));
            case '@':
                return this.evaluateElement(s2, this.dat);
            }

            return element;
        },

        evaluateVariable: function (variable, data) {
            var split = variable.indexOf('|') > -1 ? variable.split('|') : [variable],
                l = split.length,
                def = l === 2 ? this.trim(split[1]) : '';

            variable = l === 2 ? this.trim(split[0]) : variable;

            if (!!data[variable]) {
                return data[variable];
            }

            if (!!def) {
                return def;
            }

            if (this.debugMode) {
                return 'Variable ' + variable + ' not found, no default given';
            }

            return "";
        },


        /*
            Function: addElements

            Add many template elements

            Parameters:
                elements {object} Key/value elements object


            Return:
            {Beard} Current instance for chained command
        */
        addElements: function (elements) {
            var k;

            for (k in elements) {
                if (elements.hasOwnProperty(k)) {
                    this.elements[k] = elements[k];
                }
            }

            return this;
        },


        /*
            Function: addElement

            Add a template element

            Parameters:
                id {string} Id of element
                element {string} Template for element


            Return:
            {Beard} Current instance for chained command
        */
        addElement: function (id, element) {
            this.elements[id] = element;

            return this;
        },


        /*
            Function: remElement

            Remove a template element

            Parameters:
                id {string} Id of element


            Return:
            {Beard} Current instance for chained command
        */
        remElement: function (id) {
            delete this.elements[id];

            return this;
        },


        /*
            Function: remElements

            Remove all elements


            Return:
            {Beard} Current instance for chained command
        */
        remElements: function () {
            this.elements = {};

            return this;
        },

        /*
            Function: evaluateElement

            Evaluate an element with given data

            Parameters:
                data {Object|String} Data source

            Return:
            {String} Result of evaluation
        */
        evaluateElement: function (element, data) {
            return this.compile(this.elements[element] || '<% Element ' + element + ' not found %>', data);
        },



        /*
            Function: addVariable

            Add some data in the data object (may be a variable, a function)

            Parameters:
                key {string} Id of variable
                value {string} Value of variable


            Return:
            {Beard} Current instance for chained command
        */
        addVariable: function (key, value) {
            this.dat[key] = value;

            return this;
        },

        /*
            Function: remVariable

            Remove some data in the data object

            Parameters:
                key {string} Id of variable


            Return:
            {Beard} Current instance for chained command
        */
        remVariable: function (key) {
            delete this.dat[key];

            return this;
        },

        /*
            Function: resetDataObject

            Remove everything in the data object

            Return:
            {Beard} Current instance for chained command
        */
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
        },

        /*
            Function: setDebugMode

            Parameters:
                debugMode {Boolean} Debug mode is enable not not

            Return:
            {Beard} Current instance for chained command on this element
        */
        setDebugMode: function (debugMode) {
            this.debugMode = debugMode;

            return this;
        },
        
        /*
         *  Function : getPojoObjectData
         *  
         *  Parameters:
         *  	a POJO object
         *  
         *  Return:
         *  	Return an attribute of a POJO object
         *  
         *  This function only for test if a POJO object work on beard.js
         */
        getPojoObjectData: function(pojoObj) {
        	return pojoObj.data;
        },
        
        /*
         *  Function : getFirstPOJOObject
         *  
         *  Parameters:
         *  	a list POJO object
         *  
         *  Return:
         *  	Return first element of a POJO object list
         *  
         *  This function only for test if a POJO object list work on beard.js
         */
        getFirstPOJOObject: function(listPojoObject) {
        	return listPojoObject[0].data;
        }

    };

    global.Beard = Beard;

}(window));
