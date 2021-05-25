let playerImg;
let bg;
let logo;
let playerBullet,playerLasser,lasserSound,playerHit;
let playerSound,alienSound;
let alienBullet,alienHit,alienDeath;
let player;
let playerBullets = [];
let alienBullets = [];
let playerSpeed = 9;
let maxShields;
let shields = [],shieldsOffsetX = 300,wallX = 100,wallY=0,wallW=17,
    wallH=15,wallLife=100,wallDamage=25, wallColor = [35, 64, 232],
    wallHit;
let shape = [
    [1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1],
    [1,1,0,0,0,0,1,1],
    [1,0,0,0,0,0,0,1]
];
let initialFireRate = 30,playerFireRate = initialFireRate,rapidFireDuration=6,canShot = true;
let aliensImg = [];
let level = 1,maxLevel = 5;
let sprites = []
let aliens = [];
let alienDirection = "RIGHT";
let initialLifes = 4,lifes = initialLifes;
let aliensY = 70,alienW = 32,alienSpeedX = 32,alienSpeedY=12,initialAlienSpeed= 30,alienSpeed = initialAlienSpeed,
    initialAlienFireRate= 60,alienFireRate = initialAlienFireRate;
let cantX = 0, cantY = 0;
let offsetX = 25, offsetY = 12;
let pointsPlayer = 0;
let items = [];
let shieldSound;
let playerShield;
let selectedColor = [16, 181, 227];
let gameOver = false;
let pause = false;
let menu = true,bgSound;
function preload(){
    playerImg = loadImage('assets/player.png');
    playerBullet = loadImage('assets/bullets/1.png');
    playerLasser = loadImage('assets/bullets/3.png');
    alienBullet = loadImage('assets/bullets/2.png');
    alienDeath = loadImage('assets/alienDeath.png');
    logo = loadImage('assets/logo.png');
    bg = loadImage('assets/background.jpg');
    aliensImg = [
        [loadImage('assets/alien1.png'),loadImage('assets/alien1_1.png')],
        [loadImage('assets/alien2.png'),loadImage('assets/alien2_1.png')],
        [loadImage('assets/alien3.png'),loadImage('assets/alien3_1.png')]
    ]

    playerSound = loadSound('assets/sound/1.ogg');
    alienSound = loadSound('assets/sound/2.ogg');
    lasserSound = loadSound('assets/sound/3.ogg');
    shieldSound = loadSound('assets/sound/4.ogg');
    wallHit = loadSound('assets/sound/5.ogg');
    alienHit = loadSound('assets/sound/6.ogg');
    playerHit  = loadSound('assets/sound/7.ogg');
    bgSound = loadSound('assets/sound/menu.ogg');
}

