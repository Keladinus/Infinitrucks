var stage = new createjs.Stage("game");
var truckSrcs = ["Assets/images/ch_truck01.png","Assets/images/ch_truck02.png","Assets/images/ch_truck03.png","Assets/images/ch_truck04.png",
				"Assets/images/ch_truck05.png","Assets/images/ch_truck06.png","Assets/images/ch_truck07.png","Assets/images/ch_truck08.png",
				"Assets/images/ch_truck09.png","Assets/images/ch_truck10.png","Assets/images/ch_truck11.png","Assets/images/ch_truck12.png",
				"Assets/images/ch_truck13.png","Assets/images/ch_truck14.png","Assets/images/ch_truck15.png"];
var isRunning = true;
var background = [];
var backgroundSpeed = 16;
var speedMultiplier = 1;
var turnSpeed = 3;
var score = 0;
var player;
var SIZE = 200;  //original 150
var trucks = [];
var pickups = [];
var leftPressed = false;
var rightPressed = false;
var upPressed = false;
var downPressed = false;
var trucksInPlay = 0;
var healthPickupSpawnInterval = setInterval(trySpawnHealthPickup, 600);
var scorePickupSpawnInterval = setInterval(trySpawnScorePickup, 600);
var truckSpawnInterval = setInterval(trySpawnTrucks, 400);
var scoreGainInterval = setInterval(addScore, 300);
var freeze = false;
var paused = false;
var cheatsEnabled = true;
var maxXspeed = 10;
var maxYspeed = 14;
var hurtEffectInterval;
var hurtEffectCounter = 0;
var gameBounds = {left:122,right:858,top:152,bottom:660};
var loseHealth = new Event("loseHealth");
var gainHealth = new Event("gainHealth");
var gainScore = new Event("gainScore");
var noHP = new Event("noHP");
var dirX = 0, dirY = 0;


start();
createjs.Ticker.addEventListener("tick", update);

function start() //Handles getting the game up and running.
{
	paused = true;
	generateBackground();
	initPlayer();
	buildArray();
	window.addEventListener("keydown", onKeyDown);
	window.addEventListener("keyup", onKeyUp);
}	

function initPlayer()
{
	player = {image:new createjs.Bitmap("Assets/images/ch_playerCar.png"), Xspeed:0, Yspeed:0, HP: 10, hurt:false};
	player.image.x = 475;
	player.image.y = 475;
	stage.addChild(player.image);
}

function update()
{
	if(isRunning && !paused)
	{
		trucksInPlay = countTrucksInPlay();
		setImageLayeringOrder();
		if(isAlive())
		{
			if(!freeze )
			{
				moveTrucks();
				movePickups();
			}
			scrollBackground();
			movePlayer();
			collisionSweep();
			if(player.hurt && hurtEffectInterval == null)
				hurtPlayer();
		}
		else
		{
			dispatchEvent(noHP);
		}
	}
	stage.update();
}

function setImageLayeringOrder()
{
	//first, move pickups to the bottom(above the background)
	for(var i = 0; i < pickups.length; i++)
	{
		if(stage.getChildIndex(pickups[i].bmp) > background.length)
			stage.setChildIndex(pickups[i].bmp, background.length);
	}
	//ensure all background tiles are on the bottom of the pile.
	for(var i = 0; i < background.length; i++)
	{
		if(stage.getChildIndex(background[i]) > 0)
			stage.setChildIndex(background, 0);
	}
	//Move the player to the top.
		if(stage.getChildIndex(player.image)< stage.getNumChildren()-1)
			stage.setChildIndex(player.image, stage.getNumChildren()-1);
	//Pile the trucks on top of the player.
	for(var lane = 0; lane < trucks.length; lane++)
	{
		for(var pos = 0; pos < trucks[lane].length; pos++)
		{
			if(stage.getChildIndex(trucks[lane][pos]) < stage.getNumChildren()-1)
			stage.setChildIndex(trucks[lane][pos], stage.getNumChildren()-1);
		}
	}
}


