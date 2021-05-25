class Alien{
    constructor(img,x,y,w,h,speedX,speedY,type,maxH){
        this.img = img;
        this.x = x; 
        this.y = y; 
        this.w = w; 
        this.h = h; 
        this.alive = true;
        this.speedX = speedX;
        this.speedY = speedY;
        this.type = type;
        this.maxH = maxH;
        this.currentImg = 0;
    }
    display(){
        image(this.img[this.currentImg],this.x,this.y);
    }
    dead(bullet){
        return bullet.x > this.x - this.w &&
        bullet.x < this.x + this.w &&
        bullet.y - bullet.h > this.y - this.h &&
        bullet.y - bullet.h < this.y + this.h;
    }   
    moveX(direction){
        if(direction === "LEFT")
            this.x-=this.speedX;
            
        if(direction === "RIGHT")
            this.x+=this.speedX

        if(this.currentImg === 0)
            this.currentImg = 1;
        else
            this.currentImg = 0;
    }
    moveY(){
        this.y+=this.speedY;
    }
    shot(bullets,img){
        bullets.push(new Bullet(img,this.x,this.y,6,16,10,1,[255,0,0],this.maxH));
    }
    getPoints(){
        return (this.type+1) * 75;
    }
}