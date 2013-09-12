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
