var Compiler = Beard.Compiler = function () {};

Compiler.prototype = {
    compiler: Compiler,
    compile: function (program, options) {
        var statements = program.statements,
            i = 0,
            l = statements.length,
            statement;

        options.elements = options.elements || {};
        options.variables = options.variables || {};
        this.options = options;

        this.result = [];

        for (i; i < l; i += 1) {
            statement = statements[i];
            console.log(statement);
            this.result.push(this[statement.type](statement));
        }

        return this;
    },

    element: function (element) {
        if (this.options.elements[element.id]) {
            return Beard.evaluateElement(this.options.elements[element.id], this.options);
        }

        return "Element " + element.id + " not found";
    },

    content: function (string) {
        return string.string;
    },

    data: function (data) {
        var i = 0,
            l = data.variable.length,
            v = this.options.variables,
            key;

        for (; i < l; i += 1) {
            key = data.variable[i];
            v = v[key];

            if (typeof v === 'undefined') {
                if (data.def) {
                    v = this[data.def.type](data.def);
                } else {
                    v = '';
                }
                break;
            }
        }

        return v;
    },

    func: function (func) {
        var i = 0,
            l = func.func.length,
            fn = this.options.variables,
            key;

        for (; i < l; i += 1) {
            key = func.func[i];
            fn = fn[key];

            if (typeof fn === 'undefined') {
                if (func.def) {
                    return this[func.def.type](func.def);
                }

                return;
            }
        }

        return fn.apply(this.options.variables, this.args(func.args));
    },

    args: function (args) {
        return args.map(function (v) {
            return this[v.type](v);
        }, this);
    },

    comment: function () {
        return '';
    },

    block: function (block) {
        // TODO: This is ugly
        if (block.beard[0] === 'foreach') {
            var v = this.getData(block.beard[1]),
                l,
                key,
                value,
                options,
                env;
            if (v instanceof Array) {
                l = v.length;
                for (key = 0; key < l; key += 1) {
                    value = v[key];
                    options = this.options;
                    options.variables.key = key;
                    options.variables.value = value;
                    env = new Compiler().compile(block.program, options);
                    this.result = this.result.concat(env.result);
                }
            } else if (v instanceof Object) {
                for (key in v) {
                    if (v.hasOwnProperty(key)) {
                        value = v[key];
                        options = this.options;
                        options.variables.key = key;
                        options.variables.value = value;
                        env = new Compiler().compile(block.program, options);
                        this.result = this.result.concat(env.result);
                    }
                }
            }
        }
    },

    STRING: function (string) {
        return string.string;
    }
};
