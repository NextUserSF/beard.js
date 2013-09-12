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
        /*
            Function: set

            Set the template

            Parameters:
                tpl {String} The template as a string

            Return:
            {Beard} Current instance for chained command on this element
        */
        set: function (tpl) {
            this.tpl = tpl || '';
            return this;
        },
        /*
            Function: get

            Get the template

            Return:
            {String} The template as string
        */
        get: function () {
            return this.tpl;
        },
        /*
            Function: render

            Render the template

            Parameters:
                data {Object} [Optional] Data source

            Return:
            {String} Compilated template
        */
        render: function (data) {
            if (data) {
                this.dat = data;
            }
            return Beard.compile(this.tpl, {elements: this.elements, variables: this.dat});
        },
        /*
            Function: getRequired

            Compile the template, and returns a list of required elements and variables

            Returns an object containing an array of variables, and an array of elements:

                {
                    'elements': [
                        'first_element',
                        'second_element'
                    ],
                    'variables': [
                        'variable_name',
                        'other_variable'
                    ]
                }

            Parameters:
                tpl {String} Template to precompile. Optional, default: template set


            Return:
            {Object} On object containing arrays of required elements and variables
        */
        getRequired: function (tpl) {
            tpl = tpl || this.tpl;
            var i = 0,
                j = -1,
                res = {
                    elements: [],
                    variables: []
                },
                t,
                o,
                s2,
                key,
                sub,
                l = tpl.length;
            while (i < l) {
                j = tpl.indexOf('<%', i);
                if (j === -1) {
                    break;
                } else if (tpl[j + 2] === '+') {
                    t = tpl.indexOf('%>', i);
                    key = this.trim(tpl.substring(j + 3, t));
                    j = tpl.indexOf('<%- ' + key + ' %>', t);
                    if (j === -1) {
                        throw new Error('Missing "<%- identifier %>" at end of template / ' + tpl.substring(i));
                    }
                    res.variables.push(key);
                    i = j + String('<%- ' + key + ' %>').length;
                } else {
                    i = j;
                    j = tpl.indexOf('%>', i);
                    if (j === -1) {
                        throw new Error('Missing "%>" at end of template / ' + tpl.substring(i));
                    }
                    sub = this.trim(tpl.substring(i + 2, j));
                    o = sub.substring(0, 1);
                    s2 = this.trim(sub.substring(1));
                    if (s2.indexOf(' ') > -1) {
                        s2 = s2.split(' ')[0];
                    }
                    switch (o) {
                    case '=':
                        res.variables.push(s2);
                        break;
                    case '@':
                        res.elements.push(s2);
                        break;
                    }
                    i = j + 2;
                }
            }
            return res;
        },
        /*
            Function: compile

            Compile the template with data

            Parameters:
                tpl {String} Template
                data {Object} Data source

            Return:
            {String} Result of template compilation
        */
        /*
            Function: list

            Go through an array



            Parameters:
                tpl {String} Template to apply to each element of the list
                data {Object} Data source


            Return:
            {String} Result of template list compilation
        */
        list: function (tpl, data) {
            var i = 0,
                str = '',
                l = data && data.length > 0 ? data.length : 0;
            for (i; i < l; i += 1) {
                str += this.compile(tpl, data[i]);
            }
            return str;
        },
        /*
            Function: evaluate a tag

            Evaluation of a tag (<% ... %>)


            Parameters:
                element {String} Element to evaluate, without
                data {Object|String} Data source


            Return:
            {String} Result of evaluation
        */
        evaluate: function (element, data) {
            if (!data) {
                data = this.dat;
            }
            var o = element.substring(0, 1),
                s2 = this.trim(element.substring(1));
            switch (o) {
            case '#':
                return '';
            // Sorry for this line
            case '=':
                return String(s2.indexOf('(') > -1 ? this.func(data, s2)
                        : (s2.indexOf('.') > -1 ? this.key(data, s2)
                            : s2 === '$' ? data : this.evaluateVariable(s2, data)));
            case '@':
                return this.evaluateElement(s2, this.dat);
            }
            return element;
        },
        evaluateVariable: function (variable, data) {
            var split = variable.indexOf('|') > -1 ? variable.split('|') : [variable],
                l = split.length,
                def = l === 2 ? this.trim(split[1]) : '';
            variable = l === 2 ? this.trim(split[0]) : variable;
            return !!data[variable] ? data[variable] : def;
        },
        /*
            Function: addElements

            Add many template elements

            Parameters:
                elements {object} Key/value elements object


            Return:
            {Beard} Current instance for chained command
        */
        addElements: function (elements) {
            var k;
            for (k in elements) {
                if (elements.hasOwnProperty(k)) {
                    this.elements[k] = elements[k];
                }
            }
            return this;
        },
        /*
            Function: addElement

            Add a template element

            Parameters:
                id {string} Id of element
                element {string} Template for element


            Return:
            {Beard} Current instance for chained command
        */
        addElement: function (id, element) {
            this.elements[id] = element;
            return this;
        },
        /*
            Function: remElement

            Remove a template element

            Parameters:
                id {string} Id of element


            Return:
            {Beard} Current instance for chained command
        */
        remElement: function (id) {
            delete this.elements[id];
            return this;
        },
        /*
            Function: remElements

            Remove all elements


            Return:
            {Beard} Current instance for chained command
        */
        remElements: function () {
            this.elements = {};
            return this;
        },
        /*
            Function: addVariable

            Add some data in the data object (may be a variable, a function)

            Parameters:
                key {string} Id of variable
                value {string} Value of variable


            Return:
            {Beard} Current instance for chained command
        */
        addVariable: function (key, value) {
            this.dat[key] = value;
            return this;
        },
        /*
            Function: remVariable

            Remove some data in the data object

            Parameters:
                key {string} Id of variable


            Return:
            {Beard} Current instance for chained command
        */
        remVariable: function (key) {
            delete this.dat[key];
            return this;
        },
        /*
            Function: resetDataObject

            Remove everything in the data object

            Return:
            {Beard} Current instance for chained command
        */
        resetDataObject: function () {
            this.dat = {};
            return this;
        },
        /*
            Compile a function call

            Function: func

            Parameters:
                data {Object} Data source
                str {String} Function string to compile


            Return:
            {String} Result of compilatio,
        */
        func: function (data, str) {
            var f,
                args,
                p,
                i = 0,
                l,
                clean = [];
            str = str.split('(');
            args = this.trim(this.trim(str[1]), '\\)');
            f = this.trim(str[0]);
            if (f.indexOf('.') > -1) {
                f = this.key(data, f, true);
                p = f.parent;
                f = f.ref;
            } else {
                f = data[f];
                p = data;
            }
            if (!f) {
                return this.UDEF;
            }
            if (args === '') {
                return f.apply(p);
            }
            args = args.split(',');
            l = args.length;
            for (i; i < l; i += 1) {
                clean.push(this.arg(this.trim(args[i])));
            }
            return f.apply(p, clean);
        },
        /*
            Evaluate a function argument

            Function: arg

            Parameters:
                arg {String} Argument to evaluate


            Return:
            {mixed} Evaluation of the argument
    */
        arg: function (arg) {
            if (arg === '') {
                return '';
            }
            if (arg === 'true') {
                return true;
            }
            if (arg === 'false') {
                return false;
            }
            if (arg === 'null') {
                return null;
            }
            if (arg === 'undefined') {
                return this.UDEF;
            }
            if (!isNaN(arg)) {
                return (arg.indexOf('.') > -1 ? parseFloat(arg, 10) : parseInt(arg, 10));
            }
            return arg;
        },
        /*
            Function: key

            Get a nested variable reference

            In case the parent is required, the method will return a such object:

                {
                    ref: theReference,
                    parent: theParentObject
                }


            Parameters:
                data {Object} Data source
                key {String} Key to retrieve
                [parent=false] {Boolean} Do retrieve parent as well


            Return:
            Variable value if found, with parent if required, undefined otherwise
        */
        key: function (data, key, parent) {
            var a = key.split('.'),
                p,
                o = data,
                l = a.length,
                i = 0;
            for (i; i < l; i += 1) {
                if (a[i] === '$') {
                    i += 1;
                }
                if (!isNaN(a[i])) {
                    a[i] = parseInt(a[i], 10);
                }
                if (o && null !== o[a[i]]) {
                    p = o;
                    o = o[a[i]];
                } else {
                    if (parent) {
                        return {ref: undefined, parent: undefined};
                    }
                    return this.UDEF;
                }
            }
            if (parent) {
                return {
                    ref: o,
                    parent: p
                };
            }
            return o;
        },
        /*
            Function: trim

            Trim a string


            Parameters:
                str {String} String to trim
                token {String} [token=\s] String to trim

            Return:
            {String} Trimed string
        */
        trim: function (str, token) {
            token = token || '[ \\s\xA0]';
            return str.replace(new RegExp('^' + token + '+|' + token + '+$', 'g'), '');
        }
    };