function generateBackground() 
{
	for(var i = 0; i < 7; i++)
	{
		background[i] = new createjs.Bitmap("Assets/images/background.png");
		background[i].x = 0; 
		background[i].y = (i-1)*SIZE;
		stage.addChild(background[i]);
	}
}

function isAlive()
{
	if(player.HP > 0) return true;
	else return false;
}

function buildArray() //turns the 1D array for trucks into a 2D array.
{
	for(var i = 0; i < 15; i++)
	{
		trucks[i] = [];
	}
}

function scrollBackground() //Moves the background
{

	//move the whole background downwards steadily
	for (var row = 0; row < background.length; row++)
	{
		background[row].y += backgroundSpeed;
	}
	
	//if the tiles reach the start position of their leading tiles, reset their positions to their starting positions
	if (background[0].y >= 0)
	{
		for(var row = 0; row < 7; row++)
		{	
			background[row].y -= SIZE;
		}
	}
}

function trySpawnTrucks()
{
	if(canSpawnTrucks())
	{
		var spawned = false;
		//We loop through the lanes
		for(var lane = 0; lane < 5; lane++)
		{
			if(laneIsOpen(lane) && !spawned)	
			{
				var chance = Math.random() * 100;
				if(chance <= 5)
				{
					spawnTruck(lane);
					spawned = true;
				}
			}
		}
		
	}
}

function trySpawnHealthPickup()
{
	var spawned = false;
	var chance = Math.random() * 100;
	if(chance <= 15)
	{
		spawnPickup(0);
		spawned = true;
	}
}

function trySpawnScorePickup()
{
	var spawned = false;
	var chance = Math.random() * 100;
	if(chance <= 15)
	{
		spawnPickup(1);
		spawned = true;
	}
}

function spawnPickup(type)
{
	var tempPickup;

	switch(type)
	{
		case 0:
				tempPickup = {bmp:new createjs.Bitmap("Assets/images/pk_addHealth.png"),type:0};	
				break;
		case 1:
				tempPickup = {bmp:new createjs.Bitmap("Assets/images/pk_addScore.png"),type:1};
				break;
		default:
				console.log("Unhandled key.");
				break;
	}
	if(tempPickup.bmp != null)
	{
		tempPickup.bmp.x=120 + Math.floor(Math.random()*610);
		tempPickup.bmp.y=-200;
		pickups.push(tempPickup);
		stage.addChild(tempPickup.bmp);
	}
}

function movePickups()
{
	for(var i = 0; i < pickups.length; i++)
	{
		if(pickups[i])
		{
			pickups[i].bmp.y += backgroundSpeed;
			if(pickups[i].bmp.y > 900)
			{
				stage.removeChild(pickups[i].bmp);
					pickups.splice(i,1);
			}
		}
	}
}

function onKeyDown(event)
{
	switch(event.keyCode)
	{
		case 37: // Left.
		case 65: //A.
				if ( leftPressed == false )
					leftPressed = true;
				break;
		case 39: // Right.
		case 68: // D.
				if ( rightPressed == false )
					rightPressed = true;
				break;
		case 38: // Up.
		case 87: // W.
				if ( upPressed == false )
					upPressed = true;
				break;
		case 40: // Down.
		case 83: // S.
				if ( downPressed == false )
				downPressed = true;
				break;
		case 80:		// P key, for pausing.
				togglePause();
				break;
		case 70:		// F key, to freeze trucks in place.  For debug purposes only.
				if(cheatsEnabled)
				{
					if( freeze == false )
					freeze = true;
					else
					freeze = false;
				}
				break;
		default:
				console.log("Unhandled key.");
				break;
	}
}

function onKeyUp(event)
{
	switch(event.keyCode)
	{
		case 37: // Left.
		case 65:
				leftPressed = false;
				break;
		case 39: // Right.
		case 68:
				rightPressed = false;
				break;
		case 38: // Up.
		case 87:
				upPressed = false;
				break;
		case 40: // Down.
		case 83:
				downPressed = false;
				break;
		default:
				console.log("Unhandled key.");
				break;
	}
}

