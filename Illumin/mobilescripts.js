var canvas1 = document.getElementById("canvas1");
var cx = canvas1.getContext("2d");
canvas1.width = 600;
canvas1.height = 600;

var canvas2 = document.getElementById("canvas2");
var cx2 = canvas2.getContext("2d");
canvas2.width = 600;
canvas2.height = 330;

var canvas3 = document.getElementById("canvas3");
var cx3 = canvas3.getContext("2d");
canvas3.width = 600;
canvas3.height = 100;


//game elements
var doloop = [];
var scale = 30;
var currentLevel;
var spawn;
var artifacts;
var artifactList2 = [];
var artifactList3 = [];
var artifactIndex = [];
var artifactString = [];
var levelNum = -1;
var then;
var goingLeft = false;
var goingRight = false;
var goingTop = false;
var goingBottom = false;


//physics
var speed = 8;
var acc = 0;
var Gracount = 0 ;
var jumcount = 1.8;
var jumtimes = 0;
var gravity = 3;


//Image
var wallImg = new Image();
var characterImg = new Image();
var cloudImg = new Image();
var spikeImg = new Image();
var artifactImg = new Image();
var midPyImg = new Image();
var leftPyImg = new Image();
var rightPyImg = new Image();
var ladderImg = new Image();
var skullImg = new Image();


ladderImg.src = "ladder.jpg";
midPyImg.src = "pymid.jpg";
leftPyImg.src = "pyleft.jpg";
rightPyImg.src = "pyright.jpg";
artifactImg.src = "artifact.jpg";
spikeImg.src = "spikes.jpg";
wallImg.src = "wall.jpg";
characterImg.src = "flatcharacter.png";
cloudImg.src = "clouds.png";
skullImg.src = "skull.jpg";


var charStat = 0, cycle = 0, charWidth = 30; charHeight = 60, cycleCount = 0;
var cloud = 100;
var death = false;

var obstacleString = [];


function levelToString(obstacles){
    for (var i = 0; i < obstacles.length; i++) obstacleString.push(obstacles[i].toString());
}
function art(){
    for (var i = 0; i < artifactList3.length; i++) artifactString[i] = artifactList3[i].toString();
}

function readLevel(levels){ 
    this.width = levels[0].length;
    this.height = levels.length;
    this.obstacles = [];
    this.player = [];
    
    for (var y = 0; y < this.height; y++){
        for (var x = 0; x < this.width; x++ ){
            if (levels[y][x] <20 && levels[y][x] >0 && levels[y][x] != 3 && levels[y][x] != 9) this.obstacles.push([x,y]);
            else if (levels[y][x] == 9){
                this.player.push(x,y);
                spawn = [x,y];
            }
            else if (levels[y][x] == 3) {artifactIndex.push(this.obstacles.length); this.obstacles.push([x,y,3])};
        }
    }
    for (var x = 0; x < artifactIndex.length; x++){
        artifactList3.push(this.obstacles[artifactIndex[x]]);
    }
    artifacts = artifactIndex.length;
}

