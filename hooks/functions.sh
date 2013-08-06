# Helper functions for git hooks

# Print git repository's root directory
pgrd () {
	git rev-parse --show-toplevel
}

# Get files which are about to be commited (i.e. added to index)
f2ci () {
	git diff --cached --name-only
}

# Run jslint
# It tries to run system-wide installed jslint or uses jslint installed as node
# module in the top level directory of the repository.
jslint () {
	JSLINT=$(which jslint 2>/dev/null || echo `pgrd`/node_modules/.bin/jslint)
	$JSLINT "$@"
}