/* parser generated by jison 0.4.13 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
var parser = (function(){
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"root":3,"statements":4,"EOF":5,"program":6,"statement":7,"openBlock":8,"closeBlock":9,"element":10,"variable":11,"CONTENT":12,"COMMENT":13,"FOREACH":14,"CLOSE":15,"ENDFOREACH":16,"OPEN_ELEMENT":17,"ID":18,"OPEN_VARIABLE":19,"ALT":20,"STRING":21,"param":22,"INTEGER":23,"BOOLEAN":24,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",12:"CONTENT",13:"COMMENT",14:"FOREACH",15:"CLOSE",16:"ENDFOREACH",17:"OPEN_ELEMENT",18:"ID",19:"OPEN_VARIABLE",20:"ALT",21:"STRING",23:"INTEGER",24:"BOOLEAN"},
productions_: [0,[3,2],[6,1],[6,0],[4,1],[4,2],[7,3],[7,1],[7,1],[7,1],[7,1],[8,3],[9,1],[10,3],[11,3],[11,5],[11,1],[11,3],[22,1],[22,1],[22,1],[22,1]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */
var $0 = $$.length - 1;
switch (yystate) {
case 1: return new yy.ProgramNode($$[$0-1])
break;
case 2:this.$ = new yy.ProgramNode($$[$0]);
break;
case 3:this.$ = new yy.ProgramNode([]);
break;
case 4:this.$ = [$$[$0]];
break;
case 5: $$[$0-1].push($$[$0]); this.$ = $$[$0-1];
break;
case 6:this.$ = new yy.BlockNode($$[$0-2], $$[$0-1], $$[$0]);
break;
case 7:this.$ = new yy.ElementNode($$[$0]);
break;
case 8:this.$ = new yy.DataNode($$[$0]);
break;
case 9:this.$ = new yy.ContentNode($$[$0]);
break;
case 10:this.$ = new yy.CommentNode($$[$0]);
break;
case 11:this.$ = [$$[$0-2], new yy.DataNode($$[$0-1])];
break;
case 12:this.$ = $$[$0];
break;
case 13:this.$ = $$[$0-1];
break;
case 14:this.$ = [$$[$0-1]];
break;
case 15:this.$ = [$$[$0-3], $$[$0-1]];
break;
case 16:this.$ = [$$[$0]];
break;
case 17:this.$ = [$$[$0-2], $$[$0]];
break;
case 18:this.$ = new yy.StringNode($$[$0]);
break;
case 19:this.$ = new yy.IntegerNode($$[$0]);
break;
case 20:this.$ = new yy.BooleanNode($$[$0]);
break;
case 21:this.$ = new yy.IdNode($$[$0]);
break;
}
},
table: [{3:1,4:2,7:3,8:4,10:5,11:6,12:[1,7],13:[1,8],14:[1,9],17:[1,10],18:[1,12],19:[1,11]},{1:[3]},{5:[1,13],7:14,8:4,10:5,11:6,12:[1,7],13:[1,8],14:[1,9],17:[1,10],18:[1,12],19:[1,11]},{5:[2,4],12:[2,4],13:[2,4],14:[2,4],16:[2,4],17:[2,4],18:[2,4],19:[2,4]},{4:16,6:15,7:3,8:4,10:5,11:6,12:[1,7],13:[1,8],14:[1,9],16:[2,3],17:[1,10],18:[1,12],19:[1,11]},{5:[2,7],12:[2,7],13:[2,7],14:[2,7],16:[2,7],17:[2,7],18:[2,7],19:[2,7]},{5:[2,8],12:[2,8],13:[2,8],14:[2,8],16:[2,8],17:[2,8],18:[2,8],19:[2,8]},{5:[2,9],12:[2,9],13:[2,9],14:[2,9],16:[2,9],17:[2,9],18:[2,9],19:[2,9]},{5:[2,10],12:[2,10],13:[2,10],14:[2,10],16:[2,10],17:[2,10],18:[2,10],19:[2,10]},{11:17,18:[1,12],19:[1,11]},{18:[1,18]},{18:[1,19]},{5:[2,16],12:[2,16],13:[2,16],14:[2,16],15:[2,16],16:[2,16],17:[2,16],18:[2,16],19:[2,16],20:[1,20]},{1:[2,1]},{5:[2,5],12:[2,5],13:[2,5],14:[2,5],16:[2,5],17:[2,5],18:[2,5],19:[2,5]},{9:21,16:[1,22]},{7:14,8:4,10:5,11:6,12:[1,7],13:[1,8],14:[1,9],16:[2,2],17:[1,10],18:[1,12],19:[1,11]},{15:[1,23]},{15:[1,24]},{15:[1,25],20:[1,26]},{21:[1,27]},{5:[2,6],12:[2,6],13:[2,6],14:[2,6],16:[2,6],17:[2,6],18:[2,6],19:[2,6]},{5:[2,12],12:[2,12],13:[2,12],14:[2,12],16:[2,12],17:[2,12],18:[2,12],19:[2,12]},{12:[2,11],13:[2,11],14:[2,11],16:[2,11],17:[2,11],18:[2,11],19:[2,11]},{5:[2,13],12:[2,13],13:[2,13],14:[2,13],16:[2,13],17:[2,13],18:[2,13],19:[2,13]},{5:[2,14],12:[2,14],13:[2,14],14:[2,14],15:[2,14],16:[2,14],17:[2,14],18:[2,14],19:[2,14]},{21:[1,28]},{5:[2,17],12:[2,17],13:[2,17],14:[2,17],15:[2,17],16:[2,17],17:[2,17],18:[2,17],19:[2,17]},{15:[1,29]},{5:[2,15],12:[2,15],13:[2,15],14:[2,15],15:[2,15],16:[2,15],17:[2,15],18:[2,15],19:[2,15]}],
defaultActions: {13:[2,1]},
parseError: function parseError(str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        throw new Error(str);
    }
},
parse: function parse(input) {
    var self = this, stack = [0], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    var args = lstack.slice.call(arguments, 1);
    this.lexer.setInput(input);
    this.lexer.yy = this.yy;
    this.yy.lexer = this.lexer;
    this.yy.parser = this;
    if (typeof this.lexer.yylloc == 'undefined') {
        this.lexer.yylloc = {};
    }
    var yyloc = this.lexer.yylloc;
    lstack.push(yyloc);
    var ranges = this.lexer.options && this.lexer.options.ranges;
    if (typeof this.yy.parseError === 'function') {
        this.parseError = this.yy.parseError;
    } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
    }
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    function lex() {
        var token;
        token = self.lexer.lex() || EOF;
        if (typeof token !== 'number') {
            token = self.symbols_[token] || token;
        }
        return token;
    }
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (this.lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + this.lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: this.lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: this.lexer.yylineno,
                    loc: yyloc,
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(this.lexer.yytext);
            lstack.push(this.lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = this.lexer.yyleng;
                yytext = this.lexer.yytext;
                yylineno = this.lexer.yylineno;
                yyloc = this.lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.apply(yyval, [
                yytext,
                yyleng,
                yylineno,
                this.yy,
                action[1],
                vstack,
                lstack
            ].concat(args));
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};
/* generated by jison-lex 0.2.1 */
var lexer = (function(){
var lexer = {
EOF:1,
parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },
// resets the lexer, sets new input
setInput:function (input) {
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0,0];
        }
        this.offset = 0;
        return this;
    },
// consumes and returns one char from the input
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }
        this._input = this._input.slice(1);
        return ch;
    },
