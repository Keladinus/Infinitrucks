var hudCanvas = document.getElementById("hud");
var hudCtx = hudCanvas.getContext("2d");
var SMCanvas = document.getElementById("sunMoon");
var SMCtx = SMCanvas.getContext("2d");
var cloudCanvas = document.getElementById("frontCloud");
var cloudCtx = cloudCanvas.getContext("2d");
var nightCloudCavs = document.getElementById("frontCloudNight");
var nightCloudCtx = nightCloudCavs.getContext("2d");
var scoreCanvas = document.getElementById("scoresTxt");
var scoreCtx = scoreCanvas.getContext("2d");
var dayCanvas = document.getElementById("dayView");
var dayCtx = dayCanvas.getContext("2d");
var nightCanvas = document.getElementById("nightView");
var nightCtx = nightCanvas.getContext("2d");

var health = 70;
var wound = 10;
var timeSec = 0;
var timeMin = 0;
var timeHr = 0;
var timeCount = 0;
//var timeCount = setInterval(timer, 1000);

var rotAng = 0;
var nightOpcy = parseFloat(0.0);
dayCanvas.style.opacity = 1;

//sun and moon
var star = {
  sourceX: 0,
  sourceY: 0,
  sourceWidth: 0,
  sourceHeight: 0,
  x:0,
  y:0,
  width:298,
  height:293,
  image: null
}

var sun = Object.create(star);
sun.x = 830;
sun.y = 800;
sun.sourceWidth = 298;
sun.sourceHeight = 293;
sun.image = new Image();
sun.image.addEventListener("load", loadHandler, false);
sun.image.src = "Assets/images/img_sun.png";

var moon = Object.create(star);
moon.x = -850;
moon.y = 1100;
moon.sourceWidth = 265;
moon.sourceHeight = 265;
moon.image = new Image();
moon.image.addEventListener("load", loadHandler, false);
moon.image.src = "Assets/images/img_moon.png";

//the front clouds
var upperCloud = {
  sourceX: 0,
  sourceY: 0,
  sourceWidth: 0,
  sourceHeight: 0,
  x:0,
  y:928,
  width:1070,
  height:72,
  image: null
}
var dayCloud = Object.create(upperCloud);
dayCloud.image = new Image();
dayCloud.image.addEventListener("load", loadHandler, false);
dayCloud.image.src = "Assets/images/img_uppercloud.png";

var nightCloud = Object.create(upperCloud);
nightCloud.image = new Image();
nightCloud.image.addEventListener("load", loadHandler, false);
nightCloud.image.src = "Assets/images/img_uppercloud_night.png";

var nightSky = new Image();
nightSky.addEventListener("load", loadHandler, false);
nightSky.src = "Assets/images/img_nightView.png";

//UI HUD
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
  x: 100,
  y: 0,
  width: 240,
  height: 75,
};

//An array to store the sprites
var sprites = [];

//Creat the outter health meter
var outerMeter = Object.create(spriteObject);
sprites.push(outerMeter);

//Create the inner health meter 
var innerMeter = Object.create(spriteObject);
innerMeter.sourceY = 84.3;
innerMeter.y = outerMeter.y;
sprites.push(innerMeter);

//Score outter meter
var outerScore = Object.create(spriteObject);
outerScore.sourceY = 255;
outerScore.x = 700;
sprites.push(outerScore);

//Score innter meter
var innerScore = Object.create(spriteObject);
innerScore.sourceY = 171;
innerScore.x = outerScore.x;
innerScore.width = 56;
innerScore.sourceWidth = 56;
sprites.push(innerScore);

//Load hud sprite
var image = new Image();
image.addEventListener("load", loadHandler, false);
image.src = "Assets/images/hudMeterSprites_HUD.png";


//timmer-----
var timeH = {
  x:465,
  y:65,
  width:100,
  height:50
}
var timeM = {
  x:520,
  y:65,
  width:100,
  height:50
}
var timeS = {
  x:580,
  y:65,
  width:100,
  height:50
}
initialRender();
function initialRender(){
  scoreCtx.font = "30px Quantico";
  scoreCtx.fillStyle = "#b22823";
  scoreCtx.fillText(timeSec,timeS.x,timeS.y,timeS.width,timeS.height);
  scoreCtx.fillText(timeMin,timeM.x,timeM.y,timeM.width,timeM.height);
  scoreCtx.fillText(timeHr,timeH.x,timeH.y,timeH.width,timeH.height);
}

function render() {
    SMCtx.drawImage(sun.image,sun.x,sun.y,sun.width,sun.height);
    SMCtx.drawImage(moon.image,moon.x,moon.y,moon.width,moon.height);
    cloudCtx.drawImage(dayCloud.image,dayCloud.x,dayCloud.y,dayCloud.width,dayCloud.height);
    nightCtx.drawImage(nightSky,0,0,1070,1000);
    
    hudCtx.clearRect(0, 0, hudCanvas.width, hudCanvas.height); 
     if(sprites.length !== 0){
         for(var i = 0; i < sprites.length; i++){
         var sprite = sprites[i];
         hudCtx.drawImage(image, sprite.sourceX, sprite.sourceY, 
         sprite.sourceWidth, sprite.sourceHeight,
         sprite.x, sprite.y,
         sprite.width, sprite.height); 
        }
     }
}

