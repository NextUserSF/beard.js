%start root

%%

root: statements EOF { return new yy.ProgramNode($1) }
    ;

program: statements -> new yy.ProgramNode($1)
       | "" -> new yy.ProgramNode([])
       ;

statements: statement -> [$1]
          | statements statement { $1.push($2); $$ = $1; }
          ;

statement: openBlock program closeBlock -> new yy.BlockNode($1, $2, $3)
         | element -> new yy.ElementNode($1)
         | variable -> new yy.DataNode($1)
         | CONTENT -> new yy.ContentNode($1)
         | COMMENT -> new yy.CommentNode($1)
         ;

openBlock: FOREACH variable CLOSE -> [$1, new yy.DataNode($2)]
         ;

closeBlock: ENDFOREACH -> $1
          ;

element: OPEN_ELEMENT ID CLOSE -> $2
       ;

variable: OPEN_VARIABLE ID CLOSE -> [$2]
        | OPEN_VARIABLE ID ALT STRING CLOSE -> [$2, $4]
        | ID -> [$1]
        | ID ALT STRING -> [$1, $3]
        ;

param: STRING -> new yy.StringNode($1)
     | INTEGER -> new yy.IntegerNode($1)
     | BOOLEAN -> new yy.BooleanNode($1)
     | ID -> new yy.IdNode($1)
     ;
