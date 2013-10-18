var Literal = function (value) {
    this.value = value;
};

// Beard.JSCompiler
// ----------------
var JSCompiler = Beard.JSCompiler = function () {};

JSCompiler.prototype = {
    namespace: 'Beard',

    nameLookup: function (parent, name) {
        if (/^[0-9]+$/.test(name)) {
            return parent + '[' + name + ']';
        }

        if (JSCompiler.isValidVarName(name)) {
            return parent + '.' + name;
        }

        return parent + "['" + name + "']";
    },

    appendToBuffer: function (str) {
        if (this.env.isSimple) {
            return 'return ' + str + ';';
        }
        return {
            appendToBuffer: true,
            content: str,
            toString: function () {
                return "buffer += " + str + ";";
            }
        };
    },

    initializeBuffer: function () {
        return this.quotedString('');
    },

    compile: function (env, options, context, asObject) {
        this.env = env;
        this.options = options || {};

        this.name = this.env.name;
        this.isChild = !!context;
        this.context = context || {
            programs: [],
            envs: [],
            aliases: {}
        };

        this.preamble();

        this.stackSlot = 0;
        this.stackVars = [];
        this.i = 0;
        this.compileStack = [];
        this.inlineStack = [];

        this.compileChildren(env, options);

        var opcodes = env.opcodes,
            opcode,
            l = opcodes.length;

        for (; this.i < l; this.i += 1) {
            opcode = opcodes[this.i];

#ifdef DEBUG
            console.log('OPCODE:', opcode.opcode, opcode.args);
#endif
            this[opcode.opcode].apply(this, opcode.args);
        }

        return this.createFunctionContext(asObject);
    },

    preamble: function () {
        var out = [];

        if (!this.isChild) {
            var namespace = this.namespace;
            var copies = 'helpers = this.merge(helpers, ' + namespace + '.helpers);';
            out.push(copies);
        } else {
            out.push('');
        }

        if (!this.env.isSimple) {
            out.push(', buffer = ' + this.initializeBuffer());
        } else {
            out.push('');
        }

        this.lastContext = 0;
        this.source = out;
    },

    createFunctionContext: function (asObject) {
        if (!this.isChild) {
            for (var alias in this.context.aliases) {
                if (this.context.aliases.hasOwnProperty(alias)) {
                    this.source[1] = this.source[1] + ', ' + alias + '=' + this.context.aliases[alias];
                }
            }
        }

        if (this.source[1]) {
            this.source[1] = 'var ' + this.source[1].substring(2) + ';';
        }

        // Merge children
        if (!this.isChild) {
            this.source[1] += '\n' + this.context.programs.join('\n') + '\n';
        }

        if (!this.env.isSimple) {
            this.source.push('return buffer;');
        }

        var params = this.isChild ? ['depth0', 'data'] : ['Beard', 'depth0', 'helpers', 'elements', 'data'];

        for (var i = 0, l = this.env.depths.list.length; i < l; i++) {
            params.push('depth' + this.env.depths.list[i]);
        }

        var source = this.mergeSource();

        if (asObject) {
            params.push(source);

            return Function.apply(this, params);
        }
        var functionSource = 'function ' + (this.name || '') + '(' + params.join(',') + ') {\n  ' + source + '}';
        return functionSource;
    },

    // Append the string value of `content` to the current buffer
    appendContent: function (content) {
        this.source.push(this.appendToBuffer(this.quotedString(content)));
    },

    // Push a quoted version of `string` onto the stack
    pushString: function (str) {
        this.pushStackLiteral(this.quotedString(str));
    },

    // Push an expression onto the stack
    push: function (expr) {
        this.inlineStack.push(expr);
        return expr;
    },

    // Push a value onto the stack
    pushLiteral: function (value) {
        this.pushStackLiteral(value);
    },

    // Invoke element
    invokeElement: function (name) {
        var params = [this.nameLookup('elements', name, 'element'), 'depth0', 'elements'];

        this.push('this.invokeElement(' + params.join(', ') + ')');
    },

    // Invoke known helper
    invokeKnownHelper: function (name, isBlock) {
        var helper = this.setupHelper(name, false, isBlock);
        this.push(helper.name + '.call(' + helper.callArgs + ')');
    },

    // Invoke helper
    invokeHelper: function (name, isBlock) {
        var helper = this.setupHelper(name, true, isBlock);

        this.context.aliases.helperMissing = 'helpers.helperMissing';
        this.push(helper.name + ' ? ' + helper.name + '.call(' + helper.callArgs + ') : helperMissing.call(' + helper.helperMissingArgs + ')');
    },

    // Setup helper
    setupHelper: function (name, missingArgs, isBlock) {
        var args = [],
            foundHelper = this.nameLookup('helpers', name, 'helper');

        this.setupArgs(args, isBlock);

        return {
            args: args,
            name: foundHelper,
            callArgs: ['depth0'].concat(args).join(', '),
            helperMissingArgs: missingArgs && ["depth0", this.quotedString(name)].concat(args).join(', ')
        };
    },

    // Setup arguments
    setupArgs: function (args, isBlock) {
        var options = [],
            arg,
            inverse,
            program;

        arg = this.popStack();

        if (isBlock) {
            inverse = this.popStack();
            program = this.popStack();

            if (program || inverse) {
                if (!program) {
                    this.context.aliases.self = 'this';
                    program = 'self.noop';
                }

                if (!inverse) {
                    this.context.aliases.self = 'this';
                    inverse = 'self.noop';
                }

                options.push('inverse:' + inverse);
                options.push('fn:' + program);
            }
        }

        args.push(arg);
        options = '{' + options.join(',') + '}';
        args.push(options);

        return args.join(', ');
    },

    // Coerces `value` to a String and appends it to the current buffer.
    append: function () {
        this.flushInline();
        var local = this.popStack();
        this.source.push('if(' + local + ' || ' + local + ' === 0) { ' + this.appendToBuffer(local) + ' }');
        if (this.env.isSimple) {
            this.source.push('else { ' + this.appendToBuffer("''") + ' }');
        }
    },

    // Looks up the value of `name` on the current context and pushes it onto the
    // stack.
    lookupOnContext: function (name) {
        this.push(this.nameLookup('depth' + this.lastContext, name, 'context'));
    },

    // Replace the value on the stack with the result of looking up `name` on `value`
    lookup: function (name) {
        this.replaceStack(function (current) {
            return current + ' == null || ' + current + ' === false ? ' + current + ' : ' + this.nameLookup(current, name, 'context');
        });
    },

    fallback: function () {
        this.flushInline();

        var name = this.topStackName(),
            def = this.popStack();

        this.source.push('if (!' + name + ' && ' + name + ' !== 0) { ' + name + ' = ' + def + '; }');
    },

    funcCall: function () {
        this.flushInline();

        var args = this.popStack(),
            name = this.topStackName();

        this.source.push('if (typeof ' + name + ' === "function") { ' + name + ' = ' + name + '.apply(depth0, ' + args + '); }');
    },

    pushArgs: function (argc) {
        this.flushInline();

        var i = 0,
            arg,
            args = [];

        for (; i < argc; i += 1) {
            arg = this.popStack();
            args.unshift(arg);
        }
        this.push('[' + args.join(',') + ']');
    },

    pushHash: function (length) {
        this.flushInline();

        var i = 0,
            item,
            expr = [];

        for (; i < length; i += 1) {
            item = this.popStack();
            expr.unshift(item);
        }
        this.push('(' + expr.join(' ') + ')');
    },

    pushProgram: function (guid) {
        if (guid != null) {
            this.pushStackLiteral(this.programExpression(guid));
        } else {
            this.pushStackLiteral(null);
        }
    },

    programExpression: function (guid) {
        this.context.aliases.self = "this";

        if (guid == null) {
            return 'self.noop';
        }

        var child = this.env.children[guid],
            depths = child.depths.list,
            depth,
            programParams = [child.index, child.name, 'data'],
            i = 0;

        for (; i < depths.length; i += 1) {
            depth = depths[i];

            if (depth === 1) {
                programParams.push('depth0');
            } else {
                programParams.push('depth' + (depth - 1));
            }
        }

        return (depths.length === 0 ? 'self.program(' : 'self.programWithDepth(') +
                    programParams.join(', ') + ')';
    },

    replaceStack: function (callback) {
        var prefix = '',
            inline = this.isInline(),
            stack;

        if (inline) {
            var top = this.popStack(true);

            if (top instanceof Literal) {
                // Literals do not need to be inlined
                stack = top.value;
            } else {
                // Get or create the current stack name for use by the inline
                var name = this.stackSlot ? this.topStackName() : this.incrStack();

                prefix = '(' + this.push(name) + ' = ' + top + '),';
                stack = this.topStack();
            }
        } else {
            stack = this.topStack();
        }

        var item = callback.call(this, stack);

        if (inline) {
            if (this.inlineStack.length || this.compileStack.length) {
                this.popStack();
            }
            this.push('(' + prefix + item + ')');
        } else {
            // Prevent modification of the context depth variable.
            if (!/stack/.test(stack)) {
                stack = this.nextStack();
            }

            this.source.push(stack + ' = (' + prefix + item + ');');
        }
        return stack;
    },

    flushInline: function () {
        var inlineStack = this.inlineStack,
            i = 0,
            l = inlineStack.length,
            entry;

        if (l) {
            this.inlineStack = [];
            for (; i < l; i += 1) {
                entry = inlineStack[i];
                if (entry instanceof Literal) {
                    this.compileStack.push(entry);
                } else {
                    this.pushStack(entry);
                }
            }
        }
    },

    popStack: function (wrapped) {
        var inline = this.isInline(),
            item = (inline ? this.inlineStack : this.compileStack).pop();

        if (!wrapped && (item instanceof Literal)) {
            return item.value;
        }

        if (!inline) {
            this.stackSlot--;
        }

        return item;
    },

    isInline: function () {
        return this.inlineStack.length;
    },

    topStack: function (wrapped) {
        var stack = (this.isInline() ? this.inlineStack : this.compileStack),
            item = stack[stack.length - 1];

        if (!wrapped && (item instanceof Literal)) {
            return item.value;
        } else {
            return item;
        }
    },

    quotedString: function (str) {
        return '"' + str
            .replace(/\\/g, '\\\\')
            .replace(/"/g, '\\"')
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '\\r')
            .replace(/\u2028/g, '\\u2028')
            .replace(/\u2029/g, '\\u2029') + '"';
    },

    mergeSource: function () {
        var source = '',
            buffer,
            i = 0,
            l = this.source.length,
            line;

        for (; i < l; i += 1) {
            line = this.source[i];
            if (line.appendToBuffer) {
                if (buffer) {
                    buffer = buffer + '\n    + ' + line.content;
                } else {
                    buffer = line.content;
                }
            } else {
                if (buffer) {
                    source += 'buffer += ' + buffer + ';\n  ';
                    buffer = undefined;
                }
                source += line + '\n  ';
            }
        }
        return source;
    },

    pushStackLiteral: function (item) {
        return this.push(new Literal(item));
    },

    pushStack: function (item) {
        this.flushInline();

        var stack = this.incrStack();

        if (item) {
            this.source.push(stack + '=' + item + ';');
        }

        this.compileStack.push(stack);

        return stack;
    },

    nextStack: function () {
        return this.pushStack();
    },

    incrStack: function () {
        this.stackSlot++;

        if (this.stackSlot > this.stackVars.length) {
            this.stackVars.push('stack' + this.stackSlot);
        }

        return this.topStackName();
    },

    topStackName: function () {
        return 'stack' + this.stackSlot;
    },

    compiler: JSCompiler,

    compileChildren: function (env, options) {
        var children = env.children,
            i = 0,
            l = children.length,
            child,
            compiler;

        for (; i < l; i += 1) {
            child = children[i];
            compiler = new this.compiler();

            var index = this.matchExistingProgram(child);

            if (index == null) {
                this.context.programs.push(''); // Placeholder to prevent name conflicts for nested children
                index = this.context.programs.length;
                child.index = index;
                child.name = 'program' + index;
                this.context.programs[index] = compiler.compile(child, options, this.context);
                this.context.envs[index] = child;
            } else {
                child.index = index;
                child.name = 'program' + index;
            }
        }
    },

    matchExistingProgram: function (child) {
        var i = 0,
            l = this.context.envs.length,
            env;

        for (; i < l; i += 1) {
            env = this.context.envs[i];
            if (env && env.equals(child)) {
                return i;
            }
        }
    }
};

var reservedWords = (
    "break else new var" +
    " case finally return void" +
    " catch for switch while" +
    " continue function this with" +
    " default if throw" +
    " delete in try" +
    " do instanceof typeof" +
    " abstract enum int short" +
    " boolean export interface static" +
    " byte extends long super" +
    " char final native synchronized" +
    " class float package throws" +
    " const goto private transient" +
    " debugger implements protected volatile" +
    " double import public let yield"
).split(" ");

var compilerWords = JSCompiler.RESERVED_WORDS = {};

for(var i=0, l=reservedWords.length; i<l; i++) {
  compilerWords[reservedWords[i]] = true;
}

JSCompiler.isValidVarName = function (name) {
    if (!JSCompiler.RESERVED_WORDS[name] && /^[a-zA-Z_$][0-9a-zA-Z_$]+$/.test(name)) {
        return true;
    }
    return false;
};
