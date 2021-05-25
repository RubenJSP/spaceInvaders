class Bullet{
    constructor(img,x,y,w,h,speed,dir,color,maxH){
        this.img = img;
        this.x = x; 
        this.y = y; 
        this.w = w; 
        this.h = h; 
        this.speed = speed;
        this.dir = dir;
        this.isDestroyed = false;
        this.color = color;
        this.maxH = maxH;
        this.factor = 2;
    }
    display(){
        push()
        fill(this.color)
        if(this.img!=null){
            image(this.img,this.x - (this.img.width/this.factor*(this.factor/10)),this.y,this.img.width/this.factor,this.img.height/2);
        }
        else
            rect(this.x,this.y,this.w,this.h,10);
        pop()
        this.move();
    }
    move(){
        this.y+=this.speed*this.dir;
    }

    destroyed(){    
        if(this.y < 0 || this.y > this.maxH)
            this.isDestroyed = true;
        return this.isDestroyed;
    }
}