function setup(){
    //windowWidth-5
    createCanvas(windowWidth-5,windowHeight-5);
    player = new Player(playerImg,width/2,height-50,32,30,playerSpeed,width,height);
    playerSound.setVolume(0.5);
    alienSound.setVolume(0.5);
    lasserSound.setVolume(0.3);
    bgSound.setVolume(0.20);
    wallHit.setVolume(0.7);
    alienHit.setVolume(0.3);
    playerHit.setVolume(0.3);
    wallY = height - 125;
    //Cantidad de escudos
    maxShields = Math.floor(((width)/100)/2);
    maxShields -= Math.floor(shieldsOffsetX/100)
    console.log(maxShields)
    //Cantidad de aliens en horizontal
    cantX = Math.floor(width/2)/100;
    //Cantidad de aliens el vertical
    cantY = Math.floor(height)/300;
    bg.resize(width,height);
    frameRate(60)
    loadAliens()
    loadWalls()
    loadItems();
}
function loadItems(){
    rapidFireDuration = 6;
    items = [
        {name: 'SHIELD',ready:true,using:false,time:240,progress:255,img: loadImage('assets/shield.png')},
        {name: 'LASSER',ready:true,using:false,time:120,progress:255,img: loadImage('assets/lasser.png')},
        {name: 'RAPIDFIRE',ready:true,using:false,time:60,progress:255,img: loadImage('assets/rapidFire.png')}
    ];

}
function showItems(){
    let x=(width/2) - (items.length)*32, y = 10;
    if(items[2].using){
        push()
        fill(selectedColor);
        rect(x + 50,y+40,(rapidFireDuration/6)*150,10);
        pop()
    }
    items.forEach((item,index) => {
        if(!item.ready && item.progress == 255){
            item.ready = true; 
        }
        x+=60;
        if(item.ready){
            image(item.img,x,y,32,32);
            push()
            textSize(20);
            fill(255);
            text((index+1),x-15,y+32);
            pop()
            push();
            if(item.using)
                stroke(selectedColor);
            else
                stroke(255);
            strokeWeight(2);
            noFill();
            rect(x,y,32,32,5);
            pop();
        }
        else{
            if(frameCount%item.time==0 && item.progress < 255){
                item.progress+=15;
            }
            push()
            tint(255, item.progress);
            image(item.img,x,y,32,32);
            pop()
        }

        
    });
}
function keyPressed(){
    if(!menu){
        if(keyCode === 80){
            pause = !pause;
        }
        if(!pause && !menu){
            if(keyCode === 32 && canShot){
                if(items[1].ready && items[1].using){
                    player.shot(playerBullets,playerLasser,[0,255,0]);
                    items[1].progress= 0;
                    items[1].ready= false;
                    if(!lasserSound.isPlaying())
                        lasserSound.play();
                        
                }else{
                    player.shot(playerBullets,playerBullet,[100,200,255]);
                    playerSound.play()
                }
                canShot = false;    
            }
            if((lifes === 0 || aliens.length === 0) && keyCode === 13 && (level == maxLevel|| gameOver))
                restartGame()
    
            //Seleccionar item
            if(!usingItems()||key === '1'){
                switch(key){
                    case '1':
                        if(items[0].ready && !items[0].using){
                            if(!items[0].using)
                                shieldSound.play()
                            items[0].using = true;
                            items[1].using = false;
                            playerShield = new Shield(player.x,player.y,player.w,player.h);
                            
                        }
                    break;
                    case '2':
                        if(items[1].ready){
                            items[1].using = true;
                        }
                    break;
                    case '3':
                        if(items[2].ready){
                            playerFireRate = 2;
                            rapidFireDuration = 6;
                            items[2].using = true;
                        }
                    break;
    
                    default:
                    break;
                }
            }
        }
    }
    else{
        if(keyCode === 13){
            menu = false;
            bgSound.loop();
        }
    }
}
function usingItems(){
    let using = false;
    items.forEach(item => {
        if(item.using && item.name != "SHIELD"){
            using = true;
        }
    });
    return using;
}
function drawBullets(){
    alienBullets.forEach(bullet => {
        shields.forEach(block => {
            if(block.hit(bullet)){
                if(!wallHit.isPlaying())
                    wallHit.play();
                bullet.isDestroyed = true;
            }
        });
        if(playerShield!=null){
            if(playerShield.hit(bullet)){
                if(!wallHit.isPlaying())
                    wallHit.play();
                bullet.isDestroyed = true;
            }
            if(!playerShield.isActive()){
                playerShield = null;
                items[0].ready = false;
                items[0].progress = 0;
                items[0].using = false;
                lifes++;
            }
        }
        if(player.dead(bullet)){
            bullet.isDestroyed = true;
            if(playerShield == null){
                if(!playerHit.isPlaying())
                    playerHit.play()
                background(100);
                lifes--;
            }
        }
        bullet.display();
        if(bullet.destroyed())
            alienBullets.splice(alienBullets.indexOf(bullet),1);
    });

    playerBullets.forEach(bullet => { 
        shields.forEach(block => {
            if(block.hit(bullet) && !items[1].using){
                if(!wallHit.isPlaying())
                        wallHit.play();
                bullet.isDestroyed = true;
            }
        });
        aliens.forEach(alien => {
            if(alien.dead(bullet)){
                if(!alienHit.isPlaying()){
                    alienHit.play()
                }
                image(alienDeath,alien.x,alien.y);
                aliens.splice(aliens.indexOf(alien),1);
                if(!items[1].using)
                    bullet.isDestroyed = true;
                pointsPlayer+=alien.getPoints();
            }
        });
        bullet.display()
        if(bullet.destroyed()){
            playerBullets.splice(playerBullets.indexOf(bullet),1);
            if(playerBullets.length == 0)
                items[1].using = false;
        }
    });


}
function reset(){
    aliens = [];
    alienBullets = [];
    playerBullets = [];
    loadAliens();
    loadItems()

}
function newLevel(){
    if(level < maxLevel){
        level++;
    }
    alienSpeedX+=2;
    alienSpeedY++;
    if(playerFireRate > 10)
        playerFireRate = initialFireRate - (level*4);
    if(cantY<= 6)
        cantY++;
    if(cantX <=20){
        cantX+=3;
    }
    if(alienFireRate > 15)
        alienFireRate -= 15;

    loadAliens();
    loadWalls();
    
}
function restartGame(){
    shields = []
    playerBullets = []
    alienBullets = []
    loadWalls()
    lifes = initialLifes;
    alienSpeed = initialAlienSpeed;
    alienFireRate = initialAlienFireRate;
    playerFireRate = initialFireRate;
    gameOver = false;
    cantX = Math.floor(width/2)/50;
    cantY = Math.floor(height)/300;
    reset()
    level = 1;
}
function drawLifes(){
    let x = width - (32*(lifes+1.5));
    for (let i = 0; i < lifes; i++) {
        x+=32,
        image(playerImg,x+5,5,32,32);
    }
}

