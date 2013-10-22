CC = coffee -cj
SRC = $(CURDIR)/*.coffee
DST = $(CURDIR)/specs.js

$(DST): $(SRC)
	$(CC) -cj $@ $(SRC)

clean:
	rm -rf $(DST)

.PHONY: clean
