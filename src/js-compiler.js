var JSCompiler = Beard.JSCompiler = function () {};

JSCompiler.prototype = {
    compile: function (env, options) {
        this.env = env;
        this.options = options || {};
        this.source = [];
        this.i = 0;

#ifdef DEBUG
        console.debug(this.env.disassemble());
#endif
        var opcodes = env.opcodes,
            opcode,
            l = opcodes.length;

        for (; this.i < l; this.i += 1) {
            opcode = opcodes[this.i];

            if (opcode.opcode === 'DECLARE') {
                this[opcode.name] = opcode.value;
            } else {
                this[opcode.opcode].apply(this, opcode.args);
            }
        }

        return this.createFunctionContext();
    },

    createFunctionContext: function () {
        var params = [],
            source = this.mergeSource();

        params.push(source);

        return Function.apply(this, params);
    },

    // Append the string value of `content` to the current buffer
    appendContent: function (content) {
        this.source.push(this.appendToBuffer(this.quotedString(content)));
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
#ifdef DEBUG
        console.debug('JSCompiler.mergeSource() returns:', source);
#endif
        return source;
    }
};