function drawLevel(obstacles, levels){
    var obstaclesList= [];
    var obstacleString = [];
    var artifactList = [];
    
    for (var i = 0; i < obstacles.length; i++) obstacleString.push(obstacles[i].toString());
    
    for (var i = Math.floor(runLevel.player[1]) - 12; i <= Math.floor(runLevel.player[1]) + 12; i++){
        for (var j = Math.floor(runLevel.player[0]) - 16; j <= Math.floor(runLevel.player[0]) + 16; j++){
         var temp = j.toString() + "," + i.toString();
         if (obstacleString.indexOf(temp) >= 0) obstaclesList.push(obstacles[obstacleString.indexOf(temp)]);
         temp = j.toString() + "," + i.toString() + "," + "3";
         if (artifactString.indexOf(temp) >= 0) artifactList.push(obstacles[obstacleString.indexOf(temp)]);
            
        }
    }
    artifactList2 = artifactList;
    
    
    for (var x = 0; x < obstaclesList.length; x++) { 
        var drawX = obstaclesList[x][0] - (runLevel.player[0] - 9);
        var drawY = obstaclesList[x][1] - (runLevel.player[1] - 12);
        if (levels[obstaclesList[x][1]][obstaclesList[x][0]] == 1) cx.drawImage(wallImg,  scale*drawX,  scale*drawY);
        else if (levels[obstaclesList[x][1]][obstaclesList[x][0]] == 2) cx.drawImage(spikeImg,  scale*drawX,  scale*drawY);
        else if (levels[obstaclesList[x][1]][obstaclesList[x][0]] == 11) cx.drawImage(midPyImg,  scale*drawX,  scale*drawY);
        else if (levels[obstaclesList[x][1]][obstaclesList[x][0]] == 12) cx.drawImage(leftPyImg,  scale*drawX,  scale*drawY);
        else if (levels[obstaclesList[x][1]][obstaclesList[x][0]] == 13) cx.drawImage(rightPyImg,  scale*drawX,  scale*drawY);
        else if (levels[obstaclesList[x][1]][obstaclesList[x][0]] == 5) cx.drawImage(ladderImg,  scale*drawX,  scale*drawY);
        else if (levels[obstaclesList[x][1]][obstaclesList[x][0]] == 7) cx.drawImage(skullImg, scale*drawX,  scale*drawY);

    }
    
    for (var x = 0; x < artifactList2.length; x++){
        var drawX = artifactList[x][0] - (runLevel.player[0] - 9);
        var drawY = artifactList[x][1] - (runLevel.player[1] - 12);
        cx.drawImage(artifactImg,  scale*drawX,  scale*drawY);
    }
}




function drawPlayer(){
    cycle = 0; 
    cx.drawImage(characterImg, scale*(9),  scale*(12));    
}

function drawClouds(){
    if (cloud<=5) cloud = 595;
    else if (cloud >=595) cloud = 5;
    cx3.drawImage(cloudImg, cloud, 0, 600, 100, 0, 0, 600, 100);
}


if (window.DeviceOrientationEvent) {
    
        window.addEventListener('deviceorientation', function(eventData) {
          // gamma is the left-to-right tilt in degrees, where right is positive
          var tiltLR = eventData.gamma;
          var tiltFB = eventData.beta;
          if (tiltLR > 4){goingLeft = false; goingRight = true}
          else if (tiltLR < -4)  {goingLeft = true; goingRight = false}
          else {goingLeft = false; goingRight = false}
            
          if (tiltFB > 7) {goingTop = false; goingBottom = true}
          else if (tiltFB < -7) {goingTop = true; goingBottom = false}
          else {goingTop = false; goingBottom = false}    
    },false);
}

var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

