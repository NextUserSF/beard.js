//     Beard.js
//
//     The MIT License (MIT)
//     Copyright (c) 2013 NextUser

(function (undefined) {
    "use strict";
    var Beard;

    // Constructor
    // ------------------

    // Parameters:
    //
    // * `tpl` - Template
    // * `data` - Data
    // * `elements` - Elements
    //
    //
    //     var beard = new Beard(tpl, data, elements);
    //
    Beard = function (tpl, data, elements) {
        this.tpl = tpl || '';
        this.dat = data || {};
        this.UDEF = undefined;
        this.elements = elements || {};

    };

#include "prototype.js"

    // Beard.Parser
    // ------------
#include "parser.js"
    Beard.Parser = parser;

    // Beard.AST
    // ---------
#include "ast.js"
    // Beard.Compiler
    // --------------
#include "compiler.js"
    // Helpers
    // -------
#include "helpers.js"

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
