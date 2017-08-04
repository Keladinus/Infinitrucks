var trukNum = 0;
var lightningNum = 0;
var heartNum = 0;
var tutoralShown = false;
var firstTruckX = 0;
var firstTruckY = 0;
var pickupX = 0;
var pickupY = 0;
var pickupType = 0;

var tutoralMsg = new Image();
tutoralMsg.addEventListener("load", loadHandler, false);
tutoralMsg.src = "Assets/images/msg_tutoral.png";

var tutoralMsg02 = new Image();
tutoralMsg02.addEventListener("load", loadHandler, false);
tutoralMsg02.src = "Assets/images/msg_tutoral_02.png";

var tutoralMsg03 = new Image();
tutoralMsg03.addEventListener("load", loadHandler, false);
tutoralMsg03.src = "Assets/images/msg_tutoral_03.png";

function clearCircle(context,x,y,radius) {
	context.save();
	context.beginPath();
	context.arc(x, y, radius, 0, 2*Math.PI, true);
	context.clip();
	context.clearRect(x-radius,y-radius,radius*2,radius*2);
	context.restore();
}

var showDodgeTruck = (function() {
    var executed = false;
    return function() {
        if (!executed) {
			executed = true;
			
            if(trukNum > 0 && tutoralShown == true){
				togglePause();
				tutorMaskCanvas.style.display = "block";
				//scoreCtx.clearRect(0,0,scoreCanvas.width,scoreCanvas.height);
				//msgCtx.font = "30px Quantico";
				//msgCtx.fillStyle = "rgba(00, 00, 00, 1)";;
				//msgCtx.fillText("Use Arrow Key and ADSW to dodge trucks",10,880);

				msgCtx.drawImage(tutoralMsg,10,800);

				//tutoralMsg = new createjs.Bitmap("Assets/images/msg_tutoral.png");
				//tutoralMsg.x = 10; 
				//tutoralMsg.y = 830;
				//msgStage.addChild(tutoralMsg);
				
				MaskCtx.fillStyle = "rgba(55, 55, 55, 0.6)";
				MaskCtx.fillRect(0,0,stageW,stageW)
				//MaskCtx.beginPath();
				//MaskCtx.arc(firstTruckX,firstTruckY,150,0,2*Math.PI);
				//MaskCtx.stroke();
				//MaskCtx.clip();
				//MaskCtx.clearRect(0,0,stageW,stageW)
				clearCircle(MaskCtx,/*x=*/firstTruckX,/*y=*/firstTruckY,/*radius=*/150);

				window.addEventListener("keydown", keyPress);
				function keyPress(event){
					switch(event.keyCode)
					{
						case 37:
						case 65: 
						case 39:
						case 68:
						case 38:
						case 87:
						case 40:
						case 83:
						window.removeEventListener("keydown", keyPress);
						togglePause();
						MaskCtx.clearRect(0,0,stageW,stageW)
						msgCtx.clearRect(0,0,stageW,stageW);
						tutoralShown = false;
						break;
					}
				}
			
			}	
        }
    };
})();

var PickLightning = (function() {
    var executed = false;
    return function() {
        if (!executed) {
            executed = true;
            if(lightningNum > 0 && tutoralShown == true){
				togglePause();
				//scoreCtx.clearRect(0,0,scoreCanvas.width,scoreCanvas.height);
				tutorMaskCanvas.style.display = "block";
/*
				msgCtx.font = "30px Quantico";
				msgCtx.fillStyle = "rgba(00, 00, 00, 1)";;
				msgCtx.fillText("Pick Up Lightnig to Increase Scores",10,880);
*/
				msgCtx.drawImage(tutoralMsg02,10,800);

				MaskCtx.fillStyle = "rgba(51, 51, 51, 0.6)";
				MaskCtx.fillRect(0,0,stageW,stageW)
				//MaskCtx.beginPath();
				//MaskCtx.arc(pickupX,pickupY,30,0,2*Math.PI);
				//MaskCtx.stroke();
				//MaskCtx.clip();
				//MaskCtx.clearRect(0,0,stageW,stageW)			
				
				clearCircle(MaskCtx,/*x=*/pickupX,/*y=*/pickupY,/*radius=*/30);
				
				window.addEventListener("keydown", keyPress);
				function keyPress(event){
					switch(event.keyCode)
					{
						case 37:
						case 65: 
						case 39:
						case 68:
						case 38:
						case 87:
						case 40:
						case 83:
						window.removeEventListener("keydown", keyPress);
						togglePause();
						MaskCtx.clearRect(0,0,stageW,stageW)
						msgCtx.clearRect(0,0,stageW,stageW);
						tutoralShown = false;
						break;
					}
				}
			
			}	
        }
    };
})();

var PickHeart = (function() {
    var executed = false;
    return function() {
        if (!executed) {
            executed = true;
            if(heartNum > 0 && tutoralShown == true){
				togglePause();
				//scoreCtx.clearRect(0,0,scoreCanvas.width,scoreCanvas.height);
				tutorMaskCanvas.style.display = "block";

				//msgCtx.font = "30px Quantico";
				//msgCtx.fillStyle = "rgba(00, 00, 00, 1)";;
				//msgCtx.fillText("Pick Up Heart to Increase HP",10,880);

				msgCtx.drawImage(tutoralMsg03,10,800);

				MaskCtx.fillStyle = "rgba(51, 51, 51, 0.6)";
				MaskCtx.fillRect(0,0,stageW,stageW)
				clearCircle(MaskCtx,/*x=*/pickupX,/*y=*/pickupY,/*radius=*/30);
			
				window.addEventListener("keydown", keyPress);
				function keyPress(event){
					switch(event.keyCode)
					{
						case 37:
						case 65: 
						case 39:
						case 68:
						case 38:
						case 87:
						case 40:
						case 83:
						window.removeEventListener("keydown", keyPress);
						togglePause();
						MaskCtx.clearRect(0,0,stageW,stageW)
						msgCtx.clearRect(0,0,stageW,stageW);
						break;
						default:
						window.addEventListener("keydown", keyPress);
					}
				}
			
			}	
        }
    };
})();