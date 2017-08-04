
//if (!createjs.Sound.initializeDefaultPlugins()) { return; }

var audioPath = "../Assets/sound/";
var sounds = [
    {id:"Menu", src:"menu.mp3"},
   // {id:"Thunder", src:"Thunder1.ogg"}
];

createjs.Sound.alternateExtensions = ["mp3"];

function init() {
  // create an array and audioPath (above)
  createjs.Sound.addEventListener("fileload", handleLoad);
  createjs.Sound.registerSounds(sounds, audioPath);
 }

 function handleLoad(event) {
  createjs.Sound.play(event.src);
}