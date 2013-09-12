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
            this[statement.type](statement);
        }

        return this;
    },

    element: function (element) {
        if (this.options.elements[element.id]) {
            this.result.push(Beard.evaluateElement(this.options.elements[element.id], this.options));
        } else {
            this.result.push("Element " + element.id + " not found");
        }
    },

    content: function (string) {
        this.result.push(string.string);
    },

    data: function (data) {
        if (typeof this.options.variables[data.variable] === 'undefined') {
            this.result.push(data.def);
        } else {
            this.result.push(this.options.variables[data.variable]);
        }
    },

    getData: function (data) {
        return (!!this.options.variables[data.variable] ?
            this.options.variables[data.variable] : data.def);
    },

    comment: function () { },

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
    }
};
