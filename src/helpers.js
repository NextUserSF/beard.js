// Helpers
// -------
#define COMPOPERATOR /^(={1,3}|<|>|&&|\|\|)$/

Beard.BlockHelpers = Beard.Helpers = {};

Beard.registerHelper = function (name, func, is_block) {
    is_block = !!is_block;

    if (is_block) {
        Beard.BlockHelpers[name] = func;
    } else {
        Beard.Helpers[name] = func;
    }
};

// ### Core Helpers
Beard.registerHelper('foreach', function (args, program, options) {
#ifdef DEBUG
    console.log('Helper foreach BEGIN');
    console.log('Arguments:', arguments);
#endif
    var i = 0,
        argc = args.length,
        data,
        key,
        value,
        l,
        program_options,
        env,
        result = [];

    for (; i < argc; i++) {
        data = args[i];
        if (!data) {
            continue;
        }
        // Iterate through the array
        if (data instanceof Array) {
            l = data.length;
            for (key = 0; key < l; key++) {
                program_options = options;
                value = data[key];
                program_options.variables.key = key;
                program_options.variables.value = value;
                env = new Compiler().compile(program, program_options);
                result = result.concat(env.result);
            }
        } else if (data instanceof Object) {
            for (key in data) {
                if (data.hasOwnProperty(key)) {
                    value = data[key];
                    program_options = options;
                    value = data[key];
                    program_options.variables.key = key;
                    program_options.variables.value = value;
                    env = new Compiler().compile(program, program_options);
                    result = result.concat(env.result);
                }
            }
        } else {
            throw new Error('Data should be either Object or Array');
        }
    }

    return result.join('');
}, true);

Beard.registerHelper('if', function (args, program, options) {
#ifdef DEBUG
    console.log('Helper if BEGIN');
    console.log('Arguments:', arguments);
#endif
    var data = args[0],
        env,
        result = [],
        positive;

    if (args.length > 1) {
        throw new Error('Arguments count error');
    }

    if (typeof data === 'object' &&
        data instanceof Array &&
        data.length === 3
        && COMPOPERATOR.test(data[1])) {
            // We've got hash
            switch (data[1]) {
                case '=':
                case '==':
                    positive = data[0] == data[2];
                    break;
                case '===':
                    positive = data[0] === data[2];
                    break;
                case '<':
                    positive = data[0] < data[2];
                    break;
                case '>':
                    positive = data[0] > data[2];
                    break;
                case '&&':
                    positive = data[0] && data[2];
                    break;
                case '||':
                    positive = data[0] || data[2];
                    break;
            }
    } else {
        // Otherwise, let's check if passed data is truthy/falsy
        positive = !!data;
    }
    if (positive) {
#ifdef DEBUG
        console.log('Helper IF: Positive test');
#endif
        env = new Compiler().compile(program, options);
        result = env.result;
    } else {
#ifdef DEBUG
        console.log('Helper IF: Negative test');
#endif
        env = new Compiler().compile(program.inverse, options);
        result = env.result;
    }

    return result.join('');
}, true);
