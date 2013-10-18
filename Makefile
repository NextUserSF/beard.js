PREPROCESS = cpp -P -C -w -x c
JISON = jison -m js
UGLIFY = uglifyjs
UGLIFYARGS = -c -m --comments

SRCDIR = $(CURDIR)/src
PARSER = $(SRCDIR)/parser.js
GRAMMAR = $(SRCDIR)/beard.yy
LEXER = $(SRCDIR)/beard.l
SRC = $(filter-out $(PARSER), $(wildcard $(SRCDIR)/*.js))
SRC_ENTRY_POINT = $(SRCDIR)/main.js
ALLSRC = $(wildcard $(SRCDIR)/*.js)

DESTDIR = $(CURDIR)/lib
LIBDEBUG = $(DESTDIR)/beard.debug.js
LIBPROD = $(DESTDIR)/beard.js
LIBPRODMIN = $(DESTDIR)/beard.min.js

DOCSDIR = $(CURDIR)/docs
DOCS = $(DOCSDIR)/beard.html

SPECDIR = $(CURDIR)/spec

all: $(LIBDEBUG) $(LIBPRODMIN) $(DOCS) specs

$(DESTDIR):
	mkdir $@

$(LIBDEBUG): $(ALLSRC) | $(DESTDIR)
	$(PREPROCESS) -DDEBUG $(SRC_ENTRY_POINT) -o $@

$(LIBPROD): $(ALLSRC) | $(DESTDIR)
	$(PREPROCESS) $(SRC_ENTRY_POINT) -o $@

$(LIBPRODMIN): $(LIBPROD)
	$(UGLIFY) $? $(UGLIFYARGS) -o $@

$(SRC): $(PARSER)

$(PARSER): $(GRAMMAR) $(LEXER)
	$(JISON) $^ -o $@

$(DOCS): $(LIBPROD) | $(DOCSDIR)
	docco -o $(DOCSDIR) $<

$(DOCSDIR):
	mkdir $@

specs:
	cd $(SPECDIR); ${MAKE} || exit; cd ..

clean:
	rm -rf $(DESTDIR)
	rm -f $(PARSER)
	rm -rf $(DOCSDIR)

.PHONY: clean specs
