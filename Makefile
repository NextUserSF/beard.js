NODE_MODULES = node_modules
BRUNCH = $(NODE_MODULES)/.bin/brunch
JSLINT = $(NODE_MODULES)/.bin/jslint

SRC_DIR = $(CURDIR)/src

RELEASE_REPO = git@github.com:NextUserSF/beard.js.git
RELEASE_DIR = build
RELEASE_FILES = beard.js beard.min.js

GIT_DIR = $(shell git rev-parse --git-dir)
GIT_HOOKS = $(GIT_DIR)/hooks
HOOKS = $(CURDIR)/hooks/*

# Default make target
develop:
	@echo "Building application with brunch (development)..."
	@$(BRUNCH) build -o

production:
	@echo "Building application with brunch (production)..."
	@$(BRUNCH) build -o -c config-production.coffee

check-git-dirty:
	@if [ -n "$(shell git status --porcelain)" ]; then \
		echo "There are uncommited changes. Please, commit and try again."; \
		exit 1; \
	fi

release: check-git-dirty develop production
	@echo "Release..."
	@npm version patch
	@git commit -m "New version `grep version $(CURDIR)/package.json | grep -o '[0-9]\.[0-9]\.[0-9]\+'`"
	@git push

lint:
	@echo Checking files with JSLint...
	@find $(SRC_DIR) -name "*.js" -print0 | xargs -0 $(JSLINT)

clean:
	@echo Cleaning...
	@rm -rf build

install-hooks:
	@echo Installing git hooks...
	@for FILE in $(HOOKS); do \
		ln -s -f $$FILE $(GIT_HOOKS); \
	done

.PHONY: \
    check-git-dirty \
    clean \
    develop \
    install-hooks \
    production \
    release \
