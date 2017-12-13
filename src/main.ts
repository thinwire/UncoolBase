/**
 * Main entry point for UncoolBase game development library
 */

/// <reference path="base/base.ts" />
/// <reference path="game/game.ts" />

namespace main {

    //
    // Define asset list
    //

    var assets = new base.AssetList();
    assets.setImageBaseURL("gfx/");
    assets.setSoundBaseURL("sfx/");
    assets.setMusicBaseURL("mus/");
    assets.setFontBaseUrl("font/");
    
    assets.addImage("player", "dude.png");
    assets.addImage("enemy", "enemy.png");
    assets.addImage("bullet", "laser.png");
    assets.addImage("crosshair", "crosshair.png");
    assets.addImage("explosion", "explosion_anim.png");
    assets.addImage("background", "space.png");
    assets.addImage("dot", "dot.png");

    assets.addFont("font", "font.xml", "font.png");

    //assets.addMusic("mymusic", "music.mp3");

    assets.addSound("explosion1", "explosion1.mp3");
    assets.addSound("laser", "laser.mp3");


    //
    // Add some flair to the initial log
    //

    base.log_preload("*** The Greatest Game Ever Initializing ***");
    base.log_preload("   ");

    //
    // Start built-in load and register onSuccess hook
    //

    base.start(assets,() => {
        game.start();
    });

}
