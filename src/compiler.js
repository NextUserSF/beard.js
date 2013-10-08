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

    // Compile element
    element: function (element) {
        if (this.options.elements[element.id]) {
            return Beard.evaluateElement(this.options.elements[element.id], this.options);
        }

        return "Element " + element.id + " not found";
    },

    // Compile content node
    content: function (string) {
        return string.string;
    },

    // Compile data variable tag
    data: function (data) {
        var i = 0,
            l = data.variable.length,
            v = this.options.variables,
            key;

#ifdef DEBUG
        console.log('Compiler.data(): data:', data);
#endif
        for (; i < l; i += 1) {
            key = data.variable[i];
            // Handle Funciton-Variable mixture
            if (typeof key !== 'string' && key.constructor === Beard.AST.FuncNode) {
                v = this[key.type](key);
            } else {
                v = v[key];
            }

            if (typeof v === 'undefined') {
                if (data.def) {
                    v = this[data.def.type](data.def);
                } else {
                    v = '';
                }
                break;
            }
        }

#ifdef DEBUG
        console.log('Compiler.data(): return value:', v);
#endif
        return v;
    },

    // Compile function call
    func: function (func) {
        var i = 0,
            l = func.func.length,
            parent,
            fn = parent = this.options.variables,
            key;

        for (; i < l; i += 1) {
            key = func.func[i];
            parent = fn;
            // Handle Funciton-Variable mixture
            if (typeof key !== 'string' && key.constructor === Beard.AST.FuncNode) {
                fn = this[key.type](key);
            } else {
                fn = fn[key];
            }

            if (typeof fn === 'undefined') {
                if (func.def) {
                    return this[func.def.type](func.def);
                }

                return;
            }
        }

        // `parent` is the function's `this`:
        //
        //     data = {
        //         first_name: 'John',
        //         last_name: 'Doe',
        //         full_name: function () {
        //             return this.first_name + ' ' + this.last_name;
        //             // return "John Doe"
        //         },
        //         nested: {
        //             first_name: 'Robert',
        //             last_name: 'Roe',
        //             full_name: function () {
        //                 return this.first_name + ' ' + this.last_name;
        //                 // return "Robert Roe"
        //             }
        //         }
        //     }
        return fn.apply(parent, this.args(func.args));
    },

    // Compile function's arguments
    args: function (args) {
        return args.map(function (v) {
            return this[v.type](v);
        }, this);
    },

    // Compile comment
    comment: function () {
        return '';
    },

    // Compile block instructions code
    block: function (block) {
        var helper = block.helper,
            // Compile helper and its arguments or data
            args = block.args.map(function (item) {
                if (typeof item !== 'string') {
                    return this[item.type](item);
                }
                return item;
            }, this),
            program = block.program;

        return Beard.BlockHelpers[helper](args, program, this.options);
    },

    // Compile inline
    inline: function (inline) {
        var helper = inline.helper,
            // Compile helper and its arguments or data
            args = inline.args.map(function (item) {
                if (typeof item !== 'string') {
                    return this[item.type](item);
                }
                return item;
            }, this);

        return Beard.Helpers[helper](args, this.options);
    },

    // Compile hash
    hash: function (hash) {
        return hash.pairs.map(function (item) {
            if (typeof item !== 'string') {
                return this[item.type](item, true);
            }
            return item;
        }, this);
    },

    // Compile string parameter
    STRING: function (string) {
        return string.string;
    },

    // Compile integer parameter
    //
    // If `strict` is `True`, it returns the `Number` value,
    // otherwise, its `String` representation. The default is `False`.
    INTEGER: function (integer, strict) {
        strict = !!strict;

        return strict ? integer.stringModeValue : integer.integer;
    },

    // Compile boolean parameter
    //
    // If `strict` is `True`, it returns the `Boolean` value,
    // otherwise, its `String` representation. The default is `False`.
    BOOLEAN: function (bool, strict) {
        strict = !!strict;

        return strict ? bool.stringModeValue : bool.bool;
    }
};
