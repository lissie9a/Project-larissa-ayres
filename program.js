const context = document.querySelector("canvas").getContext("2d");
context.canvas.height = 400;
context.canvas.width = 800;



// Make sure the image is loaded first otherwise nothing will draw.

// Start frame count
let lives = 9;
let coins = 0;
// Start frame count
let frameCount = 1;
// obstacles = level
let obCount = 5;
let platform = frameCount;
var hearts;
// collection to hold x and ys
obXCoors = [];
obYCoors = [];
obXCoorsP = [];
obYCoorsP = [];

const importButton = document.getElementById("import-button");
const importJsonInput = document.getElementById("import-json");
const importDataList = document.getElementById("import-data-list");
// cat img(num) so read and increment for animation/ 10 cat png
//var sprites = [];
//sprites.length = 1;

//push the images into array

var square = {
	height: 32,
	jumping: true,
	width: 32,
	x: 0,
	xVelocity: 0,
	y: 0,
	yVelocity: 0

};

var enemy = {
  height: 32,
  jumping: true,
  width: 32,
  x: -100,
  xVelocity: 0,
  y: 0,
  yVelocity: 0
};

// obstacle for each frame
const nextFrame = function() {
	obXCoors = [];
	obYCoors = [];
	obXCoorsP = [];
	obYCoorsP = [];
	
  // increase the frame  count
  frameCount++;
  
  for (let i = 0; i < 10; i++) {
    // randomly generate the x coordinate 

    obXCoorP = Math.floor(Math.random() * 600);
    obXCoorsP.push(obXCoorP);
    obYCoorP = Math.floor(Math.random() * 300);
    obYCoorsP.push(obYCoorP);							//0 to 360 range
	obXCoor = Math.floor(Math.random() * 600);
    obXCoors.push(obXCoor);
	obYCoor = Math.floor(Math.random() * 320);
    obYCoors.push(obYCoor);
  }


}

const controller = {

  left: false,
  right: false,
  up: false,
  keyListener: function (event) {

    var key_state = (event.type == "keydown") ? true : false;

    switch (event.keyCode) {

      case 37:// left key
        controller.left = key_state;
        break;
      case 13:// up key
        controller.up = key_state;
        break;
      case 39:// right key
        controller.right = key_state;
        break;

    }

  }

};