function movePlayer()
{	
	handleTurning();
	getPlayerMoveDirection();
	handleAcceleration();
	applyPlayerMovement();
}

function handleTurning()
{
	var r = player.image.rotation;

	var max;
	if(upPressed)
		max = 12;
	else if(downPressed)
		max = 6;
	else
		max = 18;
	
	if(((rightPressed && leftPressed) || (!rightPressed && !leftPressed)) && r != 0)
	{
		if(r < 0)
			r += turnSpeed;
		else
			r -= turnSpeed;
	}
	else
	{
		if(leftPressed)
		{
			if(r < -max)
			{
				r += turnSpeed;
			}
			else if(r > -max)
			{
				r-= turnSpeed;
			}
		}
		if(rightPressed)
		{
			if(r > max)
			{
				r -= turnSpeed;
			}
			else if(r < max)
			{
				r+= turnSpeed;
			}
		}
	}
	player.image.rotation = r;
}

function getPlayerMoveDirection()
{
	if(leftPressed || rightPressed)
	{
		if ( leftPressed == true && player.image.x > gameBounds.left) 
		{
			dirX = -1;			
		}
		if ( rightPressed == true && player.image.x < gameBounds.right)
		{
			dirX = 1;
		}
	}
	else dirX = 0;

	if(upPressed || downPressed)
	{
		if ( upPressed == true && player.image.y > gameBounds.top)
		{
			dirY = -1;
		}
		if ( downPressed == true && player.image.y < gameBounds.bottom)
		{
			dirY = 1;
		}
	}
	else dirY = 0;
}
function handleAcceleration()
{
	if((player.Xspeed < maxXspeed && dirX > 0) || (player.Xspeed > -maxXspeed && dirX < 0))
		player.Xspeed += dirX;
	else if(dirX == 0)
	{
		if(player.Xspeed > 0)
			player.Xspeed--;
		else if(player.Xspeed < 0)
			player.Xspeed++;
	}

	if((player.Yspeed < maxYspeed && dirY > 0) || (player.Yspeed > -maxYspeed && dirY < 0))
		player.Yspeed += dirY;
	else if(dirY == 0)
	{
		if(player.Yspeed > 0)
			player.Yspeed--;
		else if(player.Yspeed < 0)
			player.Yspeed++;
	}
}

function applyPlayerMovement()
{
	var newXpos = player.image.x + player.Xspeed;
	if(newXpos >= gameBounds.left && newXpos <= gameBounds.right)
		player.image.x = newXpos;
	else if(player.Xspeed < 0)
	{
		player.image.x = gameBounds.left;
		player.Xspeed = 0;
	}
	else if(player.Xspeed > 0)
	{
		player.image.x = gameBounds.right;
		player.Xspeed = 0;
	}
	var newYpos = player.image.y + player.Yspeed;
	if(newYpos >= gameBounds.top && newYpos <= gameBounds.bottom)
		player.image.y = newYpos;
	else if(player.Yspeed < 0)
	{
		player.image.y = gameBounds.top;
		player.Yspeed = 0;
	}
	else if(player.Yspeed > 0)
	{
		player.image.y = gameBounds.bottom;
		player.Yspeed = 0;
	}
}

function moveTrucks()
{
	for(var lane = 0; lane < trucks.length; lane++)
	{
		for(var pos = 0; pos < trucks[lane].length; pos++)
		{
			if(trucks[lane][pos])
			{
				trucks[lane][pos].image.y += trucks[lane][pos].speed;
				if(trucks[lane][pos].image.y > 1000)
				{
					stage.removeChild(trucks[lane][pos].image);
					trucks[lane].splice(pos,1);
				}
				else if(trucks[lane][pos].image.y > player.image.y + 100 && trucks[lane][pos].inPlay)
				{
					trucks[lane][pos].inPlay = false;
				}
				
			}
		}
	}
	

}

