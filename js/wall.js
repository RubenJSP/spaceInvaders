class Wall{
    constructor (x,y,w,h,life,color,damage){
      this.x = x ,
      this.y = y ,
      this.w = w,
      this.h = h ,
      this.life = life
      this.color = color;
      this.damage = damage;
    }
    display(){
        if(this.life> 0){
            push()
                this.color.setAlpha(this.life*2);
                fill(this.color)
                strokeWeight(1)
                stroke(255)
                rect(this.x,this.y,this.w,this.h,3);
            pop()
        }
    }
    hit(bullet){
        if(bullet.x > this.x - this.w && bullet.x < this.x + this.w &&
            bullet.y - bullet.h > this.y - this.h && bullet.y - bullet.h < this.y + this.h && this.life > 0){
                this.life-=this.damage;
                return true;
            }
        return false;
    }
}