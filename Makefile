NODE_MODULES     = $(CURDIR)/node_modules
NODE_MODULES_BIN = $(NODE_MODULES)/.bin

BOWER            = $(NODE_MODULES_BIN)/bower
JSLINT           = $(NODE_MODULES_BIN)/jslint
PHANTOMJS        = $(NODE_MODULES_BIN)/phantomjs
SPEC             = $(CURDIR)/spec
TEST_RUNNER      = $(SPEC)/runner.phantom.js
UGLIFYJS         = $(NODE_MODULES_BIN)/uglifyjs
UGLIFYJS_ARGS    = -c -m # see https://github.com/mishoo/UglifyJS2#usage for details

BOWER_COMPONENTS = $(CURDIR)/bower_components

SRC              = $(CURDIR)/src/*.js
DEST             = $(CURDIR)/lib/beard.min.js

all: $(NODE_MODULES) lib

lint: .lint

.lint: $(SRC)
	@$(JSLINT) $(wildcard $(SRC)) >/dev/null && touch $@

lib: lint $(DEST)

$(DEST): $(SRC)
	@mkdir -p $(@D)
	@$(UGLIFYJS) $^ $(UGLIFYJS_ARGS) -o $@

$(NODE_MODULES): package.json
	@npm install

test: lib $(BOWER_COMPONENTS)
	@cd $(SPEC); ${MAKE} || exit; cd ..
	@$(PHANTOMJS) $(TEST_RUNNER)

$(BOWER_COMPONENTS): bower.json | $(NODE_MODULES)
	@$(BOWER) install

clean:
	@rm -rf $(DEST)
	@rm -rf $(NODE_MODULES)
	@rm -rf $(BOWER_COMPONENTS)
	@rm -ff .lint

.PHONY: all clean lib lint test