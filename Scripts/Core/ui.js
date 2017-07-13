
var world = document.getElementById("wrap"); // the whole game area
var worldWidth = world.getAttribute("width"); //1070
var game = document.getElementById("game");
var uiFrame = document.getElementById("uiFrame");
var startMenu = document.getElementById("start");
uiFrame.style.display = "none";
game.style.display = "none";

//-------------------
//The start menu
//-------------------

var startCanvas = document.getElementById("start");
var startCtx = startCanvas.getContext("2d");
//var menuWidth = startCanvas.getAttribute("width");
//var menuHeight = startCanvas.getAttribute("Height");
var menuWidth = startCanvas.offsetWidth;
var menuHeight = startCanvas.offsetHeight;

var menuImage = new Image();
var newImage = new Image();
var overNew = new Image();
var instructImage = new Image();
var overInst = new Image();
var exitImage = new Image();
var overExit = new Image();
var arrowImage = new Image();
var btOverImage = [overNew, overInst, overExit];

//arrays to hold the positions and sizes of the buttons 
//[newImage, instructImage, exitImage]
var buttonX = [600,700,860]; 
var buttonY = [570,650,730];
var buttonWidth = [397,294,139];
var buttonHeight = [54,54,54];

/*
//button's screen X = (the X setted / initial set width) * Canvas.offsetWidth)
console.log("bt1.windowX = "+ (Math.floor((600/1070)*menuWidth)));
console.log("bt1.screenX= " + (Math.floor((buttonX[0]/worldWidth)*menuWidth)));
*/
console.log("bt1.screenX= " + (Math.floor((buttonX[0]/worldWidth)*menuWidth)));
console.log("bt1.screenY= " + (Math.floor((buttonY[0]/worldWidth)*menuWidth)))

var mouseX;
var mouseY;

var frames = 30;
var fadeId = 0;
var time = 0.0;

var arrowSignX = 490;
var arrowSignY = 572;
var arrowSignWidth = 100;
var arrowSignHeight = 54; 
var arrowSignVisible = false;

newImage.src = "Assets/images/menuBtUp_newGame.png";
overNew.src = "Assets/images/menuBtOver_newGame.png";
instructImage.src = "Assets/images/menuBtUp_tutorial.png";
overInst.src ="Assets/images/menuBtOver_tutorial.png";
exitImage.src = "Assets/images/menuBtUp_exit.png";
overExit.src = "Assets/images/menuBtOver_exit.png";
arrowImage.src = "Assets/images/icon_arrowSign.png";

newImage.onload = function(){
    startCtx.drawImage(newImage, buttonX[0], buttonY[0]);
}
instructImage.onload = function(){
    startCtx.drawImage(instructImage, buttonX[1], buttonY[1]);
}
exitImage.onload = function(){
    startCtx.drawImage(exitImage, buttonX[2], buttonY[2]);
}

startCanvas.addEventListener("mousemove", checkPos);
//startCanvas.addEventListener("mouseup", checkClick);

function checkPos(mouseEvent){

   if(mouseEvent.pageX || mouseEvent.pageY == 0)
    {
      mouseX = mouseEvent.pageX - world.offsetLeft;
      mouseY = mouseEvent.pageY - world.offsetTop;
    }else if(mouseEvent.offsetX || mouseEvent.offsetY == 0)
    {
      mouseX = mouseEvent.offsetX;
      mouseY = mouseEvent.offsetY;
    }

    for(i = 0; i < buttonX.length; i++){
        var btX = (Math.floor((buttonX[i]/worldWidth)*menuWidth));
        var btY = (Math.floor((buttonY[i]/worldWidth)*menuWidth));
        // btX, btY detail explanation in line 39

      if(mouseX > btX && mouseX < btX + buttonWidth[i]){
				if(mouseY > btY && mouseY < btY + buttonHeight[i])
        {
					arrowSignVisible = true;
					arrowSignX = buttonX[i] - arrowSignWidth;
					arrowSignY = buttonY[i];
          startCtx.drawImage(arrowImage, arrowSignX, arrowSignY);
          console.log("mouseX, Y= " + mouseX + " / " + mouseY);
          console.log("bt X Y = " + btX + " / " + btY);
          console.log("arrow"+" "+ arrowSignX + "/"+ arrowSignY);
          //startCtx.drawImage(btOverImage[i], buttonX[i], buttonY[i],buttonWidth[i],buttonHeight[i]);
          //draw();
				}
			}else{
            arrowSignVisible = false;
			}
		}
}

function draw()
{
  //startCtx.clearRect(arrowSignX, arrowSignY, arrowSignWidth, arrowSignHeight);
  if(arrowSignVisible == true){
    startCtx.drawImage(arrowImage, arrowSignX, arrowSignY);
		arrowSignVisible = false;
  }
}

/*
function checkClick(mouseEvent){
		for(i = 0; i < buttonX.length; i++){
			if(mouseX > buttonX[i] && mouseX < buttonX[i] + buttonWidth[i]){
				if(mouseY > buttonY[i] && mouseY < buttonY[i] + buttonHeight[i]){
					fadeId = setInterval("fadeOut()", 1000/frames);
					startCanvas.removeEventListener("mousemove", checkPos);
					startCanvas.removeEventListener("mouseup", checkClick);
				}
			}
		}
}

function fadeOut(){
    startCtx.fillStyle = "rgba(0,0,0, 0.2)";
    startCtx.fillRect (0, 0, menuWidth, menuHeight);
    time += 0.1;
    if(time >= 2){
        clearInterval(fadeId);
        time = 0;
        timerId = setInterval("update()", 1000/frames);
        startCanvas.addEventListener("mousemove", checkPos);
        startCanvas.addEventListener("mouseup", checkClick);
        
    }
}

function newGame(){
        uiFrame.style.display = "block";
        game.style.display ="block";
}

*/

//-------------------
//UI frame and HUD
//-------------------

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

function onKeyDown(event)  //HUD cheat codes
{
  switch(event.keyCode)
	{
    case 90: // Z key, to display and start game
            createjs.Ticker.addEventListener("tick", update);
            uiFrame.style.display = "block";
            game.style.display ="block";
            startMenu.style.display = "none";
            console.log("open");
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

