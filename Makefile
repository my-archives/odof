REPORTER = dot
MOCHA = $(which mocha)

test:
	@MOCHA \
		--reporter $(REPORTER) \
		--ui bdd \
		test/*.js

.PHONY: test
