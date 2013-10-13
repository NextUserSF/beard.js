// Beard.VM
// --------
Beard.VM = {
    template: function (tplSpec) {
        var container = {
            escapeExpression: Beard.Utils.escapeExpression,
            invokeElement: Beard.VM.invokeElement,
            programs: [],
            program: function (i, fn, data) {
                var programWrapper = this.programs[i];

                if (data) {
                    programWrapper = Beard.VM.program(i, fn, data);
                } else if (!programWrapper) {
                    programWrapper = this.programs[i] = Beard.VM.program(i, fn);
                }

                return programWrapper;
            },
            merge: function (param, common) {
                var ret = param || common;

                if (param && common && (param !== common)) {
                    ret = {};
                    Beard.Utils.extend(ret, common);
                    Beard.Utils.extend(ret, param);
                }

                return ret;
            },
            programWithDepth: Beard.VM.programWithDepth,
            noop: Beard.VM.noop
        };

        return function (context, options) {
            options = options || {};
            var namespace = options.element ? options : Beard,
                helpers,
                elements;

            if (!options.element) {
                helpers = options.helpers;
                elements = options.elements;
            }

            var result = tplSpec.call(
                container,
                namespace,
                context,
                helpers,
                elements,
                options.data
            );

            return result;
        };
    },

    programWithDepth: function (i, fn, data /*, $depth */) {
        var args = Array.protorype.slice.call(arguments, 3),
            program = function (context, options) {
                options = options || {};

                return fn.apply(this, [context, options.data || data].concat(args));
            };

        program.program = i;
        program.depth = args.length;

        return program;
    },

    program: function (i, fn, data) {
        var program = function(context, options) {
            options = options || {};

            return fn(context, options.data || data);
        };

        program.program = i;
        program.depth = 0;

        return program;
    },

    noop: function () {
        return '';
    },

    invokeElement: function (element, name, context, helpers, elements, data) {
        var options = {
            element: true,
            helpers: helpers,
            elements: elements,
            data: data
        };

        if (element === undefined) {
            throw new Error('The element ' + name + ' could not be found');
        } else if (element instanceof Function) {
            return element(context, options);
        } else if (!Beard.compile) {
            throw new Error('The element ' + name + 'could not be compiled when running in runtime-only mode');
        } else {
            elements[name] = Beard.compile(element, {data: data !== undefined});
            return elements[name](context, options);
        }
    }
};

Beard.template = Beard.VM.template;