function spawnTruck(lane) //spawns a new obstacle in the desired lane.
{
	var tempTruck = {image:null, speed:8, inPlay:true};
	var ranTruckImg = Math.floor(Math.random()*15);
	tempTruck.image = new createjs.Bitmap(truckSrcs[ranTruckImg]);
	tempTruck.image.x = 140+168*lane;
	tempTruck.image.y = -200;
	trucks[lane].push(tempTruck);
	stage.addChild(tempTruck.image);
}

function countTrucksInLane(lane) //Simply tallies the number of trucks in a specific designated lane.
{
	if(trucks[lane] == null)
		return 0;
	var count = 0;
	for(var pos = 0; pos < trucks[lane].length; pos++)
	{
		if(trucks[lane][pos])
			count++;
	}
	return count;
	
}

function countTrucksInPlay() //Tallies how many trucks are currently flagged as in play.
{	
	var num = 0;
	
	for(var lane = 0; lane < trucks.length; lane++)
	{
		for(var pos = 0; pos < trucks[lane].length; pos++)
		{
			if(trucks[lane][pos].inPlay)
				num++;
		}
	}
	return num;
}

function canSpawnTrucks()	//Simple gatekeeper function to ensure that there aren't too many obstacles for the player to avoid.
{
	if(trucksInPlay < 4 && paused === false) // add one more condition to fix the trucks parallel spawning full lanes at the beginning.
		return true;
	else
		return false;
}

function laneIsOpen(lane) //Ensures that trucks don't spawn on top of each other.
{
	if(trucks[lane] == null || trucks[lane][0] == null)	//An empty lane is an open lane.
		return true;
	else if(trucks[lane][trucks[lane].length -1].y > 105)
		return true;
	
	return false;
}

function collisionSweep()
{
	if(!player.hurt)
	{
		for(var lane = 0; lane < trucks.length; lane++)
		{
			for(var pos = 0; pos < trucks[lane].length; pos++)
			{			
				if(collisionCheck(getPlayerBounds(player.image), getTruckBounds(trucks[lane][pos].image)))
				{
					player.hurt = true;	
				}				
			}
		}
	}

	for(var i = 0; i < pickups.length; i++)
	{
		if(collisionCheck(getPickupBounds(pickups[i].bmp),getPlayerBounds(player.image)))
		{	//Had to reverse the collision check here to compare the pickup to the player, vs vice versa with truck.
			console.log("hit a pickup");
			if(pickups[i].type == 0)
			{
				player.HP++;
				dispatchEvent(gainHealth);
				stage.removeChild(pickups[i].bmp);
				pickups.splice(i,1);
			}
			else if(pickups[i].type == 1)
			{
				//add score here
				dispatchEvent(gainScore);
				stage.removeChild(pickups[i].bmp);
				pickups.splice(i,1);
			}
			
		}
	}
}

 function collisionCheck(box1, box2) //This function checks two bounding boxes to see if they are colliding, by comparing box1's bounds to box2's.
{
	if(		(		(box1.left < box2.right && box1.left > box2.left) 
				||  (box1.right > box2.left && box1.right < box2.right)
			)																			//This long, overcomplicated if statement checks if the two bounding boxes intersect.
		&&  (		(box1.bottom > box2.top && box1.bottom < box2.bottom) 
				||  (box1.top < box2.bottom && box1.top > box2.top)		
			)		)
	  {
		if((box1.left < box2.right && box1.left > box2.left) && (box1.bottom > box2.top && box1.bottom < box2.bottom))
		{
			console.log("lower left of player hit something");
			console.log("player's left and bottom bounds: " + box1.left + " " + box1.bottom);
			console.log("object's right and top bounds: "+ box2.right + " " + box2.top);
		}
		if((box1.right > box2.left && box1.right < box2.right) && (box1.bottom > box2.top && box1.bottom < box2.bottom))
		{
			console.log("lower right of player hit something");
			console.log("player's right and bottom bounds: " + box1.right + " " + box1.bottom);
			console.log("object's left and top bounds: "+ box2.left + " " + box2.top);
		}
		if((box1.left < box2.right && box1.left > box2.left) && (box1.top < box2.bottom && box1.top > box2.top))
		{
			console.log("top left of player hit something");
			console.log("player's left and top bounds: " + box1.left + " " + box1.top);
			console.log("object's right and bottom bounds: "+ box2.right + " " + box2.bottom);
		}
		if((box1.right > box2.left && box1.right < box2.right) && (box1.top < box2.bottom && box1.top > box2.top))
		{
			console.log("top right of player hit something");
			console.log("player's right and top bounds: " + box1.right + " " + box1.top);
			console.log("object's left and bottom bounds: "+ box2.left + " " + box2.bottom);
		}
		
		return true;
	  }
	  else return false;

	  
}

