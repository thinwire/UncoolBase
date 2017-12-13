function unlockSound() {
    window.removeEventListener("touchend", unlockSound, false);

    var context = new AudioContext();
    var buffer = context.createBuffer(1, 1, 22050);
    var source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    if(source.noteOn) {
        source.noteOn(0);
    }
}
window.addEventListener("touchend", unlockSound, false);