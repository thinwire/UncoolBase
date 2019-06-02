# The Uncool Base
## HTML5 2D game development framework

# NOTICE: A new version is incoming; this code base works, but is outdated. New version supports WebGL and is built onto a new architecture. New version will be released when it is declared stable in internal review.


### TL;DR: what you need

- GNU Make
- Node.js
- TypeScript 2.1.0+
- Google Closure Compiler installed on path

Optional:

- Visual Studio Code (for actually writing TypeScript)
- Simple web server for devtime (`npm -g install http-server` works wonders)
- Google Chrome (for development)
- NW.JS or similar for creating an offline package

### Preparation: get tools

- Make sure you have GNU Make installed
- Install Node.js
- Open a terminal
- type `npm -g install typescript`
- once finished, type `tsc --version`. You should have at least version 2.1.5.
- install Google Closure Compiler - on *buntu and Mint this can be as easy as `sudo apt install closure-compiler`.
- (Optional): install [Microsoft Visual Studio Code](https://code.visualstudio.com/)
- (Optional): to make Bitmap Font atlases supported directly by the UncoolBase loader and scene graph, use [Littera](http://kvazars.com/littera/) and export in XML `.fnt` format

### To compile

- Open up a terminal
- In the project folder, type `make`

This will compile the code using TypeScript Compiler and compress it using Closure,
creating the files `game.js` and `game.min.js`. The former is still readable, the latter
has had the maximum safe amount of air taken out of it and should be the one you use
in deployment.

Use `make dev` to start up the TypeScript Compiler with the `--watch` parameter - this causes
`tsc` to regenerate the output file any time the source changes.

### Getting started with gamedev

After you've compiled the sources, you can test the demo game
by dragging index.html into Firefox (Chrome doesn't like to load
local files via XHR - you'll need to use local web server, like
`http-server` to get Chrome to load the game).

This simple demonstration game is used to verify that the code
has compiled successfully and the framework is ready for use.

The main entry point for the application is in `src/main.ts`, and
contains the initialization code for the game. This file has been
written specifically to be easily copy/pasted and adapted to your
own project.

The actual framework as well as third party libraries is located
under `src/base`. 

The demonstration game logic is under `src/game` and should be easy
to follow.

### Developing the demo game

Servers:

- Open up a terminal in the UncoolBase project directory
- Type `http-server .` to start up the local web server
- Open up another terminal in the UncoolBase project directory
- Type `make dev` to start up the TypeScript Compiler in watch mode

Browser (Chrome in this example):

- Open up Chrome, then press F12 or CTRL + I to access Chrome Dev Tools
- Open up the Dev Tools Settings (F1 in DevTools at the time of writing) and make sure that `Disable cache (while DevTools is open)` is enabled
- Navigate to `http://localhost:8080/` to start the game (with DevTools open)
- Errors and messages will show up in the terminal

### Developing a larger project

- Clone the UncoolBase repository
- Create your game project directory
- Create an 'src' directory in the game project diretory
- Create a symlink (unix `ln -s`) from the `UncoolBase/src/base` directory to `yourgameproject/src/base`
- Create a main.ts file that references base.ts (like `/// <reference path="base/base.ts" />`)
- Compile with `tsc --allowJs --outFile game.js --removeComments --sourceMap src/main.ts` to create game.js in your game project base directory
- For simplicity, make a copy of `UncoolBase/index.html` in `yourgameproject/` to have a working html skeleton
- Use `http-server .` to serve up the game project on a local web server
- Add `--watch` to `tsc` options to have the compiler automatically recompile when a referenced file is changed.
- Use closure compiler on game.js to create a release version, remember to update the `<script>` tag in `index.html` so that it points to the closure-compiler minimized javascript.

### Development status

UncoolBase was developed specifically for the Global Game Jam, as a throwaway
kind of base code, but has since found use for rapid prototyping and small
interactive tool applications.
UncoolBase development happens as need arises, but mostly around game jam time.

UncoolBase comes with ABSOLUTELY NO GUARANTEES about merchantability or fitness
for any particular purpose!
