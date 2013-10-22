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

        return function (variables, elements) {
            var result = tplSpec.call(
                container,
                Beard,
                variables,
                Beard.helpers,
                elements
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

    invokeElement: function (element, variables, elements) {
        var template = Beard.compile(element);
        return template(variables, elements);
    }
};

Beard.template = Beard.VM.template;
