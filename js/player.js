class Player{
    constructor(img,x,y,w,h,speed,maxW,maxH){
        this.img = img;
        this.x = x; 
        this.y = y; 
        this.w = w; 
        this.h = h; 
        this.speed = speed;
        this.maxW = maxW;
        this.maxH = maxH;
    }
    display(){
        image(this.img,this.x,this.y,this.w,this.h);
        this.move()
    }
    dead(bullet){
        return bullet.x > this.x - this.w &&
        bullet.x < this.x + this.w &&
        bullet.y - bullet.h > this.y - this.h &&
        bullet.y - bullet.h < this.y + this.h;
    }   
    move(){
        if(keyIsPressed){
            if(this.x > 0){
                if(keyCode === 65){
                    this.x-=this.speed; 
                }
            }
            if(this.x < this.maxW - this.w){
                if(keyCode === 68){
                    this.x+=this.speed;
                }
            }
        }
    }

    shot(bullets,img){
        bullets.push(new Bullet(img,this.x,this.y+this.h/2,6,16,10,-1,255,this.maxH));
    }
}