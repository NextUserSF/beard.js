%start root

%%

root: statements EOF { return new yy.ProgramNode($1); }
    ;

statements: statement -> [$1]
          | statements statement { $1.push($2); $$ = $1; }
          ;

statement: openBlock program closeBlock -> new yy.BlockNode($1, $2, $3)
         | inlineTag -> new yy.InlineNode($1)
         | elementTag -> new yy.ElementNode($1)
         | dataTag -> new yy.DataNode($1)
         | CONTENT -> new yy.ContentNode($1)
         | COMMENT -> new yy.CommentNode($1)
         ;

openBlock: OPEN ID args CLOSE -> [$2, $3]
         | OPEN ID hash CLOSE -> [$2, [$3]]
         ;

inlineTag: OPEN_INLINE ID args CLOSE -> [$2, $3]
         | OPEN_INLINE ID hash CLOSE -> [$2, [$3]]
         ;

segments: segments SEP ID { $1.push($3); $$ = $1; }
        | ID -> [$1]
        ;

hash: hashSegment -> new yy.HashNode($1)
    ;

hashSegment: data compOperator data -> [$1, $2, $3]
           ;

compOperator: EQUALS
            | GREATER
            | LESSER
            | AND
            | OR
            ;

param: STRING -> new yy.StringNode($1)
     | INTEGER -> new yy.IntegerNode($1)
     | BOOLEAN -> new yy.BooleanNode($1)
     ;

program: simpleInverse statements -> new yy.ProgramNode([], $2)
       | statements simpleInverse statements -> new yy.ProgramNode($1, $3)
       | statements simpleInverse -> new yy.ProgramNode($1, [])
       | statements -> new yy.ProgramNode($1)
       | simpleInverse -> new yy.ProgramNode([])
       | "" -> new yy.ProgramNode([])
       ;

simpleInverse: OPEN_INVERSE CLOSE {}
             ;

closeBlock: END_BLOCK -> $1
          ;

elementTag: OPEN_ELEMENT ID CLOSE -> $2
          ;

dataTag: OPEN_VARIABLE data CLOSE -> $2
       ;

data: var -> $1
    | func -> $1
    | param -> $1
    ;

var: segments -> new yy.VariableNode($1)
   | segments ALT param -> new yy.VariableNode($1, $3)
   | func SEP segments -> new yy.VariableNode([$1].concat($3))
   | func SEP segments ALT param -> new yy.VariableNode([$1].concat($3), $5)
   ;

func: segments funcArgs -> new yy.FuncNode($1, $2)
    | segments funcArgs ALT param -> new yy.FuncNode($1, $2, $4)
    | func SEP segments funcArgs -> new yy.FuncNode([$1].concat($3), $4)
    | func SEP segments funcArgs ALT param -> new yy.FuncNode([$1].concat($3), $4, $6)
    ;

funcArgs: OP args CP -> $2
        ;

args: args COMMA data { $1.push($3); $$ = $1; }
    | data -> [$1]
    | '' -> []
    ;
