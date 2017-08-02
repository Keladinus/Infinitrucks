var world = document.getElementById("wrap"); // the whole game area
var worldWidth = world.getAttribute("width"); //1070

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
var btUpImage = [newImage, instructImage, exitImage];

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
var blueBtnVisible = false;

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
startCanvas.style.cursor = "default";

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
     
    for(i = 0; i < buttonX.length;i++){
        var btX = (Math.floor((buttonX[i]/worldWidth)*menuWidth));
        var btY = (Math.floor((buttonY[i]/worldWidth)*menuWidth));
        var btWidth = (buttonWidth[i]/worldWidth)*menuWidth;
        var btHeight = (buttonHeight[i]/worldWidth)*menuWidth;
        // btX, btY detail explanation in line 39
        var mX = Math.floor(mouseX*(worldWidth/menuWidth));
        var mY = Math.floor(mouseY*(worldWidth/menuWidth));
        // mX, mY : mouse actual position on canvas (if fix at the begin, then no need to fix btX, btY)
        // -> no!! wrong

        

      if(mouseX > btX && mouseX < btX + btWidth && mouseY > btY && mouseY < btY + btHeight)
        {
            startCtx.clearRect(arrowSignX, arrowSignY, arrowSignWidth, arrowSignHeight)
                if(arrowSignVisible == false){   
                        arrowSignX = buttonX[i] - arrowSignWidth;
                        arrowSignY = buttonY[i];
                        startCtx.drawImage(arrowImage, arrowSignX, arrowSignY);
                        arrowSignVisible = true;
                        blueBtnVisible = true;
                }
        }else //if(mouseX < btX || mouseX > btX + buttonWidth[i] || mouseY < btY || mouseY > btY + buttonHeight[i])
        {
                    if(arrowSignVisible == true)
                        {   
                            console.log("out bt "+i);
                            //startCtx.clearRect(buttonX[i],buttonY[i],buttonWidth[i],buttonHeight[i]);
                            //startCtx.clearRect(arrowSignX, arrowSignY, arrowSignWidth, arrowSignHeight);
                            //startCtx.fillStyle="red";
                            //startCtx.fillRect(arrowSignX, arrowSignY, arrowSignWidth, arrowSignHeight);  
                            arrowSignVisible = false;
                        }
                    //startCtx.drawImage(btUpImage[i],buttonX[i], buttonY[i]);
                    //startCtx.clearRect(btOverImage[i],buttonX[i], buttonY[i],buttonWidth[i],buttonHeight[i]);
                    blueBtnVisible = false;
                    //startCanvas.style.cursor = "default";
               
        }
        

    }
    

}

/*

function hoverButton(){
    for(i = 0; i < buttonX.length; i++){
        var btX = (Math.floor((buttonX[i]/worldWidth)*menuWidth));
        var btY = (Math.floor((buttonY[i]/worldWidth)*menuWidth));
    
        if(mouseX > btX && mouseX < btX + buttonWidth[i] && mouseY > btY && mouseY < btY + buttonHeight[i])
            {
                isHover = true;
                //showHover
            }else 
            {
                isHover = false;
                clearEffect();
            }

        if(isHover == true){
            if(blueBtnVisible == false && arrowSignVisible == false)
                {
                    console.log("bt"+i+" X = " + (Math.floor((buttonX[i]/worldWidth)*menuWidth)));
                    console.log("bt"+i+" Y = " + (Math.floor((buttonY[i]/worldWidth)*menuWidth)));
                    arrowSignX = buttonX[i] - arrowSignWidth;
                    arrowSignY = buttonY[i];
                    startCtx.drawImage(arrowImage, arrowSignX, arrowSignY);
                    //startCtx.fillStyle="red";
                    //startCtx.fillRect(buttonX[i],buttonY[i],buttonWidth[i],buttonHeight[i]);    
                    arrowSignVisible = true;
                    startCanvas.style.cursor = 'pointer';
                    blueBtnVisible = true;
                    console.log("bt"+i);
                }
        }
        
    
    }
}

function clearEffect(){
    if(isHover == false){
        if(blueBtnVisible == true && arrowSignVisible == true)
            {
                //startCtx.clearRect(arrowSignX, arrowSignY, arrowSignWidth, arrowSignHeight);
            }
    }
}


----------------
isPointInPath method:

                        startCtx.beginPath();
                        startCtx.moveTo(buttonX[i],buttonY[i]);
                        startCtx.lineTo(buttonX[i]+buttonWidth[i],buttonY[i]);
                        startCtx.lineTo(buttonX[i]+buttonWidth[i],buttonY[i]+buttonHeight[i]);
                        startCtx.lineTo(buttonX[i],buttonY[i]+buttonHeight[i])
                        startCtx.closePath();
                        //startCtx.stroke();
                        
                        if(startCtx.isPointInPath(mX,mY)){
                            startCanvas.style.cursor = "pointer";
                            arrowSignX = buttonX[i] - arrowSignWidth;
                            arrowSignY = buttonY[i];
                            startCtx.drawImage(arrowImage, arrowSignX, arrowSignY);

                        }else{
                            startCanvas.style.cursor = "default";
                            console.log("cursor should be default");
                            startCtx.clearRect(arrowSignX, arrowSignY, arrowSignWidth, arrowSignHeight);
                            console.log("clear");
                        }



*/