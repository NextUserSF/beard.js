function isFunction (value) {
    return typeof value === 'function';
};

// fallback for older versions of Chrome and Safari
if (isFunction(/x/)) {
    isFunction = function (value) {
        return typeof value === 'function' && toString.call(value) === '[object Function]';
    };
}

function isArray (value) {
    return (value && typeof value === 'object') ? toString.call(value) === '[object Array]' : false;
};

// Basic SafeString type
Beard.SafeString = function (str) {
    this.string = str;
};

Beard.SafeString.prototype.toString = function () {
    return '' + this.string;
};

var escape = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27',
    '`': '&#x60'
};

var badChars = /[&<>"'`]/g;
var possible = /[&<>"'`]/;

var escapeChars = function (chr) {
    return escape[chr] || '&amp;';
};

// Beard.Utils
// -----------
Beard.Utils = {
    extend: function (obj, value) {
        var key;

        for (key in value) {
            if (value.hasOwnProperty(key)) {
                obj[key] = value[key];
            }
        }
    },

    escapeExpression: function (str) {
        if (str instanceof Beard.SafeString) {
            return str.toString();
        } else if (!str && str !== 0) {
            return '';
        }

        str = '' + str;

        if (!possible.test(str)) {
            return str;
        }

        return str.replace(badChars, escapeChars);
    },

    isEmpty: function (value) {
        if (!value && value !== 0) {
            return true;
        }

        if (isArray(value) && value.length === 0) {
            return true;
        }

        return false;
    }
};
