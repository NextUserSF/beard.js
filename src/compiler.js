// Beard.Compiler
// --------------
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
        this.children = [];
        this.depths = {list: []};
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

        this.depths.list = this.depths.list.sort(function (a, b) {
            return a - b;
        });

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

    // Compile data tag
    data: function (data) {
        this[data.data.type](data.data);
        this.opcode('append');
    },

    // Compile variable node
    variable: function (variable) {
        var name = variable.parts[0],
            i = 1,
            l = variable.parts.length;

        if (!name) {
            this.opcode('pushContext');
        } else {
            this.opcode('lookupOnContext', variable.parts[0]);
        }

        for (; i < l; i += 1) {
            this.opcode('lookup', variable.parts[i]);
        }

        if (variable.def) {
            this[variable.def.type](variable.def);
            this.opcode('fallback');
        }
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
        this.opcode('pushString', string.string);
    },

    // Compile integer parameter
    INTEGER: function (integer) {
        this.opcode('pushLiteral', integer.integer);
    },

    // Compile boolean parameter
    BOOLEAN: function (bool) {
        this.opcode('pushLiteral', bool.bool);
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
