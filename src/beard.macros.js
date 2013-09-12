/*!

The MIT License (MIT)

Copyright (c) 2013 NextUser

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

@license
*/

(function (undefined) {
    "use strict";
    var Beard;

    /*
       Constructor: Beard

        Parameters:
            tpl {String} [] Template
            data {Object} [] Data
            elements {Object} [] Elements
    */
    (Beard = function (tpl, data, elements) {
        this.tpl = tpl || '';
        this.dat = data || {};
        this.UDEF = undefined;
        this.elements = elements || {};

    }).prototype = {
        #include "prototype.js"
    };

    #include "parser.js"
    Beard.Parser = parser;

    #include "ast.js"
    #include "compiler.js"

    Beard.parse = function (input) {
        Beard.Parser.yy = Beard.AST;
        return Beard.Parser.parse(input);
    };

    Beard.compile = function (input, options) {
        options = options || {};
        var ast = Beard.parse(input),
            env = new Compiler().compile(ast, options);
        return env.result.join('');
    };
    Beard.evaluateElement = function (input, options) {
        return Beard.compile(input, options);
    };

    this.Beard = Beard;

}).call(this);
