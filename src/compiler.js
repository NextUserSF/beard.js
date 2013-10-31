// Beard.Compiler
// --------------
var Compiler = Beard.Compiler = function () {};

Compiler.prototype = {
    compiler: Compiler,
    guid: 0,

    equals: function (other) {
        var l = this.opcodes.length,
            i = 0,
            j = 0,
            opcode,
            otherOpcode;

        if (other.opcodes.length !== l) {
            return false;
        }

        for (; i < l; i += 1) {
            opcode = this.opcodes[i];
            otherOpcode = other.opcodes[i];

            if (opcode.opcode !== otherOpcode.opcode || opcode.args.length !== otherOpcode.args.length) {
                return false;
            }

            for (; j < opcode.args.length; j += 1) {
                if (opcode.args[j] !== otherOpcode.args[j]) {
                    return false;
                }
            }
        }

        l = this.children.length;
        if (other.children.length !== l) {
            return false;
        }

        for (i = 0; i < l; i += 1) {
            if (!this.children[i].equals(other.children[i])) {
                return false;
            }
        }

        return true;
    },

    compile: function (program, options) {
        this.children = [];
        this.depths = {list: []};
        this.options = options;

        var knownHelpers = this.options.knownHelpers;
        this.options.knownHelpers = {
            'foreach': true,
            'if': true
        };

        if (knownHelpers) {
            for (var name in knownHelpers) {
                this.options.knownHelpers[name] = knownHelpers[name];
            }
        }

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
            console.log('STATEMENT:', statement);
#endif
            this[statement.type](statement);
        }

        this.isSimple = l === 1;

        this.depths.list = this.depths.list.sort(function (a, b) {
            return a - b;
        });

        return this;
    },

    compileProgram: function (program) {
        var result = new this.compiler().compile(program, this.options),
            guid = this.guid++;

        this.useElement = this.useElement || result.useElement;
        this.children[guid] = result;

        return guid;
    },

    // Compile element
    element: function (element) {
        this.useElement = true;

        this.opcode('push', 'depth0');
        this.opcode('invokeElement', element.id);
        this.opcode('append');
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
            if (typeof variable.parts[0] === 'object') {
                this[variable.parts[0].type](variable.parts[0]);
            } else {
                this.opcode('lookupOnContext', variable.parts[0]);
            }
        }

        for (; i < l; i += 1) {
            if (typeof variable.parts[i] === 'object') {
                this[variable.parts[i].type](variable.parts[i]);
            } else {
                this.opcode('lookup', variable.parts[i]);
            }
        }

        if (variable.def) {
            this[variable.def.type](variable.def);
            if (variable.def.type === 'variable') {
                this.opcode('fallbackVariable');
            } else {
                this.opcode('fallback');
            }
        }
    },

    // Compile function call
    func: function (func) {
        var name = func.parts[0],
            i = 1,
            l = func.parts.length;

        if (!name) {
            this.opcode('pushContext');
        } else {
            if (typeof func.parts[0] === 'object') {
                this[func.parts[0].type](func.parts[0]);
            } else {
                this.opcode('lookupOnContext', func.parts[0]);
            }
        }

        for (; i < l; i += 1) {
            if (typeof func.parts[i] === 'object') {
                this[func.parts[i].type](func.parts[i]);
            } else {
                this.opcode('lookup', func.parts[i]);
            }
        }

        if (!Beard.Utils.isEmpty(func.args)) {
            this.args(func.args);
            this.opcode('pushArgs', func.args.length);
        } else {
            this.opcode('pushArgs', 0);
        }

        this.opcode('funcCall');

        if (func.def) {
            this[func.def.type](func.def);
            this.opcode('fallback');
        }
    },

    // Compile function's arguments
    args: function (args) {
        var i = 0,
            l = args.length,
            arg;

        for (; i < l; i += 1) {
            arg = args[i];
            this[arg.type](arg);
        }
    },

    // Compile expression
    expr: function (expr) {
        var i = 0,
            l = expr.parts.length,
            item;

        for (; i < l; i += 1) {
            item = expr.parts[i];
            if (typeof item !== 'string') {
                this[item.type](item);
            } else {
                this.opcode('pushLiteral', item);
            }
        }

        if (!expr.isSimple) {
            this.opcode('pushExpr', l);
        }
    },

    // Compile comment
    comment: function () {},

    // Compile block instructions code
    block: function (block) {
        var helper = block.helper,
            args = block.args || [],
            program = block.program,
            inverse = program.inverse;

        program = this.compileProgram(program);

        if (inverse) {
            inverse = this.compileProgram(inverse);
        }

        this.opcode('pushProgram', program);
        this.opcode('pushProgram', inverse);

        if (args.length) {
            this.args(args);
        }

        this.opcode('pushArgs', args.length);

        if (this.options.knownHelpers[helper]) {
            this.opcode('invokeKnownHelper', helper, true);
        } else {
            this.opcode('invokeHelper', helper, true);
        }

        this.opcode('append');
    },

    // Compile inline
    inline: function (inline) {
        var helper = inline.helper,
            args = inline.args;

        if (args.length) {
            this.args(args);
        }

        this.opcode('pushArgs', args.length);

        if (this.options.knownHelpers[helper]) {
            this.opcode('invokeKnownHelper', helper);
        } else {
            this.opcode('invokeHelper', helper);
        }

        this.opcode('append');
    },

    // Compile hash
    hash: function (hash) {
        var i = 0,
            l = hash.pairs.length,
            item;

        for (; i < l; i += 1) {
            item = hash.pairs[i];
            if (typeof item !== 'string') {
                this[item.type](item);
            } else {
                this.opcode('pushLiteral', item);
            }
        }

        this.opcode('pushHash', l);
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
            tplSpec = new Beard.JSCompiler().compile(env, options, undefined, true);

#ifdef DEBUG
        console.log('TEMPLATE SPEC:', tplSpec);
#endif

        return Beard.template(tplSpec);
    };

    return function (variables, elements) {
        if (!compiled) {
            compiled = compile();
        }

        return compiled.call(this, variables, elements);
    };
};
