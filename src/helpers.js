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
Beard.registerHelper('foreach', function (data, program, options) {
    var key,
        value,
        l,
        program_options,
        env,
        result = [];

    data = data[0] || {};
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

    return result.join('');
}, true);