function tick(time, levels) {
    if (!death)
    {
    charStat = 0;
    
    var up = false; 
    var downHit = tryhit((runLevel.player[0]), (runLevel.player[1] + (Gracount * time * gravity)+1.08));
        
    if ((38 in keysDown || goingTop) && Gracount == 0) { //up
        up = true;
        if (jumtimes == 0) jumtimes += 40;
    }
    if (40 in keysDown || goingBottom) { //down
        var hitType = 0;
        if (downHit[1] != undefined) hitType = levelPlan[levelNum][downHit[2]][downHit[1]];
        if (hitType ==0 || hitType == 5){
        runLevel.player[1] += gravity*time;
        } 
    }
    if (37 in keysDown || goingLeft) { //left
        charStat = 2;
        var leftHit1 = tryhit((runLevel.player[0] - speed * time), (runLevel.player[1]));
        var leftHit2 = tryhit((runLevel.player[0] - speed * time), (runLevel.player[1]+1));
        var leftHit3 = tryhit((runLevel.player[0] - speed * time), (runLevel.player[1])-0.7);
        var leftHit4 = tryhit((runLevel.player[0] - speed * time), (runLevel.player[1]+1)-0.7);
        var leftHit5 = tryhit((runLevel.player[0] - speed * time), (runLevel.player[1]));
        var leftHit6 = tryhit((runLevel.player[0] - speed * time), (runLevel.player[1]+1));
        var leftHit7 = tryhit((runLevel.player[0] - speed * time), (runLevel.player[1])-0.7);
        var leftHit8 = tryhit((runLevel.player[0] - speed * time), (runLevel.player[1]+1)-0.7);
        if (!leftHit1[0] && !leftHit2[0] && !leftHit3[0] &&!leftHit4[0]) {runLevel.player[0] -= speed *time;
        cloud -= 0.6;}
        else {
            var hitType;
            if (leftHit5[1] != undefined) hitType = levelPlan[levelNum][leftHit5[2]][leftHit5[1]];
            else if (leftHit6[1] != undefined) hitType = levelPlan[levelNum][leftHit6[2]][leftHit6[1]];
            else if (leftHit7[1] != undefined) hitType = levelPlan[levelNum][leftHit7[2]][leftHit7[1]];
            else if (leftHit8[1] != undefined) hitType = levelPlan[levelNum][leftHit8[2]][leftHit8[1]];
        if (hitType == 5) { runLevel.player[0] -= speed *time; cloud -= 0.6;} 
        }
    }
    if (39 in keysDown || goingRight) { //right
        charStat = 1;
        var rightHit1 = tryhit((runLevel.player[0] + speed * time), (runLevel.player[1]));
        var rightHit2 = tryhit((runLevel.player[0] + speed * time), (runLevel.player[1]+1));
        var rightHit3 = tryhit((runLevel.player[0] + speed * time), (runLevel.player[1])-0.7);
        var rightHit4 = tryhit((runLevel.player[0] + speed * time), (runLevel.player[1]+1)-0.7);
        var rightHit5 = tryhit((runLevel.player[0] + speed * time)+1, (runLevel.player[1]));
        var rightHit6 = tryhit((runLevel.player[0] + speed * time)+1, (runLevel.player[1]+1));
        var rightHit7 = tryhit((runLevel.player[0] + speed * time)+1, (runLevel.player[1])-0.7);
        var rightHit8 = tryhit((runLevel.player[0] + speed * time)+1, (runLevel.player[1]+1)-0.7);
        if (!rightHit1[0] && !rightHit2[0] && !rightHit3[0] && !rightHit4[0]){ runLevel.player[0] += speed *time;
        cloud += 0.6;}
        else{
            var hitType;
            if (rightHit5[1] != undefined) hitType = levelPlan[levelNum][rightHit5[2]][rightHit5[1]];
            else if (rightHit6[1] != undefined) hitType = levelPlan[levelNum][rightHit6[2]][rightHit6[1]];
            else if (rightHit7[1] != undefined) hitType = levelPlan[levelNum][rightHit7[2]][rightHit7[1]];
            else if (rightHit8[1] != undefined) hitType = levelPlan[levelNum][rightHit8[2]][rightHit8[1]];
        if (hitType == 5 || hitType==undefined) { runLevel.player[0] += speed *time; cloud += 0.6;} 
        }
    }
    

      
    // gravity
    
    if (!downHit[0]){
        runLevel.player[1] += gravity*time*Gracount;
        Gracount += 0.05;
    } 
    else {
        if (levels[downHit[2]][ downHit[1]] == 2) death = true;
        else if (levels[downHit[2]][ downHit[1]] == 3) artifacts --;
        Gracount = 0;
    }
    
    
    //jumps
    if (jumtimes >0){
        var topHit = tryhit((runLevel.player[0]), (runLevel.player[1] - (Gracount * time * jumcount)-1));
        var hitType = 0;
        if (topHit[1] != undefined) hitType = levelPlan[levelNum][topHit[2]][topHit[1]];
        if (hitType ==0){
            jumtimes--;
            runLevel.player[1] -= gravity*time*jumcount;
            if (jumcount >= 0.05)jumcount -= 0.03;
        } 
        else if (hitType == 5 )  {
            runLevel.player[1] -= speed*time;
            jumtimes = 0;
            jumcount = 1.80;
        }
        else {
            jumtimes = 0;
            jumcount = 1.80;
        }
        
    }
    else {
        jumcount = 1.80;
    }
    if (jumcount == 1.77) document.getElementById('jump').play();
    
    //artifact check
    for (var x = 0; x < artifactList2.length; x++){
        if (runLevel.player[0] < artifactList2[x][0] + 1 &&
            runLevel.player[0] + 1 > artifactList2[x][0] &&
            runLevel.player[1] < artifactList2[x][1] + 1 &&
            2 + runLevel.player[1] > artifactList2[x][1]){
            artifacts--;
            var temp = artifactList2[x][0].toString() + "," + artifactList2[x][1] + "," + "3";
            if (artifactString.indexOf(temp) >=0) {
                document.getElementById('founditem').pause();
                document.getElementById('founditem').currentTime = 0;
                document.getElementById('founditem').play();
                artifactString.splice(artifactString.indexOf(temp), 1);
            }
            
        }
    }
    
    if (runLevel.player[1] > runLevel.height+10) death = true;
    }
    
    document.getElementById('artifact').innerHTML = "Artifacts to collect: " + artifacts;
    if (levelNum == 8){
        if (runLevel.player[0]>7 && runLevel.player[0] <16 && runLevel.player[1] >55 && runLevel.player[1]<57) document.getElementById('laugh').play();
    }
}


