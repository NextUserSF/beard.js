var Compiler = Beard.Compiler = function () {};

Compiler.prototype = {
    compiler: Compiler,
    disassemble: function () {
        var opcodes = this.opcodes,
            i = 0,
            j = 0,
            l = opcodes.length,
            opcode,
            out = [],
            params = [],
            param;

        for (; i < l; i += 1) {
            opcode = opcodes[i];

            if (opcode.opcode === 'DECLARE') {
                out.push('DECLARE ' + opcode.name + '=' + opcode.value);
            } else {
                for (; j < opcode.args.length; j += 1) {
                    param = opcode.args[j];
                    if (typeof param === 'string') {
                        param = '"' + param.replace('\n', '\\n') + '"';
                    }
                    params.push(param);
                }
                out.push(opcode.opcode + ' ' + params.join(' '));
            }
        }

        return out.join('\n');
    },

    compile: function (program, options) {
        this.options = options;
        return this.program(program);
    },

    // Compile program
    program: function (program) {
        var statements = program.statements,
            i = 0,
            l = statements.length,
            statement;

        this.opcodes = [];

        for (i; i < l; i += 1) {
            statement = statements[i];
#ifdef DEBUG
            console.debug(statement);
#endif
            this[statement.type](statement);
        }

        this.isSimple = l === 1;

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
    content: function (content) {
        this.opcode('appendContent', content.string);
    },

    // Compile data variable tag
    data: function (data) {
        var i = 0,
            l = data.variable.length,
            v = this.options.variables,
            key;

#ifdef DEBUG
        console.debug('Compiler.data(): data:', data);
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
        console.debug('Compiler.data(): return value:', v);
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
    comment: function () {},

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
    },

    opcode: function (name) {
        this.opcodes.push({opcode: name, args: [].slice.call(arguments, 1)});
    }
};

Beard.compile = function (input, options) {
    if (input == null || (typeof input !== 'string' && input.constructor !== Beard.AST.ProgramNode)) {
        throw new Error('You must pass a string or Beard AST to Beard.compile. You passed ' + input);
    }
    options = options || {};

    var compiled;

    function compile () {
        var ast = Beard.parse(input),
            env = new Compiler().compile(ast, options),
            tplSpec = new Beard.JSCompiler().compile(env, options);

        return Beard.template(tplSpec);
    };

    return function (context, options) {
        if (!compiled) {
            compiled = compile();
        }

        return compiled.call(this, context, options);
    };
};
