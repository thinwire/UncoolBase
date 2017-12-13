TSCOPTS = --allowJs --outFile game.js --removeComments --sourceMap

all:
	tsc ${TSCOPTS} src/main.ts
	closure-compiler --compilation_level SIMPLE_OPTIMIZATIONS game.js --js_output_file game.min.js

clean:
	rm -f *.js *.js.map

dev:
	tsc ${TSCOPTS} src/main.ts --watch