function points(){
    push()
    fill(255)
    textSize(20);
    text("Score " + pointsPlayer,10,20);
    pop()
    push()
    textSize(20);
    fill(255)
    textAlign(CENTER)
    text("Level " + level,width/2,height-5);
    pop()
}
function loadWalls(){
    for (let nShields = 0; nShields < maxShields; nShields++) {
        let y = wallY;
        for (let i = 0; i < shape.length; i++) {
            let x = wallX + ((nShields)*shieldsOffsetX);
            playerBullets = [];
            for (let j = 0; j < shape[i].length; j++) {
                x+=wallW;
                if(shape[i][j] != 0)
                    shields.push(new Wall(x,y,wallW,wallH,wallLife,color(wallColor),wallDamage));
            }
            y+=wallH;
        } 
    }
}
function loadAliens(){
    let y = aliensY;
    for (let i = 0; i < cantY; i++) {
        let x = (width/2) - alienW*(cantX);
        let type = Math.floor(i%3)
        for (let j = 0; j < cantX; j++) {
            aliens.push(new Alien(aliensImg[type],x,y,alienW,alienW,alienSpeedX,alienSpeedY,type,height));  
            x+=32 + offsetX;
        }
        y+=alienW + offsetY;
    }
}
function borderReached(){
    let done = false
    aliens.forEach(alien => {
        if(alien.x < alien.w || alien.x > width - alien.w * 2)
            done = true;
    });
    return done;
}
function drawAliens(){
    aliens.forEach(alien => {
        alien.display() 
    });
}
function moveAliens(){
    aliens.forEach(alien => {
        alien.moveX(alienDirection);    
    });
    if(borderReached()){
        reverseAlienX();
        moveAliensY();
    if(alienFireRate > 15)
        alienFireRate-=5;
    if(alienSpeed > 10)
        alienSpeed-=2;
    }
}
function alienShots(){
    if(frameCount%alienFireRate == 0){
        let choosen = Math.floor(Math.random()*aliens.length)
        aliens[choosen].shot(alienBullets,alienBullet);
        if(!alienSound.isPlaying())
            alienSound.play()
    }
}
function alienReachesBottom(){
    let reached = false
    aliens.forEach(alien => {
        if(alien.y > player.y)
            reached = true;     
    });
    return reached;
}
function moveAliensY(){
    aliens.forEach(alien => {
        alien.moveY();
    });
}
function reverseAlienX(){
    if(alienDirection === "LEFT")
        alienDirection = "RIGHT"
    else
        alienDirection = "LEFT"
}

function draw(){
    background(bg);
    if(!menu){
        if(!pause){
            if(lifes > 0){
                showItems()
                if(aliens.length > 0){
                    shields.forEach(block => {
                        block.display()
                    });
                    if(items[0].using){
                        playerShield.display();
                        playerShield.move(player);
                    }
                    player.display();
                    if(frameCount%playerFireRate === 0)
                        canShot = true;
                    if(items[2].using){
                        console.log(rapidFireDuration)
                        if(frameCount%60=== 0){
                            rapidFireDuration--;
                        }

                        if(rapidFireDuration === 0){
                            items[2].using = false;
                            items[2].ready = false; 
                            items[2].progress = 0;
                            playerFireRate = initialFireRate - (level*4);
                        }
                    }
                    drawLifes()
                    points();
                    drawAliens();
                    alienShots()
                    if(frameCount % alienSpeed == 0){
                        moveAliens()
                        if(alienReachesBottom()){
                            lifes--;
                            reset()
                        }
                    }
                drawBullets();
                }else{
                    if(level === maxLevel){
                        push()
                        fill(255);
                            textAlign(CENTER)
                            textSize(50);
                            text("YOU WON :)",width/2,height/2);
                            textSize(30)
                            text("Press ENTER to continue",width/2,height/2 + 40);
                            textSize(25);
                            text("Score " + pointsPlayer,width/2,height/2 + 70);
                        pop()
                    }else{
                        newLevel();
                    }
                }
            }else{
                gameOver = true;
                push()
                fill(255);
                    textAlign(CENTER)
                    textSize(50);
                    text("GAME OVER :(",width/2,height/2);
                    textSize(30)
                    text("Press ENTER to continue",width/2,height/2 + 60);
                pop()
            }
        }else{
            push()
            fill(255);
                textAlign(CENTER)
                textSize(50);
                text("PAUSED",width/2,height/2);
                textSize(30)
                text("Press P to continue",width/2,height/2 + 60);
            pop()
        }  
    }else{
        push()
        let offset = height/6;
            imageMode(CENTER);
            logo.resize(height/1.5,height/2.5);
            image(logo,width/2,(logo.height/2) + offset);
            fill(255);
                textAlign(CENTER)
                textSize(50);
                textSize(30)
                fill([Math.floor(Math.random()*155),Math.floor(Math.random()*200),Math.floor(Math.random()*255)])
                text("Press ENTER to START",width/2,logo.height + 50 + offset);
                textSize(25)
                fill([245, 239, 71])
                text("How to play?",width/2,logo.height + 80 + offset);
                textSize(18)
                fill([245, 71, 71])
                text("Use keys A and D for moving",width/2,logo.height + 120 + offset);
                text("Press SPACEBAR for shooting",width/2,logo.height + 150 + offset);
                text("Use keys 1, 2, 3 for select your abilities",width/2,logo.height + 180 + offset);
                text("Use P for pause/resume THE GAME",width/2,logo.height + 210 + offset);
                textSize(12)
                fill([71, 245, 100])
                text("By: Ruben J. Sandoval",width/2,logo.height + 230 + offset);
            pop()
    }

}

  
