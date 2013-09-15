%x beard com

%{

function strip (start, end) {
    return yytext = yytext.substr(start, yyleng-end);
}

%}

ID    [^\s!"#%-,\.\/;->@\[-\^`\{-~]+/[=}\s\/.]

%%

[^\x00]*?/("<%")                            {
                                                this.begin('beard');
                                                if (yytext) return 'CONTENT';
                                            }

[^\x00]+                                    return 'CONTENT';

<com>[\s\S]*?"%>"                           strip(0,2); this.popState(); return 'COMMENT';

<beard>"<%="                                return 'OPEN_VARIABLE';
<beard>"<%@"                                return 'OPEN_ELEMENT';
<beard>"<%#"                                this.popState(); this.begin('com');
<beard>"<%#"[\s\S]*?"%>"                    strip(3,5); this.popState(); return 'COMMENT';
<beard>"<% foreach"                         yytext = 'foreach'; return 'FOREACH';
<beard>"<% endforeach %>"                   this.popState(); return 'ENDFOREACH';
<beard>"<%"                                 return 'OPEN';

<beard>"|"                                  return 'ALT';
<beard>"."                                  return 'SEP';
<beard>","                                  return 'COMMA';
<beard>"("                                  return 'OP';
<beard>")"                                  return 'CP';
<beard>\s+                                  /* ignore whitespace */
<beard>"%>"                                 this.popState(); return 'CLOSE';
<beard>'"'("\\"["]|[^"])*'"'                yytext = strip(1,2).replace(/\\"/g,'"'); return 'STRING';
<beard>"'"("\\"[']|[^'])*"'"                yytext = strip(1,2).replace(/\\'/g,"'"); return 'STRING';
<beard>\-?[0-9]+                            return 'INTEGER';
<beard>"true"                               return 'BOOLEAN';
<beard>"false"                              return 'BOOLEAN';

<beard>[a-zA-Z_][a-zA-Z0-9_]*               return 'ID';

<beard>.                                    return 'INVALID';

<INITIAL,beard><<EOF>>                      return 'EOF';