// unshifts one char (or a string) into the input
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);
        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len - 1);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);
        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;
        this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
              this.yylloc.first_column - len
        };
        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
    },
// When called from action, caches matched text and appends it on next action
more:function () {
        this._more = true;
        return this;
    },
// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function () {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
        return this;
    },
// retain first n characters of the match
less:function (n) {
        this.unput(this.match.slice(n));
    },
// displays already matched input, i.e. for error messages
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },
// displays upcoming input, i.e. for error messages
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
    },
// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
    },
// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function (match, indexed_rule) {
        var token,
            lines,
            backup;
        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }
        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            return false; // rule action called reject() implying the next rule should be tested instead.
        }
        return false;
    },
// return next match in input
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }
        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rules[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = false;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
    },
// return next match that has a token
lex:function lex() {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },
// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },
// pop the previously active lexer condition state off the condition stack
popState:function popState() {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },
// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules() {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },
// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState(n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },
// alias for begin(condition)
pushState:function pushState(condition) {
        this.begin(condition);
    },
// return the number of states currently on the stack
stateStackSize:function stateStackSize() {
        return this.conditionStack.length;
    },
options: {},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {
function strip (start, end) {
    return yy_.yytext = yy_.yytext.substr(start, yy_.yyleng-end);
}
var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:
                                                this.begin('beard');
                                                if (yy_.yytext) return 12;
break;
case 1:return 12;
break;
case 2:strip(0,2); this.popState(); return 13;
break;
case 3:return 19;
break;
case 4:return 17;
break;
case 5:this.popState(); this.begin('com');
break;
case 6:strip(3,5); this.popState(); return 13;
break;
case 7:yy_.yytext = 'foreach'; return 14;
break;
case 8:this.popState(); return 16;
break;
case 9:return 'OPEN';
break;
case 10:return 20;
break;
case 11:/* ignore whitespace */
break;
case 12:this.popState(); return 15;
break;
case 13:yy_.yytext = strip(1,2).replace(/\\"/g,'"'); return 21;
break;
case 14:yy_.yytext = strip(1,2).replace(/\\'/g,"'"); return 21;
break;
case 15:return 18;
break;
case 16:return 'INVALID';
break;
case 17:return 5;
break;
}
},
rules: [/^(?:[^\x00]*?(?=(<%)))/,/^(?:[^\x00]+)/,/^(?:[\s\S]*?%>)/,/^(?:<%=)/,/^(?:<%@)/,/^(?:<%#)/,/^(?:<%#[\s\S]*?%>)/,/^(?:<% foreach\b)/,/^(?:<% endforeach %>)/,/^(?:<%)/,/^(?:\|)/,/^(?:\s+)/,/^(?:%>)/,/^(?:"(\\["]|[^"])*")/,/^(?:'(\\[']|[^'])*')/,/^(?:([^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=[=}\s\/.])))/,/^(?:.)/,/^(?:$)/],
conditions: {"beard":{"rules":[3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],"inclusive":false},"com":{"rules":[2],"inclusive":false},"INITIAL":{"rules":[0,1,17],"inclusive":true}}
};
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();
    Beard.Parser = parser;
Beard.AST = {};
Beard.AST.ProgramNode = function (statements) {
    this.type = "program";
    this.statements = statements;
};
Beard.AST.ElementNode = function (id) {
    this.type = "element";
    this.id = id;
};
Beard.AST.ContentNode = function (string) {
    this.type = "content";
    this.string = string;
};
Beard.AST.DataNode = function (variable) {
    this.type = "data";
    this.variable = variable[0];
    this.def = variable[1] || '';
};
Beard.AST.CommentNode = function (comment) {
    this.type = "comment";
    this.comment = comment;
};
Beard.AST.IdNode = function (id) {
    this.type = "ID";
    this.id = id;
};
Beard.AST.BlockNode = function (beard, program, close) {
    this.type = "block";
    this.beard = beard;
    this.program = program;
};
var Compiler = Beard.Compiler = function () {};
Compiler.prototype = {
    compiler: Compiler,
    compile: function (program, options) {
        var statements = program.statements,
            i = 0,
            l = statements.length,
            statement;
        options.elements = options.elements || {};
        options.variables = options.variables || {};
        this.options = options;
        this.result = [];
        for (i; i < l; i += 1) {
            statement = statements[i];
            console.log(statement);
            this[statement.type](statement);
        }
        return this;
    },
    element: function (element) {
        if (this.options.elements[element.id]) {
            this.result.push(Beard.evaluateElement(this.options.elements[element.id], this.options));
        } else {
            this.result.push("Element " + element.id + " not found");
        }
    },
    content: function (string) {
        this.result.push(string.string);
    },
    data: function (data) {
        if (typeof this.options.variables[data.variable] === 'undefined') {
            this.result.push(data.def);
        } else {
            this.result.push(this.options.variables[data.variable]);
        }
    },
    getData: function (data) {
        return (!!this.options.variables[data.variable] ?
            this.options.variables[data.variable] : data.def);
    },
    comment: function () { },
    block: function (block) {
        // TODO: This is ugly
        if (block.beard[0] === 'foreach') {
            var v = this.getData(block.beard[1]),
                l,
                key,
                value,
                options,
                env;
            if (v instanceof Array) {
                l = v.length;
                for (key = 0; key < l; key += 1) {
                    value = v[key];
                    options = this.options;
                    options.variables.key = key;
                    options.variables.value = value;
                    env = new Compiler().compile(block.program, options);
                    this.result = this.result.concat(env.result);
                }
            } else if (v instanceof Object) {
                for (key in v) {
                    if (v.hasOwnProperty(key)) {
                        value = v[key];
                        options = this.options;
                        options.variables.key = key;
                        options.variables.value = value;
                        env = new Compiler().compile(block.program, options);
                        this.result = this.result.concat(env.result);
                    }
                }
            }
        }
    }
};
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
