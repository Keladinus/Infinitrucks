var c = document.getElementById("hud");
var ctx = c.getContext("2d");

var spriteObject =
{
  //The x and y source position of the sprite's image
  //And its height and width
  sourceX: 0,
  sourceY: 0,
  sourceWidth: 240,
  sourceHeight: 75,
  
  //The x and y position of the sprite on the canvas
  //as well as its height
  x: 0,
  y: 0,
  width: 240,
  height: 75,
};

//An array to store the sprites
var sprites = [];

//Creat the outter health meter
var outerMeter = Object.create(spriteObject);
outerMeter.x = 10;
sprites.push(outerMeter);

//Create the inner health meter 
var innerMeter = Object.create(spriteObject);
innerMeter.sourceY = 84.3;
innerMeter.x = outerMeter.x;
innerMeter.y = outerMeter.y;
sprites.push(innerMeter);

//Score outter meter
var outerScore = Object.create(spriteObject);
outerScore.sourceY = 255;
outerScore.x = 465;
sprites.push(outerScore);

//Score innter meter
var innerScore = Object.create(spriteObject);
innerScore.sourceY = 171;
innerScore.x = outerScore.x;
innerScore.width = 56;
innerScore.sourceWidth = 56;
sprites.push(innerScore);

//Load the image
var image = new Image();
image.addEventListener("load", loadHandler, false);
image.src = "Assets/images/hudMeterSprites_HUD.png";

function loadHandler()
{ 
  render(); 
  uiUpdate();
}

function uiUpdate(){
  window.addEventListener("keydown", onKeyDown);
}

/*
if car and truk collision
innerMeter.width--;
innerMeter.sourceWidth--;

if car and pickup collision
innerScore.width++;
innerScore.sourceWidth++;
*/

function onKeyDown(event)
{
  switch(event.keyCode)
	{
  	case 73: // I key, to increase health
            if(innerMeter.width < 240 && paused == false)
            {
              innerMeter.width += 10;
              innerMeter.sourceWidth += 10;
              render();
              console.log("width = "+innerMeter.width);
              console.log("sourceWidth = "+innerMeter.sourceWidth);
            }
            break;
		case 75: // K key, to decrease health
            if(innerMeter.width > 65 && paused == false)
            {
              innerMeter.width -=25;
              innerMeter.sourceWidth -=25;
              render();
              console.log("width = "+innerMeter.width);
              console.log("sourceWidth = "+innerMeter.sourceWidth);
            }else if(innerMeter.width <=65 && paused == false)
            {
            //game over screen
            }
            break;
    case 76: // J key, to increase score
            if(innerScore.width < 232 && paused == false)
            {
              innerScore.width += 2;
              innerScore.sourceWidth += 2;
              render();
              console.log("score width = "+innerScore.width);
              console.log("score sourceWidth = "+innerScore.sourceWidth);
            }
            break;
// we don't have the situation to decrease scores so far (maybe add in level 2 when hit the animals?)
		case 74: // L key, to decrease score
            if(innerScore.width > 56 && paused == false)
            {
              innerScore.width -=2;
              innerScore.sourceWidth -=2;
              render();
              console.log("score width = "+innerScore.width);
              console.log("score sourceWidth = "+innerScore.sourceWidth);
            }
            break;

    default:
				console.log("cheat code unhandled key.");
				break;
  }
}


function render() {
    ctx.clearRect(0, 0, c.width, c.height); 
    //ctx.drawImage(image,0,0,264,330);
    
     if(sprites.length !== 0){
         for(var i = 0; i < sprites.length; i++){
         var sprite = sprites[i];
         ctx.drawImage(image, sprite.sourceX, sprite.sourceY, 
         sprite.sourceWidth, sprite.sourceHeight,
         sprite.x, sprite.y,
         sprite.width, sprite.height); 
         //console.log(sprite);
         //console.log(image);
        }
     }
}


//-------------------
//The start menu
//-------------------

var startCanvas = document.getElementById("start");
var startCtx = startCanvas.getContext("2d");
var startWidth = startCanvas.getAttribute('width');
var startHeight = startCanvas.getAttribute('height');

