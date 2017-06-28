var c = document.getElementById("hud");
var ctx = c.getContext("2d");

// Create gradient
//var grd = ctx.createLinearGradient(0,0,200,0);
//grd.addColorStop(0,"red");
//grd.addColorStop(1,"white");

// Fill with gradient
//ctx.fillStyle = grd;
//ctx.fillRect(10,10,150,80);

//----------

var spriteObject =
{
  //The x and y source position of the sprite's image
  //And its height and width
  sourceX: 0,
  sourceY: 0,
  sourceWidth: 245,
  sourceHeight: 75,
  
  //The x and y position of the sprite on the canvas
  //as well as its height
  x: 0,
  y: 0,
  width: 245,
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
innerMeter.sourceY = 85;
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
innerScore.sourceY = 170;
innerScore.x = outerScore.x;
sprites.push(innerScore);

//Load the image
var image = new Image();
image.addEventListener("load", loadHandler, false);
image.src = "Assets/images/hudMeterSprites_HUD.png";

function loadHandler()
{ 
  update();
}

function update() {

/*
if car and truk collision
innerMeter.width--;
innerMeter.sourceWidth--;

if car and pickup collision
innerScore.width--;
innerScore.sourceWidth--;
*/

if(function collisionCheck(player, trucks){}){
    if(innerMeter.width > 0)
    {
      innerMeter.width--;
      innerMeter.sourceWidth--;
      console.log(innerMeter.width);
    }
  
    if(innerMeter.width < 1)
     {
    //gameOver.display;
    }
}

render();

    
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