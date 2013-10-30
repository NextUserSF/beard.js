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
        this.data = data || {};
        this.UDEF = undefined;
        this.elements = elements || {};

    };

#include "prototype.js"

    // Beard.Parser
    // ------------
#include "parser.js"
    Beard.Parser = parser;
#include "ast.js"
#include "compiler.js"
#include "js-compiler.js"
#include "runtime.js"
#include "helpers.js"
#include "utils.js"

    Beard.parse = function (input) {
        Beard.Parser.yy = Beard.AST;
        return Beard.Parser.parse(input);
    };

    Beard.getRequired = function (input) {
        var ast = Beard.parse(input),
            walk = function (obj) {
                var ret = { variables: [], elements: [] },
                    key,
                    item,
                    tmp;

                for (key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        item = obj[key];

                        switch (item.constructor) {
                            case Beard.AST.VariableNode:
                                ret.variables.push(item.parts[0]);
                                break;
                            case Beard.AST.ElementNode:
                                ret.elements.push(item.id);
                                break;
                        }

                        if (typeof item === "object") {
                            tmp = walk(item);
                            ret.variables = ret.variables.concat(tmp.variables);
                            ret.elements = ret.elements.concat(tmp.elements);
                        }
                    }
                }

                return ret;
            };

        return walk(ast.statements);
    };

    this.Beard = Beard;

}).call(this);
