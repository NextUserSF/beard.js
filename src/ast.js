// Beard.AST
// ---------
Beard.AST = {};

Beard.AST.ProgramNode = function (statements, inverse) {
    this.type = 'program';
    this.statements = statements;
    if (inverse) {
        this.inverse = new Beard.AST.ProgramNode(inverse);
    }
};

Beard.AST.ElementNode = function (id) {
    this.type = 'element';
    this.id = id;
};

Beard.AST.ContentNode = function (string) {
    this.type = 'content';
    this.string = string;
};

Beard.AST.DataNode = function (data) {
    this.type = 'data';
    this.data = data;
};

Beard.AST.VariableNode = function (variable, def) {
    this.type = 'variable';
    this.parts = variable;
    this.string = variable.join('.');
    this.def = def || '';
    this.isSimple = variable.length === 1;
};

Beard.AST.FuncNode = function (func, args, def) {
    this.type = 'func';
    this.parts = func;
    this.string = func.join('.');
    this.args = args;
    this.def = def || '';
};

Beard.AST.ExprNode = function (expr) {
    this.type = 'expr';
    this.parts = expr;
    this.isSimple = expr.length === 1;
};

Beard.AST.CommentNode = function (comment) {
    this.type = 'comment';
    this.comment = comment;
};

Beard.AST.IdNode = function (id) {
    this.type = 'ID';
    this.id = id;
};

Beard.AST.BlockNode = function (helper, program, close) {
    if (helper[0] !== close) {
        throw new Error(helper[0] + " doesn't match " + close);
    }
    this.type = 'block';
    this.helper = helper[0];
    this.args = helper[1];
    this.program = program;
};

Beard.AST.InlineNode = function (helper) {
    this.type = 'inline';
    this.helper = helper[0];
    this.args = helper[1];
};

Beard.AST.StringNode = function (string) {
    this.type = 'STRING';
    this.string = this.stringModeValue = string;
};

Beard.AST.IntegerNode = function (integer) {
    this.type = 'INTEGER';
    this.integer = integer;
    this.stringModeValue = Number(integer);
};

Beard.AST.BooleanNode = function (bool) {
    this.type = 'BOOLEAN';
    this.bool = bool;
    this.stringModeValue = bool === 'true';
};

Beard.AST.HashNode = function (pairs) {
    this.type = 'hash';
    this.pairs = pairs;
};
