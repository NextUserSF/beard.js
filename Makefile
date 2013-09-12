PREPROCESS = cpp -P -C -w -x c
JISON = jison -m js
UGLIFY = uglifyjs
UGLIFYARGS = -c -m --comments

SRCDIR = $(CURDIR)/src
PARSER = $(SRCDIR)/parser.js
GRAMMAR = $(SRCDIR)/beard.yy
LEXER = $(SRCDIR)/beard.l
SRC = $(filter-out $(PARSER), $(wildcard $(SRCDIR)/*.js))
SRC_ENTRY_POINT = $(SRCDIR)/beard.macros.js

DESTDIR = $(CURDIR)/lib
LIBDEBUG = $(DESTDIR)/beard.debug.js
LIBPROD = $(DESTDIR)/beard.js
LIBPRODMIN = $(DESTDIR)/beard.min.js

all: $(LIBDEBUG) $(LIBPRODMIN)

$(DESTDIR):
	mkdir $@

$(LIBDEBUG): $(SRC) $(PARSER) | $(DESTDIR)
	$(PREPROCESS) -DDEBUG $(SRC_ENTRY_POINT) -o $@

$(LIBPROD): $(SRC) $(PARSER) | $(DESTDIR)
	$(PREPROCESS) $(SRC_ENTRY_POINT) -o $@

$(LIBPRODMIN): $(LIBPROD)
	$(UGLIFY) $? $(UGLIFYARGS) -o $@

$(SRC): $(PARSER)

$(PARSER): $(GRAMMAR) $(LEXER)
	$(JISON) $^ -o $@

clean:
	rm -rf $(DESTDIR)
	rm -f $(PARSER)