// redo image sprite
const loop = function () {
	

  if (controller.up && square.jumping == false) {

    square.yVelocity -= 30;
    square.jumping = true;

  }

  if (controller.left) {

    square.xVelocity -= 0.5;

  }

  if (controller.right) {

    square.xVelocity += 0.5;

  }
  
///////////////player//////////////////////
  square.yVelocity += 1.5;// gravity
  square.x += square.xVelocity;
  square.y += square.yVelocity;
  square.xVelocity *= 0.9;// friction
  square.yVelocity *= 0.9;// friction
////////////////enemy//////////////////////
  enemy.yVelocity += 1.5;// gravity
  enemy.x += enemy.xVelocity;
  enemy.y += enemy.yVelocity;
  enemy.xVelocity *= 0.99;// friction
//////////////////////////////////////////

  // if square is falling below floor line
  if (square.y > 386 - 16 - 32) {

    square.jumping = false;
    square.y = 386 - 16 - 32;
    square.yVelocity = 0;
	

  }
   
   // if square is caught by enemy
  if (( square.x > enemy.x -10) && (square.x < enemy.x +10) && (square.y < 380) && (square.y > 330)) {
    
	square.jumping = true;
    square.yVelocity = -20;
	lives = lives -1;
	square.xVelocity *= 2;
	///
    context.fillStyle = "black"; // hex cube colour
    context.fillRect(square.x+15, ((square.y)-5), 3, 6);
    context.fillRect(enemy.x+14, ((enemy.y)-2), 4, 6);	

  } 
  
  // if enemy is falling below floor line
  if (enemy.y > 386 - 16 - 32) {

    enemy.jumping = false;
    enemy.y = 386 - 16 - 32;
    enemy.yVelocity = 0;

  }

  // if square is going off the left of the screen
  if (square.x < -20) {

    square.x = 800;
    enemy.x = 900;
  } else if (square.x > 800) {// if square goes past right boundary

    square.x = -20;
    nextFrame();
    enemy.x = -100; //fix this so tghat its relevant
  }
  
    // if enemy needs to follow square
  if (enemy.x < (square.x)&& square.y > 200 && frameCount > 1) {

    enemy.xVelocity = enemy.xVelocity + 0.02;

  }
  
    // if enemy needs to chase square
  if (enemy.x < (square.x) && square.y > 320 && frameCount > 5) {

    enemy.xVelocity = enemy.xVelocity + 0.0005*(frameCount-4);

  }
  
    // if enemy needs to follow square left
  if ((enemy.x) > (square.x)&& square.y > 200 && frameCount > 1) {

    enemy.xVelocity = enemy.xVelocity - 0.02;

  }
  
    // if enemy needs to chase square left
  if ((enemy.x) > square.x && square.y > 320 && frameCount > 5) {

    enemy.xVelocity = enemy.xVelocity - 0.0005*(frameCount-4);

  }
  
  if (lives < 1) {


	  function saveToFile(data) {
		  const coinNum = coins;
		  const levelNum = frameCount;
		  const jsonString = JSON.stringify(data);
		  const blob = new Blob([jsonString], { type: "application/json" });
		  const url = URL.createObjectURL(blob);
		  const a = document.createElement("a");
		  a.href = url;
		  a.download = frameCount;
		  document.body.appendChild(a);
		  a.click();
		  document.body.removeChild(a);
		  URL.revokeObjectURL(url);
	  }
	  function addImportedData(data) {
		  const listItem = document.createElement("score");
		  listItem.textContent = 'Level: ${data.frameCount}, Coins: ${data.coins}';
		  importedDataList.appendChild(listItem);
	  }
	  window.alert("GAME OVER you made it to level " + frameCount + " and have " + coins + " coins.");


  }
  //coins
  for (let i = 0; i < 8; i++) {
	  
	  //falling onto the square
	  if (square.x >= (obXCoors[i]-10) && square.x <= (obXCoors[i]+20) && square.y <= (obYCoors[i]+10)  && square.y >= (obYCoors[i]-20)) {

		coins=coins+1;

	}
	 
	}

  // collisions


  for (let i = 0; i < 4; i++) {
	  
	  //falling onto the square
	  if (square.x >= (obXCoorsP[i]-20) && square.x <= (obXCoorsP[i]+200) && square.y <= (obYCoorsP[i]+10)  && square.y >= (obYCoorsP[i]-10)) {
      	

		square.jumping = false;
		square.y = (obYCoorsP[i]-10);
		square.yVelocity = 0;
	}
	
	  //hitting square from bottom of the square
	  if (square.x >= (obXCoorsP[i]-20) && square.x <= (obXCoorsP[i]+200) && square.y <= (obYCoorsP[i]+20)  && square.y >= (obYCoorsP[i])) {
      	
		square.jumping = false;
		square.yVelocity = + 40;
	}
	
	
	  //hitting square from left
	  if (square.x >= (obXCoorsP[i]-25) && square.x <= (obXCoorsP[i]-15) && square.y <= (obYCoorsP[i]+20)  && square.y >= (obYCoorsP[i]-20)) {
      	
		square.jumping = false;
		square.x = (obXCoorsP[i]-25);
		square.xVelocity = -3;
		square.yVelocity = +5;
	}
	
	  //hitting square from right
	  if (square.x >= (obXCoorsP[i]+200) && square.x <= (obXCoorsP[i]+205) && square.y <= (obYCoorsP[i]+20)  && square.y >= (obYCoorsP[i]-20)) {
      	
		square.jumping = false;
		square.x = (obXCoorsP[i]+200);
		square.xVelocity = +3;
		square.yVelocity = +5;
	}
  
	}
  
  //backdrop
	context.fillStyle = "white";
	context.fillRect(0, 0, 800, 400); // x, y, width, height





 // colour platform
  for (let i = 0; i < 4; i++) {

	  context.strokeStyle = "blue";
	  context.lineWidth = 20;
	  context.beginPath();
	  context.moveTo(obXCoorsP[i], obYCoorsP[i]);
	  context.lineTo(obXCoorsP[i]+200, obYCoorsP[i]);
	  context.stroke();
	  
  }
   
  
  if (lives > 0) {
	  // spriteeeee
	  context.fillStyle = "blue"; // hex cube colour
	  context.fillRect(square.x - 15, square.y - 30, 30, 30)



  }

  if (lives > 0) {
	  // enemy
	  context.fillStyle = "red"; // hex cube colour
	  context.fillRect(enemy.x-15, enemy.y-30, 30, 30)

  }
  
////////




  // coins


  for (let i = 0; i < 8; i++) {
	  //
	  context.strokeStyle = "yellow";
	  context.lineWidth = 20;
	  context.beginPath();
	  context.moveTo(obXCoors[i], obYCoors[i]);
	  context.lineTo(obXCoors[i]+20, obYCoors[i]);
	  context.stroke();
	  
	 
  }
	////hearts

  for (let i = 0; i < lives; i++) {
	  //

	  context.strokeStyle = "red";
	  context.lineWidth = 20;
	  context.beginPath();
	  context.moveTo(([i]*90)+20, 20);
	  context.lineTo(([i]*90)+42, 40);
	  context.stroke();

	  context.beginPath();
	  context.moveTo(([i]*90)+28, 40);
	  context.lineTo(([i]*90)+50, 20);
	  context.stroke()
  }
  
  // ground
  context.strokeStyle = "blue";
  context.lineWidth = 60;
  context.beginPath();
  context.moveTo(0, 370);
  context.lineTo(800, 370);
  context.stroke();
  


  // draw
  window.requestAnimationFrame(loop);

};




window.addEventListener("keydown", controller.keyListener)
window.addEventListener("keyup", controller.keyListener);
window.requestAnimationFrame(loop);
