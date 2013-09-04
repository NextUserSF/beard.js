COFFEE = $(CURDIR)/../node_modules/.bin/coffee
SRC    = $(CURDIR)/*.coffee
DST    = $(CURDIR)/specs.js

$(DST): $(SRC)
	@$(COFFEE) -cj $(DST) $(SRC)

clean:
	@rm -rf $(DST)

.PHONY: clean