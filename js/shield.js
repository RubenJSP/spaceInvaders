class Shield{
    constructor (x,y,w,h){
      this.x = x ,
      this.y = y ,
      this.w = w,
      this.h = h ,
      this.life = 100,
      this.color = [
          [70, 235, 52],
          [201, 235, 52],
          [235, 214, 52],
          [235, 113, 52],
          [235, 52, 52]
      ],
      this.currentColor = 0,
      this.damage = 20;
    }
    display(){
        if(this.isActive()){
            push()
            let shieldColor = color(this.color[this.currentColor]);
            strokeWeight(2);
            stroke(shieldColor);
            shieldColor.setAlpha(100);
            fill(shieldColor)
            rect(this.x,this.y,this.w,this.h,10);
            pop()
        }
    }
    move(player){
        this.x = player.x;
        this.y = player.y;
    }
    hit(bullet){
        if(bullet.x > this.x - this.w && bullet.x < this.x + this.w &&
            bullet.y - bullet.h > this.y - this.h && bullet.y - bullet.h < this.y + this.h){
                this.life-=this.damage;
                this.currentColor++;
                return true;
            }
        return false;
    }

    isActive(){
        return this.life > 0;
    }
}