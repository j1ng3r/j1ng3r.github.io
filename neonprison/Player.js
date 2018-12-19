Game.Player=(_=>{
    class Player{
        constructor(pos,vel){
            this.size=Vector.one.scale(config.player.size);
            this.pos=new Vector(pos).add(0,this.size.y);
            this.vel=new Vector(vel);
            this.deaths=0;
            this.grounded=false;
            this.index=Game.players.push(this)-1;
        }
        key(str){
            return Game.key["player"+this.index+str[0].toUpperCase()+str.slice(1)];
        }
        updateValues(){
            this.Ipos*=config.Ifric;
            this.vel=this.vel.scale(config.player.xfric,config.player.yfric);
            this.pos=this.nextPos;
        }
        stand(y){
            this.vel.y=0;
            this.grounded=true;
            this.nextPos.y=y;
        }
        step(){
            this.direction=this.key("right").down-this.key("left").down;
            this.vel.x+=this.direction*config.player.xacc;
            this.Ipos+=this.direction*config.player.Iacc;
            if(this.grounded){
                this.vel.y=this.key("jump").down?config.player.jump:0;
            } else {
                this.vel.y-=config.player.gravity;
            }
            this.nextPos=this.pos.add(this.vel);
            this.grounded=false;
        }
        get top(){
            return this.pos.y+this.size.y/2;
        }
        get nextTop(){
            return this.nextPos.y+this.size.y/2;
        }
        get bottom(){
            return this.pos.y-this.size.y/2;
        }
        get bottom(){
            return this.nextPos.y-this.size.y/2;
        }
        get left(){
            return this.pos.x-this.size.x/2;
        }
        get nextLeft(){
            return this.nextPos.x-this.size.x/2;
        }
        get right(){
            return this.pos.x+this.size.x/2;
        }
        get nextRight(){
            return this.pos.x+this.size.x/2;
        }
    }
    return Player;
})();