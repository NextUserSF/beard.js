// Helpers
// -------

Beard.helpers = {};

Beard.registerHelper = function (name, func) {
    this.helpers[name] = func;
};

Beard.registerHelper('foreach', function (context, options) {
    var fn = options.fn,
        i = 0,
        ret = '',
        data = {};

    context = context[0];

    if (context && typeof context === 'object') {
        if (isArray(context)) {
            for (var j = context.length; i < j; i++) {
                data = {key: i, value: context[i]};
                ret = ret + fn(data);
            }
        } else {
            for (var key in context) {
                if(context.hasOwnProperty(key)) {
                    data = {key: key, value: context[key]};
                    ret = ret + fn(data);
                }
            }
        }
    } else {
        if (context) {
            throw new Error('Data should be either Object or Array');
        }
    }

    return ret;
});

Beard.registerHelper('if', function (conditional, options) {
    conditional = conditional[0];

    if (isFunction(conditional)) {
        conditional = conditional.call(this);
    }

    if (Beard.Utils.isEmpty(conditional) || conditional === 0) {
        return options.inverse(this);
    } else {
        return options.fn(this);
    }
});

Beard.registerHelper('helperMissing', function (arg) {
    throw new Error('Missing helper: "' + arg + '"');
});