function collisionLog(hit)
{
	var output = "Player collided with truck at " + hit.x + ", " + hit.y + " with a bounding box ";
	var box = getPlayerBounds(hit);
	var boxout = "L: " + box.left + ", R: " + box.right + ", T: " + box.top + ", B: " + box.bottom;
	output += boxout;
	//console.log(output);
}

function getPlayerBounds(source)
{
	var L = source.x + 10 - source.image.width/2;//Removing 10 from all sides gives the player a little leeway for steering around obstacles.
	var R = source.x - 10 + source.image.width/2;
	var T = source.y + 10 - source.image.height/2;
	var B = source.y -10 + source.image.height/2;
	var bounds = {left:L, right:R, top:T, bottom:B};

	return bounds;
}

function getTruckBounds(source)
{
	var L = source.x -source.image.width/2;
	var R = source.x + source.image.width/2;
	var T = source.y + 75 - source.image.height/2; //For some reason, the trucks are rendered 75 below their coordinates, so we offset hitbox to compensate.
	var B = source.y + 75 + source.image.height/2;
	var bounds = {left:L, right:R, top:T, bottom:B};

	return bounds;
}

function getPickupBounds(source)
{
	var L = source.x - 25 - source.image.width/3; //Even more hitbox manipulation shenanigans required here for accurate collisions.
	var R = source.x - 25 + source.image.width/3;
	var T = source.y - 50 - source.image.height/3;
	var B = source.y - 50 + source.image.height/3;
	var bounds = {left:L, right:R, top:T, bottom:B};

	return bounds;

}

function addScore()
{
	score += 10;
}

function hurtEffect()
{
	if(player.image.alpha == 1)
		player.image.alpha = 0.5;
	else
		player.image.alpha = 1;

	hurtEffectCounter++;
	if(hurtEffectCounter >= 8)
		clearHurtEffect();
}

function hurtPlayer()
{
	player.hurt = true;
	player.HP--;
	//console.log(player.HP);
	hurtEffectInterval = setInterval(hurtEffect, 150);
	dispatchEvent(loseHealth);
}

function clearHurtEffect()
{
	player.hurt = false;
	//console.log(player.hurt);
	clearInterval(hurtEffectInterval);
	hurtEffectInterval = null;
	hurtEffectCounter = 0;
}

function togglePause()
{
	if(!paused)
	{
		paused = true;
		clearInterval(timeCount);
		clearInterval(healthPickupSpawnInterval);
		clearInterval(scorePickupSpawnInterval);
		clearInterval(scoreGainInterval);
		clearInterval(truckSpawnInterval);
	}
	else
	{
		paused = false;	
		timeCount = setInterval(timer, 1000);
		healthPickupSpawnInterval = setInterval(trySpawnHealthPickup, 500);
		scorePickupSpawnInterval = setInterval(trySpawnScorePickup, 500);
		truckSpawnInterval = setInterval(trySpawnTrucks, 400); //Every half a second, we try to spawn trucks.
		scoreGainInterval = setInterval(addScore, 300);
	}

}