//collision detection

function tryhit(futX, futY){
    var list = [];
    var result = [false];
    for (var i = 0; i < runLevel.obstacles.length; i++){
        list.push((runLevel.obstacles[i]).toString());
    } 
    var temp1 = (Math.floor(futX)).toString() + "," + (Math.ceil(futY)).toString();
    var temp2 = (Math.ceil(futX)).toString() + "," + (Math.ceil(futY)).toString();
    var collideObj;
    var predict = list.indexOf(temp1);
    if (predict >=0) {
        collideObj = split(list[predict]);
        if (futX < collideObj[0] + 1 &&
            futX + 1 > collideObj[0] &&
            futY < collideObj[1] + 1 &&
            2 + futY > collideObj[1]){
                result = [true, collideObj[0], collideObj[1]];
        } else result = [false];
    }
    if (!result[0]){
        predict = list.indexOf(temp2);
        if (predict >=0) {
            collideObj = split(list[predict]);
            if (futX < collideObj[0] + 1 &&
                futX + 1 > collideObj[0] &&
                futY < collideObj[1] + 1 &&
                2 + futY > collideObj[1]){
                    result = [true, collideObj[0], collideObj[1]];
                }
                else result = [false];
        } 
    }
    
    return result;
}


function split(string){
    return string.split(",");
}

function checkDeath(){
    if (death) {
        document.getElementById('scream').pause();
        document.getElementById('scream').currentTime = 0;
        document.getElementById('scream').play();
        runLevel.player[0] = spawn[0];
        runLevel.player[1] = spawn[1];
        art();
        artifacts = artifactIndex.length;
        death = false;
    }
}

function main(){ maindo = setInterval(function() {
 	var now = Date.now();
	var delta = now - then;
    acc++;//just a frame check
    tick(delta/1000, levelPlan[levelNum]);
    checkDeath();
    cx.clearRect(0, 0, 600, 600);
    drawLevel(runLevel.obstacles, levelPlan[levelNum]);
    drawClouds();
    drawPlayer();
    then = now; 
    if (artifacts == 0) {
        clearInterval(maindo);
        start();
    }
    }, 20);
}



function start(){
    levelNum++;
    gravity=3;
    document.getElementById('filter').style.opacity="0";
    if (levelNum == 6) {gravity = 10;   document.getElementById('filter').style.opacity="1";}
    document.getElementById('hint').innerHTML = hints[levelNum];
    if (levelNum % 2 == 0) {document.getElementById('bgm1').play(); document.getElementById('bgm2').pause();document.getElementById('bgm2').currentTime=0;}
    else {document.getElementById('bgm2').play(); document.getElementById('bgm1').pause();document.getElementById('bgm1').currentTime=0;}
    artifactList3 = [];
    artifactList2 =  [];
    artifactIndex = [];
    artifactString = [];
    then = Date.now();  
    runLevel = new readLevel(levelPlan[levelNum]);
    levelToString(runLevel.obstacles);
    art();
    main();
}
start();