function timer(){
  scoreCtx.clearRect(0,0,scoreCanvas.width,scoreCanvas.height);
  scoreCtx.font = "30px Quantico";
  scoreCtx.fillStyle = "#b22823";
  scoreCtx.fillText(timeSec,timeS.x,timeS.y,timeS.width,timeS.height);
  scoreCtx.fillText(timeMin,timeM.x,timeM.y,timeM.width,timeM.height);
  scoreCtx.fillText(timeHr,timeH.x,timeH.y,timeH.width,timeH.height);
  
  timeSec++;
  if(timeSec === 60){
    timeMin++;
    timeSec = 0;
  }
  if(timeMin === 60){
    timeHr++;
    timeMin = 0;
  }
  if(timeHr === 99){
    paused = true;
  }   
}

function switchScene(){
  
  if(moon.x <= 830){
    sun.x -= 6;
    sun.y += 1.2;
    rotAng += 10;
    SMCtx.clearRect(0,0,SMCanvas.width,SMCanvas.height);
    rotateSun(sun.image,sun.x,sun.y,sun.width,sun.height,rotAng);
    moon.x += 9;
    moon.y -= 1.5;
    rotateSun(moon.image,moon.x,moon.y,moon.width,moon.height,rotAng);

    nightCtx.clearRect(0,0,nightCanvas.width,nightCanvas.height);
    nightCtx.drawImage(nightSky,0,0,1070,1000);
    
    if(cloudCanvas.style.opacity <= 1 && nightCanvas.style.opacity <= 1)
      {
        dayCanvas.style.opacity -= 0.01;
        nightCanvas.style.opacity = nightOpcy;
        if(sun.x <= 400){
          nightOpcy = nightOpcy + 0.01;
          cloudCtx.clearRect(0,0,cloudCanvas.width,cloudCanvas.height);
          cloudCtx.globalAlpha -= 0.02;
          cloudCtx.drawImage(dayCloud.image,dayCloud.x,dayCloud.y,dayCloud.width,dayCloud.height);
        
          nightCloudCtx.clearRect(0,0,cloudCanvas.width,cloudCanvas.height);
          nightCloudCtx.globalAlpha = nightOpcy;
          if(nightCloudCtx.globalAlpha > 1)
            nightCloudCtx.globalAlpha = 1;
          nightCloudCtx.drawImage(nightCloud.image,nightCloud.x,nightCloud.y,nightCloud.width,nightCloud.height);  
        }  // console.log(cloudCtx.globalAlpha);
      }
  }else{
      nightCanvas.style.opacity = 1;
      cloudCtx.globalAlpha = 1;
      clearInterval(switchIT);
    }   
}

function rotateSun(img,x,y,width,height,deg){
      //Convert degrees to radian 
      var rad = deg * Math.PI / 180;
      //Set the origin to the center of the image
      SMCtx.translate(x + width / 2, y + height / 2);
      //Rotate the canvas around the origin
      SMCtx.rotate(rad);
      //draw the image    
      SMCtx.drawImage(img,width / 2 * (-1),height / 2 * (-1),width,height);
      //reset the canvas  
      SMCtx.rotate(rad * ( -1 ) );
      SMCtx.translate((x + width / 2) * (-1), (y + height / 2) * (-1));
}


function loadHandler()
{ 
  render(); 
  uiUpdate();
}

function uiUpdate(){
  window.addEventListener("keydown", onKeyDown);
}



//original codes
var loseHealth = new Event("loseHealth"); //NG
var gainHealth = new Event("gainHealth");
var gainScore = new Event("gainScore");
var noHP = new Event("noHP");

window.addEventListener("loseHealth", function(e){innerMeter.width -=18; innerMeter.sourceWidth -=18; render();})  //NG
window.addEventListener("gainHealth", function(e){innerMeter.width +=18; innerMeter.sourceWidth +=18; render();})
window.addEventListener("gainScore", function(e){innerScore.width += 8; innerScore.sourceWidth += 8;  render();})
window.addEventListener("noHP", function(e){gameOver();loseCanvas.style.display = "block";});

function onKeyDown(event)  //HUD cheat codes
{
  switch(event.keyCode)
	{
    case 90: // Z key, to display and start game  
            if( paused == true ){
                paused = false;
              }	else	
                paused = false;
            
            createjs.Ticker.addEventListener("tick", update);
            uiFrame.style.display = "block";
            game.style.display ="block";
            startCanvas.style.display = "none";
            loseCanvas.style.display = "none";
            
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
            }if(innerMeter.width <=65 && paused == false)
            {
            //game over screen
            loseCanvas.style.display = "block";
            gameOver();
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
    case 9: //tab
            switchIT = setInterval(switchScene,60);
            break;

    default:
				console.log("cheat code unhandled key.");
				break;
  }
}

