%start root

%%

root: statements EOF { return new yy.ProgramNode($1); }
    ;

program: statements -> new yy.ProgramNode($1)
       | "" -> new yy.ProgramNode([])
       ;

statements: statement -> [$1]
          | statements statement { $1.push($2); $$ = $1; }
          ;

statement: openBlock program closeBlock -> new yy.BlockNode($1, $2, $3)
         | elementTag -> new yy.ElementNode($1)
         | variableTag -> $1
         | CONTENT -> new yy.ContentNode($1)
         | COMMENT -> new yy.CommentNode($1)
         ;

openBlock: FOREACH segments CLOSE -> [$1, new yy.DataNode($2)]
         ;

closeBlock: ENDFOREACH -> $1
          ;

elementTag: OPEN_ELEMENT ID CLOSE -> $2
          ;

variableTag: OPEN_VARIABLE var CLOSE -> $2
           | OPEN_VARIABLE func CLOSE -> $2
           ;

var: segments -> new yy.DataNode($1)
   | segments ALT param -> new yy.DataNode($1, $3)
   | func SEP segments -> new yy.DataNode([$1].concat($3))
   | func SEP segments ALT param -> new yy.DataNode([$1].concat($3), $5)
   ;

func: segments OP args CP -> new yy.FuncNode($1, $3)
    | segments OP args CP ALT param -> new yy.FuncNode($1, $3, $6)
    | func SEP segments OP args CP -> new yy.FuncNode([$1].concat($3), $5)
    | func SEP segments OP args CP ALT param -> new yy.FuncNode([$1].concat($3), $5, $8)
    ;

segments: segments SEP ID { $1.push($3); $$ = $1; }
        | ID -> [$1]
        ;

args: args COMMA param { $1.push($3); $$ = $1; }
    | param -> [$1]
    | '' -> []
    ;

param: STRING -> new yy.StringNode($1)
     | INTEGER -> new yy.IntegerNode($1)
     | BOOLEAN -> new yy.BooleanNode($1)
     | ID -> new yy.IdNode($1)
     ;
